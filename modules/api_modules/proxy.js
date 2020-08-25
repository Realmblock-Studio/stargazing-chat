// used to work but now magically doesn't ???
function proxy() {
  global.app.get('/proxy', function(req, res) {
    var url = req.query.i;

		if (!url)
			res.send("Invalid image");
			return;
			
		if (!isimage(url))
			res.send("Invalid URL")
			return;

    global.request.get(url).pipe(res);
	});
}

module.exports = {enabled: true, f: proxy};