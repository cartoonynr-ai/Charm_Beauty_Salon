// ===== KEYS (เหมือนกับ admin และ main_loged.js) =====
const PRICE_KEY        = 'charm_price_blocks';
const PROMO_KEY        = 'charm_promo_blocks';
const PROMO_IMAGES_KEY = 'promoImages';
const SHOP_KEY         = 'charm_shop_info';

// ===== SHOP INFO =====
function loadShopInfo() {
  const info = JSON.parse(localStorage.getItem(SHOP_KEY) || '{}');
  if (info.name    && document.getElementById('shopName'))    document.getElementById('shopName').textContent    = info.name;
  if (info.address && document.getElementById('shopAddress')) document.getElementById('shopAddress').textContent = info.address;
  if (info.phone   && document.getElementById('shopPhone'))   document.getElementById('shopPhone').textContent   = info.phone;
}

// ===== PROMO HEADER IMAGES =====
function loadPromoHeaderImages() {
  const container = document.getElementById('promoContainer');
  if (!container) return;
  const stored = JSON.parse(localStorage.getItem(PROMO_IMAGES_KEY) || '[]');
  container.innerHTML = '';
  if (stored.length === 0) return;
  stored.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.className = 'w-full h-40 object-cover rounded-lg border shadow';
    container.appendChild(img);
  });
}

// ===== RENDER BLOCKS (read-only, ไม่มีปุ่ม Booking) =====
function renderBlocks(type) {
  const key         = type === 'price' ? PRICE_KEY : PROMO_KEY;
  const containerId = type === 'price' ? 'tab-price' : 'tab-promo';
  const blocks      = JSON.parse(localStorage.getItem(key) || '[]');
  const section     = document.getElementById(containerId);
  if (!section) return;

  section.innerHTML = '';

  if (blocks.length === 0) {
    section.innerHTML = '<p class="text-center text-gray-400 py-10">ยังไม่มีข้อมูล</p>';
    return;
  }

  blocks.forEach((block, i) => {
    // divider
    const divider = document.createElement('div');
    divider.className = 'w-full h-10 bg-pink-300 my-16';
    section.appendChild(divider);

    const row = document.createElement('div');
    row.className = 'flex justify-center gap-10 mb-20 items-center px-10';

    const itemsHtml = block.items
      .filter(it => it && it.trim())
      .map(it => {
        const parts = it.split('|');
        if (parts.length === 2) {
          return `<li class="flex justify-between"><span>${parts[0].trim()}</span><span>${parts[1].trim()}</span></li>`;
        }
        return `<li class="text-gray-600">${it}</li>`;
      }).join('');

    row.innerHTML = `
      <div class="w-[520px] text-left">
        <h3 class="text-pink-500 font-bold mb-4">${block.title || ''}</h3>
        <ul class="space-y-2 border-t border-pink-300 pt-4 text-sm">
          ${itemsHtml || '<li class="text-gray-400">-</li>'}
        </ul>
      </div>
      ${block.image
        ? `<img src="${block.image}" class="w-[360px] rounded-xl shadow object-cover" style="max-height:280px">`
        : `<div class="w-[360px] h-[240px] bg-gray-100 rounded-xl flex items-center justify-center text-gray-300 text-sm">ยังไม่มีรูป</div>`
      }`;

    section.appendChild(row);
  });

  // divider ท้าย
  const last = document.createElement('div');
  last.className = 'w-full h-10 bg-pink-300 my-16';
  section.appendChild(last);
}

// ===== TAB SWITCHING =====
document.addEventListener('DOMContentLoaded', function () {
  const btnPrice = document.getElementById('btn-price');
  const btnPromo = document.getElementById('btn-promo');
  const tabPrice = document.getElementById('tab-price');
  const tabPromo = document.getElementById('tab-promo');

  // โหลดข้อมูล
  loadShopInfo();
  loadPromoHeaderImages();
  renderBlocks('price');
  renderBlocks('promo');

  // tab default
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