// DOES NOT SHOW SERVERS THAT USER IS NOT IN
function getServers() {
  global.app.post('/getservers', function(req, res) {
		var token = req.body.token;
		if (!token){
			res.send("[]");
			return;
		}
		require(global.rootDir + "/modules/getUserData.js")(token, null, (userinfo)=>{
			var id = userinfo.uId;
			require(global.rootDir + "/modules/getServersUser.js")(id,(servers)=>{
				res.send(JSON.stringify(servers));
			})
		})
	});
}

module.exports = {enabled: true, f: getServers};