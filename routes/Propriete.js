import express from 'express';
import { addPropriety, deletePropriety } from '../controllers/Propriete.js';
const routerPropriety = express.Router()


routerPropriety.get('/', addPropriety)
routerPropriety.put('/', addPropriety)
routerPropriety.post('/add', addPropriety)
routerPropriety.delete('/:id', deletePropriety)
/* routerImage.get('/upload/:id',getImage) */


export default routerPropriety