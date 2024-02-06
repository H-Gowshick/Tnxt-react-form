// server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const Registration = require("./models/Reg_model");

const app = express();
const port = 3001;

mongoose.connect("mongodb://localhost:27017/Registration_App", {});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors());
app.use(bodyParser.json());

app.post("/api/register", upload.single("image"), async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      birthday,
      gender,
      email,
      phoneNumber,
      subject,
    } = req.body;

    const newRegistration = new Registration({
      firstName,
      lastName,
      birthday,
      gender,
      email,
      phoneNumber, // Make sure phoneNumber is included
      subject,
      image: req.file ? req.file.buffer.toString("base64") : null,
    });

    await newRegistration.save();
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/registrations", async (req, res) => {
  try {
    const registrations = await Registration.find();
    res.json(registrations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/api/register/:id", upload.single("image"), async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      birthday,
      gender,
      email,
      phoneNumber,
      subject,
    } = req.body;

    const updatedRegistration = {
      firstName,
      lastName,
      birthday,
      gender,
      email,
      phoneNumber,
      subject,

      image: req.file ? req.file.buffer.toString("base64") : null,
    };

    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      updatedRegistration,
      { new: true }
    );

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    res.json({ message: "Update successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.delete("/api/register/:id", async (req, res) => {
  try {
    const registration = await Registration.findByIdAndDelete(req.params.id);

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    res.json({ message: "Delete successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
