module.exports.adapters = {
    'default': 'disk',

    // sails v.0.9.0
    mongo: {
        module   : 'sails-mongo',
        host     : 'localhost',
        port     : 27017,
        user     : '',
        password : '',
        database : 'nln-live',
        url      : 'mongodb://localhost'
    },

    disk: {
        module : 'sails-disk'
    }

};