document.addEventListener('DOMContentLoaded', () => {
  const homeBtn = document.getElementById('homeBtn');

  homeBtn.addEventListener('click', () => {
    console.log('로그인 이동');
    window.location.href = '../login/login.html'; // 실제 홈 경로 지정
  });
});
