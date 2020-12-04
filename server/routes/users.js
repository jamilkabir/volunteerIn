const router = require('express').Router();
const { User } = require('../db');
const Events = require('../db/models/Events');

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ['password', 'phone'],
      },
    });
    res.send(users);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const singleUser = await User.findByPk(req.params.id, { include: [Events] });
    if (!singleUser) {
      const error = new Error('USER NOT FOUND');
      error.status = 404;
      throw error;
    }
    res.status(200).send(singleUser);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const singleUser = await User.findByPk(req.params.id);
    await singleUser.destroy();
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const followedUser = await User.findByPk(req.params.id);
    await followedUser.update(req.body);
    res.send();
  } catch (ex) {
    next(ex);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const newUser = await User.create(req.body.user);
    res.status(201).send(newUser);
  } catch (err) {
    next(err);
  }
});

module.exports = router;