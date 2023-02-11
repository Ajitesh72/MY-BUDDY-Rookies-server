const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authenticateJWT = require("./middleware/authJwt.js");
const dotenv = require("dotenv");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const clientModel = require("./model/ClientModel");
const WorkerModel = require("./model/WorkerModel");
const AdminModel = require("./model/AdminModel")
const WorkerSample = require("./model/WorkerSample");
const secretKey = "sk_test_51MHWQrSA2zGpkJ04CaLFhfjwCp89K9iBaWUYtoUGRwbJSOWyo7CjRLQEilZ0VLVTxiEeFk4VykQITSoRfDSYVezF006bbYCgVT"; //secret key for stripe.js
const stripe = require("stripe")(secretKey);
const nodemailer = require("nodemailer");
const multer = require("multer");
const { Console } = require("console");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = 1337 || process.env.PORT;

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
      role: req.body.role,
      email: req.body.Email,
      password: newPassword,
      applicationStatus: "false"   //INITIALLY IT WILL BE FALSE THEN CHANGE IT TO TRUE OF ACCEPTED BY AJITESH OR MEHDI
    };
    var newUser;
    console.log(req.body.role.toUpperCase())
    if (req.body.role.toUpperCase() === "JOB") {
      newUser = new WorkerModel(user);
    }
    else {
      newUser = new clientModel(user);
    }
    await newUser.save();
    res.json({ status: "ok" });
  } catch (err) {
    console.log(err)
    res.json({ status: "error", error: "Duplicate email" });
  }
});

app.post("/api/login", async (req, res) => {
  console.log(req.body.role)
  var user;
  if (req.body.role === "JOB") {
    user = await WorkerModel.findOne({
      email: req.body.email,
    });
  }
  else {
    user = await clientModel.findOne({
      email: req.body.email,
    });
  }
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
          role: user.role
        },
        process.env.Jwtsecretkey
      );

      return res.json({ status: "ok", user: token });
    } else {
      res.json({ status: "error", user: false });
    }
  }
});

//ADMIN LOGIN
app.post("/api/adminlogin", async (req, res) => {
  console.log(req.body.email)
  const user = await AdminModel.findOne({
    email: req.body.email,
  });

  if (!user) {
    console.log("email nhi mila admin ka")
    res.json({ status: "error", error: "Invalid Login" });
  }
  console.log("adad");
  if (user) {
    var isPasswordValid = false;
    if (req.body.password === user.password) {
      isPasswordValid = true;
    }

    if (isPasswordValid) {
      console.log("yaha aa")
      const token = jwt.sign(
        {
          name: user.name,
          email: user.email,
          role: user.role
        },
        process.env.Jwtsecretkey
      );

      return res.json({ status: "ok", user: token });
    } else {
      res.json({ status: "error", user: false });
    }
  }
});


app.use(authenticateJWT);

//get and post request by mehdi   and stripe.js premium


app.get("/api/mehdigetData", async (req, res) => {
  console.log(req.body);
  res.json({
    userData: req.user,
  });
});
app.post("/create-checkout-session", async (req, res) => {
  console.log(req.user);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer_email: req.user.email,
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: "PREMIUM MEMBERSHIP",
          },
          unit_amount: 20000,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "http://localhost:3000/stripepaymentsuccess",
    // success_url: "http://localhost:3000/order/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "http://localhost:3000/stripepaymentcancel",
  });

  res.json({ id: session.id });
});

app.post("/sendEmail", async (req, res) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "dubeyajitesh07@gmail.com",
      pass: "ostyygulkadbjicg",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: "dubeyajitesh07@gmail.com",
    to: req.user.email,
    subject: "CONFIRMATION MAIL FOR SCHEDULED APPOINTMENT",
    text: "Thank you for choosing us",
    html: '<b>THANK YOU FOR TRUSTING US</b>,<br/><hr/> <img src="cid:unique@kreata.ee"/> <br/><p>REPLY TO THIS MESSAGE FOR ANY QUERIES.</p><p>We will try to reach out to you as soon as possible</p>',
    attachments: [
      {
        filename: "thankyou.jpeg",
        path: "./thankyou.jpeg",
        cid: "unique@kreata.ee", //same cid value as in the html img src
      },
    ],
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.json({ status: "notok" });
    } else {
      console.log("Email sent: " + info.response);
      res.json({ status: "ok" });
    }
  });
});

// MAIN CODE
// const secretKey = "sk_test_secret_api_key";    //secret key for stripe.js jo top mei likha hu

app.get("/api/home/userData", async (req, res) => {
  res.json({
    userData: req.user,
  });
});




// UPLOADING WORKER DATA TO MONGO DB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/api/uploadWorkerData", upload.single("file"), (req, res) => {

  console.log("user is ", req.user)
  console.log(JSON.parse(req.body.objectData));

  // BELOW CODE IS VERY IMPORTANT


  const worker = WorkerModel({
    // email: req.user.email,
    email: Math.floor(Math.random() * 1000),
    role: req.user.role,
    image: {
      data: fs.readFileSync("uploads/" + req.file.filename),
      contentType: "image/png",
    },
    name: JSON.parse(req.body.objectData).name,
    applicationStatus: "false",

  });
  worker
    .save()
    .then((res) => {
      console.log("image is saved");
    })
    .catch((err) => {
      console.log(err, "error has occur");
      res.send('EROOR')
    });
  res.send('image is saved')
});


app.get("/api/getWorkers", (req, res) => {
  async function workerquery() {
    const allWorker = await WorkerModel.find()
    console.log("got the query req for all workers")
    res.send(allWorker)
  }
  workerquery()
})






app.listen(1337, () => {
  console.log(`\x1b[33m   Server started on ${port}  \x1b[0m`);
});
