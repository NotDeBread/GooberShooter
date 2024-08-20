function round(num, decimalPlaces = 0) {
    return Math.round(num * (Math.pow(10, decimalPlaces))) / (Math.pow(10, decimalPlaces))
}

function randomNum(min = 0, max = 1, decimalPlaces = 0) {
    return round((Math.random() * (max - min)) + min, decimalPlaces)
}

function shake(element, interval, intensityX, intensityY, time, rotate = false, rotateIntensity = 0) {
    let shakeInterval = setInterval(() => {
        if(rotate) {
            element.style.setProperty('transform',`translateX(${randomNum(-intensityX, intensityX)}px) translateY(${randomNum(-intensityY, intensityY)}px) rotate(${randomNum(-rotateIntensity, rotateIntensity)}deg)`)
        } else {
            element.style.setProperty('transform',`translateX(${randomNum(-intensityX, intensityX)}px) translateY(${randomNum(-intensityY, intensityY)}px)`)
        }
    }, interval);
    setTimeout(() => {
        clearInterval(shakeInterval)
        element.style.setProperty('transform',`none`)
    }, time);
}

function playSound(sound, volume = 1) {
    const audio = new Audio(sound)
    audio.volume = volume
    audio.play()
}