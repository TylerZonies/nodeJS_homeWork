require("dotenv").config();
var Twitter = require("twitter");
var request = require("request");
var Spotify = require("node-spotify-api");
const path = require('path');
const fs = require('fs');
var keys = require("./keys");
var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);
var command = process.argv[2];
var term = () => {
    var word = [];
    for(var i = 3; i < process.argv.length; i++){
        word.push(process.argv[i]);
    }
    word = word.join(" ")
    return word;
}

function twitterCall(){
    client.get('statuses/user_timeline', {screen_name: "bootcampTbone"}, function(error, tweet, response) {
        if(error) return console.log(error);
        for(var i = 0; i < tweet.length; i++){
            console.log(tweet[i].text);
        }
      });
}
function spotifyCall(search){
    if(!search){
        search = "ocean avenue";
    }
    spotify.search({type: 'track', query: search}).then(response => {
        var songData = [
            "Artist: " + response.tracks.items[0].artists[0].name,
            "Song: " + response.tracks.items[0].name,
            "URL: " + response.tracks.items[0].href,
            "Album: " + response.tracks.items[0].album.name
        ].join(" \n\n")
        console.log(songData);
    })
}
function movieCall(movie){
    if(!movie){
        var movie = 'the holy mountain'
    }
    const query = `http://www.omdbapi.com/?apikey=trilogy&t=${movie}`
    request.get(query, (e, res, body) => {
        if(e) throw e;
        const data = JSON.parse(body);
        if(data.Response != 'False'){

            const movieData = [
                `Title: ${data.Title}`,
                `Year: ${data.Year}`,
                `IMDB Rating: ${data.Ratings[0].value}`,
                `Rotten Tomatoes Rating: ${data.Ratings[1].value}`,
                `Language: ${data.Language}`,
                `Plot: ${data.Plot}`,
                `Actors: ${data.Actors}`,
                `Director: ${data.Director}`
            ].join('\n\n');
            console.log(movieData)
        }else{
            console.log(`Could not find movie: ${movie}`);
        }
    })
}
function doWhatItSaysCall(){
    fs.readFile(path.join(__dirname, './random.txt'), 'utf-8', (e, res) => {
        if(e) throw e;
        const data = res.split(' ')
        const order = data[0];
        let extr = () => {
            var word = [];
            for(var i = 1; i < data.length; i++){
                word.push(data[i]);
            }
            word = word.join(" ")
            return word;
        }
        makeCommand(order, extr);
    });
}
function makeCommand(order, extr){
    switch(order){
    case "spotify":
        spotifyCall(extr());
        break;
    case "twitter":
        twitterCall();
        break;
    case 'movie':
        movieCall(extr());
        break;
    case 'do-what-it-says':
        doWhatItSaysCall();
        break;
    default:
        console.log("Please enter valid command");
    }
}
makeCommand(command, term);