const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://makanianandi21:NewSecurePassword123@cluster0.uscyi.mongodb.net/?retryWrites=true&w=majority";

async function connectToDatabase() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    // Access or create a database
    const database = client.db("RideShare");

    // Access or create a collection
    const collection = database.collection("users");

    console.log("Database and collection are ready!");

    // Perform operations, e.g., insert a document
    await collection.insertOne({ name: "John Doe", email: "john.doe@example.com" });
    console.log("Document inserted!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    await client.close();
  }
}

connectToDatabase();
