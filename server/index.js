const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const port = 5000;

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());

const client = new MongoClient(process.env.URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();

    const dataCollection = client.db("dateNote").collection("form");

    app.post("/data", async (req, res) => {
      try {
        res.send(await dataCollection.insertOne(req.body));
      } catch (error) {
        console.log(error);
      }
    });

    app.get("/data", async (req, res) => {
      try {
        const data = await dataCollection
          .find()
          .sort({ _id: -1 })
          .toArray();
        res.send(data);
      } catch (error) {
        console.log(error);
      }
    });


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. Successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("CRUD RUNNING SUCCESSFULLY");
});

app.listen(port, () => {
  console.log(`CRUD IS RUNNING ON PORT ${port}`);
});
