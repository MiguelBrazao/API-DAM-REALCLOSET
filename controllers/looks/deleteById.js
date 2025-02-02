import * as DbLooks from '../../db/looks.js';

export default async (req, res) => {
    const { id } = req.params;  
    const { utilizadorId } = req.query;

    try {

        //verificações se é admin ou utilizador dono da peça
        if (peca.utilizadorId !== utilizadorId || !req.user.admin){
            return res.status(401).json({ status: 'nok', erro: 'Não tem permissão para remover' });
        }

        const deleted = await DbLooks.deleteLookById(id);
        
        if (deleted) {
            return res.status(200).json({ message: 'Look apagado com sucesso.' });
        } else {
            return res.status(404).json({ message: 'Look não encontrado ou não pertence ao utilizador.' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao tentar apagar o look.' });
    }
};

