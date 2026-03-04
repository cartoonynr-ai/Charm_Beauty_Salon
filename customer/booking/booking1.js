// ===== CALENDAR =====
const thMonths = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน',
                  'กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];

const today = new Date();
today.setHours(0, 0, 0, 0);

let calYear  = today.getFullYear();
let calMonth = today.getMonth();
let selectedDate = null;

function toggleCalendar() {
  document.getElementById('calendarPopup').classList.toggle('hidden');
}

function closeCalendar() {
  document.getElementById('calendarPopup').classList.add('hidden');
}

document.addEventListener('click', e => {
  const popup = document.getElementById('calendarPopup');
  const btn   = document.getElementById('dateDisplay');
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

    el.className  = cls;
    el.textContent = d;

    if (!isPast) {
      el.onclick = () => {
        selectedDate = new Date(calYear, calMonth, d);
        const label     = `${d} ${thMonths[calMonth]} ${calYear + 543}`;
        const dateLabel = document.getElementById('dateLabel');
        dateLabel.textContent = label;
        dateLabel.classList.remove('text-gray-500');
        dateLabel.classList.add('text-gray-800');
        renderCalendar();
        closeCalendar();
      };
    }
    grid.appendChild(el);
  }
}

// ===== SERVICE OPTIONS =====
const service   = document.getElementById('service');
const sections  = { nail, hair, makeup };
const attachBtn = document.getElementById('attachBtn');

service.onchange = () => {
  Object.values(sections).forEach(s => s.classList.add('hidden'));
  attachBtn.disabled  = true;
  attachBtn.className = "px-8 py-2 rounded-full bg-gray-200 border font-semibold cursor-not-allowed";
  if (sections[service.value]) sections[service.value].classList.remove('hidden');
};

document.addEventListener('change', e => {
  if (e.target.name === 'opt') {
    const enable        = e.target.value === 'other';
    attachBtn.disabled  = !enable;
    attachBtn.className = enable
      ? "px-8 py-2 rounded-full bg-pink-200 border font-semibold"
      : "px-8 py-2 rounded-full bg-gray-200 border font-semibold cursor-not-allowed";
  }
});

// ===== INIT =====
renderCalendar();