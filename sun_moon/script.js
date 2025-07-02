
function getcleantime(am_pm_time) {
    const [time, modifier] = am_pm_time.split(" ");
    [hours, minutes, seconds] = time.split(":")
    hours = parseInt(hours);

    if (modifier == "PM" && hours !== 12) {
        hours += 12
    }
    if (modifier == "AM" && hours == 12) {
        hours = 0
    }
    return `${hours.toString().padStart(2, "0")}:${minutes}:${seconds}`

}

async function getSunriseSunset() {
    const lat = 36.5656;
    const lng = 53.0588;
    const date = new Date().toISOString().split('T')[0];

    const response = await fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=${date}`);
    const data = await response.json();

    if (data.status === "OK") {
        const sunrise = data.results.sunrise;
        clean_sunrise = getcleantime(sunrise)
        const sunset = data.results.sunset;
        clean_sunset = getcleantime(sunset)
        let [sunrise_hour, sunrise_minutes, sunrise_second] = clean_sunrise.split(":").map(Number);
        let [sunset_hour, sunset_minutes, sunset_second] = clean_sunset.split(":").map(Number);

        sunrise_minutes += 30
        if (sunrise_minutes > 60) {
            sunrise_minutes -= 60
            sunrise_hour += 1
        }
        sunrise_hour += 3
        sunset_minutes += 30
        if (sunset_minutes > 60) {
            sunset_minutes -= 60
            sunset_hour += 1
        }
        sunset_hour += 3

        const sunriseDate = new Date(`${date}T${sunrise_hour.toString().padStart(2, "0")}:${sunrise_minutes.toString().padStart(2, "0")}:${sunrise_second.toString().padStart(2, "0")}`);
        const sunsetDate = new Date(`${date}T${sunset_hour.toString().padStart(2, "0")}:${sunset_minutes.toString().padStart(2, "0")}:${sunset_second.toString().padStart(2, "0")}`);
        const diffMs = sunsetDate - sunriseDate; //zaman ro milisecond mide
        const totalMinutes = Math.floor(diffMs / (60000));
        now = new Date()
        const sinceSunRises = now - sunriseDate//bazam milisecond
        const passedMinutes = Math.floor(sinceSunRises / (60000));

        let timeSinceSunrise;
        if (passedMinutes < 0) {
            timeSinceSunrise = 0;
        } else if (passedMinutes > totalMinutes) {
            timeSinceSunrise = totalMinutes;
        } else {
            timeSinceSunrise = passedMinutes;
        }
        night_minutes = 1440 - totalMinutes;

        return {
            sunrise: `${sunrise_hour}:${sunrise_minutes}:${sunrise_second}`,
            sunset: `${sunset_hour}:${sunset_minutes}:${sunset_second}`,
            daylightMinutes: totalMinutes,
            minutesSinceSunrise: timeSinceSunrise,
            nightMinutes: night_minutes,
        };

    } else {
        console.error("خطا در دریافت داده‌ها");
    }
}
function moveTheSun(minutesSinceSunrise, daylightMinutes) {
    currentProgress = minutesSinceSunrise * (1.034 / daylightMinutes)// dakhel parantize mige dar har min chand darsd ty mkone
    spentratio = minutesSinceSunrise / daylightMinutes
    x = -0.034 + currentProgress
    y = Math.sin(spentratio * Math.PI)
    sun = document.getElementById("sun")

    if ((x * 100) > -3.4 && (x * 100) <= 100) {
        sun.style.left = (x * 100) + "%"
        sun.style.bottom = (y * 42 + 50) + "%"
    } else {
        sun.style.left = "-3.4%"
        sun.style.bottom = "50%"
    }
}
function moveTheMoon(minutesSinceSunset, nightMinutes) {
    moon = document.getElementById("moon")
    const spentratio = minutesSinceSunset / nightMinutes;
    currentProgress = minutesSinceSunset * (1.038 / (nightMinutes))
    x = -0.034 + currentProgress
    y = Math.sin(spentratio * Math.PI)
    if ((x * 100) > -3.4 && (x * 100) <= 100) {
        moon.style.left = (x * 100) + "%"
        moon.style.bottom = (y * 42 + 50) + "%"

    } else {
        moon.style.left = "-3.4%"
        moon.style.bottom = "50%"

    }
}
function showStars(minutesSinceSunset) {
    if (minutesSinceSunset > 10) {
        document.getElementById("stars").style.display = "block"
    } else {
        document.getElementById("stars").style.display = "none"

    }
}
function handleImages(daylightMinutes, nightMinutes, minutesSinceSunrise, minutesSinceSunset) {


    const dayspentratio = minutesSinceSunrise / daylightMinutes;
    const nightspentratio = minutesSinceSunset / nightMinutes;
    if (minutesSinceSunset > 0 && minutesSinceSunset <= nightMinutes) {
        isnight = true
    } else {
        isnight = false
    }
    if (dayspentratio > 0 && dayspentratio <= 0.5) {
        zone = "1"
    } else if (dayspentratio > .5 && dayspentratio <= 0.8) {
        zone = "2"
    } else if (dayspentratio > 0.8 && dayspentratio <= 1) {
        zone = "3"
    } else if (nightspentratio > 0 && nightspentratio <= 0.8) {
        zone = "4"
    } else if (nightspentratio > 0.8 && nightspentratio <= 1) {
        zone = "5"
    }
    zone1OpacityChangeRate = 1 / (daylightMinutes * .5)
    zone2OpacityChangeRate = 1 / (daylightMinutes * .3)
    zone3OpacityChangeRate = 1 / (daylightMinutes * .2)
    zone4OpacityChangeRate = 1 / (nightMinutes * .8)
    zone5OpacityChangeRate = 1 / (nightMinutes * .2)
    if (zone == "1") {
        progress = minutesSinceSunrise * zone1OpacityChangeRate
    } else if (zone == "2") {
        progress = (minutesSinceSunrise - (daylightMinutes * .5)) * zone2OpacityChangeRate
    } else if (zone == "3") {
        progress = (minutesSinceSunrise - (daylightMinutes * .8)) * zone3OpacityChangeRate
    } else if (zone == "4") {
        progress = minutesSinceSunset * zone4OpacityChangeRate
    } else if (zone == "5") {
        progress = (minutesSinceSunset - (nightMinutes * .8)) * zone5OpacityChangeRate
    }

    if (!isnight) {
        if (zone == "1" || zone == "2" || zone == "3") {
            image = document.querySelector(`.image${zone}`)
            image.style.opacity = 1 - progress
            image.nextElementSibling.style.opacity = progress
        }
    } else {

        if (zone == "4") {
            image = document.querySelector(`.image${zone}`)
            image.style.opacity = 1 - progress
            image.nextElementSibling.style.opacity = progress
        } else if (zone == "5") {
            image = document.querySelector(`.image${zone}`)
            image.style.opacity = 1 - progress
            document.querySelector(`.image1`).style.opacity = progress

        }
    }
}

function updateSkyColor(daylightMinutes, nightMinutes, minutesSinceSunrise, minutesSinceSunset) {
    // ensure smooth fade
    document.body.style.transition = 'background 1s linear';

    const dayspentratio = minutesSinceSunrise / daylightMinutes;
    const nightspentratio = minutesSinceSunset / nightMinutes;
    const isNight = minutesSinceSunset > 0 && minutesSinceSunset <= nightMinutes;


    let zone = null;
    if (!isNight) {
        if (dayspentratio > 0 && dayspentratio <= 0.2) zone = "1"; 
        else if (dayspentratio <= 0.5) zone = "2"; 
        else if (dayspentratio <= 0.8) zone = "3"; 
        else if (dayspentratio <= 1) zone = "4"; 
    } else {
        if (nightspentratio <= 0.8) zone = "5"; 
        else zone = "6"; 
    }

   
    const gradients = {
        "1": "linear-gradient(to top, #160c28, #432371, #b383c0)", 
        "2": "linear-gradient(to top, #168aad, #34a0a4, #90e0ef)", 
        "3": "linear-gradient(to top, #9b3f1a, #f2944c, #f2c66d)", 
        "4": "linear-gradient(to top, #b0301b, #e85d04, #ffba08)", 
        "5": "linear-gradient(to top, #01030d, #0b1a2f, #14213d)", 
        "6": "linear-gradient(to top, #160c28, #432371, #b383c0)"  
    };

    if (zone && gradients[zone]) {
        document.body.style.background = gradients[zone];
    }
}



(async () => {
    const times = await getSunriseSunset();
    progressPerMinutes = 100 / times.daylightMinutes
    console.log(times.sunset)

    console.log(times.daylightMinutes)

    console.log(times.minutesSinceSunrise)
    let currentMinutes = times.minutesSinceSunrise
    let daylight = times.daylightMinutes
    let night = times.nightMinutes
    let sincesunset = currentMinutes - daylight
    let interval = 100




    setInterval(function () {
        const sinceSunset = currentMinutes - daylight;
        console.log(times.minutesSinceSunrise)
        handleImages(daylight, night, currentMinutes, sinceSunset)
        updateSkyColor(daylight, night, currentMinutes, sinceSunset)
        moveTheSun(currentMinutes, daylight);
        moveTheMoon(sinceSunset, night);
        showStars(sinceSunset)

        currentMinutes += 1;
        if (currentMinutes > 1440) currentMinutes = 0;
    }, interval);


})();
