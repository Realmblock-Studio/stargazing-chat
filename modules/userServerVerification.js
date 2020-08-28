
function verifyInServer(userId, directionId, callback) {
  if (!directionId || !userId) callback(false); return

  global.client.db("chat").collection("servers").findOne({direcitonId: directionId},(err, result)=>{

    if (!result) callback(false); return

    if (!result.members) callback(false); return

    if (result.members.indexOf(userId) != -1) {
      callback(true); return
    } else {
      callback(false); return
    }

  })
}

module.exports = verifyInServer;