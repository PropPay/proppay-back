import multer from "multer";
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import Image from '../models/Image.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__dirname.substring(0,36));

//const uploadDir = path.join(os.tmpdir(), 'uploads');

/* if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
} */

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'tmp');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

export const upload = multer({ storage: storage });

const postImage = (async (req, res) => {
    try {
        const imagePath = req.file ? req.file.path : null;
        console.log(imagePath);
        if (!imagePath) {
            return res.status(400).send('Aucun fichier image téléchargé.');
        }

        const { title, description } = req.body; // Ajoutez les autres données ici

        // Convertissez le chemin d'accès en base 64
        const imagePathBase64 = Buffer.from(imagePath).toString('base64');
        console.log(imagePathBase64);
        // Enregistrez le chemin d'accès imagePathBase64 et les autres données dans MongoDB
        const image = new Image({
            imagePath: imagePath,
            title: title,
            description: description
        });

        await image.save();

        res.send('Image et données téléchargées avec succès.');
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

        // Construisez le chemin absolu en utilisant path.join
        const absoluteImagePath = path.join(__dirname.substring(0,36), image.imagePath);

        // Envoyez l'image en tant que réponse
        console.log(absoluteImagePath);
        res.sendFile(absoluteImagePath);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération de l\'image.');
    }
});


export { getImage, postImage };

