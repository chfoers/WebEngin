"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const faker = require("faker");
const user_1 = require("../src/models/user");
const config_1 = require("../src/config");
mongoose.Promise = global.Promise;
mongoose.connect(config_1.default.db.uri)
    .then(() => {
    createSampleData();
})
    .catch(err => {
    console.error('App starting error:', err.stack);
    process.exit(1);
});
function createSampleData() {
    let users = createUsers();
    //let contacts = createContacts(users);
    let allDocuments = users;
    saveDocuments(allDocuments, () => {
        console.log('done');
        mongoose.connection.close();
    });
    function createUsers() {
        let users = [];
        for (let i = 0; i < 10; i++) {
            let hash = bcrypt.hashSync('user' + (i + 1), 8);
            let user = new user_1.User({
                email: 'user' + (i + 1) + '@example.org',
                password: hash,
                name: faker.name.findName()
            });
            users.push(user);
        }
        return users;
    }
    function saveDocuments(docs, callback) {
        let count = 0;
        docs.forEach((doc) => {
            doc.save((err) => {
                count++;
                if (count == docs.length) {
                    callback();
                }
            });
        });
    }
}
