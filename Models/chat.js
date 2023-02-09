const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
  },
  message: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 500,
  }
});
const Chat = mongoose.model("Chat", chatSchema);

exports.Chat = Chat;
