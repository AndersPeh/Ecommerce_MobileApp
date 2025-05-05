var express = require("express");
var router = express.Router();
const { getFakeStoreData } = require("../db/fakeStoreData");

router.get("/*", (req, res, next) => {
  const path = req.params[0] ? "products/" + req.params[0] : "products";
  const data = getFakeStoreData(path) || { error: "nodata", path };

  res.json(data);
});

module.exports = router;
