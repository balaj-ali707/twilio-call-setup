require("dotenv").config()
const express = require("express");
const twilio = require("twilio");

// Twilio Credentials from the Twilio Console
const accountSid = process.env.USER_SID; // Replace with your Account SID
const authToken = process.env.USER_TOKEN;   // Replace with your Auth Token
const client = twilio(accountSid, authToken);

const app = express();
const port = 3001;

// Middleware for parsing JSON
app.use(express.json());

// Route to initiate an outbound call
app.post("/make-call", async (req, res) => {
  try {
    const { to } = req.body; // The number to call, provided in the request body

    if (!to) {
      return res.status(400).json({ message: "The 'to' phone number is required." });
    }

    // Initiating the call
    const call = await client.calls.create({
      url: "http://localhost:3001/twiml", // TwiML URL for the message
      to: to,                                 // Recipient's phone number
      from: "+12294894536",       // Your Twilio phone number
    });

    res.status(200).json({ message: "Call initiated successfully", callSid: call.sid });
  } catch (error) {
    console.error("Error making call:", error);
    res.status(500).json({ message: "Failed to initiate call", error: error.message });
  }
});

// TwiML endpoint to serve the alert message
app.post("/twiml", (req, res) => {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const response = new VoiceResponse();

  response.say("Hello, how are you?", { voice: "alice" });

  res.type("text/xml");
  res.send(response.toString());
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
