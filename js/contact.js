let contactInformation = {
  contactName: {},
  contactEmail: {},
  contactPhone: {},
};

function openEditContact(id) {
  document.getElementById(id).classList.add("edit-field");
}

function closeEditField() {
  document.getElementById("editContact").classList.remove("edit-field");
  document.getElementById("editContact").classList.add("edit-field-reverse");
  setTimeout(() => {
    document
      .getElementById("editContact")
      .classList.remove("edit-field-reverse");
  }, 900);
}
function showDetailContact(id) {
  document.getElementById("detailContacts").classList.add("detail-contacts");
  document.getElementById(id).classList.add("chosen-contact");
}

function requiredContactName() {
  let nameInput = document.getElementById("newContactName");
  let requiredName = document.getElementById("requiredEditName");
  if (nameInput.value === "") {
    requiredName.innerHTML = "This field is required";
    nameInput.parentNode.classList.add("required-border");
  } else {
    requiredName.innerHTML = "";
    nameInput.parentNode.classList.remove("required-border");
    contactInformation.contactName = nameInput.value;
    requiredContactEmail();
  }
}
function requiredContactEmail() {
  let emailInput = document.getElementById("newContactEmail");
  let requiredEmail = document.getElementById("requiredEditEmail");
  if (emailInput.value === "") {
    requiredEmail.innerHTML = "This field is required";
    emailInput.parentNode.classList.add("required-border");
  } else if (!emailInput.value.includes("@")) {
    requiredEmail.innerHTML = `'${emailInput.value}' is not valid. Please use an @-sign`;
    emailInput.parentNode.classList.add("required-border");
  } else {
    requiredEmail.innerHTML = "";
    emailInput.parentNode.classList.remove("required-border");
    contactInformation.contactEmail = emailInput.value;
    requiredContactPhone();
  }
}

function requiredContactPhone() {
  let phoneInput = document.getElementById("newContactPhone");
  let requiredContactPhone = document.getElementById("requiredEditPhone");
  if (phoneInput.value === "") {
    requiredContactPhone.innerHTML = "This field is required";
    phoneInput.parentNode.classList.add("required-border");
  } else {
    requiredContactPhone.innerHTML = "";
    phoneInput.parentNode.classList.remove("required-border");
    contactInformation.contactPhone = phoneInput.value;
    saveContact();
  }
}

async function saveContact() {
  let responseContact = await fetch(CONTACT_URL + userId + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contactInformation),
  });
  return (responseToJson = await responseContact.json());
}
