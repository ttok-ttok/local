document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const dateParam = params.get('date');

  const selectedDateEl = document.getElementById('selected-date');
  const detailEl = document.getElementById('health-detail');
  const emptyEl = document.getElementById('health-empty');

  let chartInstance = null; // 📌 차트 전역 변수

  // 📌 현재 날짜 객체
  let currentDate = dateParam ? new Date(dateParam) : new Date();

  // ✅ YYYY-MM-DD 변환 함수
  function formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // ✅ 화면에 날짜 표시 함수
  function renderDate(date) {
    selectedDateEl.textContent = `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일`;
  }

  renderDate(currentDate);

  // 🔹 이전날 버튼
  document.getElementById('prev-day').addEventListener('click', () => {
    currentDate.setDate(currentDate.getDate() - 1);
    window.location.href = `calendar_detail.html?date=${formatDate(
      currentDate
    )}`;
  });

  // 🔹 다음날 버튼
  document.getElementById('next-day').addEventListener('click', () => {
    currentDate.setDate(currentDate.getDate() + 1);
    window.location.href = `calendar_detail.html?date=${formatDate(
      currentDate
    )}`;
  });

  // 📌 LocalStorage 데이터 불러오기
  if (dateParam) {
    try {
      const allData = JSON.parse(localStorage.getItem('healthData')) || {};
      const data = allData[dateParam]; // {summary, sleep, mood, ...}

      if (data && Object.keys(data).length > 0) {
        // ✅ detail 보이기
        detailEl.classList.remove('hidden');
        emptyEl.classList.add('hidden');

        // ✅ 텍스트 채우기
        document.getElementById('summary').textContent = data.summary || '';
        document.getElementById('sleep').textContent = data.sleep || '';
        document.getElementById('mood').textContent = data.mood || '';
        document.getElementById('meal').textContent = data.meal || '';
        document.getElementById('condition').textContent = data.condition || '';
        document.getElementById('energy').textContent = data.energy || '';
        document.getElementById('advice').textContent = data.advice || '';

        // ✅ 차트 초기화 (이미 있으면 제거)
        if (chartInstance) {
          chartInstance.destroy();
        }

        // ✅ 차트 그리기
        const ctx = document.getElementById('healthChart').getContext('2d');
        chartInstance = new Chart(ctx, {
          type: 'radar',
          data: {
            labels: ['숙면', '기분', '식사', '몸 상태', '활력'],
            datasets: [
              {
                label: '오늘',
                data: [
                  data.sleepScore || 0,
                  data.moodScore || 0,
                  data.mealScore || 0,
                  data.conditionScore || 0,
                  data.energyScore || 0,
                ],
                backgroundColor: 'rgba(252, 197, 123, 0.3)',
                borderColor: 'orange',
                borderWidth: 3,
                pointBackgroundColor: 'orange',
                pointBorderColor: 'orange',
                pointRadius: 4,
              },
              {
                label: '어제',
                data: [
                  data.prevSleepScore || 0,
                  data.prevMoodScore || 0,
                  data.prevMealScore || 0,
                  data.prevConditionScore || 0,
                  data.prevEnergyScore || 0,
                ],
                backgroundColor: 'rgba(200, 200, 0, 0.15)',
                borderColor: '#C0CA33',
                borderWidth: 2,
                pointBackgroundColor: '#C0CA33',
                pointBorderColor: '#C0CA33',
                pointRadius: 3,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              r: {
                beginAtZero: true,
                max: 3,
                ticks: {
                  display: false,
                },
                grid: {
                  display: false,
                },
                pointLabels: {
                  color: '#757575',
                  font: {
                    size: 14,
                  },
                },
              },
            },
          },
        });
      } else {
        // ✅ 응답 없음
        detailEl.classList.add('hidden');
        emptyEl.classList.remove('hidden');
      }
    } catch (err) {
      console.error(err);
      detailEl.classList.add('hidden');
      emptyEl.classList.remove('hidden');
    }
  }
});

// ------------------ 닫기 버튼 ------------------
const closeBtn = document.querySelector('.close-btn');
if (closeBtn) {
  closeBtn.addEventListener('click', () => {
    window.location.href = 'calendar.html';
  });
}

// ------------------ 프로필 버튼 ------------------
const profileBtn = document.getElementById('profile-btn');
if (profileBtn) {
  profileBtn.addEventListener('click', () => {
    window.location.href = '/mypage/mypage.html';
  });
}
