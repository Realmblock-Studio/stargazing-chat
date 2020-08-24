
function createAccount() {
  global.app.post("/createAccount", function (req,res) {
		if(!req.body){
			res.send("i have no idea how this occured.");
			return;
		}

		var username = req.body.username
		var tag = req.body.tag
		var password = req.body.password

		if (!username || !tag || !password){
			res.send(`{"result": 0, "message": "Missing one of the following fields: Username, Password, or Tag."}`)
			return;
		}

		// TODO: Ensure all characters are ASCII
		// TODO: Make sure tag is limited to 4 characters
		// TODO: Make sure username is set to a character limit ( password as well, to prevent packet flooding ヽ（≧□≦）ノ )


		global.client.db("chat").collection("users").findOne({username: username, tag: tag},(err, dbres)=>{
			if (err) throw err;
			
			if (dbres){
				res.send(`{"result": 0, "message": "This Username and Tag combination is taken."}`)
			} else {
				global.client.db("chat").collection("users").insertOne({
					username: username,
					tag: tag,
					password: password // TODO: encrypt password via client AND server o(≧口≦)o
				},(err, dbres)=>{
					if (err) throw err;
					res.send(`{"result": 1, "message": "Account Created Successfully.", "token": ""}`);
				})
				
			}
		})

  }) 
}

module.exports = {enabled: true, f: createAccount};