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

// อีเมลและรหัสผ่านที่อนุญาต
const correctEmail = "CharmAdmin@gmail.com";
const correctPassword = "123456";

signInBtn.addEventListener('click', (e) => {

  // เช็คว่ากรอกหรือยัง
  if (!usernameInput.value.trim() || !passwordInput.value.trim()) {
    e.preventDefault();
    alert('กรุณากรอกอีเมลและรหัสผ่าน');
    return;
  }

  // เช็คว่า Email และ Password ถูกต้องไหม
  if (usernameInput.value !== correctEmail || passwordInput.value !== correctPassword) {
    e.preventDefault();
    alert('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    return;
  }

  // ถ้าถูกต้อง
  alert("เข้าสู่ระบบสำเร็จ");
});