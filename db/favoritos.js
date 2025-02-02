import Db from '../servicos/db.js';
import sql from 'mssql';

// Todos os Favoritos
export const fetchFavoritos = async (utilizadorId) => {
    const request = Db.poolConnection.request();

    // Query para buscar as peças favoritas de um utilizador
    const result = await request
        .input('UtilizadorID', sql.Int, utilizadorId)
        .query(`
            SELECT f.FavoritoID, f.PecaID, p.Titulo, p.Imagem, p.Marca, p.Referencia, p.Categoria
            FROM Favoritos f
            JOIN Pecas p ON f.PecaID = p.PecaID
            WHERE f.UtilizadorID = @UtilizadorID
        `);

    return result.recordset; // Retorna as peças favoritas
};


// Remover favorito pelo ID da peça e UtilizadorID
export const removeFavorito = async ({ utilizadorId, pecaId }) => {
    const request = Db.poolConnection.request();

    const result = await request
        .input('utilizadorId', sql.Int, +utilizadorId)
        .input('pecaId', sql.Int, +pecaId)
        .query(`
            DELETE FROM Favoritos
            WHERE PecaID = @pecaId AND UtilizadorID = @utilizadorId
        `);

    return result.rowsAffected[0]; // Retorna o número de linhas afetadas
};



// Adicionar favorito
export const addFavorito = async ({ utilizadorId, pecaId }) => {
    const request = Db.poolConnection.request();

    // Definir os parâmetros
    request.input('UtilizadorID', sql.Int, utilizadorId);
    request.input('PecaID', sql.Int, pecaId);

    // Inserir na tabela Favoritos
    const result = await request.query(`
        INSERT INTO Favoritos (UtilizadorID, PecaID)
        VALUES (@UtilizadorID, @PecaID)
    `);

    return result.rowsAffected[0]; // Retorna o número de linhas afetadas
};
