  var characters = `1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890`
  
function randomString(length) {
  var str = ""

  for (i = 0; i < length; i++) {
    str = str + characters[Math.floor(Math.random() * characters.length)]
  }

  return str
}

var obfuscatedSettings = {
    compact: true,
    controlFlowFlattening: true,
    numbersToExpressions: true,
    simplify: true,
    shuffleStringArray: true,
    splitStrings: true,
    stringArrayEncoding: true,
    identifiersPrefix: 'changes'
}


function encrypt(directory){
  global.app.get(directory, function(req, res) {
      global.fs.readFile(global.path.join(global.rootDir, directory.substring(0)), "utf8", function(err, data) {
          if (err) {
              res.sendStatus(404);
          } else {
              var randomNumber = Math.floor(Math.random() * 10) + 15

              obfuscatedSettings.identifiersPrefix = `imanengineer${randomString(randomNumber)}mywaifuisdigital`
              var obfuscated = global.jsObfuscate.obfuscate(data,obfuscatedSettings)._obfuscatedCode;
              res.send(obfuscated);
          }
      });
  });
}

//encryptFile("/core-js/index.js");

function encryptAll(){
	global.fs.readdir(global.path.join(global.rootDir, 'core-js'), (err, files) => {
		files.forEach(file => {
			console.log("\x1b[35m", file + " is now encrypted (づ￣ 3￣)づ")
			var path = '/' + global.path.join('core-js', file);
			encrypt(path);
		});
	});
}

module.exports = encryptAll;