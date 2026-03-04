// ===== SELECT ELEMENT =====
const editBtn = document.getElementById("editBtn");
const actionButtons = document.getElementById("actionButtons");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const inputs = document.querySelectorAll(".profile-input");

let isEditing = false;
let oldValues = [];

const editText = editBtn.querySelector("span");


// ===== FUNCTION: ENTER EDIT MODE =====
function enterEditMode() {

  isEditing = true;
  oldValues = [];

  inputs.forEach(input => {
    oldValues.push(input.value);
    input.readOnly = false;
    input.classList.remove("bg-gray-100");
    input.classList.add("bg-white");
  });

  actionButtons.classList.remove("hidden");
  actionButtons.classList.add("flex");

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

  actionButtons.classList.add("hidden");
  actionButtons.classList.remove("flex");

  editText.textContent = "แก้ไข";
  isEditing = false;
}


// ===== CLICK EDIT (TOGGLE) =====
editBtn.addEventListener("click", () => {

  if (!isEditing) {
    enterEditMode();
  } else {
    // กดซ้ำ = cancel
    exitEditMode(true);
  }

});


// ===== SAVE =====
saveBtn.addEventListener("click", () => {

  exitEditMode(false);
  alert("บันทึกข้อมูลสำเร็จ ✅");

});


// ===== CANCEL BUTTON =====
cancelBtn.addEventListener("click", () => {

  exitEditMode(true);

});