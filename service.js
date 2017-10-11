var q = require('q');
var MongoClient = require('mongodb').MongoClient;
var mongoLabUrl = 'mongodb://' + process.env.MONGO_USER + ':' + process.env.MONGO_PASS + '@ds117485.mlab.com:17485/tbb';

module.exports = {
    saveUserAddress: function (address) {
        var user = address.user;
        var deferred = q.defer();
        var docToSave = { userId: user.id, address: address };
        console.log('doc to save----- ' + JSON.stringify(docToSave));
        MongoClient.connect(mongoLabUrl, function (err, db) {
            insertOrUpdateAdd(db, docToSave, function (err, result) {
                db.close();
                if (null != err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(result);
                }
            });
        });
        return deferred.promise;
    }
};

var insertOrUpdateAdd = function (db, document, callback) {
    db.collection('user_address').update({ userId: document.userId }, document, { upsert: true }, function (err, res) {
        callback(err, res);
    });
};