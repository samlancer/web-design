window.addEventListener("scroll", function () {
    const logo = document.querySelector(".logo");
    const scrollValue = window.scrollY;
    const triggerPoint = window.innerHeight * 0.4;

    if (scrollValue > triggerPoint) {
        logo.classList.add("visible");
    } else {
        logo.classList.remove("visible");
    }
})