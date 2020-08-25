function getServersUserIsIn(userId, callback) {
	console.log(userId);
  global.client.db("chat").collection("servers").find({members:{$all: [userId]}},(err, result)=>{
		result.toArray().then(result=>{ // i've never written such sketchy code lol
			console.log(result);

			// TODO: filter out uneeded info, that way it's not shown to the client.
			
			callback(result);
		});
	});
}

module.exports = getServersUserIsIn;