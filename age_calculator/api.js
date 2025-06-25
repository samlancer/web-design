async function getSunriseSunset() {
    const lat = 36.5656;
    const lng = 53.0588;
    const date = new Date().toISOString().split('T')[0]; // تاریخ امروز
    
    const response = await fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=${date}`);
    const data = await response.json();
    
    if (data.status === "OK") {
        const sunrise = data.results.sunrise;
        const sunset = data.results.sunset;
        console.log(`طلوع آفتاب: ${sunrise}, غروب آفتاب: ${sunset}`);
    } else {
        console.error("خطا در دریافت داده‌ها");
    }
}

getSunriseSunset();