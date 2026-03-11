// ================= KEY =================
const PRICE_KEY = 'charm_price_blocks';
const PROMO_KEY = 'charm_promo_blocks';
const PROMO_IMAGES_KEY = 'promoImages';
const SHOP_KEY = 'charm_shop_info';

// ================= SHOP INFO =================
function saveShopInfo() {
  const info = {
    name:    document.getElementById('shopName')?.value    || '',
    address: document.getElementById('shopAddress')?.value || '',
    phone:   document.getElementById('shopPhone')?.value   || '',
  };
  localStorage.setItem(SHOP_KEY, JSON.stringify(info));
}

function loadShopInfo() {
  const info = JSON.parse(localStorage.getItem(SHOP_KEY) || '{}');
  if (document.getElementById('shopName'))    document.getElementById('shopName').value    = info.name    || '';
  if (document.getElementById('shopAddress')) document.getElementById('shopAddress').value = info.address || '';
  if (document.getElementById('shopPhone'))   document.getElementById('shopPhone').value   = info.phone   || '';
}

// ================= PROMO IMAGES (header section) =================
function previewMultipleImages(event) {
  const files = event.target.files;
  if (!files || files.length === 0) return;
  let stored = JSON.parse(localStorage.getItem(PROMO_IMAGES_KEY) || '[]');
  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      stored.push(e.target.result);
      localStorage.setItem(PROMO_IMAGES_KEY, JSON.stringify(stored));
      createPromoHeaderImage(e.target.result);
    };
    reader.readAsDataURL(file);
  });
  event.target.value = '';
}

function createPromoHeaderImage(src) {
  const container = document.getElementById('promoContainer');
  if (!container) return;
  const wrapper = document.createElement('div');
  wrapper.className = 'relative group';
  const img = document.createElement('img');
  img.src = src;
  img.className = 'w-full h-40 object-cover rounded-lg border shadow';
  const btn = document.createElement('button');
  btn.innerHTML = '✕';
  btn.className = 'absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition';
  btn.onclick = () => {
    let stored = JSON.parse(localStorage.getItem(PROMO_IMAGES_KEY) || '[]');
    stored = stored.filter(s => s !== src);
    localStorage.setItem(PROMO_IMAGES_KEY, JSON.stringify(stored));
    wrapper.remove();
  };
  wrapper.appendChild(img);
  wrapper.appendChild(btn);
  container.appendChild(wrapper);
}

// ================= BUILD BLOCK HTML =================
function createBlockEl(block, index, type) {
  const key = type === 'price' ? PRICE_KEY : PROMO_KEY;

  const wrap = document.createElement('div');
  wrap.className = 'bg-gray-200 py-10 relative';
  wrap.dataset.index = index;

  // รายการ items
  let itemsHtml = block.items.map((item, i) => `
    <div class="flex items-center gap-1 mt-1">
      <input type="text" placeholder="รายละเอียด"
        value="${escHtml(item)}"
        data-item="${i}"
        class="flex-1 bg-gray-100 border rounded px-2 py-1 text-xs item-input">
      <button onclick="removeItem(this, '${type}', ${index})"
        class="text-red-400 hover:text-red-600 text-sm font-bold px-1">✕</button>
    </div>`).join('');

  wrap.innerHTML = `
    <!-- ปุ่มลบ block -->
    <button onclick="removeBlock(this, '${type}', ${index})"
      class="absolute top-3 right-4 text-red-500 hover:text-red-700 text-xs font-bold bg-white px-2 py-1 rounded shadow">
      ลบหมวด
    </button>

    <div class="max-w-6xl mx-auto flex gap-16">
      <div class="w-1/2 space-y-2">
        <!-- หัวข้อ -->
        <input type="text" placeholder="หัวข้อ"
          value="${escHtml(block.title)}"
          data-field="title"
          class="w-32 bg-gray-300 rounded px-2 py-1 text-xs title-input">

        <!-- รายการ -->
        <div class="space-y-1 items-wrap">
          ${itemsHtml}
        </div>

        <!-- ปุ่มเพิ่มรายการ -->
        <button onclick="addItem(this, '${type}', ${index})"
          class="mt-2 text-xs text-blue-500 hover:underline">+ เพิ่มรายการ</button>
      </div>

      <div class="w-1/2 flex justify-center">
        <label class="w-[420px] h-[300px] bg-gray-300 flex items-center justify-center text-gray-500 cursor-pointer relative overflow-hidden rounded">
          <input type="file" accept="image/*" class="hidden img-input"
            onchange="handleBlockImage(event, '${type}', ${index})">
          <img class="block-img absolute inset-0 w-full h-full object-cover ${block.image ? '' : 'hidden'}"
            src="${block.image || ''}">
          <span class="z-10 img-label ${block.image ? 'hidden' : ''}">เลือกรูปภาพ</span>
        </label>
      </div>
    </div>`;

  return wrap;
}

function escHtml(str) {
  return (str || '').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

// ================= RENDER BLOCKS =================
function renderBlocks(type) {
  const key = type === 'price' ? PRICE_KEY : PROMO_KEY;
  const containerId = type === 'price' ? 'priceSection' : 'promoSection';
  const blocks = JSON.parse(localStorage.getItem(key) || '[]');

  const section = document.getElementById(containerId);
  if (!section) return;

  // เก็บปุ่มไว้
  const addBtn = section.querySelector('.add-block-btn');
  // ลบ block เดิมทั้งหมด
  section.querySelectorAll('.block-wrap').forEach(el => el.remove());

  blocks.forEach((block, i) => {
    const el = createBlockEl(block, i, type);
    el.classList.add('block-wrap');
    // ใส่ก่อนปุ่ม
    if (addBtn) section.insertBefore(el, addBtn);
    else section.appendChild(el);

    // divider
    if (i < blocks.length - 1) {
      const div = document.createElement('div');
      div.className = 'h-16 bg-[#EED2D7] block-wrap';
      if (addBtn) section.insertBefore(div, addBtn);
      else section.appendChild(div);
    }
  });
}

// ================= ADD / REMOVE BLOCK =================
function addBlock(type) {
  const key = type === 'price' ? PRICE_KEY : PROMO_KEY;
  const blocks = JSON.parse(localStorage.getItem(key) || '[]');
  blocks.push({ title: '', items: ['', '', ''], image: '' });
  localStorage.setItem(key, JSON.stringify(blocks));
  renderBlocks(type);
}

function removeBlock(btn, type, index) {
  if (!confirm('ลบหมวดนี้?')) return;
  const key = type === 'price' ? PRICE_KEY : PROMO_KEY;
  let blocks = JSON.parse(localStorage.getItem(key) || '[]');
  blocks.splice(index, 1);
  localStorage.setItem(key, JSON.stringify(blocks));
  renderBlocks(type);
}

// ================= ADD / REMOVE ITEM =================
function addItem(btn, type, blockIndex) {
  const key = type === 'price' ? PRICE_KEY : PROMO_KEY;
  let blocks = JSON.parse(localStorage.getItem(key) || '[]');
  blocks[blockIndex].items.push('');
  localStorage.setItem(key, JSON.stringify(blocks));
  renderBlocks(type);
}

function removeItem(btn, type, blockIndex) {
  const wrap = btn.parentElement;
  const itemIndex = parseInt(wrap.querySelector('[data-item]').dataset.item);
  const key = type === 'price' ? PRICE_KEY : PROMO_KEY;
  let blocks = JSON.parse(localStorage.getItem(key) || '[]');
  blocks[blockIndex].items.splice(itemIndex, 1);
  localStorage.setItem(key, JSON.stringify(blocks));
  renderBlocks(type);
}

// ================= IMAGE UPLOAD PER BLOCK =================
function handleBlockImage(event, type, blockIndex) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const key = type === 'price' ? PRICE_KEY : PROMO_KEY;
    let blocks = JSON.parse(localStorage.getItem(key) || '[]');
    blocks[blockIndex].image = e.target.result;
    localStorage.setItem(key, JSON.stringify(blocks));
    renderBlocks(type);
  };
  reader.readAsDataURL(file);
  event.target.value = '';
}

// ================= SAVE (collect inputs → localStorage) =================
function saveData() {
  ['price', 'promo'].forEach(type => {
    const key = type === 'price' ? PRICE_KEY : PROMO_KEY;
    const containerId = type === 'price' ? 'priceSection' : 'promoSection';
    const section = document.getElementById(containerId);
    if (!section) return;

    let blocks = JSON.parse(localStorage.getItem(key) || '[]');

    section.querySelectorAll('.block-wrap[data-index]').forEach(wrap => {
      const idx = parseInt(wrap.dataset.index);
      if (!blocks[idx]) return;

      const titleEl = wrap.querySelector('.title-input');
      if (titleEl) blocks[idx].title = titleEl.value;

      const itemEls = wrap.querySelectorAll('.item-input');
      blocks[idx].items = Array.from(itemEls).map(el => el.value);
    });

    localStorage.setItem(key, JSON.stringify(blocks));
  });

  saveShopInfo();
  alert('บันทึกข้อมูลเรียบร้อยแล้ว');
}

// ================= RESET =================
function resetData() {
  if (!confirm('คุณต้องการล้างข้อมูลทั้งหมดหรือไม่?')) return;
  localStorage.removeItem(PRICE_KEY);
  localStorage.removeItem(PROMO_KEY);
  localStorage.removeItem(PROMO_IMAGES_KEY);
  localStorage.removeItem(SHOP_KEY);
  location.reload();
}

// ================= TAB =================
function showTab(tab) {
  const priceSection = document.getElementById('priceSection');
  const promoSection = document.getElementById('promoSection');
  const priceTab     = document.getElementById('priceTab');
  const promoTab     = document.getElementById('promoTab');
  if (!priceSection) return;

  if (tab === 'price') {
    priceSection.classList.remove('hidden');
    promoSection.classList.add('hidden');
    priceTab.classList.add('text-pink-500','font-medium');
    priceTab.classList.remove('text-gray-500');
    promoTab.classList.remove('text-pink-500','font-medium');
    promoTab.classList.add('text-gray-500');
  } else {
    promoSection.classList.remove('hidden');
    priceSection.classList.add('hidden');
    promoTab.classList.add('text-pink-500','font-medium');
    promoTab.classList.remove('text-gray-500');
    priceTab.classList.remove('text-pink-500','font-medium');
    priceTab.classList.add('text-gray-500');
  }
  localStorage.setItem('activeTab', tab);
}

// ================= INIT =================
document.addEventListener('DOMContentLoaded', () => {
  // โหลดรูปโปรโมชั่น header
  const stored = JSON.parse(localStorage.getItem(PROMO_IMAGES_KEY) || '[]');
  stored.forEach(src => createPromoHeaderImage(src));

  // โหลดข้อมูลร้าน
  loadShopInfo();

  // สร้าง block เริ่มต้นถ้ายังไม่มี
  if (!localStorage.getItem(PRICE_KEY)) {
    localStorage.setItem(PRICE_KEY, JSON.stringify([
      { title: 'ทำเล็บ', items: ['', '', '', '', ''], image: '' },
      { title: 'ทำผม',   items: ['', '', '', '', ''], image: '' },
      { title: 'แต่งหน้า', items: ['', '', '', '', ''], image: '' },
    ]));
  }
  if (!localStorage.getItem(PROMO_KEY)) {
    localStorage.setItem(PROMO_KEY, JSON.stringify([
      { title: 'ทำเล็บ', items: ['', '', '', ''], image: '' },
      { title: 'ทำผม',   items: ['', '', ''],     image: '' },
      { title: 'แต่งหน้า', items: ['', '', '', ''], image: '' },
    ]));
  }

  renderBlocks('price');
  renderBlocks('promo');

  const savedTab = localStorage.getItem('activeTab') || 'price';
  showTab(savedTab);
});