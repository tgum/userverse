let dialog = `
## Start
; this is some adventeure?
yeah im a guy im talking bla bla
\\???
[options] go to option tree
[setvar] set variable
[unsetvar] unset variable

## setvar
+var
>Start

## unsetvar
-var
>Start

## options
?var >skooky
!var >next

## next
hiya
[Start] go bak

## skooky
skooky
[Start] go bak
`

let variables = {}

let rooms = {}
let current_room = "Start"

function parse_rooms(dialog) {
  rooms = {}
  let current_room = ""
  let room_text = ""
  for (let line of dialog.split("\n")) {
    if (line.startsWith("##")) {
      if (current_room !== "") {
        rooms[current_room] = room_text
      }
      current_room = line.replace(/^##(\s+)?/, "")
      room_text = ""
    } else {
      room_text += line + "\n"
    }
  }
  console.log("rooms")
  rooms[current_room] = room_text
}

function validvar(name) {
  return name.match(/^[\w\d\.\$]+$/)
}

function parse_room(room) {
  let line_index = 0
  let lines = room.split("\n")
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
          condition = !variables[varname]
        } else {
          condition = !!variables[varname]
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
        variables[line.slice(1)] = setvar
        break
      case ">":
        let jumproom = line.slice(1)
        current_room = jumproom
        line_index = 0
        lines = rooms[current_room].split("\n")
        break
      case "[":
        let [_, dest, text] = line.match(/^\[(.+)\] (.+)$/)
        options.push({text, dest})
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

parse_rooms(dialog)
