const mongoose = require('mongoose')

const ChatSchema = new mongoose.Schema(
	{
        msg:String,
        owner:{
            id:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"user"
            },
            username:String,
        },
        created:{type:Date, default:Date.now}
	},
	{ collection: 'chats' }
)


module.exports = mongoose.model('Chat', ChatSchema)
