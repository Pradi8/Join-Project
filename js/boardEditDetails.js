let currentChosenEditContacts = [];
let currentChosenEditSubtasks = [];
let chosenPrio = [];
let changedCardContent = {};

function editDetailCard() {
  let editCard = document.getElementById("detailedCard");
  chosenPrio = chosenCards.taskPrio;
  editCard.innerHTML = editCardHtml();
  getCurrentContact();
  getCurrentSubtasks();
  Object.entries(chosenPrio).forEach((key) => {
    if (key[1]) {
      changePrio(key[0]);
    }
  });
}

function getCurrentDate() {
  let today = new Date();
  let year = today.getFullYear();
  let month = String(today.getMonth() + 1).padStart(2, "0");
  let day = String(today.getDate()).padStart(2, "0");
  document.getElementById('editCardDueDate').min = `${year}-${month}-${day}`;
}

function getCurrentContact() {
  currentChosenEditContacts = chosenCards.taskAssignedTo;
  if (!currentChosenEditContacts) {
    currentChosenEditContacts = [];
  }

  let editSelection = document.getElementById("chosenContactsDropdown");
  for (let i = 0; i < currentContacts.length; i++) {
    let editContactName = currentContacts[i].contactName;
    let editContactId = currentContacts[i].contactId;
    let editContactColor = currentContacts[i].contactColor;
    let initialsEdit = getShortcut(editContactName);
    editSelection.innerHTML += showContactButtonHtml(
      editContactName,
      editContactColor,
      editContactId,
      initialsEdit
    );
  }
  sortContacts();
}

function sortContacts() {
  let list = document.getElementById("chosenContactsDropdown");
  let unsortetContacts = Array.from(list.getElementsByTagName("button"));
  unsortetContacts.sort(function (a, b) {
    return a.textContent.localeCompare(b.textContent);
  });
  list.innerHTML = "";
  unsortetContacts.forEach(function (element) {
    list.appendChild(element);
  });
  showChosenEditContacts();
}

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

function markCurrentChosenContacts(idEdit) {
  let selectContact = document.getElementById(idEdit);
  selectContact.setAttribute("data-select", "true");
  selectContact.classList.add("selected-contact");
  document.getElementById("check" + idEdit).src =
    "./img/Property 1=checked_white.svg";
}

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

function submitWithEnter(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    editCardSubtasks();
  }
}

function prepareWithEnter(event, i) {
  if (event.key === "Enter") {
    event.preventDefault();
    savePreparedSubtask(i);
  }
}

function editCardSubtasks() {
  let subtaskErrorMessage = document.getElementById("subtaskError");
  if (currentChosenEditSubtasks.length == 3) {
    subtaskErrorMessage.innerHTML =
      "Sry! You reach the maximum count of Subtasks (3)";
    return;
  }
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

function getCurrentSubtasks() {
  currentChosenEditSubtasks = chosenCards.taskSubtasks;
  if (!currentChosenEditSubtasks) {
    currentChosenEditSubtasks = [];
  }
  showEditSubtasks();
}

function deleteCardSubtask(i) {
  currentChosenEditSubtasks.splice(i, 1);
  showEditSubtasks();
}

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

function savePreparedSubtask(i) {
  let editValue = document.getElementById("inputEditSubtask" + i).value;
  currentChosenEditSubtasks[i].newsubtask = editValue;
  currentChosenEditSubtasks[i].completed = false;
  showEditSubtasks();
}

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

function changeCardContent() {
  changedCardContent.title = document.getElementById("editCardTitle").value;
  changedCardContent.description = document.getElementById(
    "editCardDescription"
  ).value;
  changedCardContent.dueDate = document.getElementById("editCardDueDate").value;
  changedCardContent.assignedTo = currentChosenEditContacts;
  changedCardContent.subtasks = currentChosenEditSubtasks;
  changedCardContent.prio = chosenPrio;
  changedCardContent.taskStatus = chosenCards.taskStatus;
  changedCardContent.category = chosenCards.taskCategory;
  putToBoardDatabase();
}

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

function openContactList() {
  document.querySelector("#editCardContact img").style.transform =
    "rotate(0deg)";
  document
    .getElementById("chosenContactsDropdown")
    .classList.add("edit-dropdown");
}

function closeContactList() {
  document.querySelector("#editCardContact img").style.transform =
    "rotate(180deg)";
  document
    .getElementById("chosenContactsDropdown")
    .classList.remove("edit-dropdown");
}
