/* ============================================================
   ROYAL FEAST — Main JavaScript
   ============================================================ */

$(document).ready(function () {

  /* ---- Loading Screen — hide ASAP once DOM is ready ---- */
  // Use requestAnimationFrame so first paint fires before we even start the timer
  requestAnimationFrame(function () {
    setTimeout(function () {
      var ls = $('.loading-screen');
      ls.addClass('hidden');
      setTimeout(() => ls.remove(), 350); // match the shortened CSS transition
    }, 350); // just long enough to show the brand, feel instant
  });

  /* ---- Sticky Navbar — throttled via rAF for 60fps smoothness ---- */
  var scrollTicking = false;
  window.addEventListener('scroll', function () {
    if (!scrollTicking) {
      requestAnimationFrame(function () {
        var st = window.pageYOffset || document.documentElement.scrollTop;
        if (st > 60) {
          $('.royal-navbar').addClass('scrolled');
          $('.scroll-top-btn').addClass('show');
        } else {
          $('.royal-navbar').removeClass('scrolled');
          $('.scroll-top-btn').removeClass('show');
        }
        revealOnScroll();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  /* ---- Scroll To Top ---- */
  $('.scroll-top-btn').on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 600);
  });

  /* ---- Active Nav Link ---- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  $('.royal-nav-link').each(function () {
    const href = $(this).attr('href');
    if (href && href.includes(currentPage)) {
      $(this).addClass('active');
    }
  });

  /* ---- Floating Particles Canvas — skip on mobile for performance ---- */
  const canvas = document.getElementById('particles-canvas');
  if (canvas && window.innerWidth > 768) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    for (let i = 0; i < 40; i++) {   // reduced from 70 → 40
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.3,
        dx: (Math.random() - 0.5) * 0.3,
        dy: -Math.random() * 0.4 - 0.1,
        opacity: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.5 ? '255,215,0' : '192,192,192'
      });
    }

    let rafId;
    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.opacity})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.y < -5) { p.y = canvas.height + 5; p.x = Math.random() * canvas.width; }
        if (p.x < -5) p.x = canvas.width + 5;
        if (p.x > canvas.width + 5) p.x = -5;
      }
      rafId = requestAnimationFrame(drawParticles);
    }
    drawParticles();

    // Pause particles when tab is hidden to save resources
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) cancelAnimationFrame(rafId);
      else drawParticles();
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }, 200);
    }, { passive: true });
  } else if (canvas) {
    canvas.style.display = 'none'; // hide canvas entirely on mobile
  }

  /* ---- Scroll Reveal — IntersectionObserver (zero scroll-event cost) ---- */
  function revealOnScroll() { /* kept as no-op; real work done by observer below */ }

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target); // fire once, then stop watching
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.fade-in-up').forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback for older browsers
    document.querySelectorAll('.fade-in-up').forEach(el => el.classList.add('visible'));
  }

  /* ---- Animated Counters — IntersectionObserver ---- */
  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    const counterObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        counterObserver.disconnect();
        $('.stat-number[data-target]').each(function () {
          const $el = $(this);
          const target = parseInt($el.data('target'));
          const suffix = $el.data('suffix') || '';
          $({ val: 0 }).animate({ val: target }, {
            duration: 1600,
            easing: 'swing',
            step: function () { $el.text(Math.floor(this.val) + suffix); },
            complete: function () { $el.text(target + suffix); }
          });
        });
      }
    }, { threshold: 0.3 });
    counterObserver.observe(statsSection);
  }

  /* ---- Menu Filter Tabs ---- */
  $(document).on('click', '.filter-tab', function () {
    $('.filter-tab').removeClass('active');
    $(this).addClass('active');
    const filter = $(this).data('filter');
    if (filter === 'all') {
      $('.food-card-wrap').fadeIn(300);
    } else {
      $('.food-card-wrap').hide();
      $(`.food-card-wrap[data-category="${filter}"]`).fadeIn(300);
    }
  });

  /* ---- Cart System ---- */
  let cart = JSON.parse(localStorage.getItem('royalCart') || '[]');

  function saveCart() {
    localStorage.setItem('royalCart', JSON.stringify(cart));
    updateCartBadge();
  }

  function updateCartBadge() {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const badge = $('.cart-badge');
    if (totalQty > 0) {
      badge.text(totalQty).show();
    } else {
      badge.hide();
    }
  }

  function showToast(message, icon = 'fa-crown') {
    const toast = $(`<div class="royal-toast"><i class="fas ${icon}"></i> ${message}</div>`);
    $('.toast-container-royal').append(toast);
    setTimeout(() => toast.fadeOut(400, () => toast.remove()), 2800);
  }

  $(document).on('click', '.btn-add-cart', function () {
    const card = $(this).closest('.food-card');
    const name = card.find('.food-name').text();
    const priceText = card.find('.food-price').text().replace(/[^\d]/g, '');
    const price = parseInt(priceText);
    const img = card.find('img').attr('src');

    const existing = cart.find(i => i.name === name);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ name, price, img, qty: 1 });
    }
    saveCart();
    showToast(`${name} added to your royal cart!`, 'fa-check-circle');

    // Animate button
    const btn = $(this);
    btn.text('✓ Added').css({ background: 'var(--gold)', color: 'var(--black)' });
    setTimeout(() => btn.text('Add To Cart').css({ background: '', color: '' }), 1200);
  });

  /* ---- Render Cart Page ---- */
  if ($('.cart-section').length) {
    renderCart();
  }

  function renderCart() {
    const container = $('#cart-items-container');
    if (!container.length) return;
    container.empty();

    if (cart.length === 0) {
      container.html(`
        <div class="text-center py-5">
          <i class="fas fa-shopping-cart" style="font-size:3rem;color:var(--gold);opacity:0.3;"></i>
          <p class="mt-3" style="font-family:var(--font-heading);color:var(--silver);letter-spacing:0.1em;">Your royal cart is empty</p>
          <a href="../index.html" class="btn-royal-gold mt-3" style="display:inline-block;">Browse Our Menu</a>
        </div>
      `);
      updateCartTotal();
      return;
    }

    cart.forEach((item, idx) => {
      container.append(`
        <div class="cart-item" data-idx="${idx}">
          <img src="${item.img}" class="cart-item-img" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80'">
          <div class="flex-grow-1">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">₹${item.price}</div>
          </div>
          <div class="d-flex align-items-center gap-2">
            <button class="qty-btn qty-dec" data-idx="${idx}">−</button>
            <span class="qty-display">${item.qty}</span>
            <button class="qty-btn qty-inc" data-idx="${idx}">+</button>
          </div>
          <div class="ms-2 text-end" style="min-width:80px;font-family:var(--font-heading);color:var(--silver-light);font-size:0.9rem;">₹${item.price * item.qty}</div>
          <button class="btn-remove ms-2" data-idx="${idx}"><i class="fas fa-times"></i></button>
        </div>
      `);
    });
    updateCartTotal();
  }

  function updateCartTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const delivery = subtotal > 0 ? 49 : 0;
    const tax = Math.round(subtotal * 0.05);
    const grand = subtotal + delivery + tax;
    $('#subtotal').text(`₹${subtotal}`);
    $('#delivery-fee').text(subtotal > 0 ? `₹${delivery}` : 'Free');
    $('#tax-amt').text(`₹${tax}`);
    $('#grand-total').text(`₹${grand}`);
  }

  $(document).on('click', '.qty-inc', function () {
    const idx = $(this).data('idx');
    cart[idx].qty++;
    saveCart();
    renderCart();
  });
  $(document).on('click', '.qty-dec', function () {
    const idx = $(this).data('idx');
    if (cart[idx].qty > 1) { cart[idx].qty--; }
    else { cart.splice(idx, 1); }
    saveCart();
    renderCart();
  });
  $(document).on('click', '.btn-remove', function () {
    const idx = $(this).data('idx');
    const name = cart[idx].name;
    cart.splice(idx, 1);
    saveCart();
    renderCart();
    showToast(`${name} removed from cart`, 'fa-trash');
  });

  $(document).on('click', '#checkout-btn', function () {
    if (cart.length === 0) { showToast('Your cart is empty!', 'fa-exclamation-circle'); return; }
    showToast('🎉 Order placed successfully! Your royal feast is on the way!', 'fa-check-circle');
    cart = [];
    saveCart();
    setTimeout(() => renderCart(), 500);
  });

  updateCartBadge();

  /* ---- Order Now Modal ---- */
  $(document).on('click', '.order-now-modal-btn', function () {
    const name = $(this).data('item') || '';
    const price = $(this).data('price') || '';
    if (name) {
      $('#modal-item-name').val(name);
      $('#modal-item-price').text(price ? `₹${price}` : '');
    }
    $('#orderModal').modal('show');
  });

  $(document).on('click', '#confirm-order-btn', function () {
    const name = $('#modal-customer-name').val().trim();
    const phone = $('#modal-customer-phone').val().trim();
    if (!name || !phone) {
      showToast('Please fill in all details', 'fa-exclamation-circle');
      return;
    }
    $('#orderModal').modal('hide');
    showToast(`Order confirmed for ${name}! Royal feast incoming! 👑`, 'fa-crown');
    $('#modal-customer-name, #modal-customer-phone').val('');
  });

  /* ---- Contact Form ---- */
  $(document).on('submit', '#contact-form', function (e) {
    e.preventDefault();
    showToast('Message sent! We will contact you shortly. 👑', 'fa-envelope');
    this.reset();
  });

  /* ---- Login Form Validation ---- */
  $(document).on('submit', '#login-form', function (e) {
    e.preventDefault();
    const user = $('#login-username').val().trim();
    const pass = $('#login-password').val();
    let valid = true;

    if (user.length < 3) {
      showValidation('#username-msg', 'error', 'Username must be at least 3 characters');
      valid = false;
    } else {
      showValidation('#username-msg', 'success', '✓ Valid');
    }

    if (!isValidPassword(pass)) {
      showValidation('#password-msg', 'error', 'Invalid password');
      valid = false;
    } else {
      showValidation('#password-msg', 'success', '✓ Valid');
    }

    if (valid) {
      showToast('Welcome back to Royal Feast! 👑', 'fa-crown');
      setTimeout(() => window.location.href = '../index.html', 1200);
    }
  });

  /* ---- Register Form Validation ---- */
  $(document).on('input', '#reg-password', function () {
    const pass = $(this).val();
    updatePasswordStrength(pass);
  });

  $(document).on('submit', '#register-form', function (e) {
    e.preventDefault();
    const user = $('#reg-username').val().trim();
    const email = $('#reg-email').val().trim();
    const pass = $('#reg-password').val();
    const confirm = $('#reg-confirm-password').val();
    const dob = $('#reg-dob').val();
    const pdfFile = $('#reg-pdf')[0].files[0];
    let valid = true;

    // Username
    if (user.length < 3) { showValidation('#reg-username-msg', 'error', 'Minimum 3 characters required'); valid = false; }
    else { showValidation('#reg-username-msg', 'success', '✓ Valid'); }

    // Email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showValidation('#reg-email-msg', 'error', 'Enter a valid email'); valid = false; }
    else { showValidation('#reg-email-msg', 'success', '✓ Valid'); }

    // Password
    if (!isValidPassword(pass)) { showValidation('#reg-pass-msg', 'error', 'Must have uppercase, number, special char & 8+ chars'); valid = false; }
    else { showValidation('#reg-pass-msg', 'success', '✓ Strong password'); }

    // Confirm
    if (pass !== confirm) { showValidation('#reg-confirm-msg', 'error', 'Passwords do not match'); valid = false; }
    else if (confirm) { showValidation('#reg-confirm-msg', 'success', '✓ Passwords match'); }

    // DOB
    if (!dob) { showValidation('#reg-dob-msg', 'error', 'Date of birth required'); valid = false; }
    else { showValidation('#reg-dob-msg', 'success', '✓ Valid'); }

    // PDF
    if (!pdfFile) { showValidation('#reg-pdf-msg', 'error', 'Please upload a PDF document'); valid = false; }
    else if (pdfFile.type !== 'application/pdf') { showValidation('#reg-pdf-msg', 'error', 'Only PDF files allowed (not JPG/PNG)'); valid = false; }
    else if (pdfFile.size === 0) { showValidation('#reg-pdf-msg', 'error', 'File is empty'); valid = false; }
    else { showValidation('#reg-pdf-msg', 'success', `✓ ${pdfFile.name}`); }

    if (valid) {
      showToast('Account created! Welcome to Royal Feast! 👑', 'fa-crown');
      setTimeout(() => window.location.href = 'login.html', 1500);
    }
  });

  /* ---- PDF Upload Zone ---- */
  $(document).on('change', '#reg-pdf', function () {
    const file = this.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        showValidation('#reg-pdf-msg', 'error', 'Only PDF files allowed. Rejected: ' + file.name);
        $(this).val('');
        $('#upload-zone-text').text('Upload PDF Document');
        return;
      }
      if (file.size === 0) {
        showValidation('#reg-pdf-msg', 'error', 'File is empty');
        return;
      }
      $('#upload-zone-text').text('✓ ' + file.name);
      $('.upload-zone').addClass('active');
      showValidation('#reg-pdf-msg', 'success', '✓ ' + file.name + ' ready');
    }
  });

  $(document).on('dragover', '.upload-zone', function (e) { e.preventDefault(); $(this).addClass('active'); });
  $(document).on('dragleave', '.upload-zone', function () { $(this).removeClass('active'); });
  $(document).on('drop', '.upload-zone', function (e) {
    e.preventDefault();
    const file = e.originalEvent.dataTransfer.files[0];
    if (file) {
      const input = document.getElementById('reg-pdf');
      const dt = new DataTransfer();
      dt.items.add(file);
      input.files = dt.files;
      $(input).trigger('change');
    }
  });
  $(document).on('click', '.upload-zone', function () { $('#reg-pdf').trigger('click'); });

  /* ---- Helper Functions ---- */
  function isValidPassword(pass) {
    return pass.length >= 8 &&
      /[A-Z]/.test(pass) &&
      /[0-9]/.test(pass) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(pass);
  }

  function showValidation(selector, type, message) {
    const el = $(selector);
    el.removeClass('error success').addClass(type).text(message).show();
  }

  function updatePasswordStrength(pass) {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score++;

    const fill = $('#strength-fill');
    const text = $('#strength-text');
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e'];
    const labels = ['Weak', 'Fair', 'Good', 'Strong'];

    fill.css({ width: (score / 4 * 100) + '%', background: colors[score - 1] || '#ef4444' });
    text.text(score > 0 ? labels[score - 1] : '').css('color', colors[score - 1] || '#ef4444');
  }

  /* ---- Gallery Lightbox ---- */
  $(document).on('click', '.gallery-item', function () {
    const src = $(this).find('img').attr('src');
    const label = $(this).find('.gallery-overlay-text').text();
    $('#galleryModal .modal-body img').attr('src', src);
    $('#galleryModal .modal-title').text(label || 'Royal Gallery');
    $('#galleryModal').modal('show');
  });

  /* ---- Smooth scroll for anchor links ---- */
  $(document).on('click', 'a[href^="#"]', function (e) {
    const target = $($(this).attr('href'));
    if (target.length) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: target.offset().top - 80 }, 700);
    }
  });

});