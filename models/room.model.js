const mongoose = require('mongoose');

var roomSchema = new mongoose.Schema({
    _id: String,
    _id_message: {
        type: mongoose.Schema.Types.ObjectId, ref: 'chat'
    },
});

mongoose.model('room', roomSchema);