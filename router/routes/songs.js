var express    = require('express'),
	  router     = express.Router(),
	  logger     = require('morgan'),
	  bodyParser = require('body-parser'),
	  models     = require('../../models');

var Song = models.songs;

router.use(logger('dev'));
router.use(bodyParser());

router.get('/', function (req, res) {
	Song
		.findAll()
		.then(function(songs) {
			res.send(songs);
		});
});

router.post('/', function (req, res) {
	Song
		.findOrCreate({where: req.body})
		.then(function(song) {
			res.send(song);
		});
});

module.exports = router;