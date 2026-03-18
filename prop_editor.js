function preload() {
  load_world()
}

let camera = {x: 0, y: 0}

function load() {
  console.log(props)
  document.body.append(Interface())
}

let frame = 0
function loop() {
  frame++
  mg.clear_screen(150, 29, 160)
  mg.ctx.translate(mg.width/2+camera.x, mg.height/2+camera.y);

  let moveX = 0
  let moveY = 0
  let speed = 4
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
  camera.x -= moveX
  camera.y -= moveY
  
  
  if (state.selectedProp != null) {
    let prop = new Prop(state.propData)
    prop.frame = frame
    prop.queue_draw(0, 0)
    
    mg.ctx.globalAlpha = 1;
    mg.draw_image(sprite.sprite, sprite.x - sprite.offset[0], sprite.y - sprite.offset[1])

    mg.ctx.globalAlpha = 0.5;
    mg.set_fill_color(255, 255, 255)
    mg.rect(-3, -3, 6, 6)
    
    mg.set_fill_color(20, 20, 100)
    mg.rect(sprite.x+prop.hitbox[0], sprite.y+prop.hitbox[1], Math.abs(prop.hitbox[0])+prop.hitbox[2], Math.abs(prop.hitbox[1])+prop.hitbox[3])
  }
}

let sprite = null
function queue_sprite(s, x, y, offset=[0, 0]) {
  sprite = {sprite: s, x, y, offset}
}

mg.start()

const state = createState({
  selectedProp: null,
  propData: {},
})

function PropButton(name) {
  return button({
    style: {display: "block"},
    onclick: () => {
      console.log(name)
      state.selectedProp = name
    }
  }, name)
}
function PropContainer(props, nameprefix, name) {
  let prefixes = {}
  let view = details({style: {marginLeft: "1em"}}, summary(name))
  for (let propname in props) {
    let prop = props[propname]
    let result = propname.match(/^(.+?)\.(.+)$/)
    if (!result) {
      let name = propname
      if (nameprefix) {
        name = nameprefix+name
      }
      view.append(PropButton(name))
    } else {
      let prefix = result[1]
      let rest = result[2]
      if (prefixes[prefix] == undefined) {
        prefixes[prefix] = {}
      }
      prefixes[prefix][rest] = prop
    }
  }
  for (let prefix in prefixes) {
    view.append(PropContainer(prefixes[prefix], nameprefix + prefix + ".", prefix))
  }
  console.log(prefixes)
  return view
}
function PropSelector() {
  let view = div({style: {float: "right"}}, PropContainer(props, "", "props"))
  // for (let prop in props) {
  //   console.log(prop)
  //   let b = button({
  //     style: {display: "block"},
  //     onclick: () => {state.selectedProp = prop}
  //   }, prop)
  //   view.append(b)
  // }
  return view
}

function ValueEditor(array, index, callback=()=>{}) {
  let i = input({
    type: "number",
    value: array[index],
    oninput: () => {
      prevValue = array[index]
      array[index] = +i.value
      callback(prevValue, array[index])
      updateoutput()
    },
  })
  return i
}
function OffsetEditor() {
  let x = ValueEditor(state.propData.offset, 0, (pv, nv) => {
    state.propData.hitbox[0] += pv - nv
    state.propData.hitbox[2] += pv - nv
  })
  let y = ValueEditor(state.propData.offset, 1, (pv, nv) => {
    state.propData.hitbox[1] += pv - nv
    state.propData.hitbox[3] += pv - nv
  })
  return div(
    x, y
  )
}
function HitboxEditor() {
  let x1 = ValueEditor(state.propData.hitbox, 0)
  let y1 = ValueEditor(state.propData.hitbox, 1)
  let x2 = ValueEditor(state.propData.hitbox, 2)
  let y2 = ValueEditor(state.propData.hitbox, 3)
  return div(
    x1, y1, br(),
    x2, y2
  )
}
let updateoutput
function PropEditor(prop) {
  let output = textarea({rows: 4, cols: 60}, JSON5.stringify(state.propData))
  updateoutput = () => {
    output.textContent = JSON5.stringify(state.propData) + ","
  }
  return div(
    "offset", OffsetEditor(), br(),
    "hitbox (first pair of coords must be smaller than second pair)", HitboxEditor(), br(),
    "output (copy this and send it to me :) )", br(),
    output,
  )
}

function Interface() {
  let propview = div()
  state.addUpdate("selectedProp", () => {
    propview.innerHTML = ""
    state.propData = parsed_data.props[state.selectedProp]
    propview.append(PropEditor(state.selectedProp))
  })
  return div(
    PropSelector(),
    propview,
  )
}

