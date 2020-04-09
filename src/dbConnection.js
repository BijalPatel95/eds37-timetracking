var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'}); 

const sql = require('mssql');
const dbConfig = require("./dbConfig")
const awsSecretManager = require('./awsSecretManager'); 

class Database{
    static async queryExecutor(query) {
    try {
        const config = await dbConfig.connectionOption();
        await sql.connect(config);
        console.log('connected')
        console.log(`Running query ${query}`);
        const result = await sql.query(query);
        sql.close();
        console.log('Result : ',result["recordset"]);
        return result["recordset"];
    } catch (e) {
        console.error(`Error in database: ${e}`);
        throw e;
    }
};
}
module.exports = Database;