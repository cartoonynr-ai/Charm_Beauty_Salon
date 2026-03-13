  const STORAGE_KEY = 'hair';
  const SLOTS_PER_GROUP = 6;
  let groups = [];
  let currentGroup = 0;
  let currentSlot = 0;
  let pendingImgBase64 = null;

  function emptySlots() { return Array(SLOTS_PER_GROUP).fill(null).map(() => ({})); }

  function defaultGroups() {
    return ["ผู้หญิง", "ผู้ชาย", "ทำสี"].map(title => ({ title, slots: emptySlots() }));
  }

  function addGroup() {
    groups.push({ title: 'หมวดหมู่ใหม่', slots: emptySlots() });
    renderAlbum();
  }

  function removeGroup(g) {
    if (groups.length <= 1) { alert('ต้องมีอย่างน้อย 1 หมวดหมู่'); return; }
    if (!confirm(`ลบหมวดหมู่ "${groups[g].title}" และรูปทั้งหมดในหมวดนี้?`)) return;
    groups.splice(g, 1);
    renderAlbum();
  }

  function renderAlbum() {
    const section = document.getElementById('albumSection');
    section.innerHTML = '';
    groups.forEach((group, g) => {
      const block = document.createElement('div');
      block.className = g < groups.length - 1 ? 'mb-10' : '';

      const header = document.createElement('div');
      header.className = 'flex items-center gap-3 mb-4';

      const titleInput = document.createElement('input');
      titleInput.type = 'text'; titleInput.value = group.title; titleInput.placeholder = 'ชื่อหมวดหมู่';
      titleInput.className = 'bg-white px-4 py-1 rounded-full text-sm outline-none border-none';
      titleInput.oninput = e => { groups[g].title = e.target.value; };

      const removeBtn = document.createElement('button');
      removeBtn.className = 'ml-auto bg-red-100 hover:bg-red-200 text-red-500 px-3 py-1 rounded-full text-xs transition';
      removeBtn.textContent = '🗑 ลบหมวดหมู่';
      removeBtn.onclick = () => removeGroup(g);

      header.appendChild(titleInput); header.appendChild(removeBtn); block.appendChild(header);

      const grid = document.createElement('div');
      grid.className = 'grid grid-cols-3 gap-6';
      group.slots.forEach((d, s) => {
        const hasImg = d && d.src; const hasData = d && (d.name || d.price || d.desc);
        const cell = document.createElement('div');
        cell.className = 'aspect-square border rounded-lg overflow-hidden relative bg-gray-200 cursor-pointer group';
        cell.onclick = () => openModal(g, s);
        if (hasImg) {
          cell.innerHTML = `<img src="${d.src}" class="absolute inset-0 w-full h-full object-cover transition duration-300 group-hover:scale-105"/>
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition">
              <span class="text-white text-xs font-semibold drop-shadow">✏️ แก้ไข</span>
              ${hasData ? `<span class="bg-green-400 text-white text-[10px] px-2 py-0.5 rounded-full">${d.name || 'มีข้อมูล'}</span>` : ''}
            </div>
            ${hasData ? `<span class="absolute top-2 right-2 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white"></span>` : ''}`;
        } else {
          cell.innerHTML = `<div class="absolute inset-0 flex flex-col items-center justify-center text-gray-400 text-sm gap-1 hover:bg-gray-300 transition"><span class="text-2xl">+</span><span>เลือกรูปภาพ</span></div>`;
        }
        grid.appendChild(cell);
      });
      block.appendChild(grid); section.appendChild(block);
    });
  }

  function openModal(g, s) {
    currentGroup = g; currentSlot = s; pendingImgBase64 = null;
    const d = groups[g].slots[s] || {};
    const imgEl = document.getElementById('modalImgEl');
    const ph = document.getElementById('modalImgPlaceholder');
    if (d.src) { imgEl.src = d.src; imgEl.classList.remove('hidden'); ph.classList.add('hidden'); }
    else { imgEl.src = ''; imgEl.classList.add('hidden'); ph.classList.remove('hidden'); }
    document.getElementById('editName').value = d.name || '';
    document.getElementById('editPrice').value = d.price || '';
    document.getElementById('editDesc').value = d.desc || '';
    document.getElementById('editDuration').value = d.duration || '';
    document.getElementById('modalFileInput').value = '';
    document.getElementById('editModal').classList.add('active');
  }

  function closeModal() { document.getElementById('editModal').classList.remove('active'); pendingImgBase64 = null; }

  function handleModalFile(event) {
    const file = event.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      pendingImgBase64 = e.target.result;
      const imgEl = document.getElementById('modalImgEl');
      imgEl.src = pendingImgBase64; imgEl.classList.remove('hidden');
      document.getElementById('modalImgPlaceholder').classList.add('hidden');
    };
    reader.readAsDataURL(file);
  }

  function saveSlot() {
    const existing = groups[currentGroup].slots[currentSlot] || {};
    groups[currentGroup].slots[currentSlot] = {
      src: pendingImgBase64 || existing.src || '',
      name: document.getElementById('editName').value.trim(),
      price: document.getElementById('editPrice').value.trim(),
      desc: document.getElementById('editDesc').value.trim(),
      duration: document.getElementById('editDuration').value.trim(),
    };
    persist(); renderAlbum(); closeModal();
  }

  function persist() {
    localStorage.setItem(`${STORAGE_KEY}_groups`, JSON.stringify(groups));
    localStorage.setItem(`${STORAGE_KEY}_slotData`, JSON.stringify(groups.map(g => g.slots)));
    localStorage.setItem(`${STORAGE_KEY}_albumTitles`, JSON.stringify(groups.map(g => g.title)));
    const pt = document.getElementById('pageTitleInput');
    if (pt) localStorage.setItem(`${STORAGE_KEY}_pageTitle`, pt.value);
    const fm = document.getElementById('footerMainInput');
    if (fm) localStorage.setItem(`${STORAGE_KEY}_footerMain`, fm.value);
    const fs = document.getElementById('footerSubInput');
    if (fs) localStorage.setItem(`${STORAGE_KEY}_footerSub`, fs.value);
  }

  function saveAll() { persist(); alert('บันทึกข้อมูลเรียบร้อย ✅'); }

  function resetAll() {
    if (!confirm('ต้องการล้างข้อมูลทั้งหมดหรือไม่?')) return;
    ['_groups','_slotData','_albumTitles','_pageTitle','_footerMain','_footerSub'].forEach(k => localStorage.removeItem(STORAGE_KEY + k));
    location.reload();
  }

  function loadAll() {
    const saved = JSON.parse(localStorage.getItem(`${STORAGE_KEY}_groups`));
    groups = (saved && saved.length > 0) ? saved : defaultGroups();

    const pt = localStorage.getItem(`${STORAGE_KEY}_pageTitle`);
    if (pt) document.getElementById('pageTitleInput').value = pt;

    const fm = localStorage.getItem(`${STORAGE_KEY}_footerMain`);
    if (fm) document.getElementById('footerMainInput').value = fm;

    const fs = localStorage.getItem(`${STORAGE_KEY}_footerSub`);
    if (fs) document.getElementById('footerSubInput').value = fs;

    renderAlbum();
  }

  document.getElementById('editModal').addEventListener('click', function(e) { if (e.target === this) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  window.addEventListener('DOMContentLoaded', loadAll);