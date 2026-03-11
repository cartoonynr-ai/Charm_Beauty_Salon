let generatedOtp = '';
let countdownInterval = null;

// ===== OTP =====
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function sendOtp() {
  generatedOtp = generateOtp();

  alert('รับรหัส OTP ของคุณคือ ' + generatedOtp);

  const btn = document.getElementById('otp-button-main');
  btn.disabled = true;

  let seconds = 60;
  btn.innerText = `รับ OTP อีกครั้ง (${seconds}s)`;

  if (countdownInterval) clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    seconds--;
    btn.innerText = `รับ OTP อีกครั้ง (${seconds}s)`;
    if (seconds === 0) {
      clearInterval(countdownInterval);
      btn.innerText = 'รับ OTP';
      btn.disabled = false;
      generatedOtp = '';
    }
  }, 1000);

  // Clear & focus
  const boxes = document.querySelectorAll('.otp-box');
  boxes.forEach(b => { b.value = ''; b.classList.remove('error', 'correct'); });
  boxes[0].focus();
}

// ===== Box Navigation =====
document.querySelectorAll('.otp-box').forEach((box, i, boxes) => {
  box.addEventListener('input', () => {
    box.value = box.value.replace(/[^0-9]/g, '').slice(-1);
    if (box.value && i < boxes.length - 1) boxes[i + 1].focus();
  });
  box.addEventListener('keydown', e => {
    if (e.key === 'Backspace' && !box.value && i > 0) boxes[i - 1].focus();
    if (e.key === 'Enter') verifyOtp();
  });
  box.addEventListener('paste', e => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    [...text].forEach((ch, j) => { if (boxes[j]) boxes[j].value = ch; });
    boxes[Math.min(text.length, boxes.length - 1)].focus();
  });
});

// ===== Verify =====
function verifyOtp() {
  const boxes   = document.querySelectorAll('.otp-box');
  const entered = [...boxes].map(b => b.value).join('');
  const errEl   = document.getElementById('otpError');

  if (entered.length < 6) {
    errEl.textContent = 'กรุณากรอกรหัส OTP ให้ครบ 6 หลัก';
    errEl.classList.add('show');
    boxes.forEach(b => b.classList.add('error'));
    setTimeout(() => boxes.forEach(b => b.classList.remove('error')), 400);
    return;
  }

  if (!generatedOtp) {
    errEl.textContent = 'กรุณากด "รับ OTP" ก่อน';
    errEl.classList.add('show');
    return;
  }

  if (entered === generatedOtp) {
    errEl.classList.remove('show');
    boxes.forEach(b => b.classList.add('correct'));
    showToast('✅ ยืนยัน OTP สำเร็จ', '#10b981');
    setTimeout(() => { window.location.href = '/customer/verify/new-password.html'; }, 1200);
  } else {
    errEl.textContent = 'รหัส OTP ไม่ถูกต้อง กรุณาลองใหม่';
    errEl.classList.add('show');
    boxes.forEach(b => { b.classList.add('error'); b.value = ''; });
    setTimeout(() => boxes.forEach(b => b.classList.remove('error')), 400);
    boxes[0].focus();
    showToast('❌ OTP ไม่ถูกต้อง', '#ef4444');
  }
}

// ===== Toast =====
function showToast(msg, color = '#10b981') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.background = color;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}