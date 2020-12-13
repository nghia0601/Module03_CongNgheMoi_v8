const http = require('http');
var path = require("path");
const url = require('url');
const fs = require('fs');
const port = 3000;
const FORM = require('./writeform');
const DATA = require('./aws');
const session = require('express-session');
const express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);


var Global_name = {
    MaChat :'', 
    BietDanh:'',   
    TenKhach:''
}
//Chỉ ra đường dẫn chứa css, js, images...
app.use(express.static(path.join(__dirname,'public')));
app.use(session({
    resave: true, 
    saveUninitialized: true, 
    secret: 'somesecret',
    cookie: { maxAge: 6000000000000000 }}));

var nameUserHT;
app.get('/',(req,res) =>{
    req.session.destroy();
    FORM.PageDangNhap(res);
    res.end();
})
app.get('/login',function(req,res){
    req.session.ThongBaoGuiKetBanThanhCong = {
        tb: null
      }
      req.session.ThongBaoDoiMatKhau = {
        tb: null
      }
    var InfoLogin= req.query.InfoLogin;
    var MatKhau= req.query.MatKhau;
    DATA.KiemTraDangNhap(req,res,InfoLogin,MatKhau);
})
    //---------S3
    var Global_S3 = {
        fileName :'', 
        fileType:''  
    }
    var Global_MaChatVoiHinh={ Ma:''}
    app.get("/sign-s3", (req, res) => {
     Global_S3.fileName = req.query["file-name"];
     Global_S3.fileType = req.query["file-type"];  
     // Đóng S3.
     DATA.UploadAnhChat(res,Global_S3.fileName, Global_S3.fileType);
    });
    //---------S3

app.get('/User',(req,res) =>{

    if(typeof(req.session.User) === "undefined")
    {
        FORM.PageDangNhap(res);
    }
    else
    {
      //DATA.LayDanhSachNhom(res,req,req.session.User.name_DN, req.session.User.name_HT);
      DATA.LayDanhSachBanBe(res,req,req.session.User.name_DN, req.session.User.name_HT);
    }
})
app.get('/DsBan',(req,res) =>{
    if(typeof(req.session.User) === "undefined")
    {
        FORM.PageDangNhap(res);
    }
    else
        DATA.LayDanhSachLoiMoiVaDanhBa_AWS(req,res);
})
app.get('/TimBan',(req,res) =>{
    if(typeof(req.session.User) === "undefined")
    {
        FORM.PageDangNhap(res);
    }
    else {
    var InfoSearch= req.query.InfoSearch;
    if(!InfoSearch){
        res.redirect('/User');
    }
    else{
        DATA.TimKiemUser(req,res,InfoSearch);  
    }}
})
//req.session.User.name_DN ---- Tên DN (Key trong Table User)
//req.session.User.name_HT ---- Họ Tên User
app.get('/CreateChuKhach',(req,res) =>{

    var TenDN= req.query.TenDN;
    var TenKhach= req.query.TenKhach;
    var BietDanh= req.query.BietDanh;
    DATA.createItem_ChuKhach(TenDN,TenKhach,BietDanh,req,res)
})
app.get('/xacnhan',function(req,res){
    let MaDanhBa=req.query.MaDanhBa;
    let TenDN=req.query.TenDN;
    let TenKhach=req.query.TenKhach;
    DATA.updateTrangThai(MaDanhBa,TenDN,TenKhach,res);
})
app.get('/xoaloimoi',function(req,res){
    let TenDN=req.query.TenDN;
    let TenKhach=req.query.TenKhach;
    DATA.xoaLoiMoi(req,res,TenDN,TenKhach);
})
app.get('/XoaBan',function(req,res){
    let TenDN=req.query.TenDN;
    let TenKhach=req.query.TenKhach;
    DATA.xoaKetBan(req,res,TenDN,TenKhach);
})
app.get('/ketban',function(req,res){
    let TenDN=req.query.TenDN;
    let TenKhach=req.query.TenKhach;
    let BietDanh=req.query.BietDanh;
    DATA.ketBan(req,res,TenDN,TenKhach, BietDanh);
})
app.get('/DKEmail',function(req,res){
    FORM.PageDKBangGmail(res,req);

})
app.get('/DKSDT',function(req,res){
    FORM.PageDKBangSDT(res);
        res.end();
})
app.get('/NhapMaKH',function(req,res){    
    var Email= req.query.email;
    var OTP=req.query.otp;
    Global_name.OTP=OTP;
    req.session.ThongBaoThongBaoKTEmail = {
        tb: null
      }
    DATA.KiemTraEmail(Email, OTP,res,req);
})
app.get('/NhapttEmail',function(req,res){
    
    var Email= req.query.email;
    //Console.log('otp');
    var OTP=req.query.otp;
    if(Global_name.OTP===OTP){
        FORM.NhapThongTinDK(Email,res);
    }else{
       return;
    }
    
})
app.get('/NhapttSDT',function(req,res){
    var SDT= req.query.SDT;
    FORM.NhapThongTinDKSDT(SDT,res);
        res.end();
})
app.get('/save_dk',function(req,res){
    var TenDN=req.query.TenDN;
    var SDT=req.query.SDT;
    var HoTen= req.query.HoTen;
    var GioiTinh= req.query.GioiTinh;
    var GmailDK= req.query.GmailDK;
    var Quyen= req.query.Quyen;
    var TrangThai= req.query.TrangThai;
    var MatKhau= req.query.MatKhau;
    DATA.updateItem_DK(TenDN,HoTen,SDT,GioiTinh,GmailDK,Quyen,TrangThai,MatKhau,req,res);
})
app.get('/editThongTinCaNhan',(req,res) =>{

    DATA.HienThiThongTinCaNhan(req.session.User.name_DN,req,res);
})
app.get('/saveEditThongTinCaNhan',(req,res) =>{
    var TenDN = req.query.TenDN;
    var SDT = req.query.SDT;
    var HoTen= req.query.HoTen;
    var GioiTinh= req.query.GioiTinh;
    var Email= req.query.Email;
   DATA.updateThongTinChuTK(TenDN,SDT,Email,GioiTinh,HoTen,req,res);
})
app.get('/DoiMK',(req,res) =>{
    var MKC = req.query.MatKhauCu;
    var MKM = req.query.MatKhauMoi;
   DATA.updateMatKhau(MKM,MKC,req,res);
   
})
app.get('/Chat',(req,res)=>{
    var BietDanh= req.query.BietDanh;
    var TenKhach= req.query.TenKhach;
    var MaChat= req.query.MaChat;

    DATA.LayDuLieuChat(res,req,req.session.User.name_DN,BietDanh,TenKhach,MaChat);   
})
io.on('connection', socket => {
    console.log('Welcome to server chat');
    socket.on('sendChat', function (data) {
        if(data.HinhAnh === "undefined")
        {
            io.sockets.emit('sendChat', data);  
          //  DATA.LuuTinNhan(data.MaChat,data.message,data.date,data.NguoiGui,data.NguoiNhan,data.HinhAnh); 
        }
        else
        {              
                 io.sockets.emit('sendChat', data);  
                 io.sockets.emit('sendHinh_Chat', data);  
                 console.log(DATA.LayURLHinhAnh());
               DATA.LuuTinNhanCoHinh(data.MaChat,Global_MaChatVoiHinh.Ma,data.message,data.date,data.NguoiGui,data.NguoiNhan, DATA.LayURLHinhAnh()); 
        }        
    });
    socket.on('LuuHinhVeAWS',function(data){
        if(data.HinhAnh!=="undefined")
        {
            Global_MaChatVoiHinh.Ma = data.PhatSinhMaChatTheoHinh;     
        }
    })
    socket.on('sendChatNhom', function (data) {
        if(data.HinhAnh === "undefined")
        {
            io.sockets.emit('sendChatNhom', data);  
            DATA.LuuTinNhanNhom(data.MaChat,data.message,data.date,data.NguoiGui,data.NguoiNhan,data.HinhAnh); 
        }
        else
        {              
                 io.sockets.emit('sendChatNhom', data);  
                 io.sockets.emit('sendHinh_ChatNhom', data);  
                 console.log(DATA.LayURLHinhAnh());
               DATA.LuuTinNhanCoHinh(data.MaChat,Global_MaChatVoiHinh.Ma,data.message,data.date,data.NguoiGui,data.NguoiNhan, DATA.LayURLHinhAnh()); 
        }        
    });
    socket.on('LuuHinhVeAWSNhom',function(data){
        if(data.HinhAnh!=="undefined")
        {
            Global_MaChatVoiHinh.Ma = data.PhatSinhMaChatTheoHinh;            
        }
    })

});
app.get("/DSNhom", function (req, res) {
    var TenDN= req.query.TenDN;
    DATA.LayDanhSachNhom(res,req,TenDN)
});
app.get('/ChatNhom',(req,res)=>{
    var BietDanh= req.query.BietDanh;
    var NguoiNhan= req.query.NguoiNhan;
    var MaChat= req.query.MaChat;
    DATA.LayDuLieuChatNhom(res,req,req.session.User.name_DN,BietDanh,NguoiNhan,MaChat); 
})
//Tạo socket 
app.get('/RoiNhom',function(req,res){
    let MaNhom=req.query.MaNhom;
    DATA.RoiNhom(req,res,MaNhom);
})
app.get('/XoaNhom',function(req,res){
    let MaNhom=req.query.MaNhom;
    DATA.GiaiTanNhom(req,res,MaNhom);
})
app.get('/Kick',function(req,res){
    let TenKhach=req.query.TenKhach;
    //console.log(TenKhach);
    let TenDN=req.query.TenDN;
    //console.log(TenDN);
     DATA.XoaThanhVien(req,res,TenKhach,TenDN);
})
app.get('/HienThiTaoNhom',(req,res)=>{
    //console.log(list);
    DATA.HienThiTaoNhom(res,req);
})
app.get('/TaoNhom',(req,res)=>{
    var list=JSON.parse(req.query.ListThanhVien);
    console.log(list);
    var TenNhom= req.query.TenNhom;
    DATA.LuuTaoNhom(res,req,list,TenNhom);   
})

server.listen(port,function(){
    console.log(`Server starting at port ${port} `);
})
