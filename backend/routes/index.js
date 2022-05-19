const express = require("express"),
	router = express.Router(),
	passport = require("passport"),
	mongoose = require("mongoose"),
	User = mongoose.model("User");
multer = require("multer");

require("dotenv").config();

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, process.env.UPLOAD);
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Math.round(Math.random() * 1e9);
		cb(null, uniqueSuffix + "-" + file.originalname);
	},
});

const upload = multer({ storage: storage });

// #region authentication, register, login, and logout

router.post("/register", (req, res) => {
	User.register(
		new User({
			username: req.body.username,
			profileImg: "/img/default_profileImg.png",
			background: "/img/default.jpg",
		}),
		req.body.password,
		(err, user) => {
			if (err) {
				res.json({
					success: false,
					message: `${err}`,
				});
			} else {
				console.log(`Successfully save user\n${JSON.stringify(user)}`);
				passport.authenticate("local")(req, res, function () {
					res.json({
						success: true,
						message: "/home",
					});
				});
			}
		}
	);
});

router.post("/login", (req, res, next) => {
	passport.authenticate("local", (err, user) => {
		if (user) {
			req.logIn(user, () => {
				res.json({
					message: "/home",
					success: true,
				});
			});
		} else if (err) {
			res.json({
				success: false,
				message: `${err}`,
			});
		} else {
			res.json({
				success: false,
				message: "Your credentials do not match our record on the server. Please try again!"
			})
		}
	})(req, res, next);
});

router.get("/auth", (req, res) => {
	if (req.isAuthenticated()) {
		User.findOne({
			_id: req.user.id,
		}).then((doc) => {
			res.json({
				success: true,
				message: "user authenticated.",
				username: req.user.username,
				background: doc.background,
				profileImg: doc.profileImg,
			});
		});
	} else {
		res.json({
			success: false,
			message: "/login",
			username: undefined,
		});
	}
});

router.get("/logout", (req, res) => {
	req.logout();
	res.json({
		success: true,
		message: "/",
	});
})
// #endregion

// #region CRUD

// GET API to pull all the user info for displaying in home page
router.get("/home", (req, res) => {
	User.findOne({
		_id: req.user.id,
	})
		.then((doc) => {
			res.json({
				journals: doc.journals,
				background: doc.background,
				profileImg: doc.profileImg,
				errorMsg: undefined,
				success: true,
			});
		})
		.catch((err) => {
			res.json({
				journals: undefined,
				background: "img/default.jpg",
				profileImg: "img/default_profileImg.png",
				errorMsg: err,
				success: false,
			});
		});
});

// POST API to add a new Journal
router.post("/addJournal", upload.single("selectedFiles"), async (req, res) => {
	if (!req.user) {
		res.json({
			success: true,
			message: "/login",
		});
	}
	try {
		const reqFiles = [];
		if (req.file) {
			reqFiles.push(req.file.filename);
		}

		User.findOneAndUpdate(
			{ _id: req.user.id },
			{
				$push: {
					journals: {
						title: req.body.title,
						content: req.body.content,
						files: reqFiles,
						dateCreated: req.body.dateCreated,
					},
				},
			}
		).then(function () {
			res.json({
				success: true,
				message: "/home",
			});
		});
	} catch (err) {
		console.log("err" + err);
		res.status(500).json({
			success: false,
			message: `${err}`,
		});
	}
});

// GET API to get a single journal by journal ID
// used for editJournal and viewJournal component
router.get("/getJournal/:journalId", (req, res) => {
	const journalId = req.params.journalId;
	if (!req.user) {
		res.json({
			profileImg: "/img/default_profileImg.png",
			background: "/img/default.png",
			journal: undefined,
			errorMsg: "/login",
			success: false,
		});
	}

	User.findOne({
		_id: req.user.id,
	})
		.then((doc) => {
			const targetJournal = doc.journals.id(journalId);
			res.json({
				profileImg: doc.profileImg,
				background: doc.background,
				journal: targetJournal,
				errorMsg: undefined,
				success: true,
			});
		})
		.catch((err) => {
			res.json({
				profileImg: "/img/default_profileImg.png",
				background: "/img/default.png",
				journal: undefined,
				errorMsg: "/home",
				success: false,
			});
		});
});

// POST API to edit an existing Journal
router.post("/editJournal", upload.single("selectedFiles"), (req, res) => {
	if (!req.user) {
		res.json({
			success: true,
			message: "/login",
		});
	} else if (!req.body.journalId) {
		res.json({
			success: true,
			message: "/addJournal",
		});
	}

	const reqFiles = [];
	if (req.body.file && req.body.file !== "undefined") {
		reqFiles.push(req.body.file);
	} else if (req.body.selectedFiles && req.body.selectedFiles !== "undefined") {
		reqFiles.push(req.body.selectedFiles);
	} else if (req.file) {
		reqFiles.push(req.file.filename);
	}

	User.findOneAndUpdate(
		{ _id: req.user.id, "journals._id":req.body.journalId },
		{
			$set: {
				"journals.$.title": req.body.title,
				"journals.$.content": req.body.content,
				"journals.$.files": reqFiles,
			},
		}
	)
		.then(function () {
			res.json({
				success: true,
				message: "/home",
			});
		})
		.catch((err) => {
			console.log("err" + err);
			res.status(500).json({
				success: false,
				message: `${err}`,
			});
		});
});

// POST API to add/change background
router.post("/addBackground", upload.single("selectedFiles"), (req, res) => {
	if (!req.user) {
		res.json({
			success: true,
			message: "/login",
		});
	} else if (req.file) {
		req.file.filename = `/uploads/${req.file.filename}`;
	} else if (!req.file) {
		req.file = { filename:  "/img/default.jpg", }
	}

	User.findOneAndUpdate(
		{ _id: req.user.id },
		{
			$set: {
				background: `${req.file.filename}`,
			},
		}
	)
		.then(() => {
			res.json({ success: true, message: "/home" });
		})
		.catch((err) => {
			res.json({ success: false, message: err });
		});
});

// POST API to delete a journal
router.post("/deleteJournal", (req, res) => {
	const journalId = req.body.journalId;
	if (!req.user) {
		res.json({
			profileImg: "/img/default_profileImg.png",
			background: "/img/default.png",
			journal: undefined,
			errorMsg: "/login",
			success: false,
		});
	}

	User.findOneAndUpdate(
		{ _id: req.user.id, "journals._id": journalId },
		{
			$pull: {
				journals: {_id: journalId},
			},
		}
	)
		.then(function () {
			res.json({
				success: true,
				message: "/home",
			});
		})
		.catch((err) => {
			console.log("err" + err);
			res.status(500).json({
				success: false,
				message: `${err}`,
			});
		});

});

// POST API to add Profile Image
router.post("/addProfileImg", upload.single("selectedFiles"), (req, res) => {
	if (!req.user) {
		res.json({
			success: true,
			message: "/login",
		});
	} else if (req.file) {
		req.file.filename = `/uploads/${req.file.filename}`;
	} else if (!req.file) {
		req.file = { filename:  "/img/default_profileImg.png", }
	}

	User.findOneAndUpdate(
		{ _id: req.user.id },
		{
			$set: {
				profileImg: `${req.file.filename}`,
			},
		}
	)
		.then(() => {
			res.json({ success: true, message: "/home" });
		})
		.catch((err) => {
			res.json({ success: false, message: err });
		});
});
// #endregion

module.exports = router;
