let dataGuest = {
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


function addGuestTaskLocal(task){
   dataGuest.title = document.getElementById("task-title").value;
   dataGuest.description = document.getElementById("task-description").value;
   dataGuest.assignedTo = { name1: "Name1", name2: "Name2" };
   dataGuest.dueDate = document.getElementById("add-task-duo-date").value;  
   dataGuest.prio.urgent = true; // hier muss noch der button abgefragt werden ist nur ein beispiel zum testen gewesen
   dataGuest.category = "testlauf";
   dataGuest.subtasks = { subtask1: "testlauf1", subtask2: "mit subtask spielen" }; 
   dataGuest.taskStatus = task;
   postDataGuest();
}

function postDataGuest() {
/* hier muss das GastArray befüllt werden */
}