const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authenticateJWT = require("./middleware/authJwt.js")
const dotenv = require("dotenv")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const UserModel = require("./model/userModel");
dotenv.config()

const app = express();
app.use(cors());
app.use(express.json());


const port = 1337 || process.env.PORT



mongoose
  .connect(
    `mongodb+srv://${process.env.MongoUsername}:${process.env.MongoPassword}@cluster0.35vxia3.mongodb.net/Users?retryWrites=true&w=majority`
  )
  .then(console.log("DB CONNECTED"));



app.post("/api/register", async (req, res) => {
  console.log(req.body);
  try {
    const newPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
      name: req.body.name,
      email: req.body.Email,
      password: newPassword,
    };
    const newUser = new UserModel(user);
    await newUser.save();
    res.json({ status: "ok" });
  } catch (err) {
    res.json({ status: "error", error: "Duplicate email" });
  }
});

app.post("/api/login", async (req, res) => {
  const user = await UserModel.findOne({
    email: req.body.email,
  });
  console.log(user);
  if (!user) {
    res.json({ status: "error", error: "Invalid Login" });
  }
  console.log("adad");
  if (user) {
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (isPasswordValid) {
      const token = jwt.sign(
        {
          name: user.name,
          email: user.email,
        },
        process.env.Jwtsecretkey
      );

      return res.json({ status: "ok", user: token });
    } else {
      res.json({ status: "error", user: false });
    }
  }
});


app.use(authenticateJWT)

//get and post request by mehdi


app.post("/api/mehdi" ,async (req,res)=>{
  console.log(req.body);
  res.json({
    information : "ok i got ur name",
  })
})
app.get("/api/mehdigetData" ,async (req,res)=>{
  console.log(req.body);
  res.json({
    // information : "ok i got ur name",
    userData: req.user
  })
})

// MAIN CODE

app.get("/api/home/userData" ,async (req,res)=>{
  res.json({
    userData: req.user
  })
})


app.listen(1337, () => {
  console.log(`\x1b[33m   Server started on ${port}  \x1b[0m`);
  
});