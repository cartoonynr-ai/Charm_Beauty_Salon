// ===== profile.js =====

// ===== โหลดข้อมูลจาก localStorage =====
window.addEventListener('DOMContentLoaded', () => {
  const username = localStorage.getItem('charm_username') || '';
  const email    = localStorage.getItem('charm_email')    || '';
  const phone    = localStorage.getItem('charm_phone')    || '';

  document.getElementById('username').value = username;
  document.getElementById('email').value    = email;
  document.getElementById('phone').value    = phone;
});

// ===== บันทึกข้อมูล =====
function saveProfile() {
  const username = document.getElementById('username').value.trim();
  const email    = document.getElementById('email').value.trim();
  const phone    = document.getElementById('phone').value.trim();
  let ok = true;

  if (!username) { shake('username'); ok = false; }
  if (!email || !email.includes('@')) { shake('email'); ok = false; }
  if (!phone)    { shake('phone'); ok = false; }

  if (!ok) {
    showToast('❌ กรุณากรอกข้อมูลให้ครบถ้วน', '#ef4444');
    return;
  }

  localStorage.setItem('charm_username', username);
  localStorage.setItem('charm_email',    email);
  localStorage.setItem('charm_phone',    phone);

  showToast('✅ บันทึกข้อมูลสำเร็จ', '#10b981');
}

function shake(id) {
  const el = document.getElementById(id);
  el.classList.add('shake');
  el.style.boxShadow = '0 0 0 2px #f87171';
  setTimeout(() => {
    el.classList.remove('shake');
    el.style.boxShadow = '';
  }, 500);
}

// ===== Logout Modal =====
function openLogoutModal() {
  document.getElementById('logoutModal').classList.add('show');
}

function closeLogoutModal() {
  document.getElementById('logoutModal').classList.remove('show');
}

function confirmLogout() {
  localStorage.removeItem('charm_logged_in');
  closeLogoutModal();
  showToast('👋 ออกจากระบบแล้ว', '#6366f1');
  setTimeout(() => {
    window.location.href = '/customer/login/login.html';
  }, 1200);
}

// ===== ปิด modal เมื่อคลิกข้างนอก =====
window.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('logoutModal');
  modal.addEventListener('click', function(e) {
    if (e.target === this) closeLogoutModal();
  });
});

// ===== Toast =====
function showToast(msg, color = '#10b981') {
  const t = document.getElementById('toast');
  t.textContent      = msg;
  t.style.background = color;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}