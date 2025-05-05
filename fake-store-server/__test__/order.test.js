const request = require("supertest");
const app = require("../app");
const { deleteUser } = require("../src/db/index");
const testUser = {
  email: "test-order@test.com",
  name: "Test User Order",
  password: "Abcdefg3",
};
const testEnv = { userID: 0, token: "", orderID: 0 };
const testItems = [
  { prodID: 1, price: 3.5, quantity: 2 },
  { prodID: 2, price: 10.75, quantity: 1 },
];
describe("Orders API Endpoints", () => {
  beforeAll(async () => {
    await deleteUser(testUser.email);
    const res = await request(app)
      .post("/users/signup")
      .send(testUser)
      .set("Accept", "application/json");
    testEnv.userID = res.body.id;
    testEnv.token = res.body.token;
  });

  it("POST /orders/neworder - should create a new order when a user uses correct token", async () => {
    const res = await request(app)
      .post("/orders/neworder")
      .send({ items: testItems })
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${testEnv.token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "OK");
    const orderID = res.body.id;
    testEnv.orderID = orderID;
    expect(orderID).toBeGreaterThan(0);
  });

  it("POST /orders/neworder - should not create a new order when a user uses wrong token", async () => {
    const fakeToken = "fakeToken";
    const res = await request(app)
      .post("/orders/neworder")
      .send({ userID: testEnv.userID, items: testItems })
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${fakeToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "error");
    expect(res.body).toHaveProperty("message", "Wrong token.");
  });

  it("GET /orders/all - should return oders by the login user", async () => {
    const res = await request(app)
      .get("/orders/all")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${testEnv.token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "OK");
    const orders = res.body.orders;
    const order = orders.find((o) => o.id === testEnv.orderID);
    expect(order.uid).toBe(testEnv.userID);
    expect(order.item_numbers).toBe(3);
    expect(order.total_price).toBe(1775);
    expect(JSON.parse(order.order_items)).toEqual(testItems);
  });

  it("POST /orders/updateorder - should be able to set order paid or delivered ", async () => {
    const orderID = testEnv.orderID;
    const res = await request(app)
      .post("/orders/updateorder")
      .send({ orderID, isPaid: 1, isDelivered: 1 })
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${testEnv.token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "OK");
    expect(res.body.result).toEqual({ lastID: orderID, changes: 1 });

    const res2 = await request(app)
      .get("/orders/all")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${testEnv.token}`);

    const orders = res2.body.orders;
    const order = orders.find((o) => o.id === testEnv.orderID);
    expect(order.uid).toBe(testEnv.userID);
    expect(order.item_numbers).toBe(3);
    expect(order.total_price).toBe(1775);
    expect(order.is_paid).toBe(1);
    expect(order.is_delivered).toBe(1);
    expect(JSON.parse(order.order_items)).toEqual(testItems);
  });
});
