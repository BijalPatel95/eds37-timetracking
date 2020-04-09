var awsSecretManager = require('./awsSecretManager');

exports.connectionOption = async function() {
    let connection = await awsSecretManager.getSecretManagerValue(process.env.AWS_DB_SECRET_MANAGER_KEY);
    const config = {
        type: 'mssql',
        host: connection.host,
        server: connection.host,
        port: 1433,
        user: connection.username,
        password: connection.password,
        database: connection.dbname,
        synchronize: false,
        connectionTimeout: 290000,
        logging: false,
        options: {
            enableArithAbort: false,
            encrypt: true,
        },
    };
    return config;
}