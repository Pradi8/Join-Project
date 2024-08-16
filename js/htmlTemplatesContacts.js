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
function showDetialInformationHtml(name, email, phone, initials) {
  return /* html */ `
    <div class="detail-contact-name">
                <span class="shortcut-contact big">${initials}</span>
                <div>
                  <h3>${name}</h3>
                  <div>
                      <button onclick="openEditContact('prepareContact')" class="btn-prepare-contact"><img src="./img/edit.svg" alt=""> <span class="text-prepare">Edit</span></button>
                      <button class="btn-prepare-contact"><img src="./img/delete.svg" alt=""> <span>Delete</span></button>
                  </div>
                </div>
              </div>
              <div class="deatail-information">
                  <h4>Contact Information </h4>
                  <p><b>Email</b></p>
                  <a href="mailto:${email}">${email}</a>
                  <p><b>Phone</b></p>
                  <p>${phone}</p>
              </div>
    `;
}

function ContactListHtml(contactId, name, email, shortcut) {
  return /*html*/ `
                <button onclick="showDetailContact(id)" class="contact-name" id="${contactId}">
                <div class="shortcut-contact small">${shortcut}</div>
                <div class="full-name">
                  <span class="person-name">${name}</span>
                  <span class="contact-mail">${email}</span>
                </div>
              </button>
    `;
}
