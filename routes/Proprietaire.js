import express from 'express';
const routerProprietaire = express.Router()

import {
    confirmProprietairePassword,
    deleteProprietaire,
    getProprietaire,
    getProprietaires,
    signinProprietaire,
    signupProprietaire,
    updateProprietaireNumber,
    updateProprietairePassword
} from '../controllers/Proprietaire.js';


routerProprietaire.get('/', getProprietaires)
routerProprietaire.get('/:proprietaireNumber', getProprietaire)

routerProprietaire.post('/signup', signupProprietaire)
routerProprietaire.post('/signin', signinProprietaire)
routerProprietaire.post('/confirm/password/:proprietaireNumber', confirmProprietairePassword)

routerProprietaire.put('/:_id', updateProprietaireNumber)
routerProprietaire.put(('/update-password/:proprietaireNumber'), updateProprietairePassword)
routerProprietaire.delete('/:proprietaireNumber', deleteProprietaire)

export default routerProprietaire