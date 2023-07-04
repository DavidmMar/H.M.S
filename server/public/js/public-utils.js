const fs = require("fs");

module.exports = {
  exportToCsv,
  writeCsvFile,
};

function exportToCsv(content) {
  // Returns a csv from an array of objects with
  // values separated by tabs and rows separated by newlines

  // Use first element to choose the keys and the order
  var keys = Object.keys(content[0]);

  // Build header
  var result = keys.join(",") + "\n";

  // Add the rows
  // content.forEach(function (obj) {
  //   result += keys.map((k) => obj[k]).join(",") + "\n";
  // });

  return result;
}

function writeCsvFile(content) {
  const fs = require("fs");
  fs.writeFile("../../docs/data.csv", content, (err) => {
    if (err) {
      console.log(err);
    }
  });
}
