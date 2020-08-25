function getServersUserIsIn(userId, callback) {
	console.log(userId);
  global.client.db("chat").collection("servers").find({members:{$all: [userId]}},(err, result)=>{
		result.toArray().then(result=>{ // i've never written such sketchy code lol

			for (var i=0;i<result.length;i++){
				result[i].members = result[i].members.length;
				result[i].messages = null;
				result[i]._id = null;
				console.log(result[i].members)
			}
			
			callback(result);
		});
	});
}

module.exports = getServersUserIsIn;