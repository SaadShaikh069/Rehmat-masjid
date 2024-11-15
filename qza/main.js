$(document).ready(function () {
    const trackedData = [];

    // Populate trackedData with September data (as before)
    const daysInSeptember = 30;
    for (let day = 1; day <= daysInSeptember; day++) {
        trackedData.push({
            date: new Date(2024, 8, day).toLocaleDateString('en-GB'),
            fajr: false,
            zohr: true,
            asr: false,
            maghrib: false,
            isha: false,
            witr: false
        });
    }

    // 1. Populate month view (all data)
    trackedData.forEach(item => {
        $('#month_view tbody').append(`
            <tr>
                <td>${item.date}</td>
                <td><input type="checkbox" class="form-control-checkbox" ${(item.fajr) ? "checked" : ""}></td>
                        <td><input type="checkbox" class="form-control-checkbox" ${(item.zohr) ? "checked" : ""}></td>
                        <td><input type="checkbox" class="form-control-checkbox" ${(item.asr) ? "checked" : ""}></td>
                        <td><input type="checkbox" class="form-control-checkbox" ${(item.maghrib) ? "checked" : ""}></td>
                        <td><input type="checkbox" class="form-control-checkbox" ${(item.isha) ? "checked" : ""}></td>
                        <td><input type="checkbox" class="form-control-checkbox" ${(item.witr) ? "checked" : ""}></td>
            </tr>
        `);
    });

    // 2. Populate week view (first 7 days)
    for (let i = 0; i < 7; i++) {
        const item = trackedData[i];
        $('#week_view tbody').append(`
                    <tr>
                        <td>${item.date}</td>
                        <td><input type="checkbox" class="form-control-checkbox" ${(item.fajr) ? "checked" : ""}></td>
                        <td><input type="checkbox" class="form-control-checkbox" ${(item.zohr) ? "checked" : ""}></td>
                        <td><input type="checkbox" class="form-control-checkbox" ${(item.asr) ? "checked" : ""}></td>
                        <td><input type="checkbox" class="form-control-checkbox" ${(item.maghrib) ? "checked" : ""}></td>
                        <td><input type="checkbox" class="form-control-checkbox" ${(item.isha) ? "checked" : ""}></td>
                        <td><input type="checkbox" class="form-control-checkbox" ${(item.witr) ? "checked" : ""}></td>
                    </tr>
        `);
    }

    // 3. Populate day view (first day)
    const firstDay = trackedData[0];
    $('#day-view tbody').append(`
                <tr>
                    <td>${firstDay.date}</td>
                    <td><input type="checkbox" class="form-control-checkbox" ${(firstDay.fajr) ? "checked" : ""}></td>
                        <td><input type="checkbox" class="form-control-checkbox" ${(firstDay.zohr) ? "checked" : ""}></td>
                        <td><input type="checkbox" class="form-control-checkbox" ${(firstDay.asr) ? "checked" : ""}></td>
                        <td><input type="checkbox" class="form-control-checkbox" ${(firstDay.maghrib) ? "checked" : ""}></td>
                        <td><input type="checkbox" class="form-control-checkbox" ${(firstDay.isha) ? "checked" : ""}></td>
                        <td><input type="checkbox" class="form-control-checkbox" ${(firstDay.witr) ? "checked" : ""}></td>
                </tr>
    `);
});


// ====================== calendar =================
$(document).ready(function () {
    var currentDate = new Date();
    var currentMonth = currentDate.getMonth();
    var currentYear = currentDate.getFullYear();

    // Sample object storing marked dates
    var markedDates = {
        warning: [
            { day: 5, month: 10, year: 2024 }
        ],
        danger: [
            { day: 15, month: 10, year: 2024 },
            { day: 25, month: 10, year: 2024 }
        ],
        primary: [
            { day: currentDate.getDate(), month: currentMonth + 1, year: currentYear } // Today's date
        ]
    };

    // Function to render the calendar
    function renderCalendar(month, year) {
        var calendarDiv = $('#calendar');
        calendarDiv.empty(); // Clear previous calendar

        var gregorianMonthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        var islamicMonthNames = [
            "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani", "Jumada al-Awwal", "Jumada al-Thani",
            "Rajab", "Sha'ban", "Ramadan", "Shawwal", "Dhul-Qi'dah", "Dhul-Hijjah"
        ];

        // Append the month-year header with both Gregorian and Islamic month names
        var islamicMonth = getIslamicMonth(new Date(year, month, 1));
        var gregorianHeader = gregorianMonthNames[month] + " " + year;
        var islamicHeader = islamicMonthNames[islamicMonth.month - 1] + " " + islamicMonth.year;
        $('#calendar-month-year').html(gregorianHeader + ' <small>' + islamicHeader + '</small>');

        // Append grid for calendar days
        var calendarGrid = $('<div class="calendar-grid"></div>');

        // Days of the week
        var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        for (var i = 0; i < daysOfWeek.length; i++) {
            calendarGrid.append('<div class="calendar-day"><strong>' + daysOfWeek[i] + '</strong></div>');
        }

        // Get the first day of the current month and total days in the month
        var firstDay = new Date(year, month, 1).getDay();
        var daysInMonth = new Date(year, month + 1, 0).getDate();

        // Fill empty days before the first day of the month
        for (var j = 0; j < firstDay; j++) {
            calendarGrid.append('<div class="calendar-day"></div>');
        }

        // Generate days of the month
        for (var day = 1; day <= daysInMonth; day++) {
            var gregorianDate = new Date(year, month, day);
            var islamicDate = getIslamicDate(gregorianDate);

            // Check if the current day is marked in any of the categories
            var cssClass = '';
            if (isMarkedDate(day, month + 1, year, 'warning')) {
                cssClass = 'bg-warning text-white';
            } else if (isMarkedDate(day, month + 1, year, 'danger')) {
                cssClass = 'bg-danger text-white';
            } else if (isMarkedDate(day, month + 1, year, 'primary')) {
                cssClass = 'bg-primary text-white';
            }

            calendarGrid.append(
                '<div class="calendar-day ' + cssClass + '">' +
                day + '<small>' + islamicDate.day + '</small>' +
                '</div>'
            );
        }

        calendarDiv.append(calendarGrid);
    }

    // Function to get Islamic date
    function getIslamicDate(date) {
        var gDay = date.getDate();
        var gMonth = date.getMonth();
        var gYear = date.getFullYear();
        return gToH(gDay, gMonth + 1, gYear);
    }

    // Function to get Islamic month
    function getIslamicMonth(date) {
        var gDay = date.getDate();
        var gMonth = date.getMonth();
        var gYear = date.getFullYear();
        return gToH(gDay, gMonth + 1, gYear);
    }

    // Gregorian to Hijri conversion algorithm
    function gToH(day, month, year) {
        var jd = Math.floor((1461 * (year + 4800 + Math.floor((month - 14) / 12))) / 4) +
            Math.floor((367 * (month - 2 - 12 * (Math.floor((month - 14) / 12)))) / 12) -
            Math.floor((3 * (Math.floor((year + 4900 + Math.floor((month - 14) / 12)) / 100))) / 4) +
            day - 32075;
        var l = jd - 1948440 + 10632;
        var n = Math.floor((l - 1) / 10631);
        l = l - 10631 * n + 354;
        var j = (Math.floor((10985 - l) / 5316)) * (Math.floor((50 * l) / 17719)) + (Math.floor(l / 5670)) * (Math.floor((43 * l) / 15238));
        l = l - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) - (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
        var month = Math.floor((24 * l) / 709);
        var day = l - Math.floor((709 * month) / 24);
        var year = 30 * n + j - 30;
        return { day: day, month: month, year: year };
    }

    // Function to check if a date is marked in an array
    function isMarkedDate(day, month, year, type) {
        var dates = markedDates[type];
        for (var i = 0; i < dates.length; i++) {
            if (dates[i].day === day && dates[i].month === month && dates[i].year === year) {
                return true;
            }
        }
        return false;
    }

    // Swipe gesture detection
    var touchStartX = 0;
    var touchEndX = 0;

    $('#calendar').on('touchstart', function (event) {
        touchStartX = event.changedTouches[0].screenX;
    });

    $('#calendar').on('touchend', function (event) {
        touchEndX = event.changedTouches[0].screenX;
        handleSwipeGesture();
    });

    function handleSwipeGesture() {
        if (touchEndX < touchStartX) { // Swipe left
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar(currentMonth, currentYear);
        } else if (touchEndX > touchStartX) { // Swipe right
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar(currentMonth, currentYear);
        }
    }

    // Event listeners for navigation buttons
    $('#prev-month').click(function () {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    });

    $('#next-month').click(function () {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    });

    // Initial render
    renderCalendar(currentMonth, currentYear);
});
