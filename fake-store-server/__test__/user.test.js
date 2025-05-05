const request = require("supertest");
const app = require("../app");
const { deleteUser } = require("../src/db/index");
const { verifyToken } = require("../src/service/jsw");
const testUser = {
  email: "test@test.com",
  name: "Test User",
  password: "Abcdefg3",
};
describe("User API Endpoints", () => {
  beforeEach(async () => {
    await deleteUser(testUser.email);
  });
  it("POST /users/signup - should create a user", async () => {
    const res = await request(app)
      .post("/users/signup")
      .send(testUser)
      .set("Accept", "application/json");
    const id = res.body.id;
    const token = res.body.token;
    const { userID } = await verifyToken(token);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "OK");
    expect(res.body).toHaveProperty("name", testUser.name);
    expect(res.body).toHaveProperty("email", testUser.email);
    expect(id).toBeGreaterThan(0);
    expect(userID).toBe(id);
  });

  it("POST /users/signup - should not create a user with the same email", async () => {
    await request(app)
      .post("/users/signup")
      .send(testUser)
      .set("Accept", "application/json");
    const res = await request(app)
      .post("/users/signup")
      .send(testUser)
      .set("Accept", "application/json");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "error");
    expect(res.body).toHaveProperty("message", "The email is already used.");
  });

  it("POST /users/signup - should not create a user with empty email, name, or password", async () => {
    const res = await request(app)
      .post("/users/signup")
      .send({ ...testUser, name: "" })
      .set("Accept", "application/json");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "error");
    expect(res.body).toHaveProperty("message", "User name can't be empty");
  });

  it("POST /users/signin - a user should be able to signin with correct email and password", async () => {
    await request(app)
      .post("/users/signup")
      .send(testUser)
      .set("Accept", "application/json");

    const res = await request(app)
      .post("/users/signin")
      .send({ email: testUser.email, password: testUser.password })
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "OK");
    expect(res.body).toHaveProperty("name", testUser.name);
    expect(res.body).toHaveProperty("email", testUser.email);
    expect(res.body.id).toBeGreaterThan(0);
    expect(typeof res.body.token).toBe("string");
  });

  it("POST /users/signin - a user should not be able to signin with incorrect email or password.", async () => {
    await request(app)
      .post("/users/signup")
      .send(testUser)
      .set("Accept", "application/json");

    const res = await request(app)
      .post("/users/signin")
      .send({ email: testUser.email, password: "wrong password" })
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "error");
    expect(res.body).toHaveProperty("message", "Wrong email or password.");
  });

  it("POST /users/update - a logined user should be able to update his name and password.", async () => {
    const signupRes = await request(app)
      .post("/users/signup")
      .send(testUser)
      .set("Accept", "application/json");
    const id = signupRes.body.id;
    const token = signupRes.body.token;
    const newName = "My New Name";
    const newPassword = "abc";
    const res = await request(app)
      .post("/users/update")
      .send({ name: newName, password: newPassword })
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "OK");
    expect(res.body).toHaveProperty("name", newName);
    expect(res.body).toHaveProperty(
      "message",
      "User name and password update successfully."
    );
  });

  it("POST /users/update - a user without correct token should not be able to update his name and password.", async () => {
    const signupRes = await request(app)
      .post("/users/signup")
      .send(testUser)
      .set("Accept", "application/json");
    const id = signupRes.body.id;
    const token = signupRes.body.token + "_wrong";
    const newName = "My New Name";
    const newPassword = "abc";
    const res = await request(app)
      .post("/users/update")
      .send({ name: newName, password: newPassword })
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`); //
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "error");
    expect(res.body).toHaveProperty("message", "Wrong token.");
  });

  it("POST /users/update - updated user name and password can't be empty.", async () => {
    const signupRes = await request(app)
      .post("/users/signup")
      .send(testUser)
      .set("Accept", "application/json");
    const id = signupRes.body.id;
    const token = signupRes.body.token;
    const newName = "";
    const newPassword = "abc";
    const res = await request(app)
      .post("/users/update")
      .send({ name: newName, password: newPassword })
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "error");
    expect(res.body).toHaveProperty(
      "message",
      "New Name and Password can't be empty."
    );
  });
});
