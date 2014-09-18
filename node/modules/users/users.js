
var elasticsearch = require ('elasticsearch');
var indexName = "users"

function init(client) {
	client.search({index:indexName, body:{"query":{"match_all":{}}}}).then(
		function (resp) {
			console.log("All is ok");
		}, function (error) {
			console.log("Error : Index " + indexName + "missing.");
			console.log("Creating index : " + indexName + ".");
			client.indices.create({index:"users"}, function(resp) {
				console.log("Index " + indexName + " created.")
			});
		}
	);
}

exports.init = init;