import mongoose from "mongoose";

const Locataire = mongoose.model('locataires', {
    locataireNumber: {
        type: String,
        unique: true,
        required: [true, "Your Locataire number is required"],
    },
    locataireFullname: {
        type: String,
        required: [true, "Your Locataire fullname is required"],
    },
    locataireAdress: {
        type: String
    },
    urlImage: {
        type: String,
        default: ''
    },
    locatairePassword: {
        type: String
    }
});

export default Locataire ;