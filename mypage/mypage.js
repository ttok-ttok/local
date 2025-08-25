document.addEventListener('DOMContentLoaded', () => {
  const sheet = document.getElementById('codeSheet');
  const openBtn = document.getElementById('btnOpenCode'); // 코드 입력하기 버튼
  const inviteBtn = document.getElementById('btnOpenInvite'); // 나의 초대코드 버튼
  const backdrop = document.getElementById('sheetBackdrop');
  const confirmBtn = document.getElementById('btnConfirm');

  const tabs = document.querySelectorAll('.tab-btn');
  const panels = {
    input: document.getElementById('panel-input'),
    invite: document.getElementById('panel-invite'),
  };

  const copyBtn = document.getElementById('copyBtn');
  const inviteCodeEl = document.getElementById('inviteCode');
  const codeInput = document.getElementById('familyCode');

  // 현재 로그인 사용자 가져오기
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  if (currentUser) {
    const nameEl = document.querySelector('.profile-name');
    const idEl = document.querySelector('.profile-id');

    if (nameEl) nameEl.textContent = currentUser.name;
    if (idEl) idEl.textContent = currentUser.userId;
  }
  const username = currentUser ? currentUser.userId : 'testUser';

  /* ---------------- LocalStorage 연동 ---------------- */

  // 🚀 초대코드 발행 (없으면 새로 생성)
  function fetchInviteCode(username) {
    let code = localStorage.getItem(`inviteCode_${username}`);
    if (!code) {
      // 랜덤 6자리 코드 생성
      code = Math.random().toString(36).substring(2, 8).toUpperCase();
      localStorage.setItem(`inviteCode_${username}`, code);
    }
    if (inviteCodeEl) inviteCodeEl.textContent = code;
  }

  // 🚀 코드 입력 → 보호자-노인 매칭
  function acceptInvite(username, code) {
    const savedCode = localStorage.getItem(`inviteCode_${username}`);
    if (savedCode && savedCode === code) {
      alert('가족 매칭이 완료되었습니다!');
      // 매칭 여부 저장
      localStorage.setItem(`isMatched_${username}`, 'true');
    } else {
      alert('코드가 유효하지 않습니다.');
    }
  }

  /* ---------------- UI 동작 ---------------- */

  // 시트 열기 (코드 입력하기)
  openBtn?.addEventListener('click', () => {
    sheet.classList.add('is-open');
    sheet.setAttribute('aria-hidden', 'false');
    switchTab('input');
  });

  // 시트 열기 (나의 초대코드)
  inviteBtn?.addEventListener('click', () => {
    sheet.classList.add('is-open');
    sheet.setAttribute('aria-hidden', 'false');
    switchTab('invite');
    fetchInviteCode(username); // localStorage에서 코드 확인
  });

  // 초대 코드 복사
  copyBtn?.addEventListener('click', () => {
    const code = inviteCodeEl?.textContent.trim();
    if (code) {
      navigator.clipboard
        .writeText(code)
        .then(() => alert('초대 코드가 복사되었습니다!'))
        .catch((err) => console.error('복사 실패:', err));
    }
  });

  // 시트 닫기
  backdrop?.addEventListener('click', closeSheet);

  // ✅ 확인 버튼 → 코드 매칭
  confirmBtn?.addEventListener('click', () => {
    const code = codeInput?.value.trim();
    if (!code) {
      alert('코드를 입력해주세요.');
      return;
    }
    acceptInvite(username, code);
    closeSheet();
  });

  function closeSheet() {
    sheet.classList.remove('is-open');
    sheet.setAttribute('aria-hidden', 'true');
  }

  // 탭 전환 함수
  function switchTab(tabName) {
    tabs.forEach((btn) => {
      const isActive = btn.dataset.tab === tabName;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', isActive);
    });
    panels.input.classList.toggle('is-hidden', tabName !== 'input');
    panels.invite.classList.toggle('is-hidden', tabName !== 'invite');
  }

  // 탭 클릭 시
  tabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      switchTab(btn.dataset.tab);
    });
  });

  /* ---------------- 상단바 버튼 이동 ---------------- */

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

  // 설정 페이지 이동
  const settingBtn = document.getElementById('btnSetting');
  settingBtn?.addEventListener('click', () => {
    window.location.href = './setting/setting.html';
  });
});
