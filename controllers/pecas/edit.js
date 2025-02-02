import * as DbPecas from '../../db/pecas.js';

export default async (req, res) => {
    const { pecaId } = req.params;
    const utilizadorId = req.user.id; // vai buscar o utilizador logado

   
    // Validar os parâmetros
    if (!pecaId || !utilizadorId) {
        return res.status(400).json({ status: 'nok', erro: 'Missing peça id or utilizador id' });
    }

    
    // Campos permitidos para atualização
    const allowedFields = ['titulo', 'imagem', 'marca', 'referencia', 'categoria'];

    // Validar os dados de atualização
    if (Object.keys(req.body).some((key) => !allowedFields.includes(key))) {
        return res.status(400).json({
            status: 'nok',
            erro: `Allowed fields are: ${allowedFields.join(', ')}`,
        });
    }

    // falta verificar se o utilizador é o dono da peça ou é admin

    try {
        // Atualizar a peça no banco de dados
        const rowsAffected = await DbPecas.updatePecaById({ pecaId, data: req.body });

        if (rowsAffected === 0) {
            return res.status(404).json({
                status: 'nok',
                erro: 'Peça não encontrada ou não pertence ao utilizador.',
            });
        }

        res.status(200).json({ status: 'ok', message: 'Peça atualizada com sucesso.' });
    } catch (error) {
        console.error('Erro ao atualizar a peça:', error);
        res.status(500).json({ status: 'nok', erro: 'Erro interno do servidor.' });
    }
};
