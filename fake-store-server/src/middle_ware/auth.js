const { generateToken, verifyToken } = require("../service/jsw");

const auth = async (req, res, next) => {
  const authHeader = req.headers["authorization"]; // case insensitive
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN_VALUE
  const verifyResult = await verifyToken(token);
  if (verifyResult.status === "OK") {
    res.locals.userID = verifyResult.userID;
    return next();
  }
  res.json(verifyResult); // this is error result
};

const setToken = (req, res, next) => {
  const userID = res.locals.userID;
  if (!userID) return next();
  const token = generateToken(userID);
  res.locals.result = { ...res.locals.result, token };
  next();
};

module.exports = { setToken, auth };
