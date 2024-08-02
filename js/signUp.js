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
  } else {
    requiredName.innerHTML = "";
    nameInput.parentNode.classList.remove("required-border");
    requiredEmail();
  }
}

function requiredEmail() {
  let emailSingUp = document.getElementById("emailSignUp");
  let requiredEmailSignUp = document.getElementById("requiredEmailSingUp");
  if (emailSingUp.value === "") {
    requiredEmailSignUp.innerHTML = "This field is required";
    emailSingUp.parentNode.classList.add("required-border");
  } else if (!emailSingUp.value.includes("@")) {
    requiredEmailSignUp.innerHTML = `'${emailSingUp.value}' is not valid. Please use an @-sign`;
    emailSingUp.parentNode.classList.add("required-border");
  } else {
    requiredEmailSignUp.innerHTML = "";
    emailSingUp.parentNode.classList.remove("required-border");
    requiredPasswordSignUP();
  }
}

function requiredPasswordSignUP() {
  let newPasswordInput = document.getElementById("passwordSignUp");
  let confirmedPasswordlInput = document.getElementById("confirmPasswordSignUp");
  let requiredNewPassword = document.getElementById("requiredPwSingUp");
  let requiredConfirmedPassword = document.getElementById("requiredConfirmPwSingUp");
  if(newPasswordInput.value === ""){
    requiredNewPassword.innerHTML = "This field is required"
    newPasswordInput.parentNode.classList.add("required-border")
  }
  else{
    requiredNewPassword.innerHTML = ""
    newPasswordInput.parentNode.classList.remove("required-border")
  }
  if(confirmedPasswordlInput.value === ""){
    requiredConfirmedPassword.innerHTML = "This field is required";
    confirmedPasswordlInput.parentNode.classList.add("required-border");
  }
  else{
    requiredConfirmedPassword.innerHTML = ""
    confirmedPasswordlInput.parentNode.classList.remove("required-border")
    comparePasswords( newPasswordInput, confirmedPasswordlInput, requiredConfirmedPassword);
  } 
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
  addUserToDatabase();
}

async function addUserToDatabase(){
  let newName = document.getElementById("nameSignUp").value;
  let newEmail = document.getElementById("emailSignUp").value;
  let newPassword = document.getElementById("passwordSignUp").value;
  console.log(BASE_URL)
  let newUser = await fetch(BASE_URL + "id" + ".json",{
    method: "POST",
    headers:{
      "Content-Type":"application/json",
    },
    body: JSON.stringify({
      "email": newEmail,
      "name": newName,
      "password": newPassword
      
    })
  });
  document.getElementById("succsesOverlay").classList.remove("d-none")
  setTimeout(() => {
    window.location.href = "index.html"
  }, 2000);
  return newUserToJson = await newUser.json();
}