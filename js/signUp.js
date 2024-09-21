let confirmed = false;

/**
 * Redirects the user to the index page by navigating to "index.html".
 */
function openIndex() {
  window.location.href = "index.html";
}

/**
 * Toggles the acceptance of terms and conditions. Updates the icon to reflect the 
 * current state (checked/unchecked) and updates the 'confirmed' variable accordingly.
 */
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

/**
 * Updates the password visibility icon and disables/enables the show password button
 * for the sign-up password input field.
 */
function changeImagePwSignedIn() {
  changeImagePassword("passwordSignUp", "showSignUpPw", "btnShowPwSignUp");
}

/**
 * Updates the password visibility icon and disables/enables the show password button
 * for the confirm password input field.
 */
function changeImagePwConfirmed() {
  changeImagePassword("confirmPasswordSignUp", "showConfirmedPw", "btnShowPwConfirm");
}

/**
 * Updates the visibility icon for the password input and enables/disables the button 
 * based on whether the input field is empty or not.
 * 
 * @param {string} inputId - The ID of the password input field.
 * @param {string} imgId - The ID of the visibility icon element.
 * @param {string} buttonId - The ID of the button to show/hide the password.
 */
function changeImagePassword(inputId, imgId, buttonId) {
  let inputElement = document.getElementById(inputId);
  let imgElement = document.getElementById(imgId);
  let buttonElement = document.getElementById(buttonId);
  
  if (inputElement.value !== "") {
    imgElement.src = "./img/visibility_off.svg";
    buttonElement.disabled = false;
  } else {
    imgElement.src = "./img/lock.svg";
    buttonElement.disabled = true;
  }
}

/**
 * Toggles the visibility of the sign-up password input field between plain text 
 * and hidden. Updates the visibility icon accordingly.
 */
function showSignedUpPassword() {
  togglePasswordVisibility("passwordSignUp", "showSignUpPw");
}

/**
 * Toggles the visibility of the confirm password input field between plain text 
 * and hidden. Updates the visibility icon accordingly.
 */
function showConfirmedPassword() {
  togglePasswordVisibility("confirmPasswordSignUp", "showConfirmedPw");
}

/**
 * Toggles the visibility of a password field between plain text and hidden, 
 * and updates the corresponding visibility icon.
 * 
 * @param {string} passwordFieldId - The ID of the password input field.
 * @param {string} visibilityImageId - The ID of the visibility icon element.
 */
function togglePasswordVisibility(passwordFieldId, visibilityImageId) {
  let passwordField = document.getElementById(passwordFieldId);
  let visibilityImage = document.getElementById(visibilityImageId);
  if (passwordField.type === "password") {
    passwordField.type = "text";
    visibilityImage.src = "./img/visibility.svg";
  } else {
    passwordField.type = "password";
    visibilityImage.src = "./img/visibility_off.svg";
  }
}

/**
 * Validates the name input field for sign-up. Ensures the field is not empty. 
 * If valid, it proceeds to validate the email input field.
 */
function requiredName() {
  let nameInput = document.getElementById("nameSignUp");
  let requiredName = document.getElementById("requiredName");
  if (nameInput.value === "") {
    requiredName.innerHTML = "This field is required";
    nameInput.parentNode.classList.add("required-border");
  } else {
    requiredName.innerHTML = "";
    nameInput.parentNode.classList.remove("required-border");
  }
  requiredEmail();
}

/**
 * Validates the email input field for sign-up. Ensures the field is not empty 
 * and contains a valid email format (with an '@' sign). Proceeds to validate 
 * the password input field if valid.
 */
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
  }
  requiredPasswordSignUP();
}

/**
 * Validates the password input field for sign-up. Ensures the field is not empty.
 * If valid, it proceeds to validate the confirmed password input field.
 */
function requiredPasswordSignUP() {
  let newPasswordInput = document.getElementById("passwordSignUp");
  let requiredNewPassword = document.getElementById("requiredPwSingUp");
  if (newPasswordInput.value === "") {
    requiredNewPassword.innerHTML = "This field is required";
    newPasswordInput.parentNode.classList.add("required-border");
  } else {
    requiredNewPassword.innerHTML = "";
    newPasswordInput.parentNode.classList.remove("required-border");
  }
  confirmedPasswordSignUp(newPasswordInput);
}

/**
 * Validates the confirmed password input field. Ensures it matches the new password.
 * If the passwords match, proceeds to the final steps of the sign-up process.
 * 
 * @param {HTMLElement} newPasswordInput - The new password input field element.
 */
function confirmedPasswordSignUp(newPasswordInput) {
  let confirmedPasswordInput = document.getElementById("confirmPasswordSignUp");
  let requiredConfirmedPassword = document.getElementById("requiredConfirmPwSingUp");
  if (confirmedPasswordInput.value === "") {
    requiredConfirmedPassword.innerHTML = "This field is required";
    confirmedPasswordInput.parentNode.classList.add("required-border");
  } else {
    requiredConfirmedPassword.innerHTML = "";
    confirmedPasswordInput.parentNode.classList.remove("required-border");
    comparePasswords(newPasswordInput, confirmedPasswordInput, requiredConfirmedPassword);
  }
}

/**
 * Compares the new password and the confirmed password. If they do not match, 
 * an error message is shown. Otherwise, proceeds to the confirmation step.
 * 
 * @param {HTMLElement} newPw - The new password input field element.
 * @param {HTMLElement} confirmedPw - The confirmed password input field element.
 * @param {HTMLElement} wrongPw - The element to display an error message if passwords do not match.
 */
function comparePasswords(newPw, confirmedPw, wrongPw) {
  if (newPw.value != confirmedPw.value) {
    wrongPw.innerHTML = "Your passwords don't match. Please try again.";
    return;
  }
  checkConfirmed();
}

/**
 * Ensures the user has accepted the terms and conditions. If the terms are accepted,
 * proceeds to add the user to the database.
 */
function checkConfirmed() {
  let terms = document.getElementById("requiredTerms");
  terms.innerHTML = confirmed === false ? "please accept our terms" : "";
  if (terms.innerHTML) return;
  addUserToDatabase();
}

/**
 * Sends the user's sign-up details (name, email, and password) to the server 
 * to add them to the database. Displays a success message upon completion 
 * and redirects the user to the index page after 2 seconds.
 */
async function addUserToDatabase() {
  let newName = document.getElementById("nameSignUp").value;
  let newEmail = document.getElementById("emailSignUp").value;
  let newPassword = document.getElementById("passwordSignUp").value;
  await fetch(BASE_URL + "id" + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "email": newEmail,
      "name": newName,
      "password": newPassword
    })
  });
  document.getElementById("succsesOverlay").classList.remove("d-none");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 2000);
}
