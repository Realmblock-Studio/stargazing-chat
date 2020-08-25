function alphanumeric(text) { 
  var letters = /^[0-9a-zA-Z]+$/;
  if (letters.test(text)) {
    return true;
  }
	return false;
}

String.random = function (length) {
	let radom13chars = function () {
		return Math.random().toString(16).substring(2, 15)
	}
	let loops = Math.ceil(length / 13)
	return new Array(loops).fill(radom13chars).reduce((string, func) => {
		return string + func()
	}, '').substring(0, length)
}

function createAccount() {
  global.app.post("/signup", function (req,res) {
		if(!req.body){
			res.send("i have no idea how this occured.");
			return;
		}

		var username = req.body.username
		var tag = req.body.tag
		var password = req.body.password
		password = global.AES.decrypt(password, tag+username).toString(global.CryptoJS.enc.Utf8);

		if (!username || !tag || !password){
			res.send(`{"result": 0, "message": "Missing one of the following fields: Username, Password, or Tag."}`)
			return;
		}

		if(username.length < 2){
			res.send(`{"result": 0, "message": "Username must be at least 2 characters."}`)
			return;
		}

		if(username.length > 30){
			res.send(`{"result": 0, "message": "Username must be at max 20 characters."}`)
			return;
		}

		if(tag.length != 4){
			res.send(`{"result": 0, "message": "Tag must be 4 characters."}`)
			return;
		}

		if(tag.toString() === "0000"){
			res.send(`{"result": 0, "message": "This tag is reserved to staff."}`)
			return;
		}

		if (!alphanumeric(username) || !alphanumeric(tag)){
			res.send(`{"result": 0, "message": "Please ensure your username and tag do not use invalid characters."}`)
			return;
		}

    var uId = Math.floor(Math.random() * 9999999999999999)

      global.client.db("chat").collection("users").findOne({username: username, tag: tag},(err, dbres)=>{
        if (err) throw err;
          
        if (dbres){
          res.send(`{"result": 0, "message": "This Username and Tag combination is taken."}`)
        } else {
          var token = String.random(50);
          global.client.db("chat").collection("users").insertOne({
            uId: uId,
            username: username,
            tag: tag,
            password: global.CryptoJS.HmacSHA256(password, process.env.hashCode).toString(),
            creationTime: Date.now(),
            creationIp: global.requestIp.getClientIp(req),
            token: token
          },(err, dbres)=>{
            if (err) throw err;
            res.send(`{"result": 1, "message": "Account Created Successfully.", "token": "${token}"}`);
          })
            
        }
      })
  }) 
}

module.exports = {enabled: true, f: createAccount};