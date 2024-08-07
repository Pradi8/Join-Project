let currentDate = new Date();
let amountTasksLength = 0;
let urgetLenght = 0;
let taskCounts = {
  todo: 0,
  done: 0,
  inprogress: 0,
  awaitfeedback: 0,
};

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
  document.getElementById("greeting").innerHTML = greetingHTML(
    greetingText,
    greetingUser
  );
  showSummaryGuest();
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
 * This fution shows the local Summary of the guest
 * 
 * @returns 
 * 
 */

function showSummaryGuest() {
  if (userId === "guest") {
    document.getElementById("summaryContent").innerHTML = showSummaryHtml();
    return;
  }
  showSummaryUser();
}

/**
 * This function counts the current amoint of Tasks in database
 * 
 * 
 */

async function showSummaryUser() {
  let userSummary = document.getElementById("summaryContent");
  try {
    let responseTaskLenght = await fetch(BOARD_URL + userId + ".json");
    let tasks = await responseTaskLenght.json();
    Object.values(tasks).forEach(task => {
      if (task.taskStatus in taskCounts) {
        taskCounts[task.taskStatus]++;
      }
      if (task.prio && task.prio.urgent) {
        urgetLenght++;
      }
    });
    amountTasksLength = Object.values(taskCounts).reduce((sum, count) => sum + count, 0);
    getDeadline(userSummary, tasks)
  } catch (error) {
   userSummary.innerHTML = showSummaryHtml(); 
  }
}

/**
 * This function search the nearest date of urgent tasks
 * 
 * @param {*} userSummary - This parameter is the target HTML element to show the summary
 * @param {*} tasks       - This prameter is the object from the database with all current information of the user tasks
 */

function getDeadline(userSummary, tasks) {
  let dueDates = new Set();
  Object.values(tasks).forEach(task => {
    if (task.dueDate) {
      dueDates.add(new Date(task.dueDate));
    }
  });
  dueDates.forEach(date => {
    let diff = date - currentDate;
    if (diff >= 0 && diff < Infinity) {
       closestDate = date;
    }
  });
  if (closestDate && urgetLenght > 0) {
   deadlineDate = getFormatDate(closestDate);
  } else {
    deadlineDate = 'No upcoming due dates found.';
  }
  userSummary.innerHTML = showSummaryHtml(deadlineDate);
}
/**
 * This function formats the date of the nearest deadline
 * 
 * @param {*} date - this parameter is the closest date
 * @returns        - returns the formtet date
 */

function getFormatDate(date){
  let year = date.getFullYear();
  let month = date.toLocaleString('default', { month: 'long' });
  let day = date.getDate();
  return `${month} ${day}, ${year}`;
}

function showSummaryHtml(deadlineDate) {
  return /* html */ `
  <div class="field-position">
              <button onclick="openBoard()" class="summary-field">
                <div class="icons-dark" id="iconPencil"></div>
                <div>
                  <h5>${taskCounts.todo}</h5>
                  <span>To-Do</span>
                </div>
              </button>
              <button onclick="openBoard()" class="summary-field">
                <div class="icons-dark" id="iconDone"></div>
                <div>
                  <h5>${taskCounts.done}</h5>
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
                <span class="actual-date"><b>${deadlineDate}</b></span>
                <p>upcomming Deadline</p>
              </div>
            </button>
            <div class="field-position">
              <button onclick="openBoard()" class="summary-field-block">
                <h5>${taskCounts.inprogress}</h5>
                <span
                  >Tasks in <br />
                  Progress</span
                >
              </button>
              <button onclick="openBoard()" class="summary-field-block">
                <h5>${taskCounts.awaitfeedback}</h5>
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