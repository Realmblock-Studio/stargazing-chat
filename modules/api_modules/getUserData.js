
function enableApi() {
  global.app.get("/user", function (req,res) {
    res.send(JSON.stringify(req))
  }) 
}

module.exports = enableApi