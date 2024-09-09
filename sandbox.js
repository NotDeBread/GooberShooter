//A BOX?,, WITH SAND?!?@?!@?$$#?$

const toolbox = doge('innerToolbox')
let hoveringOnToolbox = false

doge('toolboxContainer').onmouseleave = () => {
    hoveringOnToolbox = false
    doge('toolboxContainer').querySelectorAll('input').forEach((input) => {
        input.blur()
    })
    doge('toolboxContainer').querySelectorAll('textarea').forEach((textarea) => {
        textarea.blur()
    })
}
doge('toolboxContainer').onmouseenter = () => {hoveringOnToolbox = true}

const areaSettings = {
    width: 'area_width',
    height: 'area_height',
    scoreMultiplier: 'scoreMultiplier'
}

let radiateTool = false
let currentToolboxMenu = 0
function renderToolboxMenu(menu) {
    currentToolboxMenu = menu
    doge('toolboxMenus').querySelectorAll('button').forEach((button) => {
        if(button.id === `toolboxMenuButton${menu}`) {
            button.style.color = 'white'
        } else {
            button.style.color = 'grey'
        }
    })

    toolbox.innerHTML=''
    if(menu === 0) {
        const enemyContainer = document.createElement('div')
        enemyContainer.classList.add('toolboxEnemyContainer')
        toolbox.append(enemyContainer)
        for(const index in enemyTypes) {
            const enemy = enemyTypes[index]
            const button = document.createElement('div')
            button.classList.add('toolboxButton')
            button.style.borderRadius = '10px'
            button.innerHTML = `
                <div class="enemyDisplay" style="background-color: ${enemy.color}"></div>
            `
            button.onmouseenter = () => {
                doge('innerToolbarHelp').innerHTML = `Enemy ${index.replace('guy','')}: ${enemy.description}`
                DeBread.playSound('media/audio/buttonHover.mp3')
            }
            button.onmouseleave = () => {
                doge('innerToolbarHelp').innerHTML = 'Click to place enemy. <br> Shift+Click to place multiple enemies. <br> Right-click to deselect.'
            }
            button.onclick = () => {
                selectEnemy(enemy)
                DeBread.playSound('media/audio/buttonClick.mp3')
            }

            enemyContainer.append(button)
        }

        for(const index in extraEnemies) {
            const enemy = extraEnemies[index]
            const button = document.createElement('div')
            button.classList.add('toolboxButton')
            button.style.borderRadius = '10px'
            if(enemy.texture) {
                button.innerHTML = `
                    <div class="enemyDisplay" style="background-image: url(media/enemies/${enemy.texture}); background-size: cover; background-color: transparent;"></div>
                `
            } else {
                button.innerHTML = `
                    <div class="enemyDisplay" style="background-color: ${enemy.color}"></div>
                `
            }
            button.onmouseenter = () => {
                doge('innerToolbarHelp').innerHTML = `${index}: ${enemy.description}`
                DeBread.playSound('media/audio/buttonHover.mp3')
            }
            button.onmouseleave = () => {
                doge('innerToolbarHelp').innerHTML = 'Click to place enemy. <br> Shift+Click to place multiple enemies. <br> Right-click to deselect.'
            }
            button.onclick = () => {
                selectEnemy(enemy)
                DeBread.playSound('media/audio/buttonClick.mp3')
            }

            enemyContainer.append(button)
        }

        for(const key in data.customEnemies) {
            const enemy = data.customEnemies[key]
            const button = document.createElement('div')
            button.classList.add('toolboxButton')
            button.style.borderRadius = '10px'
            if(enemy.texture) {
                if(enemy.texture.startsWith('https://')) {
                    button.innerHTML = `
                        <div class="enemyDisplay" style="background-image: url(${enemy.texture}); background-size: cover; background-position: center; background-color: transparent;"></div>
                    `
                } else {
                    button.innerHTML = `
                        <div class="enemyDisplay" style="background-image: url(media/enemies/${enemy.texture}); background-size: cover; background-position: center; background-color: transparent;"></div>
                    `
                }
            } else {
                button.innerHTML = `
                    <div class="enemyDisplay" style="background-color: ${enemy.color}"></div>
                `
            }
            button.onmouseenter = () => {
                DeBread.playSound('media/audio/buttonHover.mp3')
            }
            button.onmouseleave = () => {
                doge('innerToolbarHelp').innerHTML = 'Click to place enemy. <br> Shift+Click to place multiple enemies. <br> Right-click to deselect.'
            }
            button.onclick = () => {
                selectEnemy(enemy)
                DeBread.playSound('media/audio/buttonClick.mp3')
            }

            enemyContainer.append(button)
        }

        const waveContainer = document.createElement('div')
        waveContainer.classList.add('toolboxWaveContainer')
        toolbox.append(waveContainer)

        const waveButton = document.createElement('button')
        waveButton.innerText = 'Spawn Wave'
        waveButton.classList.add('toolboxThinButton')
        waveButton.onclick = () => {spawnWave(parseInt(waveInput.value))}
        waveContainer.append(waveButton)

        const waveInput = document.createElement('input')
        waveInput.classList.add('toolboxInput')
        waveInput.type = 'number'
        waveInput.style.width = '50px'
        waveInput.placeholder = 'wave'
        waveContainer.append(waveInput)

        const killButton = document.createElement('button')
        killButton.innerText = 'Kill all'
        killButton.style.marginLeft = '5px'
        killButton.classList.add('toolboxThinButton')
        killButton.onclick = () => {
            game.querySelectorAll('enemy').forEach((enemy) => {
                enemy.kill()
            })
        }
        waveContainer.append(killButton)

        
        const createButton = document.createElement('button')
        createButton.innerText = 'Create'
        createButton.style.marginLeft = '5px'
        createButton.classList.add('toolboxThinButton')
        createButton.onclick = () => {renderToolboxMenu(5)}
        waveContainer.append(createButton)

        const damageButton = document.createElement('button')
        damageButton.innerText = 'Set DMG Multi'
        damageButton.classList.add('toolboxThinButton')
        damageButton.onclick = () => {enemyInfo.damageMultiplier = parseInt(damageInput.value)}
        waveContainer.append(damageButton)

        const damageInput = document.createElement('input')
        damageInput.classList.add('toolboxInput')
        damageInput.type = 'number'
        damageInput.style.width = '50px'
        damageInput.placeholder = 'dmg'
        waveContainer.append(damageInput)

        const radiant = document.createElement('button')
        radiant.innerText = 'Radiate Enemy'
        radiant.style.marginLeft = '5px'
        radiant.classList.add('toolboxThinButton')
        radiant.onclick = () => {radiateTool = true}
        waveContainer.append(radiant)

        doge('innerToolbarHelp').innerHTML = 'Click to place enemy. <br> Shift+Click to place multiple enemies. <br> Right-click to deselect.'
    }
    if(menu === 1) {
        for(const gunSetting in player.gun) {
            if(typeof player.gun[gunSetting] === 'number') {
                const inputContainer = document.createElement('div')
                inputContainer.classList.add('toolboxInputContainer')
                inputContainer.innerHTML = `
                    <span>${gunSetting}</span>
                `
                const input = document.createElement('input')
                input.classList.add('toolboxInput')
                input.type = 'number'
                input.value = DeBread.round(player.gun[gunSetting], 3)

                input.oninput = () => {
                    if(input.value !== '') {
                        player.gun[gunSetting] = parseFloat(input.value)
                        updateUI()
                        update()
                        updateStats()
                    }
                }

                inputContainer.append(input)
                

                toolbox.append(inputContainer)
            }
        }
        doge('innerToolbarHelp').innerHTML = 'Some settings might not update immediately.'
    }
    if(menu === 2) {
        for(const playerSetting in player) {
            if(typeof player[playerSetting] === 'number' && !['dashDate','dashing','stamina','style','points'].includes(playerSetting)) {
                const inputContainer = document.createElement('div')
                inputContainer.classList.add('toolboxInputContainer')
                inputContainer.innerHTML = `
                    <span>${playerSetting}</span>
                `
                const input = document.createElement('input')
                input.classList.add('toolboxInput')
                input.type = 'number'
                input.value = DeBread.round(player[playerSetting], 3)

                input.oninput = () => {
                    if(input.value !== '') {
                        player[playerSetting] = parseFloat(input.value)
                        updateUI()
                        update()
                        updateStats()
                        playerD.getSaws()
                    }
                }

                inputContainer.append(input)
                

                toolbox.append(inputContainer)
            }
        }
        for(const playerSetting in player.block) {
            if(typeof player.block[playerSetting] === 'number') {
                const inputContainer = document.createElement('div')
                inputContainer.classList.add('toolboxInputContainer')
                inputContainer.innerHTML = `
                    <span>block.${playerSetting}</span>
                `
                const input = document.createElement('input')
                input.classList.add('toolboxInput')
                input.type = 'number'
                input.value = DeBread.round(player.block[playerSetting], 3)
    
                input.oninput = () => {
                    if(input.value !== '') {
                        player.block[playerSetting] = parseInt(input.value)
                        updateUI()
                        update()
                        updateStats()
                    }
                }
    
                inputContainer.append(input)
                
    
                toolbox.append(inputContainer)
            }
        }
        doge('innerToolbarHelp').innerHTML = 'Some settings might not update immediately.'
    }
    if(menu === 3) {
        for(const upgrade in upgrades) {
            const button = document.createElement('div')
            button.classList.add('toolboxButton')
            button.style.width = '50px'
            button.style.height = '50px'

            let upgradeCount = 0
            for(const playerUpgrade in player.upgrades) {
                if(player.upgrades[playerUpgrade] === upgrades[upgrade]) {
                    upgradeCount++
                }
            }

            button.innerHTML = `
                <img src="media/upgrades/${upgrades[upgrade].name.replace(' ', '_')}.png">
                <span class="shopUpgradeNumber">${upgradeCount}</span>
            `
            
            button.onclick = () => {
                upgrades[upgrade].action()
                player.upgrades.push(upgrades[upgrade])
                updateStats()
                renderToolboxMenu(3)
                DeBread.playSound('media/audio/buttonClick.mp3')
            }

            button.onmouseenter = () => {
                doge('innerToolbarHelp').innerHTML = `${upgrades[upgrade].name}<br>${upgrades[upgrade].description}`,
                DeBread.playSound('media/audio/buttonHover.mp3')
            }

            button.onmouseleave = () => {
                doge('innerToolbarHelp').innerHTML = 'Hover over an upgrade to see its description.'
            }
            toolbox.append(button)
        }

        for(const upgrade in rareUpgrades) {
            const button = document.createElement('div')
            button.classList.add('toolboxButton')
            button.style.width = '50px'
            button.style.height = '50px'

            let upgradeCount = 0
            for(const playerUpgrade in player.upgrades) {
                if(player.upgrades[playerUpgrade] === rareUpgrades[upgrade]) {
                    upgradeCount++
                }
            }

            button.innerHTML = `
                <img src="media/upgrades/${rareUpgrades[upgrade].name.replace(' ', '_')}.png">
                <span class="shopUpgradeNumber">${upgradeCount}</span>
            `
            
            button.onclick = () => {
                rareUpgrades[upgrade].action()
                player.upgrades.push(rareUpgrades[upgrade])
                updateStats()
                renderToolboxMenu(3)
                DeBread.playSound('media/audio/buttonClick.mp3')
            }

            button.onmouseenter = () => {
                doge('innerToolbarHelp').innerHTML = `${rareUpgrades[upgrade].name}<br>${rareUpgrades[upgrade].description}`,
                DeBread.playSound('media/audio/buttonHover.mp3')
            }

            button.onmouseleave = () => {
                doge('innerToolbarHelp').innerHTML = 'Hover over an upgrade to see its description.'
            }
            toolbox.append(button)
        }

        for(const upgrade in extraUpgrades) {
            const button = document.createElement('div')
            button.classList.add('toolboxButton')
            button.innerHTML = `<img src="media/upgrades/${extraUpgrades[upgrade].name.replace(' ', '_')}.png">`
            button.style.width = '50px'
            button.style.height = '50px'

            button.onclick = () => {
                extraUpgrades[upgrade].action()
                updateStats()
            }

            button.onmouseenter = () => {
                doge('innerToolbarHelp').innerHTML = extraUpgrades[upgrade].description
            }

            button.onmouseleave = () => {
                doge('innerToolbarHelp').innerHTML = 'Hover over an upgrade to see its description.'
            }
            toolbox.append(button)
        }
    }
    if(menu === 4) {
        for(const setting in areaSettings) {
            const inputContainer = document.createElement('div')
            inputContainer.classList.add('toolboxInputContainer')
            inputContainer.innerHTML = `
                <span>${setting}</span>
            `
            const input = document.createElement('input')
            input.classList.add('toolboxInput')
            input.type = 'number'
            input.value = data.settings[areaSettings[setting]]


            input.oninput = () => {
                if(input.value !== '') {
                    data.settings[areaSettings[setting]] = parseInt(input.value)

                    game.style.width = data.settings.area_width + 'px'
                    game.style.height = data.settings.area_height + 'px'

                    gameCanvas.width = data.settings.area_width
                    gameCanvas.height = data.settings.area_height
                }
            }

            inputContainer.append(input)
            

            toolbox.append(inputContainer)
            doge('innerToolbarHelp').innerHTML = ''
        }
        createButton(
            () => clearPlayArea(),
            'Clear Area',
            toolbox,
            [
                '',
                'Removes everything in the play area.'
            ]
        )
        createButton(
            () => {
                game.querySelectorAll('.bullet').forEach((bullet) => {
                    bullet.remove()
                    clearInterval(bullet.gunUpdateInterval)
                })
            },
            'Remove Bullets',
            toolbox,
            [
                '',
                'Deletes all enemy bullets in the play area.'
            ]
        )
        createButton(
            () => {
                game.querySelectorAll('.bloodStain').forEach((stain) => {
                    stain.remove()
                })
            },
            'Clean',
            toolbox,
            [
                '',
                'Deletes all blood stains.'
            ]
        )
    }
    if(menu === 3 || menu === 2 || menu === 1) {
        createButton(
            () => {
                resetPlayer()
                updateStats()
                renderToolboxMenu(currentToolboxMenu)
                update()
            },
            'Reset Player',
            toolbox,
            [
                'Hover over an upgrade to see its description.',
                'Resets all player attributes.'
            ]
        )
    }
    if(menu === 5) {
        const textfield = document.createElement('textarea')
        textfield.placeholder = 'Insert enemy JSON here.'
        toolbox.append(textfield)
        createButton(
            () => {
                // console.log(JSON.parse(textfield.value.trim()))
                if(textfield.value !== '') {
                    try {
                        data.customEnemies.push(JSON.parse(textfield.value.trim()))
                        createNoti(undefined, 'Enemy Created!')
                    } catch (error) {
                        createNoti('media/error.png', 'An error occured', 'Please provide a valid object to create an enemy.')
                        console.log(error)
                    }
                } else {
                    createNoti('media/error.png', 'An error occured', 'Please provide an object to create an enemy.')
                }
            },
            'Create Enemy',
            toolbox,
            [
                '',
                'Creates an enemy using the provided JS object.',
            ]
        )
        createButton(
            () => {
                data.customEnemies = []
            },
            'Delete all custom enemies',
            toolbox,
            [
                '',
                'Deletes all custom enemies'
            ]
        )
        doge('innerToolbarHelp').innerHTML = ''
    }
}
renderToolboxMenu(0)

const enemyPreviewD = doge('enemyD')


let selectedEnemy = undefined

document.addEventListener('mousemove', () => {
    if(selectedEnemy) {
        enemyPreviewD.style.left = cursor.pos[0] - selectedEnemy.size / 2 + 'px'
        enemyPreviewD.style.top = cursor.pos[1] - selectedEnemy.size / 2 + 'px'
    }
    if(radiateTool) {
        DeBread.createParticles(
            game,
            1,
            0,
            1000,
            'linear',
            [[cursor.pos[0], cursor.pos[0]], [cursor.pos[1], cursor.pos[1]]],
            [[[5, 5], [5, 5]], [[0, 0], [0, 0]]],
            [[0, 0], [0, 0]],
            [[-10, 10], [-10, 10]],
            [[0, 0, 0], [255, 255, 255]],
            [[0, 0, 0], [255, 255, 255]],
            true
        )
    }
})
game.onmouseup = (ev) => {
    if(ev.button === 0) {
        if(selectedEnemy) {
            spawnEnemy(selectedEnemy, [cursor.pos[0] - selectedEnemy.size / 2, cursor.pos[1] - selectedEnemy.size / 2])
            const enemyColor = DeBread.rgbStringToArray(selectedEnemy.color)
            DeBread.createParticles(
                game,
                10,
                0,
                500,
                'ease-out',
                [[cursor.pos[0], cursor.pos[0]], [cursor.pos[1], cursor.pos[1]]],
                [[[selectedEnemy.size / 5, selectedEnemy.size / 5], [selectedEnemy.size / 5, selectedEnemy.size / 5]], [[0, 0], [0, 0]]],
                [[0, 0], [0, 0]],
                [[-selectedEnemy.size * 1.5, selectedEnemy.size * 1.5], [-selectedEnemy.size * 1.5, selectedEnemy.size * 1.5]],
                [[enemyColor[0], enemyColor[1], enemyColor[2]], [enemyColor[0], enemyColor[1], enemyColor[2]]],
                [[enemyColor[0], enemyColor[1], enemyColor[2]], [enemyColor[0], enemyColor[1], enemyColor[2]]],
                true
            )
            if(!ev.shiftKey) {
                selectedEnemy = undefined
                enemyPreviewD.style.opacity = 0
            }
        }
    } 
    if(ev.button === 2) {
        selectedEnemy = undefined
        enemyPreviewD.style.opacity = 0

        radiateTool = false
    }
}

function selectEnemy(enemy) {
    selectedEnemy = enemy
    enemyPreviewD.style.backgroundColor = enemy.color
    enemyPreviewD.style.width = enemy.size+'px'
    enemyPreviewD.style.opacity = 0.5
}

function createButton(action, text, parent, hoverInfo) {
    const button = document.createElement('div')
    button.innerText = text
    button.style.cursor = 'pointer'
    button.style.width = '100%'
    button.style.textAlign = 'center'
    button.style.backgroundColor = 'black'
    button.style.border = 'none'
    button.style.outline = '3px solid white'
    button.style.margin = '0px 10px 5px 10px'
    
    button.onclick = action
    button.onmouseenter = () => {
        doge('innerToolbarHelp').innerHTML = hoverInfo[1]
        
        button.style.backgroundColor = 'white'
        button.style.color = 'black'
        button.style.fontWeight = '700'
        DeBread.playSound('media/audio/buttonHover.mp3')
    }
    button.onmouseleave = () => {
        doge('innerToolbarHelp').innerHTML = hoverInfo[0]

        button.style.backgroundColor = 'black'
        button.style.color = 'white'
        button.style.fontWeight = '500'
    }
    
    parent.append(button)
}