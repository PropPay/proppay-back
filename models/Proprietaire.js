import mongoose from "mongoose";

const Proprietaire = mongoose.model('proprietaires', {
    proprietaireNumber: {
        type: String,
        unique: true,
        required: [true, "Your Proprietaire number is required"],
    },
    proprietaireFirstname: {
        type: String,
        required: [true, "Your proprietaire name is required"],
    },
    proprietaireLastname: {
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
    },
    listeLocataire: {
        type: Map,
        of:Map,
        default: {}
    },
    listePropriete: {
        type: [String],
        default: []
    }
});

export default Proprietaire ;