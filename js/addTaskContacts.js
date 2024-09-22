/**
* this function show the contacts
*/
  
function showAssignedContacts() {
 let assignedContacts = document.getElementById('contacts-to-assign');
 assignedContacts.innerHTML = '';
 currentContacts.sort((a, b) => a.contactName.localeCompare(b.contactName));
 userAsContactFirst()
 for (let i = 0; i < currentContacts.length; i++) {
    let contactid = currentContacts[i].contactId;
    let contactsAddTask = currentContacts[i].contactName;
    let contactColor = currentContacts[i].contactColor;
    getFirstLetter(contactsAddTask);
    let shortName = getShortcut(contactsAddTask);
    assignedContacts.innerHTML += showContactsDetails(i, contactsAddTask, contactColor,contactid, shortName);
}
}

function showContactsDetails(i, contactsAddTask, contactColor,contactid, shortName) {
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
    updateContactDetails(i, nameContact, nameColor);
    document.getElementById(`checkbox-${i}`).src = 'img/Property 1=checked.svg';
} else {
    data.assignedTo.splice(index, 1);
    document.getElementById(`checkbox-${i}`).src = './img/Property 1=Default.svg'; 
    checkBoxChecked(i);
    }
}

/**
 * this function create the name shortcut
 * 
 * @param {*} i index in the Array
 * @param {*} nameContact Contact name
 * @param {*} nameColor Contact color
 */

function updateContactDetails(i, nameContact, nameColor){
 let addSigneToContact =  document.getElementById('short-name');
 getFirstLetter(nameContact);
 let shortName = getShortcut(nameContact);
 addSigneToContact.innerHTML += `<div id="checked-${i}"><div class="shortcut-contact" style="background-color:${nameColor}">${shortName}</div></div>`;
 document.getElementById('short-name').classList.remove('d-none');
 let searchInput = document.getElementById('add-task-contacts-input');
 searchInput.value = '';
}

/**
 * this function delete the contacts div
 * 
 * @param {*} i index in the Array
 */

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
 * This function search contact 
 */

function searchContact() {
    let searchInput = document.getElementById('add-task-contacts-input').value.trim().toLowerCase();
    let result = document.getElementById('contacts-to-assign');
    result.innerHTML = '';
    for(i = 0; i < currentContacts.length; i++) {
      let contactid = currentContacts[i].contactId;
      let contactsAddTask = currentContacts[i].contactName;
      let contactColor = currentContacts[i].contactColor;
      getFirstLetter(contactsAddTask);
      let shortName = getShortcut(contactsAddTask);
      if(contactsAddTask.toLowerCase().startsWith(searchInput)) {
        result.innerHTML += showContactsDetails(i, contactsAddTask, contactColor,contactid, shortName);
      }
    }
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
 isValidCategory = isValidDate = isValidTitle= isValid = false;
}