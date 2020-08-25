function userinfo() {
  global.app.get("/userinfo", function(req,res) {
    if (!req.body) {
      res.send("uh oh?")
      return
    }

		var token = req.body.token

		if (!token){
			res.send(`{"result": 0, "data": "No token provided."}`)
			return;
		}

    require(global.rootDir + "/modules/getUserData.js")(token,(data) => {
      if (data) {
        if (!data.error) {
          res.send(`{"result": 1, "message": "Successfully gathered user info.", "data": ${JSON.stringify(data)}}`)
        } else {
          res.send(`{"result": 404, "message": "There was an error with server module. [ERROR CODE: ${JSON.stringify(data.error)}]"}`)
        }
      } else {
        
      }
    });
  })
}

module.exports = {enabled: true, f: userinfo};