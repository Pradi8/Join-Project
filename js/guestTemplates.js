let guestTasks = {};

/* function addGuestTaskLocal(task) {
  let dataGuest={};
  dataGuest.title = document.getElementById("task-title").value;
  dataGuest.description = document.getElementById("task-description").value;
  dataGuest.assignedTo = { name1: "Name1", name2: "Name2" };
  dataGuest.dueDate = document.getElementById("add-task-due-date").value;
  dataGuest.prio.urgent = true; // hier muss noch der button abgefragt werden ist nur ein beispiel zum testen gewesen
  dataGuest.category = "testlauf";
  dataGuest.subtasks = {
    subtask1: "testlauf1",
    subtask2: "mit subtask spielen",
  };
  dataGuest.taskStatus = task;
  guestDatas.push(dataGuest)
  saveGuestData()
} */

function saveGuestData() {
  localStorage.setItem("guestDatas", JSON.stringify(guestTasks));
}

function loadGuestSummary() {
  let userSummary = document.getElementById("summaryContent");
  let guestDataAsText = localStorage.getItem("guestDatas");
  if (guestDataAsText) {
    guestTasks = JSON.parse(guestDataAsText);
  } else {
    getGuestDatas(userSummary);
  }
  showSummaryGuest(userSummary);
}

async function getGuestDatas() {
  try {
    let responseTaskLenght = await fetch(GUEST_URL + userId + ".json");
    let tasks = await responseTaskLenght.json();
    if (tasks === null) {
      userSummary.innerHTML = showSummaryHtml();
      return;
    }
    Object.values(tasks).forEach((task) => {
      if (task.taskStatus in taskCounts) {
        taskCounts[task.taskStatus]++;
      }
      if (task.prio && task.prio.urgent) {
        urgetLenght++;
      }
    });
    Object.keys(tasks).forEach((key) => {
      let currentTaskContents = createGuestTaskContents(key, tasks[key]);
      guestTasks.push(currentTaskContents);
    });
    amountTasksLength = Object.values(taskCounts).reduce(
      (sum, count) => sum + count,
      0
    );
    showSummaryGuest(userSummary, tasks);
  } catch (error) {
    getGuestDatas();
  }
}

function showSummaryGuest(userSummary, tasks) {
  userSummary.innerHTML = showSummaryHtml();
  getDeadline(userSummary, tasks);
  saveGuestData();
}

function createGuestTaskContents(key, taskData) {
  return {
    taskId: key,
    taskAssignedTo: taskData.assignedTo,
    taskCategory: taskData.category,
    taskDescription: taskData.description,
    taskDueDate: taskData.dueDate,
    taskPrio: taskData.prio,
    taskStatus: taskData.taskStatus,
    taskTitle: taskData.title,
    taskSubtasks: taskData.subtasks,
  };
}

function loadTasksGuest() {
  let guestTasksAsText = localStorage.getItem("guestDatas");
  if (guestTasksAsText) {
    guestTasks = JSON.parse(guestTasksAsText);
  }
  showGuestTasks();
}

function showGuestTasks() {
  currentTasks = guestTasks;
  clearTasks();
}
