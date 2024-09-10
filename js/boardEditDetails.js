let currentChosenEditContacts = [];
let currentChosenEditSubtasks = [];
let chosenPrio = []
let changedCardContent = {}

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

function getCurrentContact() {
  currentContacts.push(userAsContact())
  currentChosenEditContacts = chosenCards.taskAssignedTo;
  if(!currentChosenEditContacts){
    currentChosenEditContacts=[];
  }
  let editSelection = document.getElementById("chosenContactsDropdown");
  for (let i = 0; i < currentContacts.length; i++) {
    let editContactName = currentContacts[i].contactName;
    let editContactId = currentContacts[i].contactId;
    editSelection.innerHTML += /* html */ `<button type="button" id="${editContactId}" value="${editContactName}" onclick="selectName(id, value); stopPropagation(event)">${editContactName} <img src="./img/Property 1=Default.svg" alt=""></button>`;
  }
  showChosenEditContacts();
}


function showChosenEditContacts() {
  let nameList = document.getElementById("editChosenContact");
  nameList.innerHTML = "";
  currentChosenEditContacts.forEach((contactId) => {
    let contactEdit = currentContacts.find((assignedContact) => assignedContact.contactId === contactId);
    if (contactEdit) {
      let { contactName: nameEdit, contactColor: colorEdit, contactId: idEdit} = contactEdit;
      let initialsEdit = getShortcut(nameEdit);
      nameList.innerHTML += `<div class="shortcut" style="background-color:${colorEdit};">${initialsEdit}</div>`;
      markCurrentChosenContacts(nameEdit, idEdit);
    }
  }); 

}

function markCurrentChosenContacts(nameEdit, idEdit) {
  let selectContact = document.getElementById(idEdit);
  selectContact.setAttribute('data-select', 'true')
  selectContact.classList.add("selected-contact");
  selectContact.innerHTML = `${nameEdit} <img src="./img/Property 1=checked_white.svg" alt="">`;
}

function selectName(id, value) {
  let selectContact = document.getElementById(id);
  if(selectContact.getAttribute('data-select') === 'true')
  {
    selectContact.removeAttribute('data-select')
    selectContact.classList.remove("selected-contact");
    selectContact.innerHTML = `${value} <img src="./img/Property 1=default.svg" alt="">`;
    currentChosenEditContacts= currentChosenEditContacts.filter(deleteId => deleteId !== id)
  }
  else{
    selectContact.setAttribute('data-select', 'true')
    selectContact.classList.add("selected-contact");
    selectContact.innerHTML = `${value} <img src="./img/Property 1=checked_white.svg" alt="">`;
    currentChosenEditContacts.push(id)
  }
  showChosenEditContacts(); 
}


function submitWithEnter(event){
  if(event.key === "Enter"){
    event.preventDefault();
    editCardSubtasks();
  }
}

function prepareWithEnter(event, i){
  if(event.key === "Enter"){
    event.preventDefault();
    savePreparedSubtask(i);
  }
}


function editCardSubtasks() {
 let newSubtaskValue = document.getElementById('editSubtasks')
 let trimNewSubtaskValue = newSubtaskValue.value.trim()
 let subtaskErrorMessage = document.getElementById("subtaskError")
 subtaskErrorMessage.innerHTML = ""
 if(trimNewSubtaskValue){
 newSubtaskValue.value= "";
 let newEditSubtask = {
    completed:false,
    newsubtask:trimNewSubtaskValue
  }
 currentChosenEditSubtasks.push(newEditSubtask)
  showEditSubtasks();
 }
 else{
  subtaskErrorMessage.innerHTML= `Please fill in this field`
 }
}

function getCurrentSubtasks() {
  currentChosenEditSubtasks = chosenCards.taskSubtasks
  if(!currentChosenEditSubtasks){
    currentChosenEditSubtasks=[]
  }
  showEditSubtasks()
}

function deleteCardSubtask(i){
  currentChosenEditSubtasks.splice(i, 1);
  showEditSubtasks()
}

function prepareEditSubtask(i){
  document.getElementById('inputEditSubtask'+i).classList.add('input-fields-edit');
  document.getElementById('valueEditSubtask'+i).classList.add('d_none');
  document.getElementById('prepareEditBtn'+i).classList.add('d_noneimp');
  document.getElementById('saveEditSubtaskBtn'+i).classList.remove('d_noneimp');
}

function savePreparedSubtask(i){
  let editValue = document.getElementById('inputEditSubtask'+i).value
  currentChosenEditSubtasks[i].newsubtask = editValue;
  currentChosenEditSubtasks[i].completed = false
  showEditSubtasks()
}

function showEditSubtasks(){
  let subtaskList = document.getElementById('subtaskList')
  subtaskList.innerHTML = ``
  for (let i = 0; i < currentChosenEditSubtasks.length; i++) {
    subtaskList.innerHTML += editSubtaskHtml(currentChosenEditSubtasks[i].newsubtask, i);
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
  changedCardContent.description = document.getElementById("editCardDescription").value;
  changedCardContent.dueDate = document.getElementById("editCardDueDate").value;
  changedCardContent.assignedTo = currentChosenEditContacts;
  changedCardContent.subtasks = currentChosenEditSubtasks;
  changedCardContent.prio = chosenPrio;
  changedCardContent.taskStatus = chosenCards.taskStatus;
  changedCardContent.category = chosenCards.taskCategory
  putToBoardDatabase()
}

async function putToBoardDatabase() {
  await fetch (BOARD_URL + userId + "/" + chosenCards.taskId + ".json",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(changedCardContent),
    }
  );
   await loadTasks();
   setTimeout(() => {
    showDetailCard(chosenCards.taskId);
   }, 1000);
   
   
}

function openContactList() {
  let img = document.querySelector("#editCardContact img");
  if (img.style.transform === "rotate(180deg)" || img.style.transform === "") {
      img.style.transform = "rotate(0deg)";
  } else {
      img.style.transform = "rotate(180deg)";
  }
  document.getElementById("chosenContactsDropdown").classList.toggle("edit-dropdown");
}
