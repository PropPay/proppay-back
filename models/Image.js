import mongoose from "mongoose";

const Image = mongoose.model('images', {
    imagePath: {
        type: String,
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
});

export default Image ;