function toggleDisplay() {
    document.getElementById("signUp").classList.toggle("d_none")
    document.getElementById("signUp").classList.toggle("d_flex")
  let forms = document.getElementsByTagName("form");
  for (let i = 0; i < forms.length; i++) {
    forms[i].classList.toggle("d_none");
  }
}
