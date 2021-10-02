const path = require("path");
const fs = require('fs');


// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // set this to true for detailed logging:
  logger: false
});

// Setup our static files
fastify.register(require("fastify-static"), {
  root: path.join(__dirname, "public"),
  prefix: "/" // optional: default '/'
});

// fastify-formbody lets us parse incoming forms
fastify.register(require("fastify-formbody"));

// point-of-view is a templating manager for fastify
fastify.register(require("point-of-view"), {
  engine: {
    handlebars: require("handlebars")
  }
});

// Our main GET home page route, pulls from src/pages/index.hbs
fastify.get("/", function(request, reply) {
  // params is an object we'll pass to our handlebars template
  let params = {
    greeting: "Hello Node!", 
    quotes: quotesFileContent()
  };
  // request.query.paramName <-- a querystring example
  reply.view("/src/pages/index.hbs", params);
});

// A POST route to handle form submissions
// fastify.post("/", function(request, reply) {
//   let params = {
//     greeting: "Hello Form!"
//   };
//   // request.body.paramName <-- a form post example
//   reply.view("/src/pages/index.hbs", params);
// });

// Run the server and report out to the logs
fastify.listen(process.env.PORT, function(err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Your app is listening on ${address}`);
  fastify.log.info(`server listening on ${address}`);
});



/**
 * Return a list (array) of quotes.
 * 
 * The file is sectioned by "source". We aren't concerned about that 
 * for now. Except that we don't want to return sources. 
 * All "sections" look like this: 
 *   [source: ... ]
 * Therefore, we just don't return any lines that start with a bracket. 
 * Because no legitimate quote/question will start with one anyway. 👍🏻
 */
const quotesFileContent = function() {
  
  const quotes = fs.readFileSync('src/quotes.txt', 'utf8').toString().split('\n').map( (item) => { if (item) });
  return quotes
}