let folderName = "azertys";
let nameFile = "profile"

function modifierVariable(newFolderName,newNameFile) {
    folderName = newFolderName;
    nameFile = newNameFile;
}

const updateUploadSettings = (newFolderName, newNameFile) => {
    return (req, res, next) => {
        // Mettez à jour les valeurs de folderName et nameFile
        folderName = newFolderName;
        nameFile = newNameFile;
        // Appelez next() pour passer à l'étape suivante (c'est-à-dire l'exécution du middleware suivant)
        next();
    };
};
export { folderName, modifierVariable, nameFile, updateUploadSettings };

