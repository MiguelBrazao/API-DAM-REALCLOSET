import jwt from 'jsonwebtoken';

export const logout = (req, res) => {
    // Aqui, não precisas de fazer nada no servidor porque o JWT é stateless (não é guardado no servidor).
    // A única coisa que deves fazer é garantir que o cliente pare de enviar o token.
    // No entanto, se quiseres invalidar o token ou manter uma lista negra, poderias fazer isso.

    res.status(200).send({
        message: 'Logout realizado com sucesso'
    });
}
