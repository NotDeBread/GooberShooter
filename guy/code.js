const guy = document.getElementById("guy")
const gun = document.getElementById("gun")
const guydata = {
    position: [0,0],
    interval: {
        left: undefined,
        up: undefined,
        down: undefined,
        right: undefined,
    },
    strapped: false
}

function ifWalking() {
    let walking = false
    for (const key in guydata.interval) {
        if (guydata.interval[key] !== undefined) {
            walking = true
        }
    }
    if (walking) {
        guy.src = "media/images/guyWalk.gif"
        if (guydata.strapped) {
            guy.src = "media/images/guywithgun.gif"
        }
    } else {
        guy.src = "media/images/guy1.png"
        if (guydata.strapped) {
            guy.src = "media/images/guywithgun.png"
        }
    }
    console.log(walking)
}

function isColliding(elem1, elem2) {
    const rect1 = elem1.getBoundingClientRect();
    const rect2 = elem2.getBoundingClientRect();
  
    return !(
      rect1.right <= rect2.left ||
      rect1.left >= rect2.right ||
      rect1.bottom <= rect2.top ||
      rect1.top >= rect2.bottom
    );
}


document.addEventListener("keydown", ev => {
    if (ev.key === "ArrowLeft" && guydata.interval.left === undefined) {
        guydata.interval.left = setInterval( () => {
            guydata.position[0] -= 5;
            guy.style.left = guydata.position[0] + "px"
        }, 10)
        ifWalking()
    }
    if (ev.key === "ArrowUp" && guydata.interval.up === undefined) {
        guydata.interval.up = setInterval( () => {
            guydata.position[1] -= 5;
            guy.style.top = guydata.position[1] + "px"
        }, 10)
        ifWalking()
    }
    if (ev.key === "ArrowDown" && guydata.interval.down === undefined) {
        guydata.interval.down = setInterval( () => {
            guydata.position[1] += 5;
            guy.style.top = guydata.position[1] + "px"
        }, 10)
        ifWalking()
    }
    if (ev.key === "ArrowRight" && guydata.interval.right === undefined) {
        guydata.interval.right = setInterval( () => {
            guydata.position[0] += 5;
            guy.style.left = guydata.position[0] + "px"
        }, 10)
        ifWalking()
    }
})

document.addEventListener("keyup", ev => {
    if (ev.key === "ArrowLeft") {
        clearInterval(guydata.interval.left)
        guydata.interval.left = undefined
        ifWalking()
    }
    if (ev.key === "ArrowUp") {
        clearInterval(guydata.interval.up)
        guydata.interval.up = undefined
        ifWalking()
    }
    if (ev.key === "ArrowDown") {
        clearInterval(guydata.interval.down)
        guydata.interval.down = undefined
        ifWalking()
    }
    if (ev.key === "ArrowRight") {
        clearInterval(guydata.interval.right)
        guydata.interval.right = undefined
        ifWalking()
    }
})

document.addEventListener("keydown", ev => {
    if (ev.key === " ") {
        const audio = new Audio("media/sounds/fart.mp3")
        audio.volume = 0.25
        audio.play()
    }
} )

let MouseX
let MouseY

document.addEventListener("mousemove", ev => {
    MouseX = ev.x
    MouseY = ev.y
    const DynText = document.getElementById("DynamicText")

    DynText.innerText = `Mouse X: ${MouseX} \n Mouse Y: ${MouseY}`
})

document.addEventListener("mousedown", ev => {
   if (guydata.strapped) {
    const bullet = document.createElement("img")
    bullet.src = "media/images/boolet.png"
    const angle = Math.atan2(MouseY-guydata.position[1],MouseX-guydata.position[0])
    const speed = 12
    const position = [guydata.position[0],guydata.position[1]]
    const padding = bullet.offsetWidth
    const bullInt = setInterval(() => {
        position[0] += speed * Math.cos(angle)
        position[1] += speed * Math.sin(angle)
        if (position[0]<0 || position[1]<0 || position[0]>window.innerWidth-padding || position[1]>window.innerHeight-padding) {
            bullet.remove()
            clearInterval(bullInt)
        }
        bullet.style.left = position[0]+"px"
        bullet.style.top = position[1]+"px"
    }, 50)
    document.body.append(bullet)
    bullet.classList.add("bullet")
   } 
})

setInterval(() => {
    const guyY = guy.getBoundingClientRect().top
    const guyX = guy.getBoundingClientRect().left
    const guyText = document.getElementById("DynamicText2")
    if (gun){
        if (isColliding(guy,gun)){
            guydata.strapped = true
            gun.remove()
            guy.src = "media/images/guywithgun.gif"
        }
    }

    guyText.innerText = `Player X: ${guyX} \n Player Y: ${guyY}`
}, 50)