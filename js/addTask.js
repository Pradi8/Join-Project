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
        "Desscription" : description.value
    };

    newTask.push(tasks);
    title.value = '';
    description.value = '';
    
}

async function postData(path='', data={}) {
    let response = await fetch(BASE_URL + path + '.json',{
        method: 'POST',
        header: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    return responseToJson = await response.json();
}