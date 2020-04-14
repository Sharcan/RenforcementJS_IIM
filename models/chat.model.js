const mongoose = require('mongoose');

var chatSchema = new mongoose.Schema({
    _id_room: {
        type: String
    },
    sender: String,
    content: String
});

mongoose.model('chat', chatSchema);