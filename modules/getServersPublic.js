function getServersUserIsIn(userId, callback) {
  global.client.db("chat").collection("servers").find({"serverInfo.inviteOnly": false},(err, result)=>{
		result.toArray().then(result=>{
			for (var i=0;i<result.length;i++){
				result[i].members = result[i].members.length;
				result[i].messages = null;
				result[i]._id = null;
			}
			callback(result);
		});
	});
}

module.exports = getServersUserIsIn;