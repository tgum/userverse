let assets = {}

function load_image(path) {
  if (path in assets) return assets[path]
  let img = mg.load_image("images/" + path)
  assets[path] = img
  return img
}

class World {
  constructor(data) {
    this.backgrounds = {}

    for (let background_name in data.backgrounds) {
      this.backgrounds[background_name] = load_image("backgrounds/"+data.backgrounds[background_name])
    }

    this.instances = []
    for (let instance of data.instances) {
      this.instances.push({prop: props[instance.prop], x: instance.x, y: instance.y, script: instance.script})
    }

    if (data.lock_camera) {
      this.lock_camera = data.lock_camera
    }
    
  }

  draw_backgrounds() {
    for (let background in this.backgrounds) {
      let x = background.split(",")[0]
      let y = background.split(",")[1]
      mg.draw_image(this.backgrounds[background], x*mg.width-camera.x, y*mg.height-camera.y)
    }
  }

  queue_instances() {
    for (let instance of this.instances) {
      instance.prop.queue_draw(instance.x, instance.y)
    }
  }
}

class Prop {
  constructor(data) {
    this.sprite = load_image("props/" + data.path)
    this.animation = []
    if (data.animation) {
      for (let path of data.animation) {
        this.animation.push(load_image("props/" + path))
      }
    }
    this.frame = 0
    this.framelength = data.framelength || 30
    this.offset = data.offset || [0, 0]
    this.hitbox = data.hitbox || [0, 0, 0, 0]
  }

  queue_draw(x, y) {
    this.frame++
    if (this.animation.length > 0) {
      this.frame = this.frame % (this.framelength * this.animation.length)
      this.sprite = this.animation[Math.floor(this.frame / this.framelength)]
    }
    queue_sprite(this.sprite, x, y, this.offset)
  }
}

let props = {}
let worlds = {}
let parsed_data

function load_world() {
  mg._load_tasks++
  
  fetch("world.json5")
    .then(r => r.text())
    .then(r => {
      mg._load_tasks--
      parsed_data = JSON5.parse(r)
      console.log(parsed_data)

      for (let prop_name in parsed_data.props) {
        let prop_data = parsed_data.props[prop_name]
        props[prop_name] = new Prop(prop_data)
      }

      for (let world_name in parsed_data.worlds) {
        let world_data = parsed_data.worlds[world_name]
        let world = new World(world_data)

        worlds[world_name] = world
      }
    })
}
