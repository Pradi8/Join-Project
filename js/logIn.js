let checked = true;
let rememberedEmail = "join-tester@havefun.com"
let rememberedPassword = "123"

/**
 * Redirects the user to the sign-up page by navigating to "signup.html".
 */
function openSignUp() {
  window.location.href = "signup.html";
}

/**
 * Toggles the "Remember Me" option. Updates the icon to reflect the current state 
 * (checked/unchecked) and manages localStorage accordingly to remember or forget
 * the user's email and password.
 */
function checkRemember() {
  let remember = document.getElementById("remember");
  if (checked) {
    checked = false;
    remember.innerHTML = '<img src="./img/Property 1=Default.svg" alt=""/>';
    localStorage.removeItem("rememberedEmail");
    localStorage.removeItem("rememberedPassword");
  } else {
    checked = true;
    remember.innerHTML = '<img src="./img/Property 1=checked.svg" alt=""/>';
  }
  localStorage.setItem("rememberMe", JSON.stringify(checked));
}

/**
 * Loads the current status of the "Remember Me" option from localStorage and updates 
 * the UI accordingly. Also calls `loadLocalRememberdUser()` to load saved user credentials.
 */
function loadRememberStatus() {
  let checkedAsText = localStorage.getItem("rememberMe");
  if (checkedAsText) {
    checked = JSON.parse(checkedAsText);
  }
  let remember = document.getElementById("remember");
  if (!checked) {
    remember.innerHTML = '<img src="./img/Property 1=Default.svg" alt=""/>';
  } else {
    remember.innerHTML = '<img src="./img/Property 1=checked.svg" alt=""/>';
  }
  loadLocalRememberdUser();
}

/**
 * Loads saved email and password from localStorage if the "Remember Me" option was used,
 * and then calls `getRemeberdUser()` to populate the login fields.
 */
function loadLocalRememberdUser() {
  let rememberedEmailAsText = localStorage.getItem("rememberedEmail");
  let rememberedPasswordAsText = localStorage.getItem("rememberedPassword");
  if (rememberedEmailAsText && rememberedPasswordAsText) {
    rememberedEmail = JSON.parse(rememberedEmailAsText);
    rememberedPassword = JSON.parse(rememberedPasswordAsText);
  }
  getRemeberdUser();
}

/**
 * Populates the email and password input fields with the remembered credentials 
 * if the "Remember Me" option is active. Otherwise, clears the fields.
 */
function getRemeberdUser() {
  let emailValue = document.getElementById("emailLogIn");
  let passwordValue = document.getElementById("passwordLogIn");
  if (checked) {
    emailValue.value = rememberedEmail;
    passwordValue.value = rememberedPassword;
  } else {
    emailValue.value = '';
    passwordValue.value = '';
  }
}

/**
 * Changes the visibility icon for the password field depending on whether the 
 * password input has content or not. Enables or disables the "show password" button accordingly.
 */
function changeImagePw() {
  let input = document.getElementById("passwordLogIn");
  let img = document.getElementById("showPw");
  if (input.value != "") {
    img.src = "./img/visibility_off.svg";
    document.getElementById("btnShowPwLogIn").disabled = false;
  } else {
    img.src = "./img/lock.svg";
    document.getElementById("btnShowPwLogIn").disabled = true;
  }
}

/**
 * Toggles the visibility of the password field between plain text and hidden.
 * Also updates the visibility icon accordingly.
 */
function showPassword() {
  let passwordField = document.getElementById("passwordLogIn");
  let visibilityImage = document.getElementById("showPw");
  if (passwordField.type === "password") {
    passwordField.type = "text";
    visibilityImage.src = "./img/visibility.svg";
  } else {
    passwordField.type = "password";
    visibilityImage.src = "./img/visibility_off.svg";
  }
}

/**
 * Validates the email input field. Ensures the field is not empty and contains 
 * a valid email format (with an '@' sign). Displays appropriate error messages if invalid.
 */
function requiredInput() {
  let emailInput = document.getElementById("emailLogIn");
  let requiredEmail = document.getElementById("requiredEmail");
  if (emailInput.value === "") {
    requiredEmail.innerHTML = "This field is required";
    emailInput.parentNode.classList.add("required-border");
  } else if (!emailInput.value.includes("@")) {
    requiredEmail.innerHTML = `'${emailInput.value}' is not valid. Please use an @-sign`;
    emailInput.parentNode.classList.add("required-border");
  } else {
    requiredEmail.innerHTML = "";
    emailInput.parentNode.classList.remove("required-border");
  }
  requiredPasswordInput(emailInput);
}

/**
 * Validates the password input field. Ensures the field is not empty. If valid,
 * it proceeds to check the user credentials via `checkUserInput()`.
 * 
 * @param {HTMLElement} emailInput - The email input field element.
 */
function requiredPasswordInput(emailInput) {
  let passwordInput = document.getElementById("passwordLogIn");
  let requiredPassword = document.getElementById("requiredPassword");
  if (passwordInput.value != "") {
    requiredPassword.innerHTML = "";
    passwordInput.parentNode.classList.remove("required-border");
    checkUserInput(emailInput, passwordInput, requiredPassword);
  } else {
    requiredPassword.innerHTML = "This field is required";
    passwordInput.parentNode.classList.add("required-border");
  }
}

/**
 * Checks if the provided email and password match any user in the database.
 * If a match is found, the user's information is saved locally, otherwise an 
 * error message is shown.
 * 
 * @param {HTMLElement} rightEmail - The email input field element.
 * @param {HTMLElement} passwordInput - The password input field element.
 * @param {HTMLElement} wrongInput - The element to display an error message if login fails.
 */
async function checkUserInput(rightEmail, passwordInput, wrongInput) {
  let response = await fetch(BASE_URL + "id" + ".json");
  let responseToJson = await response.json();
  let userFound = false;
  Object.keys(responseToJson).forEach((key) => {
    if (responseToJson[key].email === rightEmail.value && responseToJson[key].password === passwordInput.value) {
      userName = responseToJson[key].name;
      userEmail = responseToJson[key].email;
      userId = key;
      userFound = true;
      saveLocalRemember();
    }
  });
  if (!userFound) {
    wrongInput.innerHTML = "Ups! Wrong email or password. Try again";
  }
}

/**
 * Logs in the user as a guest. Sets the userName and userId as "guest",
 * and calls `setuserName()` to reflect this.
 */
function guestLogIn() {
  userName = "guest";
  userId = "guest";
  userEmail = "guestuser@join.de"
  setuserName();
}

/**
 * Saves the user's email and password to localStorage if the "Remember Me" option 
 * is enabled. If the option is not enabled, the credentials are cleared from localStorage.
 */
function saveLocalRemember() {
  if (checked) {
    rememberedEmail = document.getElementById("emailLogIn").value;
    rememberedPassword = document.getElementById("passwordLogIn").value;
  } else {
    rememberedEmail = "";
    rememberedPassword = "";
  }
  localStorage.setItem("rememberedEmail", JSON.stringify(rememberedEmail));
  localStorage.setItem("rememberedPassword", JSON.stringify(rememberedPassword));
  setuserName();
}
