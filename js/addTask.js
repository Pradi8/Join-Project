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