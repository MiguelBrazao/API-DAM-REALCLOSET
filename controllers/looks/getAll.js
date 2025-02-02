import * as DbLooks from '../../db/looks.js';

export default async (req, res) => {
    const { utilizadorId } = req.query;

    if (utilizadorId) {
        try {
            const looks = await DbLooks.fetchLooksByUserId(utilizadorId);
            return res.status(200).json(looks);
        } catch (e) {
            return res.status(500).json({ status: 'nok', erro: e.message });
        }
    } else {
        try {
            const looks = await DbLooks.fetchAllLooks();
            return res.status(200).json(looks);
        } catch (e) {
            return res.status(500).json({ status: 'nok', erro: e.message });
        }
    }
};
