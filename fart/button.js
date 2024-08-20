const button = document.getElementById("buttonMain");
const buttonImg = document.getElementById("buttonImg");
const text = document.getElementById("fartText");

button.onmousedown = () => {
    buttonImg.src = "sprites/button2.png"
}

button.onclick = () => {
    playSound(`sounds/fart${randomNum(0,2)}.mp3`, 0.1)

    requestAnimationFrame(()=>{
        text.style.animation = "textPulse 0.3s ease-out 1 forwards"
    })

    shake(text, 10, 5, 5, 250)
}

button.onmouseup = () => {
    buttonImg.src = "sprites/button1.png"
    text.style.animation = "none"
}