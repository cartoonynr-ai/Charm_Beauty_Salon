const thMonths = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน',
                  'กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
const times = ["10.00","11.00","12.00","13.00","14.00","15.00","16.00","17.00","18.00"];

const today = new Date();
today.setHours(0, 0, 0, 0);

let calYear  = today.getFullYear();
let calMonth = today.getMonth();
let selectedDate = null;
let selectedTime = null;

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
        const label     = `${d} ${thMonths[calMonth]} ${calYear + 543}`;
        const dateLabel = document.getElementById('dateLabel');
        dateLabel.textContent = label;
        dateLabel.classList.remove('text-gray-500');
        dateLabel.classList.add('text-gray-800');
        renderCalendar();
        closeCalendar();
        selectedTime = null;
        document.querySelectorAll('#timeSlots button').forEach(b => b.classList.remove('ring-4', 'ring-black'));
        updateBookBtn();
      };
    }
    grid.appendChild(el);
  }
}

// ===== TIME SLOTS =====
function renderSlots() {
  const container = document.getElementById('timeSlots');
  container.innerHTML = '';
  times.forEach(time => {
    const btn = document.createElement('button');
    btn.className = "w-full flex justify-between items-center px-6 py-2 rounded-lg border border-gray-600 text-black font-bold";
    btn.style.background = "#39C85A";
    btn.innerHTML = `<span class="text-xl">${time}</span><span class="text-xl">ว่าง</span>`;
    btn.onclick = () => {
      document.querySelectorAll('#timeSlots button').forEach(b => b.classList.remove('ring-4', 'ring-black'));
      btn.classList.add('ring-4', 'ring-black');
      selectedTime = time;
      updateBookBtn();
    };
    container.appendChild(btn);
  });
}

function updateBookBtn() {
  const btn   = document.getElementById('bookBtn');
  const ready = selectedDate && selectedTime;
  btn.disabled  = !ready;
  btn.className = ready
    ? "px-10 py-3 rounded-full bg-white text-xl font-bold border hover:bg-pink-100 transition-colors"
    : "px-10 py-3 rounded-full bg-gray-200 text-xl font-bold border cursor-not-allowed";
}

document.getElementById('bookBtn').addEventListener('click', () => {
  if (!selectedDate || !selectedTime) return;
  const y = selectedDate.getFullYear();
  const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
  const d = String(selectedDate.getDate()).padStart(2, '0');
  window.location.href = `booking1.html?date=${y}-${m}-${d}&time=${selectedTime}`;
});

// ===== INIT =====
renderCalendar();
renderSlots();