import express from 'express';
import { addPropriete, upload } from '../controllers/Propriete.js';
const routerPropriete = express.Router()



routerPropriete.post('/upload/:proprietaireNumber', upload.fields([
    { name: 'ProprieteImages', maxCount: 1 },
    { name: 'PreuveDePropriete', maxCount: 1 }]), addPropriete)
/* routerImage.get('/upload/:id',getImage) */


export default routerPropriete