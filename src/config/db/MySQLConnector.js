import mysql from 'mysql';

class MySQLConnector {
    get MYSQL_DB_USER() {
        return process.env.MYSQL_DB_USER || 'root';
    }
    get MYSQL_DB_PASSWORD() {
        return process.env.MYSQL_DB_PASSWORD || 'Password123';
    }
    get MYSQL_DB_HOST() {
        return process.env.MYSQL_DB_HOST || 'localhost';
    }
    get MYSQL_DB_NAME() {
        return process.env.MYSQL_DB_NAME || 'meetx';
    }
    get MYSQL_DB_POOL_SIZE() {
        return process.env.MYSQL_DB_POOL_SIZE || 10;
    }

    constructor() {
        // Instantiates the connection pool
        this.internalPool = mysql.createPool({
            host: this.MYSQL_DB_HOST,
            user: this.MYSQL_DB_USER,
            password: this.MYSQL_DB_PASSWORD,
            database: this.MYSQL_DB_NAME,
            connectionLimit: this.MYSQL_DB_POOL_SIZE,
            waitForConnections: true,
        });

        this.registerThreadCounter();
    }

    /**
     * Registers an event lister to capture when new connections are oppened
     * This method uses console.log, but in an production environment you'd probably
     * use a async log write such as winston since console.log is blocking
     */
    registerThreadCounter() {
        this.internalPool.on('connection', (connection) => console.log(`New connection stablished with server on thread #${connection.threadId}`));
    }

    /**
     * Retrieves the connection pool
     */
    get pool() {
        return this.internalPool;
    }
}

// Exports the connector singleton to be used by the wrapper
export default new MySQLConnector();
