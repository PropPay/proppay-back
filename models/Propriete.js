import mongoose from "mongoose";

const Propriete = mongoose.model('proprietes', {
    ProprieteName: {
        type: String,
        required: [true, "The Propriety fullname is required"],
    },
    ProprieteAdress: {
        type: String,
        required: [true, "The Propriety adress is required"],
    },
    ProprieteType: {
        type: String,
        required: [true, "The Propriety type is required"],
    },
    ProprieteImages: {
        type: String
    },
    OccupationPropriete: {
        type: Boolean,
        required: [true, "'Is a propriety' occupied is requiried"]
    },
    PreuveDePropriete: {
        type: String
    }
});

export default Propriete ;