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

// ===== Clear Error =====
function clearErr(inputId, errId) {
  document.getElementById(inputId).classList.remove('error');
  document.getElementById(errId).classList.remove('show');
}

// ===== Show Error + Shake =====
function showErr(inputId, errId, msg) {
  const input = document.getElementById(inputId);
  const err   = document.getElementById(errId);
  err.textContent = msg;
  err.classList.add('show');
  input.classList.add('error', 'shake');
  setTimeout(() => input.classList.remove('shake'), 400);
}

// ===== Confirm =====
function handleConfirm() {
  const pw  = document.getElementById('new-password').value;
  const cpw = document.getElementById('confirm-password').value;
  let ok = true;

  if (!pw) {
    showErr('new-password', 'err-new', 'กรุณากรอกรหัสผ่านใหม่');
    ok = false;
  } else if (pw.length < 6) {
    showErr('new-password', 'err-new', 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
    ok = false;
  }

  if (!cpw) {
    showErr('confirm-password', 'err-confirm', 'กรุณายืนยันรหัสผ่าน');
    ok = false;
  } else if (pw && cpw && pw !== cpw) {
    showErr('confirm-password', 'err-confirm', 'รหัสผ่านไม่ตรงกัน กรุณาลองใหม่');
    ok = false;
  }

  if (!ok) return;

  // Loading state
  const btn = document.getElementById('confirmBtn');
  btn.innerHTML = '<span class="spinner"></span>';
  btn.disabled  = true;

  setTimeout(() => {
    btn.innerHTML = 'ยืนยัน';
    btn.disabled  = false;
    showToast('✅ ตั้งรหัสผ่านใหม่สำเร็จ', '#10b981');
    setTimeout(() => { window.location.href = '../login/login.html'; }, 1200);
  }, 1000);
}

// ===== Toast =====
function showToast(msg, color = '#10b981') {
  const t = document.getElementById('toast');
  t.textContent    = msg;
  t.style.background = color;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}
