var AWS = require("aws-sdk");
var fs = require('fs');

AWS.config.update({
    "region": "us-east-2",
  "endpoint": "http://dynamodb.us-east-2.amazonaws.com",
  "accessKeyId": "AKIAJUD3YZOH6OKUCUSQ", "secretAccessKey": "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"
  });

var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Importing users into DynamoDB. Please wait.");

var allUsers = JSON.parse(fs.readFileSync('usersdata.json', 'utf8'));
allUsers.forEach(function(user) {
    var params = {
        TableName: "Users",
        Item: {
            "TenDN":user.TenDN,
            "SDT":user.SDT, 
            "HoTen":user.HoTen,
            "Email":user.Email,      
            "GioiTinh":user.GioiTinh,
            "Quyen":user.Quyen,
            "TrangThai":user.TrangThai,
            "MatKhau":user.MatKhau
        }
    };

    docClient.put(params, function(err, data) {
       if (err) {
           console.error("Unable to add users", user.HoTen, ". Error JSON:", JSON.stringify(err, null, 2));
       } else {
           console.log("PutItem succeeded:", user.HoTen);
       }
    });
});

var alldanhba = JSON.parse(fs.readFileSync('danhba_data.json', 'utf8'));
alldanhba.forEach(function(danhba) {
    var params = {
        TableName: "DanhBa",
        Item: {
            "MaDanhBa":danhba.MaDanhBa,
            "TrangThai":danhba.TrangThai,
            "TenDN":danhba.TenDN,
            "TenKhach":danhba.TenKhach,
            "BietDanh":danhba.BietDanh,  
            "MaChat":danhba.MaChat     
        }
    };

    docClient.put(params, function(err, data) {
       if (err) {
           console.error("Unable to add Danh Ba", danhba.MaDanhBa, ". Error JSON:", JSON.stringify(err, null, 2));
       } else {
           console.log("PutItem succeeded:", danhba.MaDanhBa);
       }
    });  
});

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
            "NguoiNhan":chat.NguoiNhan,
            "HinhAnh":chat.HinhAnh
        }
    };

    docClient.put(params, function(err, data) {
       if (err) {
           console.error("Unable to add Chat", chat.NoiDung, ". Error JSON:", JSON.stringify(err, null, 2));
       } else {
       //    console.log("PutItem succeeded:", chat.NoiDung);
       }
    });  
});

var allnhom = JSON.parse(fs.readFileSync('nhom_data.json', 'utf8'));
allnhom.forEach(function(nhom) {
    var params = {
        TableName: "Nhom",
        Item: {
            "MaNhom":nhom.MaNhom,
            "TenNhom":nhom.TenNhom,
            "ChuNhom":nhom.ChuNhom
        }
    };

    docClient.put(params, function(err, data) {
       if (err) {
           console.error("Unable to add Nhom", nhom.ChuNhom, ". Error JSON:", JSON.stringify(err, null, 2));
       } else {
           console.log("PutItem succeeded:", nhom.ChuNhom);
       }
    });  
});