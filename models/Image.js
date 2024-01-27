import mongoose from "mongoose";

const Image = mongoose.model('images', {
    image: {
        imagePath: {
            type: String,
        },
        data: Buffer,
    },
    pdf: {
        pdfPath: {
            type: String,
        },
        data: Buffer,
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
});

export default Image;