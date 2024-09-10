let guestTasks = {};
let guestContacts = {}

function saveGuestData() {
  localStorage.setItem("guestDatas", JSON.stringify(guestTasks));
}

function loadGuestSummary() {
  let guestDataAsText = localStorage.getItem("guestDatas");
  if (guestDataAsText) {
    guestTasks = JSON.parse(guestDataAsText);
  } else {
    getGuestDatas();
  }
  currentTasks = guestTasks
  showSummaryUser();
}

async function getGuestDatas() {
  try {
    let responseTaskLenght = await fetch(GUEST_URL + userId + ".json");
    let tasks = await responseTaskLenght.json();
    if (tasks === null) {
      userSummary.innerHTML = showSummaryHtml();
      return;
    }
    Object.keys(tasks).forEach((key) => {
      let currentTaskContents = createGuestTaskContents(key, tasks[key]);
      guestTasks.push(currentTaskContents);
    });
   localStorage.setItem("localGuestTasks" , JSON.stringify(guestTasks))
   loadGuestSummary()
  } catch (error) {
    getGuestDatas();
  }
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
