const stars = document.getElementById('stars');
const moon = document.getElementById('moon');
const mountainsBehind = document.getElementById('mountains_behind');
const mountainsFront = document.getElementById('mountains_front');
const titleText = document.querySelector('.text');
const explore = document.querySelector('.explore');
const header = document.querySelector('header');


window.addEventListener('scroll', function () {
    scrolValue = this.window.scrollY;
    stars.style.left = scrolValue * 0.2 + "px"
    moon.style.top = scrolValue * 0.9 + "px"
    mountainsBehind.style.top = scrolValue * 0.5 + "px"
    mountainsFront.style.top = scrolValue * 0 + "px"
    titleText.style.marginRight = scrolValue * 4 + "px"
    titleText.style.marginTop = scrolValue * 1.5 + "px"
    explore.style.marginTop = scrolValue * 1.5 + "px"
    header.style.top = scrolValue * 0.5 + "px"



})