// window.onload = setup;

// const fs = require("fs");

// function setup() {
//   document.getElementById("exportBtn").attachEvent("click", () => {
//     // const content = "Hello!";
//     // fs.writeFile("./docs/testText.txt", content, (err) => {
//     //   if (err) {
//     //     console.log(err);
//     //   }
//     // });
//     alert("Exported data to CSV file");
//   });
// }

function exportToCsv() {
  const btn = document.getElementById("exportBtn")
  btn.style.color = "red"
}
