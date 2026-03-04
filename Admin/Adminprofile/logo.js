// ===== LOGO SYNC =====
// ใส่ไฟล์นี้ในทุกหน้าที่มีโลโก้
// <script src="/logo.js"></script>

(function () {
  const savedLogo = localStorage.getItem("shopLogo");
  if (!savedLogo) return;

  function applyLogo() {
    document.querySelectorAll('img[src="/Photo/logo.jpg"], img[src*="logo.jpg"]').forEach(function (img) {
      img.src = savedLogo;
    });
  }

  // ถ้า DOM ยังไม่พร้อม ให้รอ ถ้าพร้อมแล้วรันเลย
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyLogo);
  } else {
    applyLogo();
  }
})();