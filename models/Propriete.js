import mongoose from "mongoose";

const Propriety = mongoose.model('proprietes', {
    proprietyId: {
        type: String,
    },
    proprietyName: {
        type: String,
        required: [true, "The Propriety fullname is required"],
    },
    proprietyAdress: {
        type: String,
        required: [true, "The Propriety adress is required"],
    },
    proprietyType: {
        type: String,
        required: [true, "The Propriety type is required"],
    },
    proprietyImages: {
        imagePath: String,
        data: Buffer,
    },
    proprietyOccupation: {
        type: Boolean,
        required: [true, "'Is a propriety' occupied is requiried"]
    },
    proofOfPropriety: {
        pdfPath: String,
        data: Buffer,
    }
});

export default Propriety ;