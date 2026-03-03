/* =============================
   LOCAL STORAGE ALBUM SYSTEM
   (NAIL VERSION)
============================= */

const STORAGE_KEY = "hair";

let imageData = [];


/* ========= PREVIEW IMAGE ========= */
function previewImage(event) {

  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {

    const container = event.target.nextElementSibling;

    container.innerHTML = `
      <div class="w-full h-full relative group">
        <img src="${e.target.result}"
          class="absolute inset-0 w-full h-full object-cover transition duration-300 group-hover:scale-105"/>

        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30
          flex items-center justify-center text-white text-sm
          opacity-0 group-hover:opacity-100 transition">
          เปลี่ยนรูป
        </div>
      </div>
    `;

    const index =
      [...document.querySelectorAll('.imageInput')]
      .indexOf(event.target);

    imageData[index] = e.target.result;
  };

  reader.readAsDataURL(file);
}


/* ========= SAVE ========= */
function saveData() {

  const mainTitle = document.getElementById("albumTitleInput");

  if (mainTitle) {
    localStorage.setItem(`${STORAGE_KEY}_mainTitle`, mainTitle.value);
  }

  const titles = document.querySelectorAll(".albumTitle");
  const titleData = [];

  titles.forEach(t => titleData.push(t.value));

  localStorage.setItem(
    `${STORAGE_KEY}_albumTitles`,
    JSON.stringify(titleData)
  );

  localStorage.setItem(
    `${STORAGE_KEY}_albumImages`,
    JSON.stringify(imageData)
  );

  alert("บันทึกข้อมูลเรียบร้อย ✅");
}


/* ========= LOAD ========= */
function loadMainTitle() {
  const saved = localStorage.getItem(`${STORAGE_KEY}_mainTitle`);
  const input = document.getElementById("albumTitleInput");
  if (saved && input) input.value = saved;
}

function loadTitleData() {

  const saved =
    JSON.parse(localStorage.getItem(`${STORAGE_KEY}_albumTitles`)) || [];

  document.querySelectorAll(".albumTitle")
    .forEach((input, i) => {
      if (saved[i] !== undefined) input.value = saved[i];
    });
}

function loadImageData() {

  const saved =
    JSON.parse(localStorage.getItem(`${STORAGE_KEY}_albumImages`));

  if (!saved) return;

  document.querySelectorAll(".selectImage")
    .forEach((box, i) => {

      if (saved[i]) {
        box.innerHTML = `
          <div class="w-full h-full relative group">
            <img src="${saved[i]}"
              class="absolute inset-0 w-full h-full object-cover transition duration-300 group-hover:scale-105"/>
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30
              flex items-center justify-center text-white text-sm
              opacity-0 group-hover:opacity-100 transition">
              เปลี่ยนรูป
            </div>
          </div>
        `;
      }
    });

  imageData = saved;
}


/* ========= AUTO SAVE TITLE ========= */
document.addEventListener("input", e => {
  if (e.target.id === "albumTitleInput") {
    localStorage.setItem(`${STORAGE_KEY}_mainTitle`, e.target.value);
  }
});


/* ========= RESET ========= */
function resetData() {

  if (!confirm("ต้องการล้างข้อมูลทั้งหมดหรือไม่?")) return;

  localStorage.removeItem(`${STORAGE_KEY}_albumImages`);
  localStorage.removeItem(`${STORAGE_KEY}_albumTitles`);
  localStorage.removeItem(`${STORAGE_KEY}_mainTitle`);

  location.reload();
}


window.addEventListener("DOMContentLoaded", () => {
  loadMainTitle();
  loadTitleData();
  loadImageData();
});