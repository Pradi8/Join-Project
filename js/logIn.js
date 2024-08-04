let checked = true;
let rememberedEmail = "alfred.mueller@web.de"
let rememberedPassword = "123"
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
  loadLocalRememberdUser();
}

function loadLocalRememberdUser(){
 let rememberedEmailAsText =  localStorage.getItem("rememberedEmail")
 let rememberedPasswordAsText =  localStorage.getItem("rememberedPassword")
 if(rememberedEmailAsText && rememberedPasswordAsText){
  rememberedEmail = JSON.parse(rememberedEmailAsText);
  rememberedPassword = JSON.parse(rememberedPasswordAsText)
 }
 getRemeberdUser();
}

function getRemeberdUser(){
let emailValue = document.getElementById("emailLogIn");
let passwordValue = document.getElementById("passwordLogIn");
emailValue.value = rememberedEmail;
passwordValue.value = rememberedPassword;
}

function changeImagePw(){
  let input = document.getElementById("passwordLogIn")
  let img = document.getElementById("showPw")
  if( input.value != ""){
  img.src = "./img/visibility_off.svg";
  document.getElementById("btnShowPwLogIn").disabled = false;
  }
  else{
    img.src = "./img/lock.svg";
    document.getElementById("btnShowPwLogIn").disabled = true;
  }
}
 
function showPassword(){
  let passwordField = document.getElementById("passwordLogIn");
  let visibilityImage = document.getElementById("showPw");
  if(passwordField.type === "password"){
    passwordField.type = "text";
    visibilityImage.src = "./img/visibility.svg";
  } else {
    passwordField.type = "password";
    visibilityImage.src = "./img/visibility_off.svg";
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
  if (passwordInput.value != "" ) {
    requiredPassword.innerHTML = "";
    passwordInput.parentNode.classList.remove("required-border")
   checkUserInput(emailInput, passwordInput, requiredPassword);
  } else {
    requiredPassword.innerHTML = "This field is required";
    passwordInput.parentNode.classList.add("required-border")
  }
}

async function checkUserInput(rightEmail, passwordInput, wrongInput) {
  let response = await fetch(BASE_URL + "id" + ".json");
  let responseToJson = await response.json();
  let userFound = false;
  Object.keys(responseToJson).forEach((key) => {
      if (responseToJson[key].email === rightEmail.value && responseToJson[key].password === passwordInput.value) {
          userName = responseToJson[key].name;
          userId = key;
          console.log(userId);
          saveLocalRemember();
          userFound = true;
      }
  });
  if (!userFound) {
      wrongInput.innerHTML = "Ups! Wrong email or password. Try again";
  }
}

function guestLogIn() {
  userName = "guest";
  userId = "guest"
  setuserName()
}

function saveLocalRemember() {
  if(checked){
  rememberedEmail =  document.getElementById("emailLogIn").value 
  rememberedPassword =  document.getElementById("passwordLogIn").value 
  }else{
  rememberedEmail ="";
  rememberedPassword= "";
  }
  localStorage.setItem("rememberedEmail", JSON.stringify(rememberedEmail))
  localStorage.setItem("rememberedPassword", JSON.stringify(rememberedPassword))
  setuserName();
}

function setuserName(){
  localStorage.setItem("userName", JSON.stringify(userName));
  localStorage.setItem("userId", JSON.stringify(userId))
  window.location.href = "summary.html";
}
