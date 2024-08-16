let contactInformation = {
  contactId: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
};
let currentContacts = [];
let prepareMode = {
  headline: "Add contact",
  headText: "Tasks are better with a team!",
  btnLeft: "Cancel X",
  btnRight: "Create contact",
};
let type;

function openEditContact(editMode) {
  type = editMode;
  let editField = document.getElementById("editContact");
  editField.classList.add("edit-field");
  editField.innerHTML = showEditHtml();
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
  let deatilInformation = document.getElementById("detailContacts");
  deatilInformation.classList.add("detail-contacts");
  document.getElementById(id).classList.add("chosen-contact");
  for (let i = 0; i < currentContacts.length; i++) {
    if (currentContacts[i].contactId === id) {
      let foundName = currentContacts[i].contactName
      let foundEmail = currentContacts[i].contactEmail
      let foundPhone = currentContacts[i].contactPhone
      let initials = getShortcut(foundName)
      deatilInformation.innerHTML = showDetialInformationHtml(foundName, foundEmail, foundPhone , initials);
    }
  }
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
  if (type === "newContact") {
    await fetch(CONTACT_URL + userId + ".json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactInformation),
    });
  } else {
    await fetch(CONTACT_URL + userId + contactId + ".json", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactInformation),
    });
  }
  succesEditMessage();
}

function succesEditMessage() {
  document.getElementById("succesfullEdit").classList.add("succesfull-edit");
  closeEditField();
  loadContacts();
}

async function loadContacts() {
  loadUser();
  currentContacts = [];
  try {
    let loadResponse = await fetch(CONTACT_URL + userId + ".json");
    let contactToJson = await loadResponse.json();
    console.log(contactToJson);

    Object.keys(contactToJson).forEach((key) => {
      let currentcontactInformation = {
        contactId: key,
        contactName: contactToJson[key].contactName,
        contactEmail: contactToJson[key].contactEmail,
        contactPhone: contactToJson[key].contactPhone,
      };

      currentContacts.push(currentcontactInformation);
      console.log(currentContacts);
    });
  } catch (error) {
    loadContacts();
  }

  console.log(currentContacts);
  showContactList();
}

function showContactList() {
  let list = document.getElementById("peopleList");
  list.innerHTML = "";
  for (let i = 0; i < currentContacts.length; i++) {
    let id = currentContacts[i].contactId;
    let name = currentContacts[i].contactName;
    let email = currentContacts[i].contactEmail;
    let shortcut = getShortcut(name);
    list.innerHTML += ContactListHtml(id, name, email, shortcut);
  }
}

function getShortcut(name) {
  let words = name.split(" ");
  let initials = "";
  for (let i = 0; i < words.length; i++) {
    if (words[i].length > 0) {
      initials += words[i].substring(0, 1).toUpperCase();
    }
  }
  return initials;
}

