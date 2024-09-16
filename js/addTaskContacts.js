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
        <div class="input-contacts-name" id="contacts-to-assign" onclick="checkContact(${i},'${contactsAddTask}','${contactColor}','${contactid}'); stopPropagation(event)">
            <div class="contact-shortname-name">
            <div class="shortcut-contact" style="background-color:${contactColor}">${shortName}</div>
            <div>${contactsAddTask}</div>
            </div>
            <input type="checkbox" ${isChecked} id="checkbox-${i}">
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

function checkContact(i, nameContact, nameColor, contactid){
 let check = document.getElementById(`checkbox-${i}`);
 let addSigneToContact =  document.getElementById('short-name');
 if(!check.checked) {
    if(!addSigneToContact.innerHTML.includes(nameContact)) {
     data.assignedTo.push(contactid);
     getFirstLetter(nameContact);
     let shortName = getShortcut(nameContact);
     addSigneToContact.innerHTML += `<div id="checked-${i}"><div class="shortcut-contact" style="background-color:${nameColor}">${shortName}</div></div>`;
     check.checked = true;
     }} else { 
     let index = data.assignedTo.indexOf(contactid);
    if (index > -1) {
        data.assignedTo.splice(index, 1); 
 }
 let checkedBox = document.getElementById(`checked-${i}`);
 if(checkedBox) {
    checkedBox.remove();
    }
 }
 document.getElementById('short-name').classList.remove('d-none');
 let searchInput = document.getElementById('add-task-contacts-input');
 searchInput.value = '';
 showAssignedContacts();
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