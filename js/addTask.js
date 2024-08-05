 let newTask = [];

/**
 * get data from add_task
 * 
 */

function createNewTask() {
    let title = document.getElementById('task-title');
    let description = document.getElementById('task-description');
    let tasks = {
        "Title" : title.value,
        "Description" : description.value
    };

    newTask.push(tasks); 
    emptyFields();
}

async function postData(path='', data={}) {
    let response = await fetch(BOARD_URL + path + '.json',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    return responseToJson = await response.json();
}

/**
 * empty inputfields and textarea
 * 
 */

function emptyFields() {
    document.getElementById('task-title').value = '';
    document.getElementById('task-description').value = '';
} 

// Vorschlag fürn kurzen Code.
/* 
let data = {
  taskStatus: "",
  title: "",
  description: "",
  assignedTo: {},
  dueDate: "",
  prio: {
    urgent: false,
    medium: false,
    low: false,
  },
  category: "",
  subtasks: {},
};

function createNewTask(task) {
  data.title = document.getElementById("task-title").value;
  data.description = document.getElementById("task-description").value;
  data.assignedTo = { name1: "Name1", name2: "Name2" };
  data.dueDate = "Datum";  
  data.prio.urgent = true; // hier muss noch der button abgefragt werden ist nur ein beispiel zum testen gewesen
  data.category = "testlauf";
  data.subtasks = { subtask1: "testlauf1", subtask2: "mit subtask spielen" }; 
  data.taskStatus = task;
  postData(task);
}

async function postData() {
  let response = await fetch(BOARD_URL + userId + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
}
 */