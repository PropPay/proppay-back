import mimeTypes from 'mime-types';
import multer from "multer";
import path from "path";
import Image from '../models/Image.js';
import { uploadDo } from './middleware/createOceanFolderMiddleware.js';

// Configurations Multer pour le stockage des fichiers temporaires
const storage = multer.memoryStorage(
    {
        destination: function (req, file, cb) {
            cb(null, 'tmp/uploads');
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    });

//export const upload = multer({ storage: storage });

const postImage = (async (req, res) => {
    try {
        await uploadDo('profile','photos de profil')(req, res, async function (error) {
            if (error) {
                console.log(error);
            }
            console.log(req.file);
            const image = new Image({
                image: req.file.location
            })
            await image.save()
        })
        /* const imageFile = req.files['images'][0];
        const pdfFile = req.files['pdfs'][0];
        const { title, description } = req.body;

        const tmpFile = tmp.fileSync();
        fs.writeFileSync(tmpFile.name, imageFile.buffer);
        fs.writeFileSync(tmpFile.name, pdfFile.buffer);

        console.log(req.files);
        const image = new Image({
            image: {
                imagePath: imageFile.originalname,
                data: imageFile.buffer,
            },
            pdf: {
                pdfPath: pdfFile.originalname,
                data: pdfFile.buffer,
            },
            title: title,
            description: description
        }); */

        res.status(201).json({
            message: 'Image et données téléchargées avec succès.',
        })

    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors du téléchargement de l\'image et des données.');
    }
});

const getImage = (async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) {
            return res.status(404).send('Image non trouvée.');
        }

        // Utilisez l'extension du fichier pour déterminer le type MIME
        const fileExtension = path.extname(image.imagePath).slice(1);
        const mimeType = mimeTypes.lookup(fileExtension) || 'application/octet-stream';

        res.set('Content-Type', mimeType); // Assurez-vous de définir le type MIME approprié
        
        res.send(image);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération de l\'image.');
    }
});


export { getImage, postImage };

