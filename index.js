// Guitar Hero Controller with xboxdrv
// Author: Calcaware

//var ks = require('node-key-sender');
var spawn = require('child_process').spawn;
const { exec } = require("child_process");
var cmd  = spawn('sudo', ['xboxdrv']);


cmd.stdout.on('data', async function(data) {

  let info = data.toString();
  if (info.indexOf("X1:") === -1) {
    return;
  }

  while (info.indexOf("  ") !== -1) {
    info = info.replace(/  /g, " ");
  }
     // Bools
  let a = Boolean(parseInt(info.split("A:")[1].split(",")[0]));
  let b = Boolean(parseInt(info.split("B:")[1].split(",")[0]));
  let y = Boolean(parseInt(info.split("X:")[1].split(",")[0]));
  let x = Boolean(parseInt(info.split("Y:")[1].split(",")[0]));

  let tl = Boolean(parseInt(info.split("TL:")[1].split(",")[0]));
  let tr = Boolean(parseInt(info.split("TR:")[1].split(",")[0]));

  let lb = Boolean(parseInt(info.split("LB:")[1].split(",")[0])); // Modifier for a,b,x,y
  let rb = Boolean(parseInt(info.split("RB:")[1].split(",")[0]));

  let du = Boolean(parseInt(info.split("du:")[1].split(",")[0]));
  let dd = Boolean(parseInt(info.split("dd:")[1].split(",")[0]));
  let dl = Boolean(parseInt(info.split("dl:")[1].split(",")[0]));
  let dr = Boolean(parseInt(info.split("dr:")[1].split(",")[0]));

  let back = Boolean(parseInt(info.split("back:")[1].split(",")[0]));
  let start = Boolean(parseInt(info.split("start:")[1].split(",")[0]));
  let guide = Boolean(parseInt(info.split("guide:")[1].split(",")[0]));

  // Int
  let x1 = parseInt(info.split("X1:")[1].split(",")[0]); // Unused?
  let x2 = parseInt(info.split("X2:")[1].split(",")[0]); // Whammy Bar ~ -32k - 32k

  let lt = parseInt(info.split("LT:")[1].split(",")[0]);
  let rt = parseInt(info.split("RT:")[1].split(",")[0]); // Unused?

    //  ================================================
    //  |A|B|Y|X|LB|         |TL:A|TL:B|TL:Y|TL:X|TL:LB|
    //  ================================================

    let state = -1;
    if (lt == 229)
      state = 0;
    else if (lt == 178)
      state = 1;
    else if (lt == 127)
      state = 2;
    else if (lt == 76)
      state = 3;
    else if (lt == 25)
      state = 4;

    let button = -1;
    if (a&!tl)
      button = 0;
    else if (b&!tl)
      button = 1;
    else if (x&!tl)
      button = 2;
    else if (y&!tl)
      button = 3;
    else if (lb&!tl)
      button = 4;
    else if (a*tl)
      button = 5;
    else if (b*tl)
      button = 6;
    else if (x*tl)
      button = 7;
    else if (y*tl)
      button = 8;
    else if (lb*tl)
      button = 9;


    const layout = {
      "default": [
      [ "1", "2", "3", "4", "5", "6", "7", "8", "9", "0" ],
      [ "q", "w", "e", "r", "t", "y", "u", "i", "o", "p" ],
      [ "a", "s", "d", "f", "g", "h", "j", "k", "l", ";" ],
      [ "z", "x", "c", "v", "b", "n", "m", ",", ".", "/" ],
      [ "ISO_Left_Tab", "`", "~", "backslash", "Menu", "-", "=", "[", "]", "'" ]
      ],
      "shift": [ // Strum Up
      [ "!", "@", "#", "$", "%", "^", "&", "*", "(", ")" ],
      [ "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P" ],
      [ "A", "S", "D", "F", "G", "H", "J", "K", "L", ":" ],
      [ "Z", "X", "C", "V", "B", "N", "M", "<", ">", "?" ],
      [ "Control_L", "Meta_L", "Alt_L", "function", "Menu", "_", "+", "{", "}", "\"" ]
      ]
    };

   // Comment
       

    if (button != -1) {
      if (du) {
        //ks.sendKey(layout.shift[state][button]);
        if (layout.shift[state][button].length == 1)
          await exec(`xdotool type "${layout.shift[state][button]}"`);
        else
          await exec(`xdotool key "${layout.shift[state][button]}"`);
      }
      else {
        //ks.sendKey(layout.default[state][button]);
        if (layout.shift[state][button].length == 1)
          await exec(`xdotool type "${layout.default[state][button]}"`);
        else
          await exec(`xdotool key "${layout.default[state][button]}"`);
      }
    }
    else {
      if (dd) {
        await exec(`xdotool type " "`);
      }
      else if (back) {
        await exec(`xdotool key BackSpace`);
      }
      
      if (du && back) {
        await exec(`xdotool key Escape`);
      }

      if (start) {
        await exec(`xdotool key Return`);
      }

    }

  });

cmd.on('exit', function(code) {
  console.log('exit code: ' + code);
});


cmd.stderr.on('data', function(data) {
  console.log('stderr: ' + data);
});
