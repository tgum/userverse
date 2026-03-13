let world_name = "overworld"
let camera = {x: 0, y: 0}

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
  mg.clear_screen(150, 29, 160)
  Player.update()
  camera.x += Math.floor((Player.x - camera.x) / 10)
  camera.y += Math.floor((Player.y - camera.y) / 10)

  mg.ctx.translate(mg.width/2, mg.height/2);

  worlds[world_name].draw_backgrounds()

  queue = []
  
  worlds[world_name].queue_instances()
  Player.draw()

  queue.sort((a, b) => a.y > b.y)
  
  for (let sprite of queue) {
    if (Player.y < sprite.y &&
        Player.y > sprite.y - (sprite.offset[1]) &&
        Player.x > sprite.x - sprite.offset[0] &&
        Player.x < sprite.x - sprite.offset[0] + sprite.sprite.width) {
      mg.ctx.globalAlpha = 0.8;
    }
    mg.draw_image(sprite.sprite, sprite.x - sprite.offset[0] - camera.x, sprite.y - sprite.offset[1] - camera.y)
    mg.ctx.globalAlpha = 1;
  }

  for (let sprite of queue) {
    let x = sprite.x - camera.x
    let y = sprite.y - camera.y
    mg.set_fill_color(255, 255, 255)
    mg.rect(x-3, y-3, 6, 6)
  }
}

mg.start()
