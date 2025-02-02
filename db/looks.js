import Db from '../servicos/db.js';
import sql from 'mssql';

// Todos os looks de um utilizador com as peças associadas
export const fetchLooksByUserId = async (utilizadorId) => {
    const request = Db.poolConnection.request();

    try {
        // Executa a query SQL
        const result = await request
            .input('UtilizadorID', sql.Int, utilizadorId)
            .query(`
                SELECT 
                    l.LookID, 
                    l.Nome AS LookNome, 
                    p.PecaID, 
                    p.Titulo, 
                    p.Imagem, 
                    p.Marca, 
                    p.Referencia, 
                    p.Categoria
                FROM 
                    Looks l
                LEFT JOIN 
                    LookPecas lp ON l.LookID = lp.LookID
                LEFT JOIN 
                    Pecas p ON lp.PecaID = p.PecaID
                WHERE 
                    l.UtilizadorID = @UtilizadorID
            `);

        // Agrupar os resultados por LookID
        const looksGrouped = result.recordset.reduce((acc, row) => {
            const { LookID, LookNome, PecaID, Titulo, Imagem, Marca, Referencia, Categoria } = row;

            // Verificar se o look já existe no acumulador
            if (!acc[LookID]) {
                acc[LookID] = {
                    LookID,
                    LookNome,
                    Pecas: [] // Inicializa o array de peças
                };
            }

            // Adicionar a peça se existir
            if (PecaID) {
                acc[LookID].Pecas.push({
                    PecaID,
                    Titulo,
                    Imagem,
                    Marca,
                    Referencia,
                    Categoria
                });
            }

            return acc;
        }, {});

        // Retornar os Looks agrupados
        return Object.values(looksGrouped);
    } catch (error) {
        console.error('Erro ao buscar looks do utilizador:', error.message);
        throw error;
    }
};

// Vai buscar todos os looks
export const fetchAllLooks = async () => {
    const request = Db.poolConnection.request();

    const result = await request.query(`
        SELECT 
            l.LookID, 
            l.Nome, 
            p.PecaID, 
            p.Titulo, 
            p.Imagem, 
            p.Marca, 
            p.Referencia, 
            p.Categoria
        FROM 
            Looks l
        LEFT JOIN 
            LookPecas lp ON l.LookID = lp.LookID
        LEFT JOIN 
            Pecas p ON lp.PecaID = p.PecaID
        ORDER BY 
            l.LookID;
    `);

    // Agrupar os looks com as peças associadas
    const looksGrouped = result.recordset.reduce((acc, row) => {
        const { LookID, LookNome, PecaID, Titulo, Imagem, Marca, Referencia, Categoria } = row;

        // Verificar se o look já existe no acumulador
        if (!acc[LookID]) {
            acc[LookID] = {
                LookID,
                LookNome,
                Pecas: [] // Inicializar o array de peças
            };
        }

        // Adicionar a peça ao look, se existir
        if (PecaID) {
            acc[LookID].Pecas.push({
                PecaID,
                Titulo,
                Imagem,
                Marca,
                Referencia,
                Categoria
            });
        }

        return acc;
    }, {});

    // Retornar os looks agrupados
    return Object.values(looksGrouped);
};

// Vai buscar um look específico de um utilizador, com as peças associadas
export const fetchLookById = async (lookId) => {
    const request = Db.poolConnection.request();

    // Query para buscar o look específico e as peças associadas
    const result = await request
        .input('LookID', sql.Int, lookId)
        .query(`
            SELECT l.LookID, l.Nome AS LookNome, 
                   p.PecaID, p.Titulo, p.Imagem, p.Marca, p.Referencia, p.Categoria
            FROM Looks l
            LEFT JOIN LookPecas lp ON l.LookID = lp.LookID
            LEFT JOIN Pecas p ON lp.PecaID = p.PecaID
            WHERE  l.LookID = @LookID
        `);

    // Agrupar os resultados por LookID e adicionar as peças no array 'Pecas'
    const looksGrouped = result.recordset.reduce((acc, row) => {
        const { LookID, LookNome, PecaID, Titulo, Imagem, Marca, Referencia, Categoria } = row;

        // Verificar se o look já existe no acumulador
        if (!acc[LookID]) {
            acc[LookID] = {
                LookID,
                LookNome,
                Pecas: []  // Array de peças associadas ao look
            };
        }

        // Adicionar a peça no array de Pecas do look
        if (PecaID) {
            acc[LookID].Pecas.push({
                PecaID,
                Titulo,
                Imagem,
                Marca,
                Referencia,
                Categoria
            });
        }

        return acc;
    }, {});

    // Retornar o Look específico agrupado, se existir
    return Object.values(looksGrouped)[0] || null; // Retorna o look específico ou null caso não exista
};

// Apagar look e as suas relações na tabela LookPecas
export const deleteLookById = async (lookId) => {
    const request = Db.poolConnection.request();

    try {
        // Exclui o look da tabela Looks
        const result = await request
            .input('LookID', sql.Int, lookId)
            .query(`
                DELETE FROM Looks WHERE LookID = @LookID
            `);

        if (result.rowsAffected[0] > 0) {
            return true; // Look removido com sucesso
        } else {
            return false; // Look não encontrado ou não pertence ao utilizador
        }

    } catch (error) {
        console.error('Erro ao tentar apagar o look:', error);
        throw error;
    }
};

// Criar um novo look e associar as peças
export const createLook = async ({ utilizadorId, nomeLook, pecas }) => {
    const transaction = new sql.Transaction(Db.poolConnection);

    try {
        await transaction.begin(); // Iniciar a transação

        const request = transaction.request();

        // Inserir o novo look na tabela Looks
        const lookResult = await request
            .input('UtilizadorID', sql.Int, utilizadorId)
            .input('Nome', sql.NVarChar(100), nomeLook)
            .query(`
                INSERT INTO Looks (UtilizadorID, Nome)
                OUTPUT INSERTED.LookID
                VALUES (@UtilizadorID, @Nome)
            `);

        const lookId = lookResult.recordset[0].LookID; // Obter o ID do look recém-criado

        // Inserir as peças associadas ao look na tabela LookPecas
        for (const pecaId of pecas) {
            await transaction.request()
                .input('LookID', sql.Int, lookId)
                .input('PecaID', sql.Int, pecaId)
                .query(`
                    INSERT INTO LookPecas (LookID, PecaID)
                    VALUES (@LookID, @PecaID)
                `);
        }

        await transaction.commit(); // Confirmar a transação
        return lookId; // Retornar o ID do look criado

    } catch (error) {
        await transaction.rollback(); // Reverter a transação em caso de erro
        console.error('Erro ao criar o look:', error);
        throw error;
    }
};



