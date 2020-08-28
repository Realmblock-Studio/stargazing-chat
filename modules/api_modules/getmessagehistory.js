/* 

    userData.username = result.username
    userData.uId = result.uId
    userData.avatar = null
    userData.creationTime = result.creationTime

*/

var messageLimit = 50

function startAPI() {
  global.app.get('/', function(req,res) {
    var token = req.body.token // remind me to add ETEE to tokens here.
    var directionId = req.body.directionId

    if (!token) {
      res.send(`{result:"Token required."}`)
      return;
    }

    if (!directionId) {
      res.send(`{result:"DirectionId required."}`)
      return;
    }

    require(`${global.rootDir}`)(token, null, (data) => {
      
      if (data) {

        if (!data.username || !data.uId /*|| !data.avatar*/ || !data.creationTime) {
          res.send(`{result:"There was a problem getting players data. [invalid token?]"}`); 
          return;
        }

        var userId = data.uId

        var inServer = require(`${global.rootDir}/modules/userServerVerification.js`)(userId, directionId);

        if (inServer) {

        } else {
          res.send(`{result:"${userId} must be in the server to get message history."}`)
        }

      }

    });
  })
}

module.exports = {enabled: true, f: startAPI}