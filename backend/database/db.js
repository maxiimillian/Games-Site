const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");



class DB {
    constructor(mongod) {
        this.mongod = mongod;
    }

    async connect() {
        const uri = this.mongod.getUri();
        const mongooseOpts = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            poolSize: 10,
        };
        await mongoose.connect(uri, mongooseOpts);
    }

    async closeDatabase() {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await this.mongod.stop();
    }

    async clearDatabase() {
        const collections = mongoose.connection.collections;
    
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany();
        }
    }
}

module.exports = async function() {
    let mongod = await MongoMemoryServer.create();
    return new DB(mongod)
}

