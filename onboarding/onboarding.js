document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide"); // 각 슬라이드
  const slidesContainer = document.getElementById("slides"); // 슬라이드 컨테이너
  const nextBtns = document.querySelectorAll(".btn-next"); // 버튼들
  const dots = document.querySelectorAll(".dot"); // 인디케이터

  let current = 0;

  // ===== 버튼으로 넘기기 =====
  nextBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("last")) {
        // 마지막 → 로그인 페이지 이동
        window.location.href = "../login_signup_home/login/login.html";
      } else {
        current = Math.min(current + 1, slides.length - 1);
        slides[current].scrollIntoView({ behavior: "smooth" });
        updateIndicator();
      }
    });
  });

  // ===== 인디케이터 업데이트 =====
  function updateIndicator() {
    dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
  }

  // ===== 스크롤 이벤트로 인디케이터 반영 =====
  slidesContainer.addEventListener("scroll", () => {
    const index = Math.round(
      slidesContainer.scrollLeft / slidesContainer.clientWidth
    );
    if (index !== current) {
      current = index;
      updateIndicator();
    }
  });
});
