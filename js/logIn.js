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
  requiredEmail.innerHTML = emailValue === "" ? "This field is required" : !emailValue.includes("@") ? `'${emailValue}' is not valid. Please use an @-sign` : "";
  requiredPassword.innerHTML = passwordValue === "" ? "This field is required" : "";
  if (requiredEmail.innerHTML || requiredPassword.innerHTML) return;
  checkUserInput(emailInput, requiredPassword);
}

async function checkUserInput(rightEmail, wrongInput) {
  try {
    let response = await fetch(BASE_URL + "id" + ".json");
    let responseToJson = await response.json();

    for (let i of responseToJson) {
        if (i.email === rightEmail.value) {
            console.log("richtig");
            window.location.href = "summary.html"
            break; // Beende die Schleife, wenn die E-Mail gefunden wurde
        }
        wrongInput.innerHTML ="Ups! Wrong email or password. Try again"
    }
} catch (error) {
    console.error("Fehler beim Abrufen der Daten:", error);
}


  /* hier wird die Datenbank auf den nutzer durchsucht */
/*   window.location.href = "summary.html"; */
}

function guestLogIn() {
  userId = "guest";
  let userIdAsText = JSON.stringify(userId);
  localStorage.setItem("userId", userIdAsText);
  window.location.href = "summary.html";
}
