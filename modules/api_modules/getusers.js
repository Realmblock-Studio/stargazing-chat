function getUsers() {
  global.app.post('/getusers', function(req, res) {
		var token = req.body.token;
		if (!token){
			res.send("[]");
			return;
		}
		require(global.rootDir + "/modules/getUsers.js")(token,(users)=>{
			res.send(JSON.stringify(users))
		})
	});
}

module.exports = {enabled: true, f: getUsers};