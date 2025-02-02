import Db from '../servicos/db.js';
import sql from 'mssql';

function capitalizeFirstChar(str) {
    if (str.length === 0) return str; // Handle empty string
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Todos os Utilizadores
export const fetchUsers = async () => {
    const request = Db.poolConnection.request();
    const result = await request.query(`SELECT * FROM Utilizadores`);
    return result.recordset
}

// Utilizador específico 
export const fetchUserById = async ({ id }) => {
    const request = Db.poolConnection.request();
    const result = await request
        .input('id', sql.Int, +id)
        .query(`SELECT * FROM Utilizadores WHERE UtilizadorID = @id`);
    return result.recordset
}

// Buscar utilizador pelo email
export const fetchUserByEmail = async (email) => {
    const request = Db.poolConnection.request();
    const result = await request
        .input('email', sql.NVarChar(255), email)
        .query(`SELECT * FROM Utilizadores WHERE Email = @email`);
    return result.recordset; // Retorna o array de utilizadores encontrados
};

// Apagar utilizador 
export const deleteUserById = async ({ id }) => {
    const request = Db.poolConnection.request();
    const result = await request
        .input('id', sql.Int, +id)
        .query(`DELETE FROM Utilizadores WHERE UtilizadorID = @id`);
    return result
}

// Editar utilizador
export const updateUserById = async ({ id, data }) => {
    const request = Db.poolConnection.request();
    let query = []
    for (const [k, v] of Object.entries(data)) {
        request.input(capitalizeFirstChar(k), v);
        query.push(`${k}=@${k}`)
    }

    request.input('id', sql.Int, +id);

    const result = await request.query(
        `UPDATE Utilizadores SET ${query.join(', ')} WHERE UtilizadorID = @id`
    );

    return result.rowsAffected[0];
}

// Criar utilizador
export const createUser = async ({ data }) => {
    const request = Db.poolConnection.request();

    request.input('Nome', sql.NVarChar(255), data.nome);
    request.input('Apelido', sql.NVarChar(255), data.apelido);
    request.input('DataNascimento', sql.Date, data.dataNascimento);  // Corrigido: Não precisa de 255 aqui
    request.input('TipoDePerfil', sql.NVarChar(255), data.tipoDePerfil);
    request.input('Email', sql.NVarChar(255), data.email);
    request.input('Password', sql.NVarChar(255), data.password);
    request.input('Admin', sql.Bit, data.admin);  // Corrigido: Passar como sql.Bit e valor booleano

    const result = await request.query(
        `INSERT INTO Utilizadores (Nome, Apelido, DataNascimento, TipoDePerfil, Email, Password, Admin) 
         VALUES (@Nome, @Apelido, @DataNascimento, @TipoDePerfil, @Email, @Password, @Admin)`
    );

    return result;
};
