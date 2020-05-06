const express = require('express');
const { check, validationResult } = require('express-validator');

const router = express.Router();

const users = [];

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'handlin Get request to /sign-up',
  });
});

router.post(
  '/',
  [
    check('name')
      .not()
      .isEmpty()
      .withMessage('Необходимо внести имя пользователя'),
    check('password')
      .isLength({ min: 8 })
      .withMessage('Пароль должен содержать не менее 8 символов')
      .matches(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/)
      .withMessage('Пароль должен содержать латинские строчные и заглавные буквы и цифры'),
    check('passwordConfirmation', 'Необходимо внести пароль')
      .isLength({ min: 8 })
      .custom((val, { req }) => {
        if (val !== req.body.password) {
          throw new Error('Пароли не совподают');
        } else {
          return val;
        }
      }),
    check('email')
      .isEmail()
      .custom((value, { req }) => {
        const result = users.find((item) => item.email === req.body.email);
        if (result) {
          throw new Error('Email уже используется');
        } else {
          return value;
        }
      }),
    check('website')
      .not()
      .isEmpty()
      .withMessage('Необходимо внести адресс веб сайта'),
    check('age')
      .not()
      .isEmpty()
      .withMessage('Необходимо написать ваш возрост'),
    check('skills')
      .not()
      .isEmpty()
      .withMessage('Необходимо написать хотябы один навык'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(433).json({ errors: errors.array() });
    }
    const user = {
      name: req.body.name,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation,
      email: req.body.email,
      website: req.body.website,
      age: req.body.age,
      skills: req.body.skills,
    };
    users.push(user);
    return res.status(200).json({
      message: 'Вы успешно зарегистрированы.',
      userAded: users,
    });
  },
);

module.exports = router;
