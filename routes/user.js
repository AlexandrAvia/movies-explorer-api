const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  profileUpdate, getCurrentUser,
} = require('../controllers/user');

router.get('/users/me', getCurrentUser);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
  }),
}), profileUpdate);

module.exports = router;
