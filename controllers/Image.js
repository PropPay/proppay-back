import fs from "fs";
import multer from "multer";
import path, { dirname } from 'path';
import tmp from "tmp";
import { fileURLToPath } from 'url';
import Image from '../models/Image.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//const uploadDir = path.join(os.tmpdir(), 'uploads');

/* if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
} */

/* const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

export const upload = multer({ storage: storage }); */

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
        /* const imagePath = req.file ? req.file.path : null;
        console.log(imagePath);
        if (!imagePath) {
            return res.status(400).send('Aucun fichier image téléchargé.');
        }

        const { title, description } = req.body; // Ajoutez les autres données ici

        // Convertissez le chemin d'accès en base 64
        const imagePathBase64 = Buffer.from(imagePath).toString('base64');
        console.log(imagePathBase64);
        // Enregistrez le chemin d'accès imagePathBase64 et les autres données dans MongoDB */
        const { title, description } = req.body;
        const tmpFile = tmp.fileSync();
        fs.writeFileSync(tmpFile.name, req.file.buffer);

        /* const tempDir = await fs.mkdtemp(path.join('/tmp', 'uploads-'));
        const tempFilePath = path.join(tempDir, req.file.originalname);

        await fs.writeFile(tempFilePath, req.file.buffer); */

        // Faites quelque chose avec le fichier temporaire, par exemple, le stocker en base de données

        // Supprimez le répertoire temporaire après utilisation  await fs.rmdir(tempDir, { recursive: true });
       

        const image = new Image({
            imagePath: req.file.originalname,
            data: req.file.buffer,
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
        const absoluteImagePath = path.join(__dirname.substring(0, 36), image.imagePath);

        // Envoyez l'image en tant que réponse
        console.log(absoluteImagePath);
        res.sendFile(absoluteImagePath);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération de l\'image.');
    }
});


export { getImage, postImage };

