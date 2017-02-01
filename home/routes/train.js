var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var subwaySchema = mongoose.Schema({
    'Line': String,
    'Trains': [{
        'created': {
            type: Date,
            default: Date.now
        },
        'Location': {
            'Lat': {type: Number, default: 0},
            'Lng': {type: Number, default: 0},
        },
        'Offset': {
            type: Date,
            default: 0
        },
    }],
});
var Subway = mongoose.model('Subway', subwaySchema);
initDatabase();

mongoose.connect('mongodb://localhost/test', function(err) {
    if (err) {
        console.log('MongoDB connection error.');
    } else {
        console.log('MongoDB connected.');
    }
});

router.get('/', function(req, res, err) {
    res.render('train');
});

router.get('/info', function(req, res, err) {
    res.send('Saved.');
});

router.get('/test', function(req, res, err) {
    var line = req.query['line'];
    var lat = req.query['lat'];
    var lng = req.query['lng'];
    console.log(line, lat, lng);
    var result = {}
    Subway.findOne({'Line':line}, function(err, doc) {
        if (err) {
            console.log('Error when finding line.');
        } else {
            newDoc = {
                'id': 1,
                'Location': {
                    'Lat': lat,
                    'Lng': lng,
                },
            };
            var pushed = false;
            for (var i = 0; i < doc['Trains'].length; i++) {
                var x1 = doc['Trains'][i]['Location']['Lat'];
                var y1 = doc['Trains'][i]['Location']['Lng'];
                dis = distance(x1, y1, newDoc['Location']['Lat'], newDoc['Location']['Lng']);
                if (dis < 1) {
                    doc['Trains'][i]['Location']['Lat'] = newDoc['Location']['Lat'];
                    doc['Trains'][i]['Location']['Lng'] = newDoc['Location']['Lng'];
                    console.log("Existing train. Updated. Distance:", dis);
                    pushed = true;
                    break;
                }
            }
            if (!pushed) {
                doc['Trains'].push(newDoc);
                console.log("New train. Pushed");
            }

            doc.save(function(err) {
                if (err) {
                    console.log('Error occurs');
                } else {
                    console.log('Saved');
                }
            });
            result = {
                'info': pushed,
                'data': doc,
            }
            // ret = JSON.stringify(result);
            res.json(result);
        }
    });
});

function initDatabase() {
    lines = ['R', 'D', 'A'];
    console.log('Database Initiating...');
    var count = 0;
    for (var i in lines) {
        doc = {
            'id':i,
            'Line': lines[i],
            'Trains': [],
        }
        Subway.findOneAndUpdate({'Line': doc['Line']}, {'$set': doc}, {upsert: true}, function(err, doc) {
            if (err) {
                console.log('Error when inserting line');
            } else {
                console.log('Line', doc['Line'], 'inserted.');
            }
            count++;
            if (count == lines.length) {
                console.log('Database initiated.');
            }
        });
    }
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

module.exports = router;
