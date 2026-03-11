// ===== Cancel.js =====
const params    = new URLSearchParams(window.location.search);
const bookingId = parseInt(params.get('id')) || 0;

// โหลดข้อมูลการจองที่เลือก แสดงในหน้า
window.addEventListener('DOMContentLoaded', () => {
  if (!bookingId) return;
  let bookings = [];
  try { bookings = JSON.parse(localStorage.getItem('charm_bookings') || '[]'); } catch(e) {}

  const booking = bookings.find(b => b.id === bookingId);
  if (!booking) return;

  const dateEl    = document.getElementById('cancel-date');
  const timeEl    = document.getElementById('cancel-time');
  const serviceEl = document.getElementById('cancel-service');
  const priceEl   = document.getElementById('cancel-price');

  if (dateEl)    dateEl.value    = booking.date    || '';
  if (timeEl)    timeEl.value    = booking.time    || '';
  if (serviceEl) serviceEl.textContent = (booking.service || '') + (booking.option ? ' - ' + booking.option : '');
  if (priceEl)   priceEl.textContent   = booking.price || '';
});

function handleCancel() {
  document.getElementById('confirmModal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('confirmModal').classList.add('hidden');
}

function confirmCancel() {
  closeModal();

  // ✅ อัปเดต status ใน charm_bookings
  let bookings = [];
  try { bookings = JSON.parse(localStorage.getItem('charm_bookings') || '[]'); } catch(e) {}
  bookings = bookings.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b);
  localStorage.setItem('charm_bookings', JSON.stringify(bookings));

  // อัปเดต UI
  const badge  = document.getElementById('statusBadge');
  const btnEl  = document.getElementById('cancelBtn');
  if (badge) {
    badge.textContent = 'ยกเลิกแล้ว';
    badge.className   = 'px-4 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-600';
  }
  if (btnEl) btnEl.style.display = 'none';

  setTimeout(() => {
    window.location.href = '/History/Cancel 2.html';
  }, 600);
}