let world_name = "overworld"
let camera = {x: 0, y: 0}

let DEBUG = true

function preload() {
  load_world()
}

function load() {
  
}

let queue = []
function queue_sprite(sprite, x, y, offset=[0, 0]) {
  queue.push({sprite, x, y, offset})
}

function loop() {
  DEBUG = mg.isKeyDown("KeyP")
  mg.clear_screen(150, 29, 160)
  Player.update()

  camera.x += Math.round((Player.x - camera.x) / 20)
  camera.y += Math.round((Player.y - camera.y) / 20)
  if (worlds[world_name].lock_camera) {
    [camera.x, camera.y] = worlds[world_name].lock_camera
  }

  mg.ctx.translate(mg.width/2, mg.height/2);

  worlds[world_name].draw_backgrounds()

  queue = []
  
  worlds[world_name].queue_instances()
  Player.draw()

  queue.sort((a, b) => a.y - b.y)
  
  for (let sprite of queue) {
    if (Player.y < sprite.y &&
        Player.y > sprite.y - (sprite.offset[1]) &&
        Player.x > sprite.x - sprite.offset[0] &&
        Player.x < sprite.x - sprite.offset[0] + sprite.sprite.width) {
      // mg.ctx.globalAlpha = 0.8;
    }
    mg.draw_image(sprite.sprite, sprite.x - sprite.offset[0] - camera.x, sprite.y - sprite.offset[1] - camera.y)
    mg.ctx.globalAlpha = 1;
  }

  if (DEBUG) {
    for (let sprite of queue) {
      let x = sprite.x - camera.x
      let y = sprite.y - camera.y
      mg.set_fill_color(255, 255, 255)
      mg.rect(x-3, y-3, 6, 6)
    }
    let i = 0
    mg.ctx.globalAlpha = 0.5;
    for (let instance of worlds[world_name].instances) {
      i++
      let prop = instance.prop
      mg.set_fill_color(0, 0, i * 50)
      let x = instance.x
      let y = instance.y
      mg.rect(x+prop.hitbox[0] -camera.x, y+prop.hitbox[1]-camera.y, Math.abs(prop.hitbox[0])+prop.hitbox[2], Math.abs(prop.hitbox[1])+prop.hitbox[3])
    }
    mg.ctx.globalAlpha = 1
  }
}

mg.start()
