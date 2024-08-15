let data = {
  taskStatus: "",
  title: "",
  description: "",
  assignedTo: {},
  dueDate: "",
  prio: {
    urgent: false,
    medium: false,
    low: false,
  },
  category: "",
  subtasks: [],
};

/**
 * this function collect the task data
 * 
 * @param {string} task 
 */

function createNewTask(task) {
  if(userId === "guest"){
   return addGuestTaskLocal(task);
  } 
  data.title = document.getElementById("task-title").value;
  data.description = document.getElementById("task-description").value;
  data.assignedTo = { name1: "Name1", name2: "Name2" };
  data.dueDate = document.getElementById("add-task-duo-date").value;  
  data.prio.urgent
  data.prio.medium;
  data.prio.low; 
  data.category;
  data.subtasks; 
  data.taskStatus = task;
  postData(task);
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
  return (responseToJson = await response.json());
}

/**
 * this function does not allow older dates
 */

document.addEventListener('DOMContentLoaded', (event) => {
  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() +1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`
  }
  document.getElementById('add-task-duo-date').min = getCurrentDate();
});

/**
 * this function show different task category
 */

function selectCategory() {
  showTaskCategory();
  document.getElementById('selected-task').innerHTML = 'Select task category';
}

function showTaskCategory() {
  document.getElementById('select-task-category-img').classList.toggle('rotate-arrow');
  document.getElementById('task-subtasks').classList.toggle('d-none');
  document.getElementById('select-category').classList.toggle('d-none');
  document.getElementById('add-task-category-text').classList.toggle('shadow-box');
}

/**
 * this function change button styles and select prio
 */

function taskPrioUrgent() {
  document.getElementById('task-icon-urgent').classList.add('task-icon-urgent-clicked');
  document.getElementById('icon-urgent-img').src = './img/prio_urgent_white.png';
  document.getElementById('task-icon-medium').classList.remove('task-icon-medium-clicked');
  document.getElementById('task-icon-medium').classList.add('task-icon-medium');
  document.getElementById('icon-medium-img').src = './img/prio_medium_orange.png';
  document.getElementById('task-icon-low').classList.remove('task-icon-low-clicked');
  document.getElementById('task-icon-low').classList.add('task-icon-low');
  document.getElementById('icon-low-img').src = './img/prio_low.png';
  data.prio.urgent = true;
  data.prio.medium = false;
  data.prio.low = false;
}

function taskPrioMedium() {
  document.getElementById('task-icon-medium').classList.add('task-icon-medium-clicked');
  document.getElementById('icon-medium-img').src = './img/prio_medium.png';
  document.getElementById('task-icon-urgent').classList.remove('task-icon-urgent-clicked');
  document.getElementById('task-icon-urgent').classList.add('task-icon-urgent');
  document.getElementById('icon-urgent-img').src = './img/prio_urgent.png';
  document.getElementById('task-icon-low').classList.remove('task-icon-low-clicked');
  document.getElementById('task-icon-low').classList.add('task-icon-low');
  document.getElementById('icon-low-img').src = './img/prio_low.png';
  data.prio.medium = true;
  data.prio.urgent = false;
  data.prio.low =false;
}

function taskPrioLow() {
  document.getElementById('task-icon-low').classList.add('task-icon-low-clicked');
  document.getElementById('icon-low-img').src = './img/prio_low_white.png';
  document.getElementById('task-icon-urgent').classList.remove('task-icon-urgent-clicked');
  document.getElementById('task-icon-urgent').classList.add('task-icon-urgent');
  document.getElementById('icon-urgent-img').src = './img/prio_urgent.png';
  document.getElementById('task-icon-medium').classList.remove('task-icon-medium-clicked');
  document.getElementById('task-icon-medium').classList.add('task-icon-medium');
  document.getElementById('icon-medium-img').src = './img/prio_medium_orange.png';
  data.prio.low = true;
  data.prio.urgent = false;
  data.prio.low.medium = false;
}

/**
 * this function allow to select between two task, technical task and user story
 */

function selectedTechnicalTask() {
  document.getElementById('selected-task').innerHTML = 'Technical Task';
  data.category = "Technical Task";
  showTaskCategory();
}

function selectedUserStory() {
  document.getElementById('selected-task').innerHTML = 'User Story';
  data.category = "User Story";
  showTaskCategory();
}

function createSubtask() {
  let newSubtask = document.getElementById('inputfield-subtask').value;
  let subtaskList = document.getElementById('created-subtaks');
  if(newSubtask.trim() !== '' && data.subtasks.length < 4) {
      let index = data.subtasks.length;
      let subtaskId = `subtask-${index}`; 
      subtaskList.innerHTML += createNewSubtasks(newSubtask , index , subtaskId);
    document.getElementById('inputfield-subtask').value = '';
    data.subtasks.push(newSubtask);
    document.getElementById(`edit-${subtaskId}`).classList.remove('edit-subtasks');
    } else {
      document.getElementById('inputfield-subtask').value = "maximum subtasks have been created";
  }
}

function createNewSubtasks(newSubtask , index , subtaskId) {
  return ` <div id="edit-${subtaskId}" class="edit-subtasks d-none">
                                <input class="subtask-edit" id="edit-subtask-input-${subtaskId}"  type="text" value="${newSubtask}">
                                  <div class="subtask-img-edit">
                                    <img class="subtask-icon-delete" src="./img/delete_icon.png" onclick="deleteEditSubtask('${subtaskId}')">
                                    <span class="subtask-seperator"></span>
                                    <img class="subtask-icon-check" src="./img/check_subtask.png" onclick="editedSubtask(${index},'${subtaskId}')">
                                  </div>
                                </div>
                                 <div id="sub-${subtaskId}" class="all-subtasks">
                                    <li class="list-subtasks" id="list-subtasks-${subtaskId}">${newSubtask}</li>
                                      <div class="subtask-img">
                                      <img class="subtask-icon-edit" src="./img/edit_icon.png" onclick="editSubtask('${subtaskId}')">
                                      <span class="subtask-seperator"></span>
                                      <img class="subtask-icon-delete" src="./img/delete_icon.png" onclick="deleteSubtask(${index}, '${subtaskId}')">
                                      </div>
                                  </div>
                              `;
}

/**
 * 
 * this function is to edit subtask
 * @param {*} elementId this is the id from subtask div
 */

function editSubtask(elementId) {
  document.getElementById(`edit-${elementId}`).classList.add('edit-subtasks');
  document.getElementById(`edit-${elementId}`).classList.remove('d-none');
  document.getElementById(`sub-${elementId}`).classList.remove('all-subtasks');
  document.getElementById(`sub-${elementId}`).classList.add('d-none');
}

/**
 * 
 * this function delete the subtask div and and the associated value from array
 * @param {*} index this is the values in the array data.subtasks
 * @param {*} elementId this is the id from the div element subtask
 */

function deleteSubtask(index, elementId) {
  let subtask = document.getElementById(`sub-${elementId}`);
  subtask.remove(); 
  let editedSubtask = document.getElementById(`edit-${elementId}`);
  editedSubtask.remove();
  data.subtasks.splice(index, 1);
  document.getElementById('created-subtaks').classList.remove('d-none');
}

function deleteEditSubtask(elementId) {
  document.getElementById(`edit-${elementId}`).classList.remove('edit-subtasks');
  document.getElementById(`edit-${elementId}`).classList.add('d-none');
  document.getElementById(`sub-${elementId}`).classList.add('all-subtasks');
  document.getElementById(`sub-${elementId}`).classList.remove('d-none');
}

function editedSubtask(index, elementId) {
let editNewSubtask = document.getElementById(`edit-subtask-input-${elementId}`).value;
data.subtasks[index] = editNewSubtask;
let list = document.getElementById(`list-subtasks-${elementId}`);
list.innerHTML = editNewSubtask;
let editInput = document.getElementById(`edit-subtask-input-${elementId}`);
editInput.value = editNewSubtask;
deleteEditSubtask(elementId);
}

function clearForm() {
  let subtaskList = document.getElementById('created-subtaks');
  subtaskList.remove();
  data.subtasks = [];
}