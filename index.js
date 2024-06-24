const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;
const app = express();

// CORS configuration
app.use(cors({
    origin: ['http://localhost:5173', 'https://maorygarcia.vercel.app'],
}));

// Middleware to parse JSON bodies
app.use(express.json());

// MongoDB URI
const uri = "mongodb+srv://myrogracia:zHmVm8GCI4OtGlzP@cluster0.dujofhq.mongodb.net/myrogracia?retryWrites=true&w=majority";

// Create a new MongoClient
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function run() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log("Connected to MongoDB");

        // Specify the database and collections
        const myrogracia = client.db('myrogracia');
        const menusCollection = myrogracia.collection('menus');
        const ratingsCollection = myrogracia.collection('ratings');

        // Ping MongoDB deployment
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged MongoDB deployment. You successfully connected!");

        // API endpoint to insert a menu item
        app.post('/api/v1/menus', async (req, res) => {
            const menu = req.body;

            try {
                const result = await menusCollection.insertOne(menu);
                res.status(200).json(result);
            } catch (err) {
                console.error("Error inserting menu:", err);
                res.status(500).json({ error: "Failed to insert menu item" });
            }
        });

        app.get('/api/v1', (req, res)=>{
            res.send("My server is running");
        })
        // Start the Express server
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });

    } finally {
        // Ensure the MongoDB client closes when finished/error
        // await client.close();
    }
}

run().catch(console.dir);
