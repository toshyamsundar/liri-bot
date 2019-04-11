require("dotenv").config();
const keys = require("./keys");
const fs = require("fs");
const axios = require("axios");
const moment = require("moment");
const Spotify = require("node-spotify-api");

let inputArguments = process.argv.slice(2);
let inputCommand = inputArguments[0];
let inputSearchString = inputArguments.splice(1).join(" ");
let fileLines = [];

let spotify = new Spotify(keys.spotify);

fs.readFile("./random.txt", "utf8", function(error, data) {
  if (error) {
    console.log(error);
  } else {
    fileLines = data.split(",");

    // fileLines.forEach(line => {
    //   console.log(line);
    // });
  }
});

let getBandsInTown = inputSearchString => {
  let queryString = `https://rest.bandsintown.com/artists/${inputSearchString}/events?app_id=codingbootcamp`;

  axios
    .get(queryString)
    .then(function(response) {
      response.data.forEach(event => {
        console.log(`Name: ${event.venue.name}`);
        console.log(`Location: ${event.venue.city}, ${event.venue.country}`);
        let eventDate = moment(event.datetime).format("MM/DD/YYYY");
        console.log(`Date: ${eventDate}`);
        console.log(`More Info: ${event.url}`);
        console.log(`-------------------------------------------------------`);
      });
    })
    .catch(function(err) {
      console.log(`Error: ${err}`);
    });
};

let getSpotifyDetails = inputSearchString => {
  spotify.search({ type: "track", query: inputSearchString, limit: 5 }, function(err, response) {
    if (err) {
      return console.log("Error occurred: " + err);
    }
    response.tracks.items.forEach(song => {
      let artistNames = [];
      console.log(`Song: ${song.name}`);
      console.log(`Album: ${song.album.name}`);
      song.artists.forEach(artist => {
        artistNames.push(artist.name);
      });
      console.log(`Artists: ${artistNames}`);
      console.log(`Preview: ${song.preview_url}`);
      console.log(`-------------------------------------------------------`);
    });
  });
};

switch (inputCommand) {
  case "concert-this":
    getBandsInTown(inputSearchString);
    break;
  case "spotify-this-song":
    getSpotifyDetails(inputSearchString);
    break;
  case "movie-this":
    console.log("OMDB API");
    break;
  case "do-what-it-says":
    console.log("Just something random");
    break;
  default:
    console.log("Nothing in here");
}
