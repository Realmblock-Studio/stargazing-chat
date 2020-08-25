// Chat messanger created by Hoofer#0001 [github.com/HooferDevelops] and Akkoza#8767 [github.com/AkkozaDevelops] o(*￣▽￣*)ブ

// Stargazer Studios [github.com/Stargazers-Studio]

// variables

const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const io = require("socket.io")(server);
const fs = require('fs');
const jsObfuscate = require('javascript-obfuscator');
const grawlix = require('grawlix');
const fetchUrl = require("fetch").fetchUrl;
const CryptoJS = require("crypto-js");
const AES = require("crypto-js/aes");
const SHA256 = require("crypto-js/sha256");
const requestIp = require('request-ip');
const request = require("request");
const isimage = require("is-image-url");
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.databaseusername}:${process.env.databasepassword}@cluster0.ezjee.mongodb.net/<dbname>?retryWrites=true&w=majority`;
const encryptFile = require(`${__dirname}/modules/encryptJSDirectory.js`);

grawlix.setDefaults({
  style: 'redacted',
  plugins: [
    {
      plugin: require('grawlix-racism'),
      options: {
        style: 'asterix'
      }
    }
  ]
});

const port = 3000;

// globals ψ(｀∇´)ψ

global.io = io;
global.app = app;
global.grawlix = grawlix;
global.socket = require("socket.io")();
global.fetchUrl = fetchUrl;
global.rootDir = __dirname;
global.fs = fs;
global.jsObfuscate = jsObfuscate;
global.encryptFile = encryptFile;
global.path = path;
global.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
global.AES = AES;
global.SHA256 = SHA256;
global.CryptoJS = CryptoJS;
global.requestIp = requestIp;
global.request = request;
global.isimage = isimage;

// encrypt files

encryptFile("/core-js/index.js");

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json())

require(`${__dirname}/modules/startAPIservices.js`)();

// error handler (prevents an error from crashing the entire-backend like it used to before (●'◡'●) )
process.on('uncaughtException', function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});





// technically we could make this automatically socket.on for each module name, but i can't be bothered to do so. (っ °Д °;)っ
io.on('connection', (socket) => {
  socket.on("messageRequest", (data)=>{
    console.log("getting message request")
    console.log(require(`${__dirname}/modules/msgVerification.js`)(data));
  });

  socket.on("getUserInfo", (data) => {
    // monkey
  })
	

	// TODO: convert into api_module instead, it would be better for that

	socket.on("getServers", (data)=>{
		var token = data.token;
		require(global.rootDir + "/modules/getUserData.js")(token, null, (userinfo)=>{
			var id = userinfo.uId;
			require(global.rootDir + "/modules/getServersUser.js")(id,(servers)=>{
				console.log(servers);
				socket.emit("updateServerList", servers);
			})
		})
	})



  socket.on("disconnectAll", (data) => {
    io.emit("disconnect")
  })
});


server.listen(port, function() {
	console.log("\x1b[33m", 'Server listening at port', port);
});

// mongodb

global.client.connect(err => {
	console.log("\x1b[33m", "MongoDB Connected");
  const collection = global.client.db("chat").collection("users");
});




console.log("\x1b[1m", "hi mom")