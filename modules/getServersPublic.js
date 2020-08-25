function getServersUserIsIn(userId, callback) {
	console.log(userId);
  global.client.db("chat").collection("servers").find({"serverInfo.inviteOnly": false},(err, result)=>{
		result.toArray().then(result=>{
			console.log(result);

			// TODO: filter out uneeded info, that way it's not shown to the client.
			
			callback(result);
		});
	});
}

module.exports = getServersUserIsIn;