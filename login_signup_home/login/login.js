document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const backBtn = document.querySelector('.icon-back');

  // 뒤로가기 버튼
  backBtn.addEventListener('click', () => {
    window.history.back();
  });

  // 로그인 폼 제출
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const userId = document.getElementById('user-id').value.trim();
    const userPw = document.getElementById('user-pw').value.trim();

    if (!userId || !userPw) {
      alert('아이디와 비밀번호를 입력하세요.');
      return;
    }
    // ✅ localStorage에서 회원정보 가져오기
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // 아이디/비밀번호 확인
    const foundUser = users.find(
      (u) => u.userId === userId && u.userPw === userPw
    );

    if (foundUser) {
      alert('로그인 성공! 🎉');

      // 현재 로그인 사용자 정보 저장
      localStorage.setItem('currentUser', JSON.stringify(foundUser));

      // 회원 유형 따로 저장
      localStorage.setItem('selectedOption', foundUser.type);

      window.location.href = '/login_signup_home/home/home.html'; // 홈 페이지로 이동
    } else {
      alert('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  });
});
