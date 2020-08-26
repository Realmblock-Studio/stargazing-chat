var messageLimit = 50

function startAPI() {
  global.app.get('/messages', function(req,res) {
    var token = req.body.token

    if (!token) {
      res.send(`{result:"Token required."}`)
      return;
    }

    var data = require(`${global.rootDir}`)(token, null, (data) => {
      
    });
  })
}

module.exports = {enabled: true, f: startAPI}