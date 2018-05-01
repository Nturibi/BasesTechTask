const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;




const app = express();
const jsonParser = bodyParser.json();

app.use(express.static('public'));


async function main() {
	const DATABASE_NAME = 'bases-db';
	const MONGO_URL = `mongodb://localhost:27017/${DATABASE_NAME}`;
	db = await MongoClient.connect(process.env.MONGODB_URI || MONGO_URL);
	profilesCollection = db.collection("profiles");
	const port = process.env.PORT || 3000;
	await app.listen(port);
	console.log(`Server listening on port ${port}!`);
}
main();


async function onAddUser(req, res) {
  const message = req.body;
  const allSimilar = await profilesCollection.findOne({username: message.username});

  let isTaken =  true;
  if (allSimilar== null) isTaken = false;

  if (!isTaken) await profilesCollection.insertOne(message);

  const cursor = await profilesCollection.find({year: message.year});
  const classMates = await cursor.toArray();
  const obj ={};
  obj.classMates = classMates;
  obj.isTaken = isTaken;
  res.json(obj);
}

app.post('/adduser', jsonParser,onAddUser);
