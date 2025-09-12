import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    senderType: { type: String, enum: ['admin', 'user'], required: true },
    senderId: { type: String, required: true },  // luôn lưu dưới dạng string (admin = 'admin', userId = user._id.toString())
    receiverType: { type: String, enum: ['admin', 'user'], required: true },
    receiverId: { type: String, required: true }, 
    message: { type: String, required: true, trim: true },
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false },
    messageType: { type: String, enum: ['text', 'image', 'file'], default: 'text' },
    metadata: {
        fileName: String,
        fileSize: Number,
        fileType: String,
        imageUrl: String
    }
}, { timestamps: true });

// Index để tăng hiệu suất query
chatSchema.index({ senderId: 1, receiverId: 1, timestamp: -1 });
chatSchema.index({ timestamp: -1 });

// Virtual để lấy thông tin người gửi
chatSchema.virtual('senderInfo', {
    ref: 'user',
    localField: 'senderId',
    foreignField: '_id',
    justOne: true,
    match: function() {
        return this.senderId !== 'admin';
    }
});

// Virtual để lấy thông tin người nhận  
chatSchema.virtual('receiverInfo', {
    ref: 'user',
    localField: 'receiverId',
    foreignField: '_id',
    justOne: true,
    match: function() {
        return this.receiverId !== 'admin';
    }
});

// Method để format thời gian
chatSchema.methods.getFormattedTime = function() {
    return this.timestamp.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Method để kiểm tra xem tin nhắn có phải từ admin không
chatSchema.methods.isFromAdmin = function() {
    return this.senderId === 'admin';
};

// Static method để lấy conversation giữa 2 user
chatSchema.statics.getConversation = function(userId1, userId2, limit = 50) {
    return this.find({
        $or: [
            { senderId: userId1, receiverId: userId2 },
            { senderId: userId2, receiverId: userId1 }
        ]
    })
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate('senderId', 'name image')
    .populate('receiverId', 'name image');
};

// Static method để lấy tin nhắn chưa đọc
chatSchema.statics.getUnreadMessages = function(userId) {
    return this.find({
        receiverId: userId,
        isRead: false
    }).sort({ timestamp: -1 });
};

const chatModel = mongoose.models.chat || mongoose.model('chat', chatSchema);

export default chatModel;