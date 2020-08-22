
function enableApi() {
  global.app.get("/testApi", function (req,res) {
    res.send("you're mom")
  }) 
}

module.exports = enableApi