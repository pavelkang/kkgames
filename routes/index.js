/* GET home page. */
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
exports.game24 = function(req, res) {
	res.sendfile('views/24.html');
}
