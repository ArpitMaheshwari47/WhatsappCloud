const express = require("express")
const body_parser = require("body-parser")

const dotenv = require("dotenv")
const axios = require("axios")

dotenv.config()

const app = express().use(body_parser.json())

const token = process.env.TOKEN
const mytoken = process.env.MYTOKEN
const PORT = process.env.PORT
app.listen(5000 || PORT, () => {
  console.log(`Listening on ${PORT}`)
})


app.get("/whatsapp", (req, res) => {
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  if (mode && token) {

    if (mode === "subscribe" && token === mytoken) {
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
})


app.post("/whatsapp", (req, res) => {
  let body = req.body
  if (body.object) {
    if (body.entry[0] && body.entry[0].changes
      && body.entry[0].value.message &&
      body.entry[0].value.message[0]) {

      let phon_no_id = body.entry[0].changes[0].value.metadata.phone_number_id
      let from = body.entry[0].changes[0].value.message[0].from
      let msg_body = body.entry[0].changes[0].value.message[0].text.body

      axios({
        method: "POST",
        url: "https://graph.facebook.com/v15.0/" + phon_no_id + "/messages?access_token=" + token,
        data: {
          messaging_product: "whatsapp",
          to: from,
          text: {
            body: "Hii... I'm Arpit"
          }
        },
        headers: {
          "content-type": "application/json"
        }
      })
    }
  }
})


