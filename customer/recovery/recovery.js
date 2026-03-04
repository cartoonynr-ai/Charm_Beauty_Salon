// ===== Validation =====
function clearErr() {
  const input = document.getElementById('emailInput');
  const err   = document.getElementById('emailError');
  input.classList.remove('error');
  err.classList.remove('show');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ===== Submit =====
function doSubmit() {
  const input = document.getElementById('emailInput');
  const err   = document.getElementById('emailError');
  const email = input.value.trim();

  if (!email || !isValidEmail(email)) {
    err.textContent = email ? 'รูปแบบ E-mail ไม่ถูกต้อง' : 'กรุณากรอก E-mail';
    err.classList.add('show');
    input.classList.add('error', 'shake');
    setTimeout(() => input.classList.remove('shake'), 400);
    return;
  }

  // Loading state
  const btn = document.getElementById('submitBtn');
  btn.innerHTML = '<span class="spinner"></span>';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = 'ยืนยัน';
    btn.disabled = false;
    showToast('✅ ส่งรหัสไปยัง ' + email + ' แล้ว', '#10b981');
    setTimeout(() => {
      window.location.href = '/customer/verify/verify.html';
    }, 1500);
  }, 1200);
}

// ===== Toast =====
function showToast(msg, color = '#10b981') {
  const t = document.getElementById('toast');
  t.textContent    = msg;
  t.style.background = color;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}