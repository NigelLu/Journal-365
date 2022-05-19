require('dotenv').config()
const mongoose = require("mongoose");
// URLSlugs = require("mongoose-url-slugs"),
const passportLocalMongoose = require("passport-local-mongoose");


const JournalSchema = new mongoose.Schema({
	title: { type: String, required: true },
	content: { type: String, required: true, minLength: 10 },
	files: Array,
	dateCreated: { type: Date, required: true },
});

const UserSchema = new mongoose.Schema({
	username : {type: String, unique: true, required:true},
	journals: [JournalSchema],
	background: String,
	profileImg: String,
});

UserSchema.plugin(passportLocalMongoose, {
	limitAttempts: true, // add limitations on login attempts
	maxAttempts: 5, // number of attempts allowed before the account is locked
	unlockInterval: 3000, // number of milliseconds neede between login attempts
});

mongoose.model("User", UserSchema);
mongoose.model("Journal", JournalSchema);

const url = process.env.URL || "mongodb://localhost/ait";
mongoose.connect(url);
const connection = mongoose.connection;
connection.once('open', () => {
	console.log(`
	MongoDB database connection established successfully at ${url}`);
});