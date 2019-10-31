const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    room: {
        type: String,
        required: [true, 'Reason must filled in']
    },
    chat: [{
        name: { type: String },
        message: { type: String },
        created_date: {
            type: Date,
            default: Date.now
        }
    }],
    created_date: {
        type: Date,
        default: Date.now
    }
}, { collection: 'chats' })

const Chat = mongoose.model('Chat', chatSchema)
module.exports = Chat
