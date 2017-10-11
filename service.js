var q = require('q');
var MongoClient = require('mongodb').MongoClient;
var mongoLabUrl = 'mongodb://' + process.env.MONGO_USER + ':' + process.env.MONGO_PASS + '@ds137121.mlab.com:37121/m2c2';

module.exports = {
    saveUserAddress: function (address) {
        console.log('saving address ' + JSON.stringify(address));
        console.log(address.user);
        var deferred = q.defer();
        var docToSave = { userId: address.user.id, address: address };
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
    db.collection('user_address').update({ userId: document.user.id }, document, { upsert: true }, function (err, res) {
        callback(err, res);
    });
};