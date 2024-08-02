let toDoLength = 0;
let inprogressLength = 0;
let awaitFeedbackLength = 0;
let doneLength = 0;
let urgentLength = 0;
let amountTasksLength = 0;

function openBoard() {
  window.location.href = "board.html";
}

/**
 * This function is used to greet the user 
 * 
 */

function greetUser() {
  loadUser();
  let greetingUser = userName;
  if(userName == "guest"){
    greetingUser = "";
  }
  let d = new Date();
  let hour = d.getHours();
  let greetingText = getDayTime(hour);
  document.getElementById("greeting").innerHTML = greetingHTML(greetingText, greetingUser);
  showSummaryGuest()
}

/**
 * This function generates a greeting text based on your local time.
 * 
 * @param {number} hour - This is the actual hour of your local time
 * @returns - This returns the greeting text
 */
function getDayTime(hour) {
  let greetingText = "";
  if (hour >= 6 && hour < 12) {
    greetingText = "Good Morning";
  } else if (hour >= 12 && hour < 18) {
    greetingText = "Good Afternoon";
  } else {
    greetingText = "Good Evening";
  }
  return greetingText;
}

/**
 * This function show the greeting text
 * 
 * @param {string} greetingText - This is the greeting text
 * @param {string} greetingUser - This is the name of user
 * @returns 
 */

function greetingHTML(greetingText, greetingUser) {
  return /* html */ `
<h3>${greetingText}</h3> <br>
<h4>${greetingUser}</h4>
`;
}

function showSummaryGuest(){
  if (userId === "") {
    document.getElementById("summaryContent").innerHTML = showSummaryHtml();
    return
  }
  showSummaryUser();
}

async function showSummaryUser(){
  let userSummary = document.getElementById("summaryContent")
  try {
    let responseTaskLenght = await fetch(BOARD_URL + "id" + ".json");
    let taskLenghtToJson = await responseTaskLenght.json();
    let tasks = taskLenghtToJson[userId];
    tasks.forEach(task => {
      if (task.awaitfeedback) awaitFeedbackLength += 1;
      if (task.done) doneLength += 1;
      if (task.todo) toDoLength += 1;
      if (task.inprogress) inprogressLength += 1;
    });
    amountTasksLength = awaitFeedbackLength + doneLength + toDoLength + inprogressLength;
    getUrgentState(tasks)   
  } catch (error) {
    userSummary.innerHTML = showSummaryHtml()
  }    
}

function getUrgentState(tasks){
  tasks.forEach(task => {
    if (task.done.prio && task.done.prio.urgent) urgentLength += 1;
    if (task.todo.prio && task.todo.prio.urgent) urgentLength += 1;
    if (task.inprogress.prio && task.inprogress.prio.urgent) urgentLength += 1;
    if (task.awaitfeedback.prio && task.awaitfeedback.prio.urgent) urgentLength += 1;
});
    userSummary.innerHTML = showSummaryHtml()
}

function getDeadline(tasks){
/* hier nächste deadline anzeigen */

}

function showSummaryHtml(){
return /* html */ `
  <div class="field-position">
              <button onclick="openBoard()" class="summary-field">
                <div class="icons-dark" id="iconPencil"></div>
                <div>
                  <h5>${toDoLength}</h5>
                  <span>To-Do</span>
                </div>
              </button>
              <button onclick="openBoard()" class="summary-field">
                <div class="icons-dark" id="iconDone"></div>
                <div>
                  <h5>${doneLength}</h5>
                  <span>Done</span>
                </div>
              </button>
            </div>
            <button onclick="openBoard()" class="summary-field-long">
              <div class="summary-gap">
                <img src="./img/urgent-arrow.svg" alt="" />
                <div>
                  <h5>${urgentLength}</h5>
                  <span>Urgent</span>
                </div>
              </div>
              <div class="separator-grey"></div>
              <div class="jc-start">
                <span class="actual-date"><b>Datum</b></span>
                <p>upcomming Deadline</p>
              </div>
            </button>
            <div class="field-position">
              <button onclick="openBoard()" class="summary-field-block">
                <h5>${inprogressLength}</h5>
                <span
                  >Tasks in <br />
                  Progress</span
                >
              </button>
              <button onclick="openBoard()" class="summary-field-block">
                <h5>${awaitFeedbackLength}</h5>
                <span
                  >Awaiting <br />
                  Feedback</span
                >
              </button>
              <button onclick="openBoard()" class="summary-field-block">
                <h5>${amountTasksLength}</h5>
                <span
                  >Tasks in <br />
                  Board</span
                >
              </button>
            </div>`;
}