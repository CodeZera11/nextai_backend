import dotenv from "dotenv";
dotenv.config({});

import express from "express";
import { google } from "googleapis";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
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

app.get("/check-signin", async (req, res) => {
  try {
    const access_token = req.cookies["access_token"];
    const expiry_date = req.cookies["expiry_date"];
    const refresh_token = req.cookies["refresh_token"];

    if (access_token && expiry_date && refresh_token) {
      const tokens = {
        access_token,
        refresh_token,
        expiry_date,
      };
      oauth2client.setCredentials(tokens);
      res.send({ signedIn: true });
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/generateAuthUrl", (_req, res) => {
  const url = oauth2client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });

  res.send(url);
});

app.post("/get-events", async (_req, res) => {
  try {
    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });
    const events = response.data.items;
    res.send({ msg: "You have logged in succesfully.", events });
  } catch (error) {
    console.log(error);
  }
});

app.post("/generateTokens", async (req, res) => {
  try {
    const code = Object.entries(req.body)[0][0];
    const { tokens } = await oauth2client.getToken(code);

    res.cookie("access_token", tokens.access_token, {
      httpOnly: true,
    });
    res.cookie("refresh_token", tokens.refresh_token, { httpOnly: true });
    res.cookie("expiry_date", tokens.expiry_date, { httpOnly: true });

    res.status(200).send({ success: true });
  } catch (error) {
    console.log("Server Error", error);
    res.status(500).send({ success: false, error: "Server Error!" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});
