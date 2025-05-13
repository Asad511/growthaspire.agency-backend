const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;


// Allow GitHub Pages frontend
app.use(cors({
  origin: "https://www.growthaspire.agency"
}));
app.use(bodyParser.json());

// POST /contact endpoint
app.post("/contact", async (req, res) => {
  const { name, email, category, message } = req.body;

  if (!name || !email || !category || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Growth Aspire" <${process.env.EMAIL_USER}>`,
      to: "touqeer@growthaspire.agency",
      subject: `New Inquiry: ${category}`,
      html: `
        <h3>Contact Form Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `
    });

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
