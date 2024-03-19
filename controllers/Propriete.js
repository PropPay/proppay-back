import Landlord from "../models/Proprietaire.js";
import Propriety from "../models/Propriete.js";

const addPropriety = (async (req, res) => {
    try {

        let proofOfPropriety;
        let proprietyImages;
        /* uploadFieldName('propay-storage/proprieties')(req, res, function (err) {
            if (err) {
                console.error('Error uploading files to DigitalOcean Spaces:', err);
                return res.status(500).send('Error uploading files to DigitalOcean Spaces');
            }
            // Files uploaded successfully
            proprietyImages = req.files['fieldName1'][0].location;
            proofOfPropriety = req.files['fieldName2'][0].location;
            //copyFile('propay-storage/proprieties',req.files['fieldName2'][0].key,'propay-storage/preuves',req.files['fieldName2'][0].key)
        }); */
        const obj = JSON.parse(JSON.stringify(req.body));
        console.log(obj);
        // Ajouter la propriété dans la base de données 'propriétés
        const propriety = await new Propriety({
            proprietyId: req.params.landlordNumber + '-' + req.body.proprietyName,
            proprietyName: req.body.proprietyName,
            proprietyAdress: req.body.proprietyAdress,
            proprietyType: req.body.proprietyType,
            proprietyImages: proprietyImages,
            proprietyOccupation: req.body.proprietyOccupation,
            proofOfPropriety: proofOfPropriety
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

        const proprietyId = req.params.landlordNumber + '-' + req.body.proprietyName

        const landlord = await  Landlord.findOne({ landlordNumber: req.params.landlordNumber });
        landlord.listOfProprieties.push(proprietyId)
        await landlord.save();

        res.status(200).json({ message: 'Élément ajouté avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'élément' });
    }
}) 

const getProprieties = (async (req, res) => {
    await Propriety.find({}).then(item => res.send(item))
})

const getPropriety = (async (req, res) => {
    await Propriety.findOne({ _id: req.params.id }).then(item => res.send(item))
})

const deletePropriety = (async (req, res) => {
    const propriety = await Propriety.findOne({ _id: req.params.id })
    await Propriety.deleteOne({ _id: propriety._id.toString() }).then(result => res.send(result))
})

export { addPropriety, deletePropriety, getProprieties, getPropriety };

