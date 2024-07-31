let confirmed = false;

function openIndex() {
  window.location.href = "index.html";
}

function checkAccept() {
  let acceptPolicy = document.getElementById("acceptPolicy");
  if (confirmed === false) {
    acceptPolicy.innerHTML = '<img src="./img/Property 1=checked.svg" alt=""/>';
    confirmed = true;
  } else {
    acceptPolicy.innerHTML = '<img src="./img/Property 1=Default.svg" alt=""/>';
    confirmed = false;
  }
}

function requiredName() {
  let nameInput = document.getElementById("nameSignUp");
  let requiredName = document.getElementById("requiredName");
  if (nameInput.value === "") {
    requiredName.innerHTML = "This field is required";
    nameInput.parentNode.classList.add("required-border");
    return;
  } else {
    requiredName.innerHTML = "";
    nameInput.parentNode.classList.remove("required-border");
  }
  requiredEmail();
}

function requiredEmail() {
  let emailInput = document.getElementById("emailSignUp");
  let requiredEmail = document.getElementById("requiredEmailSingUp");
  if (emailInput.value === "") {
    requiredEmail.innerHTML = "This field is required";
    emailInput.parentNode.classList.add("required-border");
    return;
  } else if (!emailInput.value.includes("@")) {
    requiredEmail.innerHTML = `'${emailInput.value}' is not valid. Please use an @-sign`;
    emailInput.parentNode.classList.add("required-border");
    return;
  } else {
    requiredEmail.innerHTML = "";
    emailInput.parentNode.classList.remove("required-border");
  }
  requiredPasswordSignUP();
}

function requiredPasswordSignUP() {
  let newPasswordInput = document.getElementById("passwordSignUp");
  let confirmedPasswordlInput = document.getElementById("confirmPasswordSignUp");
  let requiredNewPassword = document.getElementById("requiredPwSingUp");
  let requiredConfirmedPassword = document.getElementById("requiredConfirmPwSingUp");
  if(newPasswordInput.value === ""){
    requiredNewPassword.innerHTML = "This field is required"
    newPasswordInput.parentNode.classList.add("required-border")
    return
  }
  else{
    requiredNewPassword.innerHTML = ""
    newPasswordInput.parentNode.classList.remove("required-border")
  }
  if(confirmedPasswordlInput.value === ""){
    requiredConfirmedPassword.innerHTML = "This field is required";
    confirmedPasswordlInput.parentNode.classList.add("required-border");
    return
  }
  else{
    requiredConfirmedPassword.innerHTML = ""
    confirmedPasswordlInput.parentNode.classList.remove("required-border")
  }
   comparePasswords( newPasswordInput, confirmedPasswordlInput, requiredConfirmedPassword);
}

function comparePasswords(newPw, confirmedPw, wrongPw) {
  if (newPw.value != confirmedPw.value) {
    wrongPw.innerHTML = "Your passwords don't match. Please try again.";
    return;
  }
  wrongPw.innerHTML = "";
  checkConfirmed();
}

function checkConfirmed() {
  let terms = document.getElementById("requiredTerms");
  terms.innerHTML = confirmed === false ? "please accept our terms" : "";
  if (terms.innerHTML) return;
  editUser();
}

function editUser() {
  addUserToDatabase()
  document.getElementById("succsesOverlay").classList.remove("d-none")
  setTimeout(() => {
    window.location.href = "index.html"
  }, 2000);
}

async function addUserToDatabase(){

}