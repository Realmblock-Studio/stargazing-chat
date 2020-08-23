
function checkConnection() { 
  global.app.get("/connection", function (req,res) {
    console.log(res.statusCode)
    if (res.statusCode == 403) {
      res.send("true")
    } else {
      res.send("false")
    }
  }) 
}

module.exports = {enabled: true, f: checkConnection};