document.addEventListener('DOMContentLoaded', () => {
  const toggles = document.querySelectorAll('.toggle-btn');
  const saveBtn = document.querySelector('.save-btn');
  const alarmExtra = document.getElementById('alarm-extra');
  const alarmToggle = document.querySelector('.toggle-btn[data-type="alarm"]');

  // 초기 상태 로드
  const savedSettings = JSON.parse(localStorage.getItem('settings')) || {};

  if (savedSettings.alarmState === 'on') {
    alarmToggle.setAttribute('src', 'toggle-on.svg');
    alarmToggle.dataset.state = 'on';
    alarmExtra.classList.remove('hidden');

    // 요일 복원
    document.querySelectorAll('.day-btn').forEach((btn) => {
      if (savedSettings.days?.includes(btn.textContent)) {
        btn.classList.add('active');
      }
    });

    // 시간 복원
    if (savedSettings.hour)
      document.getElementById('hour').value = savedSettings.hour;
    if (savedSettings.minute)
      document.getElementById('minute').value = savedSettings.minute;
  }

  if (savedSettings.soundState === 'on') {
    const soundToggle = document.querySelector(
      '.toggle-btn[data-type="sound"]'
    );
    soundToggle.setAttribute('src', 'toggle-on.svg');
    soundToggle.dataset.state = 'on';
  }

  // 토글 버튼 동작
  toggles.forEach((btn) => {
    btn.dataset.state = btn.dataset.state || 'off';

    btn.addEventListener('click', () => {
      const type = btn.dataset.type;
      const state = btn.dataset.state;

      if (state === 'on') {
        btn.setAttribute('src', 'toggle-off.svg');
        btn.dataset.state = 'off';
        if (type === 'alarm') {
          alarmExtra.classList.add('hidden');
          document.querySelectorAll('.day-btn').forEach((dayBtn) => {
            dayBtn.classList.remove('active');
          });
        }
      } else {
        btn.setAttribute('src', 'toggle-on.svg');
        btn.dataset.state = 'on';
        if (type === 'alarm') {
          alarmExtra.classList.remove('hidden');
          document.querySelectorAll('.day-btn').forEach((dayBtn) => {
            dayBtn.classList.add('active');
          });
        }
      }
    });
  });

  // 요일 버튼 개별 토글
  document.querySelectorAll('.day-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (alarmToggle?.dataset.state === 'on') {
        btn.classList.toggle('active');
      }
    });
  });

  // 저장하기 버튼
  saveBtn.addEventListener('click', () => {
    const days = [...document.querySelectorAll('.day-btn.active')].map(
      (btn) => btn.textContent
    );
    const hour = document.getElementById('hour').value;
    const minute = document.getElementById('minute').value;

    const settings = {
      alarmState: alarmToggle.dataset.state,
      soundState: document.querySelector('.toggle-btn[data-type="sound"]')
        .dataset.state,
      days,
      hour,
      minute,
    };

    // ✅ localStorage 저장
    localStorage.setItem('settings', JSON.stringify(settings));

    console.log('저장된 설정:', settings);

    // 저장 후 이동
    window.location.href = '/mypage/mypage.html';
  });

  // 홈 버튼
  const homeBtn = document.querySelector(
    '.topbar-left button[aria-label="홈"]'
  );
  homeBtn?.addEventListener('click', () => {
    window.location.href = '/login_signup_home/home/home.html';
  });

  // 알림 버튼
  const alarmBtn = document.querySelector(
    '.topbar-left button[aria-label="알림"]'
  );
  alarmBtn?.addEventListener('click', () => {
    const userType = localStorage.getItem('selectedOption'); // guardian | senior
    if (userType === 'guardian') {
      window.location.href = '/alarm/alarm_g/alarm_g.html';
    } else {
      window.location.href = '/alarm/alarm_s/alarm_s.html';
    }
  });
});
