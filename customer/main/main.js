// ===== TAB SWITCHING: ราคา / โปรโมชั่น =====

document.addEventListener('DOMContentLoaded', function () {
  const btnPrice = document.getElementById('btn-price');
  const btnPromo = document.getElementById('btn-promo');
  const tabPrice = document.getElementById('tab-price');
  const tabPromo = document.getElementById('tab-promo');

  // เริ่มต้นแสดง tab ราคา
  tabPrice.classList.remove('hidden');
  tabPromo.classList.add('hidden');
  btnPrice.classList.add('active');

  btnPrice.addEventListener('click', function (e) {
    e.preventDefault();
    tabPrice.classList.remove('hidden');
    tabPromo.classList.add('hidden');
    btnPrice.classList.add('active');
    btnPromo.classList.remove('active');
  });

  btnPromo.addEventListener('click', function (e) {
    e.preventDefault();
    tabPromo.classList.remove('hidden');
    tabPrice.classList.add('hidden');
    btnPromo.classList.add('active');
    btnPrice.classList.remove('active');
  });
});