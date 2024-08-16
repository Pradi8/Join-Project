let contactInformation = {
  contactId:"",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
};

let currentContacts = [];
let prepareMode = {
  headline: "Add contact",
  headText: "Tasks are better with a team!",
  btnLeft: "Cancel X",
  btnRight: "Create contact",
};
let type;

function openEditContact(editMode) {
  type = editMode;
  let editField = document.getElementById("editContact");
  editField.classList.add("edit-field");
  editField.innerHTML = showEditHtml();
}

function showEditHtml() {
  return /* html */ `
   <article onclick="stopPropagation(event)" id="editHead">
        <img src="./img/join_logo.svg" alt="">
        <h2>${prepareMode.headline}</h2>
        <span>${prepareMode.headText}</span>
        <div class="underline-short"></div>
      </article>
      <article onclick="stopPropagation(event)" id="editDetails">
        <div class="shortcut-contact big"><img src="./img/person_white.svg" alt=""></div>
        <form onsubmit="requiredContactName(); return false">
          <div class="input_fields">          
            <div class="input_value">
              <input
              type="text"
              placeholder="Name"
              id="newContactName"
              onfocusin="selectField(id)"
              onfocusout="unselectField(id)"
              />
              <img src="./img/person.svg" alt="" />
            </div>
            <div class="required" id="requiredEditName"></div>
            <div class="input_value">
              <input
              type="text"
              placeholder="Email"
              id="newContactEmail"
              onfocusin="selectField(id)"
              onfocusout="unselectField(id)"
              />
              <img src="./img/mail.svg" alt="" />
            </div>
            <div class="required" id="requiredEditEmail"></div>
            <div class="input_value">
              <input
              type="text"
              placeholder="Phone"
              id="newContactPhone"
              onfocusin="selectField(id)"
              onfocusout="unselectField(id)"
              />
              <img src="./img/call.svg" alt="" />
            </div>
            <div class="required" id="requiredEditPhone"></div>
          </div>
          <div class="btn-edit">
          <button onclick="closeEditField()" type="button" class="button_bright">${prepareMode.btnLeft}</button>
          <button type="submit" class="button_dark">${prepareMode.btnRight} <img src="./img/check.svg" alt=""></button>
          </div>
        </form>
      </article>
  `;
}

function closeEditField() {
  document.getElementById("editContact").classList.remove("edit-field");
  document.getElementById("editContact").classList.add("edit-field-reverse");
  setTimeout(() => {
    document
      .getElementById("editContact")
      .classList.remove("edit-field-reverse");
  }, 900);
}
function showDetailContact(id) {
  document.getElementById("detailContacts").classList.add("detail-contacts");
  document.getElementById(id).classList.add("chosen-contact");
}

function requiredContactName() {
  let nameInput = document.getElementById("newContactName");
  let requiredName = document.getElementById("requiredEditName");
  if (nameInput.value === "") {
    requiredName.innerHTML = "This field is required";
    nameInput.parentNode.classList.add("required-border");
  } else {
    requiredName.innerHTML = "";
    nameInput.parentNode.classList.remove("required-border");
    contactInformation.contactName = nameInput.value;
    requiredContactEmail();
  }
}
function requiredContactEmail() {
  let emailInput = document.getElementById("newContactEmail");
  let requiredEmail = document.getElementById("requiredEditEmail");
  if (emailInput.value === "") {
    requiredEmail.innerHTML = "This field is required";
    emailInput.parentNode.classList.add("required-border");
  } else if (!emailInput.value.includes("@")) {
    requiredEmail.innerHTML = `'${emailInput.value}' is not valid. Please use an @-sign`;
    emailInput.parentNode.classList.add("required-border");
  } else {
    requiredEmail.innerHTML = "";
    emailInput.parentNode.classList.remove("required-border");
    contactInformation.contactEmail = emailInput.value;
    requiredContactPhone();
  }
}

function requiredContactPhone() {
  let phoneInput = document.getElementById("newContactPhone");
  let requiredContactPhone = document.getElementById("requiredEditPhone");
  if (phoneInput.value === "") {
    requiredContactPhone.innerHTML = "This field is required";
    phoneInput.parentNode.classList.add("required-border");
  } else {
    requiredContactPhone.innerHTML = "";
    phoneInput.parentNode.classList.remove("required-border");
    contactInformation.contactPhone = phoneInput.value;
    saveContact();
  }
}

async function saveContact() {
  if (type === "newContact") {
    await fetch(CONTACT_URL + userId + ".json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactInformation),
    });
  } else {
    await fetch(CONTACT_URL + userId + contactId + ".json", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactInformation),
    });
  }
  succesEditMessage();
}

function succesEditMessage(){
  document.getElementById('succesfullEdit').classList.add('succesfull-edit')
  closeEditField()
  loadContacts()
}

async function loadContacts() {
  loadUser();
  currentContacts=[]
  try {
    let loadResponse = await fetch(CONTACT_URL + userId + ".json");
    let contactToJson = await loadResponse.json();
    console.log(contactToJson);

    Object.keys(contactToJson).forEach((key) => {
      let currentcontactInformation = {
        contactId: key,
        contactName: contactToJson[key].contactName,
        contactEmail: contactToJson[key].contactEmail,
        contactPhone: contactToJson[key].contactPhone,
      };

      currentContacts.push(currentcontactInformation);
      console.log(currentContacts);
    });
  } catch (error) {
    loadContacts();
  }

  console.log(currentContacts);
  showContactList();
}

function showContactList() {
 let list = document.getElementById("peopleList")
 list.innerHTML =""
  for (let i = 0; i < currentContacts.length; i++) {
    let name = currentContacts[i].contactName;
    let email = currentContacts[i].contactEmail;
    let shortcut = getShortcut(name)
    list.innerHTML += ContactListHtml(name, email, shortcut);
  }
}

function getShortcut(name){
  let words = name.split(" ");
  let initials = "";
  for (let i = 0; i < words.length; i++) {
    if (words[i].length > 0) {
      initials += words[i].substring(0, 1).toUpperCase();
    }
  }
  return initials;

}


function ContactListHtml(name, email, shortcut) {
  return /*html*/ `
              <button onclick="showDetailContact(id)" class="contact-name" id="contact1">
              <div class="shortcut-contact small">${shortcut}</div>
              <div class="full-name">
                <span class="person-name">${name}</span>
                <span class="contact-mail">${email}</span>
              </div>
            </button>
  `;
}
