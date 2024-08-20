const achievements = {
    firstBlood: {
        name: 'First Blood',
        desc: 'Kill your first enemy.',
        unlocked: false,
        secret: false,
    },
    murderer: {
        name: 'Murderer',
        desc: 'Kill 10 enemies.',
        unlocked: false,
        secret: false,
    },
    bloodThirsty: {
        name: 'Blood Thirsty',
        desc: 'Kill 100 enemies.',
        unlocked: false,
        secret: false,
    },
    serialKiller: {
        name: 'Serial Killer',
        desc: 'Kill 1,000 enemies.',
        unlocked: false,
        secret: false,
    },
    anarchist: {
        name: 'Anarchist',
        desc: 'Kill 10,000 enemies.',
        unlocked: false,
        secret: false,
    },
    cooked: {
        name: 'Cooked',
        desc: 'Deal over 100 damage with one bullet.',
        unlocked: false,
        secret: false,
    },
    stylish: {
        name: 'Stylish',
        desc: 'Parry a bullet.',
        unlocked: false,
        secret: false,
        run: () => {unlockCharacter(characters.uni)}
    },
    flashy: {
        name: 'Flashy',
        desc: 'Parry 50 bullets.',
        unlocked: false,
        secret: false,
        run: () => {unlockCharacter(characters.big_floppa)}
    },
    fancy: {
        name: 'Fancy',
        desc: 'Parry 250 bullets.',
        unlocked: false,
        secret: false,
        run: () => {unlockCharacter(characters.car)}
    },
    ostentatious: {
        name: 'Ostentatious',
        desc: 'Parry 500 bullets.',
        unlocked: false,
        secret: false,
    },
    murderSpree: {
        name: 'Murder Spree',
        desc: 'Have a x100 combo.',
        unlocked: false,
        secret: false,
    },
    showOff: {
        name: 'Show Off',
        desc: 'Parry a bullet by taunting.',
        unlocked: false,
        secret: false,
        run: () => {unlockCharacter(characters.brick)}
    },
    reflex: {
        name: 'Reflex',
        desc: 'Parry a bullet with a block size of 100px or less.',
        unlocked: false,
        secret: false,
    },
    survivor: {
        name: 'Survivor',
        desc: 'Survive till wave 10.',
        unlocked: false,
        secret: false,
    },
    trooper: {
        name: 'Trooper',
        desc: 'Survive till wave 50.',
        unlocked: false,
        secret: false,
    },
    conqueror: {
        name: 'Conqueror',
        desc: 'Survive till wave 100.',
        unlocked: false,
        secret: false,
    },
    champion: {
        name: 'Champion',
        desc: 'Survive till wave 200.',
        unlocked: false,
        secret: false,
    },
    beginner: {
        name: 'Beginner',
        desc: 'Reach level 10.',
        unlocked: false,
        secret: false,
    },
    novice: {
        name: 'Novice',
        desc: 'Reach level 20.',
        unlocked: false,
        secret: false,
    },
    intermediate: {
        name: 'Intermediate',
        desc: 'Reach level 30.',
        unlocked: false,
        secret: false,
    },
    professional: {
        name: 'Professional',
        desc: 'Reach level 40.',
        unlocked: false,
        secret: false,
    },
    expert: {
        name: 'Expert',
        desc: 'Reach level 50.',
        unlocked: false,
        secret: false,
    },
    master: {
        name: 'Master',
        desc: 'Reach level 60.',
        unlocked: false,
        secret: false,
    },
    elite: {
        name: 'Elite',
        desc: 'Reach level 70.',
        unlocked: false,
        secret: false,
    },
    titan: {
        name: 'Titan',
        desc: 'Reach level 80.',
        unlocked: false,
        secret: false,
    },
    legend: {
        name: 'Legend',
        desc: 'Reach level 90.',
        unlocked: false,
        secret: false,
    },
    grandmaster: {
        name: 'Grandmaster',
        desc: 'Reach level 100.',
        unlocked: false,
        secret: false,
    },
    closeCall: {
        name: 'Close Call',
        desc: 'Have 0 health, but not die.',
        unlocked: false,
        secret: false,
    },
    trickShot: {
        name: 'Trick Shot',
        desc: 'Ricochet a bullet into an enemy.',
        unlocked: false,
        secret: false,
    },
    knuckleSandwich: {
        name: 'Knuckle Sandwich',
        desc: 'Kill an enemy by punching it.',
        unlocked: false,
        secret: false,
    },
    boxer: {
        name: 'Boxer',
        desc: 'Kill 100 enemies by punching them.',
        unlocked: false,
        secret: false,
        run: () => {unlockCharacter(characters.sasha)}
    },
    fireInTheHole: {
        name: 'Fire In The Hole',
        desc: 'Kill 3 or more enemies with one explosion.',
        unlocked: false,
        secret: false,
        run: () => {unlockCharacter(characters.normal)}
    },
    boutToBlow: {
        name: 'Bout to Blow',
        desc: 'Kill 5 or more enemies with one explosion.',
        unlocked: false,
        secret: false,
    },
    whoops: {
        name: 'Whoops',
        desc: 'Create an explosion larger than 250px.',
        unlocked: false,
        secret: false,
    },
    gameOver: {
        name: 'Game Over',
        desc: 'Die for the first time.',
        unlocked: false,
        secret: false,
    },
    andIThought10DigitsWasTooMany: {
        name: 'And I thought 10 digits was too many',
        desc: 'Reach 1 billion score.',
        unlocked: false,
        secret: false,
    },
    heyGuysWatchThis: {
        name: 'HEY GUYS WATCH THI-',
        desc: 'Kill yourself.',
        unlocked: false,
        secret: true,
    },
    theLight: {
        name: 'THE LIGHT',
        desc: 'Visit the ash baby.',
        unlocked: false,
        secret: true,
    },
    funny: {
        name: 'Funny',
        desc: 'Visit the fart site.',
        unlocked: false,
        secret: true,
    },
    theSmilingFriends: {
        name: 'The Smiling Friends',
        desc: 'Have enemies 0-3 in the area at the same time.',
        unlocked: false,
        secret: true,
    }
}

for(const achievement in achievements) {
    if(data.achievements.includes(achievement)) {
        achievements[achievement].unlocked = true
    }
}

function createAchNoti(ach) {
    const noti = document.createElement('div')
    noti.classList.add('achNoti')

    noti.classList.add('achNotiAnim')
    setTimeout(() => {
        noti.classList.remove('achNotiAnim')
    }, 500);

    const notiSection1 = document.createElement('span')
    notiSection1.style.transition = 'opacity ease-in-out 500ms'
    notiSection1.innerText = 'Achievement Unlocked!'
    notiSection1.style.fontWeight = '700'
    noti.append(notiSection1)

    const notiImg = document.createElement('img')
    notiImg.style.display = 'none'
    notiImg.style.opacity = 0
    notiImg.style.transition = 'opacity ease-in-out 250ms'
    notiImg.src = `media/achievements/${ach.name.toLowerCase().replaceAll(' ', '').replaceAll('-', 's')}.png`
    noti.append(notiImg)

    const notiSection2 = document.createElement('div')
    notiSection2.classList.add('achNotiText')
    notiSection2.style.display = 'none'
    notiSection2.style.opacity = 0
    notiSection2.style.transition = 'opacity ease-in-out 250ms'
    notiSection2.innerHTML = `
    <span>${ach.name}</span><br>
    <span>${ach.desc}</span>
    `
    noti.append(notiSection2)

    doge('achNotiContainer').append(noti)

    noti.style.transition = 'width cubic-bezier(.5,-0.5,.25,1) 500ms, height cubic-bezier(.5,-0.5,.25,1) 500ms, opacity ease-in-out 1s'
    setTimeout(() => {
        if(noti) {
            noti.style.width = '350px'
            noti.style.height = '50px'
            notiSection1.style.opacity = 0
            setTimeout(() => {
                if(noti) {
                    notiSection1.style.display = 'none'
                    notiImg.style.display = 'unset'
                    notiSection2.style.display = 'unset'
                    requestAnimationFrame(() => {
                        notiImg.style.opacity = 1
                        notiSection2.style.opacity = 1
                    })
        
                    setTimeout(() => {
                        if(noti) {
                            noti.style.opacity = 0
                            setTimeout(() => {
                                noti.remove()
                            }, 1000);
                        }
                    }, 3000);
                }
            }, 250);
        }
    }, 1500);

    noti.onclick = () => {
        noti.remove()
    }
}

function getAchievement(ach) {
    if(!achievements[ach].unlocked && (!data.settings.sandbox || data.dev)) {
        createAchNoti(achievements[ach])
        achievements[ach].unlocked = true
        data.achievements.push(ach)

        if(achievements[ach].run) {
            achievements[ach].run()
        }
        saveData()
    }
}

function getAllAchievements() {
    for(const achievement in achievements) {
        if(!achievements[achievement].unlocked) {
            createAchNoti(achievements[achievement])
            achievements[achievement].unlocked = true
        }
    }
}
// getAllAchievements()

//Add achievement textures to load query...

for(const achievement in achievements) {
    imagesToLoad.achievements.push(`media/achievements/${achievements[achievement].name.toLowerCase().replaceAll(' ', '').replaceAll('-', 's')}.png`)
}