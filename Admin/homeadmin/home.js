// ================= PROMO MULTIPLE IMAGES =================
function previewMultipleImages(event) {
  const files = event.target.files;
  if (!files || files.length === 0) return;
 
  let storedImages = JSON.parse(localStorage.getItem("promoImages")) || [];
 
  Array.from(files).forEach(file => {
    const reader = new FileReader();
 
    reader.onload = function (e) {
      const imageData = e.target.result;
      storedImages.push(imageData);
      localStorage.setItem("promoImages", JSON.stringify(storedImages));
      createPromoImage(imageData);
    };
 
    reader.readAsDataURL(file);
  });
 
  event.target.value = "";
}
 
function createPromoImage(imageSrc) {
  const container = document.getElementById("promoContainer");
  if (!container) return;
 
  const wrapper = document.createElement("div");
  wrapper.className = "relative group";
 
  const img = document.createElement("img");
  img.src = imageSrc;
  img.className = "w-full h-40 object-cover rounded-lg border shadow";
 
  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = "✕";
  deleteBtn.className =
    "absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition";
 
  deleteBtn.onclick = function () {
    deletePromoImage(imageSrc, wrapper);
  };
 
  wrapper.appendChild(img);
  wrapper.appendChild(deleteBtn);
  container.appendChild(wrapper);
}
 
function deletePromoImage(imageSrc, element) {
  let storedImages = JSON.parse(localStorage.getItem("promoImages")) || [];
  storedImages = storedImages.filter(img => img !== imageSrc);
  localStorage.setItem("promoImages", JSON.stringify(storedImages));
 
  if (element) element.remove();
}
 
 
// ================= SINGLE IMAGE PREVIEW =================
function previewImage(event, previewId) {
  const file = event.target.files[0];
  if (!file) return;
 
  const reader = new FileReader();
 
  reader.onload = function (e) {
    const preview = document.getElementById(previewId);
    if (!preview) return;
 
    preview.src = e.target.result;
    preview.classList.remove("hidden");
 
    localStorage.setItem(previewId, e.target.result);
  };
 
  reader.readAsDataURL(file);
  event.target.value = "";
}
 
function loadImages() {
  ["preview1", "preview2", "preview3"].forEach(id => {
    const saved = localStorage.getItem(id);
    if (saved) {
      const img = document.getElementById(id);
      if (img) {
        img.src = saved;
        img.classList.remove("hidden");
      }
    }
  });
}
 
 
// ================= SAVE TEXT DATA =================
function saveData() {
  const inputs = document.querySelectorAll("input[type='text']");
  const data = [];
 
  inputs.forEach(input => data.push(input.value));
 
  localStorage.setItem("textData", JSON.stringify(data));
  alert("บันทึกข้อมูลเรียบร้อยแล้ว");
}
 
function loadTextData() {
  const saved = JSON.parse(localStorage.getItem("textData")) || [];
  const inputs = document.querySelectorAll("input[type='text']");
 
  inputs.forEach((input, index) => {
    if (saved[index] !== undefined) {
      input.value = saved[index];
    }
  });
}
 
 
// ================= RESET =================
function resetData() {
  if (confirm("คุณต้องการล้างข้อมูลทั้งหมดหรือไม่?")) {
 
    localStorage.removeItem("promoImages");
    localStorage.removeItem("textData");
    localStorage.removeItem("activeTab");
 
    ["preview1", "preview2", "preview3"].forEach(id =>
      localStorage.removeItem(id)
    );
 
    location.reload();
  }
}
 
 
// ================= TAB SYSTEM =================
function showTab(tab) {
  const priceSection = document.getElementById("priceSection");
  const promoSection = document.getElementById("promoSection");
  const priceTab = document.getElementById("priceTab");
  const promoTab = document.getElementById("promoTab");
 
  if (!priceSection || !promoSection || !priceTab || !promoTab) return;
 
  if (tab === "price") {
    priceSection.classList.remove("hidden");
    promoSection.classList.add("hidden");
 
    priceTab.classList.add("text-pink-500", "font-medium");
    priceTab.classList.remove("text-gray-500");
 
    promoTab.classList.remove("text-pink-500", "font-medium");
    promoTab.classList.add("text-gray-500");
  } else {
    promoSection.classList.remove("hidden");
    priceSection.classList.add("hidden");
 
    promoTab.classList.add("text-pink-500", "font-medium");
    promoTab.classList.remove("text-gray-500");
 
    priceTab.classList.remove("text-pink-500", "font-medium");
    priceTab.classList.add("text-gray-500");
  }
 
  localStorage.setItem("activeTab", tab);
}
 
 
// ================= LOAD WHEN PAGE OPEN =================
document.addEventListener("DOMContentLoaded", function () {
 
  // โหลดรูปโปรโมชั่นหลายรูป
  const storedImages = JSON.parse(localStorage.getItem("promoImages")) || [];
  storedImages.forEach(img => createPromoImage(img));
 
  // โหลดรูปเดี่ยว (priceSection)
  loadImages();
 
  // โหลดข้อความ
  loadTextData();
 
  // โหลดแท็บล่าสุด
  const savedTab = localStorage.getItem("activeTab") || "price";
  showTab(savedTab);
 
});
 