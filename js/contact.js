let contactInformation = {
  contactId: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  contactColor: ""
};
let prepareMode = {
  headline: "",
  headText: "",
  btnLeft: "",
  btnRight: "",
  shortcut: "",
};

let type;
let chosenContact = [];
let bCreateNew = false;
let bEditContact = false;
let lastCreateContact;
let lastLetter;
let lastMarker=""

async function showContactList() {
  await loadUser()
  let userIdAsText = localStorage.getItem("userId");
  if (userIdAsText) {
  userId = JSON.parse(userIdAsText);
  }
  else{
    window.location.href = "index.html"
  }
  let list = document.getElementById("peopleList");
  if(userId === "guest"){
    document.getElementById('btnNewContact').classList.add("btn-disabled")
    document.getElementById('btnNewContactRepo').classList.add("btn-disabled")
  }
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


/**
 * This function opens the edit window to add a ne contact or prepare a contact
 * 
 * @param {string} editMode This parameter compares between to prepare a contact or add a ne contact
 */

function openEditContact(editMode) {
  if(userId === "guest") return
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

/**
 * This function fills the content of the HTML element with the "prepared" content.
 * 
 */

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

/**
 * This function fills the content of the HTML element with the "add ne contact" content.
 * 
 */

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

/**
 * This function will close the edit filed 
 * 
 * @param {string} action This parameter deciedes if the content will delete before closig the field
 */


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

/**
 * This function will delete a chosen contact
 * 
 */

async function deleteContact() {
  await fetch(CONTACT_URL + userId + "/" + chosenContact.contactId + ".json", {
    method: "DELETE",
  });
  bCreateNew = false;
  bEditContact = false;
  lastMarker="";
  showContactList();
  document.getElementById("detailContacts").classList.remove("detail-contacts");
}

/**
 * Thios function will show the details of a chosen contact from list
 * 
 * @param {string} id This parameter is the id of the chosen contact
 */

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
      bgColorInitals = chosenContact.contactColor
      detailInformation.innerHTML = showDetialInformationHtml(foundName, foundEmail, foundPhone, initials);
    }
  }
  if(userId === "guest"){
    let btnDisabled = ["editContactDetail","deleteContactDetail", "editContactRepo", "deleteContactRepo"]
    btnDisabled.forEach(btn => {
      document.getElementById(btn).classList.add("btn-disabled")
    });
  }
}

/**
 * This function marks the chosen contact to change the background color
 * 
 * @param {string} id This parameter is the id of the chosen contact
 */

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

/**
 * This function checks whether the entered content of the field meets the required criteria 
 * 
 */

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
    
  }
  requiredContactEmail();
}

/**
 * This function checks whether the entered content of the field meets the required criteria 
 * 
 */

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
  }
  requiredContactPhone();
}

/**
 * This function checks whether the entered content of the field meets the required criteria 
 * 
 */

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
    randomColor();
  }
}

/**
 * This function create user color
 * 
 */

function randomColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random()*16)];
  }
  contactInformation.contactColor = color
  saveContact();
}

/**
 * This function creates a new database entry or prepares a current entry
 * 
 */

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
    await fetch(CONTACT_URL + userId + "/" + chosenContact.contactId + ".json",
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

/**
 * This function show a succes message
 * 
 */

function succesEditMessage() {
  let message = document.getElementById("succesfullEdit");
  message.classList.add("succesfull-edit");
  closeEditField();
  showContactList();
  setTimeout(() => {
    message.classList.remove("succesfull-edit");
  }, 2000);
}


function craeteContactList(list) {
  currentContacts.splice(0,1); 
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
    let color = sortedContacts[i].contactColor;
    let underline = getUnderline(firstLetter);
    list.innerHTML += ContactListHtml(id, name, email, shortcut, firstLetter, color, underline);
  }
}

function getShortcut(name) {
  let shortcut = "";
  let trimName= name.trim()
  let words = trimName.split(" ");
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