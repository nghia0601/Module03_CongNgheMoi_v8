var AWS = require("aws-sdk");
var fs = require('fs');

AWS.config.update({
    "region": "us-east-2",
  "endpoint": "http://dynamodb.us-east-2.amazonaws.com",
  "accessKeyId": "AKIAIOODL6JM5CSZ4MMA", "secretAccessKey": "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"
  });
  var docClient = new AWS.DynamoDB.DocumentClient();
  
var allchat = JSON.parse(fs.readFileSync('chat_data.json', 'utf8'));
allchat.forEach(function(chat) {
    var params = {
        TableName: "Chat",
        Item: {
            "MaChat":chat.MaChat,
            "SapXep":chat.SapXep,
            "NoiDung":chat.NoiDung,
            "ThoiGian":chat.ThoiGian,
            "NguoiGui":chat.NguoiGui,
            "NguoiNhan":chat.NguoiNhan
        }
    };

    docClient.put(params, function(err, data) {
       if (err) {
           console.error("Unable to add Chat", chat.NoiDung, ". Error JSON:", JSON.stringify(err, null, 2));
       } else {
           console.log("PutItem succeeded:", chat.NoiDung);
       }
    });  
});