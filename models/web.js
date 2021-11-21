var mongoose = require("mongoose");

var WebSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    websiteUrl: {
        type: String,
        required: 'Website URL is required',
        validate: [validateURL, 'Please fill a valid website URL'],
    },
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

var validateEmail = function(email) {
    var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return pattern.test(email)
}

var validateURL = function(url) {
    var urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
    return urlRegex.test(url)
}

module.exports = mongoose.model("Web", WebSchema);