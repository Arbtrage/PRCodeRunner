require("dotenv").config();

const { App } = require("octokit");
const { createNodeMiddleware } = require("@octokit/webhooks");

const fs = require("fs");

const appId = process.env.APP_ID;
const webhookSecret = process.env.WEBHOOK_SECRET;
const privateKeyPath = process.env.PRIVATE_KEY_PATH;

const privateKey = fs.readFileSync(privateKeyPath, "utf8");

const app = new App({
  appId: appId,
  privateKey: privateKey,
  webhooks: {
    secret: webhookSecret,
  },
});

app.webhooks.on("pull_request.opened", ()=>{
    console.log("first")
});


app.webhooks.onError((error) => {
  if (error.name === "AggregateError") {
    console.error(`Error processing request: ${error.event}`);
  } else {
    console.error(error);
  }
});

const port = 3000;
const host = 'localhost';
const path = "/api/webhook";
const localWebhookUrl = `http://${host}:${port}${path}`;


const middleware = createNodeMiddleware(app.webhooks, {path});

module.exports=middleware;