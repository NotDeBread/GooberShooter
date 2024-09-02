let selectedMenu = 'main'

//TITLE SCREEN EFFECT
let titleText = 'Goober Shooter'

for(const char in titleText) {
    const letter = document.createElement('div')
    letter.innerText = titleText[char]
    if(titleText[char] === ' ') {
        letter.style.width = '10px'
    }

    letter.style.animation = `charWave 2s ease-in-out -${char * 50}ms infinite forwards`
    doge('mainTitleScreenTitle').append(letter)
}

//MENU SOUNDS
document.body.querySelectorAll('button').forEach(button => {
    button.onmouseenter = () => {DeBread.playSound('media/audio/buttonHover.mp3')}
    button.addEventListener('click', () => {
        DeBread.playSound('media/audio/buttonClick.mp3', 0.8)
    })
    button.onmousedown = () => {
        DeBread.playSound('media/audio/buttonPress.mp3', 0.8)
    }
})

document.body.querySelectorAll('input[type="range"]').forEach(input => {
    input.addEventListener('input', () => {
        DeBread.playSound('media/audio/sliderTick.mp3', 0.5)
    })
})

document.body.querySelectorAll('video').forEach(video => {
    video.volume = 0.1
})

let gooberInterval
function openMenu(menu) {
    document.querySelectorAll('.genericMenu').forEach(menu => {
        menu.style.transition = `filter ease-in-out ${data.settings.menu_transition_speed}ms`
    })

    const nextMenu = doge(`menu-${menu}`)
    const currentMenu = doge(`menu-${selectedMenu}`)
    selectedMenu = menu
    
    nextMenu.style.filter = 'brightness(0%)'
    nextMenu.style.pointerEvents = 'none'
    
    currentMenu.style.pointerEvents = 'none'
    currentMenu.style.filter = 'brightness(0%)'
    
    setTimeout(() => {
        currentMenu.style.display = 'none'
        nextMenu.style.display = 'flex'
        setTimeout(() => {
            nextMenu.style.filter = 'brightness(100%)'
            nextMenu.style.pointerEvents = 'unset'
            
            if(menu === 'main') {
                game.querySelectorAll('enemy').forEach((enemy) => {enemy.kill(false)})
                disableInput = true

                document.title = 'Goober Shooter - Main Menu'

                //Get rid of the goober drawings

                clearInterval(gooberInterval)
                document.querySelectorAll('.creditsImg').forEach(img => {
                    img.remove()
                })

                updateMenuProfile()
                renderDailyChallenges()
            }

            if(menu === 'game') {
                updateAreaPreview()
                doge('Starting-Wave').setAttribute('max', DeBread.round(data.stats.highestWaveReached / 2))

                if(DeBread.round(data.stats.highestWaveReached / 2) >= 100) {
                    doge('Starting-Wave').setAttribute('step', 10)
                } else if(DeBread.round(data.stats.highestWaveReached / 2) >= 100) {
                    doge('Starting-Wave').setAttribute('step', 5)
                } else {
                    doge('Starting-Wave').setAttribute('step', 1)
                }

                if(DeBread.round(data.stats.highestWaveReached / 2) === 0) {
                    doge('Starting-Wave').style.filter = 'brightness(50%)'
                } else {
                    doge('Starting-Wave').style.filter = 'unset'
                }

                document.title = `Goober Shooter - Game Settings`

            }

            if(menu === 'play') {

                //Apply game settings
                game.style.width = data.settings.area_width+'px'
                game.style.height = data.settings.area_height+'px'
                gameCanvas.width = data.settings.area_width
                gameCanvas.height = data.settings.area_height

                //Reset game contents
                displayedPoints = 0
                enemiesAlive = 0
                totalEnemies = 0
                enemyInfo.speedMultiplier = 1
                enemyInfo.damageMultiplier = 1
                enemyInfo.radient = false
                currentWaveSize = data.settings.starting_wave
                resetPlayer()
                update()
                updateUI()
                game.querySelectorAll('enemy').forEach((enemy) => {enemy.kill(false)})
                game.querySelectorAll('.bloodStain').forEach(stain => {stain.remove()})
                game.querySelectorAll('.beam').forEach(beam => {beam.remove()})
                playerD.style.opacity = 1
                gunD.style.opacity = 1
                blockHitbox.style.opacity = 1

                disableInput = false
                gameActive = true
                game.querySelectorAll('.sawblade').forEach(saw => {
                    clearInterval(saw.interval)
                    saw.remove()
                })

                if(!data.settings.keepStatsOpen) {
                    doge('statsContainer').style.left = -doge('statsContainer').offsetWidth + 'px'
                }

                //Clear styles
                doge('styleUI').innerHTML = ''

                //Sandbox mode check
                if(data.settings.sandbox) {
                    doge('toolboxContainer').style.display = 'flex'
                } else {
                    doge('toolboxContainer').style.display = 'none'
                    openShop(data.settings.shop_choices + 2, false)
                }

                if(!data.settings.sandbox) {
                    document.title = `Goober Shooter - Wave ${data.settings.starting_wave}`
                } else {
                    document.title = `Goober Shooter - Sandbox`
                }
                doge('ui').style.opacity = 1
            } else {
                doge('ui').style.opacity = 0
            }

            if(menu === 'character') {
                renderCharacterSelection()
                document.title = `Goober Shooter - Characters`
            }

            if(menu === 'credits') {
                let i = 0
                for(let key in characters) {
                    if(characters[key].credits && !characters[key].unlocked) {
                        setTimeout(() => {                            
                            unlockCharacter(characters[key])
                        }, i * 100);
                        i++
                    }
                }

                gooberInterval = setInterval(() => {
                    const goob = document.createElement('img')
                    goob.classList.add('creditsImg')
                    goob.src = `media/gooberDrawings/${DeBread.randomNum(0, 45)}.png`
                    goob.style.top = window.innerHeight + 'px'
                    doge('bgCredits').append(goob)
                
                    setTimeout(() => {
                        goob.style.left = DeBread.randomNum(0, window.innerWidth - goob.offsetWidth) + 'px'
                        goob.style.top = DeBread.randomNum(100, 500) + 'px'
                    }, 100)

                    setTimeout(() => {
                        goob.style.opacity = 0
                        setTimeout(() => {
                            goob.remove()
                        }, 1000);
                    }, 9000);
                }, 2500)
                document.title = `Goober Shooter - Credits`
            }

            if(menu === 'achievements') {
                let achievementsGot = 0
                let totalAchievements = 0
                for(const achievement in achievements) {
                    if(achievements[achievement].unlocked) {achievementsGot++}
                    totalAchievements++
                }

                doge('achievementsContainer').innerHTML = ''
                for(const achievement in achievements) {
                    const div = document.createElement('div')

                    let achievementDesc = achievements[achievement].desc
                    if(achievements[achievement].secret && !achievements[achievement].unlocked) {achievementDesc = '???'}

                    div.innerHTML = `
                    <div class="achievement">
                        <img src="media/achievements/${achievements[achievement].name.replaceAll(' ','').replaceAll('-','S')}.png">
                        <div class="achievementText">
                            <span>${achievements[achievement].name}</span><br>
                            <span>${achievementDesc}</span>
                        </div>
                    </div>
                    `

                    if(!achievements[achievement].unlocked) {
                        div.style.filter = 'grayscale() brightness(50%)'
                    }

                    doge('achievementsContainer').append(div)
                }

                const achievementProgressBar = document.createElement('div')
                achievementProgressBar.classList.add('achievementProgressBar')
                achievementProgressBar.innerHTML = `
                <div id="innerAchievementProgressBar" style="width: ${DeBread.round(achievementsGot / totalAchievements * 100)}%"></div>
                <span id="achievementProgressBarText">${achievementsGot}/${totalAchievements} (${DeBread.round(achievementsGot / totalAchievements * 100)}%)</span>
                `
                doge('achievementsContainer').append(achievementProgressBar)

                if(achievementsGot === totalAchievements) {
                    setTimeout(() => {
                        achievementProgressBar.classList.add('rareUpgrade')
                        const rect = achievementProgressBar.getBoundingClientRect()
                        DeBread.createParticles(
                            doge('menu-achievements'),
                            500,
                            0,
                            1000,
                            'ease-out',
                            [[rect.left, rect.right - 10], [rect.top, rect.bottom - 10]],
                            [[[10, 10], [10, 10]], [[0, 0], [0, 0]]],
                            [[0, 90], [0, 180]],
                            [[-50, 50], [-50, 50]],
                            [[100, 100, 100], [255, 255, 255]],
                            [[100, 100, 100], [255, 255, 255]],
                            true
                        )
                        DeBread.easeShake(achievementProgressBar, 10, 5, 0.5)
                    }, 2500);
                }

                document.title = `Goober Shooter - Achievements`
            }

            if(menu === 'changelogs') {
                document.title = `Goober Shooter - Changelogs`        
            }

            if(menu === 'stats') {            
                document.title = `Goober Shooter - Stats`
                let name = data.displayName
                if(data.displayName === '') {
                    name = 'Player'
                }
                doge('statMenuTitle').innerText = `${name}'s STATISTICS`
                doge('statDisplayName').innerText = name

                doge('statEnemiesKilled').innerText = data.stats.enemiesKilled
                doge('statMeleeKills').innerText = data.stats.enemiesKilledByMelee
                doge('statTimesParried').innerText = data.stats.timesParried
                doge('statDamageTaken').innerText = formatNumber(DeBread.round(data.stats.damageTaken))
                doge('statHealthHealed').innerText = formatNumber(DeBread.round(data.stats.healthHealed))
                doge('statHighestWave').innerText = data.stats.highestWaveReached
                doge('statHighScore').innerText = formatNumber(DeBread.round(data.stats.highestScore))
                doge('statTotalScore').innerText = formatNumber(DeBread.round(data.stats.totalScore))
                doge('statTotalXP').innerText = formatNumber(DeBread.round(data.xp))
                doge('statChallengesCompleted').innerText = data.stats.challengesCompleted
                let totalUpgrades = 0
                for(const key in data.stats.upgrades) {
                    totalUpgrades += data.stats.upgrades[key]
                }
                doge('statUpgradesBought').innerText = totalUpgrades

                //Upgrade Stats
                if(Object.keys(data.stats.upgrades).length > 0) {
                    doge('upgradesBoughtContainer').innerHTML = ''
                    const sortedUpgrades = Object.entries(data.stats.upgrades).sort((a, b) => b[1] - a[1])
                    for(const key in sortedUpgrades) {
                        const statDiv = document.createElement('div')
                        statDiv.classList.add('upgradesBoughtUpgrade')
                        if(sortedUpgrades[key][1] / sortedUpgrades[0][1] * 100 > 10) {
                            statDiv.innerHTML = `
                                <img src="media/upgrades/${sortedUpgrades[key][0].replaceAll(' ','_')}.png">
                                <div class="upgradesBoughtBar">
                                    <div class="upgradesBoughtInnerBar" style="width: ${sortedUpgrades[key][1] / sortedUpgrades[0][1] * 100}%;">
                                        <span>${sortedUpgrades[key][1]}</span>
                                    </div>
                                </div>
                            `
                        } else {
                            statDiv.innerHTML = `
                            <img src="media/upgrades/${sortedUpgrades[key][0].replaceAll(' ','_')}.png">
                            <div class="upgradesBoughtBar">
                                <div class="upgradesBoughtInnerBar" style="width: ${sortedUpgrades[key][1] / sortedUpgrades[0][1] * 100}%;"></div>
                                <span>${sortedUpgrades[key][1]}</span>
                            </div>
                        `
                        }
                        doge('upgradesBoughtContainer').append(statDiv)
                    }
                } else {
                    doge('upgradesBoughtContainer').innerHTML = 'You haven\'t bought any upgrades yet!'
                }

                //Profile
                doge('statProfileImg').src = `media/characters/${data.selectedProfileImg}`
                doge('statLevel').innerText = `Level ${data.level}`
                const currentLevelXP = getCompoundXP(data.level)
                const nextLevelXP = getCompoundXP(data.level + 1)
                const xpPercentage = (data.xp - currentLevelXP) / (nextLevelXP - currentLevelXP) * 100
            
                doge('statXPProgress').innerText = `${DeBread.round(data.xp - currentLevelXP).toLocaleString()} / ${DeBread.round(nextLevelXP - currentLevelXP).toLocaleString()} XP`
                doge('statInnerLevelBar').style.width = xpPercentage + '%'
                
                const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                const now = new Date(data.accountCreationDate);
                doge('statCreationDate').innerText = `Account created ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`

                //XP Graph
                const canvas = doge('xpGraph')
                const graphData = data.stats.xpChanges
                const graphCTX = canvas.getContext('2d')
                const canvasWidth = canvas.width
                const canvasHeight = canvas.height
                const maxValue = Math.max(...graphData) * 1.1
                const widthPerPoint = canvasWidth / (graphData.length - 1)
                
                graphCTX.clearRect(0, 0, canvasWidth, canvasHeight)

                graphCTX.beginPath()
                graphCTX.moveTo(0, canvasHeight)
                graphCTX.strokeStyle = 'white'
                graphCTX.lineWidth = 2 
                
                for (let i = 0; i < graphData.length; i++) {
                    const percentOfMax = graphData[i] / maxValue
                    graphCTX.lineTo(
                        widthPerPoint * i,
                        canvasHeight - (canvasHeight * percentOfMax)
                    )
                    console.log(i)
                }
                
                graphCTX.lineTo(canvasWidth, canvasHeight)
                graphCTX.lineTo(0, canvasHeight)

                const gradient = graphCTX.createLinearGradient(0, 0, 0, canvasHeight)
                gradient.addColorStop(0, 'grey')
                gradient.addColorStop(1, 'transparent')
                graphCTX.fillStyle = gradient
                graphCTX.fill()
                graphCTX.stroke()

                //XP Graph points
                doge('xpGraphContainer').querySelectorAll('.xpGraphPoint').forEach(point => {point.remove()})
                for (let i = 0; i < graphData.length; i++) {
                    const percentOfMax = graphData[i] / maxValue
                    const point = document.createElement('div')
                    point.classList.add('xpGraphPoint')
                    point.style.left = widthPerPoint * i + 'px'
                    point.style.top = canvasHeight - (canvasHeight * percentOfMax) + 'px'
                    doge('xpGraphContainer').append(point)
                }

                //Activity

                doge('statActivityContainer').innerHTML = ''
                if(data.stats.activity.length > 0) {
                    for(const key in data.stats.activity) {
                        const date = new Date(data.stats.activity[key][1])
                        const div = document.createElement('div')
                        div.classList.add('statActivity')
                        div.innerHTML = `
                            <span>${data.stats.activity[key][0].replaceAll('&', name)}</span>
                            <em style="font-size: 0.75em; color: grey;">${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}</em>
                        `
                        doge('statActivityContainer').append(div)
                    }
                    doge('statActivityContainer').scrollTop = -9999999
                } else {
                    doge('statActivityContainer').innerHTML = 'You haven\'t done anything notable yet!'
                }
            }

            if(menu !== 'play') {
                player.health = player.maxHealth
            }
        }, 100);
    }, data.settings.menu_transition_speed);

    doge('deathVideo').currentTime = 0
    doge('deathVideo').pause()
    doge('deathVideo').style.opacity = 0
}

// data.settings.sandbox = true
// openMenu('achievements')
// openMenu('play')

function openProfileImgPicker() {
    doge('profileImgPickerContainer').style.display = 'flex'
    doge('profileImgPicker').innerHTML = ''
    
    function createButton(url) {
        const button = document.createElement('div')
        button.classList.add('profileImgButton')
        button.innerHTML = `<img src="media/characters/${url}">`
        doge('profileImgPicker').append(button)

        button.onmouseenter = () => {DeBread.playSound('media/audio/buttonHover.mp3')}
        button.addEventListener('click', () => {
            DeBread.playSound('media/audio/buttonClick.mp3', 0.8)
            doge('profileImgPickerContainer').style.display = 'none'
            doge('profileImg').src = `media/characters/${url}`
            data.selectedProfileImg = url
            saveData()
        })
        button.onmousedown = () => {
            DeBread.playSound('media/audio/buttonPress.mp3', 0.8)
        }
    }

    createButton(`${data.selectedCharacter}-normal.png`)
    for(let i = 1; i < characters[data.selectedCharacter].taunts + 1; i++) {
        createButton(`${data.selectedCharacter}-taunt${i}.png`)
    }
}
doge('profileImg').src = `media/characters/${data.selectedProfileImg}`

function updateMenuProfile() {
    doge('profileName').value = data.displayName

    if(Math.floor(data.level / 10) <= 10) {
        doge('profileLevelBadge').src = `media/levelBadges/${Math.floor(data.level / 10)}.png`
        doge('profileLevelBadge').title = `Level Badge ${Math.floor(data.level / 10)}`
    } else {
        doge('profileLevelBadge').src = `media/levelBadges/10.png`
        doge('profileLevelBadge').title = `Level Badge 10+`
    }
    doge('profileLevel').innerText = `Level ${data.level}`

    const currentLevelXP = getCompoundXP(data.level)
    const nextLevelXP = getCompoundXP(data.level + 1)

    const xpPercentage = (data.xp - currentLevelXP) / (nextLevelXP - currentLevelXP) * 100
    doge('profileLevelProgress').innerText = `${DeBread.round(data.xp - currentLevelXP).toLocaleString()} / ${DeBread.round(nextLevelXP - currentLevelXP).toLocaleString()} XP`
    doge('innerProfileLevelBar').style.width = xpPercentage + '%'
} updateMenuProfile()

doge('profileName').addEventListener('keyup', () => {
    data.displayName = doge('profileName').value
    saveData()
})

for(const setting in data.settings) {
    if(doge(`setting-${setting}`)) {
        const button = doge(`setting-${setting}`)
        if(data.settings[setting] === true) {
            button.style.backgroundColor = 'white'
            button.style.color = 'black'
            
            button.onclick = () => {
                changeSetting(setting, false)
                updateAreaPreview()
            }
        } else {
            button.style.backgroundColor = 'black'
            button.style.color = 'white'
    
            button.onclick = () => {
                changeSetting(setting, true)
                updateAreaPreview()
            }
        }
    }
}

const audioTracks = [
    'Menu'
]
const musicCache = {}
let currentTrack = undefined

for(let i = 0; i < audioTracks.length; i++) {  //Load all music
    const audio = new Audio(`media/audio/music/${audioTracks[i]}.mp3`)
    audio.volume = 0.05
    audio.loop = true
    let loadCheck = setInterval(() => {
        if(audio.readyState === 4) {
            musicCache[audioTracks[i]] = audio
            clearInterval(loadCheck)
        }
    }, 100)
}

function changeMusic(track) {
    if(currentTrack) {
        musicCache[currentTrack].pause()
        musicCache[currentTrack].currentTime = 0
    }
    musicCache[track].play()
    currentTrack = track
}

const changelogs = [
    'Initial Release',
    'Playtest v0.02',
    'Playtest v0.03',
    'Playtest v0.04',
    'Playtest v0.05',
    'v1.00',
    'v1.01',
    'v1.02'
]
let selectedChangelog = changelogs.length - 1
function renderChangelog(key) {

    doge('changelogSeekNext').onclick = () => {
        if(selectedChangelog + 1 > changelogs.length - 1) {
            selectedChangelog = 0
        } else {
            selectedChangelog++
        }

        renderChangelog(selectedChangelog)
    }

    doge('changelogSeekPrev').onclick = () => {
        if(selectedChangelog - 1 < 0) {
            selectedChangelog = changelogs.length - 1
        } else {
            selectedChangelog--
        }

        renderChangelog(selectedChangelog)
    }

    doge('innerChangelog').innerHTML = ''
    function countIndents(line) {
        const regex = /^(\s+)/
        const match = regex.exec(line);
        return match ? match[1].length : 0
    }

    function readFileAsText(callback) {
        fetch('changelog.cng')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch file')
                }
                return response.text()
            })
            .then(text => {
                callback(text)
            })
            .catch(error => {
                console.error('Error fetching file:', error)
                callback('')
            });
    }
    
    readFileAsText(function(content) {
        const changelogList = content.split('{newLog}')

        const log = changelogList[key]

        const logLines = log.split('\n')

        let hitActualLine = false
        for(const line in logLines) {
            const divLine = document.createElement('div')
            divLine.style.marginLeft = countIndents(logLines[line]) * 5 + 'px'

            if(logLines[line] === '\r' && hitActualLine) {divLine.style.height = '25px'}
            if(logLines[line].startsWith('**') || logLines[line].startsWith('##')) {divLine.style.fontWeight = '700'}
            if(logLines[line].startsWith('##')) {divLine.style.fontSize = '1.25em'}
            if(!logLines[line].startsWith('\r')) {hitActualLine = true}
            
            divLine.innerText = logLines[line].replace(/^(\s+)/gm, ' ').replaceAll('**', '').replaceAll('##', '')

            if(!logLines[line].startsWith('# ')) {
                doge('innerChangelog').append(divLine)
            }
        }
    })

    doge('changelogVersionNumber').innerText = changelogs[key]
} renderChangelog(selectedChangelog)

function changeSetting(setting, value) {
    data.settings[setting] = value

    const button = doge(`setting-${setting}`)
    
    if(value === true) {
        button.style.backgroundColor = 'white'
        button.style.color = 'black'
    } else {
        button.style.backgroundColor = 'black'
        button.style.color = 'white'
    }
    doge(`setting-${setting}`).onclick = () => {changeSetting(setting, !value); updateAreaPreview()}

    if(data.settings.fpsCounter) {
        doge('dbFPS').style.display = 'unset'
    } else {
        doge('dbFPS').style.display = 'none'
    }

    if(setting === 'particles') {
        if(value) {
            doge('particleLimitContainer').style.opacity = 1
            doge('particleLimitContainer').style.pointerEvents = 'unset'
        } else {
            doge('particleLimitContainer').style.opacity = 0
            doge('particleLimitContainer').style.pointerEvents = 'none'
        }
    }
}

if(data.settings.particles) {
    doge('particleSlider').style.opacity = 1
    doge('particleSlider').style.pointerEvents = 'unset'
} else {
    doge('particleSlider').style.opacity = 0
    doge('particleSlider').style.pointerEvents = 'none'
}

DeBread.createParticles(
    document.body,
    1,
    0,
    10000,
    'linear',
    [[0, 0], [0, 0]],
    [[[5, 5], [5, 5]], [[5, 5], [5, 5]]],
    [[0, 0], [0, 0]],
    [[0, 0], [0, 0]],
    [[255, 255, 255], [255, 255, 255]],
    [[255, 255, 255], [255, 255, 255]]
)

document.body.style.filter = `brightness(${data.settings.brightness})`
doge('ashbaby').style.opacity = (data.settings.brightness / 3) - 3

//GENERIC SLIDERS //me when im eating some ok small sandwiches
document.querySelectorAll('input').forEach(range => {
    if(range.type === 'range') {
        const rangeSetting = range.id.replace('range-', '')
        range.value = data.settings[rangeSetting.toLowerCase().replaceAll('-','_')]
        doge(`rangeText-${rangeSetting}`).innerText = `${rangeSetting.replaceAll('-',' ')}: ${range.value}`
        range.oninput = () => {
            data.settings[rangeSetting.toLowerCase().replaceAll('-','_')] = parseFloat(range.value)
            doge(`rangeText-${rangeSetting}`).innerText = `${rangeSetting.replaceAll('-',' ')}: ${range.value}`
            updateAreaPreview()
            saveData()

            //Brigtness
            document.body.style.filter = `brightness(${data.settings.brightness})`
            doge('ashbaby').style.opacity = (data.settings.brightness / 3) - 3

            if(data.settings.brightness > 9) {
                getAchievement('theLight')
            }
        }
    }
})

if(data.settings.fpsCounter) {
    doge('dbFPS').style.opacity = 1
    doge('dbFPSMS').style.opacity = 1
} else {
    doge('dbFPS').style.opacity = 0
    doge('dbFPSMS').style.opacity = 0
}

if(data.settings.fullscreen) {
    document.body.requestFullscreen()
}

//GENERIC CHECKBOXES //me when im just making sure a box is ok
document.querySelectorAll('.genericCheckbox').forEach(checkbox => {
    if(checkbox.id.startsWith('scb')) {
        const setting = checkbox.id.replace('scb-','')
        //Set to current values
        checkbox.checked = data.settings[setting]
        checkbox.setAttribute('checked', checkbox.checked) //idk either
        
        //On click stuff
        checkbox.onclick = () => {
            checkbox.checked = !checkbox.checked
            checkbox.setAttribute('checked', checkbox.checked)
            data.settings[setting] = checkbox.checked
            saveData()

            if(checkbox.checked) {
                DeBread.playSound('media/audio/checkboxCheck.mp3')
            } else {
                DeBread.playSound('media/audio/checkboxUncheck.mp3')
            }

            //Display particle slider if particles are enabled
            if(data.settings.particles) {
                doge('particleSlider').style.opacity = '1'
                doge('particleSlider').style.pointerEvents = 'unset'
            } else {
                doge('particleSlider').style.opacity = '0'
                doge('particleSlider').style.pointerEvents = 'none'
            }

            //Display fps counter if enabled
            if(data.settings.fpsCounter) {
                doge('dbFPS').style.opacity = 1
                doge('dbFPSMS').style.opacity = 1
            } else {
                doge('dbFPS').style.opacity = 0
                doge('dbFPSMS').style.opacity = 0
            }

            //Display XP counter if enabled
            if(data.settings.showXP) {
                doge('xpDisplay').style.display = 'unset'
            } else {
                doge('xpDisplay').style.display = 'none'
            }

            //Check game overflow
            if(data.settings.showGameOverflow) {
                game.style.overflow = 'visible'
            } else {
                game.style.overflow = 'hidden'
            }

            //Go fullscreen
            if(data.settings.fullscreen) {
                document.body.requestFullscreen()
            } else if(document.fullscreenElement) {
                document.exitFullscreen()
            }
        }
    }
})

if(data.settings.showGameOverflow) {
    game.style.overflow = 'visible'
} else {
    game.style.overflow = 'hidden'
}

//SETTING TABS
function changeSettingTab(tab) {
    DeBread.playSound('media/audio/buttonClick.mp3')
    document.querySelectorAll('.genericSettingsMenu').forEach(menu => {
        const tabElem = doge(`settingTab-${menu.id.replace('settingMenu-','')}`)
        if(`settingMenu-${tab}` === menu.id) {
            menu.style.display = 'flex'
            tabElem.setAttribute('selected','true')
        } else {
            menu.style.display = 'none'
            tabElem.setAttribute('selected','false')
        }

    })
}

//SETTING DEFAULTS
// function resetSettings() {
//     with(data.settings) {
//         squareExplosions = true
//         simpleExplosions = false
//         particles = false
//         particlelimit = 100
//         screenshake = true
//         sfx = true
//         fpsCounter = true
//         keepStatsOpen = true

//         menu_transition_speed = 100
//         max_blood_stains = 100
//     }

//     document.querySelectorAll('input').forEach(range => {
//         if(range.type === 'range') {
//             const rangeSetting = range.id.replace('range-', '')
//             range.value = data.settings[rangeSetting.toLowerCase().replaceAll('-','_')]
//             doge(`rangeText-${rangeSetting}`).innerText = `${rangeSetting.replaceAll('-',' ')}: ${range.value}`
//         }
//     })

//     document.querySelectorAll('.genericCheckbox').forEach(checkbox => {
//         if(checkbox.id.startsWith('scb')) {
//             const setting = checkbox.id.replace('scb-','')
//             checkbox.checked = data.settings[setting]
//             checkbox.setAttribute('checked', checkbox.checked)
//         }
//     })
    
//     saveData()
// }

const areaPreview = doge('gameAreaPreview')
function updateAreaPreview() {
    areaPreview.style.width = data.settings.area_width / 5 + 'px'
    areaPreview.style.height = data.settings.area_height / 5 + 'px'

    doge('gameAreaPreviewUpgradesContainer').innerHTML = ''
    if(!data.settings.sandbox) {
        for(let i = 0; i < data.settings.shop_choices; i++) {
            const upgradeDot = document.createElement('div')
            upgradeDot.classList.add('gameAreaPreviewUpgrade')
            doge('gameAreaPreviewUpgradesContainer').append(upgradeDot)
        }
    }

    if(!data.settings.sandbox) {
        doge('gameAreaPreviewNum').innerText = data.settings.starting_wave
        document.querySelectorAll('.nonsandboxSlider').forEach(slider => {
            slider.style.opacity = 1
            slider.style.pointerEvents = 'unset'
        })
    } else if(data.settings.sandbox) {
        doge('gameAreaPreviewNum').innerText = '🛠'
        document.querySelectorAll('.nonsandboxSlider').forEach(slider => {
            slider.style.opacity = 0
            slider.style.pointerEvents = 'none'
        })
    }

    const scoreMultiplier = 1 + ((750 - data.settings.area_width) / 1000) + ((750 - data.settings.area_height) / 1000) + (data.settings.starting_wave / 100) - ((data.settings.shop_choices - 3) / 20)
    if(scoreMultiplier > 0) {
        data.scoreMultiplier = scoreMultiplier
    } else {
        data.scoreMultiplier = 0
    }
    doge('gameSettingsScoreMultiplier').innerText = `x${DeBread.round(data.scoreMultiplier, 2)}`
}

function resetGameSettings() {
    data.settings.area_height = 750
    data.settings.area_width = 750
    data.settings.starting_wave = 0
    data.settings.shop_choices = 3
    document.querySelectorAll('input').forEach((range) => {
        if(range.type === 'range' && range.classList.contains('genericSlider')) {
            const rangeSetting = range.id.replace('range-', '')
            range.value = data.settings[rangeSetting.toLowerCase().replaceAll('-','_')]
            doge(`rangeText-${rangeSetting}`).innerText = `${rangeSetting.replaceAll('-',' ')}: ${range.value}`
        }
    })
    updateAreaPreview()
}

// function updateParticleLimit() {
//     if(doge('particleLimit').value === '525') {
//         doge('particleLimitText').innerText = `Particle Limit: Unlimited`
//         data.settings.particleLimit = 1000000000
//     } else {
//         data.settings.particleLimit = doge('particleLimit').value
//         doge('particleLimitText').innerText = `Particle Limit: ${data.settings.particleLimit}`
//     }
// } updateParticleLimit()
// doge('particleLimit').oninput = updateParticleLimit

function updateSettings() {
    for(const setting in data.settings) {
        const button = doge(`setting-${setting}`)

        if(data.settings[setting] === true) {
            button.style.backgroundColor = 'white'
            button.style.color = 'black'
        } else {
            button.style.backgroundColor = 'black'
            button.style.color = 'white'
        }
    }
}

const deathScreenContainerD = doge('deathScreenContainer')
const deathScreenD = doge('deathScreen')
function deathScreen() {
    deathScreenContainerD.style.pointerEvents = 'unset'
    deathScreenD.style.height = '250px'
    deathScreenD.style.opacity = 1
    doge('pointsResult').innerText = `POINTS: ${DeBread.round(player.points)}`
}



function closeDeathScreen() {
    deathScreenContainerD.style.pointerEvents = 'none'
    deathScreenD.style.height = '0'
    deathScreenD.style.opacity = 0
}

function renderDailyChallenges() {
    doge('innerMenuChallenges').innerHTML = ''

    let challengesToRender = []
    if(Date.now() - data.challengeRefreshDate >= 43200000) {
        while(challengesToRender.length < 3) {
            const randomIndex = DeBread.randomNum(0, possibleChallenges.length - 1)
            if(!challengesToRender.includes(possibleChallenges[randomIndex])) {
                challengesToRender.push(possibleChallenges[randomIndex])
            }
            data.challenges = challengesToRender
            data.challengeRefreshDate = Date.now()
        }
    } else {
        challengesToRender = data.challenges
    }

    for(const key in challengesToRender) {
        const challengeDiv = document.createElement('div')
        challengeDiv.classList.add('challenge')

        let image = 'media/xp.png'
        if(challengesToRender[key].progress === challengesToRender[key].goal) image = 'media/checkmark.png'

        challengeDiv.innerHTML = `
        <div class="challengeMain">
            <div class="challengeInfo">
                <div class="challengeName">
                    <span>${challengesToRender[key].name}</span><br>
                    <span>${challengesToRender[key].desc}</span>
                </div>
                <span class="challengeInfoProgress">${DeBread.round(challengesToRender[key].progress)} / ${challengesToRender[key].goal}</span>
            </div>
            <div class="challengeBar">
                <div class="innerChallengeBar" style="width: ${(challengesToRender[key].progress / challengesToRender[key].goal) * 100}%"></div>
            </div>
        </div>
        <div class="challengeAward">
            <img src="${image}">
            <span>${DeBread.round(challengesToRender[key].reward / 1000)}K</span>
        </div>
        `
        doge('innerMenuChallenges').append(challengeDiv)
    }
} renderDailyChallenges()

setInterval(() => {
    const now = Date.now()
    const refreshDate = data.challengeRefreshDate
    const difference = now - refreshDate
    const interval = 43200000 //12 hours
    const remaining = interval - difference

    const hours = Math.max(0, Math.floor(remaining / 1000 / 60 / 60))
    const minutes = Math.max(0, Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60)))

    if(hours > 0) {
        doge('challengeTimer').innerText = `${hours}h ${minutes}m till next refresh`
    } else if(minutes > 0) {
        doge('challengeTimer').innerText = `${minutes}m till next refresh`
    } else {
        doge('challengeTimer').innerText = `New challenges are here! Refresh the page to update them.`
        saveData()
    }
}, 1000);

//Add goober drawings to image queue...
for(let i = 0; i < 45; i++) {
    imagesToLoad.gooberDrawings.push(`media/gooberDrawings/${i}.png`)
}