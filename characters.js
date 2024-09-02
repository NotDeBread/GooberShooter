//CHARACTER STUFF

const characterPacks = {
    goober: {
        name: 'Goober Pack',
        color: [103, 45, 219],
    },
    evilGoober: {
        name: 'Evil Goober Pack',
        color: [72, 40, 124],
    },
    extraGoober: {
        name: 'Extra Goober Pack',
        color: [68, 99, 253],
    },
    accumulator: {
        name: 'Accumulator Pack',
        color: [103, 36, 41],
    },
    millerLite: {
        name: 'Miller Lite Pack',
        color: [125, 120, 255],
    },
    shitpost: {
        name: 'Shitpost Pack',
        color: [103, 62, 37],
    },
    internetLegends: {
        name: 'Internet Legends Pack',
        color: [146, 146, 42],
    },
    custom: {
        name: 'Custom Character Pack',
        color: [36, 146, 42],
    },
    alex: {
        name: 'Alex Pack',
        color: [20, 64, 23],
    },
    misc: {
        name: 'Miscellaneous Pack',
        color: [79, 79, 79],
    }
}

const characters = {
    debread: {
        unlocked: true,
        name: 'DeBread',
        desc: 'Some guy',
        getOnStarup: true,
        pack: 'goober',
        taunts: 7,

        tauntTexts: [
            'Wowie',
            'i love ultrakill',
        ]
    },
    arctic_debread: {
        unlocked: false,
        name: 'Arctic DeBread',
        desc: 'This is what some guy would look if he was white.',
        credits: true,
        pack: 'goober',
        code: 'debreadiscool',
        taunts: 4
    },
    plonk: {
        unlocked: false,
        name: 'Plonk',
        credits: true,
        pack: 'goober',
        desc: 'Some other guy',
        tauntTexts: [
            "Brh",
            "I\'m gonna say the n word",
            "Will you shut the fuck up",
            "Go to hell before you die",
            "What if your balls could take a shit",
            "This fucking sucks",
            "Lalalalalala I can\'t hear you",
            "Gorp",
            "Dingus",
            "I am death incarnate",
            "I forgot to wipe",
            "Try pressing mouse 1",
            "Get me out of here",
            "Hhgghhdgghh",
            "Barp",
            "How many tennis balls can you fit in your mouth",
            "Will you be the shredded cheese to my untoasted bread",
            "Fuck off",
            "ZAMN",
        ],
        tauntSounds: ['altTaunt.mp3'],
        font: 'vcr',
        taunts: 14,
        code: 'lotsofswag'
    },
    jaden: {
        unlocked: false,
        name: 'Jaden',
        credits: true,
        pack: 'goober',
        taunts: 3,

        tauntTexts: [
            'Apparently the next assasin\'s creed game takes place in Japan',
            'SEGA declared this year the year of Shadow',
            'Yeah we can go to the beach',
            'You mean in a fight, right?',
            'I crush the alien',
            'I hope they play feel good inc. next',
            'You pee good',
            'It\'s da FREAKIN BAT',
            'Do you fart',
            'Fuuuuck I need to fart',
            'Do you guys watch The Three Stooges',
            'yall wanna single say fuck that',
            'Man does it feel good to undo my buttflaalf',
            'The sky had a pokemon',
            'Curry Chicken',
            'Can I get a- uh',
            'Ooo ooo oooo'
        ],
        code: 'retard'
    },
    peep: {
        unlocked: false,
        name: 'Peep',
        requirement: 'Complete the \'Whoops\' achievement to unlock this character.',
        desc: 'i like men',
        getOnStarup: true,
        pack: 'goober',
        taunts: 2,
    },
    snorp: {
        unlocked: false,
        name: 'Snorp',
        desc: 'The Snorp of a generation',
        credits: true,
        pack: 'goober',
        taunts: 5,
        credits: true,
        code: 'cookiesandcream'
    },
    henry: {
        unlocked: false,
        name: 'Henry',
        getOnStarup: true,
        pack: 'goober'
    },
    udev: {
        unlocked: false,
        name: 'udev',
        pack: 'goober',
        desc: '',
        taunts: 1,
        credits: true,
    },
    nyan: {
        unlocked: false,
        name: 'Nyan',
        desc: 'The world famous magic cat man',
        credits: true,
        pack: 'goober',
        taunts: 11,
        code: 'nyandacat'
    },
    dark_and_twisted_nyan: {
        unlocked: false,
        name: 'Dark and Twisted Nyan',
        pack: 'evilGoober'
    },
    luna: {
        unlocked: false,
        name: 'Luna',
        pack: 'extraGoober',
    },
    lye: {
        unlocked: false,
        credits: true,
        name: 'Lye',
        desc: 'im restarted or whatever you call it',
        pack: 'custom',
        taunts: 3,
        tauntSounds: ['ahh.mp3'],
        code: 'bello',
    },
    asuka: {
        unlocked: false,
        credits: false,
        name: 'Asuka',
        desc: 'Faggot (made by Hugo)',
        pack: 'custom',
        taunts: 3,
    },
    sasha: {
        unlocked: false,
        name: 'Sasha',
        requirement: 'Complete the \'Boxer\' achievement to unlock this character.',
        desc: 'Lord of chaos',
        pack: 'millerLite',
        taunts: 1,
        code: 'chonper'
    },
    // olive: {
    //     unlocked: false,
    //     name: 'Olive',
    //     desc: 'Loaf Incarnate',
    //     pack: 'millerLite',
    //     taunts: 0,
    // },
    pixel_olive: {
        unlocked: false,
        name: 'Pixel Olive',
        desc: 'Loaf Incarnate (8-bit)',
        pack: 'millerLite',
        taunts: 0,
    },
    normal: {
        unlocked: false,
        name: 'Normal',
        requirement: 'Complete the \'Fire In The Hole\' achievement to unlock this character.',
        desc: '🔥🕳️‼️‼️‼️🗣️🗣️',
        credits: false,
        pack: 'shitpost',
        taunts: 1,
    },
    uni: {
        unlocked: false,
        name: 'Uni',
        desc: 'The greatest cat',
        requirement: 'Complete the \'Stylish\' achievement to unlock this character.',
        credits: false,
        pack: 'internetLegends',
    },
    big_floppa: {
        unlocked: false,
        name: 'Big Floppa',
        requirement: 'Complete the \'Flashy\' achievement to unlock this character.',
        desc: 'The flopper',
        credits: false,
        pack: 'internetLegends',
    },
    car: {
        unlocked: false,
        name: 'car',
        requirement: 'Complete the \'Fancy\' achievement to unlock this character.',
        desc: 'Hello my name is car',
        credits: false,
        taunts: 3,
        pack: 'internetLegends',

        tauntTexts: [
            'backflip',
            'I\'m Car!',
            'Hello everyone!',
            'I like to sing.',
            'CAR',
            'hahehe',
            ':)',
        ],
        hasTauntAudio: true,
    },
    baseball: {
        unlocked: false,
        name: 'Baseball',
        credits: false,
        pack: 'alex',
    },
    dood: {
        unlocked: false,
        name: 'DooD',
        credits: false,
        pack: 'alex',
    },
    conors: {
        unlocked: false,
        name: 'Conors',
        credits: false,
        pack: 'alex',
        taunts: 1,
    },
    brick: {
        unlocked: false,
        name: 'Brick',
        requirement: 'Complete the \'Show Off\' achievement to unlock this character.',
        pack: 'misc',
        taunts: 1,
    },
    guy: {
        unlocked: false,
        name: 'Guy',
        desc: 'Guy',
        pack: 'misc',
        taunts: 1,
        noLookingDirections: true,
        customBulletTexture: 'media/guyBullet.png'
    },
    // template: {
    //     unlocked: true,
    //     name: 'Template',
    //     desc: 'You shouldn\'t have this...',
    //     pack: 'misc'
    // }
}
const characterNames = []
for(const character in characters) {characterNames.push(character.toString())}

//Unlock all characters in save
for(const character in characters) {
    if(data.unlockedCharacters.includes(character)) {
        unlockCharacter(characters[character], true)
    }
}

function renderCharacterSelection() {
    doge('characterInfoTitle').innerText = characters[data.selectedCharacter].name
    if(characters[data.selectedCharacter].desc) {
        doge('characterInfoDesc').innerText = characters[data.selectedCharacter].desc
    } else {
        doge('characterInfoDesc').innerText = ''
    }

    doge('characterInfoImg').src = `media/characters/${characters[data.selectedCharacter].name.toLowerCase().replaceAll(' ', '_')}-normal.png`
    doge('characterTag').innerText = characterPacks[characters[data.selectedCharacter].pack].name
    doge('characterTag').style.outline = `2px solid rgb(${characterPacks[characters[data.selectedCharacter].pack].color[0]}, ${characterPacks[characters[data.selectedCharacter].pack].color[1]}, ${characterPacks[characters[data.selectedCharacter].pack].color[2]})`
    doge('characterTag').style.backgroundColor = `rgb(${characterPacks[characters[data.selectedCharacter].pack].color[0]}, ${characterPacks[characters[data.selectedCharacter].pack].color[1]}, ${characterPacks[characters[data.selectedCharacter].pack].color[2]}, 0.5)`


    doge('characterSelectContainer').innerHTML = ''
    for(const key in characters) {
        const button = document.createElement('img')
        button.src = `media/characters/${characters[key].name.toLowerCase().replaceAll(' ', '_')}-normal.png`
        const packColor = `rgb(${characterPacks[characters[key].pack].color[0]}, ${characterPacks[characters[key].pack].color[1]}, ${characterPacks[characters[key].pack].color[2]}, 1)`
        button.classList.add('characterSelect')
        button.style.outline = `2px solid ${packColor}`
        button.style.backgroundColor = `rgb(${characterPacks[characters[key].pack].color[0]}, ${characterPacks[characters[key].pack].color[1]}, ${characterPacks[characters[key].pack].color[2]}, 0.5)`

        if(data.selectedCharacter === key) {
            button.style.outline = '2px solid white'
        }
        if(!characters[key].unlocked) {button.style.filter = 'grayscale() brightness(50%)'}
        doge('characterSelectContainer').append(button)

        //BUTTON ENTER

        button.onmouseenter = () => {
            DeBread.playSound('media/audio/buttonHover.mp3')
            doge('characterInfoTitle').innerText = characters[key].name
            if(characters[key].desc) {
                if(characters[key].requirement && !characters[key].unlocked) {
                    doge('characterInfoDesc').innerText = characters[key].requirement
                } else {
                    doge('characterInfoDesc').innerText = characters[key].desc
                }
            } else {
                doge('characterInfoDesc').innerText = ''
            }
            doge('characterInfoID').innerText = '#'+key

            doge('characterInfoImg').src = `media/characters/${characters[key].name.toLowerCase().replaceAll(' ', '_')}-normal.png`
            doge('characterTag').style.opacity = 1
            doge('characterTag').innerText = characterPacks[characters[key].pack].name
            doge('characterTag').style.outline = `2px solid rgb(${characterPacks[characters[key].pack].color[0]}, ${characterPacks[characters[key].pack].color[1]}, ${characterPacks[characters[key].pack].color[2]})`
            doge('characterTag').style.backgroundColor = `rgb(${characterPacks[characters[key].pack].color[0]}, ${characterPacks[characters[key].pack].color[1]}, ${characterPacks[characters[key].pack].color[2]}, 0.5)`

            if(characters[key].taunts) {
                if(characters[key].taunts === 1) {
                    doge('characterTauntable').innerText = `1 Taunt`
                } else {
                    doge('characterTauntable').innerText = `${characters[key].taunts} Taunts`
                }
            } else {
                doge('characterTauntable').innerText = `No Taunts`
            }

            if(!characters[key].unlocked) {
                doge('characterInfoImg').style.filter = 'grayscale() brightness(50%)'
            } else {
                doge('characterInfoImg').style.filter = 'none'
            }
            doge('characterTauntable').style.opacity = 1


            //Fart site
            fartSiteCheck()

            //Button hover because css is being a bitch
            button.style.outline = '2px solid white'
        }

        button.onmouseleave = () => {
            if(data.selectedCharacter !== key) {
                button.style.outline = `2px solid ${packColor}`
            }
        }
        
        //BUTTON CLICK
        
        if(characters[key].unlocked) {
            button.onclick = () => {
                data.selectedCharacter = key
                let iterations = 0
                doge('characterSelectContainer').querySelectorAll('img').forEach(button => {
                    if(parseInt(key) === iterations) {
                        button.style.backgroundColor = 'white'
                    } else {
                        button.style.backgroundColor = button.baseColor
                    }
                    iterations++
                })
                
                if(data.selectedCharacter === 'nyan') {
                    unlockCharacter(characters['dark_and_twisted_nyan'])      
                }
                
                DeBread.playSound('media/audio/buttonClick.mp3', 0.8)
                renderCharacterSelection()
                saveData()
            }
        }

        button.onmousedown = () => {
            DeBread.playSound('media/audio/buttonPress.mp3', 0.8)
        }
    }

    const templateButton = document.createElement('a')
    templateButton.classList.add('characterSelect')
    templateButton.innerText = '+'

    templateButton.onmouseenter = () => {
        DeBread.playSound('media/audio/buttonHover.mp3')
        doge('characterInfoImg').src = `media/placeholder/idk.png`
        doge('characterInfoTitle').innerText = 'Create a custom character'    
        doge('characterInfoDesc').innerText = 'Download a template and create your own character.'
        doge('characterInfoID').innerText = ''
        doge('characterTag').style.opacity = 0
        doge('characterTauntable').style.opacity = 0
        templateButton.style.textDecoration = 'none'
    }

    templateButton.onclick = () => {
        DeBread.playSound('media/audio/buttonClick.mp3', 0.8)
        openMenu('createCharacter')
    }

    doge('characterSelectContainer').append(templateButton)

    if(data.dev) {
        const unlockButton = document.createElement('a')
        unlockButton.classList.add('characterSelect')
        unlockButton.innerText = '🔓'
        unlockButton.onmouseenter = () => {
            DeBread.playSound('media/audio/buttonHover.mp3')
            doge('characterInfoImg').src = `media/placeholder/idk.png`
            doge('characterInfoTitle').innerText = 'Unlock all characters'
            doge('characterInfoDesc').innerText = ''
            doge('characterInfoID').innerText = ''
            doge('characterTag').style.opacity = 0
            doge('characterTauntable').style.opacity = 0
            unlockButton.style.textDecoration = 'none'
        }
    
        unlockButton.onclick = () => {
            DeBread.playSound('media/audio/buttonClick.mp3', 0.8)
            unlockAllCharacters()
        }
    
        doge('characterSelectContainer').append(unlockButton)
    }
}

if(!characters.debread.unlocked) {
    createNoti(`media/characters/debread-normal.png`, `DeBread Unlocked!`, 'You can change your character in the main menu.')
}

function fartSiteCheck() {
    if(doge('characterInfoImg').src.includes('media/characters/plonk-normal.png')) {
        doge('characterInfoImg').onclick = () => {
            getAchievement('funny')
            window.open('GooberShooter/fart/', '_self')
        }
        doge('characterInfoImg').style.cursor = 'pointer'
    } else {
        doge('characterInfoImg').onclick = undefined
        doge('characterInfoImg').style.cursor = 'unset'
    }
}

function unlockCharacter(character, silent) {
    if(!character.unlocked) {
        character.unlocked = true
        data.unlockedCharacters.push(character.name.replaceAll(' ','_').toLowerCase())
        data.stats.activity.push([`& unlocked ${character.name}.`, Date.now()])
        if(!silent) {
            createNoti(`media/characters/${character.name.toLowerCase().replaceAll(' ', '_')}-normal.png`, `${character.name} Unlocked!`, 'You can change your character in the main menu.')
            saveData()
        }
        renderCharacterSelection()
    }
}

function unlockAllCharacters() {
    let i = 1
    for(const character in characters) {
        setTimeout(() => {            
            unlockCharacter(characters[character])
        // if(!characters[character].unlocked) {
            //     characters[character].unlocked = true
            //     createNoti(`media/characters/${characters[character].name.toLowerCase().replaceAll(' ', '_')}-normal.png`, `${characters[character].name} Unlocked!`, 'You can change your character in the main menu.')
            //     renderCharacterSelection()
            // }
        }, i * 50);
        i++
    }
}

function tryCode() {
    let successful = false
    for(const key in characters) {
        const character = characters[key]
        if(doge('characterCodeInput').value === character.code) {
            unlockCharacter(character)
            successful = true
        }
    }
    if(!successful) {
        createNoti(undefined, 'Invalid code', 'No characters were unlocked.')
    }
}

//Add character textures to load query...
const lookingDirections = [
    'normal', 
    'up', 
    'down',
    'left',
    'right',
    'upleft',
    'downleft',
    'downright',
    'upright',
    'upleft'
]
for(const character in characters) {
    if(!characters[character].noLookingDirections) {
        for(direction in lookingDirections) {
            imagesToLoad.characters.push(`media/characters/${characters[character].name.toLowerCase().replaceAll(' ', '_')}-${lookingDirections[direction]}.png`)
        }
    } else {
        imagesToLoad.characters.push(`media/characters/${characters[character].name.toLowerCase().replaceAll(' ', '_')}-normal.png`)
    }
    if(characters[character].taunts) {
        for(let i = 1; i < characters[character].taunts + 1; i++) {
            imagesToLoad.characters.push(`media/characters/${characters[character].name.toLowerCase().replaceAll(' ', '_')}-taunt${i}.png`)
        }
    }
}