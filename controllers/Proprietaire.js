import bcrypt from 'bcrypt';
import Proprietaire from '../models/Proprietaire.js';


const getProprietaires = ((req, res) => {
    Proprietaire.find({}).then(item => res.send(item))
})

const getProprietaire = (async (req, res) => {
    await Proprietaire.findOne({ proprietaireNumber: req.params.proprietaireNumber }).then(
        item => {
            if (!item) {
                res.send("user doesn't exit")
            }
            res.send(item);
        })
})

const signupProprietaire = (async (req, res) => {
    try {
        const number = await Proprietaire.findOne({ proprietaireNumber: req.body.proprietaireNumber });
        if (number) {
            return res.json({ message: "User already exists" });
        }
        if (req.body.proprietairePassword === req.body.proprietairePasswordC) {
            bcrypt.hash(req.body.proprietairePassword, 10)
            .then(async hash => {
                const proprietaire = await new Proprietaire({
                    proprietaireFirstname: req.body.proprietaireFirstname,
                    proprietaireLastname: req.body.proprietaireLastname,
                    proprietaireNumber: req.body.proprietaireNumber,
                    proprietairePassword: hash,
                })
                await proprietaire.save()
                    .then(() => res.status(201).json({
                        message: 'user enregistré !',
                        data: proprietaire
                    }))
                    .catch(error => res.status(400).json({ error }));
                console.log(proprietaire);
            })
            .catch(error => res.status(500).json({ error }))
        }
    } catch (error) {
        console.log(error);
    }
})

const signinProprietaire = (async (req, res) => {
    await Proprietaire.findOne({ proprietaireNumber: req.body.proprietaireNumber }).then(
        proprietaire => {
            if (proprietaire == null) {
                res.status(500).json({
                    status: "500",
                    message: 'user et / ou mot de passe incorrect'
                })
            } else {
                bcrypt.compare(req.body.proprietairePassword, proprietaire.proprietairePassword)
                    .then(valid => {
                        console.log('valid');
                        if (valid == false) {
                            res.status(400).json({
                                status: "400",
                                message: 'user et / ou mot de passe incorrect'
                            })
                        } else {
                            return res.status(201).json({
                                status: "201",
                                data: proprietaire,
                                message: 'connected'
                            })
                        }
                    })
                    .catch(error => res.json({ error }))
            }
        })
})

const confirmProprietairePassword = (async (req,res) => {
    try {
        await Proprietaire.findOne({ proprietaireNumber : req.params.proprietaireNumber })
            .then(
                async user => {
                    if (!user) {
                        return res.status(500).json({ message: "user n'existe pas" })
                    }
                    const valid = await bcrypt.compare(req.body.proprietairePassword, user.proprietairePassword)
                    if (!valid) {
                        return res.status(500).json({ message: 'mot de passe incorrect' })
                    }
                    return res.status(201).json({ message: 'mot de passe correct' })
                }
            )
            .catch(error => console.log(error))
    } catch (error) {
        console.log(error);
    }
})


const updateProprietairePassword = (async (req,res) => {
    try {
        await Proprietaire.findOne({ proprietaireNumber : req.params.proprietaireNumber })
            .then(
                async user => {
                    if (!user) {
                        return res.status(500).json({ message: "user n'existe pas" })
                    }
                    if (req.body.proprietairePassword !== req.body.proprietairePasswordC) {
                        return res.status(500).json({ message: 'entrez le même mot de passe' })
                    }
                    await bcrypt.hash(req.body.proprietairePassword, 10)
                        .then(hash_new => {
                            user.proprietairePassword = hash_new
                            user.save();
                            res.send(user)
                        })
                }
            )
            .catch(error => console.log(error))
    } catch (error) {
        console.log(error);
    }
})

const updateProprietaireNumber = (async (req, res) => {
    try {
        await Proprietaire.findOne({ _id: req.params._id })
            .then(
                proprietaire => {
                    proprietaire.ProprietaireNumber = req.body.proprietaireNumber;
                    proprietaire.save();
                    res.send(proprietaire)
                }
            )
            .catch(error => console.log(error))
    } catch (error) {
        console.log(error);
    }
})

const ajouterLocataire = (async (req,res) => {
    try {
        const number = req.body.locataireNumber
        const locataire = {
            locataireFirstname: req.body.locataireFirstname,
            locataireLastname: req.body.locataireLastname,
            appartementNumber: req.body.appartementNumber,
            loyerLocataire: req.body.loyerLocataire,
            appartementType: req.body.appartementType
        }

        const proprietaire = await Proprietaire.findOne({proprietaireNumber: req.params.proprietaireNumber});
        proprietaire.listeLocataire.set(number,locataire)
        await proprietaire.save();

        res.status(200).json({ message: 'Élément ajouté avec succès' });
        console.log(proprietaire.listeLocataire);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'élément' });
    }
})

const ajouterPropriete = (async (req,res) => {
    try {
        const proprieteId = req.params.proprietaireNumber+'-'+req.body.ProprieteName
        const propriete = {
            ProprieteName: req.body.ProprieteName,
            ProprieteAdress: req.body.ProprieteAdress,
            ProprieteType: req.body.ProprieteType,
            ProprieteImages: req.body.ProprieteImages,
            OccupationPropriete: req.body.OccupationPropriete,
            PreuveDePropriete: req.body.PreuveDePropriete
        }

        const proprietaire = await Proprietaire.findOne({proprietaireNumber: req.params.proprietaireNumber});
        proprietaire.listeLocataire.set(proprieteId,propriete)
        await proprietaire.save();

        res.status(200).json({ message: 'Élément ajouté avec succès' });
        console.log(proprietaire.listeLocataire);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'élément' });
    }
})

const deleteProprietaire = (async (req, res) => {
    const proprietaire = await Proprietaire.findOne({ proprietaireNumber: req.params.proprietaireNumber })
    await Proprietaire.deleteOne({ _id: proprietaire._id.toString() }).then(result => res.send(result))
})

export { ajouterLocataire, confirmProprietairePassword, deleteProprietaire, getProprietaire, getProprietaires, signinProprietaire, signupProprietaire, updateProprietaireNumber, updateProprietairePassword };

