 const thMonths = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน',
                      'กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
    const today = new Date(); today.setHours(0,0,0,0);
    let calYear = today.getFullYear(), calMonth = today.getMonth(), selectedDate = null;

    function toggleCalendar() { document.getElementById('calendarPopup').classList.toggle('hidden'); }
    function closeCalendar()  { document.getElementById('calendarPopup').classList.add('hidden'); }
    document.addEventListener('click', e => {
      if (!document.getElementById('calendarPopup').contains(e.target) &&
          !document.getElementById('dateDisplay').contains(e.target)) closeCalendar();
    });
    function prevMonth() { calMonth--; if(calMonth<0){calMonth=11;calYear--;} renderCalendar(); }
    function nextMonth() { calMonth++; if(calMonth>11){calMonth=0;calYear++;} renderCalendar(); }

    function renderCalendar() {
      document.getElementById('monthLabel').textContent = thMonths[calMonth]+' '+(calYear+543);
      const grid = document.getElementById('daysGrid');
      grid.innerHTML = '';
      const first = new Date(calYear,calMonth,1).getDay();
      const days  = new Date(calYear,calMonth+1,0).getDate();

      for(let i=0;i<first;i++){
        const e = document.createElement('div');
        grid.appendChild(e);
      }

      for(let d=1;d<=days;d++){
        const date = new Date(calYear,calMonth,d);
        const isPast   = date < today;
        const isSel    = selectedDate && selectedDate.getTime()===date.getTime();
        const isToday  = date.getTime()===today.getTime();
        const el = document.createElement('div');

        // Tailwind classes แทน .cal-day CSS
        let cls = 'aspect-square flex items-center justify-center rounded-full text-xs font-semibold cursor-pointer transition-all';
        if(isPast)       cls += ' text-gray-300 cursor-not-allowed';
        else if(isSel)   cls += ' bg-pink-500 text-white';
        else if(isToday) cls += ' border-2 border-pink-500 text-pink-500 hover:bg-pink-100';
        else             cls += ' hover:bg-pink-200 text-gray-700';

        el.className = cls;
        el.textContent = d;

        if(!isPast) el.onclick = () => {
          selectedDate = new Date(calYear,calMonth,d);
          const lbl = document.getElementById('dateLabel');
          lbl.textContent = d+' '+thMonths[calMonth]+' '+(calYear+543);
          lbl.className = 'text-gray-800 text-sm font-semibold';
          renderCalendar();
          closeCalendar();
        };
        grid.appendChild(el);
      }
    }
    renderCalendar();

    // ===== ข้อมูลบริการ =====
    const runtimeOptions = {
      nail:[
        {label:'ต่อเล็บอะคริลิค',price:1500},{label:'เติมโคนอะคริลิค',price:800},
        {label:'ถอดเล็บอะคริลิค',price:500},{label:'ทาสีเจลมือ / เท้า',price:900},
        {label:'ถอดเล็บ',price:100},{label:'ทาสี',price:200},
        {label:'ทาสีแฟนซี',price:200},{label:'ไล่สี',price:200},{label:'เพ้นท์',price:50},
      ],
      hair:[
        {label:'ตัดผมชาย',price:100},{label:'ตัดผมสตรี',price:150},
        {label:'สระ-ไดร์',price:100},{label:'ทำสีผม',price:350},
        {label:'ไฮไลท์ / โอทโทน',price:350},{label:'ดัดลอน',price:300},
        {label:'ยืดผม',price:400},{label:'ทรีตเมนต์',price:100},
      ],
      makeup:[
        {label:'แต่งหน้าธรรมดา',price:250},{label:'แต่งหน้าไปงาน',price:350},
        {label:'รับปริญญา / เจ้าสาว',price:1500},{label:'ถ่ายภาพ / พรีเวดดิ้ง',price:150},
        {label:'ปรับบุคลิก',price:600},
      ],
    };
    const serviceLabels = {nail:'ทำเล็บ', hair:'ทำผม', makeup:'Makeup'};

    function onServiceChange() { renderOptions(); }

    function renderOptions() {
      const svc = document.getElementById('service').value;
      const left = document.getElementById('optionsLeft');
      const right = document.getElementById('optionsRight');
      const emptyMsg = document.getElementById('emptyMsg');
      left.innerHTML=''; right.innerHTML='';

      if(!svc || !runtimeOptions[svc] || runtimeOptions[svc].length===0){
        emptyMsg.style.display='block'; return;
      }
      emptyMsg.style.display='none';

      const opts = runtimeOptions[svc];
      const half = Math.ceil(opts.length/2);
      opts.forEach((opt,idx)=>{
        const container = idx<half ? left : right;
        const row = document.createElement('label');
        row.className = 'flex justify-between items-center gap-2 text-sm py-1 px-2 rounded-lg hover:bg-pink-200 cursor-pointer transition';
        row.innerHTML = `
          <span class="flex items-center gap-2 flex-1 min-w-0">
            <input type="radio" name="opt" value="${idx}" onchange="onOptChange()" class="accent-pink-500">
            <span class="truncate">${opt.label}</span>
          </span>
          <span class="flex items-center gap-2 whitespace-nowrap flex-shrink-0">
            <span class="text-pink-600 font-semibold text-xs">${opt.price ? opt.price.toLocaleString()+' ฿' : ''}</span>
            <button type="button" onclick="deleteOption('${svc}',${idx})"
              class="w-5 h-5 rounded-full bg-red-100 hover:bg-red-200 text-red-400 hover:text-red-600 text-xs font-bold flex items-center justify-center transition">✕</button>
          </span>`;
        container.appendChild(row);
      });
    }

    function addOption() {
      const svc = document.getElementById('service').value;
      const label = document.getElementById('newOptionInput').value.trim();
      const price = parseInt(document.getElementById('newOptionPrice').value)||0;
      if(!svc){ showToast('กรุณาเลือกบริการก่อน','⚠️'); return; }
      if(!label){ showToast('กรุณากรอกชื่อตัวเลือก','⚠️'); return; }
      runtimeOptions[svc].push({label,price});
      document.getElementById('newOptionInput').value='';
      document.getElementById('newOptionPrice').value='';
      renderOptions();
      showToast('เพิ่ม "'+label+'" เรียบร้อย','✅');
    }

    function deleteOption(svc,idx) {
      const name = runtimeOptions[svc][idx].label;
      if(confirm('ลบ "'+name+'" ออกหรือไม่?')){
        runtimeOptions[svc].splice(idx,1);
        renderOptions();
        showToast('ลบ "'+name+'" เรียบร้อย','🗑️');
      }
    }

    function addService() {
      const key = prompt('รหัสบริการ (ภาษาอังกฤษ ไม่มีช่องว่าง เช่น facial):');
      if(!key) return;
      const k = key.trim().toLowerCase().replace(/\s+/g,'_');
      if(runtimeOptions[k]){ showToast('มีบริการนี้อยู่แล้ว','⚠️'); return; }
      const label = prompt('ชื่อแสดงผล (ภาษาไทย):');
      if(!label) return;
      runtimeOptions[k]=[];
      serviceLabels[k]=label;
      const sel = document.getElementById('service');
      const opt = document.createElement('option');
      opt.value=k; opt.textContent=label;
      sel.appendChild(opt); sel.value=k;
      renderOptions();
      showToast('เพิ่มบริการ "'+label+'" เรียบร้อย','✅');
    }

    function onOptChange() {
      const btn = document.getElementById('attachBtn');
      btn.disabled = false;
      btn.className = 'px-8 py-2 rounded-full bg-pink-200 hover:bg-pink-300 border font-semibold text-sm cursor-pointer transition';
    }

    // ===== แนบรูป =====
    let uploadedFile = null;
    function onFileUpload(input) {
      if(input.files && input.files[0]){
        uploadedFile = input.files[0];
        const name = uploadedFile.name;
        document.getElementById('fileName').textContent = '📷 '+(name.length>20 ? name.slice(0,18)+'...' : name);
        document.getElementById('attachedLabel').style.display='flex';
      }
    }
    function removeFile() {
      uploadedFile = null;
      document.getElementById('upload').value='';
      document.getElementById('attachedLabel').style.display='none';
    }

    // ===== บันทึก =====
    let records = [];

    function handleConfirm() {
      const dateText = document.getElementById('dateLabel').textContent;
      const time = document.getElementById('timeInput').value;
      const svcEl = document.getElementById('service');
      const svcVal = svcEl.value;
      const svcText = svcVal ? (serviceLabels[svcVal] || svcEl.options[svcEl.selectedIndex].text) : '';
      const chosen = document.querySelector('input[name="opt"]:checked');

      if(dateText==='วัน/เดือน/ปี'){ showToast('กรุณาเลือกวันที่','⚠️'); return; }
      if(!time){ showToast('กรุณาเลือกเวลา','⚠️'); return; }
      if(!svcVal){ showToast('กรุณาเลือกบริการ','⚠️'); return; }
      if(!chosen){ showToast('กรุณาเลือกตัวเลือก','⚠️'); return; }

      const opt = runtimeOptions[svcVal][parseInt(chosen.value)];
      const imgUrl = uploadedFile ? URL.createObjectURL(uploadedFile) : null;
      records.push({ id:Date.now(), date:dateText, time, service:svcText, option:opt.label, price:opt.price, imgUrl });
      renderSummary();

      // reset
      selectedDate = null;
      const lbl = document.getElementById('dateLabel');
      lbl.textContent='วัน/เดือน/ปี'; lbl.className='text-gray-400 text-sm font-semibold';
      document.getElementById('timeInput').value='';
      document.getElementById('service').value='';
      document.getElementById('optionsLeft').innerHTML='';
      document.getElementById('optionsRight').innerHTML='';
      document.getElementById('emptyMsg').style.display='block';
      removeFile();
      const btn = document.getElementById('attachBtn');
      btn.disabled=true;
      btn.className='px-8 py-2 rounded-full bg-gray-200 border font-semibold cursor-not-allowed text-sm text-gray-400';
      renderCalendar();
      showToast('บันทึกสำเร็จ! 🎉','✅');
    }

    function renderSummary() {
      document.getElementById('summarySection').style.display='block';
      const tbody = document.getElementById('summaryBody');
      tbody.innerHTML='';
      records.forEach((r,i)=>{
        const tr = document.createElement('tr');
        tr.className = i%2===0 ? 'bg-white' : 'bg-pink-50';
        tr.innerHTML=`
          <td class="py-3 px-4 text-gray-700">${r.date}</td>
          <td class="py-3 px-4 text-gray-700">${r.time}</td>
          <td class="py-3 px-4">
            <span class="px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full text-xs font-semibold">${r.service}</span>
          </td>
          <td class="py-3 px-4 text-gray-700">${r.option}</td>
          <td class="py-3 px-4 text-right font-bold text-pink-600">${r.price ? r.price.toLocaleString()+' ฿' : '-'}</td>
          <td class="py-3 px-4 text-center">
            ${r.imgUrl
              ? `<img src="${r.imgUrl}" class="w-10 h-10 object-cover rounded-lg mx-auto border border-pink-200 cursor-pointer hover:opacity-80" onclick="viewImg('${r.imgUrl}')">`
              : '<span class="text-gray-300 text-xs">-</span>'}
          </td>
          <td class="py-3 px-4 text-center">
            <button onclick="deleteRecord(${r.id})"
              class="w-7 h-7 rounded-full bg-red-100 hover:bg-red-200 text-red-500 text-xs font-bold transition">✕</button>
          </td>`;
        tbody.appendChild(tr);
      });

      const total = records.reduce((s,r)=>s+(r.price||0), 0);
      const tf = document.createElement('tr');
      tf.className='bg-pink-400 text-white font-bold';
      tf.innerHTML=`
        <td colspan="4" class="py-3 px-4 text-right">รวม ${records.length} รายการ</td>
        <td class="py-3 px-4 text-right">${total.toLocaleString()} ฿</td>
        <td colspan="2"></td>`;
      tbody.appendChild(tf);
    }

    function deleteRecord(id) {
      if(confirm('ลบรายการนี้ออกหรือไม่?')){
        records = records.filter(r=>r.id!==id);
        if(records.length===0) document.getElementById('summarySection').style.display='none';
        else renderSummary();
        showToast('ลบรายการเรียบร้อย','🗑️');
      }
    }

    function viewImg(url) {
      const m = document.createElement('div');
      m.className='fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50';
      m.innerHTML=`<div class="relative">
        <img src="${url}" class="rounded-2xl shadow-2xl max-w-screen-sm max-h-screen" style="max-width:90vw;max-height:80vh;">
        <button onclick="this.closest('.fixed').remove()"
          class="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full font-bold text-gray-700 shadow hover:bg-pink-100 flex items-center justify-center">✕</button>
      </div>`;
      m.onclick=e=>{ if(e.target===m) m.remove(); };
      document.body.appendChild(m);
    }

    // ===== Toast (ใช้ JS inject Tailwind classes แทน CSS animation) =====
    function showToast(msg, icon='ℹ️') {
      const t = document.createElement('div');
      t.className='fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-white border border-pink-200 shadow-xl rounded-2xl px-5 py-3 text-sm font-semibold text-gray-700 opacity-0 translate-y-3 transition-all duration-300';
      t.innerHTML=`<span class="text-lg">${icon}</span>${msg}`;
      document.body.appendChild(t);
      requestAnimationFrame(()=>{
        t.classList.remove('opacity-0','translate-y-3');
      });
      setTimeout(()=>{
        t.classList.add('opacity-0','translate-y-3');
        setTimeout(()=>t.remove(), 300);
      }, 2500);
    }