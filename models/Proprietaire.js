import mongoose from "mongoose";

const Landlord = mongoose.model('landlords', {
    landlordNumber: {
        type: String,
        unique: true,
        required: [true, "Your landlord number is required"],
    },
    landlordFirstname: {
        type: String,
        required: [true, "Your landlord name is required"],
    },
    landlordLastname: {
        type: String,
        required: [true, "Your landlord prename is required"],
    },
    landlordAdress: {
        type: String
    },
    profilImage: {
        imagePath: String,
        data: Buffer,
    },
    landlordPassword: {
        type: String
    },
    identityCard : {
        pdfPath: String,
        data: Buffer
    },
    listOfTenants: {
        type: Map,
        of:Map,
        default: {}
    },
    listOfProprieties: {
        type: [String],
        default: []
    }
});

export default Landlord ;