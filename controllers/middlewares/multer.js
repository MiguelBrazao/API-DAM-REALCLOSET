
import multer from 'multer'
import path from 'path'

// Configuração do Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Define o diretório de destino para os arquivos
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Define o nome do arquivo para o upload
        req.imageName = req.user.id + '-' + Date.now() + path.extname(file.originalname);

        cb(null, req.imageName);
    }
});

// Criação do middleware de upload com limite de 10MB por arquivo
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 10MB
}).single('file'); // Espera um único arquivo com o campo 'file'

export default upload;