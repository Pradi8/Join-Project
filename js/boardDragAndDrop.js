/**
 * This function stores the ID of the dragged element (event.target.id) in the drag data (event.dataTransfer.setData()).
 * It applies a CSS transform to rotate the element by 20 degrees 
 * 
 * @param {*} event the event object containing information about the drag action.
 */

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
    event.target.style.transform = "rotate(20deg)";
  }

  /**
   * this function stores the task in the global variable currentTaskfield for future reference, such as when checking task states after a drop.
   * 
   * @param {*} task the task identifier or object to be set as the current task.
   */
  
  function setCurrentTask(task){
    currentTaskfield = task
   }

   /**
    * This function prevents the default behavior when dragging over an element, enabling it to accept drops.
    * 
    * @param {*} event the event object containing information about the drag action.
    */
  
  function allowDrop(event) {
    event.preventDefault();
  }

  /**
   * This function adds the CSS class highlight-drag to visually indicate that the element can receive a drop.
   * 
   * @param {*} id the ID of the HTML element that should be highlighted
   */


  function addHighlight(id) {
    document.getElementById(id).classList.add('highlight-drag');
  }

  /**
   * This function resets the dragged element's rotation to 0 degrees and removes the CSS class highlight.
   * 
   * @param {*} event the event object containing information about the drag action.
   * @param {*} id the ID of the HTML element to remove the highlight from.
   */
  
  function abord(event,id){
    event.target.style.transform = "rotate(0deg)";
    document.getElementById(id).classList.remove('highlight-drag');
  }

  /**
   * This function removes the CSS class highlight.
   * 
   * @param {*} id the ID of the HTML element from which the highlight should be removed.
   */
  

  function removeHighlight(id) {
    document.getElementById(id).classList.remove('highlight-drag');
  }

/**
 * This function retrieves the ID of the dragged element from the drag data.
 * Appends the dragged element into the target container.
 * 
 * @param {*} event the event object containing information about the drop action.
 * @param {*} task the task identifier of the target container.
 * @returns If the user is a guest, it saves the dropped task data locally; otherwise, it calls saveTaskDrop() to save it remotely.
 */

  function drop(event, task) {
    event.preventDefault();
    let taskId = event.dataTransfer.getData("text");
    let element = document.getElementById(taskId);
    let targetContainer = document.getElementById('cards' + task);
    targetContainer.appendChild(element);
    if(userId === "guest") return saveDropLocal(taskId, task)
    saveTaskDrop(taskId, task) 
  }

  /**
   * This functio makes a PUT request to update the task's status on a server using fetch().
   * After the request completes, it reloads the user data (loadUser()) and updates the UI.
   * 
   * @param {*} taskId the ID of the task being dropped.
   * @param {*} task  the identifier or status of the task (e.g., the new task category or status after the drop).
   */
  
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
  
  /**
   *This function checks if the target container is empty after the drop. If it is empty, it adds a class no-tasks to show an empty state message.
   * If the container has tasks, it removes the no-tasks class.
   * 
   * @param {*} taskFieldDrop The field or container where the task was dropped.
   */
  
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
  
/**
 * This function checks if the original container (currentTaskfield) is empty after a task has been moved.
 * It adds or removes the no-tasks class based on whether the container still has tasks.
 */

  function changeContentLeave(){
    let taskLine = document.getElementById('cards'+currentTaskfield)
    let noTask = document.getElementById('no'+currentTaskfield)
    if(taskLine.innerHTML.trim() == ""){
      noTask.classList.add('no-tasks')
    }
    else{
      noTask.classList.remove('no-tasks')
    }
  }