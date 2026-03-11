// ===== booking1.js =====
const thMonths = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน',
                  'กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];

const today = new Date();
today.setHours(0, 0, 0, 0);

let calYear  = today.getFullYear();
let calMonth = today.getMonth();
let selectedDate = null;

// ===== โหลดข้อมูลจาก booking.js =====
window.addEventListener('DOMContentLoaded', () => {
  const savedDate = localStorage.getItem('booking_date');
  const savedDateTh = localStorage.getItem('booking_date_th');
  const savedTime = localStorage.getItem('booking_time');

  if (savedDate) {
    const parts = savedDate.split('-');
    selectedDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    calYear  = selectedDate.getFullYear();
    calMonth = selectedDate.getMonth();
    const dateLabel = document.getElementById('dateLabel');
    if (dateLabel) {
      dateLabel.textContent = savedDateTh;
      dateLabel.classList.remove('text-gray-500');
      dateLabel.classList.add('text-gray-800');
    }
  }

  // โหลดเวลาใส่ select
  if (savedTime) {
    const timeSelect = document.querySelector('select');
    if (timeSelect) {
      [...timeSelect.options].forEach(opt => {
        if (opt.value === savedTime) opt.selected = true;
      });
    }
  }

  renderCalendar();
});

// ===== CALENDAR =====
function toggleCalendar() {
  document.getElementById('calendarPopup').classList.toggle('hidden');
}
function closeCalendar() {
  document.getElementById('calendarPopup').classList.add('hidden');
}
document.addEventListener('click', e => {
  const popup = document.getElementById('calendarPopup');
  const btn   = document.getElementById('dateDisplay');
  if (!popup || !btn) return;
  if (!popup.contains(e.target) && !btn.contains(e.target)) closeCalendar();
});
function prevMonth() {
  calMonth--;
  if (calMonth < 0) { calMonth = 11; calYear--; }
  renderCalendar();
}
function nextMonth() {
  calMonth++;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  renderCalendar();
}
function renderCalendar() {
  document.getElementById('monthLabel').textContent = `${thMonths[calMonth]} ${calYear + 543}`;
  const grid = document.getElementById('daysGrid');
  grid.innerHTML = '';
  const firstDay    = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  for (let i = 0; i < firstDay; i++) {
    const el = document.createElement('div');
    el.className = 'cal-day empty';
    grid.appendChild(el);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const date       = new Date(calYear, calMonth, d);
    const isToday    = date.getTime() === today.getTime();
    const isPast     = date < today;
    const isSelected = selectedDate && selectedDate.getTime() === date.getTime();
    const el = document.createElement('div');
    let cls = 'cal-day';
    if (isPast)          cls += ' disabled';
    else if (isSelected) cls += ' selected' + (isToday ? ' today' : '');
    else if (isToday)    cls += ' today';
    el.className   = cls;
    el.textContent = d;
    if (!isPast) {
      el.onclick = () => {
        selectedDate = new Date(calYear, calMonth, d);
        const label = `${d} ${thMonths[calMonth]} ${calYear + 543}`;
        const dateLabel = document.getElementById('dateLabel');
        dateLabel.textContent = label;
        dateLabel.classList.remove('text-gray-500');
        dateLabel.classList.add('text-gray-800');
        // อัปเดต localStorage
        const y = selectedDate.getFullYear();
        const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const dd = String(selectedDate.getDate()).padStart(2, '0');
        localStorage.setItem('booking_date',    `${y}-${mm}-${dd}`);
        localStorage.setItem('booking_date_th', label);
        renderCalendar();
        closeCalendar();
      };
    }
    grid.appendChild(el);
  }
}

// ===== SERVICE OPTIONS =====
const serviceEl = document.getElementById('service');
const sections  = {
  nail:   document.getElementById('nail'),
  hair:   document.getElementById('hair'),
  makeup: document.getElementById('makeup'),
};
const attachBtn = document.getElementById('attachBtn');

serviceEl.onchange = () => {
  Object.values(sections).forEach(s => { if(s) s.classList.add('hidden'); });
  attachBtn.disabled  = true;
  attachBtn.className = "px-8 py-2 rounded-full bg-gray-200 border font-semibold cursor-not-allowed";
  if (sections[serviceEl.value]) sections[serviceEl.value].classList.remove('hidden');

  // ✅ บันทึกบริการ
  localStorage.setItem('booking_service', serviceEl.value);
  localStorage.setItem('booking_service_name', serviceEl.options[serviceEl.selectedIndex].text);
  localStorage.removeItem('booking_option');
  localStorage.removeItem('booking_option_price');
};

document.addEventListener('change', e => {
  if (e.target.name === 'opt') {
    const enable = e.target.value === 'other';
    attachBtn.disabled  = !enable;
    attachBtn.className = enable
      ? "px-8 py-2 rounded-full bg-pink-200 border font-semibold"
      : "px-8 py-2 rounded-full bg-gray-200 border font-semibold cursor-not-allowed";

    // ✅ บันทึกตัวเลือก + ราคา
    const label = e.target.closest('label');
    if (label) {
      const spans = label.querySelectorAll('span');
      const optName  = spans[0] ? spans[0].textContent.trim() : '';
      const optPrice = spans[1] ? spans[1].textContent.trim() : '';
      localStorage.setItem('booking_option',       optName);
      localStorage.setItem('booking_option_price', optPrice);
    }
  }
});

// ===== ปุ่มยืนยัน — บันทึกเวลาที่เลือกก่อนไป payment =====
document.addEventListener('DOMContentLoaded', () => {
  const confirmLink = document.querySelector('a[href="payment.html"]');
  if (confirmLink) {
    confirmLink.addEventListener('click', e => {
      e.preventDefault();
      const timeSelect = document.querySelector('select');
      if (timeSelect) localStorage.setItem('booking_time', timeSelect.value);
      window.location.href = '/customer/booking/payment.html';
    });
  }
});