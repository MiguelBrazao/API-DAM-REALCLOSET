import Db from '../servicos/db.js';
import sql from 'mssql';

// Todas as peças 
export const fetchAllPecas = async () => {
    const request = Db.poolConnection.request();
    const result = await request.query(`SELECT * FROM Pecas`);
    return result.recordset
}

// Todas as peças 
export const fetchPecasByUserId = async (utilizadorId) => {
    const request = Db.poolConnection.request();
    const result = await request
        .input('utilizadorId', sql.Int, utilizadorId) // Define a variável como input seguro
        .query(`SELECT * FROM Pecas WHERE UtilizadorID = @utilizadorId`);
    return result.recordset;
};



// Todas as peças de utilizadores com perfil público
export const fetchPublicPecas = async () => {
    const request = Db.poolConnection.request();
    const result = await request.query(`
        SELECT p.* 
        FROM Pecas p
        INNER JOIN Utilizadores u ON p.UtilizadorID = u.UtilizadorID
        WHERE u.TipoDePerfil = 'publico'
    `);
    return result.recordset;
};

// Busca a peça especifica
export const fetchPecaById  = async ({ id }) => {
    const request = Db.poolConnection.request();
    const result = await request
        .input('id', sql.Int, +id)
        .query(`SELECT * FROM Pecas WHERE PecaID = @id`);
    return result.recordset
}

// Apagar peça 
export const deletePecaById = async ( {id} ) => {

    const request = Db.poolConnection.request();
    const result = await request
        .input('id', sql.Int, +id)
        .query(`
            DELETE FROM Pecas 
            WHERE PecaID = @id
        `);

    return result.rowsAffected[0];  // Retorna o número de linhas afetadas
}


export const updatePecaById = async ({ pecaId, data }) => {
    const request = Db.poolConnection.request();
    let query = [];

    // Construir a query dinamicamente
    for (const [key, value] of Object.entries(data)) {
        request.input(key, value); // Adicionar os valores à query
        query.push(`${key} = @${key}`); // Adicionar os pares campo = valor
    }

    // Adicionar parâmetros principais
    request.input('pecaId', sql.Int, +pecaId);

    // Executar a query
    const result = await request.query(`
        UPDATE Pecas
        SET ${query.join(', ')}
        WHERE PecaID = @pecaId 
    `);

    return result.rowsAffected[0]; // Retorna o número de linhas afetadas
};


// Criar peça
export const createPeca = async ({ data , utilizadorId }) => {
    const request = Db.poolConnection.request();

    request.input('Titulo', sql.NVarChar(100), data.Titulo);
    request.input('Imagem', sql.NVarChar(255), data.Imagem);
    request.input('Marca', sql.NVarChar(255), data.Marca);
    request.input('Referencia', sql.NVarChar(255), data.Referencia);
    request.input('Categoria', sql.NVarChar(255), data.Categoria);
    request.input('UtilizadorID', sql.Int, utilizadorId);


    const result = await request.query(
        `INSERT INTO Pecas (Titulo, Imagem, Marca, Referencia, Categoria, UtilizadorID) VALUES (@Titulo, @Imagem, @Marca, @Referencia, @Categoria, @UtilizadorID)`
    );


    return result
}