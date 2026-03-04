// ===== TOGGLE PASSWORD VISIBILITY =====
const passwordInput = document.getElementById('passwordInput');
const togglePassword = document.getElementById('togglePassword');

togglePassword.addEventListener('click', () => {
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    togglePassword.textContent = '🙈';
  } else {
    passwordInput.type = 'password';
    togglePassword.textContent = '👁';
  }
});


// ===== VALIDATE FORM =====
const signInBtn = document.getElementById('signInBtn');
const usernameInput = document.getElementById('usernameInput');

signInBtn.addEventListener('click', (e) => {
  if (!usernameInput.value.trim() || !passwordInput.value.trim()) {
    e.preventDefault();
    alert('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
  }
});