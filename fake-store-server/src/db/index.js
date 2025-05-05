const sql = require("sqlite3").verbose();
const util = require("util");
const fileName = "./fake-store.sqlite3";

const createDataBase = (fname) => {
  return new sql.Database(fname, sql.OPEN_READWRITE | sql.OPEN_CREATE, (err) =>
    err
      ? console.error(err.message)
      : console.log(`Connected to database through ${fname}`)
  );
};

const db = createDataBase(fileName);

const dbRun = (query, paras = []) => {
  return new Promise((res, rej) => {
    db.run(query, paras, function (err) {
      // can't use array function here.
      if (err) rej(err);
      else res({ lastID: this.lastID, changes: this.changes });
    });
  });
};

const dbAll = util.promisify(db.all.bind(db));
const dbGet = util.promisify(db.get.bind(db));
const dbClose = util.promisify(db.close.bind(db));
const dbTest = async () => {
  const createTable = `create table if not exists test (id integer primary key autoincrement,name text not null)`;
  const insertRecord = `insert into test (name) values (?)`;
  const updateRecord = `update test set name = $name where id = $id`;
  const selectAll = `select * from test`;
  const seletcOne = `select * from test where id = $id`;
  const deleteAll = `delete from test`;
  try {
    const createRes = await dbRun(createTable);
    console.log("createRes", createRes);
    const insertRes = await dbRun(insertRecord, ["testName"]);
    console.log("insertRes:", insertRes);
    const allRes = await dbAll(selectAll);
    console.table(allRes);
    const myId = insertRes.lastID;
    const updateRes = await dbRun(updateRecord, {
      $id: myId,
      $name: "new name",
    });
    console.log("updateRes:", updateRes);
    console.table(await dbAll(selectAll));
    console.log(await dbGet(seletcOne, { $id: myId }));
    console.log(await dbRun(deleteAll));
    await dbClose();
  } catch (e) {
    console.error(e);
  }
};

const createUsersTable = async () => {
  const createTableSql = `create table if not exists users 
  (id integer primary key autoincrement,
    name text not null,
    email text not null unique,
    password text not null)`;
  try {
    await dbRun(createTableSql);
    return true;
  } catch (e) {
    console.error(`Error in createUserTable: ${e}.`);
    return false;
  }
};

const createOrdersTable = async () => {
  // total price in cents
  const createTableSql = `
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uid INTEGER NOT NULL,
    item_numbers INTEGER NOT NULL,
    is_paid INTEGER NOT NULL CHECK (is_paid IN (0, 1)),
    is_delivered INTEGER NOT NULL CHECK (is_delivered IN (0, 1)),
    total_price INTEGER NOT NULL,
    order_items TEXT NOT NULL
  )`;

  try {
    await dbRun(createTableSql);
    return true;
  } catch (e) {
    console.error(`Error in createUsersTable: ${e}.`);
    return false;
  }
};

const createShoppingCartTable = async () => {
  // total price in cents
  const createTableSql = `
  CREATE TABLE IF NOT EXISTS cart (
    uid INTEGER UNIQUE NOT NULL,
    cart_items TEXT NOT NULL
  )`;

  try {
    await dbRun(createTableSql);
    return true;
  } catch (e) {
    console.error(`Error in createShoppingCartTable: ${e}.`);
    return false;
  }
};

(async () => {
  try {
    await createUsersTable();
    await createOrdersTable();
    await createShoppingCartTable();
  } catch (e) {
    console.error("Failed to init Tables: ", e);
  }
})();

const checkEmailTaken = async (email) => {
  const query = "select * from users where email = $email";
  try {
    const result = await dbGet(query, { $email: email });
    if (!result) return { status: "OK" };
    return { status: "error", message: "The email is already used." };
  } catch (e) {
    console.error(`Error in checkEmailTaken: ${e}`);
    return { status: "error", message: e.message };
  }
};

// this function is used for sign up a user.
// the validation is by middleware
const createUser = async ({ name, email, password }) => {
  const insertUserSql = `insert into users (name,email,password) 
        values (?,?,?)`;

  try {
    const checkEmailResult = await checkEmailTaken(email);
    if (checkEmailResult.status === "error") return checkEmailResult;
    const res = await dbRun(insertUserSql, [name, email, password]);
    return { status: "OK", id: res.lastID, name, email };
  } catch (e) {
    console.error(`Error in createUser: ${e}.`);
    return { status: "error", message: "Failed to insert users into table!" };
  }
};
// used for login a user
const checkUser = async ({ email, password }) => {
  const query = `select * from users where email=$email and password = $password`;
  try {
    const res = await dbGet(query, { $email: email, $password: password });
    if (!res) return { status: "error", message: "Wrong email or password." };

    const id = res.id;
    return { status: "OK", id, name: res.name, email };
  } catch (e) {
    console.error(`Error in loginUser: ${e}.`);
    return { status: "error", message: "Failed to login user!" };
  }
};

// update user name and password
const updateUser = async ({ userID, name, password }) => {
  const query = `update users set name = $name, password = $password where id = $id`;
  if (!name || !password)
    return {
      status: "error",
      message: "New Name and Password can't be empty.",
    };
  try {
// the query: update users set name = $name, password = $password where id = $id
// updates the password with new password from UserProfile screen.
    await dbRun(query, { $name: name, $password: password, $id: userID });
    return {
      status: "OK",
      name,
      message: "User name and password update successfully.",
    };
  } catch (e) {
    console.error(`Error in updateUser: ${e}.`);
    return { status: "error", message: "Failed to update user!" };
  }
};

const deleteUser = async (email) => {
  const query = `delete from users where email = $email`;
  try {
    const res = await dbRun(query, { $email: email });
    return { status: "OK", users: res }; // don't check if deleted or not
  } catch (e) {
    console.error(`Error in deleteUser: ${e}.`);
    return { status: "error", message: "Failed to delete user!" };
  }
};

// this is a test purpose function.
const getAllUsers = async () => {
  const query = `select * from users`;
  try {
    const res = await dbAll(query);
    return { status: "OK", users: res };
  } catch (e) {
    console.error(`Error in getAllUsers: ${e}.`);
    return { status: "error", message: "Failed to get all users!" };
  }
};

const getAllOrders = async () => {
  const query = `select * from orders`;
  try {
    const res = await dbAll(query);
    return { status: "OK", orders: res };
  } catch (e) {
    console.error(`Error in getAllOrders: ${e}.`);
    return { status: "error", message: "Failed to get all orders!" };
  }
};

const getOrdersByUser = async ({ userID }) => {
  const query = `select * from orders where uid = $userID`;
  try {
    const res = await dbAll(query, { $userID: userID });
    return { status: "OK", orders: res };
  } catch (e) {
    console.error(`Error in getOrdersByUser: ${e}.`);
    return { status: "error", message: "Failed to get orders by user!" };
  }
};

//  uid INTEGER NOT NULL,
//     item_numbers INTEGER NOT NULL,
//     is_paid INTEGER NOT NULL CHECK (is_paid IN (0, 1)),
//     is_delivered INTEGER NOT NULL CHECK (is_delivered IN (0, 1)),
//     total_price INTEGER NOT NULL,
//     order_items T

// items is an array of object of this format
// {pid,quantity,price}
const createOrder = async ({ userID, items }) => {
  const [itemNumber, totalPrice] = items.reduce(
    (ret, itm) => [
      ret[0] + itm.quantity,
      ret[1] + Math.round(itm.quantity * itm.price * 100),
    ],
    [0, 0]
  );
  const orderItems = JSON.stringify(items);
  const insertOrderSql = `insert into orders (uid,item_numbers,total_price,order_items,is_paid,is_delivered) 
        values (?,?,?,?,?,?)`;
  try {
    const res = await dbRun(insertOrderSql, [
      userID,
      itemNumber,
      totalPrice,
      orderItems,
      0,
      0,
    ]);
    return { status: "OK", id: res.lastID };
  } catch (e) {
    console.error(`Error in createOrder: ${e}.`);
    return { status: "error", message: "Failed to insert orders table!" };
  }
};

const updateOrder = async ({ orderID, isPaid, isDelivered }) => {
  const query = `update orders set is_paid = $isPaid, is_delivered=$isDelivered where id = $orderID`;
  try {
    const res = await dbRun(query, {
      $orderID: orderID,
      $isPaid: isPaid,
      $isDelivered: isDelivered,
    });
    return { status: "OK", result: res };
  } catch (e) {
    console.error("updateOrder Error:", e);
    return { state: "error", message: "update order error" };
  }
};

const updateCart = async ({ uid, items }) => {
  const query = `INSERT INTO cart (uid, cart_items)
VALUES ($uid, $itemstr)
ON CONFLICT (uid)
DO UPDATE SET cart_items = excluded.cart_items;`;
  try {
    const res = await dbRun(query, {
      $uid: uid,
      $itemstr: JSON.stringify(items),
    });
    return { status: "OK", result: res };
  } catch (e) {
    console.error("updateCart Error:", e);
    return { state: "error", message: "update cart error" + e };
  }
};
const getCart = async ({ uid }) => {
  const query = `select * from cart where uid = $uid`;
  try {
    const res = await dbGet(query, { $uid: uid });
    if (!res) return { status: "OK", items: [] };
    const items = JSON.parse(res.cart_items);
    return { status: "OK", items };
  } catch (e) {
    console.error(`Error in getCart: ${e}.`);
    return { status: "error", message: "Failed to get cart items!" };
  }
};
// initTables();
// dbTest(); // this function is for internal test.
module.exports = {
  createUser,
  checkUser,
  getAllUsers,
  deleteUser,
  updateUser,
  getAllOrders,
  createOrder,
  getOrdersByUser,
  updateOrder,
  updateCart,
  getCart,
};
