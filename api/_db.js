const mongoose = require("mongoose");

let conn = null;

const VoteSchema = new mongoose.Schema({ option: String, count: { type: Number, default: 0 } });
const Vote = mongoose.model("Vote", VoteSchema);

exports.connectDB = async () => {
  if (conn) return { conn, Vote };

  conn = await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  });

  const counts = await Vote.countDocuments();
  if (counts === 0) {
    await Vote.insertMany([{ option: "Yes", count: 0 }, { option: "No", count: 0 }]);
  }

  return { conn, Vote };
};
