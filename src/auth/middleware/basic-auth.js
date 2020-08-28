'use strict';

const base64 = require('base-64');

const users = require('../users-model.js');

module.exports = async (req, res, next) => {

  const errorObj = { status: 401, statusMessage: 'Unauthorized', message: 'Invalid User ID/Password' };

  if (!req.headers.authorization) { next(errorObj); return; }

  let encodedPair = req.headers.authorization.split(' ').pop();

  let [user, pass] = base64.decode(encodedPair).split(':');

  try {
    const validUser = await users.authenticateBasic(user, pass);

    req.token = validUser.generateToken();

    next();
  } catch (err) {
    next(errorObj);
  }


};