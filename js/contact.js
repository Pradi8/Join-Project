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
  shortcut: '<img src="./img/person_white.svg" alt="">',
};
let type;
let chosenContactId = "";

function openEditContact(editMode) {
  type = editMode;
  if (type === "prepareContact") {
    prepareMode.headline = "Edit Contact";
    prepareMode.headText = "";
    prepareMode.btnLeft = "Delete";
    prepareMode.btnRight = "Save";
    prepareMode.shortcut = editShortcut();
  } else {
    prepareMode.headline = "Add contact";
    prepareMode.headText = "Tasks are better with a team!";
    prepareMode.btnLeft = "Cancel X";
    prepareMode.btnRight = "Create contact";
    prepareMode.shortcut = '<img src="./img/person_white.svg" alt="">';
  }
  let editField = document.getElementById("editContact");
  editField.classList.add("edit-field");
  editField.innerHTML = showEditHtml();
}

function editShortcut() {
  for (let i = 0; i < currentContacts.length; i++) {
    if (chosenContactId === currentContacts[i].contactId) {
      let editShortcutName = getShortcut(currentContacts[i].contactName);
      return editShortcutName;
    }
  }
}

function closeEditField(action) {
  if(action === 'Delete'){
    deleteContact()
    console.log("erfolgreich gelöscht");
    loadContacts();
    document.getElementById("detailContacts").classList.remove("detail-contacts");
  }
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
      chosenContactId = id;
      let foundName = currentContacts[i].contactName;
      let foundEmail = currentContacts[i].contactEmail;
      let foundPhone = currentContacts[i].contactPhone;
      let initials = getShortcut(foundName);
      deatilInformation.innerHTML = showDetialInformationHtml(foundName, foundEmail, foundPhone, initials);
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
  let message= document.getElementById("succesfullEdit")
  message.classList.add("succesfull-edit");
  closeEditField();
  loadContacts();
  setTimeout(() => {
    message.classList.remove("succesfull-edit");
  }, 2000);
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
    });
  } catch (error) {
    loadContacts();
  }
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

async function deleteContact() {
 await fetch(CONTACT_URL + userId + chosenContactId + ".json", {
    method: "DELETE",
  });
  console.log("erfolgreich gelöscht");
  return
}