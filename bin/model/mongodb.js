const dotenv = require("dotenv");
dotenv.config();

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://xtreme696:${MONGODB_PASS}@cluster0.juf9x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

module.exports = {
  MongoClient,
  uri,
  client
}
