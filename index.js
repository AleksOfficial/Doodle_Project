
var collectedData = {
    a_title: "",
    a_location: "",
    a_description: "",
    a_creator_name: "",
    a_creator_email: "",
    a_end_date: "",
    timeslots: [],
    votes: []
};
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
votes = {
    a_baselink: "",
    votes: []
};
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
for (var i = 0; i < 24 * 4; i++) {
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
var intervalFunction;
var listener = function () { goTo(1); };
function goTo(page) {
    for (var i = 0; i < divs.length; i++) {
        if (i == page) {
            divs[i].classList.remove("hide");
        }
        else {
            divs[i].classList.add("hide");
        }
    }
    if (page == 1) {
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
    if (page == 2) {
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
    if (page == 3) {
        clearInterval(intervalFunction);
        activeButton = document.querySelector("div.creator-bottom-buttons .button-forward");
        intervalFunction = setInterval(handleCreatorInput, 100);
        mainBox.classList.remove("main-box-full");
        mainBox.classList.add("main-box-large");
    }
    if (page == 4) {
        clearInterval(intervalFunction);
        mainBox.classList.remove("main-box-large");
        mainBox.classList.remove("main-box-full");
        clearInterval(intervalFunction);
        ajaxPushAppointment(collectedData);
    }
    if (page == 5) {
        clearInterval(intervalFunction);
        intervalFunction = setInterval(handleVoteInput, 100);
        setInterval(handleCommentInput, 100);
        mainBox.classList.remove("main-box-large");
        mainBox.classList.add("main-box-full");
        activeButton = document.querySelector("div.appointment-content-main-submit button");
        var params = new URLSearchParams(location.search);
        ajaxPullAppointment(params.get("x"));
    }
}
function addTimeSlot(e) {
    var addButton = e.target;
    var startDate = addButton.parentElement.children[0].firstChild.value
        + " " + addButton.parentElement.children[0].children[1].value;
    var endDate = addButton.parentElement.children[1].firstChild.value
        + " " + addButton.parentElement.children[1].children[1].value;
    if (new Date(startDate) < new Date(endDate)) {
        var finishedTimeSlot = addButton.parentElement.parentElement.lastChild;
        finishedTimeSlot.classList.remove("hide");
        finishedTimeSlot.children[0].append(document.createTextNode(startDate));
        finishedTimeSlot.children[1].append(document.createTextNode(endDate));
        collectedData.timeslots.push({ a_start: startDate, a_end: endDate });
        addButton.parentElement.remove();
        if (timeSlotID == 1) {
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
function addPlusSign() {
    var newSlot = newTimeslot.cloneNode(true);
    newSlot.id = timeSlotID.toString();
    timeSlotID++;
    document.querySelector("div.calendar-content-main").append(newSlot);
    newSlot.addEventListener("click", handlePlusSignClickListener);
}
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
var finishListener = function () {
    var emailInput = document.querySelector("input[type = email]");
    if (emailInput.checkValidity()) {
        goTo(4);
    }
    else {
        alert("Enter valid email address!");
    }
};
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
    a_comment: ""
};
function handleCommentInput() {
    commentData.a_name = commentNameInput.value;
    commentData.a_comment = commentTextArea.value;
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
function handleOptionInput() {
    collectedData.a_end_date = endTimeInput.value + " " + endTimeHourInput.value;
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
function removeCookie(votedHash) {
    document.cookie = votedHash + "=voted; expires=" + (new Date()).toUTCString();
    ajaxDeleteVotes(votedHash);
}
function ajaxDeleteVotes(votedHash) {
    var params = new URLSearchParams(location.search);
    var baselink = params.get("x");
    $.ajax({
        type: "post",
        url: "backend/scripts/api.php",
        dataType: "json",
        data: { p_hashbytes: votedHash },
        success: function (data) {
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
            document.querySelector(".appointment-header-tags .appointment-header-name").innerHTML = "Name: " + data.a_title;
            document.querySelector(".appointment-header-tags .appointment-header-location").innerHTML = "Location: " + data.a_location;
            document.querySelector(".appointment-header-tags .appointment-header-description").innerHTML = "Description: " + data.a_description;
            var vote = document.querySelector("div.appointment-content-main-vote");
            var linkInput = document.querySelector("div.appointment-content-main-link input");
            if (document.cookie.indexOf(link) >= 0) {
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
            if (new Date(data.a_end_date) >= new Date()) {
                document.querySelector("div.appointment-content-main-submit").classList.add("hide");
            }
            var _loop_1 = function (i) {
                var timeslot = newTimeSlotFinishedSlot.cloneNode(true);
                timeslot.classList.remove("hide");
                var start = timeslot.firstChild;
                start.append(document.createTextNode(data.timeslots[i].a_start.toString()));
                var end = timeslot.children[1];
                end.append(document.createTextNode(data.timeslots[i].a_end.toString()));
                if (new Date(data.a_end_date) < new Date()) {
                    var checkbox = document.createElement("input");
                    checkbox.setAttribute("type", "checkbox");
                    checkbox.addEventListener("click", voteListener);
                    var votedHash_1 = "";
                    for (var j = 0; j < data.votes.length; j++) {
                        if (document.cookie.indexOf(data.votes[j].p_hashbytes) >= 0) {
                            votedHash_1 = data.votes[j].p_hashbytes;
                        }
                    }
                    if (votedHash_1 == "") {
                        var checkboxDiv = document.createElement("div");
                        checkboxDiv.classList.add("appointment-checkbox");
                        checkboxDiv.append(checkbox);
                        timeslot.append(checkboxDiv);
                    }
                    else {
                        document.querySelector("div.appointment-content-main-submit").classList.add("hide");
                        document.querySelector("div.appointment-content-main-delete").classList.remove("hide");
                        var button = document.querySelector("div.appointment-content-main-delete button");
                        button.addEventListener("click", function () { removeCookie(votedHash_1); });
                    }
                }
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
        },
        error: function (xhr, textStatus, errorThrown) {
            var appointment = document.querySelector("div.appointment-content-main");
            appointment.innerHTML = xhr.responseText;
        }
    });
}
function ajaxDeleteAppointment(link) {
    console.log(link);
}
function ajaxPushAppointment(appointment) {
    $.ajax({
        type: "post",
        url: "backend/scripts/api.php",
        dataType: "json",
        data: appointment,
        success: function (data) {
            history.replaceState({}, "", "?x=" + data.a_baselink);
            document.cookie = data.a_baselink + "=admin";
            goTo(5);
        },
        error: function (xhr, textStatus, errorThrown) {
            var loading = document.querySelector("div.loading-content");
            loading.innerHTML = xhr.responseText;
        }
    });
}
function ajaxPushVotes(votes) {
    $.ajax({
        type: "post",
        url: "backend/scripts/api.php",
        dataType: "json",
        data: votes,
        success: function (data) {
            document.cookie = data.p_hashbytes + "=voted";
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
function ajaxPushComment() {
    $.ajax({
        type: "post",
        url: "backend/scripts/api.php",
        dataType: "json",
        data: commentData,
        success: function (data) {
            console.log("win");
        },
        error: function (xhr, textStatus, errorThrown) {
            if (xhr.status == 500) {
                console.log("lose");
            }
        }
    });
}
window.onload = function () {
    divs[0] = document.querySelector("div.create-new-appointment-content");
    divs[1] = document.querySelector("div.options-content");
    divs[2] = document.querySelector("div.calendar-content");
    divs[3] = document.querySelector("div.creator-content");
    divs[4] = document.querySelector("div.loading-content");
    divs[5] = document.querySelector("div.appointment-content");
    var endTimeDiv = document.querySelector("div.options-content-end-time");
    endTimeInput = newTimeSlotCalendarInput.cloneNode(true);
    endTimeDiv.append(endTimeInput);
    endTimeHourInput = newTimeSelect.cloneNode(true);
    endTimeDiv.append(endTimeHourInput);
    mainBox = document.querySelector("div.main-box");
    activeButton = document.querySelector("div.create-new-appointment-content button");
    document.querySelector("div.calendar-bottom-buttons .button-back").addEventListener("click", function () { goTo(1); });
    document.querySelector("div.creator-bottom-buttons .button-back").addEventListener("click", function () { goTo(2); });
    nameInput = document.querySelector("div.create-new-appointment-content input");
    locationInput = document.querySelector("div.options-content input[name = 'location']");
    descriptionInput = document.querySelector("div.options-content input[name = 'description']");
    creatorNameInput = document.querySelector("div.creator-content input[name = 'creatorName']");
    creatorEmailInput = document.querySelector("div.creator-content input[name = 'creatorEmail']");
    voterNameInput = document.querySelector("div.appointment-content-main-submit input");
    commentNameInput = document.querySelector("input.appointment-content-main-comments-name-input");
    commentTextArea = document.querySelector("textarea.appointment-content-main-comments-textarea");
    commentButton = document.querySelector("div.appointment-content-main-comments button");
    document.querySelector("div.appointment-content-main-link button").addEventListener("click", function () {
        var inputField = document.querySelector("div.appointment-content-main-link input");
        inputField.select();
        inputField.setSelectionRange(0, 99999);
        document.execCommand("copy");
    });
    intervalFunction = setInterval(handleNameInput, 100);
    var inputs = document.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].value = "";
    }
    addPlusSign();
    var params = new URLSearchParams(location.search);
    if (params.get("x") != null) {
        goTo(5);
    }
};
