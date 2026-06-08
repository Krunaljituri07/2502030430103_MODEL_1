const API_BASE = window.location.origin;

let solaraCars = [];
let currentFilter = 'all';
let visibleCount = 6;
let cart = JSON.parse(localStorage.getItem('solara_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('solara_wishlist') || '[]');
let checkoutStep = 0;
let selectedPurchaseType = 'buy';
let selectedPayMethod = 'card';

const fallbackFeatures = [
  'Premium concierge support',
  'Verified service history',
  'Luxury delivery experience',
  'Flexible purchase and rental options',
];

function money(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function carTitle(car) {
  return `${car.brand || ''} ${car.model || ''}`.trim();
}

function getCarId(car) {
  return car._id || car.id;
}

function imageSrc(image) {
  if (!image) return '';
  const uploadIndex = image.indexOf('/uploads/');
  return uploadIndex >= 0 ? image.slice(uploadIndex) : image;
}

function showNotif(text) {
  const notif = document.getElementById('notif');
  const txt = document.getElementById('notifTxt');
  if (!notif || !txt) return;
  txt.textContent = text;
  notif.classList.add('show');
  window.clearTimeout(showNotif.timer);
  showNotif.timer = window.setTimeout(() => notif.classList.remove('show'), 3200);
}

function toggleMob() {
  document.getElementById('mobMenu')?.classList.toggle('open');
}

function closeMob() {
  document.getElementById('mobMenu')?.classList.remove('open');
}

function saveCart() {
  localStorage.setItem('solara_cart', JSON.stringify(cart));
}

function saveWishlist() {
  localStorage.setItem('solara_wishlist', JSON.stringify(wishlist));
}

function cartAmount(item) {
  const car = solaraCars.find(c => getCarId(c) === item.carId) || item;
  return item.type === 'rent' ? Number(car.rentalPrice || item.rentalPrice || 0) : Number(car.price || item.price || 0);
}

function updateCart() {
  const badge = document.getElementById('cartBadge');
  const list = document.getElementById('cartItems');
  const foot = document.getElementById('cartFoot');
  const subtotal = document.getElementById('cartSubtotal');
  const total = document.getElementById('cartTotal');
  if (badge) badge.textContent = cart.length;
  if (!list) return;

  if (!cart.length) {
    list.innerHTML = '<div class="cart-empty">Your selection is empty.</div>';
    if (foot) foot.style.display = 'none';
  } else {
    list.innerHTML = cart.map(item => `
      <div class="ci">
        <img class="ci-img" src="${imageSrc(item.image)}" alt="${carTitle(item)}">
        <div class="ci-info">
          <div class="ci-brand">${item.brand || ''}</div>
          <div class="ci-name">${item.model || ''}</div>
          <div class="ci-meta">${item.type === 'rent' ? 'Rental' : 'Purchase'} · <span class="ci-price">${money(cartAmount(item))}</span></div>
        </div>
        <button class="ci-rm" onclick="removeFromCart('${item.carId}','${item.type}')">x</button>
      </div>
    `).join('');
    if (foot) foot.style.display = 'grid';
  }

  const sum = cart.reduce((acc, item) => acc + cartAmount(item), 0);
  if (subtotal) subtotal.textContent = money(sum);
  if (total) total.textContent = money(sum);
}

function addToCart(carId, type = 'buy') {
  const car = solaraCars.find(item => getCarId(item) === carId);
  if (!car) return;
  if (car.status !== 'available') {
    showNotif(`${carTitle(car)} is currently ${car.status}.`);
    return;
  }
  if (cart.some(item => item.carId === carId && item.type === type)) {
    showNotif('This vehicle is already in your selection.');
    return;
  }
  cart.push({
    carId,
    type,
    brand: car.brand,
    model: car.model,
    image: imageSrc(car.image),
    price: car.price,
    rentalPrice: car.rentalPrice,
  });
  saveCart();
  updateCart();
  showNotif(type === 'rent' ? 'Rental added to your selection.' : 'Vehicle added to cart.');
}

function removeFromCart(carId, type) {
  cart = cart.filter(item => !(item.carId === carId && item.type === type));
  saveCart();
  updateCart();
}

function clearCart() {
  cart = [];
  saveCart();
  updateCart();
}

function openCart() {
  document.getElementById('cart-overlay')?.classList.add('show');
  document.getElementById('cart-side')?.classList.add('open');
}

function closeCart() {
  document.getElementById('cart-overlay')?.classList.remove('show');
  document.getElementById('cart-side')?.classList.remove('open');
}

function toggleWish(carId) {
  wishlist = wishlist.includes(carId) ? wishlist.filter(id => id !== carId) : [...wishlist, carId];
  saveWishlist();
  renderFleet();
}

function renderFleet() {
  const grid = document.getElementById('fleetGrid');
  if (!grid) return;
  const filtered = currentFilter === 'all' ? solaraCars : solaraCars.filter(car => car.category === currentFilter);
  const visible = filtered.slice(0, visibleCount);

  if (!visible.length) {
    grid.innerHTML = '<div class="cart-empty">No vehicles found. Add cars from the admin dashboard.</div>';
    return;
  }

  grid.innerHTML = visible.map(car => {
    const id = getCarId(car);
    return `
      <article class="ccard">
        <div class="cimg">
          <img src="${imageSrc(car.image)}" alt="${carTitle(car)}">
          <span class="cbadge ${car.featured ? 'rare' : ''}">${car.status || 'available'}</span>
          <div class="cov">
            <button class="cov-btn buy" onclick="addToCart('${id}','buy')">Buy</button>
            <button class="cov-btn rent" onclick="addToCart('${id}','rent')">Rent</button>
            <button class="cov-btn wish" onclick="openCarModal('${id}')">View</button>
          </div>
        </div>
        <div class="cinfo">
          <div class="cbrand">${car.brand || ''}</div>
          <div class="cname">${car.model || ''}</div>
          <div class="cspecs">
            <div><span class="csv">${car.power || '-'}</span><span class="csk">Power</span></div>
            <div><span class="csv">${car.maxSpeed || '-'}</span><span class="csk">Speed</span></div>
            <div><span class="csv">${car.acceleration || '-'}</span><span class="csk">0-100</span></div>
          </div>
          <div class="cfoot">
            <div>
              <div class="cbrand">From ${money(car.rentalPrice)} / day</div>
              <div class="rprice">${money(car.price)}</div>
            </div>
            <button class="wbtn ${wishlist.includes(id) ? 'on' : ''}" onclick="toggleWish('${id}')">♥</button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function renderRentals() {
  const grid = document.getElementById('rentalGrid');
  if (!grid) return;
  const rentable = solaraCars.filter(car => car.status === 'available').slice(0, 6);
  grid.innerHTML = rentable.map(car => {
    const id = getCarId(car);
    return `
      <article class="rcard">
        <img src="${imageSrc(car.image)}" alt="${carTitle(car)}">
        <div class="rinfo">
          <div class="cbrand">${car.category || 'Luxury Rental'}</div>
          <div class="cname">${carTitle(car)}</div>
          <p class="s-sub">${car.rentalNotes || car.description || 'Available for premium rental with SOLARA concierge support.'}</p>
          <div class="rprice">${money(car.rentalPrice)}<span class="rday"> / day</span></div>
          <button class="rbtn" onclick="addToCart('${id}','rent')">Request Rental</button>
        </div>
      </article>
    `;
  }).join('') || '<div class="cart-empty">No rental vehicles are available right now.</div>';
}

function openCarModal(carId) {
  const car = solaraCars.find(item => getCarId(item) === carId);
  if (!car) return;
  document.getElementById('cmImg').src = imageSrc(car.image);
  document.getElementById('cmBrand').textContent = car.brand || '';
  document.getElementById('cmName').textContent = car.model || '';
  document.getElementById('cmDesc').textContent = car.description || 'A carefully selected SOLARA luxury vehicle ready for purchase or rental.';
  document.getElementById('cmSpecs').innerHTML = [
    ['Power', car.power],
    ['Top Speed', car.maxSpeed],
    ['0-100', car.acceleration],
    ['Seats', car.seats],
  ].map(([label, value]) => `<div class="cm-spec"><span class="cm-sv">${value || '-'}</span><span class="cm-sk">${label}</span></div>`).join('');
  document.getElementById('cmFeatures').innerHTML = fallbackFeatures.map(item => `<li>${item}</li>`).join('');
  document.getElementById('cmPrice').textContent = money(car.price);
  document.getElementById('cmRental').textContent = money(car.rentalPrice);
  document.getElementById('cmBuyBtn').onclick = () => addToCart(carId, 'buy');
  document.getElementById('cmRentBtn').onclick = () => addToCart(carId, 'rent');
  document.getElementById('cmWishBtn').onclick = () => toggleWish(carId);
  document.getElementById('car-modal')?.classList.add('open');
}

function closeCarModal() {
  document.getElementById('car-modal')?.classList.remove('open');
}

function startCheckout() {
  if (!cart.length) {
    showNotif('Add a vehicle before checkout.');
    return;
  }
  checkoutStep = 0;
  renderCheckout();
  document.getElementById('chk-modal')?.classList.add('open');
}

function closeCheckout() {
  document.getElementById('chk-modal')?.classList.remove('open');
}

function selectPurchaseType(type, btn) {
  selectedPurchaseType = type;
  document.querySelectorAll('.buy-opt-tabs .boTab').forEach(item => item.classList.remove('on'));
  btn?.classList.add('on');
  renderBuyOptions();
}

function selectPayMethod(type, btn) {
  selectedPayMethod = type;
  document.querySelectorAll('.chk-grid3 .boTab').forEach(item => item.classList.remove('on'));
  btn?.classList.add('on');
}

function renderBuyOptions() {
  const el = document.getElementById('buyOpts');
  if (!el) return;
  const labels = {
    buy: ['Full Purchase', 'Reserve the selected vehicle for purchase.'],
    finance: ['Finance', 'SOLARA concierge will confirm finance details.'],
    lease: ['Lease', 'A luxury lease specialist will contact you.'],
  };
  const [name, desc] = labels[selectedPurchaseType] || labels.buy;
  el.innerHTML = `<div class="bopt on"><span class="bopt-radio"></span><div><div class="bopt-name">${name}</div><div class="bopt-desc">${desc}</div></div><div class="bopt-price">${money(cart.reduce((sum, item) => sum + cartAmount(item), 0))}</div></div>`;
}

function renderCheckout() {
  document.querySelectorAll('.chk-panel').forEach((panel, index) => panel.classList.toggle('active', index === checkoutStep));
  document.querySelectorAll('.chk-step').forEach((step, index) => {
    step.classList.toggle('active', index === checkoutStep);
    step.classList.toggle('done', index < checkoutStep);
  });

  const orderItems = document.getElementById('chkOrderItems');
  if (orderItems) {
    orderItems.innerHTML = cart.map(item => `
      <div class="chk-item-row">
        <img class="chk-item-img" src="${imageSrc(item.image)}" alt="${carTitle(item)}">
        <div class="chk-item-info">
          <div class="chk-item-name">${item.brand} ${item.model}</div>
          <div class="chk-item-meta">${item.type === 'rent' ? 'Rental' : 'Purchase'}</div>
        </div>
        <div class="chk-item-price">${money(cartAmount(item))}</div>
      </div>
    `).join('');
  }

  renderBuyOptions();
  renderPaymentForm();
  renderReview();
}

function renderPaymentForm() {
  const user = JSON.parse(localStorage.getItem('solara_user') || 'null');
  const el = document.getElementById('payMethodContent');
  if (!el) return;
  el.innerHTML = `
    <div class="chk-sec">
      <div class="chk-sec-t">Customer Information</div>
      <div class="chk-grid2">
        <div class="fg"><label>Name</label><input id="checkoutName" value="${user?.name || ''}" required></div>
        <div class="fg"><label>Email</label><input id="checkoutEmail" type="email" value="${user?.email || ''}" required></div>
      </div>
      <div class="fg"><label>Phone</label><input id="checkoutPhone" value="${user?.phone || ''}" placeholder="+91 98765 43210"></div>
    </div>
  `;
}

function renderReview() {
  const review = document.getElementById('chkReview');
  if (!review) return;
  review.innerHTML = `
    <div class="chk-item-row">
      <div class="chk-item-info">
        <div class="chk-item-name">${cart.length} selected vehicle${cart.length > 1 ? 's' : ''}</div>
        <div class="chk-item-meta">${selectedPurchaseType.toUpperCase()} · ${selectedPayMethod.toUpperCase()}</div>
      </div>
      <div class="chk-item-price">${money(cart.reduce((sum, item) => sum + cartAmount(item), 0))}</div>
    </div>
  `;
}

function chkNext() {
  if (checkoutStep < 2) {
    checkoutStep += 1;
    renderCheckout();
  }
}

function chkBack() {
  if (checkoutStep > 0) {
    checkoutStep -= 1;
    renderCheckout();
  }
}

async function placeOrder() {
  const user = JSON.parse(localStorage.getItem('solara_user') || 'null');
  const customer = {
    name: document.getElementById('checkoutName')?.value || user?.name || 'Guest',
    email: document.getElementById('checkoutEmail')?.value || user?.email || '',
    phone: document.getElementById('checkoutPhone')?.value || user?.phone || '',
  };
  if (!customer.email) {
    showNotif('Please enter customer email before placing the order.');
    checkoutStep = 1;
    renderCheckout();
    return;
  }

  const items = cart.map(item => ({
    carId: item.carId,
    type: item.type === 'rent' ? 'rent' : selectedPurchaseType,
  }));

  try {
    const res = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer, userId: user?.id, items, paymentMethod: selectedPayMethod }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Order failed.');
    document.getElementById('orderRef').textContent = `SOL-${String(data._id).slice(-6).toUpperCase()}`;
    checkoutStep = 3;
    renderCheckout();
    clearCart();
    await loadCars();
  } catch (error) {
    showNotif(error.message);
  }
}

function loadMore() {
  visibleCount += 6;
  renderFleet();
}

async function loadCars() {
  const res = await fetch(`${API_BASE}/api/cars`);
  solaraCars = await res.json();
  renderFleet();
  renderRentals();
}

function initFilters() {
  document.querySelectorAll('.ftab').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.ftab').forEach(item => item.classList.remove('on'));
      button.classList.add('on');
      currentFilter = button.dataset.f || 'all';
      visibleCount = 6;
      renderFleet();
    });
  });
}

function initReveal() {
  const els = document.querySelectorAll('.rv');
  if (!els.length || !('IntersectionObserver' in window)) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('vis');
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => document.getElementById('loader')?.classList.add('out'), 900);
  window.addEventListener('scroll', () => document.getElementById('nav')?.classList.toggle('scrolled', window.scrollY > 60), { passive: true });
  initFilters();
  initReveal();
  updateCart();
  loadCars().catch(() => {
    showNotif('Start the SOLARA server and MongoDB to load cars.');
  });
});
