import express from 'express';
import { addPropriety } from '../controllers/Propriete.js';
const routerPropriety = express.Router()



routerPropriety.post('/add', addPropriety)
/* routerImage.get('/upload/:id',getImage) */


export default routerPropriety