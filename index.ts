interface AppointmentDate {
    from: Date;
    to: Date;
}

interface AppointmentData {
    name: string;
    location: string;
    description: string;
    dates: AppointmentDate[];
}

var collectedData: AppointmentData = {
    name: "",
    location: "",
    description: "",
    dates: []
}
var divs: HTMLDivElement[] = [];
var mainBox: HTMLDivElement;
var nameInput: HTMLInputElement;
var locationInput: HTMLInputElement;
var descriptionInput: HTMLInputElement;
var nameGiven: boolean = false;
var activeButton: HTMLButtonElement;

var newTimeslot = document.createElement("div") as HTMLDivElement;
var plusSign = document.createElement("div") as HTMLDivElement;
newTimeslot.classList.add("timeslot", "fade-in");
plusSign.classList.add("plus", "radius", "fade-in");
newTimeslot.append(plusSign);
var newTimeSlotInput = document.createElement("div") as HTMLDivElement;
newTimeSlotInput.classList.add("hide", "timeslot-input", "fade-in");
newTimeSlotInput.append(document.createTextNode("Start time: "));
var newTimeSlotCalendarInput = document.createElement("input") as HTMLInputElement;
newTimeSlotCalendarInput.setAttribute("type", "date");
let today = new Date();
let month: string = (today.getMonth()+1) < 10 ? "0"+(today.getMonth()+1) : (today.getMonth()+1).toString();
let day: string = today.getDate() < 10 ? "0"+today.getDate() : today.getDate().toString();
let currentDate: string = today.getFullYear() + '-' + month + '-' + day;
newTimeSlotCalendarInput.setAttribute("min", currentDate);
newTimeSlotCalendarInput.setAttribute("value", currentDate);
var newTimeSlotInputContainer = document.createElement("div") as HTMLDivElement;
newTimeSlotInputContainer.append(newTimeSlotCalendarInput);
var newTimeSelect = document.createElement("select") as HTMLSelectElement;
for (let i = 0; i < 24 * 4; i++) {
    let newOption = document.createElement("option") as HTMLOptionElement;
    let hour = Math.floor(i/4);
    let time: string = (hour < 10 ? "0"+hour : hour.toString()) + ":" + ((i % 4) * 15).toString() + (i % 4 == 0 ? 0 : "");
    newOption.setAttribute("value", time);
    newOption.append(document.createTextNode(time));
    newTimeSelect.append(newOption);
}
newTimeSlotInputContainer.append(newTimeSelect);
newTimeSlotInput.append(newTimeSlotInputContainer);
newTimeSlotInput.append(document.createTextNode("End time: "));
newTimeSlotInput.append(newTimeSlotInputContainer.cloneNode(true));
var newTimeslotButton = document.createElement("button") as HTMLButtonElement;
newTimeslotButton.append(document.createTextNode("Add"));
newTimeslotButton.classList.add("button-clickable");
newTimeSlotInput.append(newTimeslotButton);
newTimeslot.append(newTimeSlotInput);
var newTimeSlotFinishedSlot = document.createElement("div");
newTimeSlotFinishedSlot.append(document.createElement("div"));
newTimeSlotFinishedSlot.append(document.createElement("div"));
newTimeSlotFinishedSlot.classList.add("timeslot-finished", "hide", "fade-in");
newTimeslot.append(newTimeSlotFinishedSlot);
var timeSlotID: number = 0;

var listener = () => {goTo(1)};

function goTo(page: number) {
    for (let i = 0; i < divs.length; i++) {
        if (i == page) {
            divs[i].classList.remove("hide");
        } else {
            divs[i].classList.add("hide");
        }
    }
    if (page == 1) {
        mainBox.classList.remove("main-box-full");
        mainBox.classList.add("main-box-large");
    } else if (page == 2) {
        mainBox.classList.remove("main-box-large");
        mainBox.classList.add("main-box-full");
    }
    if (page == 1) {
        nameInput = document.querySelector("div.options-content input[name = 'name']") as HTMLInputElement;
        nameInput.value = collectedData.name;
        listener = () => {goTo(2)};
        activeButton = document.querySelector("div.options-content-main button") as HTMLButtonElement;
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

function addTimeSlot(e: Event) {
    let addButton = e.target as HTMLButtonElement;
    let startDate = new Date((addButton.parentElement.children[0].firstChild as HTMLInputElement).value
                            + " " + (addButton.parentElement.children[0].children[1] as HTMLSelectElement).value);
    let endDate = new Date((addButton.parentElement.children[1].firstChild as HTMLInputElement).value
                            + " " + (addButton.parentElement.children[1].children[1] as HTMLSelectElement).value);
    let finishedTimeSlot = addButton.parentElement.parentElement.lastChild as HTMLDivElement;
    finishedTimeSlot.classList.remove("hide");
    let startString: string = startDate.getDate() + "." + (startDate.getMonth()+1) + "." + startDate.getFullYear() + " " 
                + (startDate.getHours() < 10 ? "0" : "")+ startDate.getHours() + ":" + (startDate.getMinutes() < 10 ? "0" : "") 
                + startDate.getMinutes();
    let endString: string = endDate.getDate() + "." + (endDate.getMonth()+1) + "." + endDate.getFullYear()
                + " " + (endDate.getHours() < 10 ? "0" : "") + endDate.getHours() + ":" + (endDate.getMinutes() < 10 ? "0" : "")
                + endDate.getMinutes();
    finishedTimeSlot.children[0].append(document.createTextNode(startString));
    finishedTimeSlot.children[1].append(document.createTextNode(endString));
    collectedData.dates.push({from: startDate, to: endDate});
    addButton.parentElement.remove();
    if(timeSlotID == 1) {
        let finishButton = document.querySelector(".calendar-bottom-buttons .button-unclickable") as HTMLButtonElement;
        finishButton.classList.remove("button-unclickable");
        finishButton.classList.add("button-clickable");
    }
    addPlusSign();
}
var addTimeSlotListener = (e: Event) => {addTimeSlot(e)};

function handlePlusSignClick(e: Event) {
    let timeslot = e.currentTarget as HTMLDivElement;
    let plus = timeslot.firstChild as HTMLDivElement;
    plus.remove();
    let card = timeslot.firstChild as HTMLDivElement;
    card.classList.remove("hide");
    timeslot.removeEventListener("click", handlePlusSignClickListener);
    card.lastChild.addEventListener("click", addTimeSlotListener);
}

var handlePlusSignClickListener = (e: Event)=> {handlePlusSignClick(e)};

function addPlusSign() {
    let newSlot = newTimeslot.cloneNode(true) as HTMLDivElement;
    newSlot.id = timeSlotID.toString();
    timeSlotID++;
    document.querySelector("div.calendar-content-main").append(newSlot);
    newSlot.addEventListener("click", handlePlusSignClickListener)
}

function handleNameInput() {
    collectedData.name = nameInput.value;
    if(nameInput.value != "" && !nameGiven) {
        activeButton.addEventListener("click", listener);
        activeButton.classList.add("button-clickable");
        activeButton.classList.remove("button-unclickable");
        nameGiven = true;
    } else if (nameInput.value == "" && nameGiven) {
        activeButton.removeEventListener("click", listener);
        activeButton.classList.add("button-unclickable");
        activeButton.classList.remove("button-clickable");
        nameGiven = false;
    }
}

window.onload = () => {
    divs[0] = document.querySelector("div.create-new-appointment-content") as HTMLDivElement;
    divs[1] = document.querySelector("div.options-content") as HTMLDivElement;
    divs[2] = document.querySelector("div.calendar-content") as HTMLDivElement;
    mainBox = document.querySelector("div.main-box") as HTMLDivElement;
    activeButton = document.querySelector("div.create-new-appointment-content button") as HTMLButtonElement;
    document.querySelector("div.calendar-bottom-buttons .button-back").addEventListener("click", () => {goTo(1)});
    nameInput = document.querySelector("div.create-new-appointment-content input") as HTMLInputElement;
    locationInput = document.querySelector("div.options-content input[name = 'location']") as HTMLInputElement;
    descriptionInput = document.querySelector("div.options-content input[name = 'description']") as HTMLInputElement;
    setInterval(handleNameInput, 100);
    let inputs = document.getElementsByTagName("input") as HTMLCollectionOf<HTMLInputElement>;
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = "";
    }
    addPlusSign();
}