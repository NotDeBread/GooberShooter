const defaultData = {
    selectedCharacter: 'debread',
    selectedProfileImg: 'debread-normal.png',
    displayName: '',
    dev: false,
    level: 0,
    xp: 0,
    accountCreationDate: Date.now(),
    
    stats: {
        
        enemiesKilled: 0,
        enemiesKilledByMelee: 0,
        timesParried: 0,
        highestWaveReached: 0,
        highestScore: 0,
        totalScore: 0,
        challengesCompleted: 0,

        upgrades: {},
        activity: [],
    },

    challenges: [],
    challengeRefreshDate: 0,

    unlockedCharacters: ['debread'],
    achievements: [],

    settings: {
        squareExplosions: true,
        simpleExplosions: false,
        particles: false,
        particlelimit: 100,
        screenshake: true,
        sfx: true,
        volume: 1,
        brighness: 1,
        fpsCounter: true,
        menu_transition_speed: 100,
        max_blood_stains: 100,
        keepStatsOpen: true,
        showXP: false,
        showGameOverflow: false,
    
        area_width: 750,
        area_height: 750,
        starting_wave: 0,
        scoreMultiplier: 1,

        shop_choices: 3,

        sandbox: false,
    },

    customEnemies: []
}

const possibleChallenges = [
    {
        name: 'Sharp shooter',
        desc: 'Kill 250 enemies.',
        unit: 'killed',
        goal: 250,
        progress: 0,
        reward: 50000,
        completed: false,
    },
    {
        name: 'Serial Killer',
        desc: 'Kill 500 enemies.',
        unit: 'killed',
        goal: 500,
        progress: 0,
        reward: 100000,
        completed: false,
    },
    {
        name: 'Pro Runner',
        desc: 'Travel 75,000px.',
        unit: 'travel',
        goal: 75000,
        progress: 0,
        reward: 20000,
        completed: false,
    },
    {
        name: 'Marathon Runner',
        desc: 'Travel 250,000px.',
        unit: 'travel',
        goal: 250000,
        progress: 0,
        reward: 50000,
        completed: false,
    },
    {
        name: 'Pro shooter',
        desc: 'Shoot 500 times.',
        unit: 'shoot',
        goal: 500,
        progress: 0,
        reward: 20000,
        completed: false,
    },
    {
        name: 'Reflex Master',
        desc: 'Parry 100 bullets or grenades.',
        unit: 'parry',
        goal: 100,
        progress: 0,
        reward: 25000,
        completed: false,
    },
    {
        name: 'Dancer',
        desc: 'Taunt 50 times.',
        unit: 'taunts',
        goal: 50,
        progress: 0,
        reward: 10000,
        completed: false,
    },
    {
        name: 'Persistent Killer',
        desc: 'Reach 100 combo.',
        unit: '100combo',
        goal: 1,
        progress: 0,
        reward: 25000,
        completed: false,
    },
]

//Save


//Save updater, by RedJive2
function fillInto(a, b) {    
    if (typeof a !== 'object' || typeof b !== 'object') {
        throw new Error("a and b must be object, but got " + String(a) + " and " + String(b) + " (merge)")
    }
 
    for (const k in b) {
        if (typeof b[k] === 'object' && k in a) {
            fillInto(a[k], b[k])
        } else if (!(k in a)) {
            a[k] = b[k]
        }
    }
} 
const data = JSON.parse(localStorage.getItem("GooberShooterSave")) ?? defaultData
fillInto(data, defaultData)

function saveData() {
    localStorage.setItem("GooberShooterSave", JSON.stringify(data))
    console.log(`Game saved.`)

    doge('saveIndicator').style.animation = 'none'
    setTimeout(() => {
        doge('saveIndicator').style.animation = 'fadeOut 1s ease-in-out 1 forwards'
    }, 2500);
}

document.addEventListener('keydown', ev => {if(ev.key.toLowerCase() === 's' && ev.shiftKey) {saveData()}})

function deleteSave() {
    localStorage.removeItem("GooberShooterSave", JSON.stringify(data))
    window.location.reload()
}

//Loading screen

const progressPercent = doge('loadingScreenPercent')
const progressBarGroup = doge('loadingScreenGroupProgress')
const progressBarTotal = doge('loadingScreenTotalProgress')
const progressInfo = doge('loadingScreenInfo')
const progressImg = doge('loadingScreenImg')
const imagesToLoad = {
    characters: [],
    achievements: [],
    upgrades: [],
    gooberDrawings: [],
    misc: [
        'media/bullet.png',
        'media/bulletBig.png',
        'media/error.png',
        'media/gun.png',
        'media/tauntFlash.png',
        'media/blood/blood0.png',
        'media/blood/blood1.png',
        'media/blood/bigBlood0.png',
        'media/saw.png',
        'media/fire.gif',
        'https://soggy.cat/img/soggycat.webp',
        'https://i.redd.it/ztv4vguqi14c1.png',
    ]
}

const imageCache = {}

let imageFailedToLoad = false
function loadTextures(path, next) {
    let loaded = 0
    let total = imagesToLoad[path].length
    for(const image in imagesToLoad[path]) {
        const img = new Image()
        img.onload = () => {
            loaded++
            totalTexturesLoaded++

            progressPercent.innerText = DeBread.round((totalTexturesLoaded / totalTextures) * 100, 1) + '%'
            progressBarTotal.style.width = (totalTexturesLoaded / totalTextures) * 100 + '%'
            progressBarGroup.style.width = (loaded / total) * 100 + '%'
            progressInfo.innerText = `${path}: ${loaded}/${total}`
            if(img.src.includes('media/')) {
                doge('loadingScreenInfo2').innerText = img.src.split('media/')[1]
            } else {
                doge('loadingScreenInfo2').innerText = img.src
            }
            progressImg.src = img.src

            imageCache[img.src] = img

            if(loaded === total) {
                if(next) {
                    setTimeout(() => {
                        next()
                    }, 0);
                } else {
                    setTimeout(() => {                        
                        doge('loadingScreen').style.opacity = 0
                        doge('loadingScreen').style.pointerEvents = 'none'
                        setTimeout(() => {
                            doge('loadingScreen').style.display = 'none'
                            if(imageFailedToLoad) {
                                createNoti('media/error.png', 'An error occured', 'Some textures ran into an error while loading. Some textures may not be displayed.')
                            }
                        }, 500);
                    }, 250);
                }
                // progressInfo.innerText = `${path}: Done!`
            }
        }
        img.onerror = ev => {
            loaded++
            totalTexturesLoaded++
            imageFailedToLoad = true

            if(loaded === total) {
                if(next) {
                    setTimeout(() => {
                        next()
                    }, 0);
                } else {
                    setTimeout(() => {                        
                        doge('loadingScreen').style.opacity = 0
                        doge('loadingScreen').style.pointerEvents = 'none'
                        setTimeout(() => {
                            doge('loadingScreen').style.display = 'none'
                            if(imageFailedToLoad) {
                                createNoti('media/error.png', 'An error occured', 'Textures ran into an error while loading. Some textures may not be displayed correctly.')
                            }
                        }, 500);
                    }, 250);
                }
            }
            console.error('A texture had trouble loading:', ev)
        }
        img.src = imagesToLoad[path][image];
    }
}

function getImage(url) {
    for(const key in imageCache) {
        if(key.endsWith(url)) {
            return imageCache[key]
        }
    }
}