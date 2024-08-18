let contactInformation = {
  contactId: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
};
let prepareMode = {
  headline: "",
  headText: "",
  btnLeft: "",
  btnRight: "",
  shortcut: "",
};
let currentContacts = [];
let type;
let chosenContact = [];
let bshowDeatils = false;
let lastCreateContact;
let lastLetter;

async function loadContacts() {
  loadUser();
  currentContacts = [];
  try {
    let loadResponse = await fetch(CONTACT_URL + userId + ".json");
    let contactToJson = await loadResponse.json();
    Object.keys(contactToJson).forEach((key) => {
      let currentContactInformation = {
        contactId: key,
        contactName: contactToJson[key].contactName,
        contactEmail: contactToJson[key].contactEmail,
        contactPhone: contactToJson[key].contactPhone,
      };
      currentContacts.push(currentContactInformation);
    });
  } catch (error) {
    loadContacts();
  }
  showContactList();
}

function openEditContact(editMode) {
  let editField = document.getElementById("editContact");
  type = editMode;
  if (type === "prepareContact") {
    prepareEditMode();
  } else {
    prepareContactMode();
    bshowDeatils = true;
  }
  editField.classList.add("edit-field");
  editField.innerHTML = showEditHtml();
}

function prepareEditMode() {
  prepareMode.headline = "Edit Contact";
  prepareMode.headText = "";
  prepareMode.btnLeft = "Delete";
  prepareMode.btnRight = "Save";
  prepareMode.shortcut = getShortcut(chosenContact.contactName);
  contactInformation.contactId = chosenContact.contactId;
  contactInformation.contactName = chosenContact.contactName;
  contactInformation.contactEmail = chosenContact.contactEmail;
  contactInformation.contactPhone = chosenContact.contactPhone;
}

function prepareContactMode() {
  prepareMode.headline = "Add contact";
  prepareMode.headText = "Tasks are better with a team!";
  prepareMode.btnLeft = "Cancel X";
  prepareMode.btnRight = "Create contact";
  prepareMode.shortcut = '<img src="./img/person_white.svg" alt="">';
  contactInformation.contactId = "";
  contactInformation.contactName = "";
  contactInformation.contactEmail = "";
  contactInformation.contactPhone = "";
}

function closeEditField(action) {
  if (action === "Delete") {
    deleteContact();
  }
  document.getElementById("editContact").classList.remove("edit-field");
  document.getElementById("editContact").classList.add("edit-field-reverse");
  setTimeout(() => {
    document
      .getElementById("editContact")
      .classList.remove("edit-field-reverse");
  }, 900);
}

async function deleteContact() {
  await fetch(CONTACT_URL + userId + "/" + chosenContact.contactId + ".json", {
    method: "DELETE",
  });
  loadContacts();
  document.getElementById("detailContacts").classList.remove("detail-contacts");
}

function showDetailContact(id) {
  let deatilInformation = document.getElementById("detailContacts");
  deatilInformation.classList.add("detail-contacts");
  document.getElementById(id).classList.add("chosen-contact");
  for (let i = 0; i < currentContacts.length; i++) {
    if (currentContacts[i].contactId === id) {
      chosenContact = currentContacts[i];
      let foundName = chosenContact.contactName;
      let foundEmail = chosenContact.contactEmail;
      let foundPhone = chosenContact.contactPhone;
      let initials = getShortcut(foundName);
      deatilInformation.innerHTML = showDetialInformationHtml(
        foundName,
        foundEmail,
        foundPhone,
        initials
      );
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
    await fetch(
      CONTACT_URL + userId + "/" + chosenContact.contactId + ".json",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactInformation),
      }
    );
  }
  succesEditMessage();
}

function succesEditMessage() {
  let message = document.getElementById("succesfullEdit");
  message.classList.add("succesfull-edit");
  closeEditField();
  loadContacts();
  setTimeout(() => {
    message.classList.remove("succesfull-edit");
  }, 2000);
}

function showContactList() {
  let list = document.getElementById("peopleList");
  if (bshowDeatils) {
    lastCreateContact = currentContacts[currentContacts.length - 1].contactId;
  }
  craeteContactList(list);
  showDetailContact(lastCreateContact);
}

function craeteContactList(list) {
  let sortedContacts = currentContacts.sort((a, b) => {
    return a.contactName.localeCompare(b.contactName);
  });
  list.innerHTML = "";
  for (let i = 0; i < sortedContacts.length; i++) {
    let id = sortedContacts[i].contactId;
    let name = sortedContacts[i].contactName;
    let email = sortedContacts[i].contactEmail;
    let shortcut = getShortcut(name);
    let fistLetter = getFirstLetter(name);
    list.innerHTML += ContactListHtml(id, name, email, shortcut, fistLetter);
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

function getFirstLetter(name) {
  let fistLetter =""
  let letter = name.charAt(0).toUpperCase();
  if (letter != lastLetter) {
    lastLetter = letter;
    fistLetter = letter
  }
  return fistLetter  
}
