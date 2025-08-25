document.addEventListener('DOMContentLoaded', () => {
  const condBtns = document.querySelectorAll('.cond-btn');
  const micBtn = document.querySelector('.mic-btn');
  const aiBtn = document.querySelector('.ai-btn');
  const questionText = document.querySelector('.question');
  const conditionIcons = document.querySelector('.condition-icons');
  const profileBtn = document.getElementById('profile-btn');
  const alarmBtn = document.getElementById('alarm-btn');
  const calendarBtn = document.getElementById('calendar-btn');

  // ✅ 캘린더 버튼 → 캘린더 페이지 이동
  if (calendarBtn) {
    calendarBtn.addEventListener('click', () => {
      window.location.href = '/calendar/calendar.html';
    });
  }

  // 회원 유형 불러오기
  let selectedOption = localStorage.getItem('selectedOption');
  if (!selectedOption) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.type) {
      selectedOption = currentUser.type;
      localStorage.setItem('selectedOption', selectedOption);
    }
  }

  // guardian / senior 모드 분기
  if (selectedOption === 'guardian') {
    questionText.textContent = '안녕하세요, 무엇을 도와드릴까요?';
    conditionIcons.style.display = 'none'; // guardian → 감정 버튼 숨김
  } else if (selectedOption === 'senior') {
    // ===== senior 모드 (설문 진행) =====

    // 하루 초기화 체크
    function resetIfNeeded() {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const lastSavedDay = localStorage.getItem('lastSavedDay');

      const resetTime = new Date();
      resetTime.setHours(7, 0, 0, 0);

      if (!lastSavedDay || (now >= resetTime && lastSavedDay !== today)) {
        localStorage.removeItem('dailyAnswers');
        localStorage.removeItem('surveyCompletedDay');
        localStorage.setItem('lastSavedDay', today);
        console.log('✅ dailyAnswers 초기화 완료:', today);
      }
    }
    resetIfNeeded();

    const today = new Date().toISOString().split('T')[0];
    const completedDay = localStorage.getItem('surveyCompletedDay');

    if (completedDay === today) {
      questionText.textContent = '오늘 설문을 이미 완료하셨습니다. 감사합니다!';
      conditionIcons.style.display = 'none';
    } else {
      // 기본 질문 목록
      let questionString = [
        '오늘의 컨디션은 어떠신가요?',
        '오늘 식사는 맛있게 하셨어요?',
        '어제 잠은 잘 주무셨어요?',
        '오늘 몸은 어떠세요?',
        '오늘 움직이는데 불편함은 없으셨나요?',
      ];

      // 약 복용 여부에 따라 질문 삽입
      const takeMedicine = localStorage.getItem('takeMedicine') === 'true';
      if (takeMedicine) {
        questionString.splice(1, 0, '오늘 약은 드셨나요?');
      }

      let currentIndex = 0;
      const answers = JSON.parse(localStorage.getItem('dailyAnswers') || '[]');

      // 질문 표시
      function showQuestion() {
        if (currentIndex < questionString.length) {
          questionText.textContent = questionString[currentIndex];
        } else {
          questionText.textContent = '모든 질문이 완료되었습니다. 감사합니다!';
          conditionIcons.style.display = 'none';
          localStorage.setItem('surveyCompletedDay', today);
        }
      }

      showQuestion();

      // ✅ 컨디션 버튼 이벤트 (senior 모드에서만 실행)
      condBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          // 오늘 날짜 기분 저장
          const todayKey = new Date().toISOString().split('T')[0];
          localStorage.setItem(`mood_${todayKey}`, btn.dataset.value);

          // 설문 답변 저장
          if (currentIndex < questionString.length) {
            const answer = {
              question: questionString[currentIndex],
              response: btn.dataset.value,
              timestamp: new Date().toISOString(),
            };

            answers.push(answer);
            localStorage.setItem('dailyAnswers', JSON.stringify(answers));

            console.log('저장된 답변:', answer);

            currentIndex++;
            showQuestion();
          }
        });
      });
    }
  } else {
    // 예외 처리: 회원 유형이 없는 경우
    alert('회원 유형을 알 수 없습니다. 다시 로그인 해주세요.');
    window.location.href = '/login/login.html';
  }

  // ===== 공통 기능 (guardian / senior 모두 사용) =====
  if (micBtn) {
    micBtn.addEventListener('click', () => {
      alert('🎤 음성 입력 시작 (실제 구현은 Web Speech API 연결)');
    });
  }

  if (aiBtn) {
    aiBtn.addEventListener('click', () => {
      window.location.href = '../chat/chat.html';
    });
  }

  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      window.location.href = '/mypage/mypage.html';
    });
  }

  if (alarmBtn) {
    alarmBtn.addEventListener('click', () => {
      if (selectedOption === 'guardian') {
        window.location.href = '/alarm/alarm_g/alarm_g.html';
      } else if (selectedOption === 'senior') {
        window.location.href = '/alarm/alarm_s/alarm_s.html';
      } else {
        alert('회원 유형을 알 수 없습니다. 다시 로그인 해주세요.');
        window.location.href = '/login_signup_home/login/login.html';
      }
    });
  }
});
