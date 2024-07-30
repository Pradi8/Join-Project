let checked = false;

function openSignUp() {
  window.location.href = "signup.html";
}

function checkRemember() {
  let remember = document.getElementById("remember");
  if (checked === false) {
    remember.innerHTML = '<img src="./img/Property 1=checked.svg" alt=""/>';
    checked = true;
  } else {
    remember.innerHTML = '<img src="./img/Property 1=Default.svg" alt=""/>';
    checked = false;
  }
}


function requiredInput() {
  let emailInput = document.getElementById("emailLogIn");
  let passwordInput = document.getElementById("passwordLogIn");
  let requiredEmail = document.getElementById("requiredEmail");
  let requiredPassword = document.getElementById("requiredPassword");
  let emailValue = emailInput.value;
  let passwordValue = passwordInput.value;
  requiredEmail.innerHTML = emailValue === "" ? "This field is required" : !emailValue.includes("@") ? `'${emailValue}' is not valid. Please use an @-sign` : "";
  requiredPassword.innerHTML = passwordValue === "" ? "This field is required" : "";
  if (requiredEmail.innerHTML || requiredPassword.innerHTML) return;
  checkUserInput();
}

async function checkUserInput() {
  /* hier wird die Datenbank auf den nutzer durchsucht */
  window.location.href = "summary.html";
}

function guestLogIn(){
 
}