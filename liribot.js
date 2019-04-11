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

let doWhatItSays = () => {
  fs.readFile("./random.txt", "utf8", function(error, data) {
    if (error) {
      console.log(error);
    } else {
      fileLines = data.split("\n");

      fileLines.forEach(line => {
        let fileCommand = line.split(",")[0];
        let fileSearchString = line
          .split(",")[1]
          .replace("\r", "")
          .replace("\n", "");
        performUserCommand(fileCommand, fileSearchString);
      });
    }
  });
};

let getBandsInTown = inputSearchString => {
  if (!inputSearchString) {
    inputSearchString = "Hootie and the blowfish";
  }

  let queryString = `https://rest.bandsintown.com/artists/${inputSearchString}/events?app_id=codingbootcamp`;

  axios
    .get(queryString)
    .then(function(response) {
      console.log("\n");
      console.log("---------------------------------------------------------");
      console.log("Event Details");
      console.log("---------------------------------------------------------");
      response.data.forEach(event => {
        console.log(`Name: ${event.venue.name}`);
        console.log(`Location: ${event.venue.city}, ${event.venue.country}`);
        let eventDate = moment(event.datetime).format("MM/DD/YYYY");
        console.log(`Date: ${eventDate}`);
        console.log(`More Info: ${event.url}`);
        console.log(`-------------------------------------------------------`);
      });
    })
    .catch(function(error) {
      console.log(`Error occurred: ${error}`);
    });
};

let getSpotifyDetails = inputSearchString => {
  if (!inputSearchString) {
    inputSearchString = "The Sign";
  }

  spotify.search({ type: "track", query: inputSearchString, limit: 5 }, function(error, response) {
    if (error) {
      return console.log(`Error occurred: ${error}`);
    }

    console.log("\n");
    console.log("---------------------------------------------------------");
    console.log("Song Details");
    console.log("---------------------------------------------------------");

    response.tracks.items.forEach(song => {
      let artistNames = [];
      console.log(`Song: ${song.name}`);
      console.log(`Album: ${song.album.name}`);

      song.artists.forEach(artist => {
        artistNames.push(artist.name);
      });

      console.log(`Artists: ${artistNames}`);
      console.log(`Preview: ${song.preview_url}`);
      console.log("-------------------------------------------------------");
    });
  });
};

let getMovieDetails = inputSearchString => {
  if (!inputSearchString) {
    inputSearchString = "Mr. Nobody";
  }

  let queryString = `https://www.omdbapi.com/?t=${inputSearchString}&y=&plot=short&apikey=trilogy`;

  axios
    .get(queryString)
    .then(function(response) {
      console.log("\n");
      console.log("---------------------------------------------------------");
      console.log("Movie Details");
      console.log("---------------------------------------------------------");
      console.log(`Title: ${response.data.Title}`);
      console.log(`Year Released: ${response.data.Year}`);

      let imdbRating = response.data.Ratings.filter(rating => {
        return rating.Source === "Internet Movie Database";
      });

      console.log(`IMDB Rating: ${imdbRating[0].Value}`);

      let rtRating = response.data.Ratings.filter(rating => {
        return rating.Source === "Rotten Tomatoes";
      });

      console.log(`RT Rating: ${rtRating[0].Value}`);
      console.log(`Country: ${response.data.Country}`);
      console.log(`Language: ${response.data.Language}`);
      console.log(`Actors: ${response.data.Actors}`);
      console.log(`Plot: ${response.data.Plot}`);
      console.log("-------------------------------------------------------");
    })
    .catch(function(error) {
      console.log(`Error occurred: ${error}`);
    });
};

let performUserCommand = (inputCommand, inputSearchString) => {
  switch (inputCommand) {
    case "concert-this":
      getBandsInTown(inputSearchString);
      break;
    case "spotify-this-song":
      getSpotifyDetails(inputSearchString);
      break;
    case "movie-this":
      getMovieDetails(inputSearchString);
      break;
    case "do-what-it-says":
      doWhatItSays();
      break;
    default:
      console.log("What do you want me do? concert-this, spotify-this-song or movie-this?");
  }
};

performUserCommand(inputCommand, inputSearchString);
