function editDetailCard(){
    let editCard = document.getElementById('detailedCard')
    let chosenPrio = chosenCards.taskPrio
    editCard.innerHTML = editCardHtml()
    getCurrentSubtasks()
    Object.entries(chosenPrio).forEach((key) =>{
      if(key[1]){    
        changePrio(key[0])
      }
    });
  }
  
  function openContactList(){
   document.querySelector('#editCardContact img').style.transform = "rotate(0deg)";
   let editSelection = document.getElementById('chosenContactsDropdown')
   editSelection.innerHTML = ``
  for (let i = 0; i < currentContacts.length; i++) {
    let editContactName = currentContacts[i].contactName;
    let editContactId = currentContacts[i].contactId
    editSelection.innerHTML += /* html */ `<button type="button" id="${editContactId}" value="${editContactName}" onclick="selectName(id, value, ${i}); stopPropagation(event)">${editContactName} <img src="./img/Property 1=Default.svg" alt=""></button>`
  }
  editSelection.classList.add('edit-dropdown')
  }
  
  function selectName(id, value, i){
  let selectContact = document.getElementById(id)
  selectContact.classList.toggle('selected-contact')
  selectContact.innerHTML = `${value} <img src="./img/Property 1=checked_white.svg" alt="">`
  showSelectedName(value, i)
  }
  
  function showSelectedName(value, i){
    let editColor = currentContacts[i].contactColor
    let initalsContact = getShortcut(value) 
    document.getElementById('editChosenContact').innerHTML += /* html */ `<div class="shortcut" style="background-color:${editColor};">${initalsContact}</div>`
  }
  
  function editCardSubtasks(){
  console.log("hello");
  }
  
  function getCurrentSubtasks(){
  
  }
  function changePrio(name) {
    let possiblePrio = ["Urgent", "Medium", "Low"];
    for (let i = 0; i < possiblePrio.length; i++) {
      let prio = possiblePrio[i];
      let btnElement = document.getElementById("btnEdit" + prio);
      btnElement.classList.remove("prio-" + prio.toLowerCase() + "-mark");
      btnElement.innerHTML = `${prio}<img src="./img/prio_${prio.toLowerCase()}.png" alt="">`;
      currentEditCard.prio[prio.toLowerCase()] = false;
      if (name === prio.toLowerCase()) {
        btnElement.classList.add("prio-" + name + "-mark");
        btnElement.innerHTML = `${prio} <img src="./img/prio_${name}_white.png" alt="">`;
        currentEditCard.prio[name] = true;
      }  
    }
  }
  
  function changeCardContent(){
    currentEditCard.title = document.getElementById('editCardTitle').value 
    currentEditCard.description= document.getElementById('editCardDescription').value 
    currentEditCard.dueDate = document.getElementById('editCardDueDate').value 
    currentEditCard.taskStatus = chosenCards.taskStatus
    currentEditCard.category = chosenCards.taskCategory
    console.log(currentEditCard);
  }