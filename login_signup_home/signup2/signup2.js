document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const nextBtn = document.getElementById('nextBtn');

  const nameInput = document.getElementById('user-name');
  const idInput = document.getElementById('user-id');
  const pwInput = document.getElementById('user-pw');
  const pwConfirmInput = document.getElementById('user-pw-confirm');

  const nameError = document.getElementById('name-error');
  const idError = document.getElementById('id-error');
  const pwError = document.getElementById('pw-error');
  const checkIdBtn = document.getElementById('checkIdBtn');

  let isNameValid = false;
  let isIdValid = false;
  let isPwValid = false;
  let isPwMatch = false;

  // ===== 비밀번호 눈 버튼 =====
  document.querySelectorAll('.eye-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      input.type = input.type === 'password' ? 'text' : 'password';
    });
  });

  // ===== 이름: 한글만 허용 =====
  nameInput.addEventListener('input', () => {
    const regex = /^[ㄱ-힣]+$/;
    if (!regex.test(nameInput.value)) {
      nameError.textContent = '한글만 입력 가능합니다.';
      isNameValid = false;
    } else {
      nameError.textContent = '';
      isNameValid = true;
    }
    checkFormValid();
  });

  // ===== 아이디: 6~12자, 영문/숫자 허용 =====
  idInput.addEventListener('input', () => {
    const regex = /^[A-Za-z0-9]{6,12}$/;
    if (!regex.test(idInput.value)) {
      idError.textContent = '아이디는 6~12자의 영문/숫자만 가능합니다.';
      idError.className = 'error-message';
      isIdValid = false;
    } else {
      idError.textContent = '';
      idError.className = '';
      isIdValid = true;
    }
    checkFormValid();
  });

  // ===== 아이디: localStorage 중복 검사 =====
  checkIdBtn.addEventListener('click', () => {
    const idValue = idInput.value.trim();
    if (idValue.length < 6) {
      idError.textContent = '아이디는 6자 이상이어야 합니다.';
      idError.className = 'error-message';
      isIdValid = false;
      checkFormValid();
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const exists = users.some((u) => u.userId === idValue);

    if (exists) {
      idError.textContent = '중복된 아이디입니다. 다른 아이디를 입력하세요.';
      idError.className = 'error-message';
      isIdValid = false;
    } else {
      idError.textContent = '사용 가능한 아이디입니다.';
      idError.className = 'success-message';
      isIdValid = true;
    }
    checkFormValid();
  });

  // ===== 비밀번호: 8자 이상, 영문/숫자만 허용 =====
  pwInput.addEventListener('input', () => {
    const regex = /^[A-Za-z0-9]{8,}$/;
    if (!regex.test(pwInput.value)) {
      pwError.textContent =
        '비밀번호는 8자 이상이어야 하며, 영문/숫자를 포함해야 합니다.';
      pwError.className = 'error-message';
      isPwValid = false;
    } else {
      pwError.textContent = '';
      pwError.className = '';
      isPwValid = true;
    }
    validatePasswords();
  });

  // ===== 비밀번호 확인 =====
  function validatePasswords() {
    const pw = pwInput.value.trim();
    const pwConfirm = pwConfirmInput.value.trim();

    if (pw && pwConfirm && pw !== pwConfirm) {
      // 비번 다를 때
      pwError.textContent = '비밀번호가 다릅니다. 다시 확인해 주세요.';
      pwError.className = 'error-message';
      isPwMatch = false;
    } else if (pw && pwConfirm && pw === pwConfirm) {
      // 비번 같을 때
      pwError.textContent = '';
      pwError.className = '';
      isPwMatch = true;
    } else {
      // 둘 다 비어있거나 불완전할 때
      pwError.textContent = '';
      pwError.className = '';
      isPwMatch = false;
    }

    checkFormValid();
  }
  pwInput.addEventListener('input', validatePasswords);
  pwConfirmInput.addEventListener('input', validatePasswords);

  // ===== 모든 조건 확인 후 버튼 활성화 =====
  function checkFormValid() {
    if (isNameValid && isIdValid && isPwValid && isPwMatch) {
      nextBtn.disabled = false;
    } else {
      nextBtn.disabled = true;
    }
  }

  const userType = localStorage.getItem('selectedOption');

  // ===== 폼 제출 =====
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!nextBtn.disabled) {
      // 저장된 유저 불러오기
      const users = JSON.parse(localStorage.getItem('users')) || [];

      // 새 유저 추가
      users.push({
        name: nameInput.value.trim(),
        userId: idInput.value.trim(),
        userPw: pwInput.value.trim(),
        type: userType, // senior or guardian
      });

      // localStorage 저장
      localStorage.setItem('users', JSON.stringify(users));

      alert('회원가입이 완료되었습니다!');

      // 유저 타입에 따라 다음 페이지로 이동
      if (userType === 'senior') {
        window.location.href = '../signup_s/signup_s.html';
      } else if (userType === 'guardian') {
        window.location.href = '../signup_g/signup_g.html';
      }
    }
  });
});
