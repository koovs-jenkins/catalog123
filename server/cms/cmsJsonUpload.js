const jsonFile = require("jsonfile");

export default function cmsJsonUpload(req,res){
	console.log('req', req.body);
	if(req.body.platform && req.body.platform === "msite" ){
		var file = __dirname + '/../../app/data/msite/' + req.body.fileName;
	}
	else if(req.body.platform && req.body.platform === "app" ){
		var file = __dirname + '/../../app/data/' + req.body.fileName;
	}
	else{
		var file = __dirname + '/../../app/data/web/' + req.body.fileName;
	}
	
	jsonFile.writeFile(file, req.body.data, function (err) {
		if(err){
			console.log("Error",err);
			res.json({
				"success" : false
			});
		}
		else{
			res.json({
				"success" : true
			});
		}
	})
};
