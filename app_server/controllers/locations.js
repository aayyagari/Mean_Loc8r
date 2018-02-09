var request = require('request');

var apiOptions = {
    server : "http://localhost:3000"
};

/*
var renderHomepage = function(req, res, responseBody) {
    var message;
    if(!(responseBody instanceof Array)) {
        message = "API lookup error";
        responseBody = [];
    } else {
        if(!responseBody.length) {
            message = "No places found nearby";
        }
    }

    res.render('locations-list', {
        title: 'Loc8r - find a place to work with wifi',
        pageHeader: {
            title: 'Loc8r',
            strapline: 'Find places to work with wifi near you!'
        },
        sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for.",
        locations: responseBody,
        message: message
    });
};


module.exports.homelist = function(req, res) {
    var requestOptions, path;
    path = '/api/locations';
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {},
        qs: {
            lng : -0.7992599,
            lat : 51.378091,
            maxDistance : 20
        }
    };
    request(requestOptions, function(err, response, body) {
        renderHomepage(req, res, body);
    });
};

*/

var renderHomepage = function(req, res) {
    res.render('locations-list', {
        title: 'Loc8r - find a place to work with wifi',
        pageHeader: {
            title: 'Loc8r',
            strapline: 'Find places to work with wifi near you!'
        },
        sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for.",        
    });
};

module.exports.homelist = function(req, res) {
    renderHomepage(req, res);
};

var renderDetailPage = function(req, res, locDetail) {
    res.render('location-info', {
        title: locDetail.name,
        pageHeader: {
            title: locDetail.name
        },
        sidebar: {
            context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
            callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
        },
        location: locDetail
    });
};

var getLocationInfo = function(req, res, callback) {
    var requestOptions, path;
    path = "/api/locations/" + req.params.locationid;
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
    };

    request(requestOptions, (err, response, body) => {
        var data = body;
        data.coords = {
            lng : body.coords[0],
            lat : body.coords[1]
        };

        callback(req, res, data);
    });
};

/* GET 'Location info' page */
module.exports.locationInfo = function(req, res) {
    getLocationInfo(req, res, function(req, res, responseData) {
        renderDetailPage(req, res, responseData);
    });
};

var renderReviewForm = function (req, res, reviewDetail) {
    res.render('location-review-form', {
        title: 'Review ' + reviewDetail.name + ' on Loc8r',
        pageHeader: { title: 'Review ' + reviewDetail.name }
    });
};

/* GET 'Add review' page */
module.exports.addReview = function(req, res) {
    getLocationInfo(req, res, function(req, res, responseData){
        renderReviewForm(req, res, responseData);
    });
};

module.exports.doAddReview = function(req, res) {
    var requestOptions, path, locationid, postData;
    locationid = req.params.locationid;
    path = "/api/locations/" + locationid + '/reviews';

    postData = {
        author: req.body.name,
        rating: parseInt(req.body.rating, 10),
        reviewText: req.body.review
    };

    requestOptions = {
        url: apiOptions.server + path,
        method: "POST",
        json: postData
    }
    request(requestOptions, (err, response, body) => {
        res.redirect('/location/' + locationid);
    });
};