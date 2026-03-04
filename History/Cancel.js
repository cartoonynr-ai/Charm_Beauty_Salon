const params    = new URLSearchParams(window.location.search);
const bookingId = params.get('id') || 'booking_1';

function handleCancel() {
  document.getElementById('confirmModal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('confirmModal').classList.add('hidden');
}

function confirmCancel() {
  closeModal();
  localStorage.setItem('status_' + bookingId, 'cancelled');
  document.getElementById('statusBadge').textContent = 'ยกเลิกแล้ว';
  document.getElementById('statusBadge').className   = 'px-4 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-600';
  document.getElementById('cancelBtn').style.display = 'none';
  localStorage.setItem('redirect_after', '/customer/History 1/Cancel 2.html');
  setTimeout(() => {
    window.location.href = '/customer/History 1/History1.html';
  }, 500);
}