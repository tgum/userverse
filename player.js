let Player = {
  x: 0,
  y: 0,
  width: 64,
  sprite: load_image("characters/player/player.png"),
  speed: 4,

  isColliding() {
    let colliding = false
    for (let instance of worlds[world_name].instances) {
      let prop = instance.prop
      if (prop.hitbox[2] == 0 && prop.hitbox[3] == 0) continue
      if (Player.x+32 >= instance.x+prop.hitbox[0] &&    // r1 right edge past r2 left
          Player.x-32 <= instance.x+prop.hitbox[2] &&    // r1 left edge past r2 right
          Player.y    >= prop.hitbox[1]+instance.y &&    // r1 top edge past r2 bottom
          Player.y    <= prop.hitbox[3]+instance.y) {    // r1 bottom edge past r2 top
        console.log("collision")
        return true;
      }
    }
    return false
  },
  
  update: () => {
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
    Player.x += moveX
    if (Player.isColliding()) Player.x -= moveX
    Player.y += moveY
    if (Player.isColliding()) Player.y -= moveY
  },
  draw: () => {
    queue_sprite(Player.sprite, Player.x, Player.y, [32, 64])
  }
}
