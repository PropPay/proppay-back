import express from 'express';
const routerLocataire = express.Router()

import {
    confirmLocatairePassword,
    deleteLocataire,
    getLocataire,
    getLocataires,
    signinLocataire,
    signupLocataire,
    updateLocataireNumber,
    updateLocatairePassword
} from '../controllers/Locataire.js';


routerLocataire.get('/', getLocataires)
routerLocataire.get('/:locataireNumber', getLocataire)

routerLocataire.post('/signup', signupLocataire)
routerLocataire.post('/signin', signinLocataire)
routerLocataire.post('/confirm/password/:locataireNumber', confirmLocatairePassword)

routerLocataire.put('/:_id', updateLocataireNumber)
routerLocataire.put(('/update-password/:locataireNumber'), updateLocatairePassword)
routerLocataire.delete('/:locataireNumber', deleteLocataire)

export default routerLocataire