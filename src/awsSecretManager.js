var AWS = require('aws-sdk');
const secretManager = new AWS.SecretsManager();

const getSecretManagerValue = async (secretName) => {
    return new Promise((resolve, reject) => {
        secretManager.getSecretValue({ SecretId: secretName }, function(err, data) {
            if (err) {
                reject(err);
            } else {
                if ('SecretString' in data) {
                    resolve(JSON.parse(data.SecretString));
                }
            }
        });
    });
};

exports.getSecretManagerValue = getSecretManagerValue;