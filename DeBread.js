console.log('ayo what are you doing here')

let intervalID = 0

let gameSpeed = 1
let notiCount = 0
const soundPool = {};

let particles = 0
let audios = 0
let audioLimit = 15

const intervals = {}

const DeBread = {
    /**
    * Rounds a number to the specified decimal place.
    * @param num The number to round.
    * @param decimalPlaces The decimal place to round to.
    */
    round(num, decimalPlaces = 0) {
        return Math.round(num * (Math.pow(10, decimalPlaces))) / (Math.pow(10, decimalPlaces))
    },

    /**
    * Returns a random number.
    * @param min The minimum amount the number can be.
    * @param max The maximum amount amount the number can be.
    * @param decimalPlaces The amount of decimal places.
    */
    randomNum(min = 0, max = 1, decimalPlaces = 0) {
        return DeBread.round((Math.random() * (max - min)) + min, decimalPlaces)
    },

    /**
    * Returns a random color.
    */
    randomColor() {
        return `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`
    },

    /**
    * Applies a shake effect to an element.
    * (This uses the CSS transform property so it will override an y current CSS transformations.)
    * @param element The element to shake.
    * @param interval The interval of the shake.
    * @param intensity The intensity of the shake.
    * @param time How long the shake lasts (ms).
    * @param rotate If to involve rotation in the shake.
    * @param rotateIntensity The intensity of the rotation in the shake.
    */
    shake(element, interval, intensityX, intensityY, time, rotate = false, rotateIntensity = 0) {
        let shakeInterval = setInterval(() => {
            if(rotate) {
                element.style.setProperty('transform',`translateX(${DeBread.randomNum(-intensityX, intensityX)}px) translateY(${DeBread.randomNum(-intensityY, intensityY)}px) rotate(${DeBread.randomNum(-rotateIntensity, rotateIntensity)}deg)`)
            } else {
                element.style.setProperty('transform',`translateX(${DeBread.randomNum(-intensityX, intensityX)}px) translateY(${DeBread.randomNum(-intensityY, intensityY)}px)`)
            }
        }, interval * gameSpeed);
        setTimeout(() => {
            clearInterval(shakeInterval)
            element.style.setProperty('transform',`none`)
        }, time * gameSpeed);
    },

    easeShake(element, interval, startIntensity, intensityDecrease) {
        let intensity = startIntensity
        let shakeInterval = setInterval(() => {
            if(intensity < 0) {
                clearInterval(shakeInterval)
                element.style.translate = 'none'
            } else {
                element.style.translate = `${DeBread.randomNum(-intensity, intensity)}px ${DeBread.randomNum(-intensity, intensity)}px`
                intensity -= intensityDecrease
            }
        }, interval);
    },

    /**
    * Creates particles.
    * @param destination The ID of the HTML element to append the particles to.
    * @param count The number of particles to create.
    * @param interval The time between particles spawning (ms).
    * @param lifespan How long the particle lasts intill it's destroyed.
    * @param timingFunction The timing function of the particle animation.
    * @param positionRange The position range of the particles. [[minX, maxX], [minY, maxY]]
    * @param sizeRange The size range of the particles. [[[startingWidthMin, startingWidthMax], [startingHeightMin, startingHeightMax]], [[endingScaleXMin, endingScaleXMax], [endingScaleYMin, endingScaleYMax]]]
    * @param rotateRange The rotation range of the particles. [[startingMinDeg, startingMaxDeg], [endingMinDeg, endingMaxDeg]]
    * @param velocityRange The range of the particle's movement. [[minX, maxX], [minY, maxY]]
    * @param primaryColorRange The range of the particle's starting color. [[minR, minG, minB], [maxR, maxG, maxB]]
    * @param secondaryColorRange The range of the particle's ending color. [[minR, minG, minB], [maxR, maxG, maxB]]
    */
    createParticles(
        destination,
        count = 0, 
        interval = 0,
        lifespan = 0,
        timingFunction = 'cubic-bezier(.5,1.5,.5,-0.5)',
        positionRange = [[0, 0], [0, 0]], 
        sizeRange = [[[0, 0], [0, 0]], [[0, 0], [0, 0]]],
        rotateRange = [[0, 0], [0, 0]],
        velocityRange = [[0, 0], [0, 0]], 
        primaryColorRange = [[0, 0, 0], [0, 0, 0]],
        secondaryColorRange = [[0, 0, 0], [0, 0, 0]],
        ignoreParticleLimit = false
        ) {
            if((data.settings.particles && particles < data.settings.particlelimit) || ignoreParticleLimit) {
                for(let i = 0; i < count; i++) {
                    setTimeout(() => {       
                        if(particles < data.settings.particlelimit) {
                            const particle = document.createElement('div')
                            particle.classList.add('particle')
                
                            const randomWidth = DeBread.randomNum(sizeRange[0][0][0], sizeRange[0][0][1])
                            particle.style.width = randomWidth + 'px'
            
                            const randomHeight = DeBread.randomNum(sizeRange[0][1][0], sizeRange[0][1][1])
                            particle.style.height = randomHeight + 'px'
            
                            particle.style.backgroundColor = `rgb(
                                ${DeBread.randomNum(primaryColorRange[0][0], primaryColorRange[1][0])}
                                ${DeBread.randomNum(primaryColorRange[0][1], primaryColorRange[1][1])}
                                ${DeBread.randomNum(primaryColorRange[0][2], primaryColorRange[1][2])}
                            )`
            
                            particle.style.rotate = DeBread.randomNum(rotateRange[0][0], rotateRange[0][1]) + 'deg'
                
                            destination.appendChild(particle)
                            particles++
                            doge('dbParticles').innerText = `Particles: ${particles}/${data.settings.particlelimit}`
                            doge('dbParticles').style.color = `hsl(0deg, 100%, ${100 - ((particles - (data.settings.particleLimit / 2)) / data.settings.particleLimit) * 100}%)`
                
                            particle.style.left = DeBread.randomNum(positionRange[0][0], positionRange[0][1]) - particle.offsetWidth / 2 + 'px'
                            particle.style.top = DeBread.randomNum(positionRange[1][0], positionRange[1][1]) - particle.offsetHeight / 2 + 'px'
        
                            // console.log(`
                            //     XPOS: ${DeBread.randomNum(positionRange[0][0], positionRange[0][1]) - (particle.offsetWidth / 2) + 'px'}
                            //     YPOS: ${DeBread.randomNum(positionRange[1][0], positionRange[1][1]) - (particle.offsetHeight / 2) + 'px'}
        
                            //     MINX: ${positionRange[0][0]}
                            //     MAXX: ${positionRange[0][1]}
                            //     WIDTH: ${particle.offsetWidth}
        
                            //     MINY: ${positionRange[1][0]}
                            //     MAXY: ${positionRange[1][1]}
                            //     HEIGHT: ${particle.offsetHeight}
                            // `)
            
                            particle.style.setProperty('--particleLifespan', lifespan * gameSpeed + 'ms')
                            particle.style.setProperty('--particleTimingFunction', timingFunction)
                            particle.style.setProperty('--particleX', DeBread.randomNum(velocityRange[0][0], velocityRange[0][1]) + 'px')
                            particle.style.setProperty('--particleY', DeBread.randomNum(velocityRange[1][0], velocityRange[1][1]) + 'px')
                            particle.style.setProperty('--particleSizeX', DeBread.randomNum(sizeRange[1][0][0], sizeRange[1][0][1]) + '%')
                            particle.style.setProperty('--particleSizeY', DeBread.randomNum(sizeRange[1][1][0], sizeRange[1][1][1]) + '%')
                            particle.style.setProperty('--particleRotate', DeBread.randomNum(rotateRange[1][0], rotateRange[1][1]) + 'deg')
                            particle.style.setProperty('--particleColor', 
                                `rgb(
                                    ${DeBread.randomNum(secondaryColorRange[0][0], secondaryColorRange[1][0])}
                                    ${DeBread.randomNum(secondaryColorRange[0][1], secondaryColorRange[1][1])}
                                    ${DeBread.randomNum(secondaryColorRange[0][2], secondaryColorRange[1][2])}
                                )`
                            )
            
                            setTimeout(() => {
                                destination.removeChild(particle)
                                particles--
                                doge('dbParticles').innerText = `Particles: ${particles}/${data.settings.particlelimit}`
                                doge('dbParticles').style.color = `hsl(0deg, 100%, ${100 - ((particles - (data.settings.particleLimit / 2)) / data.settings.particleLimit) * 100}%)`
                            }, lifespan * gameSpeed);
                        }       
                    }, i * interval * gameSpeed);
                }
            }
        },


    // /**
    //  * 
    //  * @param obj Contains all of the attributes of the particles.
    //  * @param obj.destination *Where in the DOM to spawn the particles.
    //  * @param obj.count *How many particles, in total, to spawn.
    //  * @param obj.lifespan *How long each particles lasts before despawning in milliseconds.
    //  * @param obj.interval How long in milliseconds between each particle spawning.
    //  * @param obj.styles *The CSS styles of each particle, specify width, height, and color here.
    //  * @param obj.pos *The position range where the particles can spawn.
    //  * @param obj.timingFunction The timing function of the particle animation.
    //  */
    // coolCreateParticles(obj) {
    //     const particle = document.createElement('div')
    //     particle.style.position = 'absolute'
    //     let randomPositionValues = [[DeBread.randomNum(obj.pos[0][0], obj.pos[0][1])], [DeBread.randomNum(obj.pos[1][0], obj.pos[1][1])]]
    //     particle.style.left = randomPositionValues[0]+'px'
    //     particle.style.top = randomPositionValues[1]+'px'

    //     for (const CSSStyle in obj.styles) {
    //         let cssValue
    //         try {
    //             cssValue = eval(obj.styles[CSSStyle])
    //             cssValue = cssValue.toString()
    //         } catch (error) {
    //             cssValue = obj.styles[CSSStyle]
    //         }
    
    //         particle.style[CSSStyle] = cssValue
    //     }
    //     obj.destination.append(particle)
    // },

    /**
    * Plays a sound.
    * @param sound The file path of the audio.
    * @param volume The volume to play the sound at.
    * @param speed The speed to play the sound at.
    */
    playSound(sound, baseVolume = 1, speed = 1) {
        let volume
        if(baseVolume * data.settings.volume <= 1) {
            volume = baseVolume * data.settings.volume            
        } else {
            volume = 1
        }
        if(data.settings.sfx && audios < 15) {
            if(!soundPool[sound]) {
                soundPool[sound] = new Audio(sound)
            }
            const audio = soundPool[sound]
            audio.volume = volume
            audio.playbackRate = speed

            if(audio.paused) {
                audio.play()
                audios++
                doge('dbSounds').innerText = `Sounds: ${audios}/${audioLimit}`
                doge('dbSounds').style.color = `hsl(0deg, 100%, ${100 - ((audios - (audioLimit / 2)) / audioLimit) * 100}%)`
            } else{
                const audioClone = audio.cloneNode()
                audioClone.volume = volume
                audioClone.playbackRate = speed
                audioClone.play()
                audios++
                doge('dbSounds').innerText = `Sounds: ${audios}/${audioLimit}`
                doge('dbSounds').style.color = `hsl(0deg, 100%, ${100 - ((audios - (audioLimit / 2)) / audioLimit) * 100}%)`
            }

            setTimeout(() => {
                audios--
                doge('dbSounds').innerText = `Sounds: ${audios}/${audioLimit}`
                doge('dbSounds').style.color = `hsl(0deg, 100%, ${100 - ((audios - (audioLimit / 2)) / audioLimit) * 100}%)`
            }, audio.duration * 1000);
        }
    },

    rgbStringToArray(rgbString) {
        const regex = /(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})/
        const match = rgbString.match(regex)
    
        if (match) {
            const [, r, g, b] = match
            return [parseInt(r), parseInt(g), parseInt(b)]
        } else {
            return null;
        }
    },

    createInterval(run, delay, repeat = Infinity) {
        intervalID++
        const id = intervalID

        intervals[id] = {
            lastRan: performance.now(),
            timePaused: undefined,
            timesRepeated: 0,
            paused: false,
            fun: run,
            delay: delay.toString(),
            callback: () => {
                intervals[id].timeout = setTimeout(() => {
                    run()
                    intervals[id].lastRan = performance.now()
                    intervals[id].timesRepeated++
                    if(intervals[id].timesRepeated < repeat) {
                        intervals[id].callback()
                    } else {
                        DeBread.deleteInterval(id)
                    }
                }, eval(delay.toString()));
            }
        }
        intervals[id].callback()
        
        return intervalID
    },

    /**
     * Pause/Resumes an interval using its ID.
     * @param id The ID of an existing interval.
     */
    pauseInterval(id) {
        if(intervals[id]) {
            let interval = intervals[id]
            if(interval.paused) {
                setTimeout(() => {
                    interval.fun()
                    interval.callback()
                }, interval.delay - (interval.timePaused - interval.lastRan));
            } else {
                clearTimeout(interval.timeout)
                interval.timePaused = performance.now()
            }
            interval.paused = !interval.paused
        } else {
            throw new Error(`Couldn't find an interval using the ID of ${id}, try creating one using DeBread.createInterval()`)
        }
    },

    /**
     * Deletes an interval using its ID.
     * @param id The ID of an existing interval.
     */
    deleteInterval(id) {
        if(intervals[id]) {
            clearTimeout(intervals[id].timeout)
            intervals[id] = undefined
        } else {
            throw new Error(`Couldn't find an interval using the ID of ${id}, try creating one using DeBread.createInterval()`)
        }
    },

    getInterval(id) {
        if(intervals[id]) {
            return intervals[id]
        } else {
            throw new Error(`Couldn't find an interval using the ID of ${id}, try creating one using DeBread.createInterval()`)
        }
    }
}

let windowFocused = true
window.onfocus = () => {windowFocused = true}
window.onblur = () => {windowFocused = false}

/**
* Shortened document.getElementById.
* (From library "DeBread")
* @param id The ID of the element.
*/
function doge(id) {
    return document.getElementById(id)
}

//FPS COUNTER: Made be me :D

let frameCount = 0
let lastUpdateDate = performance.now()
function frameUpdate() {
    frameCount++
    doge('dbFPSMS').innerText = `${DeBread.round(((performance.now() - lastUpdateDate) / frameCount), 2)}ms`
    if(performance.now() - lastUpdateDate >= 1000) {
        lastUpdateDate = performance.now()
        doge('dbFPS').innerText = `${frameCount}FPS`
        doge('dbFPS').style.color = `hsl(0deg, 100%, ${50 + frameCount}%)`
        frameCount = 0
    }
    requestAnimationFrame(frameUpdate)
} requestAnimationFrame(frameUpdate)

function createNoti(img, title, desc, run) {
    const noti = document.createElement('div')
    noti.classList.add('noti')
    if(img) {
        noti.innerHTML = `
        <img src="${img}">
        <div style="line-height: 1;">
            <span style="font-weight: 700; font-size: 1.1em;">${title}</span>
            <br>
            <span>${desc}</span>
        </div>
        `
    } else if(desc) {
        noti.style.height = '30px'
        noti.innerHTML = `
        <div style="line-height: 1;">
            <span style="font-weight: 700; font-size: 1.1em;">${title}</span>
            <br>
            <span>${desc}</span>
        </div>
        `
    } else {
        noti.style.height = '30px'
        noti.innerHTML = `
        <div style="line-height: 1;">
            <span style="font-weight: 700; font-size: 1.1em;">${title}</span>
        </div>
        `
    }
    doge('notiContainer').append(noti)

    function notiClick() {
        if (run) {
            run()
        }
        noti.remove()
    }

    noti.onclick = notiClick

    doge('notiContainer').append(noti)

    setTimeout(() => {
        noti.style.opacity = 0
        setTimeout(() => {
            noti.remove()
        }, 1000);
    }, 5000);
}

function createChallengeCompleteNoti(challenge) {
    const div = document.createElement('div')
    div.classList.add('challengeComp')
    div.innerHTML = `
    <div class="challengeCompOverlay">
        <img src="media/checkmark.png" width="50">
        <span>+${DeBread.round(challenge.reward / 1000)}K XP</span>
    </div>
    <div class="challengeCompInfo">
        <span>${challenge.name}</span>
        <span>${challenge.desc}</span><br>
        <span>${challenge.progress} / ${challenge.goal}</span>
    </div>
    `

    doge('challengeCompleteContainer').append(div)

    setTimeout(() => {
        div.style.opacity = 1
    }, 100);
    setTimeout(() => {
        div.style.opacity = 0
        setTimeout(() => {
            div.style.height = '0px'
            setTimeout(() => {
                div.remove()
            }, 500);
        }, 500);
    }, 5000);
}

//Error message
window.onerror = ev => {
    createNoti('media/error.png', 'An error has occured', 'Please report this to DeBread, click on this notification to copy the error to your clipboard.', 
    () => {
        navigator.clipboard.writeText(ev)
        createNoti(undefined, 'Copied to clipboard.', ev)
    })
}

//You found it!
function getCompoundXP(level) {
    let output = 0;
    for (let i = 1; i <= level; i++) {
        output += Math.pow(500 * i, 1.05)
    }
    return output
}

//-----Credit: @zeanzarzin-----//

// less horrible number formatter (in my opinion)
const startingNumber = 1000000;
const numberStep = 1000;
const numberNames = [
    " Million",
    " Billion",
    " Trillion",
    " Quadrillion",
    " Quintillion",
    " Sextillion",
    " Septillion",
    " Octillion",
    " Nonillion",
    " Decillion",
    " Undecillion",
    " Duodecillion",
    " Tredecillion",
    " Quattuordecillion",
    " Quindecillion",
    " Sexdecillion",
    " Septemdecillion",
    " Octodecillion",
    " Novemdecillion",
    " Vigintillion",
    " Unvigintillion",
    " Duovigintillion",
    " Trevigintillion",
    " Quattuorvigintillion",
    " Quinvigintillion",
    " Sexvigintillion",
    " Septvigintillion",
    " Octovigintillion",
    " Nonvigintillion",
    " Trigintillion",
    " Untrigintillion",
    " Duotrigintillion",
];
const googol = Math.pow(10, 100); // googol is annoying to work with >:(

const numberNameCount = numberNames.length;

function formatNumber(number) {
    if(number >= startingNumber) {
        let i; // unfortunately i has to be defined in this scope
        let currentNumber = startingNumber;
        for (i = 0; i <= numberNameCount && number >= currentNumber*numberStep; i++) {
            currentNumber *= numberStep;
        }

        if (i === numberNameCount) {
            return (Math.round(number / googol * 1000) / 1000) + " Googol";
        }

        return (Math.round(number / currentNumber * 1000) / 1000) + numberNames[i];
    }
    return (Math.round(number*10)/10).toLocaleString();
}

//---------------//

//hey you shouldn't be here
const devCode = [
    'arrowup',
    'arrowup',
    'arrowdown',
    'arrowdown',
    'arrowleft',
    'arrowright',
    'arrowleft',
    'arrowright',
    'b',
    'a',
    'enter'
]
let devCodeInput = []
document.addEventListener('keydown', ev => {
    if(!data.dev) {
        devCodeInput.push(ev.key.toLowerCase())
        if(devCodeInput[devCodeInput.length - 1] === devCode[devCodeInput.length - 1]) {
            //idk why its making me do this
        } else {
            devCodeInput = []
        }
    
        if(devCodeInput.length === devCode.length) {
            data.dev = true
            createNoti(undefined, 'Developer Tools Unlocked!', 'You shouldn\'t have this...')
        }
    }
})