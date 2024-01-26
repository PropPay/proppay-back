import Propriete from "../models/Propriete"

const addPropriete = (async (req, res) => {
    try {

        // Ajouter la propriété dans la base de données 'propriétés
        const propriete = await new Propriete.create({
            ProprieteName: req.body.ProprieteName,
            ProprieteAdress: req.body.ProprieteAdress,
            ProprieteType: req.body.ProprieteType,
            ProprieteImages: req.body.ProprieteImages,
            OccupationPropriete: req.body.OccupationPropriete,
            PreuveDePropriete: req.body.PreuveDePropriete
        })

        // Ajouter la propriété dans le champ 'listePropriete' du locataire
        const proprieteId = req.params.proprietaireNumber + '-' + req.body.ProprieteName
        const proprieteValeur = {
            ProprieteName: req.body.ProprieteName,
            ProprieteAdress: req.body.ProprieteAdress,
            ProprieteType: req.body.ProprieteType,
            ProprieteImages: req.body.ProprieteImages,
            OccupationPropriete: req.body.OccupationPropriete,
            PreuveDePropriete: req.body.PreuveDePropriete
        }

        const proprietaire = await Proprietaire.findOne({ proprietaireNumber: req.params.proprietaireNumber });
        proprietaire.listePropriete.set(proprieteId, proprieteValeur)
        await proprietaire.save();

        res.status(200).json({ message: 'Élément ajouté avec succès' });
        console.log(proprietaire.listePropriete);
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

export { addPropriete, deletePropriete, getPropriete, getProprietes }
