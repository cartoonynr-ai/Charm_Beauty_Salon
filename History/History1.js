const status = localStorage.getItem('status_booking_1');
const td = document.getElementById('status_booking_1');

if(status === 'cancelled') {
  td.textContent = 'ยกเลิกแล้ว';
  td.className = 'py-5 px-6 text-center border-r border-gray-200 font-semibold text-red-500';
} else {
  td.textContent = 'จองคิวสำเร็จ';
  td.className = 'py-5 px-6 text-center border-r border-gray-200 font-semibold text-blue-600';
}
