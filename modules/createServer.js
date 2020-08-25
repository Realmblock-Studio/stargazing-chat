
function createServer(info) {

  if (!info) return "Information packet was null. ╰（‵□′）╯";
  
  if (!info.servername) return "Information packet was sent w/o server name.";
  if (!info.creator) return "Information packet was sent w/o server owner.";
  // swapped this one to null because !boolean would turn false to true.
  if (info.inviteOnly == null) info.inviteOnly = false;
	if (!info.serverIcon) info.serverIcon = "";

  var directionId = Math.floor(Math.random() * 9999999999999999)

  global.client.db("chat").collection("servers").insertOne({
      directionId: directionId,
      serverInfo: {
        serverName: info.servername.toString(),
        serverOwner: info.creator,
				serverIcon: "",
        inviteOnly: info.inviteOnly
      },
      messages: [],
      members: []
    },(err, res)=>{
      if (err) throw err;
  })          
}

module.exports = createServer;