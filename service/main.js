const fastify = require('fastify')();

fastify.register(require('./db'), {
  url: 'mongodb://localhost/db'
});

fastify.register(require('./route'));

fastify.listen(3000);
