require("dotenv").config();
var keys = require("./keys");
var fs = require("fs");

fs.readFile("./random.txt", "utf8", function(error, data) {
  if (error) {
    console.log(error);
  } else {
    var lineArr = data.split(",");

    lineArr.forEach(element => {
      console.log(element);
    });
  }
});
