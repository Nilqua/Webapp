function calculate() {
  const name = document.getElementById("fullname").value;
  const email = document.getElementById("email").value;
  const departure = document.getElementById("departure").value;
  const destination = document.getElementById("destination").value;
  const depDate = document.getElementById("departureDate").value;
  const retDate = document.getElementById("returnDate").value;
  const passengers = parseInt(document.getElementById("passengers").value);
  const travelClass = document.getElementById("class").value;

  let pricePerPerson = 0;
  if (travelClass === "economy") pricePerPerson = 2000;
  else if (travelClass === "business") pricePerPerson = 5000;
  else if (travelClass === "first") pricePerPerson = 10000;

  const trips = retDate ? 2 : 1;
  const total = pricePerPerson * passengers * trips;

  const summaryHTML = `
    <h3 data-i18n="bookingSummary">สรุปรายการจอง</h3>
    <p><span data-i18n="name">ชื่อ-นามสกุล</span>: ${name}</p>
    <p><span data-i18n="email">อีเมล</span>: ${email}</p>
    <p><span data-i18n="path">เส้นทาง</span>: ${departure} → ${destination}</p>
    <p><span data-i18n="departureDate">วันที่ออกเดินทาง</span>: ${depDate}</p>
    ${
      retDate
        ? `<p><span data-i18n="returnDate">วันที่กลับ</span>: ${retDate}</p>`
        : ""
    }
    <p><span data-i18n="passengers">จำนวนผู้โดยสาร</span>: ${passengers}</p>
    <p><span data-i18n="class">ชั้นโดยสาร</span>: ${travelClass}</p>
    <p style="color: red"><span data-i18n="total">ราคาทั้งหมด</span>: ${total.toLocaleString()} <span data-i18n="currency">บาท</span></p>
    <button onclick="goToPaymentPage()" data-i18n="confirmBooking">ยืนยันการจอง</button>
  `;

  document.getElementById("summaryContent").innerHTML = summaryHTML;
  document.getElementById("summaryModal").style.display = "block";

  const lang = localStorage.getItem("language") || "th";
  switchLanguage(lang);
}

function closeModal() {
  document.getElementById("summaryModal").style.display = "none";
}

function confirmBooking() {
  const allBookings = JSON.parse(sessionStorage.getItem("bookings")) || [];

  // 👇 เช็คจำนวนรวมของผู้โดยสารทั้งหมด
  const totalPassengers = allBookings.reduce((sum, booking) => {
    return sum + parseInt(booking.passengers);
  }, 0);

  const newPassengers = parseInt(document.getElementById("passengers").value);

  if (totalPassengers + newPassengers > 5) {
    if (localStorage.getItem("language") === "th") {
      alert("ขออภัย ที่นั่งเต็มแล้ว หรือเกินจำนวนที่รองรับ (5 คน)");
    } else {
      alert("Sorry, the seats are full or exceed the capacity (5 people)");
    }
    closeModal();
    return;
  }

  // ถ้ายังไม่เต็ม ก็เก็บข้อมูลตามปกติ
  const bookingData = {
    name: document.getElementById("fullname").value,
    email: document.getElementById("email").value,
    departure: document.getElementById("departure").value,
    destination: document.getElementById("destination").value,
    depDate: document.getElementById("departureDate").value,
    retDate: document.getElementById("returnDate").value,
    passengers: newPassengers,
    travelClass: document.getElementById("class").value,
    timestamp: new Date().toISOString(),
  };

  allBookings.push(bookingData);
  sessionStorage.setItem("bookings", JSON.stringify(allBookings));
  if (localStorage.getItem("language") === "th") {
    alert("ขอบคุณ! การจองของคุณถูกยืนยันแล้ว");
  } else {
    alert("Thank you! Your booking has been confirmed");
  }
  document.getElementById("bookingForm").reset();
  closeModal();
}

// ปิด modal เมื่อคลิกนอกกล่อง
window.onclick = function (event) {
  const modal = document.getElementById("summaryModal");
  if (event.target === modal) {
    closeModal();
  }
};

function findflight() {
  const allBookings = JSON.parse(sessionStorage.getItem("bookings")) || [];
  const totalPassengers = allBookings.reduce(
    (sum, b) => sum + parseInt(b.passengers),
    0
  );
  const available = Math.max(0, 5 - totalPassengers);

  const find = `
    <h2 style="color : black"><span data-i18n="chooseflight">เลือกรอบบิน มีที่ว่างอยู่: </span>${available}</h2>
      <flightOptions>
        <button onclick="calculate()">
            <p>Tukky</p>
            <p>16:00 - 18:00</p>
        </button>
        <button onclick="calculate()">
            <p>Hiwo</p>
            <p>19:00 - 20:00</p>
        </button>
        <button onclick="calculate()">
            <p>Minao</p>
            <p>22:00 - 02:00</p>
        </button>
      </flightOptions>
  `;
  document.getElementById("summaryContent").innerHTML = find;
  document.getElementById("summaryModal").style.display = "block";
  const lang = localStorage.getItem("language") || "th";
  switchLanguage(lang);
}


function viewBookings() {
  const summaryContent = document.getElementById('summaryContent');
  summaryContent.innerHTML = '';

  const bookings = JSON.parse(sessionStorage.getItem("bookings")) || [];

  if (bookings.length === 0) {
    if (localStorage.getItem("language") === "th") {
      summaryContent.innerHTML = "<p>ไม่มีการจอง</p>";
    } else {
      summaryContent.innerHTML = "<p>No bookings</p>";
    }
    return;
  }

  bookings.forEach((booking, index) => {
    const ticketDiv = document.createElement('div');
    ticketDiv.className = 'ticket';
    ticketDiv.id = `ticket-${index}`;

    ticketDiv.innerHTML = `
      <p><span data-i18n="name"><strong>ชื่อ-นามสกุล:</strong></span> ${booking.name}</p>
      <p><span data-i18n="email"><strong>อีเมล:</strong></span> ${booking.email}</p>
      <p><span data-i18n="departure"><strong>ต้นทาง:</strong></span> ${booking.departure}</p>
      <p><span data-i18n="destination"><strong>ปลายทาง:</strong></span> ${booking.destination}</p>
      <p><span data-i18n="departureDate"><strong>วันที่ออกเดินทาง:</strong></span> ${booking.depDate}</p>
      <p><span data-i18n="returnDate"><strong>วันที่กลับ:</strong></span> ${booking.retDate}</p>
      <p><span data-i18n="passengers"><strong>จำนวนผู้โดยสาร:</strong></span> ${booking.passengers}</p>
      <p><span data-i18n="class"><strong>ชั้นโดยสาร:</strong></span> ${booking.travelClass}</p>
    `;

    const cancelBtn = document.createElement('button');
    if (localStorage.getItem("language") === "th") {
      cancelBtn.textContent = 'ยกเลิกการจอง';
    } else {
      cancelBtn.textContent = 'Cancel Booking';
    }
    cancelBtn.onclick = () => deleteBooking(index);

    ticketDiv.appendChild(cancelBtn);
    summaryContent.appendChild(ticketDiv);
  }
);

  // ✅ แสดง modal หลังจากแสดงรายการเสร็จ
  document.getElementById("summaryModal").style.display = "block";
  const lang = localStorage.getItem("language") || "th";
  switchLanguage(lang);
}

function deleteBooking(index) {
  const bookings = JSON.parse(sessionStorage.getItem("bookings")) || [];
  bookings.splice(index, 1); // ลบรายการที่เลือก
  sessionStorage.setItem("bookings", JSON.stringify(bookings)); // อัปเดตใหม่
  viewBookings(); // แสดงรายการใหม่หลังลบ
}

function toggleLanguage() {
  const currentLang = localStorage.getItem("language") || "th";
  const newLang = currentLang === "th" ? "en" : "th";
  switchLanguage(newLang);
}
window.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("language") || "th";
  switchLanguage(savedLang); // เรียกแปลภาษา
});

///////////////////การชำระเงิน/////////////////////////////////////////////

function goToPaymentPage() {
  const paymentHTML = `
    <h3 data-i18n="payment">เลือกวิธีการชำระเงิน</h3>
    <p>
      <input type="radio" name="payment" value="credit" checked onchange="showPaymentDetails()" data-i18n="credit"> Credit/debit<br>
      <input type="radio" name="payment" value="promptpay" data-i18n="QR" onchange="showPaymentDetails()"> PromptPay<br>
      <input data-i18n="bank" type="radio" name="payment" value="bank" onchange="showPaymentDetails()"> Bank transfer
    </p>

    <div id="paymentDetails"></div>

<div style="display: flex; justify-content: center; gap: 20px; margin-top: 20px;">
  <button data-i18n="yes" style="width: 100px;" onclick="completePayment(true)">ยืนยัน</button>
  <button data-i18n="no" style="width: 100px; background-color: red;" onclick="completePayment(false)">ยกเลิก</button>
</div>
  `;
  document.getElementById("summaryContent").innerHTML = paymentHTML;
  showPaymentDetails(); // แสดงรายละเอียดเริ่มต้น
  const lang = localStorage.getItem("language") || "th";
  switchLanguage(lang);
}
function completePayment(success) {
  if (localStorage.getItem("language") === "th") {
    if (success) {
      alert("ชำระสำเร็จ");
      confirmBooking(); // บันทึกการจองหลังจากชำระเงิน
    } else {
      alert("ชำระไม่สำเร็จ");
      closeModal();
    }
  } else {
    if (success) {
      alert("Payment completed");
      confirmBooking(); // บันทึกการจองหลังจากชำระเงิน
    } else {
      alert("Payment failed");
      closeModal();
    }
  }

  const lang = localStorage.getItem("language") || "th";
  switchLanguage(lang);
}
function showPaymentDetails() {
  const selected = document.querySelector(
    'input[name="payment"]:checked'
  ).value;
  const detailsDiv = document.getElementById("paymentDetails");

  if (selected === "credit") {
    detailsDiv.innerHTML = `
      <label data-i18n="numcredit">หมายเลขบัตรเครดิต/เดบิต:</label>
      <input type="text" placeholder="XXXX-XXXX-XXXX-XXXX" maxlength="19">
    `;
  } else if (selected === "promptpay") {
    detailsDiv.innerHTML = `
      <label data-i18n="scan">สแกน QR พร้อมเพย์:</label><br>
      <img src="img/promptpay.jpg" alt="QR PromptPay" style="width: 200px; height: auto; border-radius: 10px;">
    `;
  } else if (selected === "bank") {
    detailsDiv.innerHTML = `
      <label data-i18n="choosebank">เลือกธนาคาร:</label><br>
      <select>
        <option data-i18n="BBL">BBL - ธนาคารกรุงเทพ</option>
        <option data-i18n="KBANK">KBANK - กสิกรไทย</option>
        <option data-i18n="Other">อื่นๆ</option>
      </select>
    `;
  }
  const lang = localStorage.getItem("language") || "th";
  switchLanguage(lang);
}

