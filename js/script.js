const BASE_URL = "https://login-de5c5-default-rtdb.europe-west1.firebasedatabase.app/";
const CONTACT_URL = "https://contacts-e1e72-default-rtdb.europe-west1.firebasedatabase.app/";
const BOARD_URL = "https://board-c7512-default-rtdb.europe-west1.firebasedatabase.app/";
const GUEST_URL = "https://guest-31a20-default-rtdb.europe-west1.firebasedatabase.app/"

let userName;
let userId;

function loadUser() {
  let userNameAsText = localStorage.getItem("userName");
  let userIdAsText = localStorage.getItem("userId");
   if (userNameAsText && userIdAsText) {
    userName = JSON.parse(userNameAsText);
    userId = JSON.parse(userIdAsText);
  }
}

function selectField(selectedField){
  let blueline = document.getElementById(selectedField)
  blueline.parentNode.classList.add("blue-border")
}
function unselectField(selectedField){
  let blueline = document.getElementById(selectedField)
  blueline.parentNode.classList.remove("blue-border")
}

function stopPropagation(event){
  event.stopPropagation();
}

function setuserName(){
  localStorage.setItem("userName", JSON.stringify(userName));
  localStorage.setItem("userId", JSON.stringify(userId))
  window.location.href = "summary.html";
}