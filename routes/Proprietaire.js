import express from 'express';
const routerLandlord = express.Router()

import {
    addTenant,
    confirmLandlordPassword,
    deleteLandlord,
    getLandlord,
    getLandlords,
    signinLandlord,
    signupLandlord,
    updateLandlordNumber,
    updateLandlordPassword,
    updateProfil,
    updateProfilImage
} from '../controllers/Proprietaire.js';
import { upload } from '../controllers/Propriete.js';


routerLandlord.get('/', getLandlords)
routerLandlord.get('/:landlordNumber', getLandlord)

routerLandlord.post('/signup', signupLandlord)
routerLandlord.post('/signin', signinLandlord)
routerLandlord.post('/confirm/password/:landlordNumber', confirmLandlordPassword)

routerLandlord.put('/add-tenant/:landlordNumber', addTenant)
routerLandlord.put('/:_id', updateLandlordNumber)
routerLandlord.put(('/update-password/:landlordNumber'), updateLandlordPassword)
routerLandlord.put(('/update-profil/:landlordNumber'),upload.single('identity'), updateProfil)
routerLandlord.put(('/photo-profil/:landlordNumber'), upload.single('profile'), updateProfilImage)

routerLandlord.delete('/:landlordNumber', deleteLandlord)

export default routerLandlord