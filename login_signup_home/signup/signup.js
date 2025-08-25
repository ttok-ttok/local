document.addEventListener("DOMContentLoaded", () => {
  localStorage.removeItem("selectedOption"); // 이전 선택값 초기화
  const form = document.getElementById("step1");
  const radios = form.querySelectorAll("input[type='radio']");
  const nextBtn = document.getElementById("nextBtn");

  radios.forEach((radio) => {
    radio.addEventListener("change", () => {
      // 라디오 버튼 하나라도 선택되면 다음 버튼 활성화
      nextBtn.disabled = false;
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const selected = form.querySelector("input[type='radio']:checked");
    if (selected) {
      localStorage.setItem("selectedOption", selected.value);
      window.location.href = "../signup2/signup2.html";
    }
  });
});
