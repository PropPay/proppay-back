import mongoose from "mongoose";

const Locataire = mongoose.model('locataires', {
    locataireNumber: {
        type: String,
        unique: true,
        required: [true, "Your Locataire number is required"],
    },
    locataireNom: {
        type: String,
        required: [true, "Your Locataire name is required"],
    },
    locatairePrenom: {
        type: String,
        required: [true, "Your Locataire prename is required"],
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