const express = require("express");
// const ngrok = require("ngrok");
const bodyParser = require("body-parser");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_KEY);

// UNCOMMENT FOR LOCAL TESTING
// const initNgRock = async () => {
//   const url = await ngrok.connect();
//   console.log(`Local server exposed on ${url}`);
// };

// initNgRock().catch((error) => {
//   console.error(error);
//   ngrok.disconnect();
// });

const server = express();

server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.json());

server.post("/api", async function (request, response) {
  console.log(request.body);
  const msg = {
    to: process.env.RECEIVER,
    from: process.env.SENDER, // Use the email address or domain you verified above
    subject: "debug mail",
    text: JSON.stringify(request.body),
    html: JSON.stringify(request.body),
  };
  let res = "done";
  await (async () => {
    try {
      await sgMail.send(msg);
    } catch (error) {
      res = JSON.stringify(error);

      if (error.response) {
        res = error.response.body;
      }
    }
  })();

  response.status(200).send(res);
});

module.exports = server;
