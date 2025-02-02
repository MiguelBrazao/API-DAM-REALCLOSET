import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    // Pegar o token do cabeçalho Authorization
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ status: 'nok', erro: 'Acesso negado. Token não fornecido.' });
    }
    console.log(token)
    try {
        // Verificar se o token é válido
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SdJcD}E~9geY<*n=X.?2y`');
        req.user = decoded; // Salvar os dados do utilizador no req.user

        next(); // Continuar para a próxima função de rota
    } catch (err) {
        return res.status(401).json({ status: 'nok', erro: 'Token inválido.' });
    }
};
