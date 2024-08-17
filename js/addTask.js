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
    data.subtasks.push(newSubtask);
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
    const createdSubtask = data.subtasks[i];
    subtaskList.innerHTML += `<div id="edit-${i}" class="edit-subtasks d-none">
                                <input class="subtask-edit" id="edit-subtask-input-${i}" type="text" value="${createdSubtask}">
                                  <div class="subtask-img-edit">
                                    <img class="subtask-icon-delete" src="./img/delete_icon.png" onclick="deleteEditSubtask(${i})">
                                    <span class="subtask-seperator"></span>
                                    <img class="subtask-icon-check" src="./img/check_subtask.png" onclick="editedSubtask(${i})">
                                  </div>
                              </div>
                              <div id="sub-${i}" class="all-subtasks">
                                <ul class="list-subtasks">
                                <li id="list-subtasks-${i}" ondblclick="editSubtask(${i},'${createdSubtask}')">${createdSubtask}</li>
                                </ul>
                                  <div class="subtask-img">
                                    <img class="subtask-icon-edit" src="./img/edit_icon.png" onclick="editSubtask(${i},'${createdSubtask}')">
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
  data.subtasks[index] = editNewSubtask.value;
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


}