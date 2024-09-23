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

let isValidCategory = false;
let isValidTitle = false;
let isValidDate = false;

/* function formValidation(task){
  if (isValidCategory && isValidDate && isValidTitle) {
    createNewTask(task)
    return
  }
  dataTitle(task);  
} */

/**
 * this function collect the task data
 * @param {string} task 
 */

async function createNewTask(task) {
   data.description = document.getElementById("task-description").value;
   data.assignedTo;
   data.prio.urgent;
   data.prio.medium;
   data.prio.low; 
   data.subtasks; 
   data.taskStatus = task;
   postData(); 
}

/**
 * this function post data to database
 * @returns response.json
 */

async function postData() {
  if(userId === "guest") return translateDatas()
 await fetch(BOARD_URL + userId + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  document.getElementById('succesAddedTask').classList.add('added-task') 
  setTimeout(() => {
    document.getElementById('succesAddedTask').classList.remove('added-task')
    if(window.location.pathname === "/add_task.html") return window.location.href = "board.html"
    clearForm()
  }, 1000);
}

/**
 *This function is to enter the task title
 */

function dataTitle(task) {
  let title = document.getElementById("task-title").value.trim();
  if(title === '' ) {
    document.getElementById("required-text-red-title").innerHTML= `This field is required`;
    document.getElementById('task-title').style.border = '1px solid rgba(255, 129, 144, 1)';
    isValidTitle = false;
  } else {
    data.title = title;
    isValidTitle = true;
    emptyRrequiredAddTask('task-title')
  }
  dataDueDate(task);
}

/**
 * This function is to enter the task date
 * @param {string} task 
 */

function dataDueDate(task) {
  let date = document.getElementById('task-due-date').value;
  if(date === '') {
    document.getElementById("required-text-red-due-date").innerHTML= `This field is required`;
    document.getElementById('task-due-date').style.border = '1px solid rgba(255, 129, 144, 1)';
    isValidDate = false;
  } else {
    data.dueDate = date;
    isValidDate = true;
    emptyRrequiredAddTask('task-due-date')
  }
  selectcategory(task);  
}


/**
 * Clears the error message and resets the border style for the specified task input field.
 * 
 * @param {string} - The ID of the task input field, expected to follow the format 'task-{fieldName}'.
 * @returns {void}
 */
function emptyRrequiredAddTask(id){
  let emptyRequiredField = id.replace('task-', '');
  let inputField = document.getElementById("required-text-red-"+ emptyRequiredField)
  inputField.innerHTML = "";
  document.getElementById(id).style.border = '1px solid rgba(209, 209, 209, 1)';
  return
}

/**
 * this function hide the contact div when clicked on something other than the div
 */

document.addEventListener('click', function(event) {
  let contactsDiv = document.getElementById('add-task-contacts-assign');
  let contactsAssign = document.getElementById('show-assign-contact');
  if (contactsDiv && !contactsDiv.contains(event.target) && contactsAssign && !contactsAssign.contains(event.target)) {
    document.getElementById('contacts-to-assign').classList.add('d-none');
    document.getElementById('add-task-contacts-assign-img').classList.remove('rotate-arrow');
    document.getElementById('add-task-contacts-assign').classList.remove('blue-border');
    document.getElementById('short-name').classList.remove('d-none');
    let selectContactAssign = document.getElementById('select-contact-assign');
    if(selectContactAssign) {selectContactAssign.classList.remove('d-none')};
    document.getElementById('add-task-contacts-input').classList.add('d-none');
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
  document.getElementById('task-due-date').min = getCurrentDate();
});

/**
 * this functions change button styles and select prio
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

/**
 * this functions change button styles and select prio
 */
async function taskPrioMedium() {
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
  await loadUser();
  showAssignedContacts();
}

/**
 * this functions change button styles and select prio
 */
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
  showcategory();
  document.getElementById('selected-task').innerHTML = 'Select task category';
  document.getElementById('add-task-category-text').style.border =  '1px solid rgba(209, 209, 209, 1)';
  document.getElementById('required-text-red-task-category').innerHTML = '';
}

/**
 * this function show different task category
 */
function showcategory() {
  document.getElementById('select-task-category-img').classList.toggle('rotate-arrow');
  document.getElementById('select-category').classList.toggle('d-none');
  document.getElementById('add-task-category-text').classList.toggle('shadow-box');
}

/**
 * this function show different task category
 */
function closeCategoryList(){
  document.getElementById('select-task-category-img').classList.remove('rotate-arrow');
  document.getElementById('select-category').classList.add('d-none');
  document.getElementById('add-task-category-text').classList.remove('shadow-box');
}

/**
 * this function allow to select between two task, technical task and user story
 */

function selectcategory(task) {
  if(data.category === '') {
    document.getElementById("required-text-red-task-category").innerHTML= `This field is required`;
    document.getElementById('add-task-category-text').style.border = '1px solid rgba(255, 129, 144, 1)';
    isValidCategory = false;
  } else {
    isValidCategory = true;
  }
  if (isValidCategory && isValidDate && isValidTitle) {
    createNewTask(task)
    return
  }
}

function selectedTechnicalTask() {
  document.getElementById('selected-task').innerHTML = 'Technical Task';
  data.category = "Technical Task";
  document.getElementById('required-text-red-task-category').classList.add('d-none');
  showcategory();
}

function selectedUserStory() {
  document.getElementById('selected-task').innerHTML = 'User Story';
  data.category = "User Story";
  document.getElementById('required-text-red-task-category').classList.add('d-none');
  showcategory();
}

/**
 * This function allow to write Subtasks
 */

function writeSubtask() {
  document.getElementById('add-subtask-icon').classList.add('d-none');
  document.getElementById('add-icons').classList.remove('d-none');
  document.getElementById('add-icons').classList.add('icons-and-seperator');
}

/**
 * this function cancel edit subtask
 */

function cancelEdit() {
  document.getElementById('add-subtask-icon').classList.remove('d-none');
  document.getElementById('add-icons').classList.add('d-none');
  document.getElementById('add-icons').classList.remove('icons-and-seperator');
  document.getElementById('inputfield-subtask').value = '';
}


/**
 * Allows the creation of a subtask when the "Enter" key is pressed.
 * 
 * @param {KeyboardEvent} event - The event object representing the keypress event. 
 * It contains information such as which key was pressed.
 */

function submitSubtaskWithEnter(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    createSubtask();
  }
}

/**
 * this function create the subtasks
 */

function createSubtask() {
  let newSubtask = document.getElementById('inputfield-subtask').value; 
  let subTask = false;
  if(newSubtask !== '') {
    data.subtasks.push({newsubtask:newSubtask , completed: subTask});
  renderSubtasks();
  cancelEdit();
  }
}

/**
 * this function render the subtasks
 */

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
                                <li id="list-subtasks-${i}">${showSubtask}</li>
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

/**
 * Switches the visibility of a subtask from the edit mode to the normal view mode.
 * 
 * @param {number|string} index - The index or identifier of the subtask. It is used to target the correct HTML elements.
 */
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
  document.getElementById('task-due-date').value = '';
  document.getElementById('selected-task').innerHTML = 'Select task category';
  document.getElementById('select-category').classList.add('d-none');
  document.getElementById('task-subtasks').classList.remove('d-none');
  document.getElementById('select-task-category-img').classList.remove('rotate-arrow');
  document.getElementById('short-name').innerHTML = '';
  taskPrioMedium();
  contactClear();
}