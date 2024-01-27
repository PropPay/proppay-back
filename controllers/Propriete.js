import fs from "fs";
import multer from "multer";
import tmp from "tmp";
import Proprietaire from "../models/Proprietaire.js";
import Propriete from "../models/Propriete.js";


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

const addPropriete = (async (req, res) => {
    try {

        const imageFile = req.files['ProprieteImages'][0];
        const pdfFile = req.files['PreuveDePropriete'][0];

        const tmpFile = tmp.fileSync();
        fs.writeFileSync(tmpFile.name, imageFile.buffer);
        fs.writeFileSync(tmpFile.name, pdfFile.buffer);
        
        // Ajouter la propriété dans la base de données 'propriétés
        const propriete = await new Propriete({
            ProprieteName: req.params.proprietaireNumber + '-' +req.body.ProprieteName,
            ProprieteAdress: req.body.ProprieteAdress,
            ProprieteType: req.body.ProprieteType,
            ProprieteImages: {
                imagePath: imageFile.originalname,
                data: imageFile.buffer,
            },
            OccupationPropriete: req.body.OccupationPropriete,
            PreuveDePropriete: {
                pdfPath: pdfFile.originalname,
                data: pdfFile.buffer,
            }
        })
        await propriete.save()

        // Ajouter la propriété dans le champ 'listePropriete' du locataire
        
            /* const proprieteValeur = {
                ProprieteName: req.body.ProprieteName,
                ProprieteAdress: req.body.ProprieteAdress,
                ProprieteType: req.body.ProprieteType,
                ProprieteImages: req.body.ProprieteImages,
                OccupationPropriete: req.body.OccupationPropriete,
                PreuveDePropriete: req.body.PreuveDePropriete
            } */

        const proprieteId = req.params.proprietaireNumber + '-' + req.body.ProprieteName

        const proprietaire = await Proprietaire.findOne({ proprietaireNumber: req.params.proprietaireNumber });
        proprietaire.listePropriete.push(proprieteId)
        await proprietaire.save();

        res.status(200).json({ message: 'Élément ajouté avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'élément' });
    }
})

const getProprietes = (async (req, res) => {
    await Propriete.find({}).then(item => res.send(item))
})

const getPropriete = (async (req, res) => {
    await Propriete.findOne({ _id: req.params.id }).then(item => res.send(item))
})

const deletePropriete = (async (req, res) => {
    const propriete = await Propriete.findOne({ _id: req.params.id })
    await propriete.deleteOne({ _id: propriete._id.toString() }).then(result => res.send(result))
})

export { addPropriete, deletePropriete, getPropriete, getProprietes };

