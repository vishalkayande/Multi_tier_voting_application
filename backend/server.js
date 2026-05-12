const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());

// Connect to MongoDB using the container name 'db'
mongoose.connect("mongodb://db:27017/votingDB")
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(err));

const VoteSchema = new mongoose.Schema({ party: String, count: { type: Number, default: 0 } });
const Vote = mongoose.model("Vote", VoteSchema);

// Initializing data if empty
const initData = async () => {
    const counts = await Vote.countDocuments();
    if (counts === 0) {
        await Vote.insertMany([{ party: "BJP", count: 0 }, { party: "INC", count: 0 }]);
    }
};
initData();

app.post("/vote", async (req, res) => {
    const { party } = req.body;
    await Vote.findOneAndUpdate({ party }, { $inc: { count: 1 } });
    res.json({ success: true });
});

app.get("/results", async (req, res) => {
    const data = await Vote.find();
    res.json(data);
});

app.listen(80, () => console.log("API on port 80"));