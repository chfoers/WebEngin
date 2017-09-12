import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as faker from 'faker';
import { User, UserInterface } from '../src/models/user';
import config from '../src/config';

(mongoose as any).Promise = global.Promise;
mongoose.connect(config.db.uri)
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
    let allDocuments: Document[] = (users as any);
    saveDocuments(allDocuments, () => {
        console.log('done');
        mongoose.connection.close();
    })

    function createUsers() {
    let users: UserInterface[] = [];
    for (let i = 0; i < 10; i++) {
        let hash = bcrypt.hashSync('user' + (i + 1), 8);
        let user = new User({
            email: 'user' + (i + 1) + '@example.org',
            password: hash,
            name: faker.name.findName()
        });
        users.push(user);
    }
    return users;
}
function saveDocuments(docs: Document[], callback: () => void) {
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