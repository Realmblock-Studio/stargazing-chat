
function enableApi() {
  global.app.get("/testApi", function (req,res) {
    res.send("you're mom") // your*, idiot.
    // thats the fucking joke retard
  }) 
}

module.exports = {enabled: false, f: enableApi};