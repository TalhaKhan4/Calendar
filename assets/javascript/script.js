(function () {
  "use strict";

  // *** Variables ***

  const date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth();

  const weekDaysNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const monthDaysCount = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // *** DOM Elements ***

  const monthYearDisplay = document.querySelector(".calendar-head-month-year");
  const timeDisplay = document.querySelector(".calendar-head-time");
  const leftArrow = document.querySelector(".left-arrow");
  const rightArrow = document.querySelector(".right-arrow");

  // *** Functions ***

  function displayTime() {
    const currentDate = new Date();

    // converting Hrs to 12 hr format
    let currentHrs = currentDate.getHours();

    if (currentHrs > 12) currentHrs -= 12;
    else if (currentHrs === 0) currentHrs = 12;

    if (currentHrs < 10) currentHrs = "0" + currentHrs;

    // mins
    let currentMins = currentDate.getMinutes();
    if (currentMins < 10) currentMins = "0" + currentMins;

    // Displaying Time
    timeDisplay.textContent = `${currentHrs}:${currentMins} ${
      currentDate.getHours() < 12 ? "AM" : "PM"
    }`;
  }

  function displayMonthYear() {
    const monthNames = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];

    monthYearDisplay.innerHTML = `${monthNames[month]} &nbsp;${year}`;
  }

  // ------------------------------------------------------------------------------------------

  function addOneRow() {
    const calendarRow = document.querySelector(
      ".calendar-main-dates div"
    ).outerHTML;
    document.querySelector(".calendar-main-dates").innerHTML += calendarRow;
  }

  function removeLastRow() {
    document.querySelector(".calendar-main-dates").lastElementChild.remove();
  }

  function addRemoveCalendarRow(monthFirstDayName) {
    const calendarRowsCount = document.querySelectorAll(
      ".calendar-main-dates div"
    ).length;

    const condition =
      (monthDaysCount[month] === 30 && monthFirstDayName === "Sat") ||
      (monthDaysCount[month] === 31 &&
        (monthFirstDayName === "Fri" || monthFirstDayName === "Sat"));

    if (condition && calendarRowsCount === 5) {
      addOneRow();
    } else if (!condition && calendarRowsCount === 6) {
      removeLastRow();
    }
  }

  function checkLeapYear() {
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)
      monthDaysCount[1] = 29;
    else monthDaysCount[1] = 28;
  }

  function displayPrevMonthDates(monthFirstDayIndex, datesDisplay) {
    const preMonthDates = [];
    let preMonth = month - 1;
    if (preMonth === -1) preMonth = 11;

    let i = monthDaysCount[preMonth] - (monthFirstDayIndex - 1);

    for (; i <= monthDaysCount[preMonth]; i++) {
      preMonthDates.push(i);
    }

    preMonthDates.forEach(function (date, i) {
      datesDisplay[i].textContent = date;
      datesDisplay[i].classList.add("opacity-low");
    });
  }

  function displayCurrentMonthDates(monthFirstDayIndex, datesDisplay) {
    for (let i = 1; i <= monthDaysCount[month]; i++) {
      datesDisplay[monthFirstDayIndex + i - 1].textContent = i;
    }
  }

  function displayNextMonthDates(nextMonthDatesCount, datesDisplay) {
    datesDisplay.slice(-nextMonthDatesCount).forEach(function (ele, i) {
      ele.textContent = i + 1;
      ele.classList.add("opacity-low");
    });
  }

  function displayCalendar() {
    checkLeapYear();

    const monthFirstDayName = String(new Date(`${month + 1}/1/${year}`)).slice(
      0,
      3
    );

    addRemoveCalendarRow(monthFirstDayName);

    const monthFirstDayIndex = weekDaysNames.indexOf(monthFirstDayName);

    const datesDisplay = Array.from(
      document.querySelectorAll(".calendar-main-dates span")
    );

    if (monthFirstDayIndex !== 0) {
      displayPrevMonthDates(monthFirstDayIndex, datesDisplay);
    }

    displayCurrentMonthDates(monthFirstDayIndex, datesDisplay);

    let nextMonthDatesCount =
      datesDisplay.length - monthDaysCount[month] - monthFirstDayIndex;
    if (nextMonthDatesCount > 0)
      displayNextMonthDates(nextMonthDatesCount, datesDisplay);
  }

  function styleCurrentDate() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const currentDateNum = String(currentDate.getDate());

    const datesDisplay = Array.from(
      document.querySelectorAll(".calendar-main-dates span")
    );

    //

    for (let i = 0; i < datesDisplay.length; i++) {
      if (datesDisplay[i].classList.contains("current-date")) {
        datesDisplay[i].classList.remove("current-date");
        break;
      }
    }

    //

    if (month === currentMonth && year === currentYear) {
      for (let i = 0; i < datesDisplay.length; i++) {
        if (
          datesDisplay[i].textContent === currentDateNum &&
          !datesDisplay[i].classList.contains("opacity-low")
        )
          datesDisplay[i].classList.add("current-date");
      }
    }

    //
  }

  function removeDateElementsStyles() {
    const datesDisplay = Array.from(
      document.querySelectorAll(".calendar-main-dates span")
    );

    datesDisplay.forEach(function (ele) {
      if (ele.classList.contains("opacity-low")) {
        ele.classList.remove("opacity-low");
      }

      if (ele.classList.contains("current-date"))
        ele.classList.remove("current-date");
    });
  }

  function onLeftArrowClick() {
    month -= 1;
    if (month === -1) {
      year -= 1;
      month = 11;
    }

    removeDateElementsStyles();
    displayMonthYear();
    displayCalendar();
    styleCurrentDate();
  }

  function onRightArrowClick() {
    month += 1;
    if (month === 12) {
      year += 1;
      month = 0;
    }

    removeDateElementsStyles();
    displayMonthYear();
    displayCalendar();
    styleCurrentDate();
  }

  // *** Event Listeners ***

  leftArrow.addEventListener("click", onLeftArrowClick);

  rightArrow.addEventListener("click", onRightArrowClick);

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") {
      onLeftArrowClick();
    } else if (e.key === "ArrowRight") {
      onRightArrowClick();
    }
  });

  window.addEventListener("load", function () {
    displayTime();
    setInterval(displayTime, 1 * 1000);
    displayMonthYear();
    displayCalendar();
    styleCurrentDate();
    setInterval(styleCurrentDate, 1 * 1000);
  });
})();
