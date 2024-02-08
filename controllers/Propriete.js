import fs from "fs";
import multer from "multer";
import tmp from "tmp";
import Landlord from "../models/Proprietaire.js";
import Propriety from "../models/Propriete.js";


// Configurations Multer pour le stockage des fichiers temporaires
const storage = multer.memoryStorage(
    {
        destination: function (req, file, cb) {
            cb(null, 'tmp/uploads');
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    });

export const upload = multer({ storage: storage });

const addPropriety = (async (req, res) => {
    try {

        const imageFile = req.files['proprietyImages'][0];
        const pdfFile = req.files['proofOfPropriety'][0];

        const tmpFile = tmp.fileSync();
        fs.writeFileSync(tmpFile.name, imageFile.buffer);
        fs.writeFileSync(tmpFile.name, pdfFile.buffer);
        
        // Ajouter la propriété dans la base de données 'propriétés
        const propriety = await new Propriety({
            proprietyName: req.params.proprietaireNumber + '-' +req.body.proprietyName,
            proprietyAdress: req.body.proprietyAdress,
            proprietyType: req.body.proprietyType,
            proprietyImages: {
                imagePath: imageFile.originalname,
                data: imageFile.buffer,
            },
            proprietyOccupation: req.body.proprietyOccupation,
            proofOfPropriety: {
                pdfPath: pdfFile.originalname,
                data: pdfFile.buffer,
            }
        })
        await propriety.save()

        // Ajouter la propriété dans le champ 'listepropriety' du locataire
        
            /* const proprietyValeur = {
                proprietyName: req.body.proprietyName,
                proprietyAdress: req.body.proprietyAdress,
                proprietyType: req.body.proprietyType,
                proprietyImages: req.body.proprietyImages,
                proprietyOccupation: req.body.proprietyOccupation,
                PreuveDepropriety: req.body.PreuveDepropriety
            } */

        const proprietyId = req.params.proprietaireNumber + '-' + req.body.proprietyName

        const landlord = await Landlord.findOne({ landlordNumber: req.params.landlordNumber });
        landlord.listOfProprieties.push(proprietyId)
        await landlord.save();

        res.status(200).json({ message: 'Élément ajouté avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'élément' });
    }
})

const getProprieties = (async (req, res) => {
    await propriety.find({}).then(item => res.send(item))
})

const getPropriety = (async (req, res) => {
    await propriety.findOne({ _id: req.params.id }).then(item => res.send(item))
})

const deletePropriety = (async (req, res) => {
    const propriety = await propriety.findOne({ _id: req.params.id })
    await propriety.deleteOne({ _id: propriety._id.toString() }).then(result => res.send(result))
})

export { addPropriety, deletePropriety, getProprieties, getPropriety };

