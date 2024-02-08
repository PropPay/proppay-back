import express from 'express';
import { addPropriety, upload } from '../controllers/Propriete.js';
const routerPropriety = express.Router()



routerPropriety.post('/add/:landlordNumber', upload.fields([
    { name: 'proprietyImages', maxCount: 1 },
    { name: 'proofOfPropriety', maxCount: 1 }]), addPropriety)
/* routerImage.get('/upload/:id',getImage) */


export default routerPropriety