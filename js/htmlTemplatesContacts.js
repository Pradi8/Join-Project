/**
 *This function returns a template literal containing HTML code.
 *  
 * @returns HTML template
 */

function showEditHtml() {
  return /* html */ `
     <article onclick="stopPropagation(event)" id="editHead">
          <button id="btnCloseEditRepo" onclick="closeEditField()">X</button>
          <img src="./img/join_logo.svg" alt="">
          <h2>${prepareMode.headline}</h2>
          <span>${prepareMode.headText}</span>
          <div class="underline-short"></div>
        </article>
        <article onclick="stopPropagation(event)" id="editDetails">
          <div class="shortcut-contact big big-repo" style="background-color:${bgColorInitals}">${prepareMode.shortcut}</div>
          <form onsubmit="requiredContactName(); return false">
            <div class="input_fields">          
              <div class="input_value">
                <input
                type="text"
                placeholder="Name"
                id="newContactName"
                onfocusin="selectField(id)"
                onfocusout="unselectField(id)"
                value="${contactInformation.contactName}"
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
                value="${contactInformation.contactEmail}"
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
                value="${contactInformation.contactPhone}"
                />
                <img src="./img/call.svg" alt="" />
              </div>
              <div class="required" id="requiredEditPhone"></div>
            </div>
            <div class="btn-edit">
            <button onclick="closeEditField('${prepareMode.btnLeft}')" type="button" class="button_bright">${prepareMode.btnLeft}</button>
            <button type="submit" class="button_dark">${prepareMode.btnRight} <img src="./img/check.svg" alt=""></button>
            </div>
          </form>
        </article>
    `;
}

/**
 * This function returns HTML that displays the detailed information of a contact.
 * 
 * @param {*} name the name of the contact
 * @param {*} email the email of the contact
 * @param {*} phone the phone number of the contact
 * @param {*} initials the initial of the contact
 * @returns HTML template
 */

function showDetialInformationHtml(name, email, phone, initials) {
  return /* html */ `
    <div class="detail-contact-name">
                <span class="shortcut-contact big" style="background-color:${bgColorInitals}">${initials}</span>
                <div>
                  <h3>${name}</h3>
                  <div>
                      <button id="editContactDetail" class="btn-invisible" onclick="openEditContact('prepareContact')" class="btn-prepare-contact"><img src="./img/edit.svg" alt=""> <span class="text-prepare">Edit</span></button>
                      <button id="deleteContactDetail" class="btn-invisible" onclick="deleteContact(id)" class="btn-prepare-contact"><img src="./img/delete.svg" alt=""> <span>Delete</span></button>
                  </div>
                </div>
              </div>
              <div class="deatail-information">
                  <h4>Contact Information</h4>
                  <p><b>Email</b></p>
                  <a href="mailto:${email}">${email}</a>
                  <p><b>Phone</b></p>
                  <a href="tel:${phone}">${phone}</a>
              </div>
    `;
}

/**
 *This function generates HTML for a contact entry in a contact list. 
 * 
 * @param {*} contactId the unique ID of the contact. 
 * @param {*} name the name of the contact
 * @param {*} email the email of the contact
 * @param {*} shortcut the shortcut of the contact
 * @param {*} firstLetter the firstletter of the contact
 * @param {*} color the color of the contact
 * @param {*} underline underline the contact
 * @returns HTML template
 */

function ContactListHtml(contactId, name, email, shortcut, firstLetter, color, underline) {
  return /*html*/ `
                <label class="${underline}">${firstLetter}</label>
                <button onclick="showDetailContact(id)" class="contact-name" id="${contactId}">
                <div class="shortcut-contact small" style="background-color:${color}">${shortcut}</div>
                <div class="full-name">
                  <span class="person-name">${name}</span>
                  <span class="contact-mail">${email}</span>
                </div>
              </button>
    `;
}
