// ========================================================
//  storage.js  —  Charm Beauty & Salon
//  Central localStorage helper
//  ใช้ทุกหน้า: <script src="/customer/storage.js"></script>
// ========================================================

const CharmStorage = (() => {

  // ---------- Keys ----------
  const KEYS = {
    USERNAME   : 'charm_username',
    EMAIL      : 'charm_email',
    PHONE      : 'charm_phone',
    LOGGED_IN  : 'charm_logged_in',
    PENDING_EMAIL : 'charm_pending_email',   // อีเมลที่กำลังกู้รหัสผ่าน
    BOOKINGS   : 'charm_bookings',           // รายการจอง (JSON array)
    NOTIFICATIONS: 'charm_notifications',    // การแจ้งเตือน (JSON array)
  };

  // ---------- Generic helpers ----------
  function get(key)        { return localStorage.getItem(key); }
  function set(key, value) { localStorage.setItem(key, value); }
  function remove(key)     { localStorage.removeItem(key); }

  function getJSON(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch { return []; }
  }
  function setJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // ---------- Auth ----------
  function isLoggedIn() {
    return get(KEYS.LOGGED_IN) === 'true';
  }

  function login(username, email = '') {
    set(KEYS.USERNAME,  username);
    set(KEYS.LOGGED_IN, 'true');
    if (email) set(KEYS.EMAIL, email);
  }

  function logout() {
    remove(KEYS.LOGGED_IN);
    // เก็บ username / email / phone ไว้ (ไม่ล้าง)
  }

  // ---------- Profile ----------
  function getProfile() {
    return {
      username : get(KEYS.USERNAME) || '',
      email    : get(KEYS.EMAIL)    || '',
      phone    : get(KEYS.PHONE)    || '',
    };
  }

  function saveProfile(username, email, phone) {
    set(KEYS.USERNAME, username);
    set(KEYS.EMAIL,    email);
    set(KEYS.PHONE,    phone);
  }

  // ---------- Password-recovery flow ----------
  function setPendingEmail(email) { set(KEYS.PENDING_EMAIL, email); }
  function getPendingEmail()      { return get(KEYS.PENDING_EMAIL) || ''; }
  function clearPendingEmail()    { remove(KEYS.PENDING_EMAIL); }

  // ---------- Bookings ----------
  function getBookings()         { return getJSON(KEYS.BOOKINGS); }
  function saveBookings(arr)     { setJSON(KEYS.BOOKINGS, arr); }
  function addBooking(booking) {
    const arr = getBookings();
    booking.id = Date.now();
    arr.push(booking);
    saveBookings(arr);
    return booking;
  }
  function removeBooking(id) {
    saveBookings(getBookings().filter(b => b.id !== id));
  }

  // ---------- Notifications ----------
  function getNotifications()     { return getJSON(KEYS.NOTIFICATIONS); }
  function saveNotifications(arr) { setJSON(KEYS.NOTIFICATIONS, arr); }
  function addNotification(note) {
    const arr = getNotifications();
    note.id   = Date.now();
    note.read = false;
    arr.unshift(note);        // ใหม่ขึ้นก่อน
    saveNotifications(arr);
    return note;
  }
  function markAllRead() {
    saveNotifications(getNotifications().map(n => ({ ...n, read: true })));
  }
  function unreadCount() {
    return getNotifications().filter(n => !n.read).length;
  }

  // ---------- Guard: redirect to login if not logged in ----------
  function requireLogin(loginUrl = '/customer/login2/login1.html') {
    if (!isLoggedIn()) {
      window.location.href = loginUrl;
      return false;
    }
    return true;
  }

  // ---------- Public API ----------
  return {
    KEYS,
    isLoggedIn,
    login,
    logout,
    getProfile,
    saveProfile,
    setPendingEmail,
    getPendingEmail,
    clearPendingEmail,
    getBookings,
    saveBookings,
    addBooking,
    removeBooking,
    getNotifications,
    saveNotifications,
    addNotification,
    markAllRead,
    unreadCount,
    requireLogin,
  };

})();