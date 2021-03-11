import mySQLWrapper from './MySQLWrapper';

export default class DAO {
    /**
     * This property can be overriden when the ID column is differet from 'id'
     */
    static get PRIMARY_KEY() {
        return 'id';
    }

    /**
     * Retrieves a single entry matching the passed ID
     * @param {Number} id - The entry ID
     * @param {String} tableName = The table name for data
     */
    static async findById(id, tableName) {
        return (
            await mySQLWrapper.createQuery({
                query: `SELECT * FROM ?? WHERE ?? = ? LIMIT 1;`,
                params: [tableName, this.PRIMARY_KEY, id],
            })
        ).shift();
    }

    /**
     * Retrieves all entries on the extending class' table
     * @param {String} tableName - The table name for data
     */
    static findAll(tableName) {
        return mySQLWrapper.createQuery({
            query: `SELECT * FROM ??;`,
            params: [tableName],
        });
    }

    /**
     * Run explicit query
     * @param {String} query - The query itself
     * @param {Object} fields - The fields to be matched
     */
    static async runQuery(query, fields) {
        const connection = await this.getConnection();

        let params = [];

        if (fields) {
            Object.keys(fields).forEach((key, index) => {
                params.push(fields[key]);
            });
        }

        return mySQLWrapper.createTransactionalQuery({
            query,
            params,
            connection,
        });
    }

    /**
     * Get connection for executing mysql query
     * @return {Promise} connection - A connection from the pool
     */
    static async getConnection() {
        return await mySQLWrapper.getConnectionFromPool();
    }
}
