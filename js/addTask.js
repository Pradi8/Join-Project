let data = {
  taskStatus: "",
  title: "",
  description: "",
  assignedTo: [],
  dueDate: "",
  prio: {
    urgent: false,
    medium: false,
    low: false,
  },
  category: "",
  subtasks: [],
};

let addAssignedContacts = [];

let isValid = true;

/**
 * this function collect the task data
 * 
 * @param {string} task 
 */

async function createNewTask(task) {
  isValid = true;
  //if(userId === "guest"){
    //return addGuestTaskLocal(task);
   //}
   dataTitle();
   data.description = document.getElementById("task-description").value;
   data.assignedTo;
   dataDueDate();  
   data.prio.urgent;
   data.prio.medium;
   data.prio.low; 
   selectTaskCategory();
   data.subtasks; 
   data.taskStatus = task;
  if(isValid) {
    await postData(task);
  } else {
    return false;
  }
  clearForm();
}

/**
 * this function post data to database
 * 
 * @returns response.json
 */

async function postData() {
  let response = await fetch(BOARD_URL + userId + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

/**
 * This functions collect the task 
 */

function dataTitle() {
  let title = document.getElementById("task-title").value.trim();
  if(title === '' ) {
    document.getElementById('task-title').style.border = '1px solid rgba(255, 129, 144, 1)';
    document.getElementById('required-text-red').classList.remove('d-none');
    isValid = false;
  } else {
    data.title = title;
    isValid = true;
  }
}

function dataDueDate() {
  let date = document.getElementById('add-task-due-date').value;
  if(date === '') {
    document.getElementById('add-task-due-date').style.border = '1px solid rgba(255, 129, 144, 1)';
    document.getElementById('required-text-red-date').classList.remove('d-none');
    isValid = false;
  } else {
    data.dueDate = date;
    isValid = true;
  }
}

/**
 * This function get the contacts from the database
 */

async function loadContactsData() {
  let userIdAsText = localStorage.getItem("userId");
  if (userIdAsText) {
  userId = JSON.parse(userIdAsText);
  }
  let response = await fetch(CONTACT_URL + userId + ".json");
  let responseToJson = await response.json();
  return responseToJson;
}

async function getContactNamesData() {
  let ContactsNamesAddtask = await loadContactsData();
  for (let [key, value] of Object.entries(ContactsNamesAddtask)) {
    let NameContact = value.contactName;
    let ColorContact = value.contactColor;
    addAssignedContacts.push({Name:NameContact, Color:ColorContact});
  }
  showAssignedContacts();
}

function showAssignedContacts() {
  let assignedContacts = document.getElementById('contacts-to-assign');
  assignedContacts.innerHTML = '';
  for (let i = 0; i < addAssignedContacts.length; i++) {
    let contactsAddTask = addAssignedContacts[i].Name;
    let contactColor = addAssignedContacts[i].Color;
    getFirstLetter(contactsAddTask);
    getShortcut(contactsAddTask);
    let shortName = getShortcut(contactsAddTask);
    assignedContacts.innerHTML += `<div class="input-contacts-name">
                                    <div class="contact-shortname-name">
                                      <div class="shortcut-contact" style="background-color:${contactColor}">${shortName}</div>
                                      <div>${contactsAddTask}</div>
                                    </div>
                                    <input type="checkbox" value="Username" onclick="checkContact(${i},'${contactsAddTask}','${contactColor}')" id="checkbox-${i}">
                                   </div>`;
  }
}

function checkContact(i, nameContact, nameColor){
  let check = document.getElementById(`checkbox-${i}`);
  let addSigneToContact =  document.getElementById('short-name');
  if(check.checked) {
    if(addSigneToContact.innerHTML.indexOf(nameContact) === -1) {
      data.assignedTo.push({Name: nameContact, Color: nameColor});
      getFirstLetter(nameContact);
      getShortcut(nameContact);
      let shortName = getShortcut(nameContact);
        addSigneToContact.innerHTML += `<div id="checked-${i}"><div class="shortcut-contact" style="background-color:${nameColor}">${shortName}</div></div>`;
    }
  } 
  if(check.checked == false) {
    let checkedBox = document.getElementById(`checked-${i}`);
    checkedBox.innerHTML = '';
  }
  closeContactsList();
  document.getElementById('short-name').classList.remove('d-none');
}

function closeContactsList() {
  document.getElementById('contacts-to-assign').classList.add('d-none');
  document.getElementById('add-task-contacts-assign').style.border = '1px solid rgba(209, 209, 209, 1)';
  document.getElementById('add-task-contacts-assign-img').classList.remove('rotate-arrow');
}

function addContactsassign() {
  document.getElementById('add-task-contacts-assign-img').classList.toggle('rotate-arrow');
  document.getElementById('add-task-contacts-assign').classList.toggle('blue-border');
  document.getElementById('contacts-to-assign').classList.toggle('d-none');
  document.getElementById('short-name').classList.add('d-none');
}

/**
 * this function hide the contact div when clicked on something other than the div
 */

document.addEventListener('click', function(event) {
  let contactsDiv = document.getElementById('add-task-contacts-assign');
  let contactsAssign = document.getElementById('contacts-to-assign');
  if (contactsDiv && !contactsDiv.contains(event.target) && contactsAssign && !contactsAssign.contains(event.target)) {
    document.getElementById('contacts-to-assign').classList.add('d-none');
    document.getElementById('add-task-contacts-assign-img').classList.remove('rotate-arrow');
    document.getElementById('add-task-contacts-assign').classList.remove('blue-border');
    document.getElementById('short-name').classList.remove('d-none');
  }
});


/**
 * this function does not allow older dates
 */

document.addEventListener('DOMContentLoaded', () => {
  function getCurrentDate() {
    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() +1).padStart(2, '0');
    let day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`
  }
  document.getElementById('add-task-due-date').min = getCurrentDate();
});

/**
 * this function change button styles and select prio
 */

function taskPrioUrgent() {
  document.getElementById('task-icon-urgent').classList.add('task-icon-urgent-clicked');
  document.getElementById('icon-urgent-img').src = './img/prio_urgent_white.png';
  document.getElementById('task-icon-medium').classList.remove('task-icon-medium-clicked');
  document.getElementById('task-icon-medium').classList.add('task-icon-medium');
  document.getElementById('icon-medium-img').src = './img/prio_medium.png';
  document.getElementById('task-icon-low').classList.remove('task-icon-low-clicked');
  document.getElementById('task-icon-low').classList.add('task-icon-low');
  document.getElementById('icon-low-img').src = './img/prio_low.png';
  data.prio.urgent = true;
  data.prio.medium = false;
  data.prio.low = false;
}

function taskPrioMedium() {
  document.getElementById('task-icon-medium').classList.add('task-icon-medium-clicked');
  document.getElementById('icon-medium-img').src = './img/prio_medium_white.png';
  document.getElementById('task-icon-urgent').classList.remove('task-icon-urgent-clicked');
  document.getElementById('task-icon-urgent').classList.add('task-icon-urgent');
  document.getElementById('icon-urgent-img').src = './img/prio_urgent.png';
  document.getElementById('task-icon-low').classList.remove('task-icon-low-clicked');
  document.getElementById('task-icon-low').classList.add('task-icon-low');
  document.getElementById('icon-low-img').src = './img/prio_low.png';
  data.prio.medium = true;
  data.prio.urgent = false;
  data.prio.low =false;
  getContactNamesData();
}

function taskPrioLow() {
  document.getElementById('task-icon-low').classList.add('task-icon-low-clicked');
  document.getElementById('icon-low-img').src = './img/prio_low_white.png';
  document.getElementById('task-icon-urgent').classList.remove('task-icon-urgent-clicked');
  document.getElementById('task-icon-urgent').classList.add('task-icon-urgent');
  document.getElementById('icon-urgent-img').src = './img/prio_urgent.png';
  document.getElementById('task-icon-medium').classList.remove('task-icon-medium-clicked');
  document.getElementById('task-icon-medium').classList.add('task-icon-medium');
  document.getElementById('icon-medium-img').src = './img/prio_medium.png';
  data.prio.medium = false;
  data.prio.low = true;
  data.prio.urgent = false;
}

/**
 * this function show different task category
 */

function selectCategory() {
  showTaskCategory();
  document.getElementById('selected-task').innerHTML = 'Select task category';
  document.getElementById('add-task-category-text').style.border = '1px solid rgba(255, 255, 255, 1)';
}

function showTaskCategory() {
  document.getElementById('select-task-category-img').classList.toggle('rotate-arrow');
  document.getElementById('task-subtasks').classList.toggle('d-none');
  document.getElementById('select-category').classList.toggle('d-none');
  document.getElementById('add-task-category-text').classList.toggle('shadow-box');
}


/**
 * this function allow to select between two task, technical task and user story
 */

function selectTaskCategory() {
  if(data.category === '') {
    document.getElementById('add-task-category-text').style.border = '1px solid rgba(255, 129, 144, 1)';
    document.getElementById('selected-task').innerHTML = 'Select task category';
    document.getElementById('required-text-red-task-category').classList.remove('d-none');
    isValid = false;
  } else {
    isValid = true;
  }
}

function selectedTechnicalTask() {
  document.getElementById('selected-task').innerHTML = 'Technical Task';
  data.category = "Technical Task";
  document.getElementById('required-text-red-task-category').classList.add('d-none');
  showTaskCategory();
}

function selectedUserStory() {
  document.getElementById('selected-task').innerHTML = 'User Story';
  data.category = "User Story";
  document.getElementById('required-text-red-task-category').classList.add('d-none');
  showTaskCategory();
}

/**
 * This function allow to write Subtasks
 */

function writeSubtask() {
  document.getElementById('add-subtask-icon').classList.add('d-none');
  document.getElementById('add-icons').classList.remove('d-none');
  document.getElementById('add-icons').classList.add('icons-and-seperator');
}

function cancelEdit() {
  document.getElementById('add-subtask-icon').classList.remove('d-none');
  document.getElementById('add-icons').classList.add('d-none');
  document.getElementById('add-icons').classList.remove('icons-and-seperator');
  document.getElementById('inputfield-subtask').value = '';
}

function createSubtask() {
  let newSubtask = document.getElementById('inputfield-subtask').value; 
  if(newSubtask.trim() !== '' && data.subtasks.length < 4) {
    let subTask = false;
    data.subtasks.push({newsubtask:newSubtask , completed: subTask});
    renderSubtasks();
    cancelEdit();
    } if(data.subtasks.length == 4) {
      document.getElementById('add-editable-input').classList.add('d-none');
      document.getElementById('max-subtasks-created').classList.remove('d-none');
      document.getElementById('max-subtasks-created').classList.add('max-subtask');
    } 
}

function renderSubtasks() {
  let subtaskList = document.getElementById('created-subtaks');
  subtaskList.innerHTML = '';
  for (let i = 0; i < data.subtasks.length; i++) {
    let createdSubtask = data.subtasks[i];
    let showSubtask = createdSubtask.newsubtask;
    subtaskList.innerHTML += `<div id="edit-${i}" class="edit-subtasks d-none">
                                <input class="subtask-edit" id="edit-subtask-input-${i}" type="text" value="${showSubtask}">
                                  <div class="subtask-img-edit">
                                    <img class="subtask-icon-delete" src="./img/delete_icon.png" onclick="deleteEditSubtask(${i})">
                                    <span class="subtask-seperator"></span>
                                    <img class="subtask-icon-check" src="./img/check_subtask.png" onclick="editedSubtask(${i})">
                                  </div>
                              </div>
                              <div id="sub-${i}" class="all-subtasks">
                                <ul class="list-subtasks">
                                <li id="list-subtasks-${i}" ondblclick="editSubtask(${i},'${showSubtask}')">${showSubtask}</li>
                                </ul>
                                  <div class="subtask-img">
                                    <img class="subtask-icon-edit" src="./img/edit_icon.png" onclick="editSubtask(${i},'${showSubtask}')">
                                    <span class="subtask-seperator"></span>
                                    <img class="subtask-icon-delete" src="./img/delete_icon.png" onclick="deleteSubtask(${i})">
                                  </div>
                              </div>`;
    document.getElementById(`edit-${i}`).classList.remove('edit-subtasks');
  }
}

/**
 * 
 * this function is to edit subtask
 * @param {*} index this is the id from subtask div
 */

function editSubtask(index, task) {
  document.getElementById(`edit-${index}`).classList.add('edit-subtasks');
  document.getElementById(`edit-${index}`).classList.remove('d-none');
  document.getElementById(`sub-${index}`).classList.remove('all-subtasks');
  document.getElementById(`sub-${index}`).classList.add('d-none');
  document.getElementById(`edit-subtask-input-${index}`).value = task;
}

/**
 * 
 * this function delete the subtask div and and the associated value from array
 * @param {*} index this is the id from subtask div
 */

function deleteSubtask(index) {
  let subtask = document.getElementById(`sub-${index}`);
  if(subtask) subtask.remove();
  let editedSubtask = document.getElementById(`edit-${index}`);
  if(editedSubtask) editedSubtask.remove();
  data.subtasks.splice(index, 1);
  renderSubtasks();
  document.getElementById('created-subtaks').classList.remove('d-none');
  document.getElementById('add-editable-input').classList.remove('d-none');
  document.getElementById('max-subtasks-created').classList.add('d-none');
  document.getElementById('max-subtasks-created').classList.remove('max-subtask');
}

function deleteEditSubtask(index) {
  document.getElementById(`edit-${index}`).classList.remove('edit-subtasks');
  document.getElementById(`edit-${index}`).classList.add('d-none');
  document.getElementById(`sub-${index}`).classList.add('all-subtasks');
  document.getElementById(`sub-${index}`).classList.remove('d-none');
}

/**
 * 
 * this function is to used to edit subtasks
 * @param {*} index this is the id from subtask div
 */

function editedSubtask(index) {
  let editNewSubtask = document.getElementById(`edit-subtask-input-${index}`);
  if (editNewSubtask.value.trim() !== '') {
  data.subtasks[index].newsubtask = editNewSubtask.value;
  }
  deleteEditSubtask(index);
  renderSubtasks();
}

function clearForm() {
  let subtaskList = document.getElementById('created-subtaks');
  if(subtaskList) {
    subtaskList.remove();
  }
  data.subtasks = [];
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

function contactClear() {
  document.getElementById('contacts-to-assign').classList.add('d-none');
  document.getElementById('add-task-contacts-assign').style.border = '1px solid rgba(209, 209, 209, 1)';
  document.getElementById('add-task-contacts-assign-img').classList.remove('rotate-arrow');
  try {
    closeBoardPopup()
  } catch (error) {
    return
  } 
}