import * as DbLooks from '../../db/looks.js';

export default async (req, res) => {
    const { nomeLook, pecas } = req.body;
    const utilizadorId = req.user.id;

    // Validar os dados recebidos
    if (!utilizadorId || !nomeLook || !Array.isArray(pecas) || pecas.length === 0) {
        return res.status(400).json({ status: 'nok', erro: 'Dados inválidos: utilizadorId, nomeLook ou pecas em falta' });
    }

    try {
        // Chamar a função para criar o look e associar as peças
        const lookId = await DbLooks.createLook({ utilizadorId, nomeLook, pecas });

        return res.status(200).json({
            status: 'ok',
            message: 'Look criado com sucesso',
            lookId
        });
    } catch (e) {
        console.error('Erro ao criar o look:', e.stack);
        return res.status(500).json({ status: 'nok', erro: e.message });
    }
};
