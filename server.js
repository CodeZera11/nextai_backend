import dotenv from "dotenv";
dotenv.config({});

import express from "express";
import { google } from "googleapis";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
// app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = process.env.NODE_PORT || 8000;

const oauth2client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);

const scopes = ["https://www.googleapis.com/auth/calendar"];

const calendar = google.calendar({
  version: "v3",
  auth: oauth2client,
});

app.get("/", (req, res) => {
  res.send({ msg: "Hello World" });
});

app.get("/google", (req, res) => {
  const url = oauth2client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });

  res.send(url);
});

// app.get("/google-calendar", async (req, res) => {
//   const code = req.query.code;
//   console.log("backend", code);

//   const { tokens } = await oauth2client.getToken(code);

//   oauth2client.setCredentials(tokens);
//   console.log(tokens);
//   const response = await calendar.events.list({
//     calendarId: "primary",
//     timeMin: new Date().toISOString(),
//     maxResults: 10,
//     singleEvents: true,
//     orderBy: "startTime",
//   });
//   const events = response.data.items;
//   console.log({ events });
//   res.send({ msg: "You have logged in succesfully.", events });
// });

app.post("/get-events", async (req, res) => {
  try {
    const code = Object.entries(req.body)[0][0];
    if (code) {
      const { tokens } = await oauth2client.getToken(code);
      oauth2client.setCredentials(tokens);
      console.log(tokens);
      const response = await calendar.events.list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: "startTime",
      });
      const events = response.data.items;
      console.log({ events });
      res.send({ msg: "You have logged in succesfully.", events });
    }
  } catch (error) {
    console.log(error.response.data);
  }
});

app.get("/google/redirect", async (req, res) => {
  res.redirect(`http://localhost:3000/google-calendar`);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});
