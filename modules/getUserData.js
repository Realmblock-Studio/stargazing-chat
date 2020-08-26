
function getUser(token, uId, callback) {
  
  var userData = {username: null, avatar: null, uId: null, creationTime: null}
  

  var searchTable = {}

  if (uId) { searchTable.uId = uId}
  if (token) { searchTable.token = token}

	if (!token && !uId){
		callback({});
		return;
	}

  global.client.db("chat").collection("users").findOne(searchTable, function(err, result) {
    if (err) throw err

    if (!result){
			callback({});
			return;
		}

    userData.username = result.username
    userData.uId = result.uId
    userData.avatar = null
    userData.creationTime = result.creationTime

    callback(userData)

  })

}

module.exports = getUser;