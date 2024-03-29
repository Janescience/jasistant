const controller = require("../controllers/webhook.controller");
const { logger } = require("../middlewares/log-events");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post('/webhook',[logger],controller.webhook);
};