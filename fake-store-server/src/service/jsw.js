const jwt = require("jsonwebtoken");

const util = require("util");

const secretKey = "fake-store-key";

const tokenVerify = util.promisify(jwt.verify.bind(jwt));
const generateToken = (userID) => {
  return jwt.sign({ userID }, secretKey, { expiresIn: "1h" });
};

const verifyToken = async (token) => {
  try {
    const payload = await tokenVerify(token, secretKey);
    return { status: "OK", userID: payload.userID };
  } catch (err) {
    // console.error(err);
    return { status: "error", message: "Wrong token." };
  }
};

// const testToken = generateToken(10);
// console.log("testToken:", testToken);
// verifyToken(testToken);
module.exports = { verifyToken, generateToken };
