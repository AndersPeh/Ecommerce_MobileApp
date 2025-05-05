const fs = require("fs");

const fileName = "./fakeStoreData.json";

let store = {};

(async () => {
  fs.readFile(fileName, "utf8", (err, str) => {
    if (err) {
      console.error(err);
      return;
    }
    store = JSON.parse(str);
    console.log("Successfully read fake store data");
  });
})();

const getFakeStoreData = (path) => {
  return store[path];
};
module.exports = { getFakeStoreData };
