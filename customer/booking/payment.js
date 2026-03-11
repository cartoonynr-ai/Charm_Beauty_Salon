// ===== payment.js =====
let slipUploaded = false;

// ===== FILE HANDLING =====
function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file) processFile(file);
}
function handleDragOver(e) {
  e.preventDefault();
  document.getElementById('dropZone').classList.add('drag-over');
}
function handleDragLeave(e) {
  document.getElementById('dropZone').classList.remove('drag-over');
}
function handleDrop(e) {
  e.preventDefault();
  document.getElementById('dropZone').classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) processFile(file);
  else showToast('❌ กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น', '#ef4444');
}

function processFile(file) {
  if (file.size > 5 * 1024 * 1024) {
    showToast('❌ ไฟล์ใหญ่เกิน 5MB', '#ef4444'); return;
  }
  const progressWrap = document.getElementById('progressWrap');
  const progressBar  = document.getElementById('progressBar');
  progressWrap.style.display = 'block';
  progressBar.style.width = '0%';
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 20;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => { progressWrap.style.display = 'none'; }, 400);
      const reader = new FileReader();
      reader.onload = (ev) => {
        const preview = document.getElementById('previewImg');
        preview.src = ev.target.result;
        preview.classList.remove('hidden');
        document.getElementById('uploadPrompt').style.display = 'none';
        localStorage.setItem('booking_slip', ev.target.result);
      };
      reader.readAsDataURL(file);
      const fn = document.getElementById('fileName');
      fn.textContent = `📎 ${file.name}`;
      fn.classList.remove('hidden');
      slipUploaded = true;
      updateConfirmBtn();
      showToast('✅ อัปโหลด slip สำเร็จ', '#10b981');
    }
    progressBar.style.width = progress + '%';
  }, 60);
}

function updateConfirmBtn() {
  const btn = document.getElementById('confirmBtn');
  btn.disabled = !slipUploaded;
  if (slipUploaded) {
    btn.classList.remove('opacity-50', 'cursor-not-allowed');
    btn.classList.add('hover:bg-pink-500');
  }
}

// ===== COPY ACCOUNT =====
function copyAccount() {
  navigator.clipboard.writeText('xxx-x-x-xxxx-x').then(() => {
    showToast('📋 คัดลอกเลขบัญชีแล้ว', '#6366f1');
  });
}

// ===== MODAL =====
function openConfirmModal() {
  if (!slipUploaded) return;
  document.getElementById('confirmModal').classList.add('show');
}
function closeConfirmModal() {
  document.getElementById('confirmModal').classList.remove('show');
}

function submitPayment() {
  closeConfirmModal();

  // ✅ ดึงข้อมูลการจอง
  const date    = localStorage.getItem('booking_date_th') || '';
  const date_raw= localStorage.getItem('booking_date')    || '';
  const time    = localStorage.getItem('booking_time')    || '';
  const service = localStorage.getItem('booking_service_name') || '';
  const option  = localStorage.getItem('booking_option') || '';
  const price   = localStorage.getItem('booking_option_price') || '';

  // ✅ สร้าง booking object และเพิ่มเข้า charm_bookings
  let bookings = [];
  try { bookings = JSON.parse(localStorage.getItem('charm_bookings') || '[]'); } catch(e) {}

  const newBooking = {
    id:       Date.now(),
    date:     date_raw,
    date_th:  date,
    time:     time,
    service:  service,
    option:   option,
    price:    price,
    status:   'confirmed',
  };
  bookings.unshift(newBooking); // ใหม่ขึ้นก่อน
  localStorage.setItem('charm_bookings', JSON.stringify(bookings));

  // ✅ เพิ่ม notification
  const notifications = JSON.parse(localStorage.getItem('charm_notifications') || '[]');
  notifications.unshift({
    id:      Date.now(),
    read:    false,
    message: `มีนัดจองคิวไว้เวลา ${time} น.`,
    detail:  `${service}${option ? ' - ' + option : ''}`,
    date:    date,
  });
  localStorage.setItem('charm_notifications', JSON.stringify(notifications));

  // ✅ ล้าง booking temp
  localStorage.removeItem('booking_date');
  localStorage.removeItem('booking_date_th');
  localStorage.removeItem('booking_time');
  localStorage.removeItem('booking_service');
  localStorage.removeItem('booking_service_name');
  localStorage.removeItem('booking_option');
  localStorage.removeItem('booking_option_price');
  localStorage.removeItem('booking_slip');

  showToast('✅ ส่งข้อมูลการชำระเงินแล้ว กำลังไป...', '#10b981');
  setTimeout(() => { window.location.href = '/customer/booking/thankyou.html'; }, 1500);
}

// ===== TOAST =====
function showToast(msg, color = '#10b981') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.background = color;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

document.getElementById('confirmModal').addEventListener('click', function(e) {
  if (e.target === this) closeConfirmModal();
});