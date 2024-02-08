import mongoose from "mongoose";

const Notification = mongoose.model('notifications', {
    titleNotification: {
        type: String,
    },
    contentNotification: {
        type: String,
    },
    dateNotification: {
        type: Date,
        default: Date.now,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
});

export default Notification;