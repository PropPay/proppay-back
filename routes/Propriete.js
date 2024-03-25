import express from 'express';
import { addPropriety, deletePropriety, getProprieties, getPropriety } from '../controllers/Propriete.js';
const routerPropriety = express.Router()


routerPropriety.get('/:id', getPropriety)
routerPropriety.get('/', getProprieties)
routerPropriety.post('/add', addPropriety)
routerPropriety.delete('/:id', deletePropriety)
/* routerImage.get('/upload/:id',getImage) */


export default routerPropriety