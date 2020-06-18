async function routes(fastify, options) {
  const { ObjectID } = fastify.id;
  const database = fastify.mongo.db('db');
  const chain = database.collection('chain');

  const PROXY_URL = { url: '/api', isProxy: true };
  const isProxy = PROXY_URL.isProxy ? PROXY_URL.url : '';

  fastify
    .get(`${isProxy}/search/:word`, async (req, reply) =>
      reply.send(await chain.find({ name: { $regex: req.params.word } }).toArray())
    )
    .post(`${isProxy}/search`, async (req, reply) =>
      reply.send(await chain.insertOne({ ...req.body }))
    );
}

module.exports = routes;
