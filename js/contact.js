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
let bCreateNew = false;
let bEditContact = false;
let lastCreateContact;
let lastLetter;
let lastMarker=""
let bgColorInitals = ""

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
    bCreateNew = false;
    bEditContact = true;
  } else {
    prepareContactMode();
    bEditContact = false;
    bCreateNew = true;
    bgColorInitals = "";
  }
  editField.classList.add("edit-field");
  editField.innerHTML = showEditHtml();
}

function prepareEditMode() {
  prepareMode = {
    headline: "Edit Contact",
    headText: "",
    btnLeft: "Delete",
    btnRight: "Save",
    shortcut: getShortcut(chosenContact.contactName),
  };

  Object.assign(contactInformation, chosenContact);
}

function prepareContactMode() {
  prepareMode = {
    headline: "Add contact",
    headText: "Tasks are better with a team!",
    btnLeft: "Cancel X",
    btnRight: "Create contact",
    shortcut: '<img src="./img/person_white.svg" alt="">',
  };
  Object.keys(contactInformation).forEach(key => contactInformation[key] = "");
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
  }, 400);
}

async function deleteContact() {
  await fetch(CONTACT_URL + userId + "/" + chosenContact.contactId + ".json", {
    method: "DELETE",
  });
  bCreateNew = false;
  bEditContact = false;
  lastMarker="";
  loadContacts();
  document.getElementById("detailContacts").classList.remove("detail-contacts");
}

function showDetailContact(id) {
  let detailInformation = document.getElementById("detailContacts");
  detailInformation.classList.add("detail-contacts");
  markChosenContact(id)
  document.getElementById(id).classList.add("chosen-contact");
  for (let i = 0; i < currentContacts.length; i++) {
    if (currentContacts[i].contactId === id) {
      chosenContact = currentContacts[i];
      let foundName = chosenContact.contactName;
      let foundEmail = chosenContact.contactEmail;
      let foundPhone = chosenContact.contactPhone;
      let initials = getShortcut(foundName);
      bgColorInitals = i % 10
      detailInformation.innerHTML = showDetialInformationHtml(foundName, foundEmail, foundPhone, initials);
    }
  }
}

function markChosenContact(id) {
  if (lastMarker) {
    document.getElementById(lastMarker).classList.remove("chosen-contact");
  }
  let chosenContact= document.getElementById(id)
  chosenContact.classList.add("chosen-contact");
  if(bCreateNew) chosenContact.scrollIntoView();
  lastMarker = id;
  document.getElementById('detailsContent').style.display ="block"
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
  if (bCreateNew) {
    lastCreateContact = currentContacts[currentContacts.length - 1].contactId;
  }
  craeteContactList(list);
  if (bCreateNew) {
    showDetailContact(lastCreateContact);
  } else if (bEditContact) {
    showDetailContact(chosenContact.contactId);
  }
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
    let firstLetter = getFirstLetter(name);
    let color = i % 10;
    let underline = getUnderline(firstLetter);
    list.innerHTML += ContactListHtml(id, name, email, shortcut, firstLetter, color, underline);
  }
}

function getShortcut(name) {
  let shortcut = "";
  let words = name.split(" ");
  if (words.length > 0) {
  shortcut += words[0].charAt(0).toUpperCase();
  if (words.length > 1) {
  shortcut += words[words.length - 1].charAt(0).toUpperCase();
    }
  }  
  return shortcut;
}
  

function getFirstLetter(name) {
  let fistLetter = "";
  let letter = name.charAt(0).toUpperCase();
  if (letter != lastLetter) {
    lastLetter = letter;
    fistLetter = letter;
  }
  return fistLetter;
}

function getUnderline(firstLetter) {
  if (firstLetter != "") {
    let underline = "first-letter";
    return underline;
  }
}

function closeDetails(){
  document.getElementById("detailsContent").style.display ="none";
}

function showEditMenu(event){
  event.stopPropagation();
  document.getElementById('editMenuRepo').classList.add('menu-repo')
}
function hideEditMenu(){
  document.getElementById('editMenuRepo').classList.remove('menu-repo')
}

function randomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random()*16)];
  }
  return color;
}