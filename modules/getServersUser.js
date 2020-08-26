function getServersUserIsIn(userId, callback) {
  global.client.db("chat").collection("servers").find({members:{$all: [userId]}},(err, result)=>{
		result.toArray().then(result=>{ // i've never written such sketchy code lol
			console.log(result);
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