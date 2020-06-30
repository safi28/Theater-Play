const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  likedPlays: [{ type: mongoose.Types.ObjectId, ref: "Play" }]
})

module.exports = mongoose.model("User", userSchema)
