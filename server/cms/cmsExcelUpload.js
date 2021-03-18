const fs = require('fs');
const node_xj = require("xls-to-json");

var leftNavObj = {};

function createLeftnavJson(data,leftNav, platform, callback){
  console.log("platform", platform);
  console.log("data", data[100]);
  console.log("data", data.length);

  let sortOrder = 1;
  for(let i = 0 ; i < data.length; i++){
    if( (!data[i].RowId || data[i].RowId  == "")  && (!data[i].Label || data[i].Label  == "" )
      &&(!data[i].Type || data[i].Type  == "" )
      &&(!data[i].ParentRowId || data[i].ParentRowId  == "" )
      &&(!data[i].Action || data[i].Action  == "" )&& (!data[i].Link || data[i].Link  == "" )){
      callback(leftNav, null);

  }

  leftNavObj = {};
  if(data[i].ParentRowId.length === 0){
    if(!data[i].RowId || data[i].RowId  == "" ){
      callback(null , "Invalid row id");
    }


    if(!data[i].Label || data[i].Label  == "" ){
      callback(null , "Invalid Label at row id " + data[i].RowId);
    }
    leftNavObj.rowId = parseInt(data[i].RowId);
    leftNavObj.sortOrder = sortOrder;
    leftNavObj.type = data[i].Type;
    if(platform === "app" || platform === "msite"){
      if(!data[i].Action || data[i].Action  == "" ){
        callback(null , "Invalid Action at row id " + data[i].RowId);
      }
      leftNavObj.action = data[i].Action;
    }
    
    leftNavObj.label = data[i].Label;
    leftNavObj.href = processLink(data[i].Link);
    leftNavObj.children = [];
    leftNav.push(leftNavObj)
    sortOrder ++;
  }
  else{
    addSubData(data[i],leftNav,platform, function(data, error){
      if(error){
        callback(null , error);
      }
    });
  }
}
callback(leftNav, null);
}

function addSubData(subData,leftNav,platform, callback){
  let isParentFound = false;
  for(let i = 0; i< leftNav.length; i++){
    leftNavObj = {};
    if(leftNav[i].rowId === parseInt(subData.ParentRowId)){
      if(!subData.RowId || subData.RowId  == "" ){
        callback(null , "Invalid row id");
      }

      if(!subData.Label || subData.Label  == "" ){
        callback(null , "Invalid Label at row id " + subData.RowId);
      }
      leftNavObj.rowId = parseInt(subData.RowId);
      leftNavObj.sortOrder = leftNav[i].children.length + 1;
      leftNavObj.type = subData.Type;
      if(platform === "app" || platform === "msite"){
        if(!subData.Action || subData.Action  == "" ){
          callback(null , "Invalid Action at row id " + subData.RowId);
        }
        leftNavObj.action = subData.Action;
      }
      
      leftNavObj.label = subData.Label;
      leftNavObj.href = processLink(subData.Link);
      leftNavObj.children = [];
      leftNav[i].children.push(leftNavObj);
      isParentFound = true;
      break;
    }
  }
  if(!isParentFound){
    let isGrandParentFound = false
    for(let i = 0; i< leftNav.length; i++){
      if(leftNav[i].children.length > 0){
        let innerData = leftNav[i].children;
        for( let j = 0; j< innerData.length; j++){
          
          if(innerData[j].rowId === parseInt(subData.ParentRowId)){
            leftNavObj = {};
            if(!subData.RowId || subData.RowId  == "" ){
              callback(null , "Invalid row id");
            }

            if(!subData.Label || subData.Label  == "" ){
              callback(null , "Invalid Label at row id " + subData.RowId);
            }
            leftNavObj.rowId = parseInt(subData.RowId);
            leftNavObj.sortOrder = innerData[j].children.length + 1;
            leftNavObj.type = subData.Type;
            if(platform === "app" || platform === "msite"){
              if(!subData.Action || subData.Action  == "" ){
                callback(null , "Invalid Action at row id " + subData.RowId);
                
              }
              leftNavObj.action = subData.Action;
            }
            leftNavObj.label = subData.Label;
            leftNavObj.href =  processLink(subData.Link);
            leftNavObj.children = [];
            innerData[j].children.push(leftNavObj);
            isParentFound = true;
            break;
          }
        }

      }
    }
    if(!isGrandParentFound){
      for(let i = 0; i< leftNav.length; i++){
        let innerData = leftNav[i].children;
        for( let j = 0; j< innerData.length; j++){

          let grandInnerData = innerData[j].children;
          for(let k = 0; k< grandInnerData.length; k++ ){
            if(grandInnerData[k].rowId === parseInt(subData.ParentRowId)){
              leftNavObj = {};
              if(!subData.RowId || subData.RowId  == "" ){
                callback(null , "Invalid row id");
              }

              if(!subData.Label || subData.Label  == "" ){
                callback(null , "Invalid Label at row id " + subData.RowId);
              }
              leftNavObj.rowId = parseInt(subData.RowId);
              leftNavObj.sortOrder = grandInnerData[k].children.length + 1;
              leftNavObj.type = subData.Type;
              if(platform === "app" || platform === "msite"){
                if(!subData.Action || subData.Action  == "" ){
                  callback(null , "Invalid Action at row id " + subData.RowId);
                }
                leftNavObj.action = subData.Action;
              }
              leftNavObj.label = subData.Label;
              leftNavObj.href =  processLink(subData.Link);
              leftNavObj.children = [];
              grandInnerData[k].children.push(leftNavObj);
              isGrandParentFound = true;
              break;
            }
          }


        }
      }

    }

  }

}

function processLink(link){
  if(link){
    var updatedLink = link.replace(',','::');
    return updatedLink.replace(/ /g, '');
  }
  return null
}

export default function cmsExcelUpload(req, res) {
  var leftNavObj = {};
  console.log("req.body.platform", req.body.platform);
  var sampleFile;
  var exceltojson;
  sampleFile = req.files.file;
  if(req.body.platform && req.body.platform === "msite" ){
    var dir = __dirname + '/../../app/data/msite/leftNavExcel.xlsx';
    var outputDir = __dirname + '/../../app/data/msite/leftNavExcel.json';
  }
  else{
    var dir = __dirname + '/../../app/data/leftNavExcel.xlsx';
    var outputDir = __dirname + '/../../app/data/leftNavExcel.json';
  }

  try{
    if (fs.existsSync(dir)) {
      fs.unlink(dir);
      if(fs.existsSync(outputDir)) {
        fs.unlink(outputDir);
      }
    }

  }
  catch(e){

  }

  
  sampleFile.mv(dir, function(err) {
    if(err){
      console.log("Error",err);
      res.json({
        "success" : false
      });
    }
    else{
      var leftNavArray = [];
      var leftNavObj = {};
      var dataArray  = []


      node_xj({
        input: dir,
          output:outputDir, // output json
        }, function(err, result) {
          if(err) {
            console.error(err);
            res.json({
              "success" : false
            });
          } else {

            createLeftnavJson(result,leftNavArray, req.body.platform,  function(data, error){
              if(data){
                res.json({
                  "success" : true,
                  "data": data
                });
              }
              else{
                res.json({
                  "success" : false,
                  "message" : error
                });
              }

            })
          }
        });
    }
  });
}
