function openBoard() {
  window.location.href = "board.html";
}

/**
 * This function is used to greet the user 
 * 
 */

function greetUser() {
  loadUser();
  let greetingUser = userId;
  if(userId == "guest"){
    greetingUser = "";
  }
  let d = new Date();
  let hour = d.getHours();
  let greetingText = getDayTime(hour);
  document.getElementById("greeting").innerHTML = greetingHTML(greetingText, greetingUser);
}

/**
 * This function generates a greeting text based on your local time.
 * 
 * @param {number} hour - This is the actual hour of your local time
 * @returns - This returns the greeting text
 */
function getDayTime(hour) {
  let greetingText = "";
  if (hour >= 6 && hour < 12) {
    greetingText = "Good Morning";
  } else if (hour >= 12 && hour < 18) {
    greetingText = "Good Afternoon";
  } else {
    greetingText = "Good Evening";
  }
  return greetingText;
}

/**
 * This function show the greeting text
 * 
 * @param {string} greetingText - This is the greeting text
 * @param {string} greetingUser - This is the name of user
 * @returns 
 */

function greetingHTML(greetingText, greetingUser) {
  return /* html */ `
<h3>${greetingText}</h3> <br>
<h4>${greetingUser}</h4>
`;
}



