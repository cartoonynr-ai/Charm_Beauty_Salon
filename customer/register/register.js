// ===== Toggle Password =====
function togglePw(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon  = document.getElementById(iconId);
  const show  = input.type === 'password';
  input.type  = show ? 'text' : 'password';
  icon.innerHTML = show
    ? '<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>'
    : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
}

// ===== Password Strength =====
function checkStrength() {
  const pw  = document.getElementById('reg-password').value;
  const bar = document.getElementById('strengthBar');
  const txt = document.getElementById('strengthText');

  let score = 0;
  if (pw.length >= 8)           score++;
  if (/[A-Z]/.test(pw))         score++;
  if (/[0-9]/.test(pw))         score++;
  if (/[^A-Za-z0-9]/.test(pw))  score++;

  const levels = [
    { width: '0%',   color: '#e5e7eb', label: '' },
    { width: '25%',  color: '#ef4444', label: 'อ่อนมาก' },
    { width: '50%',  color: '#f97316', label: 'พอใช้' },
    { width: '75%',  color: '#eab308', label: 'ดี' },
    { width: '100%', color: '#10b981', label: 'แข็งแรง' },
  ];

  bar.style.width      = levels[score].width;
  bar.style.background = levels[score].color;
  txt.textContent      = levels[score].label;
  txt.style.color      = levels[score].color;
}

// ===== Validation =====
function clearErr(inputId, errId) {
  document.getElementById(inputId).classList.remove('error');
  document.getElementById(errId).classList.remove('show');
}

function showErr(inputId, errId, msg) {
  const input = document.getElementById(inputId);
  const err   = document.getElementById(errId);
  err.textContent = msg;
  err.classList.add('show');
  input.classList.add('error', 'shake');
  setTimeout(() => input.classList.remove('shake'), 400);
}

// ===== Register =====
function doRegister() {
  const username = document.getElementById('reg-username').value.trim();
  const password = document.getElementById('reg-password').value;
  const confirm  = document.getElementById('reg-confirm').value;
  const email    = document.getElementById('reg-email').value.trim();
  let ok = true;

  if (!username) {
    showErr('reg-username', 'err-username', 'กรุณากรอกชื่อผู้ใช้'); ok = false;
  }
  if (!password) {
    showErr('reg-password', 'err-password', 'กรุณากรอกรหัสผ่าน'); ok = false;
  } else if (password.length < 8) {
    showErr('reg-password', 'err-password', 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร'); ok = false;
  } else if (!/[^A-Za-z0-9]/.test(password)) {
    showErr('reg-password', 'err-password', 'ต้องมีอักขระพิเศษ เช่น !@#$'); ok = false;
  }
  if (!confirm) {
    showErr('reg-confirm', 'err-confirm', 'กรุณายืนยันรหัสผ่าน'); ok = false;
  } else if (password && confirm !== password) {
    showErr('reg-confirm', 'err-confirm', 'รหัสผ่านไม่ตรงกัน'); ok = false;
  }
  if (!email || !email.includes('@')) {
    showErr('reg-email', 'err-email', 'กรุณากรอก E-mail ให้ถูกต้อง'); ok = false;
  }
  if (!ok) return;

  // บันทึกลง localStorage
  localStorage.setItem('charm_username', username);
  localStorage.setItem('charm_email',    email);
  localStorage.setItem('charm_logged_in','true');

  const btn = document.getElementById('registerBtn');
  btn.innerHTML = '<span class="spinner"></span>';
  btn.disabled  = true;

  setTimeout(() => {
    btn.innerHTML = 'ยืนยัน';
    btn.disabled  = false;
    showToast('✅ สมัครสมาชิกสำเร็จ', '#10b981');
    setTimeout(() => {
      window.location.href = '/customer/login/login.html';
    }, 1200);
  }, 1200);
}

// ===== Toast =====
function showToast(msg, color = '#10b981') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.background = color;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}