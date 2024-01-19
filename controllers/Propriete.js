import Propriete from "../models/Propriete"

const addPropriete = (async (req, res) => {
    const propriete = await new Propriete.create({
        ProprieteName: req.body.ProprieteName,
        ProprieteAdress: req.body.ProprieteAdress,
        ProprieteType: req.body.ProprieteType,
        ProprieteImages: req.body.ProprieteImages,
        OccupationPropriete: req.body.OccupationPropriete,
        PreuveDePropriete: req.body.PreuveDePropriete
    })
})

const getProprietes = (async (req, res) => {
    await Propriete.find({}).then(item => res.send(item))
})

const getPropriete = (async (req,res) => {
    await Propriete.findOne({_id : req.params.id}).then(item => res.send(item))
})

const deletePropriete = (async (req,res) => {
    const propriete = await Propriete.findOne({ _id: req.params.id })
    await propriete.deleteOne({ _id: propriete._id.toString() }).then(result => res.send(result))
})

export { addPropriete, deletePropriete, getPropriete, getProprietes }
