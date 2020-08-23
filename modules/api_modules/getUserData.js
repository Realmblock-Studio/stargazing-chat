
function enableApi() {
  global.app.get("/user", function (req,res) {
    res.send("test.")
  }) 
}

module.exports = {enabled: false, f: enableApi};