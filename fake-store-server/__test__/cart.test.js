const request = require("supertest");
const app = require("../app");
const { deleteUser } = require("../src/db/index");
const testUser = {
  email: "test-cart@test.com",
  name: "Test User Cart",
  password: "Abcdefg8",
};
const testEnv = { userID: 0, token: "" };
const testItems = [
  { id: 1, price: 3.5, count: 2 },
  { id: 2, price: 10.75, count: 1 },
];
describe("Cart API Endpoints", () => {
  beforeAll(async () => {
    await deleteUser(testUser.email);
    const res = await request(app)
      .post("/users/signup")
      .send(testUser)
      .set("Accept", "application/json");
    testEnv.userID = res.body.id;
    testEnv.token = res.body.token;
  });

  it("GET /cart - should get an empty cart for a new user.", async () => {
    const res = await request(app)
      .get("/cart")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${testEnv.token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "OK");
    const items = res.body.items;
    expect(items).toEqual([]);
  });

  it("PUT /cart - should be able to put cart items in the first time", async () => {
    const res = await request(app)
      .put("/cart")
      .send({ items: testItems })
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${testEnv.token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "OK");

    const result = await request(app)
      .get("/cart")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${testEnv.token}`);
    expect(result.statusCode).toEqual(200);
    expect(result.body).toHaveProperty("status", "OK");
    expect(result.body.items).toEqual(testItems);
  });

  it("PUT /cart - should be able to update cart items after set items", async () => {
    testItems.push({ id: 5, price: 8.5, count: 3 });
    const res = await request(app)
      .put("/cart")
      .send({ items: testItems })
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${testEnv.token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "OK");

    const result = await request(app)
      .get("/cart")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${testEnv.token}`);

    expect(result.statusCode).toEqual(200);
    expect(result.body).toHaveProperty("status", "OK");
    expect(result.body.items).toEqual(testItems);
  });
});
