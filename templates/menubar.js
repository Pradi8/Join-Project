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

document.addEventListener('click', function(event) {
  const overlayMenuDesktop = document.getElementById('my-avatar-desktop');
  if (overlayMenuDesktop && !overlayMenuDesktop.contains(event.target)) {
    document.getElementById("menu-bar-avatar").classList.remove("show-overlay-menu");
  }
});

document.addEventListener('click', function(event) {
  const overlayMenuMobile = document.getElementById('my-avatar-mobile');
  if (overlayMenuMobile && !overlayMenuMobile.contains(event.target)) {
    document.getElementById("menu-bar-avatar-mobile").classList.remove("show-overlay-menu");
  }
});

function logout() {
  userId="";
  userName="";
  setuserName();
  window.location.href = "index.html";
}

function showInitials() {
  loadUser();
  document.getElementById("userShortcut").innerHTML = getInitials();
  document.getElementById("userShortcutMobile").innerHTML = getInitials();
  markChosenPage();
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

function markChosenPage(){
  let fullPath = window.location.pathname;
  let pathHtml =  fullPath.substring(fullPath.lastIndexOf('/') + 1);
  let chosenPage = pathHtml.replace('.html', '')
  document.getElementById(chosenPage+"-desk-link").style.backgroundColor ="#091931"
  document.getElementById(chosenPage+"-mobile-link").style.backgroundColor ="#091931"
}
