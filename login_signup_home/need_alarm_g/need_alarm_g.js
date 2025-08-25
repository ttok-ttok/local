document.addEventListener("DOMContentLoaded", () => {
  const btnNo = document.getElementById("btnNo");
  const btnYes = document.getElementById("btnYes");

  btnNo.addEventListener("click", () => {
    const alarm = "no";
    console.log("선택된 값:", alarm);
    window.location.href = "complete.html"; // 알림 거부 시 완료 페이지로 이동
  });

  btnYes.addEventListener("click", () => {
    const alarm = "yes";
    console.log("선택된 값:", alarm);
    window.location.href = "../complete/complete.html"; // 알림 허용 시 완료 페이지로 이동
  });
});
