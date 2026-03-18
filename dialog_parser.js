let dialog_variables = {}
let dialog_functions = {
  hello: args => {
    console.log("hello world,", args)
  },
  changeworld: args => {
    world_name = args
  },
  teleportplayer: args => {
    let [x, y] = args.split(",")
    x = +x.trim()
    y = +y.trim()
    Player.x = x
    camera.x = x
    Player.y = y
    camera.y = y
  },
  setprop: args => {
    dialog_inst.prop = props[args.trim()]
  }
}

let dialog_script = ""
let dialog_rooms = {}
let dialog_room = ""
let dialog_inst = null

function parse_rooms(dialog) {
  dialog_rooms = {}
  let current_room = ""
  let room_text = ""
  for (let line of dialog.split("\n")) {
    if (line.startsWith("##")) {
      if (current_room !== "") {
        dialog_rooms[current_room] = room_text
      }
      current_room = line.replace(/^##(\s+)?/, "")
      room_text = ""
    } else if (line.startsWith("#")) {
      dialog_script = line.replace(/^#(\s+)?/, "")
    } else {
      room_text += line + "\n"
    }
  }
  console.log("rooms")
  dialog_rooms[current_room] = room_text
}

function validvar(name) {
  return name.match(/^[\w\d\.\$]+$/)
}

function parse_room(room) {
  dialog_room = room
  let line_index = 0
  if (!(dialog_room in dialog_rooms)) {
    console.log(room, "isnt a real room???")
    return {text: "", options: []}
  }
  let lines = dialog_rooms[room].split("\n")
  let output = ""
  let options = []

  while (line_index < lines.length) {
    let line = lines[line_index]
    line_index++
    let invert = false
    switch (line[0]) {
      case ";":
        continue
      case "!":
        invert = true
      case "?":
        let [_, varname, rest] = line.match(/^[\?\!]([\w\d\.\$]+) (.*)$/)
        let condition
        if (invert) {
          condition = !dialog_variables[varname]
        } else {
          condition = !!dialog_variables[varname]
        }
        if (condition) {
          line = rest
        } else {
          continue
        }
        break
    }

    let setvar = false
    switch (line[0]) {
      case ";":
        continue
      case "+":
        setvar = true
      case "-":
        dialog_variables[line.slice(1)] = setvar
        break
      case ">":
        let jumproom = line.slice(1)
        dialog_room = jumproom
        if (!(dialog_room in dialog_rooms)) {
          console.log(room, "isnt a real room???")
          return {text: "", options: []}
        }
        line_index = 0
        lines = dialog_rooms[jumproom].split("\n")
        break
      case "[":
        let [_, dest, text] = line.match(/^\[(.+)\] (.+)$/)
        options.push({text, dest})
        break
      case "%":
        let [__, func, args] = line.match(/^%([\w\d]+) (.*)/)
        console.log("func", func)
        if (func in dialog_functions) {
          dialog_functions[func](args, dialog_script)
        }
        break
      case "\\":
        line = line.slice(1)
      default:
        output += line + "\n"
    }
  }

  console.log(output)
  console.log(options)
  return {text: output, options}
}
