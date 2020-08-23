
var enabledApis = [
  "./api_modules/connection.js",
  "./api_modules/testapi.js",
  "./api_modules/getUserData.js"
]


function start() {
  for (i = 0; i < enabledApis.length; i++) {
    console.log(`Starting ${enabledApis[i]}`)
    require(enabledApis[i])();
  }
}

module.exports = start;