const app = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");
const user = {
	username: "nigel10",
	password: "10",
};

const wrongUser = {
	username: "addison",
	password: "bar",
};

afterAll((done) => {
	mongoose.connection.close(() => done());
});

// register API
describe("POST /register", () => {
	it(`When empty string password is passed in when registering`, async () => {
		const response = await request(app).post("/register").send({
			username: "testUser",
            password: "",
		});

		expect(response.statusCode).toEqual(200);
		expect(response.headers["content-type"]).toMatch(/json/);
		expect(response.body.success).toBe(false);
		expect(response.body.message).toBe("MissingPasswordError: No password was given");
	});

    it(`When no password is passed in when registering`, async () => {
		const response = await request(app).post("/register").send({
			username: "testUser",
		});

		expect(response.statusCode).toEqual(200);
		expect(response.headers["content-type"]).toMatch(/json/);
		expect(response.body.success).toBe(false);
		expect(response.body.message).toBe("MissingPasswordError: No password was given");
	});

    it(`When empty string username is passed in when registering`, async () => {
		const response = await request(app).post("/register").send({
            username: "",
			password: user.password,
		});

		expect(response.statusCode).toEqual(200);
		expect(response.headers["content-type"]).toMatch(/json/);
		expect(response.body.success).toBe(false);
		expect(response.body.message).toBe("MissingUsernameError: No username was given");
	});

    it(`When no username is passed in when registering`, async () => {
		const response = await request(app).post("/register").send({
			password: user.password,
		});

		expect(response.statusCode).toEqual(200);
		expect(response.headers["content-type"]).toMatch(/json/);
		expect(response.body.success).toBe(false);
		expect(response.body.message).toBe("MissingUsernameError: No username was given");
	});

    it(`When duplicated username is passed in when registering`, async () => {
		const response = await request(app).post("/register").send({
			username: user.username,
		});

		expect(response.statusCode).toEqual(200);
		expect(response.headers["content-type"]).toMatch(/json/);
		expect(response.body.success).toBe(false);
		expect(response.body.message).toBe("UserExistsError: A user with the given username is already registered");
	});
});

// login API
describe("POST /login", () => {
	it(`When the correct username and password is passed in`, async () => {
		const response = await request(app).post("/login").send(user);

		expect(response.statusCode).toEqual(200);
		expect(response.headers["content-type"]).toMatch(/json/);
		expect(response.body.success).toBe(true);
		expect(response.body.message).toBe("/home");
	});

	it(`When the correct username and wrong password is passed in`, async () => {
		const response = await request(app).post("/login").send({
			username: user.username,
			password: wrongUser.password,
		});

		expect(response.statusCode).toEqual(200);
		expect(response.headers["content-type"]).toMatch(/json/);
		expect(response.body.success).toBe(false);
		expect(response.body.message).toBe("Your credentials do not match our record on the server. Please try again!");
	});

	it(`When the wrong username and password is passed in`, async () => {
		const response = await request(app).post("/login").send(wrongUser);

		expect(response.statusCode).toEqual(200);
		expect(response.headers["content-type"]).toMatch(/json/);
		expect(response.body.success).toBe(false);
		expect(response.body.message).toBe("Your credentials do not match our record on the server. Please try again!");
	});

	it(`When no username is passed in`, async () => {
		const response = await request(app).post("/login").send({
			password: user.password,
		});

		expect(response.statusCode).toEqual(200);
		expect(response.headers["content-type"]).toMatch(/json/);
		expect(response.body.success).toBe(false);
		expect(response.body.message).toBe("Your credentials do not match our record on the server. Please try again!");
	});

	it(`When no password is passed in`, async () => {
		const response = await request(app).post("/login").send({
			username: user.username,
		});

		expect(response.statusCode).toEqual(200);
		expect(response.headers["content-type"]).toMatch(/json/);
		expect(response.body.success).toBe(false);
		expect(response.body.message).toBe("Your credentials do not match our record on the server. Please try again!");
	});

	it(`When neither username nor password is passed in`, async () => {
		const response = await request(app).post("/login").send({});

		expect(response.statusCode).toEqual(200);
		expect(response.headers["content-type"]).toMatch(/json/);
		expect(response.body.success).toBe(false);
		expect(response.body.message).toBe("Your credentials do not match our record on the server. Please try again!");
	});

	it(`When username and password are empty string`, async () => {
		const response = await request(app).post("/login").send({
			username: "",
			password: "",
		});

		expect(response.statusCode).toEqual(200);
		expect(response.headers["content-type"]).toMatch(/json/);
		expect(response.body.success).toBe(false);
		expect(response.body.message).toBe("Your credentials do not match our record on the server. Please try again!");
	});
});

// auth API
describe("GET /auth", () => {
	it("Redirect unauthenticated user back to login page", async () => {
		const response = await request(app).get("/auth");

		expect(response.statusCode).toEqual(200);
		expect(response.headers["content-type"]).toMatch(/json/);
		expect(response.body.success).toBe(false);
		expect(response.body.message).toBe("/login");
		expect(response.body.username).toBe(undefined);
	});
});

// logout API
describe("GET /logout", () => {
	it("Successfully log out user as expected, and redirect the user back to welcome page", async () => {
		const response = await request(app).get("/logout");

		expect(response.statusCode).toEqual(200);
		expect(response.headers["content-type"]).toMatch(/json/);
		expect(response.body.success).toBe(true);
		expect(response.body.message).toBe("/");
	});
});

