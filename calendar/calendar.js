document.addEventListener('DOMContentLoaded', () => {
  const calendar = document.getElementById('calendar');
  const headerText = document.getElementById('calendar-header-text');
  const prevBtn = document.getElementById('prev-month');
  const nextBtn = document.getElementById('next-month');

  function formatDate(year, month, day) {
    const y = year;
    const m = String(month + 1).padStart(2, '0'); // month는 0부터 시작
    const d = String(day).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // 📌 기분별 아이콘 (SVG 문자열) - 'soso' 키는 올바르게 수정되었습니다.
  const moodIcons = {
    bad: `
      <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
        <path d="M17.5 34.5C8.1109 34.5 0.5 26.8891 0.5 17.5C0.5 8.1109 8.1109 0.5 17.5 0.5C26.8891 0.5 34.5 8.1109 34.5 17.5C34.5 26.8891 26.8891 34.5 17.5 34.5ZM9 26H12.4C12.4 24.6474 12.9373 23.3502 13.8938 22.3938C14.8502 21.4373 16.1474 20.9 17.5 20.9C18.8526 20.9 20.1498 21.4373 21.1062 22.3938C22.0627 23.3502 22.6 24.6474 22.6 26H26C26 23.7457 25.1045 21.5837 23.5104 19.9896C21.9163 18.3955 19.7543 17.5 17.5 17.5C15.2457 17.5 13.0837 18.3955 11.4896 19.9896C9.89553 21.5837 9 23.7457 9 26ZM10.7 15.8C11.3763 15.8 12.0249 15.5313 12.5031 15.0531C12.9813 14.5749 13.25 13.9263 13.25 13.25C13.25 12.5737 12.9813 11.9251 12.5031 11.4469C12.0249 10.9687 11.3763 10.7 10.7 10.7C10.0237 10.7 9.3751 10.9687 8.89688 11.4469C8.41866 11.9251 8.15 12.5737 8.15 13.25C8.15 13.9263 8.41866 14.5749 8.89688 15.0531C9.3751 15.5313 10.0237 15.8 10.7 15.8ZM24.3 15.8C24.9763 15.8 25.6249 15.5313 26.1031 15.0531C26.5813 14.5749 26.85 13.9263 26.85 13.25C26.85 12.5737 26.5813 11.9251 26.1031 11.4469C25.6249 10.9687 24.9763 10.7 24.3 10.7C23.6237 10.7 22.9751 10.9687 22.4969 11.4469C22.0187 11.9251 21.75 12.5737 21.75 13.25C21.75 13.9263 22.0187 14.5749 22.4969 15.0531C22.9751 15.5313 23.6237 15.8 24.3 15.8Z" fill="#FF8C8C"/>
      </svg>
    `,
    soso: `
      <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
        <path d="M17.5 0.5C15.2675 0.5 13.0569 0.939718 10.9944 1.79405C8.93185 2.64838 7.05778 3.90059 5.47919 5.47919C2.29107 8.6673 0.5 12.9913 0.5 17.5C0.5 22.0087 2.29107 26.3327 5.47919 29.5208C7.05778 31.0994 8.93185 32.3516 10.9944 33.206C13.0569 34.0603 15.2675 34.5 17.5 34.5C22.0087 34.5 26.3327 32.7089 29.5208 29.5208C32.7089 26.3327 34.5 22.0087 34.5 17.5C34.5 15.2675 34.0603 13.0569 33.206 10.9944C32.3516 8.93185 31.0994 7.05778 29.5208 5.47919C27.9422 3.90059 26.0682 2.64838 24.0056 1.79405C21.9431 0.939718 19.7325 0.5 17.5 0.5ZM9 13.25C9 12.5737 9.26866 11.9251 9.74688 11.4469C10.2251 10.9687 10.8737 10.7 11.55 10.7C12.2263 10.7 12.8749 10.9687 13.3531 11.4469C13.8313 11.9251 14.1 12.5737 14.1 13.25C14.1 13.9263 13.8313 14.5749 13.3531 15.0531C12.8749 15.5313 12.2263 15.8 11.55 15.8C10.8737 15.8 10.2251 15.5313 9.74688 15.0531C9.26866 14.5749 9 13.9263 9 13.25ZM24.3 24.3H10.7V20.9H24.3V24.3ZM23.45 15.8C22.7737 15.8 22.1251 15.5313 21.6469 15.0531C21.1687 14.5749 20.9 13.9263 20.9 13.25C20.9 12.5737 21.1687 11.9251 21.6469 11.4469C22.1251 10.9687 22.7737 10.7 23.45 10.7C24.1263 10.7 24.7749 10.9687 25.2531 11.4469C25.7313 11.9251 26 12.5737 26 13.25C26 13.9263 25.7313 14.5749 25.2531 15.0531C24.7749 15.5313 24.1263 15.8 23.45 15.8Z" fill="#FCC57B"/>
      </svg>
    `,
    good: `
      <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M17.5 34.5C22.0087 34.5 26.3327 32.7089 29.5208 29.5208C32.7089 26.3327 34.5 22.0087 34.5 17.5C34.5 12.9913 32.7089 8.6673 29.5208 5.47919C26.3327 2.29107 22.0087 0.5 17.5 0.5C12.9913 0.5 8.6673 2.29107 5.47919 5.47919C2.29107 8.6673 0.5 12.9913 0.5 17.5C0.5 22.0087 2.29107 26.3327 5.47919 29.5208C8.6673 32.7089 12.9913 34.5 17.5 34.5ZM11.125 13.25C11.6886 13.25 12.2291 13.0261 12.6276 12.6276C13.0261 12.2291 13.25 11.6886 13.25 11.125C13.25 10.5614 13.0261 10.0209 12.6276 9.6224C12.2291 9.22388 11.6886 9 11.125 9C10.5614 9 10.0209 9.22388 9.6224 9.6224C9.22388 10.0209 9 10.5614 9 11.125C9 11.6886 9.22388 12.2291 9.6224 12.6276C10.0209 13.0261 10.5614 13.25 11.125 13.25ZM26 17.5C26 19.7543 25.1045 21.9163 23.5104 23.5104C21.9163 25.1045 19.7543 26 17.5 26C15.2457 26 13.0837 25.1045 11.4896 23.5104C9.89553 21.9163 9 19.7543 9 17.5H26ZM26 11.125C26 11.6886 25.7761 12.2291 25.3776 12.6276C24.9791 13.0261 24.4386 13.25 23.875 13.25C23.3114 13.25 22.7709 13.0261 22.3724 12.6276C21.9739 12.2291 21.75 11.6886 21.75 11.125C21.75 10.5614 21.9739 10.0209 22.3724 9.6224C22.7709 9.22388 23.3114 9 23.875 9C24.4386 9 24.9791 9.22388 25.3776 9.6224C25.7761 10.0209 26 10.5614 26 11.125Z" fill="#FEE800"/>
      </svg>
    `,
  };

  let current = new Date();

  function renderCalendar(date) {
    calendar.innerHTML = '';

    const year = date.getFullYear();
    const month = date.getMonth();
    headerText.textContent = `${year}년 ${month + 1}월`;

    let firstDay = new Date(year, month, 1).getDay();
    firstDay = firstDay === 0 ? 6 : firstDay - 1;

    const lastDate = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('div');
      calendar.appendChild(empty);
    }

    for (let d = 1; d <= lastDate; d++) {
      const dayEl = document.createElement('div');
      dayEl.classList.add('day');

      const numEl = document.createElement('div');
      numEl.classList.add('day-number');
      numEl.textContent = d;

      const circleEl = document.createElement('div');
      circleEl.classList.add('circle');

      const thisDate = new Date(year, month, d);
      const dateKey = formatDate(year, month, d);

      if (thisDate.toDateString() === today.toDateString()) {
        dayEl.classList.add('today');
      } else if (thisDate < today) {
        dayEl.classList.add('past');
      } else {
        dayEl.classList.add('future');
      }

      // localStorage에서 `mood_날짜` 형식의 키로 직접 데이터를 가져옵니다.
      const mood = localStorage.getItem(`mood_${dateKey}`);
      if (mood && moodIcons[mood]) {
        circleEl.innerHTML = moodIcons[mood];
      }

      circleEl.addEventListener('click', () => {
        if (circleEl.classList.contains('selected')) {
          window.location.href = `calendar_detail.html?date=${dateKey}`;
        } else {
          document.querySelectorAll('.circle.selected').forEach((el) => {
            el.classList.remove('selected');
          });
          circleEl.classList.add('selected');
        }
      });

      dayEl.appendChild(numEl);
      dayEl.appendChild(circleEl);
      calendar.appendChild(dayEl);
    }
  }

  renderCalendar(current);

  prevBtn.addEventListener('click', () => {
    current.setMonth(current.getMonth() - 1);
    renderCalendar(current);
  });

  nextBtn.addEventListener('click', () => {
    current.setMonth(current.getMonth() + 1);
    renderCalendar(current);
  });

  // ===== 상단 버튼 이벤트 (이하 동일) =====
  const profileBtn = document.getElementById('profile-btn');
  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      window.location.href = '/mypage/mypage.html';
    });
  }

  const homeBtn = document.querySelector(
    '.topbar-left button[aria-label="홈"]'
  );
  if (homeBtn) {
    homeBtn.addEventListener('click', () => {
      window.location.href = '/login_signup_home/home/home.html';
    });
  }

  const alarmBtn = document.querySelector(
    '.topbar-left button[aria-label="알림"]'
  );
  if (alarmBtn) {
    alarmBtn.addEventListener('click', () => {
      const userType = localStorage.getItem('selectedOption'); // senior | guardian
      if (userType === 'guardian') {
        window.location.href = '/alarm/alarm_g/alarm_g.html';
      } else {
        window.location.href = '/alarm/alarm_s/alarm_s.html';
      }
    });
  }
});
