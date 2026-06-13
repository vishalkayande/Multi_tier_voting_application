const mongoose = require("mongoose");

let conn = null;
let Vote = null;

exports.connectDB = async () => {
  if (conn && mongoose.connection.readyState === 1) {
    return { conn, Vote };
  }

  const VoteSchema = new mongoose.Schema({ option: String, count: { type: Number, default: 0 } });
  Vote = mongoose.models.Vote || mongoose.model("Vote", VoteSchema);

  conn = await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  });

  const counts = await Vote.countDocuments();
  if (counts === 0) {
    await Vote.insertMany([{ option: "Yes", count: 0 }, { option: "No", count: 0 }]);
  }

  return { conn, Vote };
};
