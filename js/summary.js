let currentDate = new Date();
let amountTasksLength = 0;
let urgetLenght = 0;
let taskCounts = {
  Todo: 0,
  Done: 0,
  InProgress: 0,
  Feedback: 0,
};
let deadlineDate = "No upcomming due date";
/**
 * This function opens the board
 *
 */
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
  if (userName == "guest") {
    greetingUser = "";
  }
  let hour = currentDate.getHours();
  let greetingText = getDayTime(hour);
  document.getElementById("greeting").innerHTML = greetingHTML( greetingText, greetingUser);
  showSummaryUser();
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

/**
 * This function counts the current amount of tasks in database
 *
 *
 */

async function showSummaryUser() {
  let userSummary = document.getElementById("summaryContent");
  try {
    let responseTaskLenght = await fetch(userUrl + userId + ".json");
    let tasks = await responseTaskLenght.json();
    if (tasks === null){
      userSummary.innerHTML = showSummaryHtml();
      return
    }
    Object.values(tasks).forEach((task) => {
      if (task.taskStatus in taskCounts) {
        taskCounts[task.taskStatus]++;
      }
      if (task.prio && task.prio.urgent) {
        urgetLenght++;
      }
    });
    amountTasksLength = Object.values(taskCounts).reduce(
      (sum, count) => sum + count, 0);
    getDeadline(userSummary, tasks);
    userSummary.innerHTML = showSummaryHtml();
  } catch (error) {
    showSummaryUser()
  } 
}

/**
 * This function search the nearest date of urgent tasks
 *
 * @param {string} userSummary - This parameter is the target HTML element to show the summary
 * @param {Object} tasks       - This prameter is the object from the database with all current information of the user tasks
 */

function getDeadline(userSummary, tasks) {
  let dueDates = new Set();
  if(!tasks){
    return
  }
  Object.values(tasks).forEach((task) => {
    if (task.dueDate) {
      dueDates.add(new Date(task.dueDate));
    }
  });
  let closestDate = getLowestDate(dueDates);
  if (closestDate && urgetLenght > 0) {
    deadlineDate = getFormatDate(closestDate);
  }
  userSummary.innerHTML = showSummaryHtml();
  deadlineAlert(closestDate);
}

/**
 * This function changes the background of the due date when its today or past today
 *
 * @param {} closestDate - Object with the lowest date
 */

function deadlineAlert(closestDate) {
  if (closestDate <= currentDate)
    document.getElementById("deadlineDate").classList.add("deadline-alert");
}

/**
 * This function finds the closest date from today.
 *
 * @param {Object} dueDates - This parameter contains all the dates from the database. Duplicate entries are consolidated here.
 * @returns                 - return the lowest date from dueDates
 */

function getLowestDate(dueDates) {
  let lowestDate;
  let mindiff = Infinity;
  dueDates.forEach((date) => {
    let diff = date - currentDate;
    if (diff < mindiff){
    mindiff = diff;
    lowestDate = date;
    }
  });
  return lowestDate;
}

/**
 * This function formats the date of the nearest deadline
 *
 * @param {*} date - this parameter is the closest date
 * @returns        - returns the formtet date
 */

function getFormatDate(date) {
  let year = date.getFullYear();
  let month = date.toLocaleString("default", { month: "long" });
  let day = date.getDate();
  return `${month} ${day}, ${year}`;
}

function showSummaryHtml() {
  return /* html */ `
  <div class="field-position">
              <button onclick="openBoard()" class="summary-field">
                <div class="icons-dark" id="iconPencil"></div>
                <div>
                  <h5>${taskCounts.Todo}</h5>
                  <span>To-Do</span>
                </div>
              </button>
              <button onclick="openBoard()" class="summary-field">
                <div class="icons-dark" id="iconDone"></div>
                <div>
                  <h5>${taskCounts.Done}</h5>
                  <span>Done</span>
                </div>
              </button>
            </div>
            <button onclick="openBoard()" class="summary-field-long">
              <div class="summary-gap">
                <img src="./img/urgent-arrow.svg" alt="" />
                <div>
                  <h5>${urgetLenght}</h5>
                  <span>Urgent</span>
                </div>
              </div>
              <div class="separator-grey"></div>
              <div class="jc-start">
                <span id="deadlineDate"><b>${deadlineDate}</b></span>
                <p>upcomming Deadline</p>
              </div>
            </button>
            <div class="field-position">
              <button onclick="openBoard()" class="summary-field-block">
                <h5>${taskCounts.InProgress}</h5>
                <span
                  >Tasks in <br />
                  Progress</span
                >
              </button>
              <button onclick="openBoard()" class="summary-field-block">
                <h5>${taskCounts.Feedback}</h5>
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
