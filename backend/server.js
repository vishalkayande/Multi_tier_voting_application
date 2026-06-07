const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());

// Connect to MongoDB using the container name 'db'
mongoose.connect("mongodb://db:27017/votingDB")
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(err));

const VoteSchema = new mongoose.Schema({ option: String, count: { type: Number, default: 0 } });
const Vote = mongoose.model("Vote", VoteSchema);

// Initializing data if empty
const initData = async () => {
    const counts = await Vote.countDocuments();
    if (counts === 0) {
        await Vote.insertMany([{ option: "Yes", count: 0 }, { option: "No", count: 0 }]);
    }
};
initData();

app.post("/vote", async (req, res) => {
    const { option } = req.body;
    await Vote.findOneAndUpdate({ option }, { $inc: { count: 1 } });
    res.json({ success: true });
});

app.get("/results", async (req, res) => {
    const data = await Vote.find();
    res.json(data);
});

app.listen(80, () => console.log("API on port 80"));