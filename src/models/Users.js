const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    username: {
        type: 'String',
        required: true
    },
    email: {
        type: 'String',
        required: true
    },
    age: {
        type: 'Number',
        required:true
    },
    favFood: {
        type: "String"
    },
    avatarUrl: {
        type: 'String'
    },
    password: {
        type: 'String',
        required: true
    }
})

const Users = model("Users", userSchema);

module.exports = Users;