
/*var enabledApis = [
  "./api_modules/testapi.js",
  "./api_modules/getUserData.js"
]*/

var enabledApis = [] // all disabled atm while I figure it out loool

function start() {
  for (i = 0; i < enabledApis.length; i++) {
    console.log(`Starting ${enabledApis[i]}`)
    require(enabledApis[i])();
  }
}

module.exports = start;