const STORAGE_KEY = 'nail';
  const GROUPS = 3;
  const SLOTS_PER_GROUP = 6;
  const DEFAULT_TITLES = ['ลายพื้นฐาน', 'ลายยอดนิยม', 'ลายแฟชั่น'];

  let slotData = Array.from({ length: GROUPS }, () =>
    Array(SLOTS_PER_GROUP).fill(null).map(() => ({}))
  );

  function loadFromAdmin() {
    // main title
    const mainTitle = localStorage.getItem(`${STORAGE_KEY}_mainTitle`);
    if (mainTitle) document.getElementById('mainTitle').textContent = mainTitle;

    // group titles
    const savedTitles = JSON.parse(localStorage.getItem(`${STORAGE_KEY}_albumTitles`)) || [];
    for (let g = 0; g < GROUPS; g++) {
      const el = document.getElementById(`title-${g}`);
      if (el) el.textContent = savedTitles[g] || DEFAULT_TITLES[g];
    }

    // slot data จากแอดมิน (nail_slotData)
    const savedSlots = JSON.parse(localStorage.getItem(`${STORAGE_KEY}_slotData`));
    if (savedSlots) slotData = savedSlots;
  }

  function renderGrids() {
    for (let g = 0; g < GROUPS; g++) {
      const grid = document.getElementById(`grid-${g}`);
      const groupLabel = document.getElementById(`title-${g}`).textContent;
      grid.innerHTML = '';

      for (let s = 0; s < SLOTS_PER_GROUP; s++) {
        const d = slotData[g][s] || {};
        if (!d.src) continue; // ไม่แสดงช่องที่ยังไม่มีรูป

        const hasData = d.name || d.price || d.desc;

        const card = document.createElement('div');
        card.className = 'img-card' + (hasData ? ' has-data' : '');
        card.onclick = () => openModal(d, groupLabel);
        card.innerHTML = `
          <img src="${d.src}" alt="${d.name || groupLabel}" loading="lazy"/>
          <div class="overlay-hint">
            <span class="text-white text-xs font-semibold">
              ${d.name || 'คลิกเพื่อดูรายละเอียด'}
            </span>
          </div>
        `;
        grid.appendChild(card);
      }
    }
  }

  function openModal(d, groupLabel) {
    document.getElementById('modalImg').src = d.src || '';
    document.getElementById('modalTitle').textContent = d.name || groupLabel;
    document.getElementById('modalCategory').textContent = groupLabel;
    document.getElementById('viewPrice').textContent = d.price ? d.price + ' บาท' : '-';
    document.getElementById('viewDesc').textContent = d.desc || '-';
    document.getElementById('viewDuration').textContent = d.duration || '-';
    document.getElementById('imgModal').classList.add('active');
  }

  function closeModal() {
    document.getElementById('imgModal').classList.remove('active');
  }

  document.getElementById('imgModal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  window.addEventListener('DOMContentLoaded', () => {
    loadFromAdmin();
    renderGrids();
  });