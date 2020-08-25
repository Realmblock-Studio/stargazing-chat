
function start() {
	global.fs.readdir(global.path.join(global.rootDir, 'modules', 'api_modules'), (err, files) => {
		files.forEach(file => {
			var f = require(global.path.join(global.rootDir, 'modules', 'api_modules', file));
			if (f.enabled){ // shut up fa-
				console.log("\x1b[32m", `${file} is now enabled ♪(´▽｀)`);
				f.f();
			} else {
				console.log("\x1b[31m", `${file} is now disabled ≧ ﹏ ≦`);
			}
		});
	});
}

module.exports = start;