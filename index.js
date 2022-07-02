const express = require('express')
const cors = require('cors');
require('dotenv').config();
const app = express()
const {
  MongoClient,
  ServerApiVersion,
  ObjectId
} = require('mongodb');
const port = process.env.PORT || 4000;

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r2lfm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1
});


async function run() {
  try {
    await client.connect();
    const dataCollection = client.db("dailytask").collection("data");

    app.get("/datas", async (req, res) => {
      const query = {};
      const cursor = dataCollection.find(query);
      const data = await cursor.toArray();
      res.send(data);
    });

    app.post("/createTodo", async (req, res) => {
      const todo = req.body;
      const result = await dataCollection.insertOne(todo);
      res.send(result);
    });

    app.put("/data/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      console.log("from data update", data);

      console.log("from put", id);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };

      const updateDoc = {
        $set: {
          title: data.title,
        },
      };
      const result = await dataCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

  } finally {}
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Daily Task app listening on port ${port}`)
})