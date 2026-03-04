const params    = new URLSearchParams(window.location.search);
    const bookingId = params.get('id') || 'booking_1';

    // ไม่โหลดสถานะจาก localStorage ตอนเปิดหน้า
    // หน้านี้จะแสดง "จองคิวสำเร็จ" เสมอเมื่อเปิดขึ้นมา

    function handleCancel() {
      document.getElementById('confirmModal').classList.remove('hidden');
    }

    function closeModal() {
      document.getElementById('confirmModal').classList.add('hidden');
    }

    function confirmCancel() {
      closeModal();
      localStorage.setItem('status_' + bookingId, 'cancelled');
      showCancelled();
      // กลับไป History1 ให้เห็นสถานะเปลี่ยน แล้วค่อยไป Cancel2
      setTimeout(() => {
        window.location.href = '/History/History1.html';
      }, 300);
      setTimeout(() => {
        window.location.href = '/History/Cancel 2.html';
      }, 1500);
    }

    function showCancelled() {
      document.getElementById('statusBadge').textContent = 'ยกเลิกแล้ว';
      document.getElementById('statusBadge').className   = 'px-4 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-600';
      document.getElementById('cancelBtn').style.display = 'none';
      document.getElementById('rebookBtn').style.display = 'block';
    }

    function rebookConfirm() {
      localStorage.removeItem('status_' + bookingId);
      document.getElementById('statusBadge').textContent = 'จองคิวสำเร็จ';
      document.getElementById('statusBadge').className   = 'px-4 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-600';
      document.getElementById('cancelBtn').style.display = 'block';
      document.getElementById('rebookBtn').style.display = 'none';
    }