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
  document.getElementById("menu-bar-avatar").classList.toggle("show-overlay-menu");
  document.getElementById("menu-bar-avatar-mobile").classList.toggle("show-overlay-menu");
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
  localStorage.removeItem("userName")
  localStorage.removeItem("userId")
  localStorage.removeItem("userEmail")
  window.location.href = "index.html";

}
function loadUserHead(){
  let userNameAsText = localStorage.getItem("userName");
  let userIdAsText = localStorage.getItem("userId");
  if (userNameAsText && userIdAsText) {
    userName = JSON.parse(userNameAsText);
    userId = JSON.parse(userIdAsText);
  }
}

function showInitials() {
  loadUserHead();
  let userShortcut = document.getElementById("userShortcut")
  let userShortcutMobile = document.getElementById("userShortcutMobile")
  if(!userId){
    document.getElementById('menuBarDesk').classList.add('d_noneimp')
    document.getElementById('menuBarMobile').classList.add('d_noneimp')
    document.getElementById('btnMenuLogout').innerHTML = `Log in`
    document.getElementById('btnMenuLogoutMobile').innerHTML = `Log in`
    userShortcut.innerHTML = `?`;
    userShortcutMobile.innerHTML = `?`;
    return
  } else{
    userShortcut.innerHTML = getInitials();
    userShortcutMobile.innerHTML = getInitials();
    markChosenPage();
  }
  
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
  try{
  document.getElementById(chosenPage+"-desk-link").style.backgroundColor ="#091931"
  document.getElementById(chosenPage+"-mobile-link").style.backgroundColor ="#091931"
  }
  catch(error){
    return
  }
}
