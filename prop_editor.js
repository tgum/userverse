function preload() {
  load_world()
}

let camera = {x: 0, y: 0}

function load() {
  console.log(props)
  document.body.append(Interface())
}

function loop() {
  mg.clear_screen(150, 29, 160)
  mg.ctx.translate(mg.width/2, mg.height/2);
  
  if (state.selectedProp != null) {
    let prop = new Prop(state.propData)
    console.log(prop)
    prop.queue_draw(0, 0)
  }
  
  if (sprite != null) {
    console.log(sprite, sprite.x - sprite.offset[0] - camera.x,  sprite.y - sprite.offset[1] - camera.y)
    mg.draw_image(sprite.sprite, sprite.x - sprite.offset[0] - camera.x, sprite.y - sprite.offset[1] - camera.y)
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

function PropSelector() {
  let view = div({style: {float: "right"}})
  for (let prop in props) {
    console.log(prop)
    let b = button({
      style: {display: "block"},
      onclick: () => {state.selectedProp = prop}
    }, prop)
    view.append(b)
  }
  return view
}
function PropEditor(prop) {
  return p(JSON5.stringify(state.propData))
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

