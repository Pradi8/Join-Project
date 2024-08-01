let checked = true;

function openSignUp() {
  window.location.href = "signup.html";
}

function checkRemember() {
  if (checked) {
    checked = false;
  } else {
    checked = true;
  }
  localStorage.setItem("rememberMe", JSON.stringify(checked));
  loadRememberStatus();
}

function loadRememberStatus() {
  let checkedAsText = localStorage.getItem("rememberMe");
  if (checkedAsText) {
    checked = JSON.parse(checkedAsText);
  }
  let remember = document.getElementById("remember");
  if (checked === false) {
    remember.innerHTML = '<img src="./img/Property 1=Default.svg" alt=""/>';
  } else {
    remember.innerHTML = '<img src="./img/Property 1=checked.svg" alt=""/>';
  }
}

function requiredInput() {
  let emailInput = document.getElementById("emailLogIn");
  let passwordInput = document.getElementById("passwordLogIn");
  let requiredEmail = document.getElementById("requiredEmail");
  let requiredPassword = document.getElementById("requiredPassword");
  let emailValue = emailInput.value;
  let passwordValue = passwordInput.value;
  requiredEmail.innerHTML = emailValue === "" ? "This field is required" : !emailValue.includes("@")  ? `'${emailValue}' is not valid. Please use an @-sign` : "";
  requiredPassword.innerHTML = passwordValue === "" ? "This field is required" : "";
  if (requiredEmail.innerHTML || requiredPassword.innerHTML) return;
  checkUserInput(emailInput, requiredPassword);
}

async function checkUserInput(rightEmail, wrongInput) {
    let response = await fetch(BASE_URL + "id" + ".json");
    let responseToJson = await response.json();
    console.log(responseToJson);
    for (let i=0; i < responseToJson.length; i++) {
      
      if (responseToJson[i].email === rightEmail.value) {
        userName = responseToJson[i].name;
        userId = i;
        console.log(userId)
        setuserName();
        break;
      }
      wrongInput.innerHTML = "Ups! Wrong email or password. Try again";
    }
}

function guestLogIn() {
  userName = "guest";
  setuserName()
}

function setuserName(){
  localStorage.setItem("userName", JSON.stringify(userName));
  localStorage.setItem("userId", JSON.stringify(userId))
  window.location.href = "summary.html";
}
