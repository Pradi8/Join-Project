function openEditContact(id) {
  document.getElementById(id).classList.add("edit-field");
}

function closeEditField() {
  document.getElementById("editContact").classList.remove('edit-field')
  document.getElementById("editContact").classList.add('edit-field-reverse')
  setTimeout(() => {
    document.getElementById("editContact").classList.remove('edit-field-reverse')
  }, 900);
}
