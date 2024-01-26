import fs from "fs";
import multer from "multer";
import tmp from "tmp";
import Image from '../models/Image.js';

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

export const upload = multer({ storage: storage });

const postImage = (async (req, res) => {
    try {
        
        const { title, description } = req.body;
        const tmpFile = tmp.fileSync();
        fs.writeFileSync(tmpFile.name, req.file.buffer);

        const image = new Image({
            imagePath: req.file.originalname,
            data: req.file.buffer,
            title: title,
            description: description
        });

        await image.save();

        res.send('Image et données téléchargées avec succès.');
        res.status(201).json({ filename: req.file.originalname })
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors du téléchargement de l\'image et des données.');
    }
});

const getImage = (async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image || !image.imagePath) {
            return res.status(404).send('Image non trouvée.');
        }

        res.set('Content-Type', 'image/jpeg'); // Assurez-vous de définir le type MIME approprié
        res.send(image.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération de l\'image.');
    }
});


export { getImage, postImage };

