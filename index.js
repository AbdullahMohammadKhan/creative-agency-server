
// app.listen(process.env.PORT || port);

const express = require("express");
const app = express();
const port = 4000;
var bodyParser = require("body-parser");
var cors = require("cors");
const fs=require("fs-extra");
const fileUpload = require("express-fileupload");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("doctors"));
app.use(fileUpload());
//data

const password = "abdullah";

const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://abdullah:abdullah@cluster0.rmegi.mongodb.net/agency?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.get("/", (req, res) => {
  res.send("hello from app it's working working");
});
client.connect((err) => {
  const adminsCollection = client.db("agency").collection("admins");
  const ordersCollection = client.db("agency").collection("orders");
  const reviewsCollection = client.db("agency").collection("reviews");
  const servicesCollection = client.db("agency").collection("services");
  // perform actions on the collection object
  console.log("database connection established");

  //orders //

  app.post("/orders", (req, res) => {
    const order = req.body;
    console.log(order);
    ordersCollection
      .insertOne(order)
      .then((result) => {
        //console.log(result);
        res.send(result.insertedCount > 0);
      })
      .catch((err) => console.log(err));
  });

  // reviews //

  app.post("/reviews", (req, res) => {
    const order = req.body;
    console.log(order);
    reviewsCollection
      .insertOne(order)
      .then((result) => {
        //console.log(result);
        res.send(result.insertedCount > 0);
      })
      .catch((err) => console.log(err));
  });

  app.get("/reviews", (req, res) => {
    reviewsCollection.find({}).toArray((err, documents) => {
      console.log(documents);
      res.send(documents);
    });
  });
  // orders //
  app.get("/orders", (req, res) => {
    ordersCollection.find({}).toArray((err, documents) => {
      console.log(documents);
      res.send(documents);
    });
  });

  
  app.post("/addservices", (req, res) => {
    const file = req.files.file;
    const title = req.body.title;
    const description = req.body.description;
    
    const newImg = file.data
    const encImg = newImg.toString("base64");

      var image = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, "base64"),
    };
    servicesCollection
      .insertOne({ title, description, image })
      .then((result) => {
        
             res.send(result.insertedCount > 0);
          
        })
    
  });

 
  app.get("/services", (req, res) => {
    servicesCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  // make admin //
  app.post("/makeadmin", (req, res) => {
    const order = req.body;
    console.log(order);
    adminsCollection
      .insertOne(order)
      .then((result) => {
        //console.log(result);
        res.send(result.insertedCount > 0);
      })
      .catch((err) => console.log(err));
  });

  /// is admin ///
  app.post("/isadmin", (req, res) => {
    console.log(req.body.email);
    const email = req.body.email;
    adminsCollection.find({ mail: email }).toArray((err, admins) => {
      res.send(admins.length > 0);
    });
  });

  // service by name //
  app.post("/ordersByMail", (req, res) => {
    //const date = req.body;
    const email = req.body.email;
    console.log("email:" + email);

    ordersCollection.find({ email: email }).toArray((err, doc) => {
      console.log("doc:" + doc);
      res.send(doc);
    });
  });
});

// app.listen(port || process.env.PORT, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });

 app.listen( port || process.env.PORT );