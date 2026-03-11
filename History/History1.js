// ===== History1.js =====

document.addEventListener('DOMContentLoaded', function () {

  // ===== โหลดประวัติการจองจาก localStorage =====
  const tbody = document.getElementById('history-tbody');
  if (!tbody) return;

  // ดึงรายการจอง (array)
  let bookings = [];
  try {
    bookings = JSON.parse(localStorage.getItem('charm_bookings') || '[]');
  } catch(e) { bookings = []; }

  // ถ้ายังไม่มีการจองเลย แสดงแถวว่าง
  if (bookings.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="py-10 text-center text-gray-400">ยังไม่มีประวัติการจอง</td>
      </tr>`;
    return;
  }

  tbody.innerHTML = '';

  bookings.forEach((booking, index) => {
    const status   = localStorage.getItem('status_booking_' + booking.id) || booking.status || 'confirmed';
    const statusTh = getStatusTh(status);
    const statusCls = getStatusClass(status);

    // แปลงวันที่ให้เป็น dd/mm/yyyy
    let dateDisplay = booking.date_th || booking.date || '-';

    const tr = document.createElement('tr');
    tr.className = 'hover:bg-pink-50 transition';
    tr.innerHTML = `
      <td class="py-5 px-6 text-center border-r border-gray-200 font-medium">${dateDisplay}</td>
      <td class="py-5 px-6 border-r border-gray-200">${booking.service || '-'} ${booking.option ? '- ' + booking.option : ''}</td>
      <td class="py-5 px-6 text-center border-r border-gray-200 font-semibold ${statusCls}" id="status_booking_${booking.id}">${statusTh}</td>
      <td class="py-5 px-6 text-center">
        ${status === 'confirmed'
          ? `<a href="/History/Cancel.html?id=${booking.id}" class="text-red-500 font-bold hover:underline">คลิก</a>`
          : `<span class="text-gray-400 text-sm">${status === 'cancelled' ? 'ยกเลิกแล้ว' : '-'}</span>`
        }
      </td>
    `;
    tbody.appendChild(tr);
  });

  // แถวว่างเพิ่มเติม
  const emptyTr = document.createElement('tr');
  emptyTr.innerHTML = `
    <td class="py-10 border-r border-gray-200"></td>
    <td class="py-10 border-r border-gray-200"></td>
    <td class="py-10 border-r border-gray-200"></td>
    <td class="py-10"></td>`;
  tbody.appendChild(emptyTr);
});

function getStatusTh(status) {
  const map = {
    'confirmed': 'จองคิวสำเร็จ',
    'cancelled': 'ยกเลิกแล้ว',
    'done':      'เสร็จสิ้นบริการ',
  };
  return map[status] || status;
}

function getStatusClass(status) {
  const map = {
    'confirmed': 'text-blue-600',
    'cancelled': 'text-red-500',
    'done':      'text-green-600',
  };
  return map[status] || '';
}