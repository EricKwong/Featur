var express = require('express'),
    request = require('request');

var app = express();




// Search Spotify API for artist name
app.get('/search_artists', function (req, res) {
  req.query.type = 'artist';
  request({
    uri: 'https://api.spotify.com/v1/search',
    method: 'GET',
    qs: req.query,
    json: true
  },
    function (error, response, body) {
      
// artists.items[i].id
// artists.items[i].images[1].url   -->  640 x 640 
// artists.items[i].name
     
      var searchResults = body['artists'].items;
      console.log(searchResults);
      var artistsInfo = {};
       
      for (var i = 0; i < searchResults.length; i++) {
        artistsInfo[i].name    = searchResults[i].name;
        artistsInfo[i].id      = searchResults[i].id;
        artistsInfo[i].img_url = searchResults[i].images[1].url;
      }

      res.send( artistsInfo );
    });
});

//Search Spotify API for artist by ID

app.get('/get_artist_by_id/:id', function (req, res) {
  request({
    uri: 'https://api.spotify.com/v1/artists' + req.params.id,
    method: 'GET',
  }, 
    function (error, response, body) {
      var 
      res.send( body )
    })
}


app.listen(3000, function () {console.log('yolo')});