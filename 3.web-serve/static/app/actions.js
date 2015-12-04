var store = require('./store');
var assign = require('object-assign');


function apiURL(attribute) {
    return "/api/similarity/" + attribute + "/";
}


function fetchSimilarity(event,  attribute) {
    store.setState({
        loading: true,
    });
    store.emitChange();

    let url = apiURL(attribute);
    console.debug("Fetching similarity for %s", attribute);

    $.getJSON(url, function(data) {
        console.debug("Fetched similarity for %s in %s", attribute, data.duration);
        if(data.err) {
            console.error(data.err);
        }
        store.setState(data);
        store.setState({
            loading: false,
        });
        store.emitChange();
    });
}

module.exports = {
    fetchSimilarity
};
