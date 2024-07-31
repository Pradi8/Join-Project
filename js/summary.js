function openBoard() {
  window.location.href = "board.html";
}

function greetUser() {
  let userIdAsText = localStorage.getItem("userId");
  if (userIdAsText) {
    userId = JSON.parse(userIdAsText);
  }
  let d = new Date();
  let hour = d.getHours();
  let greetingText = getDayTime(hour);
  document.getElementById("greeting").innerHTML = greetingHTML(greetingText);
}

function getDayTime(hour) {
  let greetingText = "";
  if (hour >= 6 && hour < 12) {
    greetingText = "Good Morning";
  } else if (hour >= 12 && hour < 18) {
    greetingText = "Good Afternoon";
  } else {
    greetingText = "Good Evening";
  }
  return greetingText;
}

function greetingHTML(greetingText) {
  return /* html */ `
<h3>${greetingText}</h3> <br>
<h4>${userId}</h4>
`;
}
