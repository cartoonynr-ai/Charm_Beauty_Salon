// ================= KEYS (เหมือนกับ admin) =================
const PRICE_KEY       = 'charm_price_blocks';
const PROMO_KEY       = 'charm_promo_blocks';
const PROMO_IMAGES_KEY= 'promoImages';
const SHOP_KEY        = 'charm_shop_info';

// ================= TAB =================
function showTab(tab) {
  const priceSection = document.getElementById('priceSection');
  const promoSection = document.getElementById('promoSection');
  const btnPrice     = document.getElementById('btn-price');
  const btnPromo     = document.getElementById('btn-promo');
  if (!priceSection) return;
  if (tab === 'price') {
    priceSection.classList.remove('hidden');
    promoSection.classList.add('hidden');
    btnPrice.classList.add('font-bold','underline');
    btnPromo.classList.remove('font-bold','underline');
  } else {
    promoSection.classList.remove('hidden');
    priceSection.classList.add('hidden');
    btnPromo.classList.add('font-bold','underline');
    btnPrice.classList.remove('font-bold','underline');
  }
}

// ================= RENDER (customer read-only) =================
function renderCustomerBlocks(type) {
  const key         = type === 'price' ? PRICE_KEY : PROMO_KEY;
  const containerId = type === 'price' ? 'priceSection' : 'promoSection';
  const blocks      = JSON.parse(localStorage.getItem(key) || '[]');
  const section     = document.getElementById(containerId);
  if (!section) return;

  section.innerHTML = '';

  if (blocks.length === 0) {
    section.innerHTML = '<p class="text-center text-gray-400 py-10">ยังไม่มีข้อมูล</p>';
    return;
  }

  blocks.forEach((block, i) => {
    // divider ด้านบน
    const divider = document.createElement('div');
    divider.className = 'w-full h-10 bg-pink-300 my-16';
    section.appendChild(divider);

    const row = document.createElement('div');
    row.className = 'flex justify-center gap-10 mb-4 items-center px-10';

    const itemsHtml = block.items
      .filter(it => it.trim())
      .map(it => {
        // ถ้า format "ชื่อ | ราคา" แยกซ้าย-ขวา
        const parts = it.split('|');
        if (parts.length === 2) {
          return `<li class="flex justify-between text-sm"><span>${parts[0].trim()}</span><span>${parts[1].trim()}</span></li>`;
        }
        return `<li class="text-sm text-gray-600">${it}</li>`;
      }).join('');

    row.innerHTML = `
      <div class="w-[520px] text-left">
        <h3 class="text-pink-500 font-bold mb-4">${block.title || ''}</h3>
        <ul class="space-y-2 border-t border-pink-300 pt-4">
          ${itemsHtml}
        </ul>
        ${type === 'promo' ? `
        <div class="mt-6">
          <a href="/customer/booking/booking.html"
            class="px-8 py-2 rounded-full border border-gray-400 bg-white hover:bg-pink-100 font-semibold text-sm transition-colors">
            Booking
          </a>
        </div>` : ''}
      </div>
      ${block.image
        ? `<img src="${block.image}" class="w-[360px] rounded-xl shadow object-cover" style="max-height:280px">`
        : `<div class="w-[360px] h-[240px] bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-sm">ยังไม่มีรูป</div>`
      }`;

    section.appendChild(row);
  });

  // divider ท้าย
  const last = document.createElement('div');
  last.className = 'w-full h-10 bg-pink-300 my-16';
  section.appendChild(last);
}

// ================= NOTIFICATION BADGE =================
function loadNotificationBadge() {
  const notifs = JSON.parse(localStorage.getItem('charm_notifications') || '[]');
  const unread = notifs.filter(n => !n.read).length;
  const badge  = document.getElementById('noti-badge');
  if (badge) badge.style.display = unread > 0 ? 'block' : 'none';
}

// ================= SHOP INFO =================
function loadShopInfo() {
  const info = JSON.parse(localStorage.getItem(SHOP_KEY) || '{}');
  if (info.name    && document.getElementById('shopName'))    document.getElementById('shopName').textContent    = info.name;
  if (info.address && document.getElementById('shopAddress')) document.getElementById('shopAddress').textContent = info.address;
  if (info.phone   && document.getElementById('shopPhone'))   document.getElementById('shopPhone').textContent   = info.phone;
}

// ================= PROMO HEADER IMAGES =================
function loadPromoHeaderImages() {
  const container = document.getElementById('promoContainer');
  if (!container) return;
  const stored = JSON.parse(localStorage.getItem(PROMO_IMAGES_KEY) || '[]');
  container.innerHTML = '';
  if (stored.length === 0) {
    container.innerHTML = '<p class="text-gray-400 text-sm text-center w-full py-4">ยังไม่มีรูปโปรโมชั่น</p>';
    return;
  }
  stored.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.className = 'w-full h-40 object-cover rounded-lg border shadow';
    container.appendChild(img);
  });
}

// ================= INIT =================
document.addEventListener('DOMContentLoaded', () => {
  loadShopInfo();
  loadPromoHeaderImages();
  renderCustomerBlocks('price');
  renderCustomerBlocks('promo');
  loadNotificationBadge();
  showTab('price');
});