/* let newTask = []; */

/**
 * get data from add_task
 * 
 */

/* function createNewTask() {
    let title = document.getElementById('task-title');
    let description = document.getElementById('task-description');
    let tasks = {
        "Title" : title.value,
        "Desscription" : description.value
    };

    newTask.push(tasks);
    title.value = 'Hallo';
    description.value = 'Test';
    postData();
    
} */
async function postData(task) {
    let title = document.getElementById('task-title');
    let description = document.getElementById('task-description');
    let response = await fetch(BOARD_URL + userId +'.json',{
        method: 'POST',
        header: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "taskStatus": task,
            "Title" : title.value,
            "Desscription" : description.value
                
            })
    });
    return responseToJson = await response.json();
}