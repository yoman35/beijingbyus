
var elasticsearch = require ('elasticsearch');
var indexName = "users"

function init(client) {
	client.search({index:indexName, body:{"query":{"match_all":{}}}}).then(
		function (resp) {
			if (resp.hits.total == 0) {
				addNewUser(client, 'admin', 'mdp');
			}
			else {
				console.log("all is ok");
			}
		}, function (error) {
			console.log("Error : Index " + indexName + "missing.");
			console.log("Creating index : " + indexName + ".");
			client.indices.create({index:"users"}, function(resp) {
				console.log("Index " + indexName + " created.");
				addNewUser(client, 'admin', 'mdp');
			});
		}
	);
}

function addNewUser(client, username, mdp, result) {
	client.search(
		{	
			'index':indexName,
			'body': {
				'query':{
					'query_string': {
						'query':"username:\"" + username + "\""
					}
				}
			}
		}
	)
	.then(
		function (resp) { // Query succeed
			if (resp.hits.total == 0) { // User not found -> Add New user 
				client.index(
					{
						index:indexName,
						type:'user',
						body: {	
							'username':username,
							'mdp':mdp
						}
					}
				)
				.then(
					function(resp) { // User Added
						console.log('User \'' + username + '\' added.');
						result.json({ message:'User \'' + username + '\' added.'})
					},
					function (err) { // Query failed
						console.log('Error : Unable to add user \'' + username + '\'.');
						result.json({ message:'Error : Unable to add user \'' + username + '\'.'})
					}
				)
			}
			else { // User alredy exist
				console.log ("Error : user \'" + username + "\‘ already exists");
				result.json({ message:"Error : user \'" + username + "\‘ already exists"})
			}
		},
		function (err) { // Query failed 
			console.log ("Error : Query failed");
			result.json({ message:"Error : Query failed"})
		}
	)
}

exports.init = init;
exports.addNewUser = addNewUser;