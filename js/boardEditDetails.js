let currentChosenEditContacts = [];
let currentChosenEditSubtasks = [];
let chosenPrio = [];
let changedCardContent = {};

/**
 * This function modifies the details of a task card.
 * 
 * @returns If the user is a guest, it returns without editing.
 */

function editDetailCard() {
  if (userId === "guest") return
  let editCard = document.getElementById("detailedCard");
  chosenPrio = chosenCards.prio;
  editCard.innerHTML = editCardHtml();
  getCurrentContact();
  getCurrentSubtasks();
  Object.entries(chosenPrio).forEach((key) => {
    if (key[1]) {
      changePrio(key[0]);
    }
  });
}

/**
 * This function sets the minimum due date for the task card.
 */

function getCurrentDate() {
  let today = new Date();
  let year = today.getFullYear();
  let month = String(today.getMonth() + 1).padStart(2, "0");
  let day = String(today.getDate()).padStart(2, "0");
  document.getElementById('editCardDueDate').min = `${year}-${month}-${day}`;
}

/**
 * This function retrieves and displays the contacts currently assigned to the task.
 */

function getCurrentContact() {
  currentChosenEditContacts = chosenCards.assignedTo;
  if (!currentChosenEditContacts) {
    currentChosenEditContacts = [];
  }
  let editSelection = document.getElementById("chosenContactsDropdown");
  userAsContactFirst()
  for (let i = 0; i < currentContacts.length; i++) {
    let editContactName = currentContacts[i].contactName;
    let editContactId = currentContacts[i].contactId;
    let editContactColor = currentContacts[i].contactColor;
    let initialsEdit = getShortcut(editContactName);
    editSelection.innerHTML += showContactButtonHtml(editContactName, editContactColor, editContactId, initialsEdit);
  }
  sortContacts();
}

/**
 * Sorts the contacts in alphabetical order.
 */

function sortContacts() {
  let list = document.getElementById("chosenContactsDropdown");
  let unsortetContacts = Array.from(list.getElementsByTagName("button"));
  let firstElement = unsortetContacts.shift();
  unsortetContacts.sort(function (a, b) {
    return a.textContent.localeCompare(b.textContent);
  });
  list.innerHTML = "";
  list.appendChild(firstElement);
  unsortetContacts.forEach(function (element) {
    list.appendChild(element);
  });
  showChosenEditContacts();
}

/**
 * This function displays the currently selected contacts.
 */

function showChosenEditContacts() {
  let nameList = document.getElementById("editChosenContact");
  nameList.innerHTML = "";
  currentChosenEditContacts.forEach((contactId) => {
    let contactEdit = currentContacts.find(
      (assignedContact) => assignedContact.contactId === contactId
    );
    if (contactEdit) {
      let {
        contactName: nameEdit,
        contactColor: colorEdit,
        contactId: idEdit,
      } = contactEdit;
      let initialsEdit = getShortcut(nameEdit);
      nameList.innerHTML += `<div class="shortcut" style="background-color:${colorEdit};">${initialsEdit}</div>`;
      markCurrentChosenContacts(idEdit);
    }
  });
}

/**
 * This function implements a search functionality for the contacts dropdown.
 */

function searchEditContact() {
  let inputSearch = document.getElementById("inputSearchContacts");
  let filterInput = inputSearch.value.toLowerCase();
  let contactNamesList = document.getElementById("chosenContactsDropdown");
  let listelements = contactNamesList.getElementsByTagName("button");
  for (let i = 0; i < listelements.length; i++) {
    let element = listelements[i];
    if (element.value.toLowerCase().includes(filterInput)) {
      element.classList.remove("d_noneimp");
    } else {
      element.classList.add("d_noneimp");
    }
  }
}

/**
 * This function marks a contact as selected.
 * 
 * @param {*} idEdit the ID of the contact to mark as selected.
 */

function markCurrentChosenContacts(idEdit) {
  let selectContact = document.getElementById(idEdit);
  selectContact.setAttribute("data-select", "true");
  selectContact.classList.add("selected-contact");
  document.getElementById("check" + idEdit).src =
    "./img/Property 1=checked_white.svg";
}

/**
 * This function handles the selection and deselection of contacts
 * If selected, the contact is removed from currentChosenEditContacts; otherwise, it is added.
 * Calls showChosenEditContacts() to refresh the display of selected contacts.
 * 
 * @param {*} id the ID of the contact being selected or deselected.
 */

function selectName(id) {
  let selectContact = document.getElementById(id);
  let checkimg = document.getElementById("check" + id);
  if (selectContact.getAttribute("data-select") === "true") {
    selectContact.removeAttribute("data-select");
    selectContact.classList.remove("selected-contact");
    checkimg.src = "./img/Property 1=Default.svg";
    currentChosenEditContacts = currentChosenEditContacts.filter(
      (deleteId) => deleteId !== id
    );
  } else {
    selectContact.setAttribute("data-select", "true");
    selectContact.classList.add("selected-contact");
    checkimg.src = "./img/Property 1=checked_white.svg";
    currentChosenEditContacts.push(id);
  }
  showChosenEditContacts();
}

/**
 * This function allows submission using the "Enter" key.
 * 
 * @param {*} event the keyboard event triggered by the user.
 */

function submitWithEnter(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    editCardSubtasks();
  }
}

/**
 * This function handles the preparation of subtasks for editing when the Enter key is pressed.
 * 
 * @param {*} event the keyboard event triggered by the user.
 * @param {*} i the index of the subtask being edited.
 */

function prepareWithEnter(event, i) {
  if (event.key === "Enter") {
    event.preventDefault();
    savePreparedSubtask(i);
  }
}

/**
 * This function adds or edits subtasks for the current card.
 */

function editCardSubtasks() {
  let subtaskErrorMessage = document.getElementById("subtaskError");
  let newSubtaskValue = document.getElementById("editSubtasks");
  let trimNewSubtaskValue = newSubtaskValue.value.trim();
  subtaskErrorMessage.innerHTML = "";
  if (trimNewSubtaskValue) {
    newSubtaskValue.value = "";
    let newEditSubtask = {
      completed: false,
      newsubtask: trimNewSubtaskValue,
    };
    currentChosenEditSubtasks.push(newEditSubtask);
    showEditSubtasks();
  } else {
    subtaskErrorMessage.innerHTML = `Please fill in this field`;
  }
}

/**
 * This function retrieves and displays the current subtasks for the card being edited.
 */

function getCurrentSubtasks() {
  currentChosenEditSubtasks = chosenCards.subtasks;
  if (!currentChosenEditSubtasks) {
    currentChosenEditSubtasks = [];
  }
  showEditSubtasks();
}

/**
 * This function deletes a subtask from the current list of subtasks.
 * 
 * @param {*} i the index of the subtask to delete.
 */

function deleteCardSubtask(i) {
  currentChosenEditSubtasks.splice(i, 1);
  showEditSubtasks();
}

/**
 * This function prepares a subtask for editing.
 * 
 * @param {*} i the index of the subtask to edit.
 */

function prepareEditSubtask(i) {
  document
    .getElementById("inputEditSubtask" + i)
    .classList.add("input-fields-edit");
  document.getElementById("valueEditSubtask" + i).classList.add("d_none");
  document.getElementById("prepareEditBtn" + i).classList.add("d_noneimp");
  document
    .getElementById("saveEditSubtaskBtn" + i)
    .classList.remove("d_noneimp");
}

/**
 * This function saves the changes made to a subtask after editing.
 * 
 * @param {*} i the index of the subtask being edited.
 */

function savePreparedSubtask(i) {
  let editValue = document.getElementById("inputEditSubtask" + i).value;
  currentChosenEditSubtasks[i].newsubtask = editValue;
  currentChosenEditSubtasks[i].completed = false;
  showEditSubtasks();
}

/**
 * This function displays the list of subtasks being edited.
 */

function showEditSubtasks() {
  let subtaskList = document.getElementById("subtaskList");
  subtaskList.innerHTML = ``;
  for (let i = 0; i < currentChosenEditSubtasks.length; i++) {
    subtaskList.innerHTML += editSubtaskHtml(
      currentChosenEditSubtasks[i].newsubtask,
      i
    );
  }
}

/**
 * This function changes the priority of the card being edited.
 * 
 * @param {*} name the name of the priority level.

 */

function changePrio(name) {
  let possiblePrio = ["Urgent", "Medium", "Low"];
  for (let i = 0; i < possiblePrio.length; i++) {
    let prio = possiblePrio[i];
    let btnElement = document.getElementById("btnEdit" + prio);
    btnElement.classList.remove("prio-" + prio.toLowerCase() + "-mark");
    btnElement.innerHTML = `${prio}<img src="./img/prio_${prio.toLowerCase()}.png" alt="">`;
    chosenPrio[prio.toLowerCase()] = false;
    if (name === prio.toLowerCase()) {
      btnElement.classList.add("prio-" + name + "-mark");
      btnElement.innerHTML = `${prio} <img src="./img/prio_${name}_white.png" alt="">`;
      chosenPrio[name] = true;
    }
  }
}

/**
 * This function updates the card content with the edited values and saves it to the database.
 */

function changeCardContent() {
  changedCardContent.title = document.getElementById("editCardTitle").value;
  changedCardContent.description = document.getElementById("editCardDescription").value;
  changedCardContent.dueDate = document.getElementById("editCardDueDate").value;
  changedCardContent.assignedTo = currentChosenEditContacts;
  changedCardContent.subtasks = currentChosenEditSubtasks;
  changedCardContent.prio = chosenPrio;
  changedCardContent.taskStatus = chosenCards.taskStatus;
  changedCardContent.category = chosenCards.category;
  validateTextInput(changedCardContent.title)
}

/**
 * Validates the card title input. If the input is empty, it displays an error message
 * and adds a required-border to the input field.
 * 
 * @param {string} changeCardTitle - The value of the card title input field to validate.
 * @returns {void} If the card title is empty, the function returns early after displaying an error.
 */
function validateTextInput(changeCardTitle){
  if (changeCardTitle === '') {
    document.getElementById("reqiredEditCardTitle").innerHTML = `This field is required`;
    document.getElementById('editCardTitle').classList.add("required-border");
    return
  }
  putToBoardDatabase();
}

/**
 * Clears the error message and removes the 'required-border' class from the card title input field.
 * This function is typically called when the input field is being edited again to reset its state.
 */
function emptyRequiredCardEdit(){
  document.getElementById("reqiredEditCardTitle").innerHTML = "";
  document.getElementById('editCardTitle').classList.remove("required-border");
}

/**
 * This function updates the card's data in the database.
 */
async function putToBoardDatabase() {
  await fetch(BOARD_URL + userId + "/" + chosenCards.taskId + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(changedCardContent),
  });
  await loadTasks();
  setTimeout(() => {
    showDetailCard(chosenCards.taskId);
  }, 200);
}

/**
 * This function toggles the visibility of the contact list dropdown.
 */

function toggleContactList() {
  let img = document.querySelector("#editCardContact img");
  if (img.style.transform === "rotate(180deg)" || img.style.transform === "") {
    img.style.transform = "rotate(0deg)";
  } else {
    img.style.transform = "rotate(180deg)";
  }
  document
    .getElementById("chosenContactsDropdown")
    .classList.toggle("edit-dropdown");
}

/**
 * This function opens the contact list dropdown.
 */

function openContactList() {
  document.querySelector("#editCardContact img").style.transform =
    "rotate(0deg)";
  document
    .getElementById("chosenContactsDropdown")
    .classList.add("edit-dropdown");
}

/**
 * This function closes the contact list dropdown.
 */

function closeContactList() {
  document.querySelector("#editCardContact img").style.transform =
    "rotate(180deg)";
  document
    .getElementById("chosenContactsDropdown")
    .classList.remove("edit-dropdown");
}
