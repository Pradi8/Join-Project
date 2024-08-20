async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    const file = element.getAttribute("w3-include-html");
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
  showInitials();
}

function showOverlayMenu() {
  document.getElementById("menu-bar-avatar").classList.add("show-overlay-menu");
  document.getElementById("menu-bar-avatar-mobile").classList.add("show-overlay-menu");
}

function logout() {
  window.location.href = "index.html";
}

function showInitials() {
  loadUser();
  document.getElementById("userShortcut").innerHTML = getInitials();
  document.getElementById("userShortcutMobile").innerHTML = getInitials();
}

function getInitials() {
  let words = userName.split(" ");
  let initials = "";
  if (words.length > 0) {
    initials += words[0].charAt(0).toUpperCase();
    if (words.length > 1) {
      initials += words[words.length - 1].charAt(0).toUpperCase();
    }
  }
  return initials;
}
