import bcrypt from 'bcrypt';
import Locataire from '../models/Locataire.js';


const getLocataires = ((req, res) => {
    Locataire.find({}).then(item => res.send(item))
})

const getLocataire = (async (req, res) => {
    await Locataire.findOne({ locataireNumber: req.params.locataireNumber }).then(
        item => {
            if (!item) {
                res.send("user doesn't exit")
            }
            res.send(item);
        })
})

const signupLocataire = (async (req, res) => {
    try {
        const number = await Locataire.findOne({ locataireNumber: req.body.locataireNumber });
        if (number) {
            return res.json({ message: "User already exists" });
        }
        if (req.body.locatairePassword === req.body.locatairePasswordC) {
            bcrypt.hash(req.body.locatairePassword, 10)
            .then(async hash => {
                const locataire = await new Locataire({
                    locataireFullname: req.body.locataireFullname,
                    locataireNumber: req.body.locataireNumber,
                    locatairePassword: hash,
                })
                await locataire.save()
                    .then(() => res.status(201).json({
                        message: 'user enregistré !',
                        data: locataire
                    }))
                    .catch(error => res.status(400).json({ error }));
                console.log(locataire);
            })
            .catch(error => res.status(500).json({ error }))
        }
    } catch (error) {
        console.log(error);
    }
})

const signinLocataire = (async (req, res) => {
    await Locataire.findOne({ locataireNumber: req.body.locataireNumber }).then(
        locataire => {
            if (locataire == null) {
                res.status(500).json({
                    status: "500",
                    message: 'user et / ou mot de passe incorrect'
                })
            } else {
                bcrypt.compare(req.body.locatairePassword, locataire.locatairePassword)
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
                                data: locataire,
                                message: 'connected'
                            })
                        }
                    })
                    .catch(error => res.json({ error }))
            }
        })
})

const confirmLocatairePassword = (async (req,res) => {
    try {
        await Locataire.findOne({ locataireNumber : req.params.locataireNumber })
            .then(
                async user => {
                    if (!user) {
                        return res.status(500).json({ message: "user n'existe pas" })
                    }
                    const valid = await bcrypt.compare(req.body.locatairePassword, user.locatairePassword)
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


const updateLocatairePassword = (async (req,res) => {
    try {
        await Locataire.findOne({ locataireNumber : req.params.locataireNumber })
            .then(
                async user => {
                    if (!user) {
                        return res.status(500).json({ message: "user n'existe pas" })
                    }
                    if (req.body.locatairePassword !== req.body.locatairePasswordC) {
                        return res.status(500).json({ message: 'entrez le même mot de passe' })
                    }
                    await bcrypt.hash(req.body.locatairePassword, 10)
                        .then(hash_new => {
                            user.locatairePassword = hash_new
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

const updateLocataireNumber = (async (req, res) => {
    try {
        await Locataire.findOne({ _id: req.params._id })
            .then(
                Locataire => {
                    locataire.locataireNumber = req.body.locataireNumber;
                    Locataire.save();
                    res.send(locataire)
                }
            )
            .catch(error => console.log(error))
    } catch (error) {
        console.log(error);
    }
})

const deleteLocataire = (async (req, res) => {
    const Locataire = await Locataire.findOne({ LocataireNumber: req.params.LocataireNumber })
    await Locataire.deleteOne({ _id: Locataire._id.toString() }).then(result => res.send(result))
})

export { confirmLocatairePassword, deleteLocataire, getLocataire, getLocataires, signinLocataire, signupLocataire, updateLocataireNumber, updateLocatairePassword };

