/**
 * This function generates HTML content for a task card that appears on a board.
 * 
 * @param {*} i the index of the current task in the currentTasks array.
 * @param {*} categoryColor the color associated with the task's category, which is used for styling.
 * @returns HTML template
 */

function cardContentHtml(i, categoryColor) {
    return /* html */ `
     <button class="board-content" draggable="true" ondragstart="drag(event)" onclick="showDetailCard(id, '${categoryColor}')" id="${currentTasks[i].taskId}">
                  <div class="category bg-${categoryColor}">${currentTasks[i].category}</div>
                  <div class="title">${currentTasks[i].title}</div>
                  <div class="description">${currentTasks[i].description}</div>
                  <div class="subtasks-progress">${loadSuptaskStatus(i)}</div>
                  <div class="contact-line">
                    <div class="board-contacts" id="boardContacts${i}">
                     ${cardContacts(i)}
                    </div>
                    <div id="urgentStatus">
                      <img src="./img/prio_${getprio(i)}.png" alt="" />
                    </div>
                  </div>
                </button>`;
}

/**
 * This function generates the HTML structure for showing detailed information about a specific card.
 * 
 * @param {*} detailPrio the priority level of the task.
 * @param {*} categoryColor the color associated with the task's category, used for styling.
 * @returns HTML template
 */

function showDetailCardHtml(detailPrio, categoryColor){
    return /* html */ `
    <div class="detail-card-body" onclick="stopPropagation(event)">
          <div class="card-head">
            <div class="category bg-${categoryColor}">${chosenCards.category}</div>
            <button onclick="closeDetailCard()">X</button>
          </div>
          <h3>${chosenCards.title}</h3>
          <div class="detailDescription">${chosenCards.description}</div>
          <div class="theme-info">
            <span class="card-theme">Due date:</span>
            <div>${chosenCards.dueDate}</div>
          </div>
          <div class="theme-info">
            <span class="card-theme">Priority:</span>
            <div class="detail-prio">
              ${detailPrio} <img src="./img/prio_${detailPrio}.png" alt="" />
            </div>
          </div>
          <div>
            <span class="card-theme">Assigned To:</span>
            <div id="chosenNameList"></div>
          </div>
          <div id="subtaskDetails" class="d_none">
            <span class="card-theme">Subtasks</span>
            <div id="subtaskList"></div>
          </div>
          <div>
           <form id="changeStatus" onchange="changeStatus()">
              <label for="taskStatusChange">change task status</label>
              <select name="changestatus" id="taskStatusChange">
                <option value="Todo">todo</option>
                <option value="InProgress">in progress</option>
                <option value="Feedback">await feedback</option>
                <option value="Done">done</option>
              </select>
            </form>
           <div class="prepare-detail">
            <button onclick="deleteCard()"><img src="./img/delete.svg" alt="" />Delete</button>
            <span class="separator-grey"></span>
            <button id="btnEditCard" onclick="editDetailCard()"><img src="./img/edit.svg" alt="" />Edit</button>
           </div>
          </div>
        </div>`;
}

/**
 * This function generates HTML to display details about a contact assigned to a task.
 * 
 * @param {*} nameDetail the name of the contact.
 * @param {*} colorDetail  the background color associated with the contact.
 * @param {*} initialsDetail the initials of the contact.
 * @returns HTML template
 */

function showChosenCardContactHtml(nameDetail, colorDetail, initialsDetail){
  return /* html */ `
      <div class="d-card-contact">
          <div class="shortcut" style="background-color:${colorDetail};">${initialsDetail}</div>
          <span>${nameDetail}</span>
      </div>`;
}

/**
 * This function generates HTML for rendering a subtask within the detailed task view.
 * 
 * @param {*} i the index of the subtask.
 * @param {*} checked a boolean indicating whether the subtask is completed (checked)
 * @param {*} subtaskContent the content or description of the subtask.
 * @returns HTML template
 */

function showCardSubtasksHtml(i, checked, subtaskContent){
  return /* html */` 
  <div class="detail-subtask">
  <input type="checkbox" name="checkbox" id="subtask${[i]}" ${checked ? 'checked' : ''} onchange="changeCheckedSub(checked, ${[i]})"/>
  <span>${subtaskContent}</span>
  </div>`;
}

/**
 * This function generates HTML for editing a task.
 * 
 * @returns HTML template
 */

function editCardHtml(){
  return /* html */ `
  <div class="detail-card-edit-body" onclick="closeContactList(); stopPropagation(event)">
    <div class="edit-card-head">
      <button onclick="closeDetailCard()">X</button>
    </div>
      <form class="form-edit" onsubmit="changeCardContent(); return false">
        <div class="input-fields-edit">
          <label>Title</label>
          <input type="text" id="editCardTitle" class="edit-border" value="${chosenCards.title}">
        </div>
        <div class="input-fields-edit">
         <label>Description</label>
         <textarea id="editCardDescription" rows="4" cols="50" class="edit-border">${chosenCards.description}</textarea>
        </div>
        <div class="input-fields-edit">
          <label class="card-theme">Due date:</label>
          <input type="date" id="editCardDueDate" class="edit-border" value="${chosenCards.dueDate}"  onclick="getCurrentDate()">
        </div>
        <div class="input-fields-edit">
          <span class="card-theme">Priority:</span>
          <div class="prio-buttons">
            <button type="button" class="task-icon" id="btnEditUrgent" name="urgent" onclick="changePrio(name)">Urgent <img src="./img/prio_urgent.png" alt=""></button>
            <button type="button" class="task-icon" id="btnEditMedium" name="medium" onclick="changePrio(name)">Medium <img src="./img/prio_medium_white.png" alt=""></button>
            <button type="button" class="task-icon" id="btnEditLow" name="low" onclick="changePrio(name)">Low <img src="./img/prio_low.png" alt=""></button>
          </div>
        </div>
        <div class="input-fields-edit" >
          <label class="card-theme">Assigned to</label>
          <button type="button" id="editCardContact" class="edit-border" onclick="stopPropagation(event)"> 
            <input type="text" placeholder="Select contacts to assign" class="edit-border" id="inputSearchContacts" onkeyup="searchEditContact()" onfocus="openContactList()"> 
            <img src="./img/arrow_drop_down.png" alt="" onclick="toggleContactList()">
          </button>
          <div id="dropdownEditContacts">         
            <div id="chosenContactsDropdown" class="edit-border d_none" ></div>
          </div>
          <div id="editChosenContact"></div>
        </div>
        <div id="subtaskDetails">
          <label class="card-theme">Subtasks</label>
          <div class="edit-border edit-subs"> 
            <input type="text" placeholder="Add new subtask" id="editSubtasks" class="input-fields-edit edit-border" onkeydown="submitWithEnter(event)">
            <button type="button" onclick="editCardSubtasks()"><img src="./img/plus.svg" alt=""></button>
          </div>
          <div id="subtaskError" class="required"></div>
          <div id="subtaskList"></div>
        </div>
        <button class="button_dark" id="btnEditDetailCard">OK <img src="./img/check.svg" alt=""></button>
      </form>
  </div>`;
}

/**
 * This function generates HTML for editing an individual subtask in a task.
 * 
 * @param {*} newSubtaskValue the current value of the subtask.
 * @param {*} i the index of the subtask in the list.
 * @returns HTML template
 */
  
function editSubtaskHtml(newSubtaskValue, i){
  return /* html */ `
  <div class="edit-subtask">
    <div>
      <input type="text" class="d_none edit-border" id="inputEditSubtask${i}" value="${newSubtaskValue}" onkeydown="prepareWithEnter(event, ${i})">
      <div id="valueEditSubtask${i}">${newSubtaskValue}</div>
    </div>
    <div class="edit-subtask-buttons">
      <button type="button" onclick="deleteCardSubtask(${i})"><img src="./img/delete.svg" alt=""> Delete</button>
      <button type="button" onclick="prepareEditSubtask(${i})" id="prepareEditBtn${i}"><img src="./img/edit.svg" alt=""> Edit</button>
      <button type="button" onclick="savePreparedSubtask(${i})" id="saveEditSubtaskBtn${i}" class="d_noneimp"><img src="./img/check_subtask.png" alt=""></button>
      
   </div>
  </div>`;
}

/**
 * Generates HTML for a contact button.
 * 
 * @param {string} editContactName - The full name of the contact to display on the button.
 * @param {string} editContactColor - The background color for the contact's initials.
 * @param {string|number} editContactId - The unique ID of the contact, used to identify the button.
 * @param {string} initialsEdit - The initials of the contact, displayed inside the button.
 * 
 * @returns {string} The generated HTML string representing the contact button.
 */

function showContactButtonHtml(editContactName, editContactColor, editContactId, initialsEdit){
  return /* html */ `
  <button type="button" id="${editContactId}" value="${editContactName}" onclick="selectName(id); stopPropagation(event)"> 
  <div class="dropdown-contacts">
    <div class="shortcut" style="background-color:${editContactColor};">${initialsEdit}</div> 
    <span>${editContactName}</span>
  </div>
  <img id="check${editContactId}" src="./img/Property 1=Default.svg" alt="">
  </button>`;
}