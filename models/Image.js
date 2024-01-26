import mongoose from "mongoose";

const Image = mongoose.model('images', {
    imagePath: {
        type: String,
    },
    data: Buffer,
    title: {
        type: String,
    },
    description: {
        type: String,
    },
});

export default Image ;