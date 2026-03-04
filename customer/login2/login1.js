// Toggle password visibility
let pwVisible = false;

function togglePw() {
  pwVisible = !pwVisible;
  document.getElementById('password').type = pwVisible ? 'text' : 'password';
  document.getElementById('eyeIcon').innerHTML = pwVisible
    ? '<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>'
    : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
}

// Clear error state from input
function clearErr(inputId, errId) {
  document.getElementById(inputId).classList.remove('error');
  document.getElementById(errId).classList.remove('show');
}

// Show error + shake animation
function showErr(inputId, errId, msg) {
  const input = document.getElementById(inputId);
  const err   = document.getElementById(errId);
  err.textContent = msg;
  err.classList.add('show');
  input.classList.add('error', 'shake');
  setTimeout(() => input.classList.remove('shake'), 400);
}

// Login handler
function doLogin() {
  const u = document.getElementById('username').value.trim();
  const p = document.getElementById('password').value;
  let ok = true;

  if (!u) { showErr('username', 'username-error', 'กรุณากรอก username'); ok = false; }
  if (!p) { showErr('password', 'password-error', 'กรุณากรอกรหัสผ่าน'); ok = false; }
  if (!ok) return;

  const btn = document.getElementById('loginBtn');
  btn.innerHTML = '<span class="spinner"></span>';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = 'Log in';
    btn.disabled = false;
    showToast('✅ เข้าสู่ระบบสำเร็จ', '#10b981');
    setTimeout(() => {
      window.location.href = '/customer/main loged/main loged.html';
    }, 1000);
  }, 1200);
}

// Toast notification
function showToast(msg, color) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.background = color;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}
