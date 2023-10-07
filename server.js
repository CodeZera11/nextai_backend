import dotenv from "dotenv";
dotenv.config({});

import express from "express";
import { google } from "googleapis";

const app = express();

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

  res.redirect(url);
});

app.get("/google/redirect", async (req, res) => {
  const code = req.query.code;

  const { tokens } = await oauth2client.getToken(code);
  oauth2client.setCredentials(tokens);

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
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});
