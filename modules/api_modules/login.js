
function login() {
  global.app.get("/login", function(req,res) {
    res.send("Why are you trying to GET the login page llol `(*>﹏<*)′`")
  })

  global.app.post("/login", function(req,res) {
    if (!req.body) {
      res.send("big boi error")
      return
    }

		var username = req.body.username
		var tag = req.body.tag
		var password = req.body.password
		
		if (!username || !tag || !password){
			res.send(`{"result": 0, "message": "Missing one of the following fields: Username, Password, or Tag."}`)
			return;
		}

    password = global.AES.decrypt(password, tag+username).toString(global.CryptoJS.enc.Utf8); // end to end encryption.
    password = global.CryptoJS.HmacSHA256(password, process.env.hashCode).toString() // re-encrypt so it can be found in the database.
    var searchTable = {
			username: username,
			tag: tag,
      password: password
    }

    global.client.db("chat").collection("users").findOne(searchTable, function(err, result) {
      if (err) throw err

      if (result) {
				res.send(`{"result": 1, "message": "Logged in successfully.", "token": ""}`);
        console.log(result.username + "#" + result.tag)
      } else {
        res.send(`{"result": 0, "message": "Invalid password or username."}`)
        console.log("invalid")
        return;
      }

      
    })
  })
}

module.exports = {enabled: true, f: login};