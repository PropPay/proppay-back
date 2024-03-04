import axios from 'axios';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import fs from "fs";
import jwt from "jsonwebtoken";
import mimeTypes from 'mime-types';
import path from "path";
import tmp from "tmp";
import Landlord from '../models/Proprietaire.js';
import Propriety from '../models/Propriete.js';
import { generateOTP } from './middleware/otpMiddleware.js';


// constante pour recuperer le code envoyé
let otpSend = "";
// Fonction pour créer un jeton JWT
const createToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "24h", // Durée de validité du token
    });
};

// Fonction pour valider le code (à implémenter selon vos besoins)
function isValidCode(userId, enteredCode) {
    if (userId == enteredCode) {
        return true;
    }
    return false;
}

// Stocker le nombre de demandes et les timestamps côté serveur
let requestsCount = {};
let codeTimestamps = {};

// Les différents endpoints

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

const sendAuthOTP =  (async (req, res) => {
    try {

        dotenv.config({ path: './config/.env' })

        // le userNumber represente le msisdn
        const userNumber = req.body.userNumber
        const userNumberCount = userNumber.substring(6)

        if (requestsCount[userNumberCount] && requestsCount[userNumberCount] >= 2) {
            const timeDifference = new Date() - codeTimestamps[userNumberCount];
            if (timeDifference < 24 * 60 * 60 * 1000) { // 5 minutes en millisecondes
                return res.send("Limite de demandes atteinte. Attendez un moment avant de demander un nouveau code.");
            }
        }

        // Fonction pour créer un OTP
        const otpCode = generateOTP();

        // les éléments du body
        const userName = process.env.USER_NAME;
        const password = process.env.PASSWORD;
        const serviceid = process.env.SERVICEID;
        const sender = process.env.SENDER;
        const msg = `Votre code de sécurité pour [Nom de l'application] est : ${otpCode}. Valable [durée, ex: 5 min]. Ne partagez pas.`

        // Stocker le timestamp actuel
        codeTimestamps[userNumberCount] = new Date();

        // Incrémenter le compteur de demandes
        requestsCount[userNumberCount] = (requestsCount[userNumberCount] || 0) + 1;

        // l'api externe de m target
        const apiExterne = `https://api-public-2.mtarget.fr/messages?username=${userName}&password=${password}&serviceid=${serviceid}&msisdn=${userNumber}&sender=${sender}&msg=${msg}`;

        /* const body = {
            "username": username,
            "password": password,
            "serviceid": serviceid,
            "msisdn": msisdn,
            "sender": sender,
            "msg": msg
        } */

        await axios.post(apiExterne, {
            headers: {
                "Content-Type" : "application/x-www-form-urlencoded"
            }})
            .then(resp => {
                otpSend = otpCode;
                res.status(201).json(
                    {
                        data : otpSend,
                        message : "otpSend"
                    })})
            .catch(error =>
                {
                    res.send("no otpSend");
                    console.log(error)});
    } catch (error) {
        console.log(error);
    }
})

const verifyAuthOTP = (async (req, res) => {

    const { otpCode,userNumber } = req.body;
    const userNumberCount = userNumber.substring(4)

    // Vérifier si l'utilisateur a demandé un code récemment
    if (codeTimestamps[userNumberCount]) {
        const timeDifference = new Date() - codeTimestamps[userNumberCount];
        if (timeDifference > 5 * 60 * 1000) { // 5 minutes en millisecondes
            return res.send("Le code a expiré.");
        }
    }
    
    // Vérifier si le code est correct (à implémenter selon vos besoins)
    if (isValidCode(otpSend, otpCode)) {
        // Réinitialiser le compteur de demandes
        requestsCount[userNumberCount] = 0;
        return res.send("Code de vérification valide.");
    }
    res.send("Code de vérification invalide.");
});

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
                            const token = createToken(landlord._id);
                            console.log("inscrit");
                            res.status(201).json({
                            message: 'user enregistré !',
                            data: landlord,
                            token : token
                        })})
                        .catch(error => res.status(400).json({
                            message : "non inscrit",
                            error }));
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
                        if (!valid) {
                            console.log("password");
                            res.status(400).json({
                                status: "400",
                                message: 'user et / ou mot de passe incorrect'
                            })
                        }
                        if (valid) {
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

export { addTenant, confirmLandlordPassword, deleteLandlord, getLandlord, getLandlordProprietiesImages, getLandlordProprietiesInfo, getLandlords, getPhotoProfil, sendAuthOTP, signinLandlord, signupLandlord, updateLandlordNumber, updateLandlordPassword, updateProfil, updateProfilImage, verifyAuthOTP };

