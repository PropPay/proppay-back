import mongoose from "mongoose";

const Proprietaire = mongoose.model('proprietaires', {
    proprietaireNumber: {
        type: String,
        unique: true,
        required: [true, "Your Proprietaire number is required"],
    },
    proprietaireNom: {
        type: String,
        required: [true, "Your proprietaire name is required"],
    },
    proprietairePrenom: {
        type: String,
        required: [true, "Your proprietaire prename is required"],
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