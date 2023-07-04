window.onload = setup;

function setup() {
  /**
   * Add listener to add games
   */
  document
    .getElementById("exportBtn")
    .addEventListener("click", () => handlerExport());
}

async function handlerExport() {
  try {
    const path = document.location.href.replace("/db", "/api/db");
    const resp = await fetch(path, { method: "GET" });
    if (resp.status != 201) {
      const body = await resp.json();
      const csv = exportToCsv(body);
      download(csv);
      return;
    }
  } catch (err) {
    alert(err);
  }
}

function exportToCsv(content) {
  // Returns a csv from an array of objects with
  // values separated by tabs and rows separated by newlines

  // Use first element to choose the keys and the order
  var keys = Object.keys(content[0]);

  // Build header
  var result = keys.join(",") + "\n";

  // Add the rows
  content.forEach(function (obj) {
    result += keys.map((k) => obj[k]).join(",") + "\n";
  });

  return result;
}

const download = function (data) {
  // Creating a Blob for having a csv file format
  // and passing the data with type
  const blob = new Blob([data], { type: "text/csv" });

  // Creating an object for downloading url
  const url = window.URL.createObjectURL(blob);

  // Creating an anchor(a) tag of HTML
  const a = document.createElement("a");

  // Passing the blob downloading url
  a.setAttribute("href", url);

  // Setting the anchor tag attribute for downloading
  // and passing the download file name
  a.setAttribute("download", "download.csv");

  // Performing a download with click
  a.click();
};
