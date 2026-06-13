const { connectDB } = require("./_db");

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { option } = req.body;
    const { Vote } = await connectDB();
    await Vote.findOneAndUpdate({ option }, { $inc: { count: 1 } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
