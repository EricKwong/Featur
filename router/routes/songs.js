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
		.create(req.body)
		.then(function(newSong) {
			res.send(newSong);
		});
});

module.exports = router;