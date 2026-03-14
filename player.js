let Player = {
  x: 0,
  y: 0,
  width: 64,
  sprite: load_image("characters/player/player.png"),
  speed: 4,
  inDialog: false,
  skipDialog: false,

  isColliding() {
    let colliding = false
    for (let instance of worlds[world_name].instances) {
      let prop = instance.prop
      if (prop.hitbox[2] == 0 && prop.hitbox[3] == 0) continue
      if (Player.x+16 >= instance.x+prop.hitbox[0] &&    // r1 right edge past r2 left
          Player.x-16 <= instance.x+prop.hitbox[2] &&    // r1 left edge past r2 right
          Player.y    >= prop.hitbox[1]+instance.y &&    // r1 top edge past r2 bottom
          Player.y    <= prop.hitbox[3]+instance.y) {    // r1 bottom edge past r2 top
        console.log("collision")
        return true;
      }
    }
    return false
  },

  showRoom(room) {
    let textoutput = document.querySelector("#dialogtext")
    let optionsoutput = document.querySelector("#dialogoptions")

    let {text, options} = parse_room(dialog_rooms[room])
    text = text.trim()
    if (options.length == 0) {
      options.push({dest: "End", text: "..."})
    }
    textoutput.innerHTML = ""
    optionsoutput.innerHTML = ""

    let index = 0
    function putchar() {
      let char = text[index]
      textoutput.textContent += char
      index++
      let length = 50
      if (".,!?\n".includes(char)) length = 400
      if (" ".includes(char)) length = 0
      if (index < text.length) {
        setTimeout(putchar, length)
      } else {
        for (let option of options) {
          let button = document.createElement("button")
          button.textContent = option.text
          let dest = option.dest
          button.onclick = () => {
            if (option.dest.toLowerCase() == "end") {
              Player.inDialog = false
              textoutput.innerHTML = ""
              optionsoutput.innerHTML = ""
            } else {
              Player.showRoom(dest)
            }
          }
          optionsoutput.append(button)
        }
      }
    }
    putchar()
  },
  
  update: () => {
    document.querySelector("#dialog").hidden = !Player.inDialog
    if (!Player.inDialog) {
      let moveX = 0
      let moveY = 0
      let speed = Player.speed
      if (mg.isKeyDown("ShiftLeft")) {
        speed *= 2
      }
      if (mg.isKeyDown("KeyW")) {
        moveY -= speed
      }
      if (mg.isKeyDown("KeyA")) {
        moveX -= speed
      }
      if (mg.isKeyDown("KeyS")) {
        moveY += speed
      }
      if (mg.isKeyDown("KeyD")) {
        moveX += speed
      }
      if (mg.isKeyDown("KeyE")) {

        let closestinst
        let closestdist = Infinity
        for (let instance of worlds[world_name].instances) {
          if (instance.script) {
            let dist = (Player.x - instance.x)**2 + (Player.y-instance.y)**2
            if (dist < closestdist) {
              closestinst = instance
              closestdist = dist
            }
          }
        }
        if (closestdist < 100**2) {
          Player.inDialog = true
          console.log(closestinst)
          parse_rooms(closestinst.script)
          Player.showRoom("Start")
        }
      }
      Player.x += moveX
      if (Player.isColliding()) Player.x -= moveX
      Player.y += moveY
      if (Player.isColliding()) Player.y -= moveY
    }
  },
  draw: () => {
    queue_sprite(Player.sprite, Player.x, Player.y, [32, 64])
  }
}
