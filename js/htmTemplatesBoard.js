function cardContentHtml(i, taskCategoryColor) {
    return /* html */ `
     <button class="board-content" draggable="true" ondragstart="drag(event)" onclick="showDetailCard(id)" id="${currentTasks[i].taskId}">
                  <div class="category bg-${taskCategoryColor}">${currentTasks[i].taskCategory}</div>
                  <div class="title">${currentTasks[i].taskTitle}</div>
                  <div class="description">${currentTasks[i].taskDescription}</div>
                  <div class="subtasks-progress">${loadSuptaskStatus(i)}</div>
                  <div class="contact-line">
                    <div class="board-contacts" id="boardContacts${i}">
                     ${cardContacts(i)}
                    </div>
                    <div id="urgentStatus">
                      <img src="./img/prio_${getprio(i)}.png" alt="" />
                    </div>
                  </div>
                </button>
    `;
}

function showDetailCardHtml(detailPrio){
    return /* html */ `
    <div class="detail-card-body" onclick="stopPropagation(event)">
          <div class="card-head">
            <div class="category">${chosenCards.taskCategory}</div>
            <button onclick="closeDetailCard()">X</button>
          </div>
          <h3>${chosenCards.taskTitle}</h3>
          <div class="detailDescription">${chosenCards.taskDescription}</div>
          <div class="theme-info">
            <span class="card-theme">Due date:</span>
            <div>${chosenCards.taskDueDate}</div>
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
            <button onclick="editDetailCard()"><img src="./img/edit.svg" alt="" />Edit</button>
           </div>
          </div>
        </div>
    `
}

function showChosenCardContactHtml(nameDetail, colorDetail, initialsDetail){
  return /* html */ `
      <div class="d-card-contact">
          <div class="shortcut" style="background-color:${colorDetail};">${initialsDetail}</div>
          <span>${nameDetail}</span>
      </div>
   `
}


function showCardSubtasksHtml(i, checked, subtaskContent){
  return /* html */` 
  <div class="detail-subtask">
  <input type="checkbox" name="checkbox" id="subtask${[i]}" ${checked ? 'checked' : ''} onchange="changeCheckedSub(checked, ${[i]})"/>
  <span>${subtaskContent}</span>
  </div>`
}

function editCardHtml(){
  return /* html */ `
  <div class="detail-card-edit-body" onclick="stopPropagation(event)">
    <div class="edit-card-head">
      <button onclick="closeDetailCard()">X</button>
    </div>
      <form class="form-edit" onsubmit="changeCardContent(); return false">
        <div class="input-fields-edit">
          <label>Title</label>
          <input type="text" id="editCardTitle" class="edit-border" value="${chosenCards.taskTitle}">
        </div>
        <div class="input-fields-edit">
         <label>Description</label>
         <textarea id="editCardDescription" rows="4" cols="50" class="edit-border">${chosenCards.taskDescription}</textarea>
        </div>
        <div class="input-fields-edit">
          <label class="card-theme">Due date:</label>
          <input type="date" id="editCardDueDate" class="edit-border" value="${chosenCards.taskDueDate}">
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
          <button type="button" id="editCardContact" class="edit-border" > 
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
  </div>
  `
}
  
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
  </div>
  `
}
