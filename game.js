//only god knows whats happening here.

const game = doge('game')
game.shake = [0, 0]

const gameCanvas = doge('gameCanvas');
const gameCanvasCtx = gameCanvas.getContext('2d');

//PLAYER STUFF

const blockHitbox = doge('blockHitbox')
const playerD = doge('player')
let player = {}
function resetPlayer() {
    player = {
        alive: true,
        pos: [(game.offsetWidth / 2) - player.size / 2, (game.offsetHeight / 2) - player.size / 2],
        realPos: [0, 0],
        taunting: false,
        size: 54,
        dashing: 1, //=1: false, >1: true
        dashDate: 0,
        stamina: 100,
        dashes: 4,
        staminaRegen: 1,
        immune: false,
        poisonTrail: 0,
    
        points: 0,
        style: 50,
        combo: 1,
        comboLoss: 1,
        pointDistribution: {},
    
        health: 100,
        maxHealth: 100,
        canHeal: true,
        healthRegen: 0,
        parasite: 0,
    
        gun: {
            damage: 5,
            maxAmmo: 10,
            ammo: 10,
            burstLength: 1,
            critChance: 10,
            multishot: 1,
            critMultiplier: 1.5,
    
            bulletSpeed: 15,
            bulletSize: 10,
            reloadSpeed: 1000,
            reloading: false,
    
            explosionSize: 0,
            poisonLength: 0,
            fireDamage: 0,
            ricochetAmount: 0,
            grow: 0,
            magnet: 0,
            ricochetMultiplier: 1,
        },
    
        block: {
            available: true,
            cooldown: 2500,
            size: 150,
            damage: 15,
            parryPoisonFieldTicks: 0,
            frostburn: 0,
            explosive: 0,
            reloadTriggers: 0,
        },
    
        sawblades: 0,
    
        speed: 5,
        intervals: {
            up: undefined,
            left: undefined,
            down: undefined,
            right: undefined,
        },
    
        upgrades: [],
    
        sog: false,
    }

    playerD.innerHTML = `
    <div id="playerTextureContainer">
        <img id="playerTexture"></img>
    </div>
    ` //Idk why either
} resetPlayer()

//Append default player texture
playerD.append(getImage(`media/characters/${data.selectedCharacter}-normal.png`))

playerD.taunt = (ignoreCooldown) => {
    if(!player.taunting && characters[data.selectedCharacter].taunts > 0 || ignoreCooldown) {
        doge('playerTextureContainer').innerHTML = ''
        doge('playerTextureContainer').append(getImage(`media/characters/${data.selectedCharacter}-taunt${DeBread.randomNum(1, characters[data.selectedCharacter].taunts)}.png`))

        const tauntFlash = document.createElement('freeElement')
        tauntFlash.classList.add('tauntFlash')
        tauntFlash.style.width = player.size * 2 + 'px'
        tauntFlash.style.left = player.pos[0] - player.size / 2 + 'px'
        tauntFlash.style.top = player.pos[1] - player.size / 2 + 'px'
        tauntFlash.style.rotate = `${['0','90','180','270'][DeBread.randomNum(0, 3)]}deg`
        if(data.selectedCharacter === 'plonk') {
            tauntFlash.style.animation = 'none'
        } else {
            game.shake[0] += 5
            game.shake[1] += 5
        }
        game.append(tauntFlash)
        
        player.taunting = true
        paused = true

        getPoints(1 * ((player.combo / 10) + 1), '+Taunt')
        increaseChallengeProgress('taunts', 1)

        if(characters[data.selectedCharacter].tauntTexts) {
            game.querySelectorAll('.tauntText').forEach(text => {text.remove()})
            const texts = characters[data.selectedCharacter].tauntTexts
            const randomIndex = DeBread.randomNum(0, texts.length - 1)
            const tauntText = document.createElement('span')
            tauntText.classList.add('tauntText')
            tauntText.innerText = texts[randomIndex]
            game.append(tauntText)
            tauntText.style.left = player.pos[0] - tauntText.offsetWidth / 2 + player.size / 2 + 'px'
            tauntText.style.top = player.pos[1] - 20 - tauntText.offsetHeight + 'px'

            if(data.selectedCharacter === 'plonk') {
                tauntText.style.animation = 'none'
            }

            setTimeout(() => {
                tauntText.remove()
            }, 1000);

            if(characters[data.selectedCharacter].hasTauntAudio) {
                DeBread.playSound(`media/characterAudio/taunts/${data.selectedCharacter}/${randomIndex}.mp3`, 0.25, 1.1)
                DeBread.playSound(`media/audio/taunt${DeBread.randomNum(0, 2)}.mp3`, 0.05)
            }

            if(characters[data.selectedCharacter].font) {
                tauntText.style.fontFamily = characters[data.selectedCharacter].font
            }

            if(texts[randomIndex] === 'backflip') {
                playerD.style.animation = 'backflip 500ms linear 1 forwards'

                setTimeout(() => {
                    playerD.style.animation = 'none'
                }, 500);
            }
        } 
        
        if(!characters[data.selectedCharacter].hasTauntAudio) {
            if(!characters[data.selectedCharacter].tauntSounds) {
                DeBread.playSound(`media/audio/taunt${DeBread.randomNum(0, 2)}.mp3`, 0.15)
            } else {
                DeBread.playSound(`media/audio/${characters[data.selectedCharacter].tauntSounds[DeBread.randomNum(0, characters[data.selectedCharacter].tauntSounds.length - 1)]}` , 0.15)
            }
        }

        setTimeout(() => {
            player.taunting = false
            paused = false
            tauntFlash.remove()
        }, 250);
    } else if(!player.taunting) {
        createNoti(undefined, `${characters[data.selectedCharacter].name} does not have any taunts.`, 'Try using another character to taunt.')
    }
}

playerD.block = (ignoreCooldown, refresh) => {
    if(player.block.available || ignoreCooldown) {

        let cooldown = 0
        if(ignoreCooldown) {
            cooldown = refresh
        } else {
            cooldown = player.block.cooldown
        }

        player.block.available = false
        
        doge('innerBlockHitbox').style.setProperty('--duration', `${cooldown}ms`)
        doge('innerBlockHitbox').style.setProperty('--size', `${player.block.size}px`)
        doge('innerBlockHitbox').classList.add('blockHitboxAnim')
        doge('blockHitbox').classList.add('blockHitboxFlashAnim')
        doge('blockHitbox').style.outline = 'none'

        if(player.block.frostburn) {
            DeBread.createParticles(
                game,
                20,
                0,
                1000,
                'cubic-bezier(0,1,.25,1)',
                [[player.pos[0], player.pos[0] + playerD.offsetWidth], [player.pos[1], player.pos[1] + playerD.offsetHeight]],
                [[[50, 50], [50, 50]], [0, 0], [0, 0]],
                [[0, 0], [0, 0]],
                [[-250, 250], [-250, 250]],
                [[0, 255, 255], [0, 255, 255]],
                [[0, 255, 255], [0, 255, 255]],
            )
        } else {
            DeBread.createParticles(
                game,
                20,
                0,
                1000,
                'cubic-bezier(0,1,.25,1)',
                [[player.pos[0], player.pos[0] + playerD.offsetWidth], [player.pos[1], player.pos[1] + playerD.offsetHeight]],
                [[[50, 50], [50, 50]], [0, 0], [0, 0]],
                [[0, 0], [0, 0]],
                [[-250, 250], [-250, 250]],
                [[255, 255, 255], [255, 255, 255]],
                [[255, 255, 255], [255, 255, 255]],
            )
        }

        game.shake[0] = 10
        game.shake[1] = 10

        //PARRY
        game.querySelectorAll('.bullet, .grenade').forEach((bullet) => {
            if(isColliding(blockHitbox, bullet) && bullet.id !== 'playerBullet') {
                if(player.sog) {
                    doge('soggyCat').style.opacity = 0.75
                    DeBread.playSound('media/audio/ahh.mp3', 0.25)
                } else {
                    DeBread.playSound('media/audio/newParry.mp3', 0.05)
                }
                damagePlayer(-15, true)
                bullet.angle = Math.atan2(cursor.pos[1] - bullet.pos[1], cursor.pos[0] - bullet.pos[0])
                bullet.speed = 25
                bullet.hurtSelf = true
    
                if(bullet.parry) {bullet.parry()}
    
                const bulletCircle = document.createElement('freeElement')
                bulletCircle.classList.add('bulletParry')
                bulletCircle.style.width = bullet.size + 'px'
                bulletCircle.style.left = bullet.pos[0] + 'px'
                bulletCircle.style.top = bullet.pos[1] + 'px'
                game.append(bulletCircle)
    
                game.shake[0] = 10
                game.shake[1] = 10
                DeBread.shake(doge('soggyCat'), 10, 10, 10, 250)
    
                getPoints(100 * player.combo, '+Parry')
                getCombo()
                getStyle(30)
                updateUI()
                if(player.combo % 25 === 0 || player.combo === 10) {
                    getPoints((player.combo * 100) * ((player.combo / 5) + 1),`+${player.combo} combo`)
                }
    
                paused = true
                game.style.backgroundColor = 'rgb(25, 25, 25)'
                game.style.scale = '110%'
                playerD.style.filter = 'drop-shadow(0px 0px 50px white)'
                setTimeout(() => {
                    doge('soggyCat').style.opacity = 0
                    paused = false
                    game.style.backgroundColor = 'black'
                    game.style.scale = '100%'
                    playerD.style.filter = 'none'
                    bulletCircle.remove()
                }, 250);
    
                data.stats.timesParried++
                increaseChallengeProgress('parry', 1)
    
                getAchievement('stylish')
    
                if(data.stats.timesParried >= 50) {
                    getAchievement('flashy')
                }
    
                if(data.stats.timesParried >= 250) {
                    getAchievement('fancy')
                }
    
                if(data.stats.timesParried >= 500) {
                    getAchievement('ostentatious')
                }
    
                if(player.combo >= 100) {
                    getAchievement('murderSpree')
                }

                if(player.block.size <= 100) {
                    getAchievement('reflex')
                }
            }
        })

        setTimeout(() => {
            player.block.available = true
            doge('innerBlockHitbox').classList.remove('blockHitboxAnim')
            doge('blockHitbox').classList.remove('blockHitboxFlashAnim')
            doge('blockHitbox').style.outline = '3px solid rgb(255, 255, 255, 0.1)'
            game.shake[0] = 6
            game.shake[1] = 6
        }, cooldown)

        //DAMAGE

        game.querySelectorAll('enemy').forEach(enemy => {
            if(isColliding(enemy, blockHitbox)) {
                enemy.damage(player.block.damage)
                player.style += 5
                DeBread.playSound('media/audio/punch.mp3', 0.05) //OH MY GOD WHY IS IT SO LOUD
                getPoints(player.block.damage * ((player.combo / 10) + 1), '+Punched')
                createPopupText([enemy.pos[0] + (enemy.size / 2), enemy.pos[1] + (enemy.size / 2)], player.block.damage * enemy.damageReduction, 25, 700, 'white')

                if(player.block.frostburn) {
                    if(!enemy.timesFrostburnt) {enemy.timesFrostburnt = 0}
                    enemy.timesFrostburnt++
                    enemy.speed /= (1 + (player.block.frostburn))
                    enemy.style.outline = `${enemy.timesFrostburnt * 2}px solid rgb(0, 255, 255, 0.5)`
                    setTimeout(() => {
                        enemy.timesFrostburnt--
                        enemy.speed *= (1 + (player.block.frostburn))
                        enemy.style.outline = `${enemy.timesFrostburnt * 2}px solid rgb(0, 255, 255, 0.5)`
                    }, 5000 + (player.block.frostburn * 100));
                }

                if(player.block.explosive) {
                    createExplosion([enemy.pos[0] + enemy.size / 2, enemy.pos[1] + enemy.size / 2], 115 + (player.block.explosive * 5), player.block.damage, true)
                }

                if(!enemy.alive) {
                    data.stats.enemiesKilledByMelee++
                    getAchievement('knuckleSandwich')

                    if(data.stats.enemiesKilledByMelee >= 100) {
                        getAchievement('boxer')
                    }
                }
            }
        })
    }
}

playerD.getSaws = () => {
    document.querySelectorAll('.sawblade').forEach(saw => {
        clearInterval(saw.interval)
        saw.remove()
    })
    for(let i = 0; i < player.sawblades; i++) {
        const sawblade = document.createElement('img')
        sawblade.src = 'media/saw.png'
        sawblade.classList.add('sawblade')
    
        let angle = ((2 * Math.PI) / player.sawblades) * i
        let radius
        if(player.sawblades > 50) {
            radius = 125
        } else {
            radius = 75 + player.sawblades
        }
        
        const x = radius * Math.cos(angle)
        const y = radius * Math.sin(angle)
        sawblade.style.left = playerD.offsetWidth / 2 - 12.5 + x + 'px'
        sawblade.style.top = playerD.offsetHeight / 2 - 12.5 + y + 'px'
    
        sawblade.interval = setInterval(() => {
            if(!paused && player.alive) {
                if(0.1 - (player.sawblades / 100) > 0.02) {
                    angle += 0.1 - (player.sawblades / 100)
                } else {
                    angle += 0.02
                }
        
                //idk how to do math so i made chatgpt do it for me 💀
                const x = radius * Math.cos(angle)
                const y = radius * Math.sin(angle)
              
                sawblade.style.left = playerD.offsetWidth / 2 - 12.5 + x + 'px'
                sawblade.style.top = playerD.offsetHeight / 2 - 12.5 + y + 'px'
    
                game.querySelectorAll('enemy').forEach(enemy => {
                    if(isColliding(sawblade, enemy)) {
                        if(!enemy.preparing) {
                            enemy.damage(player.block.damage / 50)
                            if(!enemy.alive) {
                                getPoints(50 * ((player.combo / 10) + 1), '+Cut')
                            }
                        }
                    }
                })
            }
        }, 10);
    
        playerD.append(sawblade)
    }
}
playerD.getSaws()


let currentWaveSize = 10
const enemyInfo = {
    speedMultiplier: 1,
    prepareTime: 1500,
    damageMultiplier: 1,
    radient: false,
}

const cursor = {
    pos: [0, 0]
}

const gunD = doge('gun')
gunD.translateInt = [0, 0]

let disableInput = true
let gameActive = false
let paused = false
document.addEventListener('keydown', ev => {
    if(!disableInput) {
        if(ev.key.toLowerCase() === 'w' && player.intervals.up === undefined) {
            player.intervals.up = setInterval(() => {
                if(!paused) {
                    if(player.pos[1] - player.speed * player.dashing > 0) {
                        player.pos[1] -= player.speed * player.dashing
                        increaseChallengeProgress('travel', player.speed * player.dashing)
                    } else {
                        player.pos[1] = 0
                    }
                }
            }, 10 * gameSpeed)
        }
        if(ev.key.toLowerCase() === 'a' && player.intervals.left === undefined) {
            player.intervals.left = setInterval(() => {
                if(!paused) {
                    if(player.pos[0] - player.speed * player.dashing > 0) {
                        player.pos[0] -= player.speed * player.dashing
                        increaseChallengeProgress('travel', player.speed * player.dashing)
                    } else {
                        player.pos[0] = 0
                    }
                }
            }, 10 * gameSpeed)
        }
        if(ev.key.toLowerCase() === 's' && player.intervals.down === undefined) {
            player.intervals.down = setInterval(() => {
                if(!paused) {
                    if(player.pos[1] + player.speed * player.dashing < game.offsetHeight - playerD.offsetHeight) {
                        player.pos[1] += player.speed * player.dashing
                        increaseChallengeProgress('travel', player.speed * player.dashing)
                    } else {
                        player.pos[1] = game.offsetHeight - playerD.offsetHeight
                    }
                }
            }, 10 * gameSpeed)
        }
        if(ev.key.toLowerCase() === 'd' && player.intervals.right === undefined) {
            player.intervals.right = setInterval(() => {
                if(!paused) {
                    if(player.pos[0] + player.speed * player.dashing < game.offsetWidth - playerD.offsetWidth) {
                        player.pos[0] += player.speed * player.dashing
                        increaseChallengeProgress('travel', player.speed * player.dashing)
                    } else {
                        player.pos[0] = game.offsetWidth - playerD.offsetWidth
                    }
                }
            }, 10 * gameSpeed)
        }
        if(ev.key.toLowerCase() === 'r' && !player.gun.reloading && player.gun.ammo !== player.gun.maxAmmo) {
            const reloadSpeed = player.gun.reloadSpeed * gameSpeed
            //CROSSHAIR RELOAD ANIM
            doge('innerCrosshairAmmo').style.setProperty('--startingWidth', `${(player.gun.ammo / player.gun.maxAmmo) * 100}%`)
            doge('innerCrosshairAmmo').style.animation = `crosshairAmmoAnim ${reloadSpeed}ms linear 1 forwards`
            setTimeout(() => {
                doge('innerCrosshairAmmo').style.animation = `none`
                doge('innerCrosshairAmmo').style.width = (player.gun.ammo / player.gun.maxAmmo) * 100 + '%'
            }, reloadSpeed);

            //MAIN RELOAD ANIM
            if(reloadSpeed <= 1000) {
                DeBread.playSound('media/audio/reload-full.mp3', 0.1, 1000 / reloadSpeed)
            } else {
                DeBread.playSound('media/audio/reload-full.mp3', 0.1)
            }
            
            doge('ammoNumberBar').innerText = ''
            
            player.gun.ammo = 0
            doge('ammoNumber').innerText = 'RELOADING...'
            doge('ammoNumber').style.color = 'white'
            player.gun.reloading = true

            doge('ammoBar').style.backgroundColor = 'grey'
            doge('innerAmmoBar').style.width = 0
            doge('innerAmmoBar').style.setProperty('--reloadSpeed', reloadSpeed + 'ms')
            doge('innerAmmoBar').classList.add('innerAmmoBarAnim')

            setTimeout(() => {
                player.gun.reloading = false
                player.gun.ammo = player.gun.maxAmmo
                doge('ammoNumber').style.color = 'white'
                DeBread.shake(doge('ammoUI'), 10, 5, 0, 100)
                updateUI()

                doge('innerAmmoBar').style.setProperty('--reloadSpeed', '0')
                doge('innerAmmoBar').classList.remove('innerAmmoBarAnim')
                doge('ammoBar').style.backgroundColor = 'white'
                DeBread.playSound('media/audio/reload-long-end.mp3', 0.3)

                for(let i = 0; i < player.block.reloadTriggers; i++) {
                    setTimeout(() => {
                        playerD.block(true, 125)

                        const blockShockwave = document.createElement('freeElement')
                        blockShockwave.classList.add('blockShockwave')
                        blockShockwave.style.width = player.block.size + 'px'
                        blockShockwave.style.top = player.pos[1] - player.block.size / 2 + playerD.offsetHeight / 2 + 'px'
                        blockShockwave.style.left = player.pos[0] - player.block.size / 2 + playerD.offsetWidth / 2 + 'px'
                        game.append(blockShockwave)

                        setTimeout(() => {
                            blockShockwave.remove()
                        }, 750);
                    }, (150 - i) * i);
                }
            }, reloadSpeed);
        }
        if(ev.key.toLowerCase() === 'shift' && player.stamina >= 100 / player.dashes && performance.now() - player.dashDate > 500 && !selectedEnemy) {
            player.dashDate = performance.now()
            DeBread.playSound(`media/audio/dash${DeBread.randomNum(0, 2)}.mp3`, 0.25)
            DeBread.shake(game, 10, 5, 5, 100)
            DeBread.createParticles(
                game,
                10,
                0,
                1000,
                'ease-out',
                [[player.pos[0], player.pos[0] + player.size], [player.pos[1], player.pos[1] + player.size]],
                [[[10, 10], [10, 10]],[[0, 0], [0, 0]]],
                [[0, 0], [0, 0]],
                [[-25, 25], [-25, 25]],
                [[255, 255, 255], [255, 255, 255]],
                [[255, 255, 255], [255, 255, 255]],
                true
            )

            player.stamina -= 100 / player.dashes
            player.dashing = 4
            player.immune = true
            playerD.style.outline = '2px solid rgb(255, 255, 255, 0.75)'

            if(player.poisonTrail > 0) {
                createPoisonField([player.pos[0] + player.size / 2, player.pos[1] + player.size / 2], 30 + (player.poisonTrail * 10), 5 + player.poisonTrail, 10 + player.poisonTrail, true)
            }
            for(let i = 1; i < 6; i++) {
                setTimeout(() => {
                    player.dashing -= 0.5

                    DeBread.createParticles(
                        game,
                        1,
                        0,
                        1000,
                        'ease-out',
                        [[player.pos[0], player.pos[0] + player.size], [player.pos[1], player.pos[1] + player.size]],
                        [[[5, 5], [5, 5]],[[0, 0], [0, 0]]],
                        [[0, 0], [0, 0]],
                        [[-25, 25], [-25, 25]],
                        [[255, 255, 255], [255, 255, 255]],
                        [[255, 255, 255], [255, 255, 255]],
                        true
                    )

                    if(player.poisonTrail > 0) {
                        createPoisonField([player.pos[0] + player.size / 2, player.pos[1] + player.size / 2], 30 + (player.poisonTrail * 10), 5 + player.poisonTrail, player.poisonTrail, true)
                    }
                }, 50 * i);
            }

            setTimeout(() => {
                player.immune = false
                playerD.style.outline = 'none'
            }, 500);

            updateUI()

            setTimeout(() => {
                player.dashing = 1
            }, 500);
        }
        if(ev.key.toLowerCase() === 'escape') {
            if(!paused) {
                togglePauseScreen()
            }
        }
        if(ev.key.toLowerCase() === 'c') {
            playerD.taunt()
            let block = false
            game.querySelectorAll('.bullet').forEach(bullet => {
                if(isColliding(bullet, blockHitbox) && bullet.id !== 'playerBullet') {
                    block = true
                }
            })
            if(block) {
                playerD.block()
                getAchievement('showOff')
            } 
        }
        if(ev.key.toLowerCase() === 'f') { //old parry code lmao
            // game.querySelectorAll('.bullet').forEach((bullet) => {
            //     if(isColliding(parryHitbox, bullet)) {
            //         DeBread.playSound('media/audio/parry.mp3')
            //         bullet.remove()
            //         player.health = player.maxHealth
            //     }
            // })
        }
        if(['w', 'a', 's', 'd'].includes(ev.key.toLowerCase())) {
            doge('toolboxContainer').querySelectorAll('input').forEach((input) => {
                input.blur()
            })
        }

        if(ev.key.toLowerCase() === '1' && data.settings.sandbox && !hoveringOnToolbox) {
            createMagnet([cursor.pos[0], cursor.pos[1]], [cursor.pos[0], cursor.pos[1]])
        }
        

        //DEV KEYBINDS
        if(data.dev) {
            if(ev.key.toLowerCase() === 'k') {
                game.querySelectorAll('enemy').forEach((enemy) => {
                    enemy.kill()
                })
                game.querySelectorAll('.bullet').forEach((bullet) => {
                    bullet.remove()
                    clearInterval(bullet.gunUpdateInterval)
                })
            }

            if(ev.key.toLowerCase() === 'p') {
                game.querySelectorAll('.bullet, .grenade').forEach((bullet) => {
                    if(player.sog) {
                        doge('soggyCat').style.opacity = 0.75
                        DeBread.playSound('media/audio/ahh.mp3', 0.25)
                    } else {
                        DeBread.playSound('media/audio/newParry.mp3', 0.05)
                    }
                    if(bullet.parry) {bullet.parry()}
                    damagePlayer(-15, true)
                    bullet.angle = Math.atan2(cursor.pos[1] - bullet.pos[1], cursor.pos[0] - bullet.pos[0])
                    bullet.speed = 30
                    bullet.hurtSelf = true

                    const bulletCircle = document.createElement('freeElement')
                    bulletCircle.classList.add('bulletParry')
                    bulletCircle.style.width = bullet.size + 'px'
                    bulletCircle.style.left = bullet.pos[0] + 'px'
                    bulletCircle.style.top = bullet.pos[1] + 'px'
                    game.append(bulletCircle)

                    DeBread.shake(game, 10, 10, 10, 250)
                    DeBread.shake(doge('soggyCat'), 10, 10, 10, 250)

                    getPoints(100 * player.combo, '+Parry')
                    getCombo()
                    updateUI()
                    if(player.combo % 25 === 0 || player.combo === 10) {
                        getPoints((player.combo * 100) * ((player.combo / 5) + 1),`+${player.combo} combo`)
                    }

                    paused = true
                    game.style.backgroundColor = 'rgb(25, 25, 25)'
                    game.style.scale = '110%'
                    playerD.style.filter = 'drop-shadow(0px 0px 50px white)'
                    setTimeout(() => {
                        doge('soggyCat').style.opacity = 0
                        paused = false
                        game.style.backgroundColor = 'black'
                        game.style.scale = '100%'
                        playerD.style.filter = 'none'
                        bulletCircle.remove()
                    }, 250);

                    data.stats.timesParried++

                    getAchievement('stylish')

                    if(data.stats.timesParried >= 50) {
                        getAchievement('flashy')
                    }

                    if(data.stats.timesParried >= 250) {
                        getAchievement('fancy')
                    }

                    if(data.stats.timesParried >= 500) {
                        getAchievement('ostentatious')
                    }

                    if(player.combo >= 100) {
                        getAchievement('murderSpree')
                    }
                })

                setTimeout(() => {
                    player.block.available = true
                    doge('innerBlockHitbox').classList.remove('blockHitboxAnim')
                    doge('blockHitbox').classList.remove('blockHitboxFlashAnim')
                    doge('blockHitbox').style.outline = '3px solid rgb(255, 255, 255, 0.1)'
                    DeBread.shake(game, 10, 2, 2, 250)
                }, player.block.cooldown)
            }

            if(ev.key.toLowerCase() === 'arrowup') {
                currentWaveSize++
            }

            if(ev.key.toLowerCase() === 'arrowdown') {
                if(currentWaveSize > 0) {
                    currentWaveSize--
                }
            }
            doge('areaText').innerText = currentWaveSize

            if(ev.key.toLowerCase() === 'b') {
                createExplosion([cursor.pos[0], cursor.pos[1]], 250, 25, true)
            }
        }
    }
    if(ev.key.toLowerCase() === '`') {
        data.settings.fpsCounter = !data.settings.fpsCounter
        if(data.settings.fpsCounter) {
            doge('dbFPS').style.opacity = 1
            doge('dbFPSMS').style.opacity = 1
            DeBread.playSound('media/audio/checkboxCheck.mp3')
        } else {
            doge('dbFPS').style.opacity = 0
            doge('dbFPSMS').style.opacity = 0
            DeBread.playSound('media/audio/checkboxUncheck.mp3')
        }
        doge('scb-fpsCounter').checked = data.settings.fpsCounter
        doge('scb-fpsCounter').setAttribute('checked', data.settings.fpsCounter)    
    }

    if(ev.key.toLowerCase() === 'tab') {
        doge('statsContainer').style.left = '25px'
        ev.preventDefault()
    }
})

document.addEventListener('keyup', (ev) => {
    if(ev.key.toLowerCase() === 'w' && player.intervals.up) {
        clearInterval(player.intervals.up)
        player.intervals.up = undefined
    }
    if(ev.key.toLowerCase() === 'a' && player.intervals.left) {
        clearInterval(player.intervals.left)
        player.intervals.left = undefined
    }
    if(ev.key.toLowerCase() === 's' && player.intervals.down) {
        clearInterval(player.intervals.down)
        player.intervals.down = undefined
    }
    if(ev.key.toLowerCase() === 'd' && player.intervals.right) {
        clearInterval(player.intervals.right)
        player.intervals.right = undefined
    }
    if(ev.key.toLowerCase() === 'tab') {
        ev.preventDefault()
        if(!data.settings.keepStatsOpen) {
            doge('statsContainer').style.left = -doge('statsContainer').offsetWidth + 'px'
        }
    }
})

//stamina recharge interval
setInterval(() => {
    if(!paused && performance.now() - player.dashDate > 1000 - (Math.max(250, (player.staminaRegen - 1) * 10)) && player.stamina < 100) {
        player.stamina += player.staminaRegen
        updateUI()
    }
    if(player.stamina > 100) {
        player.stamina = 100
    }
}, 100);

//God please kill me
function updatePlayerDirection() {
    if(!characters[data.selectedCharacter].noLookingDirections) {
        if(!player.taunting && doge('playerTextureContainer').children.length > 0) {
            const character = characters[data.selectedCharacter].name.toLowerCase().replaceAll(' ', '_')
        
            doge('playerTextureContainer').innerHTML = ''
            if (cursor.pos[1] < player.pos[1] && cursor.pos[0] < player.pos[0]) {
                doge('playerTextureContainer').append(getImage(`media/characters/${character}-upleft.png`))
            } else if (cursor.pos[1] < player.pos[1] && cursor.pos[0] > player.pos[0] + playerD.offsetWidth) {
                doge('playerTextureContainer').append(getImage(`media/characters/${character}-upright.png`))
            } else if (cursor.pos[1] > player.pos[1] + playerD.offsetHeight && cursor.pos[0] < player.pos[0]) {
                doge('playerTextureContainer').append(getImage(`media/characters/${character}-downleft.png`))
            } else if (cursor.pos[1] > player.pos[1] + playerD.offsetHeight && cursor.pos[0] > player.pos[0] + playerD.offsetWidth) {
                doge('playerTextureContainer').append(getImage(`media/characters/${character}-downright.png`))
            } else if (cursor.pos[1] < player.pos[1]) {
                doge('playerTextureContainer').append(getImage(`media/characters/${character}-up.png`))
            } else if (cursor.pos[0] < player.pos[0]) {
                doge('playerTextureContainer').append(getImage(`media/characters/${character}-left.png`))
            } else if (cursor.pos[0] > player.pos[0] + playerD.offsetWidth) {
                doge('playerTextureContainer').append(getImage(`media/characters/${character}-right.png`))
            } else if (cursor.pos[1] > player.pos[1] + playerD.offsetHeight) {
                doge('playerTextureContainer').append(getImage(`media/characters/${character}-down.png`))
            } else {
                doge('playerTextureContainer').append(getImage(`media/characters/${character}-normal.png`))
            }
        }
    } else {
        const character = characters[data.selectedCharacter].name.toLowerCase().replaceAll(' ', '_')
        doge('playerTextureContainer').innerHTML = ''
        doge('playerTextureContainer').append(getImage(`media/characters/${character}-normal.png`))
    }
}

function update() {
    //POSITION
    playerD.style.top = player.pos[1]+'px'
    playerD.style.left = player.pos[0]+'px'

    playerD.style.width = player.size + 'px'
    playerD.style.height = player.size + 'px'


    player.realPos[0] = player.pos[0] + (playerD.offsetWidth / 2)
    player.realPos[1] = player.pos[1] + (playerD.offsetHeight / 2)

    blockHitbox.style.left = player.realPos[0] - blockHitbox.offsetWidth / 2 +'px'
    blockHitbox.style.top = player.realPos[1] - blockHitbox.offsetHeight / 2 +'px'

    gunD.pos = [(player.pos[0] + playerD.offsetHeight / 2 - gunD.offsetHeight / 2), (player.pos[1] + playerD.offsetWidth / 2 - gunD.offsetWidth / 2)]

    gunD.style.left = gunD.pos[0] + 'px'
    gunD.style.top = gunD.pos[1] + 'px'

    //GUN ROTATION
    const dx = (cursor.pos[0] - player.pos[0] - playerD.offsetWidth / 2)
    const dy = (cursor.pos[1] - player.pos[1] - playerD.offsetHeight / 2)

    gunD.style.rotate = Math.atan2(dy, dx) * 180.0 / Math.PI + 'deg'

    //GUN TRANSLATION
    if(gunD.pos[0] < cursor.pos[0]) {
        gunD.translateInt[0] = 40
        gunD.facing = 1
        gunD.style.transform = 'rotateZ(0deg)'
    } else if(gunD.pos[0] > cursor.pos[0]) {
        gunD.translateInt[0] = -40
        gunD.facing = 0
        gunD.style.transform = 'rotateZ(180deg) rotateY(180deg)'
    }
    gunD.style.translate = `${gunD.translateInt[0]}px ${gunD.translateInt[1]}px`
    updatePlayerDirection()

    //BLOCK SIZE UPDATE
    blockHitbox.style.width = player.block.size + 'px'

    //DRAW SHOOTING LINE
    gameCanvasCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height)
    if(player.alive) {
        gameCanvasCtx.strokeStyle = 'rgb(255, 255, 255, 0.05)'
        gameCanvasCtx.lineWidth = player.gun.bulletSize
        gameCanvasCtx.beginPath()
        
        const gunCenterX = gunD.pos[0] + gunD.translateInt[0] + gunD.offsetWidth / 2
        const gunCenterY = gunD.pos[1] + gunD.offsetHeight / 2
    
        const directionX = cursor.pos[0] - gunCenterX
        const directionY = cursor.pos[1] - gunCenterY
        
        const extendedEndpointX = gunCenterX + directionX * 100000
        const extendedEndpointY = gunCenterY + directionY * 100000
        
        gameCanvasCtx.moveTo(gunCenterX, gunCenterY)
        gameCanvasCtx.lineTo(extendedEndpointX, extendedEndpointY)
        gameCanvasCtx.stroke()
    }

    gameCanvasCtx.closePath()
    
    //DRAW ENEMY SHOOTING LINES

    game.querySelectorAll('enemy').forEach(enemy => {
        if(enemy.hasGun && !enemy.preparing && player.alive) {
            const enemyColor = DeBread.rgbStringToArray(enemy.color)

            gameCanvasCtx.strokeStyle = `rgb(${enemyColor[0]}, ${enemyColor[1]}, ${enemyColor[2]}, 0.05)`
            gameCanvasCtx.lineWidth = enemy.bulletSize
            gameCanvasCtx.beginPath()

            gameCanvasCtx.moveTo(enemy.pos[0] + enemy.size / 2, enemy.pos[1] + enemy.size / 2)
            gameCanvasCtx.lineTo(player.realPos[0], player.realPos[1])
            gameCanvasCtx.stroke()

            gameCanvasCtx.closePath()
        }
    })

    //DRAW THAT SPECIAL GUY'S LINE AND PREVENT HEALING AND OTHER STUFF

    let specialGuys = 0
    game.querySelectorAll('enemy').forEach(enemy => {
        if(enemy.blockPlayerHeal && !enemy.preparing && player.alive) {
            gameCanvasCtx.strokeStyle = `rgb(184, 237, 255, 0.5)`
            gameCanvasCtx.lineWidth = 10
            gameCanvasCtx.beginPath()

            gameCanvasCtx.moveTo(enemy.pos[0] + enemy.size / 2, enemy.pos[1] + enemy.size / 2)
            gameCanvasCtx.lineTo(player.realPos[0], player.realPos[1])
            gameCanvasCtx.stroke()

            gameCanvasCtx.closePath()

            specialGuys++
        }
    })

    if(specialGuys) {
        player.canHeal = false

        doge('healthBarContainer').style.filter = 'grayscale()'
    } else {
        player.canHeal = true

        doge('healthBarContainer').style.filter = `none`
    }

    //Draw passive damage stuff
    game.querySelectorAll('enemy').forEach(enemy => {
        if(enemy.dealPassiveDamage && !enemy.preparing && player.alive) {
            gameCanvasCtx.strokeStyle = `rgb(161, 47, 100, 0.5)`
            gameCanvasCtx.lineWidth = 10
            gameCanvasCtx.beginPath()

            gameCanvasCtx.moveTo(enemy.pos[0] + enemy.size / 2, enemy.pos[1] + enemy.size / 2)
            gameCanvasCtx.lineTo(player.realPos[0], player.realPos[1])
            gameCanvasCtx.stroke()

            gameCanvasCtx.closePath()
        }
    })

    //CROSSHAIR AMMO UPDATE

    if(!player.gun.reloading) {
        doge('innerCrosshairAmmo').style.width = (player.gun.ammo / player.gun.maxAmmo) * 100 + '%'
    }

    //SCREENSHAKE

    if(data.settings.screenshake) {
        for(let i = 0; i < 2; i++) {
            if(game.shake[i] > 25) {
                game.shake[i] = 20
            } if(game.shake[i] > 10) {
                game.shake[i] /= 1.1
            } else if(game.shake[i] > 0) {
                game.shake[i] -= 0.5
            } else {
                game.shake[i] = 0
            }
        }
        game.style.translate = `${DeBread.randomNum(-game.shake[0], game.shake[0])}px ${DeBread.randomNum(-game.shake[1], game.shake[1])}px`
    }

    //ENEMY BULLET UPDATE

    game.querySelectorAll('.enemyBullet').forEach((bullet) => {
        if(!paused) {
            bullet.pos[0] += bullet.speed * Math.cos(bullet.angle)
            bullet.pos[1] += bullet.speed * Math.sin(bullet.angle)

            if(bullet.hurtSelf) {
                DeBread.createParticles(
                    game,
                    1,
                    0,
                    1500,
                    'ease-out',
                    [[bullet.pos[0] + bullet.size / 2, bullet.pos[0] + bullet.size / 2], [bullet.pos[1] + bullet.size / 2, bullet.pos[1] + bullet.size / 2]],
                    [[[bullet.size, bullet.size], [bullet.size, bullet.size]], [[0, 0], [0, 0]]],
                    [[-90, 90], [-180, 180]],
                    [[-5, 5], [-5, 5]],
                    [[255, 0, 0], [255, 100, 0]],
                    [[255, 0, 0], [255, 100, 0]],
                    true
                )
            }

            if(bullet.hurtSelf) {
                if(bullet.style.backgroundColor === 'red') {
                    bullet.style.backgroundColor = 'yellow'
                } else {
                    bullet.style.backgroundColor = 'red'
                }
            }
    
            bullet.style.left = bullet.pos[0]+'px'
            bullet.style.top = bullet.pos[1]+'px'

            if(isColliding(bullet, playerD) && gameActive) {
                clearInterval(bullet.gunUpdateInterval)
                bullet.remove()
                if(bullet.explosionSize) {
                    createExplosion([bullet.pos[0], bullet.pos[1]], bullet.explosionSize, bullet.damage)
                }
                if(bullet.poisonFieldTicks) {
                    createPoisonField([bullet.pos[0], bullet.pos[1]], 100, bullet.poisonFieldTicks, bullet.damage / 2, false)
                }

                DeBread.createParticles(
                    game,
                    25,
                    0,
                    250,
                    'ease-out',
                    [[bullet.pos[0], bullet.pos[0]], [bullet.pos[1], bullet.pos[1]]],
                    [[[5, 5], [5, 5]], [[0, 0], [0, 0]]],
                    [[0, 0], [-90, 90]],
                    [[-50, 50], [-50, 50]],
                    [[255, 0, 0], [255, 0, 0]],
                    [[255, 0, 0], [255, 0, 0]]
                )
                damagePlayer(bullet.damage * enemyInfo.damageMultiplier)
                if(player.immune) {
                    DeBread.createParticles(
                        game,
                        25,
                        0,
                        250,
                        'ease-out',
                        [[bullet.pos[0], bullet.pos[0]], [bullet.pos[1], bullet.pos[1]]],
                        [[[5, 5], [5, 5]], [[0, 0], [0, 0]]],
                        [[0, 0], [-90, 90]],
                        [[-50, 50], [-50, 50]],
                        [[200, 200, 200], [200, 200, 200]],
                        [[200, 200, 200], [200, 200, 200]]
                    )
                }

                updateUI()

                if(bullet.hurtSelf) {
                    setTimeout(() => {
                        if(player.health <= 0) {
                            getAchievement('heyGuysWatchThis')
                        }
                    }, 100);
                }
            }

            if(bullet.hurtSelf) {
                game.querySelectorAll('enemy').forEach((enemy) => {
                    if(isColliding(bullet, enemy) && !enemy.preparing) {
                        enemy.damage(bullet.damage)
                        createExplosion([bullet.pos[0], bullet.pos[1]], 250, bullet.damage, true)
                        if(player.block.parryPoisonFieldTicks) {
                            createPoisonField([bullet.pos[0], bullet.pos[1]], 75 + player.block.parryPoisonFieldTicks, player.block.parryPoisonFieldTicks, player.gun.damage / 2.5, true)
                        }
                        if(bullet.poisonFieldTicks) {
                            createPoisonField([bullet.pos[0], bullet.pos[1]], 100, bullet.poisonFieldTicks, bullet.damage / 5, false)
                        }
                        clearInterval(bullet.gunUpdateInterval)
                        bullet.remove()
                    }
                })
            }

            if(isColliding(bullet, blockHitbox)) {
                bullet.style.boxShadow = '0px 0px 0px 1px black, 0px 0px 0px 3px white'
            } else {
                bullet.style.boxShadow = 'none'
            }

            if(
                bullet.pos[0] < 0 || 
                bullet.pos[0] + bullet.size > game.offsetWidth || 
                bullet.pos[1] < 0 ||
                bullet.pos[1] + bullet.size > game.offsetHeight
            ) {
                if(bullet.explosionSize) {
                    createExplosion([bullet.pos[0], bullet.pos[1]], bullet.explosionSize, bullet.damage * enemyInfo.damageMultiplier)
                }
                if(bullet.hurtSelf) {
                    createExplosion([bullet.pos[0], bullet.pos[1]], 250, bullet.damage, true)
                    if(player.block.parryPoisonFieldTicks) {
                        createPoisonField([bullet.pos[0], bullet.pos[1]], 75 + player.block.parryPoisonFieldTicks, player.block.parryPoisonFieldTicks, player.gun.damage / 5, true)
                    }
                }
                if(bullet.poisonFieldTicks) {
                    createPoisonField([bullet.pos[0], bullet.pos[1]], 100, bullet.poisonFieldTicks, (bullet.damage / 5) * enemyInfo.damageMultiplier, false)
                }
                DeBread.createParticles(
                    game,
                    5,
                    0,
                    250,
                    'ease-out',
                    [[bullet.pos[0], bullet.pos[0] + bullet.size], [bullet.pos[1], bullet.pos[1] + bullet.size]],
                    [[[bullet.size / 2, bullet.size / 2], [bullet.size / 2, bullet.size / 2]], [[0, 0], [0, 0]]],
                    [[0, 0], [-90, 90]],
                    [[-50, 50], [-50, 50]],
                    [[255, 25, 25], [255, 25, 25]],
                    [[255, 25, 25], [255, 25, 25]],
                    true
                )
                clearInterval(bullet.gunUpdateInterval)
                bullet.remove()
            }
        }
    })
} setInterval(update, 10)
function updateUI() {
    //HEALTH
    //get health from DOM
    let healthFromText = ''
    doge('healthDisplay').querySelectorAll('div').forEach(div => {
        healthFromText += div.innerText
    })

    if(parseInt(healthFromText) !== player.health) {
        doge('healthDisplay').innerHTML = ''
        for(let i = 0; i < Math.round(player.health).toString().length; i++) {
            const letterDiv = document.createElement('div')
            letterDiv.innerText = Math.round(player.health).toString()[i]
            doge('healthDisplay').append(letterDiv)
        }
    }
    doge('healthBar').style.width = player.health / player.maxHealth * 100 + '%'
    doge('lowerHealthBar').style.width = player.health / player.maxHealth * 100 + '%'

    //STAMINA
    doge('staminaBar').style.width = Math.max(player.stamina, 0) + '%'

    doge('staminaBarOverlay').innerHTML = ''
    for(let i = 0; i < player.dashes; i++) {
        const div = document.createElement('div')
        doge('staminaBarOverlay').append(div)
    }

    //AMMO
    if(!player.gun.reloading) {
        if(player.gun.ammo < 100) {
            doge('ammoNumber').innerText = player.gun.ammo.toString().padStart(2, 0)
        
            if(!player.gun.reloading) {
                let ammoNumberBarOutput = ''
                for(let i = 0; i < player.gun.ammo; i++) {
                    ammoNumberBarOutput += '|'
                }
                doge('ammoNumberBar').innerText = ammoNumberBarOutput
            }
        } else {
            doge('ammoNumber').innerText = 'A LOT'
            doge('ammoNumberBar').innerText = ''
        }
    }

    //COMBO
    doge('comboDisplay').innerText = `x${player.combo}`
} updateUI()

document.addEventListener('mousemove', ev => {
    cursor.pos[0] = ev.x - game.getBoundingClientRect().left
    cursor.pos[1] = ev.y - game.getBoundingClientRect().top
    updatePlayerDirection()

    doge('crosshairAmmo').style.left = cursor.pos[0] - 15 + 'px'
    doge('crosshairAmmo').style.top = cursor.pos[1] - 25 + 'px'
})

document.addEventListener('contextmenu', ev => {
    ev.preventDefault()
})

document.addEventListener('mousedown', ev => {
    if(!disableInput && !selectedEnemy && !hoveringOnToolbox && !radiateTool) {
        if(ev.button === 0) {
            let burstLength = player.gun.burstLength
            if(player.gun.ammo === 0) {
                burstLength = 1
            } else if(player.gun.burstLength > player.gun.ammo) {
                burstLength = player.gun.ammo
            }
            for(let i = 0; i < burstLength; i++) {
                setTimeout(() => {
                    for(let j = 0; j < player.gun.multishot; j++) {
                        const bullet = document.createElement('div')

                        if(player.gun.ammo > 0) {
                            player.gun.ammo--
                    
                            DeBread.playSound('media/audio/shoot.mp3', 0.25)                        
    
                            //BULLET DIV INFO
                            const cursorPos = [cursor.pos[0], cursor.pos[1]]

                            // const bullet = getImage('media/bullet.png') //this does NOT work

                            
                            bullet.id = 'playerBullet'
                            bullet.classList.add('bullet')
    
                            //IS CRIT?
                            if(DeBread.randomNum(0, 100) <= player.gun.critChance) {
                                bullet.crit = true
                            } else {
                                bullet.crit = false
                            } 
    
                            if(!characters[data.selectedCharacter].customBulletTexture) {
                                if(player.gun.bulletSize >= 20) {
                                    bullet.style.background = 'url(media/bulletBig.png)'
                                    bullet.style.backgroundSize = 'contain'
                                }
                            } else {
                                bullet.style.background = `url(${characters[data.selectedCharacter].customBulletTexture})`
                                bullet.style.imageRendering = 'pixelated'
                                bullet.style.backgroundSize = 'contain'
                            }
                            
                            bullet.ricochet = player.gun.ricochetAmount
                            bullet.pos = [(gunD.pos[0] + gunD.translateInt[0] + gunD.offsetWidth / 2) - player.gun.bulletSize / 2, (gunD.pos[1] + gunD.offsetHeight / 2) - player.gun.bulletSize / 2]
                            if(bullet.crit) {
                                bullet.damage = player.gun.damage * player.gun.critMultiplier
                            } else {
                                bullet.damage = player.gun.damage
                            }
                            bullet.angle = Math.atan2(cursorPos[1] - (gunD.pos[1] + gunD.offsetHeight / 2), cursorPos[0] - (gunD.pos[0] + gunD.translateInt[0] + gunD.offsetWidth / 2))
                            bullet.speed = [player.gun.bulletSpeed, player.gun.bulletSpeed]
                            bullet.style.rotate = bullet.angle + 'rad'
                            bullet.style.width = player.gun.bulletSize+'px'
                            bullet.timesRicocheted = 0
                            let magnetStrength = player.gun.magnet * 2
                        
                            //BULLET MOVEMENT INTERVAL
                            bullet.interval = setInterval(() => {
                                if(!paused) {
                                    bullet.pos[0] += bullet.speed[0] * Math.cos(bullet.angle)
                                    bullet.pos[1] += bullet.speed[1] * Math.sin(bullet.angle)
                            
                                    bullet.style.left = bullet.pos[0]+'px'
                                    bullet.style.top = bullet.pos[1]+'px'
                    
                                    bullet.damage += player.gun.grow

                                    //MAGNET
                                    if(player.gun.magnet) {
                                        let lowestDistance = 10000000
                                        let lowestEnemy
                                        const bulletCenterPos = [bullet.pos[0] + bullet.offsetWidth / 2, bullet.pos[1] + bullet.offsetHeight / 2]
                                        game.querySelectorAll('enemy').forEach(enemy => {
                                            // enemy.style.outline = 'none'
                                            const enemyCenterPos = [enemy.pos[0] + enemy.offsetWidth / 2, enemy.pos[1] + enemy.offsetHeight / 2]
                                            const dis = Math.hypot(bulletCenterPos[0] - enemyCenterPos[0], bulletCenterPos[1] - enemyCenterPos[1])
                                            if(dis < lowestDistance) {
                                                lowestDistance = dis
                                                lowestEnemy = enemy
                                            }
                                        })
                                        if(lowestEnemy) {
                                            // lowestEnemy.style.outline = `5px solid red`
                                            
                                            const angleTowardsLowestEnemy = Math.atan2(lowestEnemy.pos[1] + lowestEnemy.offsetHeight / 2 - bulletCenterPos[1], lowestEnemy.pos[0] + lowestEnemy.offsetWidth / 2 - bulletCenterPos[0])
                                            bullet.pos[0] += magnetStrength * Math.cos(angleTowardsLowestEnemy)
                                            bullet.pos[1] += magnetStrength * Math.sin(angleTowardsLowestEnemy)
                                            bullet.style.rotate = angleTowardsLowestEnemy + 'rad'
                                            magnetStrength += 0.025
                                        }
                                    } 

                                    //CORRECT BULLET POSITION
                                    // if(bullet.pos[0] < 0) {bullet.pos[0] = 0; console.log('bulletX0 corrected!')}
                                    // if(bullet.pos[0] + player.gun.bulletSize > game.offsetWidth) {bullet.pos[0] = game.offsetWidth - player.gun.bulletSize; console.log('bulletX1 corrected!')}
                                    // if(bullet.pos[1] < 0) {bullet.pos[1] = 0; console.log('bulletY0 corrected!')}
                                    // if(bullet.pos[1] + player.gun.bulletSize > game.offsetHeight) {bullet.pos[1] = game.offsetHeight - player.gun.bulletSize; console.log('bulletY1 corrected!')}
                            
                                    //OUT OF BOUNDS
                                    if(bullet.ricochet > 0) {
                                        if(bullet.pos[0] < 0 || bullet.pos[0] + player.gun.bulletSize > game.offsetWidth) {
                                            bullet.speed[0] = -bullet.speed[0]
                                            bulletBounce()
                                        }
                                        if(bullet.pos[1] < 0 || bullet.pos[1] + player.gun.bulletSize > game.offsetHeight) {
                                            bullet.speed[1] = -bullet.speed[1]
                                            bulletBounce()
                                        }
                    
                                        function bulletBounce() {
                                            DeBread.playSound('media/audio/bulletBreak.mp3', 0.2)
                                            bullet.timesRicocheted++
                                            bullet.damage *= player.gun.ricochetMultiplier
                                            if(player.gun.explosionSize) {
                                                createExplosion([bullet.pos[0] + player.gun.bulletSize / 2, bullet.pos[1] + player.gun.bulletSize / 2], player.gun.explosionSize, bullet.damage, false, true)
                                            }
                                        }
                                    } else if(
                                        bullet.pos[0] < 0 || 
                                        bullet.pos[0] + player.gun.bulletSize > game.offsetWidth || 
                                        bullet.pos[1] < 0 || 
                                        bullet.pos[1] + player.gun.bulletSize > game.offsetHeight
                                        ) {
                                        DeBread.createParticles(
                                            game,
                                            5,
                                            0,
                                            250,
                                            'ease-out',
                                            [[bullet.pos[0], bullet.pos[0] + player.gun.bulletSize], [bullet.pos[1], bullet.pos[1] + player.gun.bulletSize]],
                                            [[[player.gun.bulletSize / 2, player.gun.bulletSize / 2], [player.gun.bulletSize / 2, player.gun.bulletSize / 2]], [[0, 0], [0, 0]]],
                                            [[0, 0], [-90, 90]],
                                            [[-50, 50], [-50, 50]],
                                            [[255, 255, 255], [255, 255, 255]],
                                            [[255, 255, 255], [255, 255, 255]],
                                            true
                                        )
                                        DeBread.playSound('media/audio/bulletBreak.mp3', 0.2)
                                        if(player.gun.explosionSize) {
                                            createExplosion([bullet.pos[0] + player.gun.bulletSize / 2, bullet.pos[1] + player.gun.bulletSize / 2], player.gun.explosionSize, bullet.damage, false, true)
                                        }
                                        bullet.remove()
                                        clearInterval(bullet.interval)
                                    }
                        
                                    //ENEMY HIT
                                    game.querySelectorAll('enemy').forEach(enemy => {
                                        if(isColliding(bullet, enemy) && !enemy.preparing) {
                                            if(bullet.crit) {
                                                createPopupText([bullet.pos[0], bullet.pos[1]], (bullet.damage * enemy.damageReduction), 15 * (((bullet.damage * enemy.damageReduction) / 10) + 1), ((bullet.damage * enemy.damageReduction) * 10) + 700, 'aqua')
                                                getPoints(15 * ((player.combo / 10) + 1), '+Crit')
                                                DeBread.playSound('media/audio/crit.mp3')
                                            } else {
                                                createPopupText([bullet.pos[0], bullet.pos[1]], (bullet.damage * enemy.damageReduction), 15 * (((bullet.damage * enemy.damageReduction) / 10) + 1), ((bullet.damage * enemy.damageReduction) * 10) + 500, 'white')
                                            }
                                            for(let i = 0; i < bullet.timesRicocheted; i++) {
                                                setTimeout(() => {
                                                    getPoints((5 * bullet.timesRicocheted) * ((player.combo / 5) + 1), '+Ricochet')
                                                }, i * 25);
                                            }
    
                                            if(bullet.damage >= 100) {
                                                getAchievement('cooked')
                                            }
    
                                            if(bullet.damage >= enemy.health * 2 && enemy.health > 5) {
                                                getPoints((bullet.damage * 1.5) * ((player.combo / 5) + 1), '+Overkill')
                                            }
    
                                            bullet.remove()
                                            clearInterval(bullet.interval)
    
                                            if(bullet.timesRicocheted > 0) {
                                                getAchievement('trickShot')
                                            }
                        
                                            if(player.parasite > 0 && player.health < player.maxHealth) {
                                                damagePlayer(-(bullet.damage * player.parasite))
                                                createPopupText([player.realPos[0], player.realPos[1]], bullet.damage * player.parasite * enemy.damageReduction, 17, 700, 'lime')
                                            }
                    
                                            //POISON
            
                                            if(player.gun.poisonLength) {
                                                enemy.poisonDamage += player.gun.damage / 10
                                                enemy.poisonTicks++
                                                setTimeout(() => {
                                                    enemy.poisonDamage -= player.gun.damage / 10
                                                    enemy.poisonTicks--
                                                }, 500 * player.gun.poisonLength)
                                            }
    
                                            if(player.gun.fireDamage > 0) {
                                                enemy.onFire = true
                                            }
            
                                            if(!enemy.onFire) {
                                                enemy.damage(bullet.damage)
                                                player.style++
                                            } else {
                                                enemy.damage(bullet.damage * 1.25)
                                                player.style++
                                            }
    
                                            if(player.gun.explosionSize) {
                                                createExplosion([bullet.pos[0], bullet.pos[1]], player.gun.explosionSize, bullet.damage)
                                            }
                    
                                            DeBread.createParticles(
                                                game,
                                                25,
                                                0,
                                                250,
                                                'ease-out',
                                                [[bullet.pos[0], bullet.pos[0]], [bullet.pos[1], bullet.pos[1]]],
                                                [[[5, 5], [5, 5]], [[0, 0], [0, 0]]],
                                                [[0, 0], [-90, 90]],
                                                [[-50, 50], [-50, 50]],
                                                [[255, 0, 0], [255, 0, 0]],
                                                [[255, 0, 0], [255, 0, 0]]
                                            )
                        
                                            //What the fuck is this???
                                            // if(enemy.health <= 0) {killEnemy()}
                                            // function killEnemy() {                            
                                            //     enemy.kill()
                                            // } //Commented out becuase its so stupid i wanna keep it here
                                        }
                                    })
    
                                    //MAGNET HIT
    
                                    game.querySelectorAll('.magnet').forEach(magnet => {
                                        if(isColliding(bullet, magnet)) {
                                            bullet.remove()
                                            clearInterval(bullet.interval)
                                            magnet.activate()
                                        }
                                    })
                                }
                            }, 10 * gameSpeed);
                        
                            //EFFECTS
                            if(data.settings.screenshake) {
                                const shakeAngle = Math.atan2(cursorPos[1] - (gunD.pos[1] + gunD.offsetHeight / 2), cursorPos[0] - (gunD.pos[0] + gunD.translateInt[0] + gunD.offsetWidth / 2))
                                //i tried to use a loop to optimize this, it dont work :(
                                if(game.shake[0] < 10) {
                                    game.shake[0] = Math.abs(Math.cos(shakeAngle)) * 5
                                }
                                if(game.shake[1] < 10) {
                                    game.shake[1] = Math.abs(Math.sin(shakeAngle)) * 5
                                }
                            }
                        
                            updateUI()
                            game.append(bullet)
                            setTimeout(() => {
                                bullet.style.opacity = 1
                            }, 10);

                            //Add to challenges
                            increaseChallengeProgress('shoot', 1)
    
                        } else {
                            DeBread.shake(doge('ammoUI'), 10, 5, 0, 100)
                            DeBread.playSound('media/audio/noAmmo.mp3', 0.25)
                        }
                        if(player.gun.ammo === 0) {
                            doge('ammoNumber').style.color = 'red'
                        } else {
                            doge('ammoNumber').style.color = 'white'
                        }
                    }
                }, (100 / burstLength) * i);
            }
        }

        //BLOCK
        if(ev.button === 2) playerD.block()
    }

})

//PAUSE SCREEN

function togglePauseScreen() {
    if(gameActive) {
        if(doge('pauseContainer').style.display === 'flex') {
            //CLOSE
            doge('pauseContainer').style.display = 'none'
            disableInput = false
            paused = false
        } else {
            //OPEN
            doge('pauseContainer').style.display = 'flex'
            disableInput = true
            paused = true
        }
    }
}

//DEATH SCREENS
const deathVideos = [
    {
        src: 'fries.mp4',
        delay: 12000,
    },
    {
        src: 'sex.mp4',
        delay: 5000,
    }
]

//PLAYER DAMAGE
function damagePlayer(amount, affectCombo = true) {
    if(gameActive && !paused) {
        if(amount > 0 && !player.immune) {
            if(player.health !== 1 && player.health !== 0 && player.health - Math.max(amount, 0) <= 0) {
                player.health = 1
            } else {
                player.health -= amount
            }
        }

        player.health = Math.max(0, player.health)
        
        if(amount < 0 && player.canHeal) {
            player.health -= amount
        }

        player.health = Math.min(player.maxHealth, player.health)
        
        updateUI()
        const healthBarRect = doge('healthBar').getBoundingClientRect()
        if(amount > 0 && !player.immune) {
            if(affectCombo) {
                if(player.style - 25 < 0) {
                    player.style = 0
                } else {
                    player.style -= 25
                }
            }

            updateUI()

            DeBread.easeShake(doge('styleDisplay'), 10, 10, 1)
            doge('healthDisplay').querySelectorAll('div').forEach(div => {
                DeBread.easeShake(div, 10, Math.min(amount / 2, 150), 1)
            })

            DeBread.easeShake(doge('healthBarContainer'), 10, Math.min(amount / 5, 100), 1)
            DeBread.playSound(`media/audio/hit${DeBread.randomNum(0, 2)}.mp3`, 0.5)
            doge('comboDisplay').innerText = `x${player.combo}`
            DeBread.createParticles(
                document.body,
                Math.min(amount * 1.5, 100),
                0,
                1000,
                'cubic-bezier(0,1,.5,1)',
                [[healthBarRect.left, healthBarRect.right], [healthBarRect.top, healthBarRect.bottom]],
                [[[10, 10], [10, 10]], [[0, 0], [0, 0]]],
                [[0, 0], [-90, 90]],
                [[-25, 25], [-25, 25]],
                [[255, 0, 0], [255, 0, 0]],
                [[255, 0, 0], [255, 0, 0]],
                true
            )
        }

        if(amount > 0) { //????
            if(!player.immune) {
                createPopupText([player.realPos[0], player.realPos[1]], amount, 20, 600, 'red')
            } else {
                createPopupText([player.realPos[0], player.realPos[1]], amount, 20, 600, 'grey')
                getPoints(amount, '+Dodged')
            }
        }
        
        if(player.health === 1) {
            game.style.boxShadow = 'inset 0px 0px 50px rgb(255, 0, 0, 1)'
            doge('playerBarHeart').style.animation = 'heartPulse 500ms ease-out infinite forwards'
            game.style.filter = 'blur(1px)'

        } else if((player.health / player.maxHealth) * 100 <= 25) {
            game.style.boxShadow = 'inset 0px 0px 50px rgb(255, 0, 0, 0.25)'
            doge('playerBarHeart').style.animation = 'heartPulse 0.75s ease-out infinite forwards'
            game.style.filter = 'blur(0px)'
        } else {
            game.style.boxShadow = 'inset 0px 0px 0px transparent'
            doge('playerBarHeart').style.animation = 'none'
            game.style.filter = 'blur(0px)'
        }

        if(player.health === 0) {
            doge('playerBarHeart').src = 'media/blood/blood0.png'
            doge('playerBarHeart').style.animation = 'none'
            doge('playerBarHeart').style.scale = 2
        } else {
            doge('playerBarHeart').src = 'media/glyphs/health.png'
            doge('playerBarHeart').style.scale = 1
        }

        //DEATH
        if(player.health <= 0 && !data.settings.sandbox) {
        
            if(player.points > data.stats.highestScore) {
                data.stats.highestScore = player.points
                data.stats.activity.push([`& achieved a new high score of ${DeBread.round(player.points)}.`, Date.now()])
            }

            let deathDelay = 0
            
            if(DeBread.randomNum(0, 25) === 0 && data.level >= 10) {
                const randomKey = DeBread.randomNum(0, deathVideos.length - 1)
                doge('deathVideo').src = `media/${deathVideos[randomKey].src}`
                doge('deathVideo').style.opacity = 1
                doge('deathVideo').play()
                deathDelay = deathVideos[randomKey].delay
            } else {
                deathDelay = 3000
            }

            disableInput = true
            gameActive = false
            saveData()

            //DEATH EFFECT

            const deathSquare1 = document.createElement('freeElement')
            deathSquare1.classList.add('deathSquare1')
            deathSquare1.style.left = player.pos[0] + 'px'
            deathSquare1.style.top = player.pos[1] + 'px'

            const deathSquare2 = document.createElement('freeElement')
            deathSquare2.classList.add('deathSquare2')
            deathSquare2.style.left = player.pos[0] + 'px'
            deathSquare2.style.top = player.pos[1] + 'px'

            game.append(deathSquare1)
            game.append(deathSquare2)

            setTimeout(() => {
                deathSquare1.remove()
                deathSquare2.remove()
            }, 2000);

            //RENDER POINT DISTRIBUTION
            let sortableArray = []
            for (const key in player.pointDistribution) {
                sortableArray.push([key, player.pointDistribution[key]]);
            }
            
            sortableArray.sort(function(a, b) {
                return a[1] - b[1];
            })

            doge('pointDistributionContainer').innerHTML = ''
            let pointTotal = 0
            for(const key in sortableArray) {
                pointTotal += sortableArray[key][1]
            }

            for(const key in sortableArray) {
                const div = document.createElement('div')
                div.style.width = `${sortableArray[key][1] / pointTotal * 100}%`
                div.setAttribute('ouegh', sortableArray[key][0])
                doge('pointDistributionContainer').append(div)

                div.onmouseenter = () => {
                    doge('pointDistributionTooltip').innerText = `${sortableArray[key][0].replaceAll('_',' ')}: ${DeBread.round(sortableArray[key][1])} (${DeBread.round(sortableArray[key][1] / pointTotal * 100, 2)}%)`
                }
                div.onmouseleave = () => {
                    doge('pointDistributionTooltip').innerText = ''
                }
            }

            //OTHER STUFF

            DeBread.easeShake(game, 25, 10, 0.1)
            playerD.style.opacity = 0
            gunD.style.opacity = 0
            blockHitbox.style.opacity = 0
            player.alive = false

            getXP(player.points / 75)
    
            game.querySelectorAll('enemy').forEach((enemy) => {
                if(enemy.alive) {
                    clearInterval(enemy.interval)
                    if(enemy.poisonFieldInterval) {clearInterval(enemy.poisonFieldInterval)}
                    if(enemy.gunInterval) {clearInterval(enemy.gunInterval)}
                }
            })

            setTimeout(() => {
                deathScreen()
            }, deathDelay);

            getAchievement('gameOver')

        } else if(player.health <= 0) {
            doge('areaText').innerText = 'YOU ARE DEAD.'
        } else if(data.settings.sandbox) {
            doge('areaText').innerText = ''
        }

        if(DeBread.round(player.health) === 0 && player.alive) {
            getAchievement('closeCall')
        }

        if(!data.sandbox && amount !== 0) {
            if(amount > 0) {
                data.stats.damageTaken += amount
            } else {
                data.stats.healthHealed += -amount
            }
        }
    }
}

//HEALTH REGEN
setInterval(() => {
    if(gameActive && doge('shop').style.display === 'none' && player.health !== 1) {
        damagePlayer(-player.healthRegen / 10, true)
    }
}, 100);

//POINTS STUFF
let displayedPoints = 0
let lastStyle
function getPoints(base, styleText, real = true) { //This might just be the most jank thing ever
    amount = base * data.scoreMultiplier
    if(amount < Infinity &&  amount !== 0 && player.alive) {
        player.points += amount
        doge('xpDisplay').innerText = DeBread.round(player.points / 75) + 'XP'
        for(let i = 0; i < 25; i++) {
            setTimeout(() => {            
                displayedPoints += amount / 25
                if(i === 24) {
                    displayedPoints = player.points                    
                }
                doge('pointsDisplay').innerText = DeBread.round(displayedPoints).toString().padStart(10, 0)
            }, i * 5);
        }
        const style = document.createElement('div')
        style.classList.add('style')
    
        style.text = styleText
        style.amount = amount
        style.multiplier = 1
    
        if(lastStyle) {
            if(lastStyle.text === styleText) {
                lastStyle.amount += amount
                lastStyle.multiplier++
                lastStyle.innerHTML = `<span>${styleText} x${lastStyle.multiplier}</span><coolLine></coolLine><span>+${DeBread.round(lastStyle.amount)}</span>`
                // clearTimeout(lastStyle.timeout)
                // lastStyle.timeout = setTimeout(() => {
                //     lastStyle.remove()
                // }, 5000);
    
            } else {
                style.innerHTML = `<span>${styleText}</span><coolLine></coolLine><span>+${DeBread.round(amount)}</span>`
                doge('styleUI').append(style)
                lastStyle = style
            }
        } else {
            style.innerHTML = `<span>${styleText}</span><coolLine></coolLine><span>+${DeBread.round(amount)}</span>`
            doge('styleUI').append(style)
            lastStyle = style
        }
    
        if(style.innerHTML !== '') {
            doge('styleUI').append(style)
        }
        doge('styleUI').style.opacity = 1
        // style.timeout = setTimeout(() => {
        //     style.remove()
        // }, 5000);

        if(data.settings.sandbox) {real = false}
        if(real) {
            data.stats.totalScore += amount
        }
    }
    if(player.points >= 1000000000) {
        getAchievement('andIThought10DigitsWasTooMany')
    }

    //Add to point distribution
    if(!player.pointDistribution[styleText.replaceAll(' ','_').replaceAll('+','')]) {
        player.pointDistribution[styleText.replaceAll(' ','_').replaceAll('+','')] = base * data.scoreMultiplier
    } else {
        player.pointDistribution[styleText.replaceAll(' ','_').replaceAll('+','')] += base * data.scoreMultiplier
    }
}

let xpBarDownTimout
function getXP(amount) {
    clearTimeout(xpBarDownTimout)
    doge('xpContainer').style.bottom = '25px'
    doge('xpContainer').style.scale = '100%'
    xpBarDownTimout = setTimeout(() => {
        doge('xpContainer').style.bottom = '-50px'
        doge('xpContainer').style.scale = '90%'
        if(data.level >= 100) { //and people think im good at programming...
            getAchievement('grandmaster')
        }
        if(data.level >= 90) {
            getAchievement('legend')
        }
        if(data.level >= 80) {
            getAchievement('titan')
        }
        if(data.level >= 70) {
            getAchievement('elite')
        }
        if(data.level >= 60) {
            getAchievement('master')
        }
        if(data.level >= 50) {
            getAchievement('expert')
        }
        if(data.level >= 40) {
            getAchievement('professional')
        }
        if(data.level >= 30) {
            getAchievement('intermediate')
        }
        if(data.level >= 20) {
            getAchievement('novice')
        }
        if(data.level >= 10) {
            getAchievement('beginner')
        }
        saveData()
    }, 3000);
    setTimeout(() => {        
        for(let i = 0; i < 500; i++) {
            setTimeout(() => {
                data.xp += amount / 500
                updateXPBar()
                updateMenuProfile()
                if(i === 499) {
                    data.stats.xpChanges.push(data.xp)
                }
            }, 2 * i);
        }
    }, 500);
} updateXPBar()

function updateXPBar() {
    doge('xpCurrentLvlTxt').innerText = data.level
    if(Math.floor(data.level / 10 <= 10)) {
        doge('xpCurrentLvl').style.backgroundImage = `url(media/levelBadges/${Math.floor(data.level / 10)}.png)`
    } else {
        doge('xpCurrentLvl').style.backgroundImage = `url(media/levelBadges/10.png)`   
    }
    doge('xpNextLvlTxt').innerText = data.level + 1
    if(Math.floor((data.level + 1) / 10 <= 10)) {
        doge('xpNextLvl').style.backgroundImage = `url(media/levelBadges/${Math.floor((data.level + 1) / 10)}.png)`
    } else {
        doge('xpNextLvl').style.backgroundImage = `url(media/levelBadges/10.png)`   
    }


    let currentLevelXP = getCompoundXP(data.level)
    let nextLevelXP = getCompoundXP(data.level + 1)

    let xpPercentage = (data.xp - currentLevelXP) / (nextLevelXP - currentLevelXP) * 100
    doge('innerXpBar').style.width = xpPercentage + '%'
    doge('xpProgress').innerText = `${DeBread.round(data.xp - currentLevelXP).toLocaleString()} / ${DeBread.round(nextLevelXP - currentLevelXP).toLocaleString()} XP`

    if(data.xp >= nextLevelXP) {
        data.level++
        doge('xpCurrentLvl').style.animation = 'none'
        doge('xpNextLvl').style.animation = 'none'
        setTimeout(() => { 
            doge('xpCurrentLvl').style.animation = 'xpBadgePulse 500ms ease-out 1 forwards'
            doge('xpNextLvl').style.animation = 'xpBadgePulse 500ms ease-out 1 forwards'
            // DeBread.createParticles(
            //     doge('xpCurrentLvl'),
            //     25,
            //     0,
            //     1500,
            //     'ease-out',
            //     [[0, 75], [0, 75]],
            //     [[[15, 15], [15, 15]], [[0, 0], [0, 0]]],
            //     [[0, 90], [0, 180]],
            //     [[-250, 250], [-250, 250]],
            //     [[255, 255, 255], [255, 255, 255]],
            //     [[255, 255, 255], [255, 255, 255]],
            //     true
            // )
        }, 25)
    }
}

//function getCompoundXP was originally here but dipshit coding made me have to put it in DeBread.js


function getStyle(amount) {
    player.style += amount
    //some style stuff may be added soon idk
}

function getCombo() {
    player.combo++
    doge('comboDisplay').innerText = `x${player.combo}`
    doge('comboDisplay').style.animation = 'none'
    requestAnimationFrame(() => {
        doge('comboDisplay').style.animation = 'comboDisplayPulse 250ms ease-out 1 forwards'
    })

    if(player.combo >= 100) {
        increaseChallengeProgress('100combo', 1)
    }

    updateUI()
}

//STYLE BAR STUFF
setInterval(() => {
    if(!paused && doge('shop').style.display === 'none') {
        with(player) {
            if(style > 100) {
                style = 100
            }

            if(style > 1) {
                style -= (1 + (combo / 100)) * comboLoss
            } else {
                style = 0
    
                if(player.combo > 1) {
                    DeBread.easeShake(doge('comboDisplayContainer'), 10, 10, 0.5)
                    player.combo = Math.ceil(player.combo / 2)
                    style = 25
                }
            }

            if(style < 25 && style !== 0) {
                doge('comboDisplayContainer').classList.add('styleDisplayScared')
            } else {
                doge('comboDisplayContainer').classList.remove('styleDisplayScared')
            }
            doge('innerStyleDisplay').style.width = style + '%'
        }
    }
}, 100);

//EXPLOSIONS
function createExplosion(pos, size, damage, ignorePlayer, kys) {
    const explosion = document.createElement('div')
    explosion.classList.add('explosion')
    explosion.style.left = pos[0] - size/2+'px'
    explosion.style.top = pos[1] - size/2+'px'
    let explosionColor = `rgb(255, ${DeBread.randomNum(0, 255)}, 0)`
    explosion.style.backgroundColor = explosionColor
    explosion.style.width = size+'px'
    explosion.style.setProperty('--explosionSize', size / 2 + 'px')

    if(data.settings.squareExplosions) {
        explosion.style.borderRadius = 0
    }

    if(size >= 250 && kys) {
        getAchievement('whoops')
    }

    game.append(explosion)
    if(game.shake[0] + game.shake[1] < 20) {
        game.shake[0] += size / 15
        game.shake[1] += size / 15
    }

    DeBread.playSound(`media/audio/explosion${DeBread.randomNum(0, 2)}.mp3`)

    DeBread.createParticles(
        game,
        5,
        0,
        250,
        'ease-out',
        [[pos[0], pos[0]], [pos[1], pos[1]]],
        [[[size / 10, size / 10], [size / 10, size / 10]], [[0, 0], [0, 0]]],
        [[0, 90], [-90, 180]],
        [[-size * 5, size * 5], [-size * 5, size * 5]],
        [[255, 255, 255], [255, 255, 255]],
        [[255, 255, 255], [255, 255, 255]]
    )

    if(!data.settings.simpleExplosions) {
        const explosionShockwave = document.createElement('div')
        explosionShockwave.classList.add('explosionShockwave')
        if(!data.settings.squareExplosions) {explosionShockwave.style.borderRadius = '50%'}
        explosionShockwave.style.width = size + 'px'
        explosionShockwave.style.left = pos[0] - size / 2 + 'px'
        explosionShockwave.style.top = pos[1] - size / 2 + 'px'
        explosionShockwave.style.opacity = 0.25
    
        explosionShockwave.style.setProperty('--shockwaveScale', `${DeBread.randomNum(490, 510)}%`)
        game.append(explosionShockwave)
    
        const explosionShockwave2 = document.createElement('div')
        explosionShockwave2.classList.add('explosionShockwave')
        if(!data.settings.squareExplosions) {explosionShockwave2.style.borderRadius = '50%'}
        explosionShockwave2.style.width = size + 'px'
        explosionShockwave2.style.left = pos[0] - size / 2 + 'px'
        explosionShockwave2.style.top = pos[1] - size / 2 + 'px'
    
        explosionShockwave2.style.setProperty('--shockwaveScale', `${DeBread.randomNum(175, 225)}%`)
        game.append(explosionShockwave2)

        setTimeout(() => {
            explosionShockwave.remove()
            explosionShockwave2.remove()
        }, 500);
    }

    const explosionFlash = document.createElement('div')
    explosionFlash.classList.add('explosionFlash')
    explosionFlash.style.setProperty('--blurAmount', size + 'px')
    explosionFlash.style.backgroundColor = explosionColor
    explosionFlash.style.width = size + 'px'
    explosionFlash.style.left = pos[0] - size / 2 + 'px'
    explosionFlash.style.top = pos[1] - size / 2 + 'px'
    if(!data.settings.squareExplosions) {explosionFlash.style.borderRadius = '50%'}
    game.append(explosionFlash)

    let enemiesKilled = 0
    game.querySelectorAll('enemy').forEach(enemy => {
        if(isColliding(explosion, enemy) && !enemy.preparing) {
            createPopupText([enemy.pos[0] + enemy.offsetWidth / 2, enemy.pos[1] + enemy.offsetHeight / 2], damage * enemy.damageReduction, 25, 900, 'red')
            enemy.damage(damage)

            if(!enemy.alive) {
                getPoints(25 * ((player.combo) + 1), '+Exploded')
                enemiesKilled++
            }
        }
    })

    // let explosionCenter = [pos[0] + size / 2, pos[1] + size / 2]
    // game.querySelectorAll('.bullet').forEach(bullet => {
    //     if (isColliding(explosion, bullet)) {
    //         bullet.angle = Math.atan2(explosionCenter[1] - bullet.pos[1], explosionCenter[0] - bullet.pos[0])
    //     }
    // })

    if(enemiesKilled >= 3) {
        getAchievement('fireInTheHole')
    }

    if(enemiesKilled >= 5) {
        getAchievement('boutToBlow')
    }
    
    if(!ignorePlayer && isColliding(explosion, playerD)) {
        damagePlayer(damage)
    }

    setTimeout(() => {
        explosion.remove()
        explosionFlash.remove()
    }, 500 * gameSpeed);

    if(kys && player.health <= 0) {
        getAchievement('heyGuysWatchThis')
    }
}

function createPoisonField(pos, size, ticks, damage, ignorePlayer = true) {
    const field = document.createElement('div')
    field.classList.add('poisonField')
    field.classList.add('customField')
    field.style.left = pos[0] - size / 2 + 'px'
    field.style.top = pos[1] - size / 2 + 'px'
    field.style.width = size + 'px'
    field.style.height = size + 'px'
    field.active = true

    if(!ignorePlayer) {
        field.style.backgroundColor = 'rgb(255, 0, 0, 0.1)'
        field.style.outline = '1px solid rgb(255, 0, 0, 0.5)'
    }

    for(let i = 0; i < ticks; i++) {
        setTimeout(() => {
            if(field.active && player.alive) {
                if(ignorePlayer) {
                    DeBread.createParticles(
                        game,
                        5,
                        0,
                        1000,
                        'cubic-bezier(0,1,.5,1)',
                        [[pos[0] - size / 2, pos[0] + size / 2], [pos[1] - size / 2, pos[1] + size / 2]],
                        [[[5, 5], [5, 5]], [[0, 0], [0, 0]]],
                        [[0, 0], [0, 0]],
                        [[-5, 5], [-5, 5]],
                        [[0, 255, 0], [0, 255, 0]],
                        [[0, 255, 0], [0, 255, 0]]
                    )
                } else {
                    DeBread.createParticles(
                        game,
                        5,
                        0,
                        1000,
                        'cubic-bezier(0,1,.5,1)',
                        [[pos[0] - size / 2, pos[0] + size / 2], [pos[1] - size / 2, pos[1] + size / 2]],
                        [[[5, 5], [5, 5]], [[0, 0], [0, 0]]],
                        [[0, 0], [0, 0]],
                        [[-5, 5], [-5, 5]],
                        [[255, 0, 0], [255, 0, 0]],
                        [[255, 0, 0], [255, 0, 0]]
                    )
                }
    
                game.querySelectorAll('enemy').forEach((enemy) => {
                    if(isColliding(enemy, field)) {
                        enemy.damage(damage)
                        DeBread.playSound(`media/audio/poisonTick${DeBread.randomNum(0, 2)}.mp3`, 0.25)
                        createPopupText([enemy.pos[0] + enemy.size / 2, enemy.pos[1] + enemy.size / 2], damage * enemy.damageReduction, 20, 600, 'red')
                    }
                })
                if(!ignorePlayer && isColliding(playerD, field)) {
                    damagePlayer(damage, true)
                    DeBread.playSound(`media/audio/poisonTick${DeBread.randomNum(0, 2)}.mp3`, 0.25)
                }
            }
        }, i * 500);
    }

    setTimeout(() => {
        if(field) {field.remove()}
    }, ticks * 500);

    game.append(field)
}

function createMagnet(from, to) {
    const magnet = document.createElement('freeElement')
    magnet.classList.add('magnet')

    magnet.angle = Math.atan2(from[1] - to[1], from[0] - to[0])
    magnet.damageMultiplier = 1.5
    magnet.chained = 1
    // magnet.style.rotate = magnet.angle + 'rad'
    
    magnet.pos = [from[0], from[1]]
    magnet.style.left = magnet.pos[0] - 10 + 'px'
    magnet.style.top = magnet.pos[1] - 10 + 'px'

    for(let i = 0; i < 25; i++) {
        setTimeout(() => {
            if(!from[0] === to[0] && !from[1] === to[1]) {
                magnet.pos[0] -= (Math.cos(magnet.angle) * (10 - (i / 5)))
                magnet.pos[1] -= (Math.sin(magnet.angle) * (10 - (i / 5)))

                magnet.style.left = magnet.pos[0] - 10 + 'px'
                magnet.style.top = magnet.pos[1] - 10 + 'px'
            }

            if(i === 24) {
                game.shake[0] = 5
                game.shake[1] = 5
                DeBread.playSound('media/audio/magnetPlace.mp3', 0.5)

                magnet.hitbox = document.createElement('freeElement')
                magnet.hitbox.classList.add('magnetHitbox')
                magnet.hitbox.style.left = magnet.pos[0] - 75 + 'px'
                magnet.hitbox.style.top = magnet.pos[1] - 75 + 'px'

                game.append(magnet.hitbox)
            }
        }, i * 10);
    }

    game.append(magnet)

    magnet.activate = () => {
        game.querySelectorAll('enemy').forEach(enemy => {
            if(isColliding(enemy, magnet.hitbox)) {
                enemy.damage(player.gun.damage * magnet.damageMultiplier)
                getPoints(magnet.damageMultiplier * ((player.combo * 10) + 1), '+Shocked')
                DeBread.createParticles(
                    game,
                    10,
                    0,
                    750,
                    'cubic-bezier(0,1,.5,1)',
                    [[enemy.pos[0], enemy.pos[0] + enemy.size], [enemy.pos[1], enemy.pos[1] + enemy.size]],
                    [[[15, 15], [15, 15]], [[0, 0], [0, 0]]],
                    [[0, 0], [0, 0]],
                    [[-enemy.size * 1.5, enemy.size * 1.5], [-enemy.size * 1.5, enemy.size * 1.5]],
                    [[255, 255, 0], [255, 255, 0]],
                    [[255, 255, 0], [255, 255, 0]],
                    true
                )
                createPopupText([enemy.pos[0] + enemy.size / 2, enemy.pos[1] + enemy.size / 2], (player.gun.damage * magnet.damageMultiplier * enemy.damageReduction), 15 * (((player.gun.damage * magnet.damageMultiplier * enemy.damageReduction) / 10) + 1), ((player.gun.damage * magnet.damageMultiplier * enemy.damageReduction) * 10) + 500, 'yellow')
            }
        })

        game.querySelectorAll('.magnet').forEach(otherMagnet => {
            if(isColliding(magnet.hitbox, otherMagnet.hitbox) && magnet !== otherMagnet) {
                DeBread.playSound('media/audio/magnetBreak.mp3', 0.25)
                otherMagnet.damageMultiplier = magnet.damageMultiplier *= 1.1
                otherMagnet.chained += magnet.chained
                setTimeout(() => {
                    otherMagnet.activate()
                }, 100);
            }
        })

        DeBread.createParticles(
            game,
            5,
            0,
            250,
            'ease-out',
            [[magnet.pos[0], magnet.pos[0]], [magnet.pos[1], magnet.pos[1]]],
            [[[10, 10], [10, 10]], [[0, 0], [0, 0]]],
            [[0, 0], [0, 0]],
            [[-50, 50], [-50, 50]],
            [[100, 100, 100], [100, 100, 100]],
            [[100, 100, 100], [100, 100, 100]],
            true
        )
        magnet.hitbox.remove()
        magnet.remove()
        DeBread.playSound('media/audio/magnetBreak.mp3', 0.25)
    }
}

//ENEMIES
const enemyTypes = [
    guy0 = { //Red Guy
        credits: 1,

        size: 50,
        speed: 2.5,
        damage: 10,
        health: 25,
        color: 'rgb(255, 100, 100)',
        description: 'Just the average enemy, nothing special.'
    },
    guy1 = { //yellou
        credits: 3,

        size: 50,
        speed: 1,
        damage: 25,
        health: 50,
        color: 'rgb(255, 255, 100)',

        gun: {
            damage: 25,
            cooldown: 1000,
            speed: 10,
            bulletSize: 10,
        },
        
        description: 'Shoots fast bullets dealing 25 damage.'
    },
    guy2 = {
        credits: 4,

        size: 50,
        speed: 0.5,
        damage: 30,
        health: 50,
        color: 'rgb(255, 100, 255)',

        gun: {
            damage: 15,
            cooldown: 250,
            speed: 5,
            bulletSize: 10,
        },

        description: 'Shoots very frequently but does little damage.'
    },
    guy3 = { //Green guy
        credits: 8,

        size: 50,
        speed: 0,
        damage: 10,
        health: 50,
        color: 'rgb(100, 255, 100)',

        poisonField: {
            size: 300,
            damage: 25
        },


        description: 'Has a defensive poison field around them, doing 20 damage a second when you\'re in range.'
    },
    guy4 = { //Big grey guy
        credits: 10,

        size: 75,
        speed: 0.25,
        damage: 25,
        health: 200,
        color: 'rgb(100, 100, 100)',

        gun: {
            damage: 50,
            cooldown: 2000,
            speed: 2,
            bulletSize: 20,
        },

        description: 'Very slow-moving but has high health and high damage.'
    },
    guy5 = { //Brown Guy
        credits: 15,

        size: 50,
        speed: 0.5,
        damage: 20,
        health: 125,
        color: 'rgb(102, 73, 48)',

        gun: {
            damage: 15,
            cooldown: 1000,
            speed: 6,
            bulletSize: 10,
            explosionSize: 150
        },

        description: 'Shoots explosive rounds.'
    },
    guy6 = { //Virtue ultrakill
        credits: 15,

        size: 50,
        speed: 0,
        damage: 75,
        health: 150,
        color: 'rgb(100, 255, 255)',

        beam: {
            damage: 50,
            size: 100,
            wait: 5000,
            interval: 10000,
        },

        description: 'Summons a beam every few seconds that eventually explodes dealing 75 damage.'
    },
    guy7 = { //fast Virtue ultrakill
        credits: 20,

        size: 50,
        speed: 0,
        damage: 25,
        health: 125,
        color: 'rgb(100, 150, 255)',

        beam: {
            damage: 20,
            size: 60,
            wait: 1000,
            interval: 2500,
        },

        description: 'Summons frequent beams that explode dealing 25 damage.'
    },
    guy8 = { //The big one
        credits: 50,
        big: true,

        size: 100,
        speed: 0.1,
        damage: 50,
        health: 750,
        color: 'rgb(100, 0, 50)',

        gun: {
            damage: 30,
            cooldown: 2500,
            speed: 5,
            bulletSize: 15,
            explosionSize: 100
        },

        beam: {
            damage: 25,
            size: 150,
            wait: 3000,
            interval: 10000,
        },

        description: 'Extremely slow-moving enemy that summons beams, does high damage, and has extreme health.'
    },
    guy9 = { //minecraft baby zombie
        credits: 15,

        size: 40,
        speed: 5,
        damage: 10,
        health: 75,
        color: 'rgb(25, 50, 150)',
        description: 'A small, fast moving enemy that does little damage.'
    },
    guy10 = { //The bigger one
        credits: 125,
        big: true,

        size: 125,
        speed: 0,
        damage: 50,
        health: 1000,
        color: 'rgb(50, 25, 75)',

        gun: {
            damage: 30,
            cooldown: 500,
            speed: 2,
            bulletSize: 30,
            explosionSize: 250
        },

        description: 'A stationary enemy with extreme health and damage.'
    },
    guy11 = { //Poison field shooter guy
        credits: 30,

        size: 75,
        speed: 0.5,
        damage: 25,
        health: 200,
        color: 'rgb(100, 50, 55)',

        gun: {
            damage: 15,
            cooldown: 1000,
            speed: 4,
            bulletSize: 10,

            poisonFieldTicks: 15,
        },

        description: 'An average enemy that shoots bullets spawning poison fields.'
    },
    guy12 = { //Green guy
        credits: 50,

        size: 50,
        speed: 0,
        damage: 10,
        health: 75,
        color: 'rgb(100, 255, 150)',

        poisonField: {
            size: 400,
            damage: 10
        },

        gun: {
            damage: 10,
            cooldown: 1000,
            speed: 5,
            bulletSize: 10,

            poisonFieldTicks: 10,
        },

        description: 'Has a defensive poison field around them, and shoots bullets spawning poison fields.'
    },
    guy13 = {
        credits: 10,
        size: 40,

        speed: 8,
        health: 1,
        damage: 0,
        color: 'rgb(255, 10, 10)',

        explosive: {
            damage: 50,
            size: 100,
        },
         

        description: 'Very quick and will explode when hit with a bullet or hits the player.'
    },
    guy14 = {
        credits: 20,
        size: 75,

        speed: 0.5,
        health: 200,
        color: 'rgb(74, 60, 45)',

        explosive: {
            damage: 20,
            size: 150,
        },

        damage: 25,

        grenade: {
            distance: 25,
            damage: 25,
            size: 150,
            interval: 1500,
            lifespan: 1000,
        },

        description: 'A slow moving enemy that shoots grenades.'
    },
    guy15 = {
        credits: 100,
        big: true,
        size: 150,

        speed: 1,
        health: 5000,
        color: 'rgb(110, 61, 108)',

        damage: 25,

        gun: {
            damage: 40,
            cooldown: 1000,
            speed: 5,
            bulletSize: 20,

            poisonFieldTicks: 15,
        },

        grenade: {
            distance: 30,
            damage: 30,
            size: 150,
            interval: 1500,
            lifespan: 1000,
        },

        description: 'A large, slow moving enemy that shoots grenades and bullets spawning poison fields.'
    },
    guy16 = {
        credits: 15,
        size: 25,

        speed: 0,
        health: 25,
        color: 'rgb(184, 237, 255)',

        damage: 0,

        blockPlayerHeal: true,

        description: 'A small enemy that doesnt move nor do damage, but prevents the player from healing.'
    },
    guy17 = {
        credits: 15,
        size: 25,

        speed: 0,
        health: 25,
        color: 'rgb(161, 47, 100)',

        damage: 0,

        dealPassiveDamage: true,

        description: 'A small, stationary enemy that does passive damage to the player over time.'
    }
]

//EXTRA ENEMIES
const extraEnemies = {
    dummy: {
        credits: 1,
        size: 50,
        speed: 0,
        damage: 0,
        health: Infinity,
        color: 'rgb(255, 235, 171)',
        showDamage: true,

        description: 'Dummy. Use the kill button to kill it.'
    },
    largeDummy: {
        credits: 1,
        size: 100,
        speed: 0,
        damage: 0,
        health: Infinity,
        color: 'rgb(255, 215, 151)',
        showDamage: true,
        big: true,

        description: 'Large dummy. Use the kill button to kill it.'
    },
    nerfSentry: {
        credits: 1,
        size: 50,
        speed: 0,
        damage: 0,
        health: Infinity,
        color: 'rgb(100, 215, 151)',
        showDamage: true,

        gun: {
            damage: 0,
            cooldown: 1000,
            speed: 5,
            bulletSize: 10,
        },

        description: 'Like a normal dummy, but shoots harmless bulets. Use the kill button to kill it.'
    },
    movingDummy: {
        credits: 1,
        size: 50,
        speed: 2,
        damage: 0,
        health: 10,
        color: 'rgb(100, 100, 100)',
        showDamage: false,

        description: 'ill make a description for this later maybe idk'
    },
    explosive: {
        credits: 1,
        size: 50,
        speed: 0,
        damage: 0,
        health: 5,
        color: 'rgb(255, 0, 0)',
        explosive: {
            damage: 5,
            size: 175,
        },

        description: 'An explosive.'
    },
    debreadCube: {
        name: 'DEBREAD CUBE',
        credits: 999,
        size: 100,
        speed: 3,
        damage: 75,
        health: 10000,
        texture: 'debreadcube.gif',
        color: 'rgb(255, 148, 41)',
        big: true,

        grenade: {
            distance: 30,
            damage: 25,
            size: 200,
            interval: 500,
            lifespan: 750,
        },

        gun: {
            damage: 50,
            cooldown: 100,
            speed: 5,
            bulletSize: 10,
            explosionSize: 250,
            poisonFieldTicks: 5,
        },
        
        beam: {
            damage: 25,
            size: 250,
            wait: 500,
            interval: 2000,
        },

        description: 'dont'
    },
}

//SPAWNING ENEMIES
function spawnEnemy(type, pos) {
    const enemy = document.createElement('enemy')
    enemy.alive = true
    enemy.preparing = true
    enemy.style.width = type.size+'px'
    enemy.style.backgroundColor = type.color
    enemy.classList.add('enemyPrepare')
    enemy.style.outline = `1px solid ${type.color}`

    enemy.health = type.health
    enemy.size = type.size
    enemy.pos = [pos[0], pos[1]]
    enemy.speed = type.speed
    enemy.color = type.color
    enemy.onFire = false
    enemy.showDamage = type.showDamage
    enemy.lastHitPlayer = 0
    enemy.isRadiant = 0
    enemy.damageReduction = 1
    enemy.damageMultiplier = 1

    enemy.blockPlayerHeal = type.blockPlayerHeal
    enemy.dealPassiveDamage = type.dealPassiveDamage

    enemy.style.setProperty('--fireOpacity', '0')

    if(type.gun) {
        enemy.hasGun = true
        enemy.bulletSize = type.gun.bulletSize
    }

    if(type.texture) {
        if(type.texture.startsWith('https://')) {
            enemy.style.backgroundImage = `url(${type.texture})`
        } else {
            enemy.style.backgroundImage = `url(media/enemies/${type.texture})`
        }
        enemy.color = 'rgb(0, 0, 0, 0)'
        enemy.style.backgroundColor = 'transparent'
    }
    
    const poisonField = document.createElement('div')
    if(type.poisonField) {
        poisonField.classList.add('poisonField')
        poisonField.style.width = type.poisonField.size + 'px'
        poisonField.style.left = pos[0] - (type.poisonField.size / 2) + type.size / 2 + 'px'
        poisonField.style.top = pos[1] - (type.poisonField.size / 2) + type.size / 2 + 'px'
        poisonField.style.backgroundColor = type.color.replace(')', ', 0.1)')
        poisonField.style.outline = `1px solid ${type.color.replace(')', ', 0.5)')}`

        game.append(poisonField)

        setTimeout(() => {
            enemy.poisonFieldInterval = setInterval(() => {
                if(!paused) {
                    DeBread.createParticles(
                        game,
                        10,
                        100,
                        1000,
                        'linear',
                        [[pos[0] - (type.poisonField.size / 2) + type.size / 2, pos[0] - (type.poisonField.size / 2) + type.size / 2 + type.poisonField.size], [pos[1] - (type.poisonField.size / 2) + type.size / 2, pos[1] - (type.poisonField.size / 2) + type.size / 2 + type.poisonField.size]],
                        [[[5, 5], [5, 5]], [[0, 0], [0, 0]]],
                        [[0, 0], [0, 0]],
                        [[-25, 25], [-25, 25]],
                        [[0, 255, 0], [0, 255, 100]],
                        [[0, 255, 0], [0, 255, 100]]
                    )
                    if(isColliding(playerD, poisonField) && gameActive) {
                        damagePlayer(type.poisonField.damage * enemy.damageMultiplier * enemyInfo.damageMultiplier, true)
                        DeBread.playSound(`media/audio/poisonTick${DeBread.randomNum(0, 2)}.mp3`, 0.25)
                    }
                }
            }, 500 * gameSpeed);
        }, enemyInfo.prepareTime * gameSpeed);
    }

    function updatePos() {
        enemy.style.left = enemy.pos[0]+'px'
        enemy.style.top = enemy.pos[1]+'px'
    } updatePos()

    game.appendChild(enemy)

    const healthBar = document.createElement('div')
    const innerHealthBar = document.createElement('div')
    const healthBarInfo = document.createElement('div')
    if(!type.big) {
        healthBar.classList.add('enemyHealthBar')
        healthBar.style.width = type.size + 'px'
        healthBar.style.opacity = 0    
        innerHealthBar.classList.add('enemyInnerHealthBar')
        game.append(healthBar)
    } else {
        healthBar.classList.add('bigHealthBar')
        innerHealthBar.classList.add('innerBigHealthBar')
        innerHealthBar.style.backgroundColor = type.color

        healthBarInfo.classList.add('bigHealthBarText')
        if(!type.name) {
            healthBarInfo.innerText = type.health
        } else {
            healthBarInfo.innerText = type.name
        }
        healthBar.append(healthBarInfo)

        doge('bigHealthBarContainer').append(healthBar)
    }
    healthBar.append(innerHealthBar)

    setTimeout(() => {
        enemy.classList.remove('enemyPrepare')
        enemy.classList.add('enemySpawn')

        setTimeout(() => {
            enemy.classList.remove('enemySpawn')
            // enemy.style.animation = 'none'
        }, 500 * gameSpeed);
        enemy.style.outline = 'none'
        enemy.preparing = false
        getPoints(type.credits * player.combo, '+Enemy Spawned')
        getStyle(5)
        enemy.interval = setInterval(() => {
            if(!paused && player.alive) {
                const dx = player.pos[0] - enemy.pos[0]
                const dy = player.pos[1] - enemy.pos[1]
                if(!isColliding(playerD, enemy)) {
                    enemy.pos[0] += (enemy.speed * enemyInfo.speedMultiplier) * Math.cos(Math.atan2(dy, dx))
                    enemy.pos[1] += (enemy.speed * enemyInfo.speedMultiplier) * Math.sin(Math.atan2(dy, dx))
                }

                if(enemy.pos[0] > game.offsetWidth - type.size) {
                    enemy.pos[0] = game.offsetWidth - type.size
                }
                if(enemy.pos[0] < 0) {
                    enemy.pos[0] = 0
                }
                if(enemy.pos[1] > game.offsetHeight - type.size) {
                    enemy.pos[1] = game.offsetHeight - type.size
                }
                if(enemy.pos[1] < 0) {
                    enemy.pos[1] = 0
                }

        
                if(!type.big) {
                    healthBar.style.left = enemy.pos[0] + 'px'
                    healthBar.style.top = enemy.pos[1] - 25 + 'px'
                }

                if(isColliding(playerD, enemy) && gameActive && performance.now() - enemy.lastHitPlayer >= 500) {
                    if(!player.immune) {
                        damagePlayer(type.damage * enemy.damageMultiplier * enemyInfo.damageMultiplier)
                    }
                    if(type.explosive) {
                        enemy.kill()
                    }

                    enemy.lastHitPlayer = performance.now()
                }

                if(enemy.onFire) {
                    innerHealthBar.style.transition = 'none'
                    enemy.damage(player.gun.fireDamage, true)
                    // DeBread.createParticles(
                    //     game,
                    //     1,
                    //     0,
                    //     250,
                    //     'ease-out',
                    //     [[enemy.pos[0] + type.size / 2, enemy.pos[0] + type.size / 2], [enemy.pos[1] + type.size / 2, enemy.pos[1] + type.size / 2]],
                    //     [[[type.size, type.size], [type.size, type.size]], [[type.size, type.size], [type.size, type.size]]],
                    //     [[0, 0], [-10, 10]],
                    //     [[-5, 5], [-50, 5]],
                    //     [[255, 100, 0], [255, 255, 0]],
                    //     [[255, 100, 0], [255, 255, 0]],
                    //     true
                    // )
                    if(!type.showDamage) {
                        enemy.style.setProperty('--fireOpacity', '0.75')
                    }

                    game.querySelectorAll('enemy').forEach(otherEnemy => {
                        if(isColliding(enemy, otherEnemy)) {
                            otherEnemy.onFire = true
                        }
                    })
                }
        
                updatePos()
            }    
        }, 10 * gameSpeed);

        if(type.dealPassiveDamage) {
            enemy.passiveDamageInterval = setInterval(() => {
                damagePlayer(1 * enemyInfo.damageMultiplier, false)
            }, 250)
        }
    }, enemyInfo.prepareTime * gameSpeed);

    if(type.gun) {
        setTimeout(() => {
            enemy.gunInterval = setInterval(() => {
                if(!paused && player.alive) {
                    const bullet = document.createElement('div')
                    bullet.classList.add('enemyBullet')
                    bullet.classList.add('bullet')
                    bullet.style.background = 'none'
                    bullet.style.backgroundColor = 'rgb(255, 50, 50)'
                    bullet.style.borderRadius = '50%'
                    bullet.style.boxShadow = '0px 0px 25px rgb(255, 50, 50)'
                    bullet.style.outline = '2px solid black'
                    bullet.style.width = type.gun.bulletSize+'px'
                    bullet.style.animation = 'bulletIn 250ms ease-out 1 forwards'
                    
                    bullet.speed = type.gun.speed
                    bullet.size = type.gun.bulletSize
                    bullet.explosionSize = type.gun.explosionSize
                    bullet.poisonFieldTicks = type.gun.poisonFieldTicks
                    bullet.damage = type.gun.damage * enemy.damageMultiplier
                    bullet.angle = Math.atan2(player.realPos[1] - (enemy.pos[1] + type.size / 2), player.realPos[0] - (enemy.pos[0] + type.size / 2))
                    bullet.hurtSelf = false

                    bullet.pos = [enemy.pos[0] + type.size / 2 - type.gun.bulletSize / 2, enemy.pos[1] + type.size / 2 - type.gun.bulletSize / 2]

                    game.append(bullet)
                    DeBread.playSound(`media/audio/enemyShoot${DeBread.randomNum(0, 2)}.mp3`)
                    setTimeout(() => {
                        bullet.style.opacity = 1
                    }, 10);
                    enemy.bulletsShot++
                }
            }, (type.gun.cooldown / enemyInfo.speedMultiplier) * gameSpeed);
        }, enemyInfo.prepareTime * gameSpeed);
    }

    //GRENADE
    if(type.grenade) {
        setTimeout(() => {
            enemy.grenadeInterval = setInterval(() => {
                if(!paused && player.alive) {
                    const grenade = document.createElement('freeElement')
                    grenade.classList.add('grenade')
                    grenade.pos = [enemy.pos[0] + type.size / 2, enemy.pos[1] + type.size / 2]
                    grenade.style.left = grenade.pos[0] + 'px'
                    grenade.style.top = grenade.pos[1] + 'px'
                    grenade.style.setProperty('--explosionSize', `${type.grenade.size}px`)
                    grenade.angle = Math.atan2(player.realPos[1] - (enemy.pos[1] + type.size / 2), player.realPos[0] - (enemy.pos[0] + type.size / 2))
                    grenade.active = true
        
                    game.append(grenade)
        
                    setTimeout(() => {                
                        grenade.pos[0] += type.grenade.distance * 10 * Math.cos(grenade.angle)
                        grenade.pos[1] += type.grenade.distance * 10 * Math.sin(grenade.angle)
            
                        grenade.style.left = grenade.pos[0] + 'px'
                        grenade.style.top = grenade.pos[1] + 'px'
                    }, 25 * gameSpeed);
        
                    grenade.parry = () => {
                        grenade.angle = Math.atan2(cursor.pos[1] - (grenade.pos[1]), cursor.pos[0] - (grenade.pos[0]))
                        grenade.style.transition = 'none'
                        
                        requestAnimationFrame(() => {
                            setInterval(() => {                        
                                grenade.pos[0] += 20 * Math.cos(grenade.angle)
                                grenade.pos[1] += 20 * Math.sin(grenade.angle)
                    
                                grenade.style.left = grenade.pos[0] + 'px'
                                grenade.style.top = grenade.pos[1] + 'px'
        
                                game.querySelectorAll('enemy').forEach(enemy => {
                                    if(isColliding(grenade, enemy)) {
                                        grenade.delete(1.5)
                                    }
                                })
        
                                if(
                                    grenade.pos[0] < 0 || grenade.pos[0] > game.offsetWidth ||
                                    grenade.pos[1] < 0 || grenade.pos[1] > game.offsetHeight
                                ) {
                                    grenade.delete(2)
                                }
                            }, grenade.movementInterval * gameSpeed);
                        })
                    }
        
                    let interval = (200 / enemyInfo.speedMultiplier) * gameSpeed
        
                    function grenadeBeep() {
                        if(!paused && grenade.active) {
                            if (grenade.style.backgroundColor === 'orange') {
                                grenade.style.backgroundColor = 'red'
                                grenade.style.boxShadow = '0px 0px 25px red'
                            } else {
                                grenade.style.backgroundColor = 'orange'
                                grenade.style.boxShadow = '0px 0px 25px orange'
                            }
                        
                            DeBread.playSound('media/audio/grenadeBeep.mp3', 0.025)
                            if(interval > 25) {
                                interval /= 1.25
                            }
                        
                            callGrenadeBeep(interval)
                        }
                    }
                    
                    function callGrenadeBeep(timeout) {
                        setTimeout(grenadeBeep, timeout)
                    }
                    
                    callGrenadeBeep(interval)
        
                    grenade.delete = (dmgMultiplier = 1) => {
                        if(grenade.active) {
                            createExplosion([grenade.pos[0] + 5, grenade.pos[1] + 5], type.grenade.size, type.grenade.damage * dmgMultiplier * enemy.damageMultiplier * enemyInfo.damageMultiplier, false)
                            grenade.remove()
                            grenade.active = false
                        }
                    }
        
                    setTimeout(grenade.delete, (type.grenade.lifespan / enemyInfo.speedMultiplier) * gameSpeed);
                }
            }, type.grenade.interval / enemyInfo.speedMultiplier)
        }, enemyInfo.prepareTime * gameSpeed);
    }

    //BEAM
    if(type.beam) {
        enemy.beamInterval = setInterval(() => {
            if(player.alive) {
                enemy.beam = document.createElement('div')
                enemy.beam.classList.add('beam')
                enemy.beam.style.left = player.realPos[0] - (type.beam.size / 2) + 'px'
                enemy.beam.style.top = player.realPos[1] - (type.beam.size / 2) + 'px'
                enemy.beam.style.width = type.beam.size + 'px'
                enemy.beam.style.setProperty('--beamDuration', type.beam.wait / enemyInfo.speedMultiplier +'ms')
                enemy.beam.style.outline = `3px solid ${type.color}`
    
                game.append(enemy.beam)
    
                let beamMoveInterval = setInterval(() => {
                    enemy.beam.style.left = player.realPos[0] - (type.beam.size / 2) + 'px'
                    enemy.beam.style.top = player.realPos[1] - (type.beam.size / 2) + 'px'
                }, 10 * gameSpeed);
    
                setTimeout(() => {
                    if(enemy.alive) {
                        clearInterval(beamMoveInterval)
                        let explosionPos = [player.realPos[0],player.realPos[1]]
                        setTimeout(() => {
                            if(enemy.alive) {
                                createExplosion(explosionPos, type.beam.size, type.beam.damage * enemy.damageMultiplier * enemyInfo.damageMultiplier)
                                enemy.beam.remove()
                            }
                        }, 1000 * gameSpeed);
                    }
                }, (type.beam.wait / enemyInfo.speedMultiplier) * gameSpeed);
            }
        }, (type.beam.interval / enemyInfo.speedMultiplier) * gameSpeed);
    }

    enemy.poisonTicks = 0
    enemy.poisonDamage = 0
    enemy.poisonDamageInterval = setInterval(() => {
        if(DeBread.round(enemy.poisonDamage) > 0) {
            enemy.damage(enemy.poisonDamage)
            createPopupText([enemy.pos[0] + enemy.size / 2, enemy.pos[1] + enemy.size / 2], enemy.poisonDamage * enemy.damageReduction, 20, 700, 'lime')
            for(let i = 0; i < enemy.poisonTicks; i++) {
                getPoints(((enemy.poisonDamage / 10) + 1) * ((player.combo / 10) + 1), '+Poisoned')
            }
            DeBread.playSound(`media/audio/poisonTick${DeBread.randomNum(0, 2)}.mp3`, 0.1)
        }
    }, 500 * gameSpeed);

    enemy.damageDelt = 0
    let displayedHealth = type.health
    enemy.damage = (amount, silent = false) => {
        const damage = amount * enemy.damageReduction
        if(!enemy.preparing) {
            enemy.health -= damage
    
            if(type.showDamage) {
                enemy.style.fontSize = type.size / 3 + 'px'
                enemy.damageDelt += damage
                enemy.innerHTML = `<span>${DeBread.round(enemy.damageDelt)}</span>`
            }
    
            if(!type.big) {
                healthBar.style.opacity = 0.5
            } else {
                if(!type.name) {
                    for(let i = 0; i < 5; i++) {
                        setTimeout(() => {                        
                            displayedHealth -= damage / 5
                            healthBarInfo.innerText = DeBread.round(displayedHealth)
                        }, i * 50);
                    }
                }
            }
            
            innerHealthBar.style.width = (enemy.health / type.health) * 100 + '%'
            if(!silent) {
                DeBread.playSound(`media/audio/EnemyHit${DeBread.randomNum(0, 2)}.mp3`)
                enemy.style.filter = 'brightness(200%)'
                setTimeout(() => {
                    enemy.style.filter = 'none'
                }, 50 * gameSpeed)

                innerHealthBar.style.animation = 'none'
                setTimeout(() => {
                    innerHealthBar.style.animation = 'healthBarFlash 250ms ease-out 1 forwards'
                }, 10 * gameSpeed);
            }
            if(enemy.health <= 0) {
                enemy.kill()
            }
        }
    }
    enemy.kill = (real = true) => {
        if(enemy.alive && !enemy.preparing) {
            //BLOOD STAIN

            if(game.querySelectorAll('.bloodStain').length < data.settings.max_blood_stains) {
                const blood = document.createElement('img')
                blood.classList.add('bloodStain')
                blood.style.left = enemy.pos[0] - ((type.size * 1.5) / 2) + type.size / 2 + 'px'
                blood.style.top = enemy.pos[1] - ((type.size * 1.5) / 2) + type.size / 2 + 'px'
                blood.style.width = type.size * 1.5 + 'px'
                blood.style.rotate = DeBread.randomNum(0, 360) + 'deg'
                if(type.size > 50) {
                    blood.src = `media/blood/bigBlood${DeBread.randomNum(0, 0)}.png`
                } else {
                    blood.src = `media/blood/blood${DeBread.randomNum(0, 1)}.png`
                }
                game.append(blood)
    
                setTimeout(() => {
                    blood.remove()
                }, 60000);
            }

            enemy.alive = false

            enemy.remove()
            healthBar.remove()
            clearInterval(enemy.interval)
            clearInterval(enemy.poisonDamageInterval)
            if(enemy.poisonFieldInterval) {
                clearInterval(enemy.poisonFieldInterval)
                poisonField.remove()
            }
            if(enemy.grenadeInterval) {
                clearInterval(enemy.grenadeInterval)
            }
            if(type.dealPassiveDamage) {
                clearInterval(enemy.passiveDamageInterval)
            }
            
    
            DeBread.createParticles(
                game,
                25,
                0,
                1000,
                'cubic-bezier(0,1,.5,1)',
                [[enemy.pos[0] + enemy.size / 2, enemy.pos[0] + enemy.size / 2], [enemy.pos[1] + enemy.size / 2, enemy.pos[1] + enemy.size / 2]],
                [[[30, 30], [30, 30]], [[0, 0], [0, 0]]],
                [[0, 0], [-90, 90]],
                [[-100, 100], [-100, 100]],
                [[255, 0, 0], [255, 0, 0]],
                [[255, 0, 0], [255, 0, 0]]
            )
            if(enemy.gunInterval) {clearInterval(enemy.gunInterval)}
            if(enemy.beamInterval) {
                clearInterval(enemy.beamInterval)
                if(enemy.beam) {enemy.beam.remove()}
            }

            if(type.explosive) {
                setTimeout(() => {
                    createExplosion([enemy.pos[0] + type.size / 2, enemy.pos[1] + type.size / 2], type.explosive.size, type.explosive.damage * enemy.damageMultiplier * enemyInfo.damageMultiplier, false)
                }, 10 * gameSpeed);
            }
            if(gameActive && document.querySelectorAll('enemy').length === 0 && !data.settings.sandbox) {
                setTimeout(() => {
                    if(player.alive) {
                        if(currentWaveSize & 1) {
                            openShop(data.settings.shop_choices)
                        } else {
                            currentWaveSize++
                            spawnWave(currentWaveSize)
                        }
                    }
                }, 1000 * gameSpeed);
            }

            data.stats.enemiesKilled++
            increaseChallengeProgress('killed', 1)
            if(real) {
                //SCORE STUFF
                if(enemy.isRadiant) {
                    for(let i = 0; i < enemy.isRadiant; i++) {
                        getPoints((type.credits * 25) * ((player.combo / 10) + 1), '+Radiant kill')
                    }
                } else {
                    getPoints((type.credits * 10) * ((player.combo / 10) + 1), '+Kill')
                }
    
                getCombo()
                getStyle(10 + (type.credits / 15))
    
                if(player.combo % 25 === 0 || player.combo === 10) {
                    getPoints((player.combo * 100) * ((player.combo / 5) + 1),`+${player.combo} combo`)
                }
    
                if(enemy.onFire) {
                    getPoints(25 * ((player.combo / 10) + 1), '+Burnt')
                }
    
                //ACHIEVEMENT STUFF
    
                getAchievement('firstBlood')
    
                if(data.stats.enemiesKilled >= 10) {
                    getAchievement('murderer')
                }
                if(data.stats.enemiesKilled >= 100) {
                    getAchievement('bloodThirsty')
                }
                if(data.stats.enemiesKilled >= 1000) {
                    getAchievement('serialKiller')
                }
                if(data.stats.enemiesKilled >= 10000) {
                    getAchievement('anarchist')
                }
            }
            
            if(player.combo >= 100) {
                getAchievement('murderSpree')
            }
        }
    }

    let colorsPassed = [false, false, false, false]
    document.querySelectorAll('enemy').forEach(enemy => {
        if(enemy.color === 'rgb(255, 100, 100)') colorsPassed[0] = true
        if(enemy.color === 'rgb(255, 255, 100)') colorsPassed[1] = true
        if(enemy.color === 'rgb(255, 100, 255)') colorsPassed[2] = true
        if(enemy.color === 'rgb(100, 255, 100)') colorsPassed[3] = true
    })

    if(colorsPassed[0] && colorsPassed[1] && colorsPassed[2] && colorsPassed[3]) {
        getAchievement('theSmilingFriends')
    }

    enemy.onclick = (ev) => {
        if(radiateTool) {
            enemy.classList.add('radiantEnemy')
            enemy.isRadiant++
            if(enemy.speed <= 6) {
                enemy.speed *= 1.1
            }
            enemy.damageReduction *= 0.75
            enemy.damageMultiplier *= 1.1


            const thing = document.createElement('freeElement')
            thing.classList.add('radiantThing')
            thing.style.width = enemy.size + 'px'
            thing.style.left = enemy.pos[0] + 'px'
            thing.style.top = enemy.pos[1] + 'px'
            game.append(thing)

            setTimeout(() => {
                thing.remove()
            }, 1000);
            
            if(!ev.shiftKey) {
                radiateTool = false
            }
        }
    }
}

//WAVES
function spawnWave(credits) {
    getStyle(25)
    let currentCredits = credits + 10
    while(currentCredits > 0) {
        const spawnDelay = DeBread.randomNum(500, 1500)
        const randomEnemyValue = DeBread.randomNum(0, enemyTypes.length - 1)

        if(credits >= 50 && DeBread.randomNum(0, 4) === 1) {
            setTimeout(() => {
                if(game.querySelectorAll('enemy').length > 0) {
                    const enemies = game.querySelectorAll('enemy')
                    const randomEnemy = enemies[DeBread.randomNum(0, enemies.length - 1)]
        
                    randomEnemy.classList.add('radiantEnemy')
                    randomEnemy.isRadiant++
                    if(randomEnemy.speed <= 6) {
                        randomEnemy.speed *= 1.1
                    }
                    randomEnemy.damageReduction *= 0.75
                    randomEnemy.damageMultiplier *= 1.1


                    const thing = document.createElement('freeElement')
                    thing.classList.add('radiantThing')
                    thing.style.width = randomEnemy.size + 'px'
                    thing.style.left = randomEnemy.pos[0] + 'px'
                    thing.style.top = randomEnemy.pos[1] + 'px'
                    game.append(thing)

                    setTimeout(() => {
                        thing.remove()
                    }, 1000);
                }
            }, spawnDelay * gameSpeed)
            currentCredits--
        } else if(currentCredits - enemyTypes[randomEnemyValue].credits >= 0) {
            currentCredits -= enemyTypes[randomEnemyValue].credits
            setTimeout(() => {
                spawnEnemy(enemyTypes[randomEnemyValue], [DeBread.randomNum(0, game.offsetWidth - enemyTypes[randomEnemyValue].size), DeBread.randomNum(0, game.offsetHeight - enemyTypes[randomEnemyValue].size)])
            }, spawnDelay * gameSpeed);
        }
    }

    if(!data.settings.sandbox) {
        doge('areaText').innerText = credits
        document.title = `Goober Shooter - Wave ${credits}`
    }
}

//UPGRADES
const upgrades = [
    {   
        name: 'Heavy Ammo',
        description: `
            <span><g>+50%</g> Damage</span><br>
            <span><b>-25%</b> bullet speed</span>
        `,
        action: () => {player.gun.damage *= 1.5; player.gun.bulletSpeed *= 0.75}
    },
    {   
        name: 'Big Bullets',
        description: `
            <span><g>+5</g> Bullet size</span><br>
            <span><g>+25%</g> Damage</span><br>
            <span><b>-10%</b> Bullet speed</span>
        `,
        action: () => {player.gun.bulletSize += 5; player.gun.damage *= 1.25; player.gun.bulletSpeed *= 0.9}
    },
    {   
        name: 'Light Ammo',
        description: `
            <span><g>+50% </g>Bullet speed</span><br>
            <span><g>+10% </g>Reload speed</span><br>
            <span><b>-10% </b>Damage</span><br>
            <span><b>-5% </b>Bullet size</span>
        `,
        action: () => {player.gun.bulletSpeed *= 1.5; player.gun.reloadSpeed *= 0.9; player.gun.damage *= 0.9; player.gun.bulletSize *= 0.95}
    },
    {   
        name: 'Sharpshooter',
        description: `
            <span><g>+3</g> Bullet bounces</span><br>
            <span><g>+10%</g> Ricochet damage</span><span style="font-size: 13px; color: grey; cursor: help;" title="Everytime a bullet bounces, its damage gets multiplied by your ricochet damage.">?</span><br>
            <span><b>-35%</b> Damage</span><br>
            <span><b>-50%</b> Max ammo</span>
            `,
        action: () => {player.gun.ricochetAmount += 3; player.gun.ricochetMultiplier *= 1.1; player.gun.damage *= 0.65; player.gun.maxAmmo = DeBread.round(player.gun.maxAmmo / 2)}
    },
    {   
        name: 'Grow',
        description: `
            <span>Bullets deal more damage over time.</span><br>
            <span><b>-10%</b> Damage</span><br>
            <span><b>-10%</b> Reload speed</span>
        `,
        action: () => {player.gun.grow += 0.01; player.gun.damage *= 0.9; player.gun.reloadSpeed *= 1.1}
    },
    {   
        name: 'Explosive Rounds',
        description: `
            <span>Bullets explode on impact.</span><br>
            <span><b>-50%</b> Damage</span>
        `,
        action: () => {player.gun.explosionSize += 75; player.gun.damage *= 0.5}
    },
    {   
        name: 'Incendiary Rounds',
        description: `
            <span>Bullets deal fire damage.</span><br>
            <span><b>-20%</b> Damage</span>
        `,
        action: () => {player.gun.fireDamage += 0.1; player.gun.damage *= 0.8}
    },
    {   
        name: 'Magnetic Ammo',
        description: `
            <span>Bullets become attracted towards enemies.</span><br>
            <span><b>-20%</b> Max Ammo</span>
        `,
        action: () => {player.gun.magnet++; player.gun.maxAmmo = DeBread.round(player.gun.maxAmmo *= 0.8)}
    },
    {   
        name: 'Black Hole',
        description: `
            <span>Compresses half damage in your magazine into one bullet.</span><br>
            <span><b>-50%</b> Reload speed</span><br>
            <span><b>-50%</b> Bullet speed</span>
        `,
        requirement: () => {return player.gun.maxAmmo > 1 && player.gun.damage < 100},
        action: () => {
            player.gun.damage = (player.gun.damage * player.gun.maxAmmo) / 2; 
            player.gun.maxAmmo = 1; 
            player.gun.reloadSpeed *= 1.5
            player.gun.bulletSpeed *= 0.5
        }
    },
    {   
        name: 'Reinforced Gloves',
        description: `
            <span><g>+20% </g>Reload speed</span>
        `,
        action: () => {player.gun.reloadSpeed *= 0.8}
    },
    {
        name: 'Drum Mag',
        description: `
            <span><g>+10 </g>Max Ammo</span><br>
            <span><b>-25% </b>Damage</span><br>
            <span><b>-10% </b>Reload speed</span>
        `,
        action: () => {player.gun.maxAmmo += 10; player.gun.damage *= 0.75; player.gun.reloadSpeed *= 0.9;}
    },
    {   
        name: 'Extended Mag',
        description: `
            <span><g>+5</g> Max ammo</span><br>
            <span><b>-10%</b> Reload speed</span>
        `,
        action: () => {player.gun.maxAmmo += 5; player.gun.reloadSpeed *= 1.1; player.gun.ammo = player.gun.maxAmmo; updateUI()}
    },
    {   
        name: 'Burst',
        description: `
            <span><g>+1</g> Burst length</span><br>
            <span><b>-20%</b> Max ammo</span><br>
            <span><b>-10%</b> Reload speed</span>
        `,
        action: () => {player.gun.burstLength += 1; player.gun.reloadSpeed *= 1.1; player.gun.maxAmmo = Math.ceil(player.gun.maxAmmo *= 0.8)}
    },
    {   
        name: 'Poison',
        description: `
            <span>Bullets deal additional damage after an enemy is hit.</span><br>
            <span><b>-10%</b> Damage</span>
        `,
        action: () => {player.gun.poisonLength += 5; player.gun.damage *= 0.9}
    },
    {   
        name: 'Poison Flask',
        description: `
            <span>Dashing creates a trail of poison fields.</span><br>
            <span><b>-25%</b> Speed</span>
        `,
        action: () => {player.poisonTrail++; player.speed *= 0.75}
    },
    {
        name: 'Precision Goggles',
        description: `
        <span><g>+5%</g> Crit chance</span><br>
        <span><g>+10%</g> Bullet speed</span><br>
        `,
        action: () =>  {
            player.gun.critChance += 5
            player.gun.bulletSpeed *= 1.1
        } 
    },
    {   
        name: 'Med Kit',
        description: `
            <span>Return to max health</span><br>
        `,
        requirement: () => {return (player.health / player.maxHealth) < 0.5},
        action: () => {player.health = player.maxHealth; updateUI()}
    },
    {   
        name: 'Life Saver',
        description: `<span><g>+75</g> Health</span>`,
        requirement: () => {return (player.health / player.maxHealth) < 0.5},
        action: () => {
            if(player.health + 75 > player.maxHealth) {
                player.health = player.maxHealth
            } else {
                player.health += 75; 
            }
            updateUI()
        }
    },
    {   
        name: 'Adrenaline',
        description: `
            <span><g>+50</g> Max health</span><br>
            <span><g>+25</g> Health</span><br>
            <span><g>+25%</g> Speed</span><br>
            <span><b>-25%</b> Reload speed</span>
        `,
        action: () => {player.maxHealth += 50; player.health += 25; player.speed *= 1.25; player.gun.reloadSpeed *= 1.25; updateUI()}
    },
    {   
        name: 'Antibiotics',
        description: `
            <span><g>+0.2</g> Health regen</span><br>
            <span><b>-10%</b> Max health</span>
        `,
        action: () => {player.healthRegen += 0.25; player.maxHealth *= 0.9; updateUI()}
    },
    {   
        name: 'Diazepam',
        description: `
            <span><g>+30%</g> Reload speed</span><br>
            <span><g>+10%</g> Crit damage</span><br>
            <span><b>-10%</b> Speed</span>
        `,
        action: () => {player.gun.reloadSpeed *= 0.7; player.gun.critMultiplier *= 1.1 ;player.speed *= 0.9}
    },
    {
        name: 'Parasite',
        description: `
            <span>Heal for <g>+5%</g> of your damage everytime an enemy is hit with a bullet.</span><br>
            <span><b>-25%</b> Reload speed</span>
        `,
        action: () => {player.parasite += 0.05; player.gun.reloadSpeed *= 1.25}
    },
    {   
        name: 'Hour Glass',
        description: `
            <span><g>-10%</g> Enemy speed</span><br>
            <span><g>-5%</g> Block cooldown</span>
        `,
        action: () => {
            if(enemyInfo.speedMultiplier * 0.9 > 0.05) {
                enemyInfo.speedMultiplier *= 0.9
            }   else {
                enemyInfo.speedMultiplier = 0.05
            }
            player.block.cooldown *= 0.95
        }
    },
    {   
        name: 'Running Shoes',
        description: `
            <span><g>+20%</g> Speed</span>
        `,
        action: () => {player.speed *= 1.2}
    },
    {   
        name: 'Leaf',
        description: `
            <span><g>+0.5</g> Stamina regen</span><br>
            <span><b>-5%</b> Speed</span>
        `,
        action: () => {player.staminaRegen += 0.5; player.speed *= 0.95}
    },
    {   
        name: 'Broken Counter',
        description: `
            <span><g>-10%</g> Combo loss</span><br>
        `,
        action: () => {player.comboLoss *= 0.9}
    },
    {   
        name: 'Shield',
        description: `
            <span><g>-10%</g> Block cooldown</span><br>
            <span><b>-10%</b> Block range</span><br>
        `,
        action: () => {
            player.block.cooldown *= 0.9
            player.block.size *= 0.9
        }
    },
    {   
        name: 'Extendo Grip',
        description: `
            <span><g>+15%</g> Block range</span><br>
            <span><g>+5%</g> Block damage</span><br>
            <span><b>-10%</b> Speed</span>
        `,
        action: () => {
            player.block.size *= 1.15
            player.block.damage *= 1.05
            player.speed *= 0.9
        }
    },
    {   
        name: 'Brass Knuckles',
        description: `
            <span><g>+30%</g> Block damage</span><br>
            <span><b>-5%</b> Block range</span>
        `,
        action: () => {
            player.block.damage *= 1.3
            player.block.size *= 0.95
        }
    },
    {   
        name: 'Pepto Bismol',
        description: `
            <span>Parried bullets spawn poison fields.</span><br>
            <span><b>-5%</b> Block range</span>
        `,
        action: () => {
            player.block.parryPoisonFieldTicks += 10
            player.block.size *= 0.95
        }
    },
    {   
        name: 'Frostburn',
        description: `
            <span>Blocking slows down enemies.</span><br>
            <span><b>-10%</b> Block cooldown</span>
        `,
        action: () => {
            player.block.frostburn++
            player.block.cooldown *= 1.1
        }
    },
    {   
        name: 'Explosive Shield',
        description: `
            <span>Blocking blows up enemies.</span><br>
            <span><b>-75%</b> Block damage</span><br>
            <span><b>-10%</b> Block cooldown</span>
        `,
        action: () => {
            player.block.explosive++
            player.block.damage *= 0.25
            player.block.cooldown *= 1.1
        }
    },
    {   
        name: 'Sawblade',
        description: `
            <span>Creates a sawblade which rotates around the player.</span><br>
            <em style="color:grey;">*Saw damage is based off of block damage.</em><br>
            <span><b>-10%</b> Block damage</span><br>
        `,
        action: () => {
            player.sawblades++
            player.block.damage *= 0.90
            player.block.cooldown *= 1.1
            playerD.getSaws()
        }
    },
    {   
        name: 'Missing Texture',
        description: `
            <span>???????? ?? ??? ?? ????? ?? ???</span>
        `,
        action: () => {
            let randomUpgrade = upgrades[DeBread.randomNum(0, upgrades.length - 1)]
            player.upgrades.push(randomUpgrade)
            randomUpgrade.action()
        }
    },
]

const rareUpgrades = [
    {
        name: 'Ammunition Card',
        description: `
        <span><g>+50%</g> Max ammo</span><br>
        <span><g>+10</g> Bullet size</span><br>
        <span><g>+5</g> Bullet bounces</span><br>
        `,
        action: () => {
            player.gun.maxAmmo = Math.ceil(player.gun.maxAmmo * 1.5)
            player.gun.bulletSize += 10
            player.gun.ricochetAmount += 5
        }
    },
    {
        name: 'Damage Card',
        description: `
        <span><g>+150%</g> Damage</span><br>
        <span><g>+75%</g> Block damage</span><br>
        <span><g>+1</g> Fire damage</span><br>
        `,
        action: () => {
            player.gun.damage *= 2.5
            player.block.damage *= 1.75
            player.gun.fireDamage++
        }
    },
    {
        name: 'Block Card',
        description: `
        <span><g>+100%</g> Block size</span><br>
        <span><g>-75%</g> Block cooldown</span><br>
        `,
        action: () => {
            player.block.cooldown *= 0.25
            player.block.size *= 2
        }
    },
    {
        name: 'Health Card',
        description: `
        <span><g>+75%</g> Max health</span><br>
        <span><g>+100%</g> Health</span><br>
        <span><g>+1</g> Health regen</span>
        `,
        action: () => {
            player.maxHealth *= 1.75
            player.health = player.maxHealth
            player.healthRegen++
        }
    },
    {
        name: 'Defense Card',
        description: `
        <span><g>+5</g> Sawblades</span><br>
        <span><g>+100%</g> Block damage</span><br>
        `,
        action: () => {
            player.sawblades += 5
            playerD.getSaws()
            player.block.damage *= 2
        }
    },
    {
        name: 'Time Card',
        description: `
        <span><g>+50%</g> Reload speed</span><br>
        <span><g>+25%</g> Speed</span><br>
        <span><g>-50%</g> Block cooldown</span><br>
        <span><g>+25%</g> Enemy speed</span><br>
        `,
        action: () => {
            enemyInfo.speedMultiplier *= 0.75
            player.speed *= 1.25
            player.gun.reloadSpeed *= 0.5
            player.block.cooldown *= 0.5
        }
    },
    {
        name: 'Mobility Card',
        description: `
        <span><g>+50%</g> Speed</span><br>
        <span><g>+2</g> Dashes</span><br>
        <span><g>+1</g> Stamina regen</span><br>
        `,
        action: () => {
            player.speed *= 1.5
            player.dashes += 2
            player.staminaRegen += 1
        }
    }
]

const extraUpgrades = [ //These upgrades are supposed to be funny, not optimized
    {
        name: 'Poop upgrade',
        description: `
            poop upgrade<br>
            <g>+Don't</g><br>
            <em style="color: grey;">*Sandbox only</em>
        `,
        action: () => {
            let i = 1
            setInterval(() => {
                game.style.rotate = i + 'deg'
                createExplosion([DeBread.randomNum(0, game.offsetWidth), DeBread.randomNum(0, game.offsetHeight)], DeBread.randomNum(100, 500), 0, 0)
                i*= 1.01
            }, 10);
        }
    },
    {
        name: 'Sog',
        description: `
            <g>+Sog</g><br>
            <em style="color: grey;">*Sandbox only</em>
        `,
        action: () => {
            player.sog = true
        }
    },
    {
        name: 'Sog',
        description: `
            <g>+Super Sog</g><br>
            <em style="color: grey;">*Sandbox only</em>
        `,
        action: () => {
            player.sog = true
            document.querySelectorAll('div').forEach((div) => {
                div.style.background = 'url(https://soggy.cat/img/soggycat.webp)'
                div.style.backgroundSize = 'cover'
            })
        }
    },
    {
        name: 'Nuke',
        description: `
            <span>Boom</span><br>
            <em style="color: grey;">*Sandbox only</em>
        `,
        action: () => {
            createExplosion([game.offsetWidth / 2, game.offsetHeight / 2], 750, 10000)
        }
    },
    {
        name: 'Gay Juice',
        description: `
        <g>+Gay</g><br>
        <em style="color: grey;">*Sandbox only</em>
        `,
        action: () => {
            playerD.style.animation = 'gayJuice 1s linear infinite forwards'
        }
    }
]
doge('shop').style.display = 'none'
function openShop(upgradeAmount, progressWave = true) {
    if(doge('shop').style.display !== 'flex' && !data.settings.sandbox) {
        clearPlayArea()
        let upgradeGot = false
        disableInput = true
        doge('shop').style.display = 'flex'
        doge('shopUpgradeName').style.opacity = 0
        doge('shopUpgradeDesc').innerText = 'Hover over an upgrade to see its description.'
    
        //GET RANDOM UPGRADES
        let shopUpgrades = []
        let loops = 0
        while(shopUpgrades.length < upgradeAmount) {
            if(DeBread.randomNum(0, 150) === 0) {
                let randomValue = DeBread.randomNum(0, rareUpgrades.length - 1)
                if(!shopUpgrades.includes(rareUpgrades[randomValue])) {
                    shopUpgrades.push(rareUpgrades[randomValue])
                }

                loops++
    
                if(loops > 100) {
                    createNoti('media/error.png', 'While loop overflow occured.', 'Upgrade amount may not be correct.')
                    break
                }
            } else {
                let randomValue = DeBread.randomNum(0, upgrades.length - 1)
                let metRequirement = true
                if(upgrades[randomValue].requirement) {
                    metRequirement = upgrades[randomValue].requirement()
                }
                if(!shopUpgrades.includes(upgrades[randomValue]) && metRequirement) {
                    shopUpgrades.push(upgrades[randomValue])
                }
                loops++
    
                if(loops > 100) {
                    createNoti('media/error.png', 'While loop overflow occured.', 'Upgrade amount may not be correct.')
                    break
                }
            }
        }
    
        //CLEAR SHOP UPGRADES
        doge('shopUpgrades').innerHTML = ''
    
        for(let i = 0; i < upgradeAmount; i++) {
            const shopUpgrade = document.createElement('div')
            if(shopUpgrades[i].name.endsWith('Card')) {
                shopUpgrade.innerHTML = `
                <div class="shopUpgrade rareUpgrade">
                    <img src="media/upgrades/${shopUpgrades[i].name.replace(' ', '_')}.png">
                </div>
                `
            } else {
                shopUpgrade.innerHTML = `
                <div class="shopUpgrade">
                    <img src="media/upgrades/${shopUpgrades[i].name.replace(' ', '_')}.png">
                </div>
                `
            }
    
            setTimeout(() => {
                doge('shopUpgrades').appendChild(shopUpgrade)
            }, i * 10);
    
            shopUpgrade.onmouseenter = () => {
                doge('shopUpgradeName').innerText = shopUpgrades[i].name
                doge('shopUpgradeDesc').innerHTML = shopUpgrades[i].description
                doge('shopUpgradeName').style.opacity = 1

                if(shopUpgrades[i].name.endsWith('Card')) {
                    // doge('shopUpgradeDescContainer').style.animation = 'rareUpgradeGlow 1s linear infinite forwards'
                    doge('shopUpgradeName').style.animation = 'rareUpgradeGlow 1s linear infinite forwards'
                } else {
                    // doge('shopUpgradeDescContainer').style.animation = 'none'
                    doge('shopUpgradeName').style.animation = 'none'
                }
            }
    
            //ON CLICK
            shopUpgrade.onclick = () => {
                if(!upgradeGot) {
                    upgradeGot = true
                    shopUpgrades[i].action()
                    player.upgrades.push(shopUpgrades[i])
                    shopUpgrade.classList.add('shopUpgradeAnim')
                    if(!data.stats.upgrades[shopUpgrades[i].name]) {
                        data.stats.upgrades[shopUpgrades[i].name] = 1
                    } else {
                        data.stats.upgrades[shopUpgrades[i].name]++
                    }
                    setTimeout(() => {
                        doge('shopInventory').classList.add('shopInventoryAnim')
                        updateInventory()
                        setTimeout(() => {
                            doge('shop').style.display = 'none'
                            disableInput = false
                            if(progressWave) {currentWaveSize++}
                            spawnWave(currentWaveSize)
                            player.gun.ammo = player.gun.maxAmmo
                            damagePlayer(0)
                            updateStats()
                            
                            if(currentWaveSize > data.stats.highestWaveReached) {
                                data.stats.highestWaveReached = currentWaveSize
                            }

                            if(currentWaveSize >= 10) {
                                getAchievement('survivor')
                            }
                            if(currentWaveSize >= 25 && enemyInfo.damageMultiplier === 1) {
                                createWarning('The air becomes tense...', 'Enemies deal 50% more damage.')
                                enemyInfo.damageMultiplier = 1.5
                            }
                            if(currentWaveSize >= 50 && !enemyInfo.radient) {
                                createWarning('Enemies start to evolve...', 'Enemies can now become radient.')
                                enemyInfo.radient = true
                            }
                            if(currentWaveSize >= 50) {
                                getAchievement('trooper')
                            }
                            if(currentWaveSize >= 100 && enemyInfo.damageMultiplier === 1.5) {
                                createWarning('Enemies become enraged.', 'Enemies deal 100% more damage.')
                                enemyInfo.damageMultiplier = 3
                            }
                            if(currentWaveSize >= 100) {
                                getAchievement('conqueror')
                            }
                            if(currentWaveSize >= 200) {
                                getAchievement('champion')
                            }
    
                            doge('shopInventory').classList.remove('shopInventoryAnim')
                        }, 2000);


                        //Check for achievement
                        const cardUpgrades = {
                            ammunition: false,
                            damage: false,
                            block: false,
                            health: false,
                            defense: false,
                            time: false,
                            mobility: false,
                        }
                        for(const key in data.stats.upgrades) {
                            if(key.toLowerCase().replace(' card','') === 'ammunition') cardUpgrades.ammunition = true
                            if(key.toLowerCase().replace(' card','') === 'damage') cardUpgrades.damage = true
                            if(key.toLowerCase().replace(' card','') === 'block') cardUpgrades.block = true
                            if(key.toLowerCase().replace(' card','') === 'health') cardUpgrades.health = true
                            if(key.toLowerCase().replace(' card','') === 'defense') cardUpgrades.defense = true
                            if(key.toLowerCase().replace(' card','') === 'time') cardUpgrades.time = true
                            if(key.toLowerCase().replace(' card','') === 'mobility') cardUpgrades.mobility = true
                        }
                        let achievementPassed = true
                        for(const key in cardUpgrades) {
                            if(!cardUpgrades[key]) {
                                achievementPassed = false
                            }
                        }
                        if(achievementPassed) {
                            getAchievement('cardCollector')
                        }
                    }, 500);
                }
            }
    
            //UPGRADE INVENTORY UPDATE
    
            function updateInventory() {
                doge('shopInventory').innerHTML = `
                <div id="shopInventoryLabel">
                    <span>UPGRADE INVENTORY</span>
                </div>
                `
                for(const upgrade in player.upgrades) {
                    if(!doge(`inventoryUpgrade${player.upgrades[upgrade].name}`)) {
                        const inventoryUpgrade = document.createElement('div')
                        inventoryUpgrade.onmouseenter = () => {
                            doge('shopUpgradeName').innerText = player.upgrades[upgrade].name
                            doge('shopUpgradeDesc').innerHTML = player.upgrades[upgrade].description
                            doge('shopUpgradeName').style.opacity = 1
                        }
                        inventoryUpgrade.classList.add('inventoryUpgrade')

                        if(player.upgrades[upgrade].name.endsWith('Card')) {
                            inventoryUpgrade.classList.add('rareUpgradeButWithoutTheOutline')
                        }
    
                        inventoryUpgrade.innerHTML = `
                        <img src="media/upgrades/${player.upgrades[upgrade].name.replace(' ', '_')}.png">
                        <span id="inventoryUpgrade${player.upgrades[upgrade].name}">1</span>
                        `
                        doge('shopInventory').append(inventoryUpgrade)
                    } else {
                        doge(`inventoryUpgrade${player.upgrades[upgrade].name}`).innerText++
                    }
                }
            }
            updateInventory()
        }
    }
}

function createWarning(title, text) {
    const warning = document.createElement('div')
    warning.classList.add('gameWarning')
    warning.innerHTML = `
        <div class="gameWarningExclamation">
            <span>!</span>
        </div>
        <span class="gameWarningTitle">${title}</span>
        <span class="gameWarningDesc">${text}</span>
    `

    doge('gameWarningContainer').append(warning)
    setTimeout(() => {
        warning.style.opacity = 1
        warning.style.scale = 1
        setTimeout(() => {
            warning.style.opacity = 0
            warning.style.scale = 0.75
            setTimeout(() => {
                warning.remove()
            }, 500);
        }, 5000);
    }, 100);
}

//Add upgrade textures to load query...

for(const upgrade in upgrades) {
    imagesToLoad.upgrades.push(`media/upgrades/${upgrades[upgrade].name.replace(' ', '_')}.png`)
}

for(const upgrade in rareUpgrades) {
    imagesToLoad.upgrades.push(`media/upgrades/${rareUpgrades[upgrade].name.replace(' ', '_')}.png`)
}

for(const upgrade in extraUpgrades) {
    imagesToLoad.upgrades.push(`media/upgrades/${extraUpgrades[upgrade].name.replace(' ', '_')}.png`)
}

function updateStats() {
    doge('statPlayerSpeed').innerText = `Speed: ${DeBread.round(player.speed, 2)}`
    doge('statPlayerMaxHealth').innerText = `Max Health: ${DeBread.round(player.maxHealth, 2)}`
    doge('statPlayerComboLoss').innerText = `Combo Loss: ${DeBread.round(player.comboLoss * 100)}%`

    doge('statBlockSize').innerText = `Size: ${DeBread.round(player.block.size, 2)}px`
    doge('statBlockCooldown').innerText = `Cooldown: ${DeBread.round(player.block.cooldown, 1)}ms`
    doge('statBlockDamage').innerText = `Damage: ${DeBread.round(player.block.damage)}`

    doge('statGunDamage').innerText = `Damage: ${DeBread.round(player.gun.damage, 2)}`
    doge('statGunMaxAmmo').innerText = `Max Ammo: ${DeBread.round(player.gun.maxAmmo, 2)}`
    doge('statGunBulletSpeed').innerText = `Bullet Speed: ${DeBread.round(player.gun.bulletSpeed, 2)}`
    doge('statGunBulletSize').innerText = `Bullet Size: ${DeBread.round(player.gun.bulletSize, 2)}px`
    doge('statGunReloadSpeed').innerText = `Reload Speed: ${DeBread.round(player.gun.reloadSpeed, 2)}ms`
    doge('statGunParasitePercent').innerText = `Parasite Percent: ${DeBread.round(player.parasite * 100)}%`
    doge('statGunExplosionSize').innerText = `Explosion Size: ${DeBread.round(player.gun.explosionSize, 2)}px`
    doge('statGunPoisonLength').innerText = `Poison Length: ${DeBread.round(player.gun.poisonLength, 2)} ticks`
    doge('statGunGrow').innerText = `Grow Amount: ${DeBread.round(player.gun.grow, 4)} dmg/u`
    doge('statGunFireDamage').innerText = `Fire Damage: ${DeBread.round(player.gun.fireDamage, 2)}`
    doge('statGunRicochets').innerText = `Bullet Bounces: ${player.gun.ricochetAmount}`
    doge('statGunRicochetMultiplier').innerText = `Bullet Bounce Multiplier: ${DeBread.round(player.gun.ricochetMultiplier, 1)}x`

    doge('statEnemySpeedMultiplier').innerText = `Speed Multiplier: ${DeBread.round(enemyInfo.speedMultiplier, 2)}x`

    if(!doge('statsContainer').style.left !== '25px' && !data.settings.keepStatsOpen) {
        doge('statsContainer').style.left = -doge('statsContainer').offsetWidth + 'px'
    }
} updateStats()

//TOOL FUNCTIONS

let popupTexts = 0
let popupTextLimit = 50
function createPopupText(pos, text, size, weight = 500, color = 'white', global = false) {
    if(popupTexts < popupTextLimit) {
        const span = document.createElement('span')
        span.classList.add('popup')
        if(typeof text === 'number') {
            if(text < 5) {
                span.innerText = DeBread.round(text, 2)
            } else {
                span.innerText = formatNumber(DeBread.round(text))
            }
        } else {
            span.innerText = text
        }
        if(size < 75) {
            span.style.fontSize = size+'px'
        } else {
            span.style.fontSize = '75px'
        }
        if(weight < 900) {
            span.style.fontWeight = weight
        } else {
            span.style.fontWeight = '900'
        }
        span.style.color = color
        span.style.opacity = 0
        span.style.setProperty('--popupX', DeBread.randomNum(-25, 25)+'px')
        span.style.setProperty('--popupY', DeBread.randomNum(-25, 25)+'px')
        span.style.setProperty('--popupR', DeBread.randomNum(-10, 10)+'deg')
        
        if(global) {
            document.body.append(span)
        } else {
            game.append(span)
        }
        popupTexts++
        doge('dbPopupTexts').innerText = `PTexts: ${popupTexts}/${popupTextLimit}`
        doge('dbPopupTexts').style.color = `hsl(0deg, 100%, ${100 - ((popupTexts - (popupTextLimit / 2)) / popupTextLimit) * 100}%)`
        
        span.style.left = pos[0] - span.offsetWidth / 2+'px'
        span.style.top = pos[1] - span.offsetHeight / 2+'px'
        span.style.opacity = 1
    
        setTimeout(() => {
            span.remove()
            popupTexts--
            doge('dbPopupTexts').innerText = `PTexts: ${popupTexts}/${popupTextLimit}`
            doge('dbPopupTexts').style.color = `hsl(0deg, 100%, ${100 - ((popupTexts - (popupTextLimit / 2)) / popupTextLimit) * 100}%)`
        }, 1000);
    }
    doge('dbPopupTexts').innerText = `PTexts: ${popupTexts}/${popupTextLimit}`
    doge('dbPopupTexts').style.color = `hsl(0deg, 100%, ${100 - ((popupTexts - (popupTextLimit / 2)) / popupTextLimit) * 100}%)`
}

function clearPlayArea() {
    //ENEMIES
    game.querySelectorAll('enemy').forEach((enemy) => {
        enemy.kill()
    })

    //ENEMY BULLETS
    game.querySelectorAll('.bullet').forEach((bullet) => {
        bullet.remove()
        clearInterval(bullet.gunUpdateInterval)
        clearInterval(bullet.interval)
    })

    //POISON FIELDS
    game.querySelectorAll('.customField').forEach((field) => {
        field.active = false
        field.remove()
    })
}

//put this shit here cause i have no idea where else to put it

function increaseChallengeProgress(unit, amount) {
    if(!data.settings.sandbox) {
        doge('gameChallenges').innerHTML = ''
        for(const key in data.challenges) {
            if(data.challenges[key].unit === unit) {
                if(data.challenges[key].progress + amount < data.challenges[key].goal) {
                    data.challenges[key].progress += amount
                } else {
                    data.challenges[key].progress = data.challenges[key].goal
                    if(!data.challenges[key].completed) {
                        data.challenges[key].completed = true
                        createChallengeCompleteNoti(data.challenges[key])
                        data.stats.challengesCompleted++
                        setTimeout(() => {
                            getXP(data.challenges[key].reward)
                        }, 2000);
                    }
                }
            }
            if(!data.challenges[key].completed) {
                const div = document.createElement('div')
                div.classList.add('gameChallenge')
                div.innerHTML = `
                    <div class="gameChallengeInfo">
                        <span>${data.challenges[key].desc}</span>
                        <span>${DeBread.round(data.challenges[key].progress)}/${data.challenges[key].goal}</span>
                    </div>
                    <div class="gameChallengeBar">
                        <div class="gameChallengeInnerBar" style="width: ${data.challenges[key].progress / data.challenges[key].goal * 100}%;"></div>
                    </div>
                `
                doge('gameChallenges').append(div)
            }
        }
    }
    renderDailyChallenges()
}

function isColliding(div1, div2) {
    const rect1 = div1.getBoundingClientRect()
    const rect2 = div2.getBoundingClientRect()
  
    return !(
      rect1.right <= rect2.left ||
      rect1.left >= rect2.right ||
      rect1.bottom <= rect2.top ||
      rect1.top >= rect2.bottom
    )
}

//you reached the end, go you!