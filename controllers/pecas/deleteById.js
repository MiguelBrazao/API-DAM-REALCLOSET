import * as DbPecas from '../../db/pecas.js';

export default async (req, res) => {
    const { pecaId } = req.params; // Obter o id da peça a ser eliminada
    const utilizadorId = req.user.id; // vai buscar o utilizador logado


    // Validar os parâmetros
    if (!pecaId) {
        return res.status(400).json({ status: 'nok', erro: 'Missing peça id' });
    }

    try {

        // Verificar se a peça existe
        const peca = await DbPecas.fetchPecaById({ id: pecaId });

        if (!peca || !peca.length) {
            return res.status(404).json({ status: 'nok', erro: 'Peça does not exist or does not belong to the user' });
        }

        //verificações se é admin ou utilizador dono da peça
        if (peca[0].UtilizadorID !== utilizadorId && !req.user.admin){
            return res.status(401).json({ status: 'nok', erro: 'Não tem permissão para remover' });
        }
        
        // Apagar a peça
        const rowsAffected = await DbPecas.deletePecaById({ id: pecaId });

        if (!rowsAffected) {
            return res.status(500).json({ status: 'nok', erro: 'Failed to delete peça' });
        }

        // Responder com sucesso
        return res.status(200).json({ status: 'ok' });
    } catch (e) {
        console.error('Error deleting peça:', e.stack);
        return res.status(500).json({ status: 'nok', erro: e.message });
    }
};
