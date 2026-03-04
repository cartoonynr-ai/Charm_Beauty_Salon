// ===== SELECT ELEMENT =====
const editBtn       = document.getElementById("editBtn");
const actionButtons = document.getElementById("actionButtons");
const saveBtn       = document.getElementById("saveBtn");
const cancelBtn     = document.getElementById("cancelBtn");
const inputs        = document.querySelectorAll(".profile-input");

const editText      = editBtn.querySelector("span");

let isEditing = false;
let oldValues = [];


// ===== LOGO =====
const logoEditBtn   = document.getElementById("logoEditBtn");
const logoFileInput = document.getElementById("logoFileInput");
const logoPreview   = document.getElementById("logoPreview");

let oldLogoSrc = logoPreview.src;

// โหลดโลโก้จาก localStorage ถ้ามี
const savedLogo = localStorage.getItem("shopLogo");
if (savedLogo) {
  logoPreview.src = savedLogo;
}

// แสดงรูป preview เริ่มต้น
logoPreview.style.display = "block";

// กดปุ่ม Logo → เปิด file picker (ได้เฉพาะตอน edit mode)
logoEditBtn.addEventListener("click", () => {
  if (!isEditing) return;
  logoFileInput.click();
});

// เมื่อเลือกไฟล์ → แสดง preview
logoFileInput.addEventListener("change", () => {
  const file = logoFileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    logoPreview.src = e.target.result;
    logoPreview.style.display = "block";
  };
  reader.readAsDataURL(file);
});


// ===== FUNCTION: ENTER EDIT MODE =====
function enterEditMode() {
  isEditing = true;
  oldValues = [];
  oldLogoSrc = logoPreview.src;

  inputs.forEach(input => {
    oldValues.push(input.value);
    input.readOnly = false;
    input.classList.remove("bg-gray-100");
    input.classList.add("bg-white");
  });

  actionButtons.classList.remove("hidden");
  actionButtons.classList.add("flex");

  logoEditBtn.classList.add("enabled");
  editText.textContent = "ยกเลิกการแก้ไข";
}


// ===== FUNCTION: EXIT EDIT MODE =====
function exitEditMode(restoreOld = false) {
  inputs.forEach((input, index) => {
    if (restoreOld) {
      input.value = oldValues[index];
    }
    input.readOnly = true;
    input.classList.remove("bg-white");
    input.classList.add("bg-gray-100");
  });

  if (restoreOld) {
    // คืนรูปโลโก้เดิม
    logoPreview.src = oldLogoSrc;
    logoFileInput.value = "";
  }

  actionButtons.classList.add("hidden");
  actionButtons.classList.remove("flex");

  logoEditBtn.classList.remove("enabled");
  editText.textContent = "แก้ไข";
  isEditing = false;
}


// ===== CLICK EDIT (TOGGLE) =====
editBtn.addEventListener("click", () => {
  if (!isEditing) {
    enterEditMode();
  } else {
    exitEditMode(true);
  }
});


// ===== SAVE =====
saveBtn.addEventListener("click", () => {
  // บันทึกโลโก้ลง localStorage ถ้ามีการเปลี่ยน
  if (logoFileInput.files[0]) {
    localStorage.setItem("shopLogo", logoPreview.src);
  }
  exitEditMode(false);
  alert("บันทึกข้อมูลสำเร็จ ✅");
});


// ===== CANCEL BUTTON =====
cancelBtn.addEventListener("click", () => {
  exitEditMode(true);
});