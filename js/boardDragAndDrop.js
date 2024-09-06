function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
    event.target.style.transform = "rotate(20deg)";
  }
  
  function setCurrentTask(task){
    currentTaskfield = task
   }
  
  function allowDrop(event) {
    event.preventDefault();
  }
  
  function abord(event){
    event.target.style.transform = "rotate(0deg)";
  }
  
  function drop(event, task) {
    event.preventDefault();
    let taskId = event.dataTransfer.getData("text");
    let element = document.getElementById(taskId);
    let targetContainer = document.getElementById('cards' + task);
    targetContainer.appendChild(element);
    saveTaskDrop(taskId, task) 
  }
  
  async function saveTaskDrop(taskId, task) {
    await fetch(BOARD_URL + userId + "/" + taskId + "/" + "taskStatus" + ".json",{
      method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(task),
    })
    loadUser();
    changeContentDrop(task)
  }
  
  
  function changeContentDrop(taskFieldDrop){
    let taskLineDrop = document.getElementById('cards'+taskFieldDrop)
    let noTaskDrop = document.getElementById('no'+taskFieldDrop)
    if(taskLineDrop.innerHTML.trim() == ""){
      noTaskDrop.classList.add('no-tasks')
      console.log("true")
    }
    else{
      noTaskDrop.classList.remove('no-tasks')
    }
    changeContentLeave()
  }
  
  function changeContentLeave(){
    let taskLine = document.getElementById('cards'+currentTaskfield)
    let noTask = document.getElementById('no'+currentTaskfield)
    if(taskLine.innerHTML.trim() == ""){
      noTask.classList.add('no-tasks')
      console.log("true")
    }
    else{
      noTask.classList.remove('no-tasks')
    }
  }