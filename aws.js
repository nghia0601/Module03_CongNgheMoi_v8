const AWS = require('aws-sdk');
const fs = require('fs');
const FORM = require('./writeform');
const cors = require("cors");
AWS.config.update({
  "region": "us-east-2",
  "endpoint": "http://dynamodb.us-east-2.amazonaws.com",
  "accessKeyId": "AKIAJTLMCTTTYTSMRMWA", "secretAccessKey": "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"
});

const session = require('express-session');
const express = require('express');
var nodemailer = require('nodemailer');
const { Console } = require('console');
const { PageUser } = require('./writeform');
const { Script } = require('vm');
const { DataExchange } = require('aws-sdk');
const app=express();
app.use(session({
    resave: true, 
    saveUninitialized: true, 
    secret: 'somesecret',
    cookie: { maxAge: 6000000000000000 }
  }));
  const AWS_S3 = require("aws-sdk");
  const configAWS = require("./config.json");
  const REGION = configAWS.REGION;
  const ACCESS_KEY = configAWS.AWS_ACCESS_KEY;
  const SECRET_KEY = configAWS.AWS_SECRET_KEY;
  const ENDPOINT = configAWS.ENDPOINT;
  AWS_S3.config.update({
      accessKeyId: ACCESS_KEY,
      secretAccessKey: SECRET_KEY,
      region: REGION,
      endpoint:ENDPOINT
    });
    const s3 = new AWS_S3.S3();
    app.use(cors());





let docClient = new AWS.DynamoDB.DocumentClient();

function KiemTraDangNhap(req,res,ThongTinNhapVao, MatKhau) {
  let params = {
    TableName: 'Users'
  };
  let loginPerson = {};
  if (ThongTinNhapVao) {
    if (MatKhau) {
      params.FilterExpression = '#em = :EmailKT';
      params.ExpressionAttributeNames = {'#em': 'Email'};
      params.ExpressionAttributeValues = {':EmailKT': String(ThongTinNhapVao)};
      docClient.scan(params, function onScan(err,data){
        if (err) {
          FORM.PageDangNhapSaiThongTin(res);
          console.error('Unable to scan the table. Error JSON:', JSON.stringify(err, null, 2));
        } 
        else {
          if(data.Items.length>0){
            loginPerson=data;
            if(loginPerson.Items[0].MatKhau===MatKhau){
              if(loginPerson.Items[0].TrangThai==="Kích Hoạt"){
                req.session.User = {
                  name_HT: loginPerson.Items[0].HoTen.toString(),
                  name_DN: loginPerson.Items[0].TenDN.toString()
              }
                if(loginPerson.Items[0].Quyen==="Admin"){     
                  var temp=loginPerson.Items[0].HoTen.toString();               
                  res.writeHead(302, {'Location': '/User'});
                  res.end();
                }
                else{
                  var temp=loginPerson.Items[0].HoTen.toString();
    
                  res.writeHead(302, {'Location': '/User'});
                  res.end();
                }
              }
              else{
                FORM.PageDangNhapChuaKichHoat(res);
              }
              
            }
            else{
              FORM.PageDangNhapSaiMatKhau(res);
            }
          }
          else{
            params.FilterExpression = '#sdt = :SDTDK';
            params.ExpressionAttributeNames = {'#sdt': 'SDT'};
            params.ExpressionAttributeValues = {':SDTDK': String(ThongTinNhapVao)};
            docClient.scan(params, function onScan(err,data){
              if (err) {
                FORM.PageDangNhapSaiThongTin(res);
                console.error('Unable to scan the table. Error JSON:', JSON.stringify(err, null, 2));
              } else {
                if(data.Items.length>0){
                  loginPerson=data;
                  var temp=loginPerson.Items[0].HoTen.toString();
                  if(loginPerson.Items[0].MatKhau===MatKhau){
                    if(loginPerson.Items[0].TrangThai==="Kích Hoạt"){
                      req.session.User = {
                        name_HT: loginPerson.Items[0].HoTen.toString(),
                        name_DN: loginPerson.Items[0].TenDN.toString()
                    }
                      if(loginPerson.Items[0].Quyen==="Admin"){
                        var temp=loginPerson.Items[0].HoTen.toString();
           
                        res.writeHead(302, {'Location': '/admin'});
                        res.end();
                      }
                      else{
                        var temp=loginPerson.Items[0].HoTen.toString();
                 
                        res.writeHead(302, {'Location': '/user'});
                        res.end();
                      }
                    }
                    else{
                      FORM.PageDangNhapChuaKichHoat(res);
                    }
                  }
                  else{
                    FORM.PageDangNhapSaiMatKhau(res);
                  }
                }
                else{
                    FORM.PageDangNhapSaiThongTin(res);
                }
              }
            });
          }
          if (typeof data.LastEvaluatedKey !== 'undefined') {
            console.log('Scanning for more...');
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            docClient.scan(params, onScan);
          }
        }
      });
    }
  }
  else {
    FORM.PageDangNhapSaiThongTin(res);
  }
}
function LayDanhSachLoiMoiVaDanhBa_AWS(req,res)
{
  let params = {
    TableName: "DanhBa",
    FilterExpression : '#tt = :TrangThaiKT and #tc = :TenDNKT',
    ExpressionAttributeNames : {'#tt': 'TrangThai', '#tc': 'TenDN' },
    ExpressionAttributeValues : {':TrangThaiKT': String("Đã Chấp Nhận"), ':TenDNKT': String(req.session.User.name_DN)}
  };
  let scanObject = {};
  let dsachban_KhongChuaDanhSachNhom=[];
  docClient.scan(params, (err, data) => {
    if (err) {
      scanObject.err = err;
    } else {
      data.Items.forEach((DanhBa) => {
        var test=parseInt(DanhBa.TenKhach);
        if(isNaN(test))
        {
          //console.log(DanhBa.TenKhach);
          dsachban_KhongChuaDanhSachNhom.push(DanhBa);
        }
      });
      scanObject.data = dsachban_KhongChuaDanhSachNhom;
    }
    let paramsLoiMoi = {
      TableName: "DanhBa",
      FilterExpression : '#tt = :TrangThaiKT and #tk = :TenDNKT',
      ExpressionAttributeNames : {'#tt': 'TrangThai', '#tk': 'TenKhach' },
      ExpressionAttributeValues : {':TrangThaiKT': String("Chưa Chấp Nhận"), ':TenDNKT': String(req.session.User.name_DN)}
      
    };
    let scanObjectLoiMoi = {};
    docClient.scan(paramsLoiMoi, (err, data) => {
      if (err) {
        scanObjectLoiMoi.err = err;
      } else {
        scanObjectLoiMoi.data = data;
        let paramsUser = {
          TableName: "Users",
        };
        let scanUserTheoDanhBa={};
        docClient.scan(paramsUser,(err,data)=>{
          if(err){
            scanUserTheoDanhBa=err;
          }
          else{
            scanUserTheoDanhBa.data=data;
            FORM.PageLoadLoiMoiKetBan_DanhBa(req,res,scanObject,scanObjectLoiMoi,req.session.User.name_HT,scanUserTheoDanhBa);
          }
        });
        
      }
    });
  });
}
function LayDanhSachBanBe(res,req,tenChu, tenHT) {
  let params = {
    TableName: "DanhBa",
    FilterExpression : '#tt = :TrangThaiKT and #tc = :TenDNKT',
    ExpressionAttributeNames : {'#tt': 'TrangThai', '#tc': 'TenDN' },
    ExpressionAttributeValues : {':TrangThaiKT': String("Đã Chấp Nhận"), ':TenDNKT': String(tenChu)},
  };
  let scanObject = {};
  let dsachban_KhongChuaDanhSachNhom=[];
  docClient.scan(params, (err, data) => {
    if (err) {
      scanObject.err = err;
    } else {
      data.Items.forEach((DanhBa) => {
        var test=parseInt(DanhBa.TenKhach);
        if(isNaN(test))
        {
          dsachban_KhongChuaDanhSachNhom.push(DanhBa);
        }
      });
        scanObject.data=dsachban_KhongChuaDanhSachNhom;
        FORM.PageUser(req,res,scanObject,req.session.User.name_HT);
    }
  });
}
function LayDanhSachNhom(res,req,tenChu) {
  let params = {
    TableName: "DanhBa",
    FilterExpression : '#tt = :TrangThaiKT and #tc = :TenDNKT',
    ExpressionAttributeNames : {'#tt': 'TrangThai', '#tc': 'TenDN' },
    ExpressionAttributeValues : {':TrangThaiKT': String("Đã Chấp Nhận"), ':TenDNKT': String(tenChu)}
  };
  let scanObjectNhom = {};
  let scanObjectBan={};
  let dsachban_KhongChuaDanhSachBan=[];
  let dsachban_KhongChuaDanhSachNhom=[];
  docClient.scan(params, (err, data) => {
    if (err) {
      scanObjectNhom.err = err;
    } else {
      data.Items.forEach((DanhBa) => {
        var test=parseInt(DanhBa.TenKhach);
        if(!isNaN(test))
        {
          dsachban_KhongChuaDanhSachBan.push(DanhBa);               
        }
        else{
          dsachban_KhongChuaDanhSachNhom.push(DanhBa);                   
          } 
      });
        scanObjectNhom.data=dsachban_KhongChuaDanhSachBan;
        scanObjectBan.data=dsachban_KhongChuaDanhSachNhom;
        FORM.LoadNhomChat(req,res,scanObjectNhom,scanObjectBan,req.session.User.name_HT);
    }
  });
}
function TimKiemUser(req,res,ThongTinNhapVao){

  let params_danhba = {
    TableName: "DanhBa",
    FilterExpression : '#tt = :TrangThaiKT and #tc = :TenDNKT',
    ExpressionAttributeNames : {'#tt': 'TrangThai', '#tc': 'TenDN' },
    ExpressionAttributeValues : {':TrangThaiKT': String("Đã Chấp Nhận"), ':TenDNKT': String(req.session.User.name_DN)}
  };
  let scanObject_danhba = {};
  let dsachban_KhongChuaDanhSachNhom=[];
  docClient.scan(params_danhba, (err, data) => {
    if (err) {
      scanObject_danhba.err = err;
    } else {
      data.Items.forEach((DanhBa) => {
        var test=parseInt(DanhBa.TenKhach);
        if(isNaN(test))
        {
          //console.log(DanhBa.TenKhach);
          dsachban_KhongChuaDanhSachNhom.push(DanhBa);
        }
      });
      scanObject_danhba.data = dsachban_KhongChuaDanhSachNhom;
      let paramsLoiMoi = {
        TableName: "DanhBa",
        FilterExpression : '#tt = :TrangThaiKT and #tk = :TenDNKT',
        ExpressionAttributeNames : {'#tt': 'TrangThai', '#tk': 'TenKhach' },
        ExpressionAttributeValues : {':TrangThaiKT': String("Chưa Chấp Nhận"), ':TenDNKT': String(req.session.User.name_DN)}
      };
      let scanObjectLoiMoi = {};
      docClient.scan(paramsLoiMoi, (err, data) => {
        if (err) {
          scanObjectLoiMoi.err = err;
        } else {
          scanObjectLoiMoi.data = data;
          let params_User = {
            TableName: 'Users',
            FilterExpression : '#sdt = :SDTKT',
            ExpressionAttributeNames : {'#sdt': 'SDT'},
            ExpressionAttributeValues : {':SDTKT': String(ThongTinNhapVao)}
          };
          let scanObject_User = {};
          scanObject_User.data = {Items:[]};
          if (ThongTinNhapVao) { 
              docClient.scan(params_User, function onScan(err,data){
                if (err) {
                  console.error('Unable to scan the table. Error JSON:', JSON.stringify(err, null, 2));
                } 
                else {
                    scanObject_User.data = data;
                    let params_MinhMoi = {
                      TableName: "DanhBa",
                      FilterExpression : '#tt = :TrangThaiKT and #tk = :TenDNKT',
                      ExpressionAttributeNames : {'#tt': 'TrangThai', '#tk': 'TenDN' },
                      ExpressionAttributeValues : {':TrangThaiKT': String("Chưa Chấp Nhận"), ':TenDNKT': String(req.session.User.name_DN)}
                    };
                    let scanObjectMinhMoi = {};
                    docClient.scan(params_MinhMoi, (err, data) => {
                      if (err) {
                        scanObjectMinhMoi.err = err;
                      } else {
                        scanObjectMinhMoi.data = data; 
                        FORM.WriteTable_KetBan(req,res,req.session.User.name_HT,scanObjectLoiMoi, scanObjectMinhMoi,scanObject_danhba,scanObject_User); 
                      }
                    });        
              }
            });
          }
        }
      });
    }
  });

}

function updateTrangThai(MaDanhBa,TenDN,TenKhach,res){
  let strMa = String(TenDN)+String(TenKhach);
  let params={
    TableName:"DanhBa",
    Key:{
      MaDanhBa:String(MaDanhBa)
    },
    UpdateExpression:"set #tt = :TrangThai",
    ExpressionAttributeNames:{
      '#tt':'TrangThai'
    },
    ExpressionAttributeValues:{
      ':TrangThai':String("Đã Chấp Nhận")
    },
    ReturnValues:"UPDATED_NEW"
  }
  docClient.update(params,(err,data)=>{
    if(err){
      console.log(err);
    }
    else{
      let params1={
        TableName:"Users",
        FilterExpression : '#tendn = :TenDN',
        ExpressionAttributeNames : {'#tendn': 'TenDN'},
        ExpressionAttributeValues : {':TenDN': String(TenKhach)}
      }
      docClient.scan(params1,(err,data)=>{
        if(err){

        }else{

          let params2={
            TableName:"DanhBa",
            Item:{
              MaDanhBa:String(strMa),
              BietDanh:String(data.Items[0].HoTen),
              TenDN:String(TenDN),
              TenKhach:String(TenKhach),
              TrangThai:String("Đã Chấp Nhận")
            }
          };
          docClient.put(params2,(err,data)=>{
            if(err){
              console.log(err);
            }
            else{              
              res.redirect('/User');
            }
          });
        }
      });
    }
  });
}
function createItem_ChuKhach(TenDN,TenKhach,BietDanh, req,res) {
  let params = {
    TableName: 'DanhBa',
    Item: {
      MaDanhBa: String(TenDN)+String(TenKhach),
      TrangThai: String("Chưa Chấp Nhận"),
      BietDanh: String(BietDanh),
      TenDN: String(TenDN),
      TenKhach: String(TenKhach)
    }
  };
  docClient.put(params, (err, data) => {
    if (err) {
      req.session.ThongBaoGuiKetBanThanhCong = {
        tb: "Gửi kết bạn thất bại !."
      }
      res.writeHead(302, {'Location': '/User'});
    } else {
      req.session.ThongBaoGuiKetBanThanhCong = {
        tb: "Gửi kết bạn thành công !."
      }
      res.redirect('/User');
    }
    res.end();
  });
}
function xoaLoiMoi(req,res,TenDN,TenKhach){
  let str = String(TenDN)+String(TenKhach);
  let params = {
    TableName: 'DanhBa',
    Key:{ MaDanhBa:String(str) }
  };
  docClient.delete(params,(err,data)=>{
    if(err){
      console.log(err);
      console.log(str);
      res.redirect('/User');
    }
    else{
      res.redirect('/User');
    }
  });
}
function xoaKetBan(req,res,TenDN,TenKhach){
  let str = String(TenDN)+String(TenKhach);
  let str2 = String(TenKhach)+String(TenDN);
  let params = {
    TableName: 'DanhBa',
    Key:{ MaDanhBa:String(str) }
  };
  docClient.delete(params,(err,data)=>{
    if(err){
      console.log(err);
      console.log(str);
      res.redirect('/User');
    }
    else{
      // res.redirect('/User');
      let params = {
        TableName: 'DanhBa',
        Key:{ MaDanhBa:String(str2) }
      };
      docClient.delete(params,(err,data)=>{
        if(err){
          res.redirect('/User');
        }
        else{
          res.redirect('/User');
        }
      });
    }
  });
}
function ketBan(req,res,TenDN,TenKhach, BietDanh){
  let strMA = String(TenDN)+String(TenKhach);
  let params2={
    TableName:"DanhBa",
    Item:{
      MaDanhBa:String(strMA),
      BietDanh:String(BietDanh),
      TenDN:String(TenDN),
      TenKhach:String(TenKhach),
      TrangThai:String("Chưa Chấp Nhận")
    }
  };
  docClient.put(params2,(err,data)=>{
    if(err){
      console.log(err);
    }
    else{
      res.redirect('/User');
    }
  });
}
function GuiOTPQuaGmail(Email,OTP,res){
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'duongduongtruong99@gmail.com',
      pass: 'Mithrilvn147'
    }
  });
  var mailOptions = {
    from: 'duongduongtruong99@gmail.com',
    to: Email,
    subject: 'Active Account Xanuforest',
    text: 'OTP cua ban la: '+ OTP
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
function updateItem_DK(TenDN,HoTen, SDT, GioiTinh,Email,Quyen,TrangThai,MatKhau, req,res) {
  let params = {
    TableName: 'Users',
    Key:{
      "TenDN":String(TenDN)
    },
    UpdateExpression: "set #ht=:HoTen,#sdt=:SDT,#gt=:GioiTinh,#em=:Email,#quyen=:Quyen, #trangthai=:TrangThai,#matkhau=:MatKhau",
    ExpressionAttributeNames: {
      '#ht':'HoTen',
      '#gt':'GioiTinh',
      '#em':'Email',     
      '#quyen':'Quyen',
      '#trangthai':'TrangThai',
      '#matkhau':'MatKhau',
      '#sdt':'SDT'
    },
    ExpressionAttributeValues:{
      ':HoTen':String(HoTen),
      ':GioiTinh':String(GioiTinh),
      ':Email':String(Email),     
      ':Quyen':String("User"),
      ':TrangThai':String("Kích Hoạt"),
      ':MatKhau':String(MatKhau),
      ':SDT':String(SDT)
    },
    ReturnValues:"UPDATED_NEW"
  };
  docClient.update(params, (err, data) => {
    if (err) {
      FORM.writeEditForm(TenDN,HoTen, GioiTinh,Quyen,TrangThai,MatKhau, res);
      res.write('<h5 style="color:red;">Vui lòng nhập đủ các thuộc tính</h5>');
    } else {
      req.session.User = {
        name_HT: HoTen,
        name_DN: TenDN
      }
      res.writeHead(302, {'Location': '/User'});
      res.end();
    }
    res.end();
  })
}
function HienThiThongTinCaNhan(TenDN,req,res) {

  let paramsUser = {
    TableName: 'Users',
    FilterExpression : '#tendn = :TenDNKT',
    ExpressionAttributeNames : {'#tendn': 'TenDN'},
    ExpressionAttributeValues : {':TenDNKT': String(TenDN)}
  };
  let scanObjectUser = {};
  if (TenDN) { 
      docClient.scan(paramsUser, function onScan(err,data){
        if (err) {
          //FORM.PageDangNhapSaiThongTin(res);
          console.error('Unable to scan the table. Error JSON:', JSON.stringify(err, null, 2));
        } 
        else {   
          scanObjectUser.data = data;
          HienThiPerson =   scanObjectUser.data;  
          req.session.User = {
            name_HT: HienThiPerson.Items[0].HoTen.toString(),
            name_DN: HienThiPerson.Items[0].TenDN.toString()
          }
      //  console.log(req.session.req.session.User.name_HT);        
          let params = {
            TableName: "DanhBa",
            FilterExpression : '#tt = :TrangThaiKT and #tc = :TenDNKT',
            ExpressionAttributeNames : {'#tt': 'TrangThai', '#tc': 'TenDN' },
            ExpressionAttributeValues : {':TrangThaiKT': String("Đã Chấp Nhận"), ':TenDNKT': String(TenDN)}
          };
          let scanObject_danhba = {};
          let dsachban_KhongChuaDanhSachNhom=[];
          docClient.scan(params, (err, data) => {
            if (err) {
              scanObject_danhba.err = err;
            } else {
              data.Items.forEach((DanhBa) => {
                var test=parseInt(DanhBa.TenKhach);
                if(isNaN(test))
                {
                  //console.log(DanhBa.TenKhach);
                  dsachban_KhongChuaDanhSachNhom.push(DanhBa);
                }
              });
              scanObject_danhba.data = dsachban_KhongChuaDanhSachNhom;
              FORM.PageCapNhapThongTinChuTaiKhoan(req,res,scanObjectUser,scanObject_danhba,  req.session.User.name_HT);  
              res.end();       
            }
          });
      }
    });
  }
}
function updateThongTinChuTK(TenDN, SDT, Email,GioiTinh,HoTen, req,res) {
  //console.log(GioiTinh)
  let params = {
    TableName: 'Users',
    Key:{
      "TenDN": String(TenDN)
    },
    UpdateExpression: "set #ht=:HoTen,#sdt=:SDT,#gt=:GioiTinh,#email=:Email",
    ExpressionAttributeNames: {
      '#ht':'HoTen',
      '#gt':'GioiTinh',     
      '#email':'Email',
      '#sdt':'SDT'     
    },
    ExpressionAttributeValues:{
      ':HoTen':String(HoTen),
      ':GioiTinh':String(GioiTinh),     
      ':Email':String(Email),
      ':SDT':String(SDT)
    },
    ReturnValues:"UPDATED_NEW"
  };
  docClient.update(params, (err, data) => {
    if (err) {
      res.write('<h5 style="color:red;">Vui lòng nhập đủ các thuộc tính</h5>');
    } else {
      res.writeHead(302, {'Location': '/editThongTinCaNhan'});
     // res.end();
    }
  });
} 
function updateMatKhau(MatKhauMoi,MatKhauCu,req,res) {
  let params = {
    TableName: 'Users',
    FilterExpression : '#tdn = :TenDN and #mk = :MatKhau',
    ExpressionAttributeNames : {'#tdn': 'TenDN', '#mk': 'MatKhau' },
    ExpressionAttributeValues : {':MatKhau': String(MatKhauCu), ':TenDN': String(req.session.User.name_DN)}
  };
  docClient.scan(params,(err,data)=>{
    if(err){
     
    }else{
      if(data.Items.length>0){
        let params1 = {
          TableName: 'Users',
          Key:{
            "TenDN": String(req.session.User.name_DN)
          },
          UpdateExpression: "set #mk=:MatKhau",
          ExpressionAttributeNames: {
            '#mk':'MatKhau'
          },
          ExpressionAttributeValues:{
            ':MatKhau':String(MatKhauMoi)
          },
          ReturnValues:"UPDATED_NEW"
        };
        docClient.update(params1,(err,data)=>{
          if(err){
            console.log(err);
            res.redirect('/User');
          }
          else{
            req.session.ThongBaoDoiMatKhau = {
              tb: "Đổi mật khẩu thành công !."
            }
            res.redirect('/User');
            res.end();
          }
        });
      }
      else{
        req.session.ThongBaoDoiMatKhau = {
          tb: "Mật khẩu cũ nhập sai !."
        }
        res.redirect('/User');
        res.end();
      }
    }
  });
} 

function KiemTraEmail(EmailNhapVao, OTP,res,req){
  let params = {
    TableName: 'Users',
    FilterExpression : '#em = :Email',
    ExpressionAttributeNames : {'#em': 'Email'},
    ExpressionAttributeValues : {':Email': String(EmailNhapVao)}
  };
  docClient.scan(params,(err,data)=>{
    if(err){

    }else{
      if(data.Items.length>0){
        req.session.ThongBaoKTEmail = {
          tb: "Email đã tồn tại !."
        }        
        FORM.NhapMaKichHoatBangGmail(EmailNhapVao,res,req);      
      }
      else{             
        req.session.ThongBaoKTEmail = {
          tb: "OTP "+OTP+ " đã được gửi qua email!"
        }
        FORM.NhapMaKichHoatBangGmail(EmailNhapVao,res,req);
        GuiOTPQuaGmail(EmailNhapVao,OTP,res);          
      }
    }
  });
}
function LayDuLieuChat(res,req,tenChu,BietDanh,MaKhach,MaChat) {
  let params = {
    TableName: "DanhBa",
    FilterExpression : '#tt = :TrangThaiKT and #tc = :TenDNKT',
    ExpressionAttributeNames : {'#tt': 'TrangThai', '#tc': 'TenDN' },
    ExpressionAttributeValues : {':TrangThaiKT': String("Đã Chấp Nhận"), ':TenDNKT': String(tenChu)}
  };
  let scanObject = {};
  let danhsachtinnhan={};
  let dsachban_KhongChuaDanhSachNhom=[];
  docClient.scan(params, (err, data) => {
    
    if (err) {
      scanObject.err = err;
    } else {
      data.Items.forEach((DanhBa) => {
        var test=parseInt(DanhBa.TenKhach);
        if(isNaN(test))
        {
          //console.log(DanhBa.TenKhach);
          dsachban_KhongChuaDanhSachNhom.push(DanhBa);
        }
      });
      scanObject.data = dsachban_KhongChuaDanhSachNhom;
      let params2 = {
        TableName: "Chat",
        // KeyConditionExpression: '#SapXep = :SapXep and #MaChat=:MaChat',
        FilterExpression : '(#Ng1 = :NguoiGui and #Ng2 = :NguoiNhan)or(#Ng1 = :NguoiNhan and #Ng2 = :NguoiGui)',
        ExpressionAttributeNames : {'#Ng1': 'NguoiGui', '#Ng2': 'NguoiNhan'},
        ExpressionAttributeValues : {':NguoiGui': String(tenChu), ':NguoiNhan': String(MaKhach)},
        // Limit: 1,
        ScanIndexForward: true,    // true = ascending, false = descending
        // ExpressionAttributeValues: {
        //     ':MaChat': 'MaChat'
        // }
      };
        
      //console.log(tenChu);
      //console.log(MaKhach);   
      docClient.scan(params2,(err,data)=>{
        if (err) {
          danhsachtinnhan.err = err;
        } else {
          danhsachtinnhan.data = data;
          FORM.LoadKhungChat(req,res,scanObject,req.session.User.name_HT,BietDanh,danhsachtinnhan,tenChu,MaChat,MaKhach);
        }
      })
    }
  });

}
function LuuTinNhan(MaChat,NoiDung,ThoiGian,NguoiGui,NguoiNhan,HinhAnh) {
  let params = {
    TableName: 'Chat',
    Item: {
      MaChat: String(MaChat),
      SapXep: Number(PhatSinhMaChat()),
      NoiDung: String(NoiDung),
      ThoiGian: String(ThoiGian),
      NguoiGui: String(NguoiGui),
      NguoiNhan: String(NguoiNhan),
      HinhAnh:String(HinhAnh)
    }
  };
  docClient.put(params, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(MaChat);
    }
  });
}
function LuuTinNhanNhom(MaChat,NoiDung,ThoiGian,NguoiGui,NguoiNhan,HinhAnh) {
  let params = {
    TableName: 'Chat',
    Item: {
      MaChat: String(MaChat),
      SapXep: Number(PhatSinhMaChat()),
      NoiDung: String(NoiDung),
      ThoiGian: String(ThoiGian),
      NguoiGui: String(NguoiGui),
      NguoiNhan: String(NguoiNhan),
      HinhAnh:String(HinhAnh)
    }
  };
  docClient.put(params, (err) => {
    if (err) {
      console.log(err);
    } else {
    }
  });
}
function LuuTinNhanCoHinh(MaChat,MaSapXep,NoiDung,ThoiGian,NguoiGui,NguoiNhan,HinhAnh) {
  let params = {
    TableName: 'Chat',
    Item: {
      MaChat: String(MaChat),
      SapXep: Number(MaSapXep),
      NoiDung: String(NoiDung),
      ThoiGian: String(ThoiGian),
      NguoiGui: String(NguoiGui),
      NguoiNhan: String(NguoiNhan),
      HinhAnh:String(HinhAnh)
    }
  };
  docClient.put(params, (err) => {
    if (err) {
      console.log(err);
    } else {
    }
  });
}
function LuuTinNhanCoHinh_Nhom(MaChat,MaSapXep,NoiDung,ThoiGian,NguoiGui,NguoiNhan,HinhAnh) {
  let params = {
    TableName: 'Chat',
    Item: {
      MaChat: String(MaChat),
      SapXep: Number(MaSapXep),
      NoiDung: String(NoiDung),
      ThoiGian: String(ThoiGian),
      NguoiGui: String(NguoiGui),
      NguoiNhan: String(NguoiNhan),
      HinhAnh:String(HinhAnh)
    }
  };
  docClient.put(params, (err) => {
    if (err) {
      console.log(err);
    } else {
    }
  });
}
function PhatSinhMaChat(){
  var currentdate = new Date();       
    var d1 = ChuoiTuSo(currentdate.getFullYear()) ;
    var d2 = ChuoiTuSo(currentdate.getMonth()+1);
    var d3=ChuoiTuSo(currentdate.getDate());
    var d4 = ChuoiTuSo(currentdate.getHours());
    var d5 = ChuoiTuSo(currentdate.getMinutes());
    var d6 = ChuoiTuSo(currentdate.getSeconds());
    var d7 = ChuoiMiliseconds(currentdate.getMilliseconds());
    var str= d1+d2+d3+d4+d5+d6+d7;
    return str;
}
function ChuoiTuSo(s){
  if(s<10)
    return "0"+String(s);
  else
   return String(s);
}
function ChuoiMiliseconds(s){
  if(s<10)
    return "00"+String(s);
  else if(s<100)
   return "0"+ String(s);
  else
   return String(s);
}

var Global_LayAnh = {
  HinhAnh :"123",
  KeyHinh :"123"
}
  function LayURLHinhAnh()
  {
    return (Global_LayAnh.HinhAnh)
  }
  function LayKeyHinh()
  {
    return (Global_LayAnh.KeyHinh)
  }
  function UploadAnhChat(res,filename1,fileType1){
    const fileName = filename1;
    const fileType = fileType1;
    const s3Params = {
      Bucket: configAWS.BUCKET,
      Key: fileName,
      Expires: 60,
      ContentType: fileType,
      ACL: "public-read"
    };
  
    s3.getSignedUrl("putObject", s3Params, (err, data) => {
      if (err) {
        console.log(`getSignedUrl error: `, err);
   //     return res.end();
      }
      const returnData = {
        signedRequest: data,
        url: `https://${configAWS.BUCKET}.s3.amazonaws.com/${fileName}`
      };
     // console.log(`File uploaded successfully. ${url}`);
        res.write(JSON.stringify(returnData));
        Global_LayAnh.HinhAnh = String(returnData.url);
     //   console.log("TrongAWS url:"+String(returnData.url));
        res.end();
    });
  }




  function LayDuLieuChatNhom(res,req,tenChu,BietDanh,NguoiNhan,MaChat) {
    let params = {
      TableName: "DanhBa",
      FilterExpression : '#tt = :TrangThaiKT and #tc = :TenDNKT',
      ExpressionAttributeNames : {'#tt': 'TrangThai', '#tc': 'TenDN' },
      ExpressionAttributeValues : {':TrangThaiKT': String("Đã Chấp Nhận"), ':TenDNKT': String(tenChu)}
    };
    let scanObject = {};
    let danhsachtinnhan={};
    let dsachban_KhongChuaDanhSachNhom=[];
    let list_thanhvien = {};
    let thanhviens = [];
    docClient.scan(params, (err, data) => {
      
      if (err) {
        scanObject.err = err;
      } else {
        data.Items.forEach((DanhBa) => {
          var test=parseInt(DanhBa.TenKhach);
          if(isNaN(test))
          {
            dsachban_KhongChuaDanhSachNhom.push(DanhBa);
          }
        });
        scanObject.data = dsachban_KhongChuaDanhSachNhom;
        let params2 = {
          TableName: "Chat",
          FilterExpression : '#Ng = :NguoiNhan',
          ExpressionAttributeNames : {'#Ng': 'NguoiNhan'},
          ExpressionAttributeValues : {':NguoiNhan': String(NguoiNhan)},
          // Limit: 1,
          ScanIndexForward: true,    // true = ascending, false = descending
        };          
        docClient.scan(params2,(err,data)=>{
          if (err) {
            danhsachtinnhan.err = err;
          } else {           
            danhsachtinnhan.data = data;
            let params_thanhvien = {
              TableName: "DanhBa",
              FilterExpression : '#tenkhach = :TenKhach',
              ExpressionAttributeNames : {'#tenkhach': 'TenKhach' },
              ExpressionAttributeValues : {':TenKhach': String(NguoiNhan)}
            };
            let scanObject_thanhvien = {};
            
            docClient.scan(params_thanhvien, (err, data) => {
              if (err) {
                scanObject_thanhvien.err = err;
              } else {
                scanObject_thanhvien.data = data;
                scanObject_thanhvien.data.Items.forEach((tv) => {
                  let param = {
                    TableName: "Users",
                    FilterExpression : '#tendn = :TenDN',
                    ExpressionAttributeNames : {'#tendn': 'TenDN' },
                    ExpressionAttributeValues : {':TenDN': String(tv.TenDN)}
                  };
                  docClient.scan(param, (err, data1) => {                   
                    if(data1){
                      if(data1.Items.length>0){
                        thanhviens.push(data1.Items[0]);
                      }
                    }
                    if(data.Items.length === thanhviens.length)//Số người tìm được bằng số thành viên trong nhóm thì dừng
                    {
                      list_thanhvien.data = thanhviens;
                      let param = {
                        TableName: 'Nhom',
                        FilterExpression : '#manhom = :MaNhom',
                        ExpressionAttributeNames : {'#manhom': 'MaNhom'},
                        ExpressionAttributeValues : {':MaNhom': Number(NguoiNhan)}
                      }
                      var isChuPhong = {};                     
                      docClient.scan(param, function onScan(err,data){
                          if(err){
                            isChuPhong.err = err;                           
                          }
                          else{                           
                            if(data.Items.length>0){
                              if(data.Items[0].ChuNhom === req.session.User.name_DN){
                                // Là chủ phòng, ghép code tiếp (có các nút giải tán nhóm, xóa thành viên)
                                FORM.LoadKhungChatNhomLaChuNhom(req,res,scanObject,req.session.User.name_HT,BietDanh,danhsachtinnhan,tenChu,MaChat,NguoiNhan,list_thanhvien);
                              }
                              else{
                                // Không phải chủ phòng (chỉ có nút rời nhóm)
                                FORM.LoadKhungChatNhomKhongLaChuNhom(req,res,scanObject,req.session.User.name_HT,BietDanh,danhsachtinnhan,tenChu,MaChat,NguoiNhan,list_thanhvien);
                              }
                            }
                          }
                      });
                    }
                  });
                });
              }
            });
          }
        })
      }
    }); 
  }
  function LayDanhSachThanhVienNhom(req, res, maNhom){
    let params_thanhvien = {
      TableName: "DanhBa",
      FilterExpression : '#tenkhach = :TenKhach',
      ExpressionAttributeNames : {'#tenkhach': 'TenKhach' },
      ExpressionAttributeValues : {':TenKhach': String(maNhom)}
    };
    let scanObject_thanhvien = {};
    
    docClient.scan(params_thanhvien, (err, data) => {
      if (err) {
        scanObject_thanhvien.err = err;
      } else {
        scanObject_thanhvien.data = data;
        let list_thanhvien = {};
        let thanhviens = [];
        scanObject_thanhvien.data.Items.forEach((tv) => {
          let param = {
            TableName: "Users",
            FilterExpression : '#tendn = :TenDN',
            ExpressionAttributeNames : {'#tendn': 'TenDN' },
            ExpressionAttributeValues : {':TenDN': String(tv.TenDN)}
          };
          docClient.scan(param, (err, data1) => {
            if(data1){
              if(data1.Items.length>0){
                thanhviens.push(data1.Items[0]);
              }
            }
            if(data.Items.length === thanhviens.length)//Số người tìm được bằng số thành viên trong nhóm thì dừng
            {
              list_thanhvien.data = thanhviens; 
            }
          });
        });
      }
    });
  } 
  function RoiNhom(req, res, MaNhom){
    var maDB = String(req.session.User.name_DN) + String(MaNhom);
    let paramXoa = {
      TableName: 'DanhBa',
      Key:{ MaDanhBa:String(maDB) }
    };
    docClient.delete(paramXoa,(err,data)=>{
      //Trở về trang User
      res.redirect('/User');
    });
  }
  function GiaiTanNhom(req, res, MaNhom){
    let param_LayDanhSachNhom = {
      TableName: 'DanhBa',
      FilterExpression : '#khach = :manhom',
      ExpressionAttributeNames : {'#khach': 'TenKhach'},
      ExpressionAttributeValues : {':manhom': String(MaNhom)}
    }
    docClient.scan(param_LayDanhSachNhom, function onScan(err,data_TV){
      if(err){
        console.log(err);
      }
      else{
          //Xóa tin nhắn của nhóm
          let param_LayDSTin = {
            TableName: 'Chat',
            FilterExpression : '#nguoinhan = :manhom',
            ExpressionAttributeNames : {'#nguoinhan': 'NguoiNhan'},
            ExpressionAttributeValues : {':manhom': String(MaNhom)}
          }
          docClient.scan(param_LayDSTin, function onScan(err,data_TN){
            if(err){
              console.log(err);
            }
            else{
              data_TN.Items.forEach((tin)=>{
                var getMaChat=tin.MaChat;
                var getMaSapXep=Number(tin.SapXep);
                let paramXoaTN = {
                  TableName: 'Chat',
                  Key:{ 
                    MaChat:String(getMaChat), 
                    SapXep:Number(getMaSapXep)
                  }
                };
                docClient.delete(paramXoaTN,(err,data)=>{});
              });
            }
          });
          // Xóa thành viên
          data_TV.Items.forEach((tv)=>{
            let paramXoaTV = {
              TableName: 'DanhBa',
              Key:{ 
                MaDanhBa:String(tv.MaDanhBa)
              }
            };
            docClient.delete(paramXoaTV,(err,data)=>{});
          });
          //Xóa nhóm
          let paramXoaNhom = {
            TableName: 'Nhom',
            Key:{ 
              MaNhom:Number(MaNhom)
            }
          };
          docClient.delete(paramXoaNhom,(err,data)=>{});
          //Đợi 3s rồi mới load lại trang
          var delayInMilliseconds = 3000;
          setTimeout(function() {
            res.redirect('/User');
          }, delayInMilliseconds);
        }
    });
  }
  function XoaThanhVien(req, res,TenKhach,TenDN){
    var maDB = TenDN+String(TenKhach);
    console.log(maDB);
    let paramXoa = {
      TableName: 'DanhBa',
      Key:{ MaDanhBa:String(maDB) }
    };
    docClient.delete(paramXoa,(err,data)=>{
      //Trở về trang User
      res.redirect('/User');
    });
  }
  function HienThiTaoNhom(res,req) {
    let params = {
      TableName: "DanhBa",
      FilterExpression : '#tt = :TrangThaiKT and #tc = :TenDNKT',
      ExpressionAttributeNames : {'#tt': 'TrangThai', '#tc': 'TenDN' },
      ExpressionAttributeValues : {':TrangThaiKT': String("Đã Chấp Nhận"), ':TenDNKT': String(req.session.User.name_DN)},
    };
    let scanObject = {};
    let dsachban_KhongChuaDanhSachNhom=[];
    docClient.scan(params, (err, data) => {
      if (err) {
        scanObject.err = err;
      } else {
        data.Items.forEach((DanhBa) => {
          var test=parseInt(DanhBa.TenKhach);
          if(isNaN(test))
          {
            dsachban_KhongChuaDanhSachNhom.push(DanhBa);
          }
        });
          scanObject.data=dsachban_KhongChuaDanhSachNhom;
          FORM.HienThiTaoNhom(req,res,scanObject,req.session.User.name_HT);
      }
    });
  }
  function LuuTaoNhom(res,req,list,TenNhom){
    var maNhom=Number(PhatSinhMaChat());
    let param1={
      TableName:"Nhom",
      Item:{
        MaNhom:maNhom,
        TenNhom:String(TenNhom),
        ChuNhom:String(req.session.User.name_DN),
      }
    };
    docClient.put(param1,(err)=>{
      if(err){
        console.log(err);
      }
      else{
        let params2={
          TableName:"DanhBa",
          Item:{
            MaDanhBa:String(req.session.User.name_DN+maNhom),
            BietDanh:String(TenNhom),
            TenDN:String(req.session.User.name_DN),
            TenKhach:String(maNhom),
            TrangThai:String("Đã Chấp Nhận"),
            MaChat:String(maNhom)
          }
        };
        docClient.put(params2,(err,data)=>{
          if(err){
            console.log(err);
          }
          else{              
            for(var i=0;i<list.length;i++){
              let params3={
                TableName:"DanhBa",
                Item:{
                  MaDanhBa:String(list[i]+maNhom),
                  BietDanh:String(TenNhom),
                  TenDN:String(list[i]),
                  TenKhach:String(maNhom),
                  TrangThai:String("Đã Chấp Nhận"),
                  MaChat:String(maNhom)
                }
              };
              docClient.put(params3,(err,data)=>{
                if(err){
                  console.log(err);
                }
                else{              
                  
                }
              });
             } 
          }
        });
      }
      setTimeout(function() {   
        res.redirect(`/DSNhom?TenDN=${req.session.User.name_DN}`);        
    }, 2000);     
    });
  }
module.exports = {
  LayDanhSachNhom:LayDanhSachNhom,
  KiemTraDangNhap:KiemTraDangNhap,
  TimKiemUser:TimKiemUser,
  LayDanhSachBanBe:LayDanhSachBanBe,
  createItem_ChuKhach:createItem_ChuKhach,
  xoaLoiMoi:xoaLoiMoi,
  ketBan:ketBan,
  LayDanhSachLoiMoiVaDanhBa_AWS:LayDanhSachLoiMoiVaDanhBa_AWS,
  updateTrangThai:updateTrangThai,
  xoaKetBan:xoaKetBan,
  KiemTraEmail:KiemTraEmail,
  updateItem_DK:updateItem_DK,
  HienThiThongTinCaNhan:HienThiThongTinCaNhan,
  updateThongTinChuTK:updateThongTinChuTK,
  updateMatKhau:updateMatKhau,
  LayDuLieuChat:LayDuLieuChat,
  PhatSinhMaChat:PhatSinhMaChat,
  LuuTinNhan:LuuTinNhan,
  UploadAnhChat:UploadAnhChat,
  LayURLHinhAnh:LayURLHinhAnh,
  LayKeyHinh:LayKeyHinh,
  LuuTinNhanCoHinh:LuuTinNhanCoHinh,
  LayDuLieuChatNhom:LayDuLieuChatNhom,
  LayDanhSachThanhVienNhom:LayDanhSachThanhVienNhom,
  RoiNhom:RoiNhom,
  GiaiTanNhom:GiaiTanNhom,
  XoaThanhVien:XoaThanhVien,
  HienThiTaoNhom:HienThiTaoNhom,
  LuuTaoNhom:LuuTaoNhom,
  LuuTinNhanCoHinh_Nhom:LuuTinNhanCoHinh_Nhom,
  LuuTinNhanNhom:LuuTinNhanNhom
};