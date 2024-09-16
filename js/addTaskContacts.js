/**
* this function gets your own name
*/

function loadOwnName() {
 let userNameAsText = localStorage.getItem("userName");
 let userIdAsText = localStorage.getItem("userId");
 if (userNameAsText && userIdAsText) {
     userName = JSON.parse(userNameAsText);
     userId = JSON.parse(userIdAsText);
     let contactInformation = {
     contactId : userId, 
     contactName : userName +'(yourself)',
     contactColor : userColor
     };
     addAssignedContacts.push(contactInformation);
 } else {
     window.location.href = "index.html"
 }
}
  
/**
* this function load the contacts from the database
*/

async function loadContactsData() {
 let userIdAsText = localStorage.getItem("userId");
 if (userIdAsText) {
    userId = JSON.parse(userIdAsText);
 }
 let userUrl = CONTACT_URL
    if(userId === "guest") userUrl = GUESTCONTACT_URL;
 let response = await fetch(userUrl + userId + ".json");
 let responseToJson = await response.json();
 return responseToJson;
 }

/**
 * this function load the contacts from the database
 */
  
async function getContactNamesData() {
 addAssignedContacts = [];
 let ContactsNamesAddtask = await loadContactsData();
 for (let [key] of Object.entries(ContactsNamesAddtask)) {
 let contactInformation = {
    contactId: key,
    contactName: ContactsNamesAddtask[key].contactName,
    contactColor: ContactsNamesAddtask[key].contactColor
 };
 addAssignedContacts.push(contactInformation);
 }
 showAssignedContacts();
}
  
/**
* this function show the contacts
*/
  
function showAssignedContacts() {
 let assignedContacts = document.getElementById('contacts-to-assign');
 assignedContacts.innerHTML = '';
 for (let i = 0; i < addAssignedContacts.length; i++) {
    let contactid = addAssignedContacts[i].contactId;
    let contactsAddTask = addAssignedContacts[i].contactName;
    let contactColor = addAssignedContacts[i].contactColor;
    getFirstLetter(contactsAddTask);
    let shortName = getShortcut(contactsAddTask);
    assignedContacts.innerHTML += showContactsDetails(i, contactsAddTask, contactColor,contactid, shortName);
}
}

function showContactsDetails(i, contactsAddTask, contactColor,contactid, shortName) {
 let isChecked = data.assignedTo.includes(contactid) ? 'checked' : '';
 return /* html */  `
        <div class="input-contacts-name" id="contacts-to-assign" onclick="checkContact(${i},'${contactsAddTask}','${contactColor}','${contactid}',event)">
            <div class="contact-shortname-name">
            <div class="shortcut-contact" style="background-color:${contactColor}">${shortName}</div>
            <div>${contactsAddTask}</div>
            </div>
            <img src="./img/Property 1=Default.svg" id="checkbox-${i}">
        </div>`;
}

/**
 * 
 * This function allows you to select contacts
 * @param {number} i index in the Array
 * @param {string} nameContact Contact name
 * @param {string} nameColor Contact color
 * @param {string} contactid contact id
 */

function checkContact(i, nameContact, nameColor, contactid,event) {
 event.stopPropagation();
 let index = data.assignedTo.indexOf(contactid);
 if (index === -1) {
    data.assignedTo.push(contactid);
    updateContactDetails(i, nameContact, nameColor, contactid);
    document.getElementById(`checkbox-${i}`).src = 'img/Property 1=checked.svg';
} else {
    data.assignedTo.splice(index, 1);
    document.getElementById(`checkbox-${i}`).src = './img/Property 1=Default.svg'; 
    checkBoxChecked(i);
    }
}

function updateContactDetails(i, nameContact, nameColor, contactid){
 let addSigneToContact =  document.getElementById('short-name');
 getFirstLetter(nameContact);
 let shortName = getShortcut(nameContact);
 addSigneToContact.innerHTML += `<div id="checked-${i}"><div class="shortcut-contact" style="background-color:${nameColor}">${shortName}</div></div>`;
 document.getElementById('short-name').classList.remove('d-none');
 let searchInput = document.getElementById('add-task-contacts-input');
 searchInput.value = '';
}


function checkBoxChecked(i) {
 let checkedBox = document.getElementById(`checked-${i}`);
 if (checkedBox) {
    checkedBox.remove(); 
    }
}

/**
 * this function closes the contact list 
 */
  
function closeContactsList() {
 document.getElementById('contacts-to-assign').classList.add('d-none');
 document.getElementById('add-task-contacts-assign').style.border = '1px solid rgba(209, 209, 209, 1)';
 document.getElementById('add-task-contacts-assign-img').classList.remove('rotate-arrow');
}

/**
 * this function opens the contact list 
 */

function addContactsassign() {
 setTimeout(() => {
    document.getElementById('contacts-to-assign').classList.remove('d-none');
    document.getElementById('contacts-to-assign').classList.add('contacts-visibility');
 },10);
 searchInputField();
}

/**
 * this function opens the search function for contacts 
 */
  
function searchInputField() {
 let input = document.getElementById('add-task-contacts-input');
 input.classList.remove('d-none');
 input.focus();
 document.getElementById('select-contact-assign').classList.add('d-none');
 document.getElementById('add-task-contacts-assign-img').classList.add('rotate-arrow');
 document.getElementById('add-task-contacts-assign').classList.add('blue-border');
}

/**
 * this function empties the selected contacts  
 */

function contactClear() {
 document.getElementById('contacts-to-assign').classList.add('d-none');
 document.getElementById('add-task-contacts-assign').style.border = '1px solid rgba(209, 209, 209, 1)';
 document.getElementById('add-task-contacts-assign-img').classList.remove('rotate-arrow');
 let searchInput = document.getElementById('add-task-contacts-input');
 searchInput.value = '';
 document.getElementById('add-editable-input').classList.remove('d-none');
 document.getElementById('max-subtasks-created').classList.add('d-none');
 document.getElementById('max-subtasks-created').classList.remove('max-subtask');
 isValidCategory = isValidDate = isValidTitle= isValid = false;
}


/**
 * this function clear the form
 */

function clearForm() {
    let subtaskList = document.getElementById('created-subtaks');
    if(subtaskList) {
      subtaskList.innerHTML = "";
    }
    data.subtasks = [];
    data.assignedTo = [];
    cancelEdit();
    document.getElementById("task-title").value = '';
    document.getElementById("task-description").value = '';
    document.getElementById('add-task-due-date').value = '';
    document.getElementById('selected-task').innerHTML = 'Select task category';
    document.getElementById('select-category').classList.add('d-none');
    document.getElementById('task-subtasks').classList.remove('d-none');
    document.getElementById('select-task-category-img').classList.remove('rotate-arrow');
    document.getElementById('short-name').innerHTML = '';
    taskPrioMedium();
    contactClear();
  }