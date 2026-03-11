// ===== _notification.js  (ใช้ CharmStorage) =====
// ต้องโหลด storage.js ก่อน: <script src="/customer/storage.js"></script>

document.addEventListener('DOMContentLoaded', function () {

  // Guard
  CharmStorage.requireLogin('/customer/login2/login1.html');

  // ===== Mark all notifications as read =====
  CharmStorage.markAllRead();

  // ===== Render notifications =====
  renderNotifications();
});

function renderNotifications() {
  const container = document.getElementById('noti-list');
  if (!container) return;

  const notifications = CharmStorage.getNotifications();

  if (notifications.length === 0) {
    container.innerHTML = `
      <div class="text-center text-gray-400 py-10">ยังไม่มีการแจ้งเตือน</div>
    `;
    return;
  }

  container.innerHTML = notifications.map(n => `
    <div class="bg-pink-100 rounded-3xl p-6 shadow-md mb-4">
      <p class="font-bold text-xl">${escapeHtml(n.message)}</p>
      ${n.detail ? `<p class="text-gray-500 text-sm mt-2">${escapeHtml(n.detail)}</p>` : ''}
      ${n.date   ? `<p class="text-gray-400 text-xs mt-1">${escapeHtml(n.date)}</p>`   : ''}
    </div>
  `).join('');
}

// ===== Helper: ป้องกัน XSS =====
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ===== ฟังก์ชันเพิ่มการแจ้งเตือน (เรียกจากหน้าจอง) =====
// ตัวอย่าง: CharmStorage.addNotification({ message: 'นัดคิว 15:00', detail: '1.ตัดผม', date: '12 มี.ค. 2569' });