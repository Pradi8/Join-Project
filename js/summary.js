function openBoard() {
  window.location.href = "board.html";
}

function greetUser() {
  loadUser();
  let greetingUser = userId;
  if(userId == "guest"){
    greetingUser = "";
  }
  let d = new Date();
  let hour = d.getHours();
  let greetingText = getDayTime(hour);
  document.getElementById("greeting").innerHTML = greetingHTML(greetingText, greetingUser);
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

function greetingHTML(greetingText, greetingUser) {
  return /* html */ `
<h3>${greetingText}</h3> <br>
<h4>${greetingUser}</h4>
`;
}
