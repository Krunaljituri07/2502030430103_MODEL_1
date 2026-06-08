const ADMIN_API_BASE = window.location.origin;

function setAdminMsg(text, type = 'success') {
  const msg = document.getElementById('adminMsg');
  if (!msg) return;
  msg.textContent = text;
  msg.className = `admin-notice ${type}`;
}

function statusPill(status) {
  return `<span class="status-pill status-${status}">${status}</span>`;
}

function money(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

async function createCar(event) {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);

  try {
    const res = await fetch(`${ADMIN_API_BASE}/api/cars`, {
      method: 'POST',
      body: data,
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.error || 'Unable to add vehicle.');
    setAdminMsg(`${body.brand} ${body.model} saved in database.`, 'success');
    form.reset();
    await loadAdminDashboard();
  } catch (error) {
    setAdminMsg(error.message, 'error');
  }
}

async function updateCarStatus(id, status) {
  const res = await fetch(`${ADMIN_API_BASE}/api/cars/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const body = await res.json();
    setAdminMsg(body.error || 'Status update failed.', 'error');
    return;
  }
  setAdminMsg('Inventory status updated.', 'success');
  await loadAdminDashboard();
}

async function deleteCar(id) {
  if (!confirm('Remove this vehicle from database?')) return;
  const res = await fetch(`${ADMIN_API_BASE}/api/cars/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const body = await res.json();
    setAdminMsg(body.error || 'Delete failed.', 'error');
    return;
  }
  setAdminMsg('Vehicle removed from database.', 'success');
  await loadAdminDashboard();
}

function renderStats(summary) {
  const target = document.getElementById('adminStats');
  if (!target) return;
  const items = [
    ['Total Cars', summary.totalCars],
    ['Available / Left', summary.availableCars],
    ['On Rent', summary.rentedCars],
    ['Bought / Sold', summary.soldCars],
    ['Users', summary.users],
    ['Orders', summary.orders],
  ];
  target.innerHTML = items.map(([label, value]) => `<div class="admin-stat"><strong>${value || 0}</strong><span>${label}</span></div>`).join('');
}

function renderCars(cars) {
  const target = document.getElementById('adminCars');
  if (!target) return;
  target.innerHTML = `
    <table>
      <thead><tr><th>Vehicle</th><th>Category</th><th>Sale</th><th>Rent / Day</th><th>Status</th><th>Update</th><th>Action</th></tr></thead>
      <tbody>
        ${cars.map(car => `
          <tr>
            <td>${car.brand} ${car.model}</td>
            <td>${car.category || '-'}</td>
            <td>${money(car.price)}</td>
            <td>${money(car.rentalPrice)}</td>
            <td>${statusPill(car.status || 'available')}</td>
            <td>
              <select class="mini-select" onchange="updateCarStatus('${car._id}', this.value)">
                ${['available', 'rented', 'sold', 'maintenance'].map(status => `<option value="${status}" ${status === car.status ? 'selected' : ''}>${status}</option>`).join('')}
              </select>
            </td>
            <td><button class="btn-o" type="button" onclick="deleteCar('${car._id}')">Delete</button></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderOrders(orders) {
  const target = document.getElementById('adminOrders');
  if (!target) return;
  target.innerHTML = `
    <table>
      <thead><tr><th>Order</th><th>Customer</th><th>Type</th><th>Cars</th><th>Total</th><th>Status</th></tr></thead>
      <tbody>
        ${orders.map(order => `
          <tr>
            <td>SOL-${String(order._id).slice(-6).toUpperCase()}</td>
            <td>${order.customer?.name || '-'}<br>${order.customer?.email || ''}</td>
            <td>${order.orderType || '-'}</td>
            <td>${(order.items || []).map(item => `${item.brand} ${item.model}`).join(', ')}</td>
            <td>${money(order.total)}</td>
            <td>${statusPill(order.status || 'pending')}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderUsers(users) {
  const target = document.getElementById('adminUsers');
  if (!target) return;
  target.innerHTML = `
    <table>
      <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Joined</th></tr></thead>
      <tbody>
        ${users.map(user => `
          <tr>
            <td>${user.name || '-'}</td>
            <td>${user.email || '-'}</td>
            <td>${user.phone || '-'}</td>
            <td>${user.role || 'client'}</td>
            <td>${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

async function loadAdminDashboard() {
  try {
    const [summaryRes, carsRes, ordersRes, usersRes] = await Promise.all([
      fetch(`${ADMIN_API_BASE}/api/admin/summary`),
      fetch(`${ADMIN_API_BASE}/api/cars`),
      fetch(`${ADMIN_API_BASE}/api/orders`),
      fetch(`${ADMIN_API_BASE}/api/users`),
    ]);
    if (!summaryRes.ok || !carsRes.ok || !ordersRes.ok || !usersRes.ok) throw new Error('Unable to load admin database data.');
    renderStats(await summaryRes.json());
    renderCars(await carsRes.json());
    renderOrders(await ordersRes.json());
    renderUsers(await usersRes.json());
  } catch (error) {
    setAdminMsg(`${error.message} Start the server and MongoDB first.`, 'error');
  }
}

document.addEventListener('DOMContentLoaded', loadAdminDashboard);
