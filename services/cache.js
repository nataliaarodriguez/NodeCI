const mongoose = require('mongoose');
const redis = require('redis');
const keys = require('../config/keys');

const client = redis.createClient(keys.redisUrl);
const util = require('util');
const exec = mongoose.Query.prototype.exec;
client.hget = util.promisify(client.hget);

mongoose.Query.prototype.cache = function (options = {}){
    this._cache = true;
    this._hashKey = JSON.stringify(options.key || '');
    return this ; // para que sea encadenable.
    //this es igual a la instancia de la query..
};

mongoose.Query.prototype.exec = async function () {
    return exec.apply(this, arguments);
    if(!this._cache){
        return exec.apply(this, arguments);
    }

    const key = JSON.stringify(
        Object.assign({}, this.getQuery(), {
            collection: this.mongooseCollection.name
        })
    );

    const cacheValue = await client.hget(this._hashKey,key);

    if (cacheValue) {
        const doc = JSON.parse(cacheValue);
         return Array.isArray(doc)
            ? doc.map (d => new this.model(d))
            : new this.model(doc);
    }

    const result = await exec.apply(this, arguments);
    client.hset(this._hashKey, JSON.stringify(result), 'EX', '10'); //expira en 10 seg

    return result;
};

module.exports = {
    clearHash(hashKey){
        client.del(JSON.stringify(hashKey));
    }

}
