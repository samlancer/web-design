function createStar() {
    const star = document.createElement('div');
    const star_pad = document.querySelector(".star-pad")
    star.className = 'shooting-star';
    star.style.left = Math.random() * 100 + 'vw';
    star.style.top = Math.random() * 100 + 'vh';
    star.style.animationDuration = (1 + Math.random() * 2) + 's';
    star_pad.appendChild(star);
    setTimeout(() => star.remove(), 2000);
}
setInterval(createStar, 800);


strarPad = document.querySelector(".star-pad")
m_cloud = document.getElementById('mountain-cloud')
mountain = document.getElementById('mountain')
middle_rock = document.getElementById('middle-rock')
bottom_rock = document.getElementById('bottom-rock')
cloud = document.getElementById('cloud')
text1 = document.getElementById('text1')
text2 = document.getElementById('text2')

window.addEventListener('scroll', function () {
    scrolValue = this.window.scrollY;
    cloud.style.top = 460 - (scrolValue * .9) + "px";
    m_cloud.style.top = scrolValue * 0.7 + "px"

    text1.style.top = 220 + (scrolValue * .45) + "px";
    mountain.style.top = scrolValue * 0.4 + "px"
    text2.style.top = 445 + (scrolValue * .32) + "px";
    middle_rock.style.top = scrolValue * 0.3 + "px"




})