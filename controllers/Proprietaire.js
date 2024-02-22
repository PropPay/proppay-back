import bcrypt from 'bcrypt';
import fs from "fs";
import jwt from "jsonwebtoken";
import mimeTypes from 'mime-types';
import path from "path";
import tmp from "tmp";
import Landlord from '../models/Proprietaire.js';
import Propriety from '../models/Propriete.js';

// Fonction pour créer un jeton JWT
const createToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "100000h", // Durée de validité du token
    });
};

const addTenant = (async (req, res) => {
    try {
        const number = req.body.tenantNumber
        const locataire = {
            tenantFirstname: req.body.tenantFirstname,
            tenantLastname: req.body.tenantLastname,
            appartementNumber: req.body.appartementNumber,
            tenantRent: req.body.tenantRent,
            appartementType: req.body.appartementType
        }

        const landlord = await Landlord.findOne({ landlordNumber: req.params.landlordNumber });
        landlord.listOfTenants.set(number, locataire)
        await landlord.save();

        res.status(200).json({ message: 'Élément ajouté avec succès' });
        console.log(landlord.listOfTenants);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'élément' });
    }
})

const ajouterPropriete = (async (req, res) => {
    try {
        const proprietyId = req.params.LandlordNumber + '-' + req.body.ProprieteName
        const propriety = {
            ProprietyName: req.body.ProprietyName,
            ProprietyAdress: req.body.ProprietyAdress,
            ProprietyType: req.body.ProprietyType,
            ProprietyImages: req.body.ProprietyImages,
            proprietyOccupation: req.body.proprietyOccupation,
            proofOfPropriety: req.body.proofOfPropriety
        }

        const landlord = await Landlord.findOne({ landlordNumber: req.params.landlordNumber });
        landlord.listeLocataire.set(proprietyId, propriety)
        await landlord.save();

        res.status(200).json({ message: 'Élément ajouté avec succès' });
        console.log(landlord.listeLocataire);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'élément' });
    }
})

const confirmLandlordPassword = (async (req, res) => {
    try {
        await Landlord.findOne({ landlordNumber: req.params.landlordNumber })
            .then(
                async user => {
                    if (!user) {
                        return res.status(500).json({ message: "user n'existe pas" })
                    }
                    const valid = await bcrypt.compare(req.body.landlordPassword, user.landlordPassword)
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

const deleteLandlord = (async (req, res) => {
    const landlord = await Landlord.findOne({ landlordNumber: req.params.landlordNumber })
    await Landlord.deleteOne({ _id: landlord._id.toString() }).then(result => res.send(result))
})

const getLandlords = ((req, res) => {
    Landlord.find({}).then(item => res.send(item))
})

const getLandlord = (async (req, res) => {
    await Landlord.findOne({ landlordNumber: req.params.landlordNumber }).then(
        item => {
            if (!item) {
                res.send("user doesn't exit")
            }
            res.send(item);
        })
})

const getPhotoProfil = (async (req, res) => {
    try {
        const landlord = await Landlord.findOne({landlordNumber: req.params.landlordNumber});
        if (!landlord) {
            return res.status(404).send('user non trouvé.');
        }

        // Utilisez l'extension du fichier pour déterminer le type MIME
        const fileExtension = path.extname(landlord.profilImage.imagePath).slice(1);
        const mimeType = mimeTypes.lookup(fileExtension) || 'application/octet-stream';

        res.set('Content-Type', mimeType); // Assurez-vous de définir le type MIME approprié
        
        res.send(landlord.profilImage.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération de l\'image.');
    }
});

const getLandlordProprietiesImages = (async (req, res) => {
    try {
        const landlord = await Landlord.findOne({landlordNumber: req.params.landlordNumber});
        if (!landlord) {
            return res.status(404).send('user not find.');
        }

        const proprieties = landlord.listOfProprieties
        if (!proprieties) {
            return res.status(404).send('no proprieties images find')
        }

        const proprietiesImages = await Promise.all(proprieties.map(async (proprietyId) => {
            const propriety = await Propriety.findOne({proprietyName: proprietyId});
            const fileExtension = path.extname(propriety.proprietyImages.imagePath).slice(1);
            const mimeType = mimeTypes.lookup(fileExtension) || 'application/octet-stream';
            res.set('Content-Type', mimeType);
            return propriety.proprietyImages.data
        }));

        // Utilisez l'extension du fichier pour déterminer le type MIME
        /* const fileExtension = path.extname(propriety.ProprietyImages.imagePath).slice(1);
        const mimeType = mimeTypes.lookup(fileExtension) || 'application/octet-stream';

        res.set('Content-Type', mimeType); */ // Assurez-vous de définir le type MIME approprié
        console.log(proprietiesImages);
        res.send(proprietiesImages[2]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération de l\'image.');
    }
});

const getLandlordProprietiesInfo = (async (req, res) => {
    try {
        const landlord = await Landlord.findOne({landlordNumber: req.params.landlordNumber});
        if (!landlord) {
            return res.status(404).send('user not find.');
        }

        const proprieties = landlord.listOfProprieties
        if (!proprieties) {
            return res.status(404).send('no proprieties find')
        }

        const proprietiesInfo = await Promise.all(proprieties.map(async (proprietyId) => {
            const propriety = await Propriety.findOne({proprietyName: proprietyId});
            return {
                proprietyName: propriety.proprietyName,
                proprietyAdress: propriety.proprietyAdress,
                proprietyType: propriety.proprietyType
            }
        }));

        console.log(proprietiesInfo);
        res.send(proprietiesInfo)
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération de l\'image.');
    }
})

const updateProfil = (async (req, res) => {
    try {
        const tmpFile = tmp.fileSync();
        fs.writeFileSync(tmpFile.name, req.file.buffer);

        await Landlord.findOne({ landlordNumber: req.params.landlordNumber })
            .then(async user => {
                if (!user) {
                    return res.status(500).json({ message: "user n'existe pas" })
                }
                user.landlordFirstname = req.body.landlordFirstname,
                    user.landlordLastname = req.body.landlordLastname,
                    user.landlordAdress = req.body.landlordAdress,
                    user.identityCard = {
                        pdfPath: req.file.originalname,
                        data: req.file.buffer
                    }
                await user.save();
                res.send(user)
            }
            )
    } catch (error) {
        console.log(error);
    }
})

const updateProfilImage = (async (req, res) => {
    try {
        const tmpFile = tmp.fileSync();
        fs.writeFileSync(tmpFile.name, req.file.buffer);

        await Landlord.findOne({ landlordNumber: req.params.landlordNumber })
            .then(async user => {
                if (!user) {
                    return res.status(500).json({ message: "user n'existe pas" })
                }
                user.profilImage = {
                    imagePath: req.file.originalname,
                    data: req.file.buffer,
                }
                await user.save();
                res.send(user)
            }
            )
    } catch (error) {
        console.log(error);
    }
})

const updateLandlordPassword = (async (req, res) => {
    try {
        await Landlord.findOne({ landlordNumber: req.params.landlordNumber })
            .then(
                async user => {
                    if (!user) {
                        return res.status(500).json({ message: "user n'existe pas" })
                    }
                    if (req.body.landlordPassword !== req.body.landlordPasswordC) {
                        return res.status(500).json({ message: 'entrez le même mot de passe' })
                    }
                    await bcrypt.hash(req.body.landlordPassword, 10)
                        .then(hash_new => {
                            user.landlordPassword = hash_new
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

const updateLandlordNumber = (async (req, res) => {
    try {
        await Landlord.findOne({ _id: req.params._id })
            .then(
                landlord => {
                    landlord.LandlordNumber = req.body.landlordNumber;
                    landlord.save();
                    res.send(landlord)
                }
            )
            .catch(error => console.log(error))
    } catch (error) {
        console.log(error);
    }
})

const signupLandlord = (async (req, res) => {
    try {
        const number = await Landlord.findOne({ landlordNumber: req.body.landlordNumber });
        if (number) {
            return res.json({ message: "User already exists" });
        }
        if (req.body.landlordPassword === req.body.landlordPasswordC) {
            bcrypt.hash(req.body.landlordPassword, 10)
                .then(async hash => {
                    const landlord = await new Landlord({
                        landlordFirstname: req.body.landlordFirstname,
                        landlordLastname: req.body.landlordLastname,
                        landlordNumber: req.body.landlordNumber,
                        landlordPassword: hash,
                    })
                    await landlord.save()
                        .then(() => {
                            const token = createToken(user._id);
                            console.log("inscrit");
                            res.status(201).json({
                            message: 'user enregistré !',
                            data: landlord,
                            token : token
                        })})
                        .catch(error => res.status(400).json({
                            message : "non inscrit",
                            error }));
                    console.log(landlord);
                })
                .catch(error => res.status(500).json({
                    message : "no hash",
                    error }))
        }
    } catch (error) {
        console.log(error);
    }
})

const signinLandlord = (async (req, res) => {
    await Landlord.findOne({ landlordNumber: req.body.landlordNumber }).then(
        landlord => {
            if (landlord == null) {
                res.status(500).json({
                    status: "500",
                    message: 'user et / ou mot de passe incorrect'
                })
            } else {
                bcrypt.compare(req.body.landlordPassword, landlord.landlordPassword)
                    .then(valid => {
                        console.log(valid);
                        if (valid == false) {
                            console.log("password");
                            res.status(400).json({
                                status: "400",
                                message: 'user et / ou mot de passe incorrect'
                            })
                        } else {
                            const token = createToken(landlord._id);
                            console.log("con");
                            return res.status(201).json({
                                status: "201",
                                data: landlord,
                                token : token,
                                message: 'connected'
                            })
                        }
                    })
                .catch(error => res.json({
                    message : "no compare",
                    error }))
            }
        })
})

export { addTenant, confirmLandlordPassword, deleteLandlord, getLandlord, getLandlordProprietiesImages, getLandlordProprietiesInfo, getLandlords, getPhotoProfil, signinLandlord, signupLandlord, updateLandlordNumber, updateLandlordPassword, updateProfil, updateProfilImage };

