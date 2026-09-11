/* =====================================================
   NEXORA RIDE
   SMART COLLEGE BUS
   JAVASCRIPT
   ===================================================== */


/* ================= VARIABLES ================= */

let selectedBus = "BUS-04";
let selectedSeat = null;

let currentBooking = {
    date: "",
    bus: "",
    seat: "",
    amount: 25
};


/* ================= START ================= */

document.addEventListener("DOMContentLoaded", () => {

    setDefaultDate();

    generateSeats();

    loadBookings();

});


/* ================= DATE ================= */

function setDefaultDate() {

    const dateInput = document.getElementById("travelDate");

    if (!dateInput) return;

    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, "0");

    const day = String(today.getDate()).padStart(2, "0");

    dateInput.value = `${year}-${month}-${day}`;

    dateInput.min = `${year}-${month}-${day}`;

}


/* ================= SEAT GENERATION ================= */

function generateSeats() {

    const container = document.getElementById("seatContainer");

    if (!container) return;

    container.innerHTML = "";

    /*
       40 seats
       Some seats are already occupied
       to make the prototype look realistic.
    */

    const occupiedSeats = [
        2, 5, 9, 14, 18, 21, 27, 31, 35, 39
    ];

    for (let i = 1; i <= 40; i++) {

        const seat = document.createElement("button");

        seat.classList.add("seat");

        seat.textContent = i;

        /*
           Occupied seat
        */

        if (occupiedSeats.includes(i)) {

            seat.classList.add("occupied");

            seat.disabled = true;

        } else {

            seat.addEventListener("click", () => {

                selectSeat(i, seat);

            });

        }

        container.appendChild(seat);

    }

}


/* ================= SELECT SEAT ================= */

function selectSeat(number, element) {

    /*
       Remove previous selection
    */

    document.querySelectorAll(".seat.selected")
        .forEach(seat => {
            seat.classList.remove("selected");
        });


    /*
       Select new seat
    */

    element.classList.add("selected");

    selectedSeat = number;


    /*
       Update summary
    */

    document.getElementById("selectedSeat").textContent =
        `Seat ${number}`;

}


/* ================= SELECT BUS ================= */

function selectBus(button, busName) {

    /*
       Remove active state
    */

    document.querySelectorAll(".bus-option")
        .forEach(option => {
            option.classList.remove("active");
        });


    /*
       Activate selected bus
    */

    button.classList.add("active");

    selectedBus = busName;


    /*
       Update summary
    */

    document.getElementById("selectedBus").textContent =
        busName;


    /*
       Reset selected seat
       because different buses have different
       seat availability.
    */

    selectedSeat = null;

    document.getElementById("selectedSeat").textContent =
        "None";


    generateSeats();

}


/* ================= SCROLL TO BOOKING ================= */

function scrollToBooking() {

    const section = document.getElementById("booking");

    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });

    }

}


/* ================= CONFIRM BOOKING ================= */

function confirmBooking() {

    const dateInput = document.getElementById("travelDate");

    const date = dateInput.value;


    /*
       Validation
    */

    if (!date) {

        alert("Please select a travel date.");

        return;

    }


    if (!selectedSeat) {

        alert("Please select a seat first.");

        return;

    }


    /*
       Store current booking
    */

    currentBooking.date = date;

    currentBooking.bus = selectedBus;

    currentBooking.seat = selectedSeat;


    /*
       Update payment page
    */

    document.getElementById("paymentDate").textContent =
        formatDate(date);

    document.getElementById("paymentBus").textContent =
        selectedBus;

    document.getElementById("paymentSeat").textContent =
        `Seat ${selectedSeat}`;


    /*
       Show payment section
    */

    showSection("payment");

}


/* ================= PAYMENT ================= */

function processPayment() {

    const paymentButton =
        document.querySelector("#payment .primary-btn");

    paymentButton.textContent =
        "PROCESSING...";

    paymentButton.disabled = true;


    /*
       Simulate payment processing
    */

    setTimeout(() => {

        paymentButton.textContent =
            "PAYMENT SUCCESSFUL ✓";


        /*
           Show verification after payment
        */

        setTimeout(() => {

            showSection("verification");

        }, 800);

    }, 1500);

}


/* ================= ID VERIFICATION ================= */

function verifyID() {

    const button =
        document.querySelector("#verification .primary-btn");

    const status =
        document.querySelector(".scanner strong");


    button.textContent =
        "SCANNING...";

    button.disabled = true;

    status.textContent =
        "VERIFYING STUDENT ID...";


    /*
       Simulated scanner
    */

    setTimeout(() => {

        status.textContent =
            "STUDENT ID VERIFIED ✓";

        status.style.color =
            "#d4af37";


        setTimeout(() => {

            showSuccess();

        }, 900);

    }, 1800);

}


/* ================= SUCCESS ================= */

function showSuccess() {

    /*
       Fill ticket information
    */

    document.getElementById("successBus").textContent =
        currentBooking.bus;

    document.getElementById("successSeat").textContent =
        `Seat ${currentBooking.seat}`;

    document.getElementById("successDate").textContent =
        formatDate(currentBooking.date);


    /*
       Show success section
    */

    showSection("success");

}


/* ================= SAVE BOOKING ================= */

function saveBooking() {

    let bookings =
        JSON.parse(localStorage.getItem("nexoraBookings")) || [];


    /*
       Create booking object
    */

    const booking = {

        id: Date.now(),

        date: currentBooking.date,

        bus: currentBooking.bus,

        seat: currentBooking.seat,

        amount: currentBooking.amount,

        status: "CONFIRMED"

    };


    /*
       Save booking
    */

    bookings.push(booking);

    localStorage.setItem(
        "nexoraBookings",
        JSON.stringify(bookings)
    );


    /*
       Update history
    */

    loadBookings();


    /*
       Go to booking history
    */

    document.getElementById("bookings")
        .scrollIntoView({
            behavior: "smooth"
        });


    alert("Booking saved successfully!");

}


/* ================= LOAD BOOKINGS ================= */

function loadBookings() {

    const container =
        document.getElementById("bookingHistory");

    if (!container) return;


    const bookings =
        JSON.parse(localStorage.getItem("nexoraBookings")) || [];


    /*
       No bookings
    */

    if (bookings.length === 0) {

        container.innerHTML = `

            <div class="empty-booking">

                <div>🚌</div>

                <p>
                    Your confirmed bookings will appear here.
                </p>

            </div>

        `;

        return;

    }


    /*
       Display bookings
    */

    container.innerHTML = "";


    bookings
        .slice()
        .reverse()
        .forEach(booking => {

            const card =
                document.createElement("div");

            card.className = "booking-history-card";


            card.innerHTML = `

                <div>

                    <small>DATE</small>

                    <strong>
                        ${formatDate(booking.date)}
                    </strong>

                </div>


                <div>

                    <small>BUS</small>

                    <strong>
                        ${booking.bus}
                    </strong>

                </div>


                <div>

                    <small>SEAT</small>

                    <strong>
                        ${booking.seat}
                    </strong>

                </div>


                <div>

                    <small>PAID</small>

                    <strong>
                        ₹${booking.amount}
                    </strong>

                </div>


                <div class="history-status">

                    ${booking.status} ✓

                </div>

            `;


            container.appendChild(card);

        });

}


/* ================= SECTION SWITCHING ================= */

function showSection(sectionId) {

    /*
       Hide payment, verification and success sections
       first.
    */

    const specialSections = [
        "payment",
        "verification",
        "success"
    ];


    specialSections.forEach(id => {

        const section =
            document.getElementById(id);

        if (section) {

            section.classList.add("hidden");

        }

    });


    /*
       Show requested section
    */

    const section =
        document.getElementById(sectionId);

    if (section) {

        section.classList.remove("hidden");

        section.scrollIntoView({
            behavior: "smooth"
        });

    }

}


/* ================= DATE FORMAT ================= */

function formatDate(dateString) {

    if (!dateString) return "--";


    const date =
        new Date(dateString + "T00:00:00");


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}