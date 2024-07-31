const BASE_URL ="https://login-de5c5-default-rtdb.europe-west1.firebasedatabase.app/";
const CONTACT_URL ="https://contacts-e1e72-default-rtdb.europe-west1.firebasedatabase.app/";
const BOARD_URL ="https://board-c7512-default-rtdb.europe-west1.firebasedatabase.app/";

let userId = "";

function loadUser() {
  let userIdAsText = localStorage.getItem("userId");
  if (userIdAsText) {
    userId = JSON.parse(userIdAsText);
  }
  document.getElementById("userShortcut").innerHTML = getInitials();
}

function getInitials() {
  let words = userId.split(" ");
  let initials = "";
  for (let i = 0; i < words.length; i++) {
    if (words[i].length > 0) {
      initials += words[i].substring(0, 1).toUpperCase();
    }
  }
  return initials;
}
