import sql from 'mssql';
import { passwordConfig } from './db_config.js'

class Database {
  config = {};
  poolconnection = null;
  connected = false;

  constructor() {
    passwordConfig.options.port = +passwordConfig.options.port
    this.config = passwordConfig;
  }

  async connect() {
    try {
      this.poolconnection = await sql.connect(this.config);
      this.connected = true;
      console.log('Database connected successfully.');
      return this.poolconnection;
    } catch (error) {
      console.error('Error connecting to the database:', error);
      this.connected = false;
    }
  }

  get poolConnection() {
    return this.poolconnection
  }

  async disconnect() {
    try {
      if (this.connected) {
        await this.poolconnection.close();
        this.connected = false;
        console.log('Database disconnected successfully.');
      }
    } catch (error) {
      console.error('Error disconnecting from the database:', error);
    }
  }
}

const db = new Database()
export default db