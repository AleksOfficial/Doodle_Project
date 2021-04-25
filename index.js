var collectedData = {
    name: "",
    location: "",
    description: "",
    creatorName: "",
    creatorEmail: "",
    validUntil: null,
    dates: []
};
var divs = [];
var mainBox;
var nameInput;
var locationInput;
var descriptionInput;
var nameGiven = false;
var activeButton;
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
        mainBox.classList.remove("main-box-full");
        mainBox.classList.add("main-box-large");
    }
    else if (page == 2) {
        mainBox.classList.remove("main-box-large");
        mainBox.classList.add("main-box-full");
    }
    if (page == 1) {
        nameInput = document.querySelector("div.options-content input[name = 'name']");
        nameInput.value = collectedData.name;
        listener = function () { goTo(2); };
        activeButton = document.querySelector("div.options-content-main button");
        nameGiven = false;
    }
    if (page == 2) {
        collectedData.location = locationInput.value;
        collectedData.description = descriptionInput.value;
        document.querySelector(".calendar-header-tags .calendar-header-name").append(collectedData.name);
        document.querySelector(".calendar-header-tags .calendar-header-location").append(collectedData.location);
        document.querySelector(".calendar-header-tags .calendar-header-description").append(collectedData.description);
    }
}
function addTimeSlot(e) {
    var addButton = e.target;
    var startDate = new Date(addButton.parentElement.children[0].firstChild.value
        + " " + addButton.parentElement.children[0].children[1].value);
    var endDate = new Date(addButton.parentElement.children[1].firstChild.value
        + " " + addButton.parentElement.children[1].children[1].value);
    var finishedTimeSlot = addButton.parentElement.parentElement.lastChild;
    finishedTimeSlot.classList.remove("hide");
    var startString = startDate.getDate() + "." + (startDate.getMonth() + 1) + "." + startDate.getFullYear() + " "
        + (startDate.getHours() < 10 ? "0" : "") + startDate.getHours() + ":" + (startDate.getMinutes() < 10 ? "0" : "")
        + startDate.getMinutes();
    var endString = endDate.getDate() + "." + (endDate.getMonth() + 1) + "." + endDate.getFullYear()
        + " " + (endDate.getHours() < 10 ? "0" : "") + endDate.getHours() + ":" + (endDate.getMinutes() < 10 ? "0" : "")
        + endDate.getMinutes();
    finishedTimeSlot.children[0].append(document.createTextNode(startString));
    finishedTimeSlot.children[1].append(document.createTextNode(endString));
    collectedData.dates.push({ from: startDate, to: endDate });
    addButton.parentElement.remove();
    if (timeSlotID == 1) {
        var finishButton = document.querySelector(".calendar-bottom-buttons .button-unclickable");
        finishButton.classList.remove("button-unclickable");
        finishButton.classList.add("button-clickable");
    }
    addPlusSign();
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
    collectedData.name = nameInput.value;
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
window.onload = function () {
    divs[0] = document.querySelector("div.create-new-appointment-content");
    divs[1] = document.querySelector("div.options-content");
    divs[2] = document.querySelector("div.calendar-content");
    mainBox = document.querySelector("div.main-box");
    activeButton = document.querySelector("div.create-new-appointment-content button");
    document.querySelector("div.calendar-bottom-buttons .button-back").addEventListener("click", function () { goTo(1); });
    nameInput = document.querySelector("div.create-new-appointment-content input");
    locationInput = document.querySelector("div.options-content input[name = 'location']");
    descriptionInput = document.querySelector("div.options-content input[name = 'description']");
    setInterval(handleNameInput, 100);
    var inputs = document.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].value = "";
    }
    addPlusSign();
};
