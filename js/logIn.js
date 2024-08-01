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
  let requiredEmail = document.getElementById("requiredEmail");
  if (emailInput.value ==="") {
      requiredEmail.innerHTML = "This field is required";
      emailInput.parentNode.classList.add("required-border")
  } else if (!emailInput.value.includes("@")) {
      requiredEmail.innerHTML = `'${emailInput.value}' is not valid. Please use an @-sign`;
      emailInput.parentNode.classList.add("required-border");
  } else {
      requiredEmail.innerHTML = "";
      emailInput.parentNode.classList.remove("required-border")
      requiredPasswordInput(emailInput)
  }
}

function requiredPasswordInput(emailInput){
  let passwordInput = document.getElementById("passwordLogIn");
  let requiredPassword = document.getElementById("requiredPassword");
  if (passwordInput.value === "") {
    requiredPassword.innerHTML = "This field is required";
    passwordInput.parentNode.classList.add("required-border")
  } else {
    requiredPassword.innerHTML = "";
    passwordInput.parentNode.classList.remove("required-border")
   checkUserInput(emailInput, requiredPassword);
  }
}

async function checkUserInput(rightEmail, wrongInput) {
  let response = await fetch(BASE_URL + "id" + ".json");
  let responseToJson = await response.json();
  let userFound = false;
  Object.keys(responseToJson).forEach((key, index) => {
      if (responseToJson[key].email === rightEmail.value) {
          userName = responseToJson[key].name;
          userId = index;
          console.log(userId);
          setuserName();
          userFound = true;
      }
  });
  if (!userFound) {
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
