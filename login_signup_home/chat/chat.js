document.addEventListener('DOMContentLoaded', () => {
  const chatContainer = document.getElementById('chatContainer');
  const chatInput = document.getElementById('chatInput');
  const micBtn = document.getElementById('micBtn');
  const sendBtn = document.getElementById('sendBtn');
  const endChat = document.getElementById('endChat');
  const profileBtn = document.getElementById('profileBtn');

  let currentUtterance = null; // 현재 실행 중인 음성
  let currentSpeakingBubble = null; // 현재 읽고 있는 말풍선

  // ===== 상단 버튼 =====
  endChat.addEventListener('click', () => {
    window.location.href = '../home/home.html';
  });

  profileBtn.addEventListener('click', () => {
    window.location.href = 'mypage.html';
  });

  // ===== 채팅 메시지 추가 =====
  function addMessage(text, sender = 'bot', save = true) {
    const msgWrap = document.createElement('div');
    msgWrap.classList.add('message', sender);

    if (sender === 'bot') {
      const avatar = document.createElement('img');
      avatar.src = '../images/chat_character.svg';
      avatar.classList.add('avatar');
      msgWrap.appendChild(avatar);
    }

    const contentWrap = document.createElement('div');
    contentWrap.classList.add('content-wrap');

    // 말풍선 + 스피커 버튼 묶음
    const bubbleRow = document.createElement('div');
    bubbleRow.classList.add('bubble-row');

    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.textContent = text;
    bubbleRow.appendChild(bubble);

    // TTS 버튼 (봇일 때만)
    if (sender === 'bot') {
      const ttsBtn = document.createElement('button');
      ttsBtn.classList.add('tts-btn');

      const icon = document.createElement('img');
      icon.src = '../images/speaker.svg';
      icon.alt = '읽어주기';
      ttsBtn.appendChild(icon);

      ttsBtn.addEventListener('click', () => handleTTS(ttsBtn, text, bubble));
      bubbleRow.appendChild(ttsBtn);
    }

    contentWrap.appendChild(bubbleRow);

    // 시간 표시
    const time = document.createElement('div');
    time.classList.add('time');
    time.textContent = new Date().toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    contentWrap.appendChild(time);

    msgWrap.appendChild(contentWrap);
    chatContainer.appendChild(msgWrap);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // === localStorage 저장 ===
    if (save) {
      const messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
      messages.push({ text, sender, time: time.textContent });
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }

  // ===== TTS 제어 =====
  function handleTTS(button, text, bubble) {
    if (
      currentUtterance &&
      currentSpeakingBubble === bubble &&
      speechSynthesis.speaking
    ) {
      return;
    }
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'ko-KR';
    currentUtterance = utter;
    currentSpeakingBubble = bubble;
    utter.onend = () => {
      currentUtterance = null;
      currentSpeakingBubble = null;
    };
    speechSynthesis.speak(utter);
  }

  // ===== STT =====
  function startSTT() {
    if (!('webkitSpeechRecognition' in window)) {
      alert('STT 지원 안됨');
      return;
    }
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'ko-KR';
    recognition.start();

    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      chatInput.value = speechText;
      toggleButtons();
    };
  }

  // ===== 전송 =====
  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    chatInput.value = '';
    toggleButtons();

    // 실제 서버와 연결될 부분 (테스트용)
    setTimeout(() => {
      addMessage(
        '그건 0000현상이 생겨서 그럴 수 있어요! 병원에 가보는 것을 추천해요!',
        'bot'
      );
    }, 500);
  }

  // ===== 버튼 상태 토글 =====
  function toggleButtons() {
    if (chatInput.value.trim()) {
      micBtn.style.display = 'none';
      sendBtn.style.display = 'flex';
    } else {
      micBtn.style.display = 'flex';
      sendBtn.style.display = 'none';
    }
  }

  // 입력 변화 감지
  chatInput.addEventListener('input', toggleButtons);

  // Enter 입력 → 전송
  chatInput.addEventListener('keydown', (e) => {
    if (e.isComposing) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  });

  // 버튼 이벤트
  sendBtn.addEventListener('click', sendMessage);
  micBtn.addEventListener('click', startSTT);

  // ===== 저장된 채팅 불러오기 =====
  const savedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
  if (savedMessages.length > 0) {
    savedMessages.forEach((msg) => {
      addMessage(msg.text, msg.sender, false); // 불러올 때는 저장하지 않음
    });
  } else {
    // 초기 환영 메시지
    addMessage('똑똑이 채팅창이에요! 무엇을 도와드릴까요?', 'bot');
  }
});
