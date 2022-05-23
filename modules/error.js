'use strict';

function error(req, res) {
  res.status(404).send('not found');
}

module.exports = error;
