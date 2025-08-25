document.addEventListener('DOMContentLoaded', () => {
  const alarmList = document.getElementById('alarm-list');

  // 저장된 알림 불러오기
  const savedAlarms = JSON.parse(localStorage.getItem('alarms')) || [];
  savedAlarms.forEach(addAlarmToUI);

  // 설정에서 저장한 시간 불러오기
  const settings = JSON.parse(localStorage.getItem('settings')) || {};
  if (settings.alarmState === 'on') {
    simulateAlarm(settings.hour, settings.minute); // ✅ 실제 모드만
  }
});

// ✅ dataset 버전
function addAlarmToUI(alarm, save = false) {
  const alarmList = document.getElementById('alarm-list');

  const li = document.createElement('li');
  li.className = 'alarm-item';
  li.dataset.checked = alarm.checked ? 'true' : 'false';
  li.innerHTML = `
    <span class="alarm-icon">${
      alarm.checked ? checkedIcon() : uncheckedIcon()
    }</span>
    <span class="alarm-text">${alarm.message}</span>
  `;

  // 클릭 시 읽음으로 고정
  li.addEventListener('click', (e) => {
    e.stopPropagation();
    if (li.dataset.checked === 'false') {
      li.dataset.checked = 'true';
      alarm.checked = true;
      li.querySelector('.alarm-icon').innerHTML = checkedIcon();
      saveAlarms();
    }
  });

  alarmList.prepend(li);

  if (save) {
    const savedAlarms = JSON.parse(localStorage.getItem('alarms')) || [];
    savedAlarms.unshift(alarm);
    localStorage.setItem('alarms', JSON.stringify(savedAlarms));
  }
}

// 알림 시뮬레이션 (실제 모드만)
function simulateAlarm(hour, minute) {
  const now = new Date();
  const target = new Date();

  target.setHours(parseInt(hour), parseInt(minute), 0, 0);

  let delay = target - now;
  if (delay < 0) delay += 24 * 60 * 60 * 1000; // 이미 지났으면 내일 실행

  setTimeout(() => {
    const alarm = {
      message: '똑똑! 나의 가족의 하루 안부가 도착했어요,<br> 확인해 보세요!',
      checked: false,
    };
    addAlarmToUI(alarm, true);
  }, delay); // ✅ 실제 delay 사용
}

// localStorage 업데이트 (전체 재저장)
function saveAlarms() {
  const alarms = [];
  document.querySelectorAll('.alarm-item').forEach((li) => {
    alarms.push({
      message: li.querySelector('.alarm-text').textContent,
      checked: li.dataset.checked === 'true',
    });
  });
  localStorage.setItem('alarms', JSON.stringify(alarms));
}

// 아이콘 (확인 안 한 알람)
function uncheckedIcon() {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="30" viewBox="0 0 26 30" fill="none">
    <path d="M8.47363 25.5905L16.6528 25.5475C16.1371 28.6983 12.4046 30.1089 9.93297 28.0867C9.16286 27.4566 8.64492 26.5707 8.47363 25.5905Z" fill="#757575"/>
    <path opacity="0.3" d="M12.44 2.06555C15.1901 2.05107 17.8333 3.12964 19.7881 5.06399C21.7429 6.99835 22.8493 9.63003 22.8638 12.3801L22.8929 17.9103L24.8763 22.2689C24.9665 22.4682 25.0055 22.6869 24.9897 22.9051C24.9739 23.1234 24.9038 23.3342 24.7858 23.5185C24.6678 23.7027 24.5057 23.8546 24.3141 23.9603C24.1225 24.066 23.9076 24.1221 23.6888 24.1236L1.42967 24.2408C1.21058 24.242 0.994693 24.1883 0.801662 24.0846C0.608631 23.981 0.444593 23.8307 0.324483 23.6475C0.204374 23.4642 0.13201 23.2539 0.113982 23.0355C0.0959527 22.8172 0.132832 22.5978 0.22126 22.3973L2.15457 18.0181L2.12536 12.4713L2.13045 12.1257C2.21089 9.44003 3.33062 6.89048 5.25375 5.01415C7.17687 3.13782 9.75322 2.07982 12.44 2.06555Z" fill="#757575"/>
    <circle cx="20.1084" cy="5.497" r="4.24704" fill="#FF8B00" stroke="#FAFAFA" stroke-width="1.5"/>
  </svg>`;
}

// 아이콘 (확인한 알람)
function checkedIcon() {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="27" viewBox="0 0 25 27" fill="none">
    <path d="M8.45801 23.2493L16.622 23.2063C16.1072 26.3513 12.3817 27.7593 9.91463 25.7409C9.14595 25.112 8.62897 24.2277 8.45801 23.2493Z" fill="#757575"/>
    <path opacity="0.3" d="M12.4169 0.0653989C15.1618 0.0509447 17.8001 1.12751 19.7513 3.05827C21.7025 4.98902 22.8068 7.61581 22.8212 10.3608L22.8503 15.8807L24.8301 20.2311C24.9201 20.4301 24.959 20.6484 24.9432 20.8662C24.9274 21.084 24.8574 21.2945 24.7397 21.4784C24.6219 21.6623 24.4601 21.8139 24.2689 21.9194C24.0776 22.0249 23.8631 22.0809 23.6447 22.0824L1.42701 22.1994C1.20833 22.2006 0.992843 22.147 0.800171 22.0435C0.607499 21.9401 0.443766 21.7901 0.32388 21.6072C0.203994 21.4243 0.131765 21.2143 0.113769 20.9963C0.0957741 20.7784 0.132584 20.5594 0.220848 20.3593L2.15056 15.9883L2.12141 10.4518L2.12649 10.1068C2.20677 7.42616 3.32443 4.88135 5.24397 3.00851C7.16352 1.13567 9.73507 0.0796465 12.4169 0.0653989Z" fill="#757575"/>
  </svg>`;
}

// ===== 상단 버튼 이동 처리 =====
document.addEventListener('DOMContentLoaded', () => {
  const profileBtn = document.getElementById('profile-btn');
  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      window.location.href = '/mypage/mypage.html';
    });
  }

  const calendarBtn = document.getElementById('calendar-btn');
  if (calendarBtn) {
    calendarBtn.addEventListener('click', () => {
      window.location.href = '/calendar/calendar.html';
    });
  }

  const homeBtn = document.getElementById('home-btn');
  if (homeBtn) {
    homeBtn.addEventListener('click', () => {
      window.location.href = '/login_signup_home/home/home.html';
    });
  }
});
