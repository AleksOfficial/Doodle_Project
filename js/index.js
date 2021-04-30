
var collectedData = {
    a_title: "",
    a_location: "",
    a_description: "",
    a_creator_name: "",
    a_creator_email: "",
    a_end_date: "",
    timeslots: [],
    votes: [],
    comments: []
};
// set all global variables
var divs = [];
var mainBox;
var nameInput;
var locationInput;
var descriptionInput;
var nameGiven = false;
var nameAndEndTimeGiven = false;
var activeButton;
var creatorNameInput;
var creatorEmailInput;
var creatorGiven = false;
var voterNameInput;
var voterGiven = false;
var endTimeInput;
var endTimeHourInput;
var votes;
var commentNameInput;
var commentTextArea;
var commentButton;
var commentData;
var commentGiven = false;
var emailList;
var emailButton;
var emailListGiven = false;
var intervalFunction;
votes = {
    a_baselink: "",
    votes: []
};
// create template for generation of new timeslots
var newTimeslot = document.createElement("div");
var plusSign = document.createElement("div");
newTimeslot.classList.add("timeslot", "fade-in");
plusSign.classList.add("plus", "radius", "fade-in");
newTimeslot.append(plusSign);
var newTimeSlotInput = document.createElement("div");
newTimeSlotInput.classList.add("hide", "timeslot-input", "fade-in");
newTimeSlotInput.append(document.createTextNode("Start time: "));
var newTimeSlotCalendarInput = document.createElement("input");
newTimeSlotCalendarInput.setAttribute("type", "date");
var today = new Date();
var month = (today.getMonth() + 1) < 10 ? "0" + (today.getMonth() + 1) : (today.getMonth() + 1).toString();
var day = today.getDate() < 10 ? "0" + today.getDate() : today.getDate().toString();
var currentDate = today.getFullYear() + '-' + month + '-' + day;
newTimeSlotCalendarInput.setAttribute("min", currentDate);
newTimeSlotCalendarInput.setAttribute("value", currentDate);
var newTimeSlotInputContainer = document.createElement("div");
newTimeSlotInputContainer.append(newTimeSlotCalendarInput);
var newTimeSelect = document.createElement("select");
for (var i = 0; i < 24 * 4; i++) { // add options for each 15-minute-interval timestamp for the whole day
    var newOption = document.createElement("option");
    var hour = Math.floor(i / 4);
    var time = (hour < 10 ? "0" + hour : hour.toString()) + ":" + ((i % 4) * 15).toString() + (i % 4 == 0 ? 0 : "");
    newOption.setAttribute("value", time);
    newOption.append(document.createTextNode(time));
    newTimeSelect.append(newOption);
}
newTimeSlotInputContainer.append(newTimeSelect);
newTimeSlotInput.append(newTimeSlotInputContainer);
newTimeSlotInput.append(document.createTextNode("End time: "));
newTimeSlotInput.append(newTimeSlotInputContainer.cloneNode(true));
var newTimeslotButton = document.createElement("button");
newTimeslotButton.append(document.createTextNode("Add"));
newTimeslotButton.classList.add("button-clickable");
newTimeSlotInput.append(newTimeslotButton);
newTimeslot.append(newTimeSlotInput);
var newTimeSlotFinishedSlot = document.createElement("div");
newTimeSlotFinishedSlot.append(document.createElement("div"));
newTimeSlotFinishedSlot.append(document.createElement("div"));
newTimeSlotFinishedSlot.classList.add("timeslot-finished", "hide", "fade-in");
newTimeslot.append(newTimeSlotFinishedSlot);
var timeSlotID = 0;
//reusable function for site navigation
var listener = function () { goTo(1); };
function goTo(page) {
    for (var i = 0; i < divs.length; i++) { // only show current div
        if (i == page) {
            divs[i].classList.remove("hide");
        }
        else {
            divs[i].classList.add("hide");
        }
    }
    if (page == 1) { // options page
        clearInterval(intervalFunction);
        mainBox.classList.remove("main-box-full");
        mainBox.classList.add("main-box-large");
        nameInput = document.querySelector("div.options-content input[name = 'name']");
        nameInput.value = collectedData.a_title;
        listener = function () { goTo(2); };
        activeButton = document.querySelector("div.options-content-main button");
        if (nameAndEndTimeGiven) {
            activeButton.addEventListener("click", listener);
        }
        intervalFunction = setInterval(handleOptionInput, 100);
    }
    if (page == 2) { // timeslot page
        activeButton.removeEventListener("click", listener);
        clearInterval(intervalFunction);
        mainBox.classList.remove("main-box-large");
        mainBox.classList.add("main-box-full");
        collectedData.a_location = locationInput.value;
        collectedData.a_description = descriptionInput.value;
        document.querySelector(".calendar-header-tags .calendar-header-name").innerHTML = "Name: " + collectedData.a_title;
        document.querySelector(".calendar-header-tags .calendar-header-location").innerHTML = "Location: " + collectedData.a_location;
        document.querySelector(".calendar-header-tags .calendar-header-description").innerHTML = "Description: " + collectedData.a_description;
    }
    if (page == 3) { // admin name and email page
        clearInterval(intervalFunction);
        activeButton = document.querySelector("div.creator-bottom-buttons .button-forward");
        intervalFunction = setInterval(handleCreatorInput, 100);
        mainBox.classList.remove("main-box-full");
        mainBox.classList.add("main-box-large");
    }
    if (page == 4) { // this page is viewed while appointment is saved
        clearInterval(intervalFunction);
        mainBox.classList.remove("main-box-large");
        mainBox.classList.remove("main-box-full");
        clearInterval(intervalFunction);
        ajaxPushAppointment(collectedData);
    }
    if (page == 5) { // this is the appointment view
        clearInterval(intervalFunction);
        intervalFunction = setInterval(handleVoteInput, 100);
        setInterval(handleCommentInput, 100);
        setInterval(handleEmailInput, 100);
        mainBox.classList.remove("main-box-large");
        mainBox.classList.add("main-box-full");
        activeButton = document.querySelector("div.appointment-content-main-submit button");
        var params = new URLSearchParams(location.search);
        ajaxPullAppointment(params.get("x"));
        document.querySelector("div.email-list textarea").value = "";
    }
}
// add the specified timeslot to the list and then create a new plus sign/timeslot from the template
function addTimeSlot(e) {
    var addButton = e.target;
    var startDate = addButton.parentElement.children[0].firstChild.value
        + " " + addButton.parentElement.children[0].children[1].value;
    var endDate = addButton.parentElement.children[1].firstChild.value
        + " " + addButton.parentElement.children[1].children[1].value;
    if (new Date(startDate) < new Date(endDate)) { // timeslot start date must be before end date
        var finishedTimeSlot = addButton.parentElement.parentElement.lastChild;
        finishedTimeSlot.classList.remove("hide");
        finishedTimeSlot.children[0].append(document.createTextNode(startDate));
        finishedTimeSlot.children[1].append(document.createTextNode(endDate));
        collectedData.timeslots.push({ a_start: startDate, a_end: endDate });
        addButton.parentElement.remove();
        if (timeSlotID == 1) { // if this was the first timeslot entered, make forward button clickable
            var nextButton = document.querySelector(".calendar-bottom-buttons .button-unclickable");
            nextButton.classList.remove("button-unclickable");
            nextButton.classList.add("button-clickable");
            nextButton.addEventListener("click", function () { goTo(3); });
        }
        addPlusSign();
    }
    else {
        alert("Start date must be before end date!");
    }
}
var addTimeSlotListener = function (e) { addTimeSlot(e); };
function handlePlusSignClick(e) {
    var timeslot = e.currentTarget;
    var plus = timeslot.firstChild;
    plus.remove();
    var card = timeslot.firstChild;
    card.classList.remove("hide");
    timeslot.removeEventListener("click", handlePlusSignClickListener);
    card.lastChild.addEventListener("click", addTimeSlotListener);
}
var handlePlusSignClickListener = function (e) { handlePlusSignClick(e); };
// create new plus sign/timeslot from the template
function addPlusSign() {
    var newSlot = newTimeslot.cloneNode(true);
    newSlot.id = timeSlotID.toString();
    timeSlotID++;
    document.querySelector("div.calendar-content-main").append(newSlot);
    newSlot.addEventListener("click", handlePlusSignClickListener);
}
// button only clickable if name was entered (page 0)
function handleNameInput() {
    collectedData.a_title = nameInput.value;
    if (nameInput.value != "" && !nameGiven) {
        activeButton.addEventListener("click", listener);
        activeButton.classList.add("button-clickable");
        activeButton.classList.remove("button-unclickable");
        nameGiven = true;
    }
    else if (nameInput.value == "" && nameGiven) {
        activeButton.removeEventListener("click", listener);
        activeButton.classList.add("button-unclickable");
        activeButton.classList.remove("button-clickable");
        nameGiven = false;
    }
}
// only finish appointment if email is valid address
var finishListener = function () {
    var emailInput = document.querySelector("input[type = email]");
    if (emailInput.checkValidity()) {
        goTo(4);
    }
    else {
        alert("Enter valid email address!");
    }
};
// button only clickable if both name and email were entered (page 3)
function handleCreatorInput() {
    collectedData.a_creator_email = creatorEmailInput.value;
    collectedData.a_creator_name = creatorNameInput.value;
    if (creatorNameInput.value != "" && creatorEmailInput.value != "" && !creatorGiven) {
        activeButton.addEventListener("click", finishListener);
        activeButton.classList.add("button-clickable");
        activeButton.classList.remove("button-unclickable");
        creatorGiven = true;
    }
    else if ((creatorNameInput.value == "" || creatorEmailInput.value == "") && creatorGiven) {
        activeButton.removeEventListener("click", finishListener);
        activeButton.classList.add("button-unclickable");
        activeButton.classList.remove("button-clickable");
        creatorGiven = false;
    }
}
commentData = {
    a_name: "",
    a_text: "",
    a_baselink: ""
};
// button only clickable if both name and comment were entered (page 5)
function handleCommentInput() {
    commentData.a_name = commentNameInput.value;
    commentData.a_text = commentTextArea.value;
    if (commentNameInput.value != "" && commentTextArea.value != "" && !commentGiven) {
        commentButton.addEventListener("click", ajaxPushComment);
        commentButton.classList.add("button-clickable");
        commentButton.classList.remove("button-unclickable");
        commentGiven = true;
    }
    else if ((commentNameInput.value == "" || commentTextArea.value == "") && commentGiven) {
        commentButton.removeEventListener("click", ajaxPushComment);
        commentButton.classList.add("button-unclickable");
        commentButton.classList.remove("button-clickable");
        commentGiven = false;
    }
}
// count number of checked checkboxes for voting
var numberOfVotes = 0;
function voteListener(e) {
    var target = e.target;
    if (target.checked == true) {
        numberOfVotes++;
    }
    else {
        numberOfVotes--;
    }
}
// push votes to database
function pushVotes() {
    var timeslots = document.querySelector("div.appointment-content-main-vote");
    for (var i = 0; i < timeslots.children.length; i++) {
        var child = timeslots.children[i];
        var checkbox = child.children[2].firstChild;
        if (checkbox.checked) {
            votes.votes.push({ a_name: voterNameInput.value, a_start: child.children[0].textContent,
                a_end: child.children[1].textContent, p_hashbytes: "" });
        }
    }
    var params = new URLSearchParams(location.search);
    votes.a_baselink = params.get("x");
    activeButton.removeEventListener("click", pushVotes);
    ajaxPushVotes(votes);
}
// button only clickable if name was entered and at least one voting checkbox is checked
function handleVoteInput() {
    if (voterNameInput.value != "" && numberOfVotes > 0 && !voterGiven) {
        activeButton.addEventListener("click", pushVotes);
        activeButton.classList.add("button-clickable");
        activeButton.classList.remove("button-unclickable");
        voterGiven = true;
    }
    else if ((voterNameInput.value == "" || numberOfVotes <= 0) && voterGiven) {
        activeButton.removeEventListener("click", pushVotes);
        activeButton.classList.add("button-unclickable");
        activeButton.classList.remove("button-clickable");
        voterGiven = false;
    }
}
// button only clickable if both name and end date are entered, location and description optional (page 1)
function handleOptionInput() {
    collectedData.a_end_date = endTimeInput.value + " " + endTimeHourInput.value;
    collectedData.a_title = nameInput.value;
    if (nameInput.value != "" && endTimeInput.value != "" && !nameAndEndTimeGiven) {
        activeButton.addEventListener("click", listener);
        activeButton.classList.add("button-clickable");
        activeButton.classList.remove("button-unclickable");
        nameAndEndTimeGiven = true;
    }
    else if ((nameInput.value == "" || endTimeInput.value == "") && nameAndEndTimeGiven) {
        activeButton.removeEventListener("click", listener);
        activeButton.classList.add("button-unclickable");
        activeButton.classList.remove("button-clickable");
        nameAndEndTimeGiven = false;
    }
}
// button only clickable if at least one address was entered (page 5, email invite)
function handleEmailInput() {
    if (emailList.value != "" && !emailListGiven) {
        emailButton.addEventListener("click", ajaxSendMail);
        emailButton.classList.add("button-clickable");
        emailButton.classList.remove("button-unclickable");
        emailListGiven = true;
    }
    else if (emailList.value == "" && emailListGiven) {
        emailButton.removeEventListener("click", ajaxSendMail);
        emailButton.classList.add("button-unclickable");
        emailButton.classList.remove("button-clickable");
        emailListGiven = false;
    }
}
// send mail invites
function ajaxSendMail() {
    var lines = emailList.value.split("\n");
    var baselink = (new URLSearchParams(location.search)).get("x");
    document.querySelector("div.email-list").classList.add("hide");
    emailList.value = "";
    $.ajax({
        type: "post",
        url: "backend/scripts/api.php",
        data: { a_baselink: baselink, emails: lines },
        success: function () {
            alert("emails sent!");
        },
        error: function (xhr, textStatus, errorThrown) {
            alert("Error sending Mail");
            if (xhr.status == 500) {
                var loading = document.querySelector("div.loading-content");
                loading.innerHTML = xhr.responseText;
            }
        }
    });
}
// remove voting cookie to allow new votes, then delete votes
function removeCookie(votedHash) {
    document.cookie = votedHash + "=voted; expires=" + (new Date()).toUTCString();
    ajaxDeleteVotes(votedHash);
}
// delete the votes 
function ajaxDeleteVotes(votedHash) {
    var params = new URLSearchParams(location.search);
    var baselink = params.get("x");
    $.ajax({
        type: "post",
        url: "backend/scripts/api.php",
        data: { p_hashbytes: votedHash },
        success: function () {
            location.reload();
        },
        error: function (xhr, textStatus, errorThrown) {
            if (xhr.status == 500) {
                alert("Test");
                var loading = document.querySelector("div.loading-content");
                loading.innerHTML = xhr.responseText;
            }
        }
    });
}
// pull appointment from db by hashlink and build page 5
function ajaxPullAppointment(link) {
    $.ajax({
        type: "get",
        url: "backend/scripts/api.php",
        dataType: "json",
        data: { baselink: link },
        success: function (data) {
            var headline = document.createElement("h1");
            headline.append(document.createTextNode(data.a_title));
            document.querySelector("div.appointment-content header").prepend(headline);
            document.querySelector(".appointment-header-tags .appointment-header-location").innerHTML = "Location: " + data.a_location;
            document.querySelector(".appointment-header-tags .appointment-header-description").innerHTML = "Description: " + data.a_description;
            var vote = document.querySelector("div.appointment-content-main-vote");
            var linkInput = document.querySelector("div.appointment-content-main-link input");
            if (document.cookie.indexOf(link) >= 0) { // if admin cookie was set, display delete appointment button
                var deleteDiv = document.createElement("div");
                var deleteButton = document.createElement("button");
                deleteButton.addEventListener("click", function () {
                    ajaxDeleteAppointment(link);
                });
                deleteButton.classList.add("button-clickable");
                deleteButton.innerHTML = "Delete Appointment";
                deleteDiv.classList.add("div-delete-button");
                deleteDiv.append(deleteButton);
                document.querySelector("div.appointment-content-main-link").append(deleteDiv);
            }
            linkInput.value = location.href;
            if (new Date(data.a_end_date) < new Date()) { // hide voting button if time for voting has ended
                document.querySelector("div.appointment-content-main-submit").classList.add("hide");
            }
            var _loop_1 = function (i) {
                var timeslot = newTimeSlotFinishedSlot.cloneNode(true);
                timeslot.classList.remove("hide");
                var start = timeslot.firstChild;
                start.append(document.createTextNode(data.timeslots[i].a_start.toString()));
                var end = timeslot.children[1];
                end.append(document.createTextNode(data.timeslots[i].a_end.toString()));
                if (new Date(data.a_end_date) >= new Date()) { // only create checkboxes if voting is still possible
                    var checkbox = document.createElement("input");
                    checkbox.setAttribute("type", "checkbox");
                    checkbox.addEventListener("click", voteListener);
                    var votedHash_1 = "";
                    for (var j = 0; j < data.votes.length; j++) { // check cookies if one of the votes was submitted by this user
                        if (document.cookie.indexOf(data.votes[j].p_hashbytes) >= 0) {
                            votedHash_1 = data.votes[j].p_hashbytes; // if yes, remember the hash
                        }
                    }
                    if (votedHash_1 == "") { // user did not already vote, so checbox is displayed
                        var checkboxDiv = document.createElement("div");
                        checkboxDiv.classList.add("appointment-checkbox");
                        checkboxDiv.append(checkbox);
                        timeslot.append(checkboxDiv);
                    }
                    else { // user already voted, so delete votes button is displayed instead
                        document.querySelector("div.appointment-content-main-submit").classList.add("hide");
                        document.querySelector("div.appointment-content-main-delete").classList.remove("hide");
                        var button = document.querySelector("div.appointment-content-main-delete button");
                        button.addEventListener("click", function () { removeCookie(votedHash_1); });
                    }
                }
                // count all votes and display them on the card
                var count = 0;
                var countDiv = document.createElement("div");
                countDiv.classList.add("appointment-vote-count");
                timeslot.append(countDiv);
                for (var j = 0; j < data.votes.length; j++) {
                    if (data.timeslots[i].a_start.toString() == data.votes[j].a_start
                        && data.timeslots[i].a_end.toString() == data.votes[j].a_end) {
                        count++;
                        var newName = document.createElement("div");
                        newName.append(document.createTextNode(data.votes[j].a_name));
                        timeslot.append(newName);
                    }
                }
                countDiv.append(document.createTextNode("Votes: " + count.toString()));
                vote.append(timeslot);
            };
            for (var i = 0; i < data.timeslots.length; i++) {
                _loop_1(i);
            }
            // display comments
            var commentSection = document.querySelector("div.appointment-content-main-comment-insert");
            for (var _i = 0, _a = data.comments; _i < _a.length; _i++) {
                var comment = _a[_i];
                var commentDiv = document.createElement("div");
                commentDiv.classList.add("comment");
                var nameDiv = document.createElement("div");
                nameDiv.append(document.createTextNode("Name: " + comment.a_name));
                var commentDivDiv = document.createElement("div");
                commentDivDiv.append(document.createTextNode(comment.a_text));
                commentDiv.append(nameDiv);
                commentDiv.append(commentDivDiv);
                commentSection.append(commentDiv);
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            var appointment = document.querySelector("div.appointment-content-main");
            appointment.innerHTML = xhr.responseText;
        }
    });
}
// read the value from cookie with name a
function getCookieValue(a) {
    var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
    return b ? b.pop() : '';
}
// delete appointment, link = hash baselink (?x=amdkasmd....)
function ajaxDeleteAppointment(link) {
    var deleteData = {
        a_admin_hash: "",
        a_baselink: ""
    };
    deleteData.a_baselink = link;
    deleteData.a_admin_hash = getCookieValue(link);
    $.ajax({
        type: "post",
        url: "backend/scripts/api.php",
        data: deleteData,
        success: function () {
            location.href = "index.html";
        },
        error: function (xhr, textStatus, errorThrown) {
            if (xhr.status == 500) {
                var loading = document.querySelector("div.loading-content");
                loading.innerHTML = xhr.responseText;
            }
        }
    });
}
// push appointment into db
function ajaxPushAppointment(appointment) {
    $.ajax({
        type: "post",
        url: "backend/scripts/api.php",
        dataType: "json",
        data: appointment,
        success: function (data) {
            history.replaceState({}, "", "?x=" + data.a_baselink); // if successful, add new hash to address bar
            document.cookie = data.a_baselink + "=" + data.a_admin_hash; // set admin cookie to allow for later admin functionality
            goTo(5);
        },
        error: function (xhr, textStatus, errorThrown) {
            var loading = document.querySelector("div.loading-content");
            loading.innerHTML = xhr.responseText;
        }
    });
}
// push votes to db
function ajaxPushVotes(votes) {
    $.ajax({
        type: "post",
        url: "backend/scripts/api.php",
        dataType: "json",
        data: votes,
        success: function (data) {
            document.cookie = data.p_hashbytes + "=voted"; // set cookie with new hashbytes (hashbytes are cookie name, not value, to allow voting on several polls)
            location.reload();
        },
        error: function (xhr, textStatus, errorThrown) {
            if (xhr.status == 500) {
                var loading = document.querySelector("div.loading-content");
                loading.innerHTML = xhr.responseText;
            }
        }
    });
}
// push new comment to db
function ajaxPushComment() {
    var params = new URLSearchParams(location.search);
    commentData.a_baselink = params.get("x");
    $.ajax({
        type: "post",
        url: "backend/scripts/api.php",
        data: commentData,
        success: function () {
            location.reload();
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log(xhr.status);
            if (xhr.status == 500) {
                console.log("lose");
            }
        }
    });
}
// initialize all important global variables and set several eventListeners and setIntervals
window.onload = function () {
    // the different pages
    divs[0] = document.querySelector("div.create-new-appointment-content");
    divs[1] = document.querySelector("div.options-content");
    divs[2] = document.querySelector("div.calendar-content");
    divs[3] = document.querySelector("div.creator-content");
    divs[4] = document.querySelector("div.loading-content");
    divs[5] = document.querySelector("div.appointment-content");
    // end time selection is built from template
    var endTimeDiv = document.querySelector("div.options-content-end-time");
    endTimeInput = newTimeSlotCalendarInput.cloneNode(true);
    endTimeDiv.append(endTimeInput);
    endTimeHourInput = newTimeSelect.cloneNode(true);
    endTimeDiv.append(endTimeHourInput);
    mainBox = document.querySelector("div.main-box");
    // set active button to create button (page 1)
    activeButton = document.querySelector("div.create-new-appointment-content button");
    // add listeners for static buttons
    document.querySelector("div.calendar-bottom-buttons .button-back").addEventListener("click", function () { goTo(1); });
    document.querySelector("div.creator-bottom-buttons .button-back").addEventListener("click", function () { goTo(2); });
    document.querySelector("button.email-button").addEventListener("click", function () {
        document.querySelector("div.email-list").classList.remove("hide");
    });
    document.querySelector("button.cancel-button").addEventListener("click", function () {
        document.querySelector("div.email-list").classList.add("hide");
    });
    // initialize global variables
    nameInput = document.querySelector("div.create-new-appointment-content input");
    locationInput = document.querySelector("div.options-content input[name = 'location']");
    descriptionInput = document.querySelector("div.options-content input[name = 'description']");
    creatorNameInput = document.querySelector("div.creator-content input[name = 'creatorName']");
    creatorEmailInput = document.querySelector("div.creator-content input[name = 'creatorEmail']");
    voterNameInput = document.querySelector("div.appointment-content-main-submit input");
    commentNameInput = document.querySelector("input.appointment-content-main-comments-name-input");
    commentTextArea = document.querySelector("textarea.appointment-content-main-comments-textarea");
    commentButton = document.querySelector("div.appointment-content-main-comments button");
    emailList = document.querySelector("div.email-list textarea");
    emailButton = document.querySelector("button.email-invite-button");
    // set up copy button for invite link
    document.querySelector("div.appointment-content-main-link button").addEventListener("click", function () {
        var inputField = document.querySelector("div.appointment-content-main-link input");
        inputField.select();
        inputField.setSelectionRange(0, 99999);
        document.execCommand("copy");
    });
    // initial intervalFuntion for handling input in name field (page 0)
    intervalFunction = setInterval(handleNameInput, 100);
    var inputs = document.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].value = "";
    }
    // add first plus sign button for timeslot creation
    addPlusSign();
    var params = new URLSearchParams(location.search);
    // if hashlink is present in URL, move to specified appointment instead
    if (params.get("x") != null) {
        goTo(5);
    }
};
