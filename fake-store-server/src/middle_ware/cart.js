const { updateCart, getCart } = require("../db/index");

const getCartMiddleware = async (req, res, next) => {
  const userID = res.locals.userID;
  const result = await getCart({ uid: userID });
  res.locals.result = result;
  next();
};

const updateCartMiddleware = async (req, res, next) => {
  const userID = res.locals.userID;
  const { items } = req.body;
  const result = await updateCart({ uid: userID, items });
  res.locals.result = result;
  next();
};

module.exports = {
  getCartMiddleware,
  updateCartMiddleware,
};
