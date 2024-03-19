import express from 'express';
const routerLandlord = express.Router()

import {
    addTenant,
    confirmLandlordPassword,
    deleteLandlord,
    getLandlord,
    getLandlordProprietiesImages,
    getLandlordProprietiesInfo,
    getLandlords,
    getPhotoProfil,
    sendAuthOTP,
    signinLandlord,
    signupLandlord,
    updateLandlordNumber,
    updateLandlordPassword,
    updateProfil,
    updateProfilImage,
    verifyAuthOTP
} from '../controllers/Proprietaire.js';
import { authMiddleware } from '../controllers/middleware/authMiddleware.js';


routerLandlord.get('/',authMiddleware, getLandlords)
routerLandlord.get('/:landlordNumber',authMiddleware, getLandlord)
routerLandlord.get('/photo-profil/:landlordNumber', getPhotoProfil)
routerLandlord.get('/proprieties/infos/:landlordNumber', getLandlordProprietiesInfo)
routerLandlord.get('/proprieties/image/:landlordNumber', getLandlordProprietiesImages)


routerLandlord.post('/signup', signupLandlord)
routerLandlord.post('/signin', signinLandlord)
routerLandlord.post('/confirm/password/:landlordNumber',authMiddleware, confirmLandlordPassword)
routerLandlord.post('/otp/send',sendAuthOTP)
routerLandlord.post('/otp/verify', verifyAuthOTP)

routerLandlord.put('/add-tenant/:landlordNumber',authMiddleware, addTenant)
routerLandlord.put('/:_id',authMiddleware, updateLandlordNumber)
routerLandlord.put(('/update-password/:landlordNumber'),authMiddleware, updateLandlordPassword)
routerLandlord.put(('/update-profil/:landlordNumber'), updateProfil)
routerLandlord.put(('/photo-profil/:landlordNumber'), updateProfilImage)

routerLandlord.delete('/:landlordNumber',authMiddleware, deleteLandlord)

/* upload.single('identity'),
 */

export default routerLandlord