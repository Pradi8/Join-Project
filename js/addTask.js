let taskTitle = createTaskTitle();

function createTaskTitle() {
    let title = document.getElementById('task-title');
    return title.value
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