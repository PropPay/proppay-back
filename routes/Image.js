import express from 'express';
const routerImage = express.Router()

import {
    getImage,
    postImage, upload
} from '../controllers/Image.js';


routerImage.post('/upload', upload.single('images'), postImage)
routerImage.get('/upload/:id',getImage)


export default routerImage