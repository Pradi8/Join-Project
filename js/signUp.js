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

function requiredSignUp() {
  let nameInput = document.getElementById("nameSignUp");
  let emailInput = document.getElementById("emailSignUp");
  let requiredName = document.getElementById("requiredName");
  let requiredEmail = document.getElementById("requiredEmailSingUp");
  let nameValue = nameInput.value;
  let emailValue = emailInput.value;
  requiredName.innerHTML = nameValue === "" ? "This field is required" : "";
  requiredEmail.innerHTML =  emailValue === "" ? "This field is required" : !emailValue.includes("@") ? `'${emailValue}' is not valid. Please use an @-sign` : "";
  if (requiredEmail.innerHTML || requiredName.innerHTML) return;
  requiredPasswordSignUP();
}

function requiredPasswordSignUP() {
  let newPasswordInput = document.getElementById("passwordSignUp");
  let confirmedPasswordlInput = document.getElementById("confirmPasswordSignUp");
  let requiredNewPassword = document.getElementById("requiredPwSingUp");
  let requiredConfirmedPassword = document.getElementById("requiredConfirmPwSingUp");
  let newPasswordValue = newPasswordInput.value;
  let confirmedPasswordValue = confirmedPasswordlInput.value;
  requiredNewPassword.innerHTML = newPasswordValue === "" ? "This field is required" : "";
  requiredConfirmedPassword.innerHTML = confirmedPasswordValue === "" ? "This field is required" : "";
  if (requiredNewPassword.innerHTML || requiredConfirmedPassword.innerHTML)
    return;
  comparePasswords(
    newPasswordInput,
    confirmedPasswordlInput,
    requiredConfirmedPassword
  );
}

function comparePasswords(newPw, confirmedPw, wrongPw) {
  if (newPw.value != confirmedPw.value) {
    wrongPw.innerHTML = "Your passwords don't match. Please try again.";
    return;
  }
  wrongPw.innerHTML = "";
  checkConfirmed()
}

function checkConfirmed(){
    let terms = document.getElementById("requiredTerms")
    terms.innerHTML = confirmed === false ? "please accept our terms" : "";
    if(terms.innerHTML)
        return;
    editUser()
}

function editUser(){
    alert("hier kommt noch was")
}
