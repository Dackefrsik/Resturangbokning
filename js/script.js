/* Deltagare
Daniel Frisk - 000824
Johan Hertz - 970422 
Hannah Uhlán - 950901
 */


"use strict";
//#region Fönsterlyssnare och timer som automatiskt avbokar gästers bord efter en och en halv timme
//Simmulerar en form av riktig butik

window.addEventListener("load", () => {

   //Skapar en global timer för att kunna kolla tiden och hur länge folk har varit inne och ätit
    window.oGlobalobject = {
        timer : null,
        houers : new Date().getHours(),
        min : new Date().getMinutes(),
        sec : new Date().getSeconds()
    }

    oGlobalobject.timer = setInterval(() => {
        UpTime(oGlobalobject.houers, oGlobalobject.min, oGlobalobject.sec)
    }, 1000);
}) 


setInterval(() => {
    bookings.forEach(booking => {
        let timeSplit = booking.time.split(":");  
        if(oGlobalobject.houers > timeSplit[0] && (oGlobalobject.min - timeSplit[1] == 30 || timeSplit[1] - oGlobalobject.min == 30)){
            let index = bookings.indexOf(booking);
            if(index > -1){
                bookings.splice(index, 1);
                addBord(booking.bord);
                updateBookings();
            }
        }
    });
}, 1000);
//#endregion

//#region hämta klockslag
//Funktion som uppdaterar klockslaget varje secund när timern körs
function UpTime(houers, min, sec){
    sec += 1;
    if(sec == 60){
        min += 1;
        sec = 0;
    }
    else if(min == 60){
        min = 0;
        houers += 1;
    }
    else if(houers == 24){
        houers = 0;
    }
    let bokaModalRef = document.querySelector("#bokaModal");
    let bokaModalAriaHiddenRef = bokaModalRef.getAttribute("aria-hidden");
    let timeRef = document.querySelector("#bokaTid");
    if(bokaModalAriaHiddenRef == "true"){
/*         console.log("true");
 */        timeRef.value = houers + ":" + min;
        console.log(timeRef.value)
    }

   return oGlobalobject.houers = houers, oGlobalobject.min = min, oGlobalobject.sec = sec;
} 

//Hämtar aktuell tid och skriver ut i formuläret när modal klickas
$("#bokaModalButton").on("click", () => {
    let hrs = new Date().getHours();
    let min = new Date().getMinutes();
    $("#bokaTid").val(`${hrs}:${min}`);
});

//#endregion

//#region sökfunktioner 

//sökfilter för lista
$(document).ready(function(){
    $("#myInput").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $("#bokningsLista li").filter(function() {
        console.log($(this).find('h5').text().toLowerCase().indexOf(value) > -1);
        $(this).toggle($(this).find('h5').text().toLowerCase().indexOf(value) > -1);
        
      });
    });
  });
//Rensa sökfält och återställ lista
$(document).ready(function(){
    var $myInput = document.querySelector('#myInput');
    $("#clearButton").on('click', function(){
      $myInput.value = '';
      var value = $myInput.value.toLowerCase();
      $("#bokningsLista li").filter(function() {
        
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });
});

//#endregion

//#region klasser och listor

class Booking{
    constructor(name, phone, bord, time, guests, otherInfo){
        this.name = name;
        this.phone = phone;
        this.bord = bord;
        this.time = time;
        this.guests = guests;
        this.otherInfo = otherInfo;

        this.timeMins = function(){
            let bookingHours = parseInt(this.time.split(":")[0]);
            let bookingMinutes = parseInt(this.time.split(":")[1]);
            return bookingHours * 60 + bookingMinutes;
        }
    }
}

//array för att lagra bokningar
let bookings = [];
let ledigaBord = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
$(document).ready(function(){
    //Lägg till bord i select
    UppdateraBord();
});

class Queue{
    constructor(name, phone, time, guests){
        this.name = name;
        this.phone = phone;
        this.time = time;
        this.guests = guests;

        this.timeMins = function(){
            let bookingHours = parseInt(this.time.split(":")[0]);
            let bookingMinutes = parseInt(this.time.split(":")[1]);
            return bookingHours * 60 + bookingMinutes;
        }
    }
}

let Queues = [];

//#endregion

//#region funktiioner för bord
//Uppdatera lediga bord
function UppdateraBord(){
    let select = document.querySelector("#bokaBord");
    select.innerHTML = "";
    ledigaBord.sort(function(a,b){return a-b});
    
    ledigaBord.forEach(bord => {
        let option = document.createElement("option");
        option.value = bord;
        option.text = `Bord ${bord}`;
        select.appendChild(option);
    });
}

//Ta bort bord från lediga bord
function taBortBord(bord){
    //console.log(bord);
    let index = ledigaBord.indexOf(parseInt(bord));
    if(index > -1){
        ledigaBord.splice(index, 1);
    }
    //console.log(ledigaBord);
    UppdateraBord();
}

function addBord(bord){
    ledigaBord.push(bord);
    UppdateraBord();
}
//#endregion

//#region uppdatera bokning
//Uppdatera bokningar
function updateBookings(){

    let bookingList = document.querySelector("#bokningsLista");

    //Rensa listan
    bookingList.innerHTML = "";

    //Lägg till bokningar i listan
    bookings.forEach(booking => {

        

        //rensar bord
        taBortBord(booking.bord);

        //Skapar list item
        const li = document.createElement("li");
        li.classList.add("list-group-item");

        //Lägger till data-time attribut
        li.setAttribute("data-time", booking.timeMins());

        //skapar en wrapper för allt innehåll i li, filter toggle fungerade ej på d-flex
        const liWrapper = document.createElement("div");
        liWrapper.classList.add("d-flex", "justify-content-between", "align-items-center");


        //#region Lägger till text
        const flexDiv = document.createElement("div");
        
        const h4 = document.createElement("h4");
        h4.innerHTML = `Bord : ${booking.bord}`;
        flexDiv.appendChild(h4);
        const h5 = document.createElement("h5");
        h5.innerHTML = `Namn : ${booking.name}`;
        flexDiv.appendChild(h5);
        const p1 = document.createElement("p");
        p1.innerHTML = `Telefon : ${booking.phone}`;
        flexDiv.appendChild(p1);
        const p2 = document.createElement("p");
        p2.innerHTML = `Tid : ${booking.time}`;
        flexDiv.appendChild(p2);
        const p3 = document.createElement("p");
        p3.innerHTML = `Antal gäster : ${booking.guests}`;
        flexDiv.appendChild(p3);
        flexDiv.childNodes.forEach(child => {
            child.style.margin = "0px";
            child.style.padding = "0px";
        });
        liWrapper.appendChild(flexDiv);
        li.appendChild(liWrapper);
        //#endregion

        //#region Lägger till knapper

        //Skapar div för knappar
        const knapparDiv = document.createElement("div");
        knapparDiv.classList.add("d-flex", 'flex-column', 'gap-2');

        //Avboka-knapp
        const avbokaButton = document.createElement("button");
        avbokaButton.classList.add("btn", "btn-danger");
        avbokaButton.innerHTML = "Avboka";
        avbokaButton.addEventListener("click", () => {
            let index = bookings.indexOf(booking);
            if(index > -1){
                bookings.splice(index, 1);
                addBord(booking.bord);
                updateBookings();
            }
        });
        knapparDiv.appendChild(avbokaButton);

        //Omboka-knapp
        const ombokaButton = document.createElement("button");
        ombokaButton.classList.add("btn", "btn-secondary");
        ombokaButton.setAttribute("data-bs-toggle", "modal");
        ombokaButton.setAttribute("data-bs-target", "#OmbokaModal");
        ombokaButton.innerHTML = "Omboka";
        knapparDiv.appendChild(ombokaButton);

        liWrapper.appendChild(knapparDiv);
        //#endregion

        bookingList.appendChild(li);
        
        
        ombokaButton.addEventListener("click", () => {
            let ombokaNameRef = document.querySelector("#ombokaName");
            let ombokaPhoneRef = document.querySelector("#ombokaPhone");
            let ombokaTidRef = document.querySelector("#ombokaTid");
            let ombokaTableRef = document.querySelector("#ombokaTable");
            let ombokaOvrigtRef = document.querySelector("#ombokaOvrigt");

            ombokaTableRef.innerHTML = " ";

            ledigaBord.forEach(bord => {
                let optionRef = document.createElement("option");
                optionRef.value = bord;
                optionRef.text = `Bord ${bord}`;
                ombokaTableRef.appendChild(optionRef);
            })

            let optionRef = document.createElement("option");
            optionRef.value = booking.bord;
            optionRef.text = `Bord ${booking.bord}`;
            ombokaTableRef.appendChild(optionRef);

            ombokaNameRef.value = booking.name;
            ombokaPhoneRef.value = booking.phone;
            ombokaTidRef.value = booking.time;
            ombokaTableRef.value = booking.bord;
            ombokaOvrigtRef.value = booking.otherInfo;

            let ombokaButtonRef = document.querySelector(".ombokaBtn");
            ombokaButtonRef.addEventListener("click", () => {

                addBord(booking.bord);

                booking.name = ombokaNameRef.value;
                booking.phone = ombokaPhoneRef.value;
                booking.time = ombokaTidRef.value;
                booking.bord = ombokaTableRef.value;
                booking.otherInfo = ombokaOvrigtRef.value;

                h4.innerHTML = `Bord : ${booking.bord}`;
                h5.innerHTML = `Namn : ${booking.name}`;
                p1.innerHTML = `Telefon : ${booking.phone}`;
                p2.innerHTML = `Tid : ${booking.time}`;
                p3.innerHTML = `Antal gäster : ${booking.guests}`;

                taBortBord(booking.bord);
            });
            console.log(document.querySelectorAll(".bokaBordButton"))
            uppdateraKnappar();
        })
    });
    
    uppdateraKnappar();
}
//#endregion

//#region bokning-submit
//Skicka bokning
$("#bookingForm").submit(function(event){
    event.preventDefault();
   
    let form = document.querySelector("#bookingForm");
    if (!form.checkValidity()){
        console.log('Formuläret är inte korrekt ifyllt');
        form.classList.add('was-validated')
        
        return;
    }
    //återställ validering
    form.classList.remove('was-validated');

    let name = $("#bokaNamn").val();
    let phone = $("#bokaTelefon").val();
    let bord = $("#bokaBord").val();
    let time = $("#bokaTid").val();
    let guests = $("#bokaGaster").val();
    let otherInfo = $("#bokaOvrigt").val();

    //Skapa ny bokning
    let booking = new Booking(name, phone, bord, time, guests, otherInfo);
    console.log(booking);
    
    //Rensa formulär
    $("#bookingForm").trigger("reset");

    //Lägg till bokning i array
    bookings.push(booking);

    //Uppdatera bokningar
    updateBookings();
    sorteraLista();
    filtreraLista();

    //dismiss modal
    $("#bokaModal").modal("hide");
});
//#endregion

//#region funktioer för att filtera och sortera lista
//Filtera bokningar på tid
$(document).ready(function(){
    //Lyssnare för att filtrera bokningar på tid
    $(".form-check-input").on("change", function(){      
        filtreraLista();     
    });
});

function filtreraLista(){
    //Hämtar aktuell tid i minuter
    var hours = new Date().getHours();
    var minutes = new Date().getMinutes();
    var totalMinutes = hours * 60 + minutes;
    
    var aktiva = $("#aktivaCheckbox").prop("checked");
    var kommande = $("#kommandeCheckbox").prop("checked");
    $("#bokningsLista li").filter(function() {
        //Hämtar li elementets data-time attribut
        if(aktiva && !kommande){
            $(this).toggle($(this).data("time") <= totalMinutes);
        } else if(!aktiva && kommande){
            $(this).toggle($(this).data("time") > totalMinutes);
        } else if(aktiva && kommande){
            $(this).toggle(true);
        } else{
            $(this).toggle(false);
        }
        //Visar alla bokningar
        
    });
}

//Sortera lista via select - kan för tillfället sortera på namn, tid och bordsnummer
$(document).ready(() =>{
    $('#sortSelect').on('change', () => {
        console.log($('#sortSelect').val());
        sorteraLista();
    });
});

$(document).ready(() =>{
    $("input[name='sorteraRadio']").on('change', () => {
        sorteraLista();
    });
});

//TODO - Lägg till möjlighet att ändra riktning på sortering
function sorteraLista(){

    var radioValue = $("input[name='sorteraRadio']:checked").val();
    console.log(radioValue)

    if($('#sortSelect').val() == 'Namn'){
        if(radioValue == 'upp'){
            bookings.sort((a, b) => a.name.localeCompare(b.name));
        } else if(radioValue == 'ner'){
            bookings.sort((a, b) => b.name.localeCompare(a.name));
        }
        
    }
    if($('#sortSelect').val() == 'Tid'){
        if(radioValue == 'upp'){
            bookings.sort((a, b) => a.timeMins() - b.timeMins());
        } else if(radioValue == 'ner'){
            bookings.sort((a, b) => b.timeMins() - a.timeMins());
        }
        
    }
    if($('#sortSelect').val() == 'Bordsnummer'){
        if(radioValue == 'upp'){
            bookings.sort((a, b) => a.bord - b.bord);
            console.log(bookings);
        }
        else if(radioValue == 'ner'){
            bookings.sort((a, b) => b.bord - a.bord);
        }
        
    };
    updateBookings();

};
//TODO - Lägg till möjlighet att ändra riktning på sortering
//TODO - filter för "kommande-checkbox", ev. byta ut checkbox till radiobuttons"


//#endregion

//#region funktioner för att hantera kö

//Lyssnare för att lägga till i kö
let addToQueueRef = document.querySelector("#addToQueue");
addToQueueRef.addEventListener("click", (event) => {
    event.preventDefault();

    //Validera formulär även vid kö
    let form = document.querySelector("#bookingForm");
    if (!form.checkValidity()){
        console.log('Formuläret är inte korrekt ifyllt');
        form.classList.add('was-validated')
        
        return;
    }
    //återställ validering
    form.classList.remove('was-validated');
    $("#bokaModal").modal("hide");
    
    let name = $("#bokaNamn").val();
    let phone = $("#bokaTelefon").val();
    let time = $("#bokaTid").val();
    let guests = $("#bokaGaster").val();
    
    let queue = new Queue(name, phone, time, guests);
    Queues.push(queue);
    displayQueue();

    //stänger modal här istället
    $("#bookingForm").trigger("reset");
    
})

//visar kö
function displayQueue(){
    let queueList = document.querySelector("#QueueList");

    //Rensa listan
    queueList.innerHTML = "";

    //Lägg till bokningar i listan
    Queues.forEach(queue => {
        //Skapar list item
        const li = document.createElement("li");
        li.classList.add("list-group-item");

        //Lägger till data-time attribut
        li.setAttribute("data-time", queue.timeMins());

        //skapar en wrapper för allt innehåll i li, filter toggle fungerade ej på d-flex
        const liWrapper = document.createElement("div");
        liWrapper.classList.add("d-flex", "justify-content-between", "align-items-center");


        //#region Lägger till text
        const flexDiv = document.createElement("div");

        const h5 = document.createElement("h5");
        h5.innerHTML = `Namn : ${queue.name}`;
        flexDiv.appendChild(h5);
        const p1 = document.createElement("p");
        p1.innerHTML = `Telefon : ${queue.phone}`;
        flexDiv.appendChild(p1);
        const p2 = document.createElement("p");
        p2.innerHTML = `Tid : ${queue.time}`;
        flexDiv.appendChild(p2);
        const p3 = document.createElement("p");
        p3.innerHTML = `Antal gäster : ${queue.guests}`;
        flexDiv.appendChild(p3);
        flexDiv.childNodes.forEach(child => {
            child.style.margin = "0px";
            child.style.padding = "0px";
        });
        liWrapper.appendChild(flexDiv);
        li.appendChild(liWrapper);
        //#endregion

        //#region Lägger till knapper

        //Skapar div för knappar
        const knapparDiv = document.createElement("div");
        knapparDiv.classList.add("d-flex", 'flex-column', 'gap-2');

        //Avboka-knapp
        const removeButton = document.createElement("button");
        removeButton.classList.add("btn", "btn-danger");
        removeButton.innerHTML = "Ta bort";
        removeButton.addEventListener("click", () => {
            let index = Queues.indexOf(queue);
            if(index > -1){
                Queues.splice(index, 1);
                displayQueue();
            }
        });
        knapparDiv.appendChild(removeButton);

        //Omboka-knapp
        const bokaButton = document.createElement("button");
        bokaButton.classList.add("btn", "btn-primary", "bokaBordButton");
        bokaButton.setAttribute("data-bs-toggle", "modal");
        bokaButton.setAttribute("data-bs-target", "#bokaModal");
        bokaButton.innerHTML = "Boka Bord";

        bokaButton.addEventListener("click", () => {
            $("#bokaNamn").val(queue.name);
            $("#bokaTelefon").val(queue.phone);
            $("#bokaGaster").val(queue.guests);
            $("#bokaTid").val(queue.time);

            let index = Queues.indexOf(queue);
            if(index > -1){
                Queues.splice(index, 1);
                displayQueue();
            }
        })

        knapparDiv.appendChild(bokaButton);

        liWrapper.appendChild(knapparDiv);
        //#endregion

        queueList.appendChild(li);

        $("#bookingForm").trigger("reset");
    })
    uppdateraKnappar();
}
//#endregion

//#region  uppdatera knappar
function uppdateraKnappar(){
    if(ledigaBord.length == 0){
        document.querySelector('#bokaButton').classList.add('d-none');
        document.querySelector('#fullBokatDiv').classList.remove('d-none');
        document.querySelectorAll('.bokaBordButton').forEach(button => {
            button.classList.add('d-none');
        });
    } else {
        document.querySelector('#bokaButton').classList.remove('d-none');  
        document.querySelector('#fullBokatDiv').classList.add('d-none');
        document.querySelectorAll('.bokaBordButton').forEach(button => {
            button.classList.remove('d-none');
        });
    }
}
//#endregion