import express from 'express';
const routerImage = express.Router()

import {
    getImage,
    postImage, upload
} from '../controllers/Image.js';


routerImage.post('/upload', upload.fields([
    { name: 'images', maxCount: 1 },
    { name: 'pdfs', maxCount: 1 }]), postImage)
routerImage.get('/upload/:id',getImage)


export default routerImage