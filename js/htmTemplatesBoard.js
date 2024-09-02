function cardContentHtml(i) {
    return /* html */ `
     <button class="board-content" draggable="true" ondragstart="drag(event)" onclick="showDetailCard(id)" id="${currentTasks[i].taskId}">
                  <div class="category">${currentTasks[i].taskCategory}</div>
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
            <div>
              <div class="d-card-contact">
                <div class="shortcut bg-0">EM</div>
                <span>Emanuel Mauer</span>
              </div>
              <div class="d-card-contact">
                <div class="shortcut bg-0">EM</div>
                <span>Emanuel Mauer</span>
              </div>
              <div class="d-card-contact">
                <div class="shortcut bg-0">EM</div>
                <span>Emanuel Mauer</span>
              </div>
            </div>
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
            <button><img src="./img/edit.svg" alt="" />Edit</button>
           </div>
          </div>
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
  