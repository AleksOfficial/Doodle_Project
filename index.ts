interface AppointmentDate {
    a_start_time: string;
    a_end_time: string;
}

interface AppointmentData {
    a_title: string;
    a_location: string;
    a_description: string;
    a_creator_name: string;
    a_creator_email: string;
    a_end_date: string;
    timeslots: AppointmentDate[];
}

var collectedData: AppointmentData = {
    a_title: "",
    a_location: "",
    a_description: "",
    a_creator_name: "",
    a_creator_email: "",
    a_end_date: null,
    timeslots: []
}
var divs: HTMLDivElement[] = [];
var mainBox: HTMLDivElement;
var nameInput: HTMLInputElement;
var locationInput: HTMLInputElement;
var descriptionInput: HTMLInputElement;
var nameGiven: boolean = false;
var nameAndEndTimeGiven: boolean = false;
var activeButton: HTMLButtonElement;
var creatorNameInput: HTMLInputElement;
var creatorEmailInput: HTMLInputElement;
var creatorGiven = false;
var voterNameInput: HTMLInputElement;
var voterGiven = false;
var endTimeInput: HTMLInputElement;
var endTimeHourInput: HTMLSelectElement;

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
var newTimeSlotFinishedSlot = document.createElement("div") as HTMLDivElement;
newTimeSlotFinishedSlot.append(document.createElement("div"));
newTimeSlotFinishedSlot.append(document.createElement("div"));
newTimeSlotFinishedSlot.classList.add("timeslot-finished", "hide", "fade-in");
newTimeslot.append(newTimeSlotFinishedSlot);
var timeSlotID: number = 0;
var intervalFunction;

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
        clearInterval(intervalFunction);
        mainBox.classList.remove("main-box-full");
        mainBox.classList.add("main-box-large");
        nameInput = document.querySelector("div.options-content input[name = 'name']") as HTMLInputElement;
        nameInput.value = collectedData.a_title;
        listener = () => {goTo(2)};
        activeButton = document.querySelector("div.options-content-main button") as HTMLButtonElement;
        intervalFunction = setInterval(handleOptionInput, 100);
    }
    if (page == 2) {
        clearInterval(intervalFunction);
        mainBox.classList.remove("main-box-large");
        mainBox.classList.add("main-box-full");
        collectedData.a_location = locationInput.value;
        collectedData.a_description = descriptionInput.value;
        document.querySelector(".calendar-header-tags .calendar-header-name").append(collectedData.a_title);
        document.querySelector(".calendar-header-tags .calendar-header-location").append(collectedData.a_location);
        document.querySelector(".calendar-header-tags .calendar-header-description").append(collectedData.a_description);
    }
    if (page == 3) {
        clearInterval(intervalFunction);
        listener = () => {goTo(4)};
        activeButton = document.querySelector("div.creator-bottom-buttons .button-forward") as HTMLButtonElement;
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
        mainBox.classList.remove("main-box-large");
        mainBox.classList.add("main-box-full");
        activeButton = document.querySelector("div.appointment-content-main-submit button");
        let params = new URLSearchParams(location.search);
        ajaxPullAppointment(params.get("x"));
    }
}

function addTimeSlot(e: Event) {
    let addButton = e.target as HTMLButtonElement;
    let startDate = (addButton.parentElement.children[0].firstChild as HTMLInputElement).value
                            + " " + (addButton.parentElement.children[0].children[1] as HTMLSelectElement).value;
    let endDate = (addButton.parentElement.children[1].firstChild as HTMLInputElement).value
                            + " " + (addButton.parentElement.children[1].children[1] as HTMLSelectElement).value;
    let finishedTimeSlot = addButton.parentElement.parentElement.lastChild as HTMLDivElement;
    finishedTimeSlot.classList.remove("hide");
    /*let startString: string = startDate.getDate() + "." + (startDate.getMonth()+1) + "." + startDate.getFullYear() + " " 
                + (startDate.getHours() < 10 ? "0" : "")+ startDate.getHours() + ":" + (startDate.getMinutes() < 10 ? "0" : "") 
                + startDate.getMinutes();
    let endString: string = endDate.getDate() + "." + (endDate.getMonth()+1) + "." + endDate.getFullYear()
                + " " + (endDate.getHours() < 10 ? "0" : "") + endDate.getHours() + ":" + (endDate.getMinutes() < 10 ? "0" : "")
                + endDate.getMinutes();*/
    finishedTimeSlot.children[0].append(document.createTextNode(startDate));
    finishedTimeSlot.children[1].append(document.createTextNode(endDate));
    collectedData.timeslots.push({a_start_time: startDate, a_end_time: endDate});
    alert(collectedData.timeslots[0].a_end_time);
    addButton.parentElement.remove();
    if(timeSlotID == 1) {
        let nextButton = document.querySelector(".calendar-bottom-buttons .button-unclickable") as HTMLButtonElement;
        nextButton.classList.remove("button-unclickable");
        nextButton.classList.add("button-clickable");
        nextButton.addEventListener("click", () => {goTo(3)});
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
    collectedData.a_title = nameInput.value;
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

function handleCreatorInput() {
    collectedData.a_creator_email = creatorEmailInput.value;
    collectedData.a_creator_name = creatorNameInput.value;
    if(creatorNameInput.value != "" && creatorEmailInput.value != "" && !creatorGiven) {
        activeButton.addEventListener("click", listener);
        activeButton.classList.add("button-clickable");
        activeButton.classList.remove("button-unclickable");
        creatorGiven = true;
    } else if ((creatorNameInput.value == "" || creatorEmailInput.value == "") && creatorGiven) {
        activeButton.removeEventListener("click", listener);
        activeButton.classList.add("button-unclickable");
        activeButton.classList.remove("button-clickable");
        creatorGiven = false;
    }
}

var numberOfVotes = 0;
function voteListener(e: Event) {
    let target = e.target as HTMLInputElement;
    if (target.checked == true) {
        numberOfVotes++;
    } else {
        numberOfVotes--;
    }
}

function handleVoteInput() {
    if(voterNameInput.value != "" && numberOfVotes > 0 && !voterGiven) {
        activeButton.addEventListener("click", listener);
        activeButton.classList.add("button-clickable");
        activeButton.classList.remove("button-unclickable");
        voterGiven = true;
    } else if ((voterNameInput.value == "" || numberOfVotes <= 0) && voterGiven) {
        activeButton.removeEventListener("click", listener);
        activeButton.classList.add("button-unclickable");
        activeButton.classList.remove("button-clickable");
        voterGiven = false;
    }
}

function handleOptionInput() {
    collectedData.a_end_date = endTimeInput.value + " " + endTimeHourInput.value;
    console.log(collectedData.a_end_date);
    if(nameInput.value != "" && endTimeInput.value != "" && !nameAndEndTimeGiven) {
        activeButton.addEventListener("click", listener);
        activeButton.classList.add("button-clickable");
        activeButton.classList.remove("button-unclickable");
        nameAndEndTimeGiven = true;
    } else if ((nameInput.value == "" || endTimeInput.value == "") && nameAndEndTimeGiven) {
        activeButton.removeEventListener("click", listener);
        activeButton.classList.add("button-unclickable");
        activeButton.classList.remove("button-clickable");
        nameAndEndTimeGiven = false;
    }
}

function ajaxPullAppointment(link: string) {
    $.ajax({
        type: "get",
        url: "backend/scripts/api.php",
        dataType: "json",
        data: {baselink:link},
        success: function(data: AppointmentData) {
            let headline = document.createElement("h1");
            headline.append(document.createTextNode(data.a_title));
            document.querySelector("div.appointment-content header").append(headline);
            let vote = document.querySelector("div.appointment-content-main-vote");
            for (let i = 0; i < data.timeslots.length; i++) {
                let timeslot = newTimeSlotFinishedSlot.cloneNode(true) as HTMLDivElement;
                timeslot.classList.remove("hide");
                let start = timeslot.firstChild as HTMLDivElement;
                start.append(document.createTextNode(data.timeslots[i].a_start_time.toString()));
                let end = timeslot.children[1] as HTMLDivElement;
                end.append(document.createTextNode(data.timeslots[i].a_end_time.toString()));
                let checkbox = document.createElement("input") as HTMLInputElement;
                checkbox.setAttribute("type", "checkbox");
                checkbox.addEventListener("click", voteListener);
                let checkboxDiv = document.createElement("div") as HTMLDivElement;
                checkboxDiv.classList.add("appointment-checkbox");
                checkboxDiv.append(checkbox);
                timeslot.append(checkboxDiv);
                vote.append(timeslot);
            }

        },
        error: function(xhr, textStatus, errorThrown) {
            let appointment = document.querySelector("div.appointment-content-main") as HTMLDivElement;
            appointment.innerHTML = xhr.responseText;
        }
    });
}

interface HashData {
    a_baselink: string;
}

function ajaxPushAppointment(appointment: AppointmentData) {
    $.ajax({
        type: "post",
        url: "backend/scripts/api.php",
        dataType: "json",
        data: appointment,
        success: function(data: HashData) {
            alert("Success");
            console.log(data);
            history.replaceState({}, "", "?x=" + data.a_baselink);
            goTo(5);
        },
        error: function(xhr, textStatus, errorThrown) {
            let loading = document.querySelector("div.loading-content") as HTMLDivElement;
            loading.innerHTML = xhr.responseText;
        }
    });
}

window.onload = () => {
    divs[0] = document.querySelector("div.create-new-appointment-content") as HTMLDivElement;
    divs[1] = document.querySelector("div.options-content") as HTMLDivElement;
    divs[2] = document.querySelector("div.calendar-content") as HTMLDivElement;
    divs[3] = document.querySelector("div.creator-content") as HTMLDivElement;
    divs[4] = document.querySelector("div.loading-content") as HTMLDivElement;
    divs[5] = document.querySelector("div.appointment-content") as HTMLDivElement;
    let endTimeDiv = document.querySelector("div.options-content-end-time") as HTMLDivElement;
    endTimeInput = newTimeSlotCalendarInput.cloneNode(true) as HTMLInputElement;
    endTimeDiv.append(endTimeInput);
    endTimeHourInput = newTimeSelect.cloneNode(true) as HTMLSelectElement;
    endTimeDiv.append(endTimeHourInput);
    mainBox = document.querySelector("div.main-box") as HTMLDivElement;
    activeButton = document.querySelector("div.create-new-appointment-content button") as HTMLButtonElement;
    document.querySelector("div.calendar-bottom-buttons .button-back").addEventListener("click", () => {goTo(1)});
    document.querySelector("div.creator-bottom-buttons .button-back").addEventListener("click", () => {goTo(2)});
    nameInput = document.querySelector("div.create-new-appointment-content input") as HTMLInputElement;
    locationInput = document.querySelector("div.options-content input[name = 'location']") as HTMLInputElement;
    descriptionInput = document.querySelector("div.options-content input[name = 'description']") as HTMLInputElement;
    creatorNameInput = document.querySelector("div.creator-content input[name = 'creatorName']") as HTMLInputElement;
    creatorEmailInput = document.querySelector("div.creator-content input[name = 'creatorEmail']") as HTMLInputElement;
    voterNameInput = document.querySelector("div.appointment-content-main-submit input");
    intervalFunction = setInterval(handleNameInput, 100);
    let inputs = document.getElementsByTagName("input") as HTMLCollectionOf<HTMLInputElement>;
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = "";
    }
    addPlusSign();
    let params = new URLSearchParams(location.search);
    if (params.get("x") != null) {
        goTo(5);
    }
}