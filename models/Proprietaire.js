import mongoose from "mongoose";

const Proprietaire = mongoose.model('proprietaires', {
    proprietaireNumber: {
        type: String,
        unique: true,
        required: [true, "Your Proprietaire number is required"],
    },
    proprietaireFullname: {
        type: String,
        required: [true, "Your Proprietaire fullname is required"],
    },
    proprietaireAdress: {
        type: String
    },
    urlImage: {
        type: String,
        default: ''
    },
    proprietairePassword: {
        type: String
    }
});

export default Proprietaire ;