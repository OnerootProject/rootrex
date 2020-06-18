const fp = require('fastify-plugin');

const { ObjectID, MongoClient } = require('mongodb');

async function db(fastify, options) {
  const url = options.url;
  delete options.url;

  const db = await MongoClient.connect(url, options);
  fastify.decorate('mongo', db);
  fastify.decorate('id', ObjectID);
}

module.exports = fp(db);
