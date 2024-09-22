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
let previousLetter;
let lastMarker=""

/**
 * This function displays the contact list for the user. It first checks if a valid user is loaded, 
 * then retrieves the user ID from localStorage. If the user is a guest, it disables certain buttons. 
 * If a new contact was recently created, it displays that contact's details. 
 * If the user is editing an existing contact, it shows the details of the chosen contact.
 * 
 * The function performs the following steps:
 * 1. Loads the current user asynchronously.
 * 2. Retrieves the user ID from localStorage. If no user is found, redirects to the login page (index.html).
 * 3. If the user is a guest, disables buttons for creating new contacts.
 * 4. Creates the contact list in the UI.
 * 5. If a new contact was created, displays its details. If an existing contact is being edited, displays its details.
 */

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
    lastCreateContact = currentContacts[currentContacts.length - 2].contactId;
  }
  craeteContactList(list);
  if (bCreateNew) {
    showDetailContact(lastCreateContact);
  } else if (bEditContact) {
    showDetailContact(chosenContact.contactId);
  }
}

/**
 * This function creates the contact list by sorting the current contacts alphabetically by their name,
 * then generating HTML content for each contact and inserting it into the provided list element.
 * 
 * @param {string} list - The DOM element where the contact list will be displayed.
 * 
 * The function performs the following steps:
 * 1. Sorts the `currentContacts` array alphabetically based on the contact's name.
 * 2. Clears any existing content in the provided `list` element.
 * 3. Iterates over the sorted contacts, extracting their ID, name, email, and other display attributes.
 * 4. Generates the necessary HTML for each contact using helper functions and appends it to the `list` element.
 */

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
    let color = sortedContacts[i].contactColor;
    let underline = getUnderline(firstLetter);
    list.innerHTML += ContactListHtml(id, name, email, shortcut, firstLetter, color, underline);
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

async function deleteContact(id) {
  await fetch(CONTACT_URL + userId + "/" + chosenContact.contactId + ".json", {
    method: "DELETE",
  });
  bCreateNew = false;
  bEditContact = false;
  lastMarker="";
  showContactList();
  document.getElementById("detailContacts").classList.remove("detail-contacts");
  if (id === "deleteContactRepo") {
    closeDetails()
  }
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
    return
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
  if (type === "newContact") {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random()*16)];
  }
  contactInformation.contactColor = color
  saveContact();
  }
  else{
    prepareContact()
  }
}

/**
 * This function creates a new database entry or prepares a current entry
 * 
 */

async function saveContact() { 
  await fetch(CONTACT_URL + userId + ".json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactInformation),
    });
  succesEditMessage();
  
}

async function prepareContact() {
  await fetch(CONTACT_URL + userId + "/" + chosenContact.contactId + ".json",{
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactInformation),
    }
  );
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


/**
 * This function gets the initials of the Contact
 * 
 * @param {string} name the name of contact
 * @returns returns the initials of the name
 */
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


/**
 * This function shows teh first letter of the name list.
 * 
 * @param {string} name the name of contact
 * @returns returns the first letter of the name
 */
function getFirstLetter(name) {
  let fistLetter = "";
  let letter = name.charAt(0).toUpperCase();
  if (letter != previousLetter) {
    previousLetter = letter;
    fistLetter = letter;
  }
  return fistLetter;
}

/**
 * This function returns the class name for underlining the first letter of a contact's name.
 * If the `firstLetter` is not an empty string, it returns a CSS class name.
 * 
 * @param {string} firstLetter - The first letter of the contact's name.
 * @returns {string} - The CSS class name to underline the first letter (if applicable).
 */
function getUnderline(firstLetter) {
  if (firstLetter != "") {
    let underline = "first-letter";
    return underline;
  }
}

/**
 * This function hides the contact details section by setting its display to "none".
 * It is typically used to close the details view when the user chooses to hide it.
 */
function closeDetails() {
  document.getElementById("detailsContent").style.display = "none";
}

/**
 * This function shows the edit menu by adding a CSS class that makes the menu visible.
 * It also stops the event from propagating to prevent unwanted side effects.
 * 
 * @param {Event} event - The event object triggered by the user interaction.
 */
function showEditMenu(event) {
  event.stopPropagation();
  document.getElementById('editMenuRepo').classList.add('menu-repo');
}

/**
 * This function hides the edit menu by removing the CSS class that makes the menu visible.
 * It is used when the user chooses to close the edit menu or when an action completes.
 */
function hideEditMenu() {
  document.getElementById('editMenuRepo').classList.remove('menu-repo');
}
