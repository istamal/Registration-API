const express = require('express');
const router = express.Router();

const users = [];

router.get('/', (req, res, next) => {
	res.status(200).json({
		"message": "handlin Get request to /sign-up"
	});
});

router.post('/', (req, res, next) => {
	const user = {
		name: req.body.name,
		password: req.body.password,
		email: req.body.email,
		website: req.body.website,
		age: req.body.age,
		skills: req.body.skills,
	};
	const isEmail = users.find((item) => item.email === req.body.eamil);

	if (isEmail) {
		res.status(200).json({
			message: 'Эмайл уже занят.',
			userAded: users,
		});
	} else {
		users.push(user);
		res.status(200).json({
			message: 'Вы успешно зарегистрированы.',
			userAded: users,
		});
	}
});

module.exports = router;
