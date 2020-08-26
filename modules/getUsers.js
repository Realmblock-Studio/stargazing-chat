function getUsers(ignoreToken, callback) {
  global.client.db("chat").collection("users").find({},(err, result)=>{
		result.toArray().then(result=>{ // i've never written such sketchy code lol
			var res = []
			for (var i=0;i<result.length;i++){
				var newdata = {
					uId: 0,
					username: "",
					tag: ""
				}
				newdata.uId = result[i].uId;
				newdata.username = result[i].username;
				newdata.tag = result[i].tag;
				if (result[i].token === ignoreToken){
				} else {
					res.push(newdata);
				}
			}
			callback(res);
		});
	});
}

module.exports = getUsers;