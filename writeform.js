const { Console } = require('console');
const fs = require('fs');
const session = require('express-session');
const express = require('express');
const app=express();
// app.use(express.static(path.join(__dirname,'public')));
app.use(session({
    resave: true, 
    saveUninitialized: true, 
    secret: 'somesecret',
    cookie: { maxAge: 6000000000000000 }}));
    
function PageDangNhap(res,obj) {
  let data = fs.readFileSync('Views/PageDangNhap.html', 'utf-8');
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(data);
}
function PageUser(req,res,obj, nameUser) {
  let data = fs.readFileSync('Views/PageUser.html', 'utf-8');
  res.writeHead(200, {'Content-Type': 'text/html'});
  if( typeof(req.session.ThongBaoGuiKetBanThanhCong)==="undefined")
  {
    req.session.ThongBaoGuiKetBanThanhCong = {
      tb: "123"
    }
  }
  if(typeof(req.session.ThongBaoDoiMatKhau)==="undefined")
  {
    req.session.ThongBaoDoiMatKhau = {
      tb: "123"
    }
  }
 //Thông báo gửi kêt bạn thành công
  if(req.session.ThongBaoGuiKetBanThanhCong.tb === "Gửi kết bạn thành công !.")
  {
    res.write(`<script language="javascript">alert('${req.session.ThongBaoGuiKetBanThanhCong.tb}')</script>`);
  }
  if(req.session.ThongBaoDoiMatKhau.tb === "Đổi mật khẩu thành công !.")
  {
    res.write(`<script language="javascript">alert('${req.session.ThongBaoDoiMatKhau.tb}')</script>`);
  }
  
  let strInputNameUser = '<span class="menu-collapsed" id="HoTenDN"></span>';
  let indexNameUser = data.indexOf(strInputNameUser) + strInputNameUser.length - 7;
  data = data.substr(0, indexNameUser)  + nameUser +  data.substr(indexNameUser);
  let strInputLinkNhom = '<a style="color: black;" id="DSNhom" >';
  let indexLinkNhom = data.indexOf(strInputLinkNhom) + strInputLinkNhom.length - 1;
  data = data.substr(0, indexLinkNhom)  + ` href="/DSNhom/?TenDN=${req.session.User.name_DN}"` +  data.substr(indexLinkNhom);
  let strInputBanBe = '<div class="control-group" id="tu"></div>';
  let indexBanBe = data.indexOf(strInputBanBe)+ strInputBanBe.length - 6;
  let str = "";
  str += "<table>";
  str += "<tbody>";

    obj.data.forEach((DanhBa) => {
      str = str + `<div class="ds" style="padding-top: 10px;border-bottom: 1px solid rgb(134, 134, 125);cursor:pointer;">
      <div class="dropdown show">
        <a href="/Chat?MaChat=${DanhBa.MaChat}&BietDanh=${DanhBa.BietDanh}&TenKhach=${DanhBa.TenKhach}" id="dskb" style="color: black;"><i class="fa fa-user fa-2x"></i>
            <span style="color: black;">${DanhBa.BietDanh}</span></a> 
        <a style="float:right;width: auto;height:30px;padding: 10px;color: #000;" class="dropdown-toggle" href="#" role="button" 
        id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></a> 
        <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
          <a class="dropdown-item" href="/XoaBan?TenDN=${req.session.User.name_DN}&TenKhach=${DanhBa.TenKhach}">Xóa bạn</a>
        </div>
      </div>
    </div>`;
    });
    str += "</tbody>";
    str += "</table>";
    data=data.substr(0, indexBanBe)+str+data.substr(indexBanBe);
  res.write(data);
}
function PageLoadLoiMoiKetBan_DanhBa(req,res,obj,objLoiMoi, nameUser,objUser)
{
  let data = fs.readFileSync('Views/PageUser.html', 'utf-8');
  res.writeHead(200, {'Content-Type': 'text/html'});
  let strInputNameUser = '<span class="menu-collapsed" id="HoTenDN"></span>';
  let indexNameUser = data.indexOf(strInputNameUser) + strInputNameUser.length - 7;
  data = data.substr(0, indexNameUser)  + nameUser +  data.substr(indexNameUser);
  let strInputLinkNhom = '<a style="color: black;" id="DSNhom" >';
  let indexLinkNhom = data.indexOf(strInputLinkNhom) + strInputLinkNhom.length - 1;
  data = data.substr(0, indexLinkNhom)  + ` href="/DSNhom/?TenDN=${req.session.User.name_DN}"` +  data.substr(indexLinkNhom);
  let strInputBanBe = '<div class="control-group" id="tu"></div>';
  let indexBanBe = data.indexOf(strInputBanBe)+ strInputBanBe.length - 6;
  let strBB = "";
  strBB += "<table>";
  strBB += "<tbody>";
    obj.data.forEach((DanhBa) => {
      strBB = strBB + `<div class="ds" style="padding-top: 10px;border-bottom: 1px solid rgb(134, 134, 125);cursor:pointer;">
      <div class="dropdown show">
        <a href="/Chat?MaChat=${DanhBa.MaChat}&BietDanh=${DanhBa.BietDanh}&TenKhach=${DanhBa.TenKhach}" id="dskb" style="color: black;"><i class="fa fa-user fa-2x"></i>
            <span style="color: black;">${DanhBa.BietDanh}</span></a> 
        <a style="float:right;width: auto;height:30px;padding: 10px;color: #000;" class="dropdown-toggle" href="#" role="button" 
        id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></a> 
        <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
          <a class="dropdown-item" href="/XoaBan?TenDN=${req.session.User.name_DN}&TenKhach=${DanhBa.TenKhach}">Xóa bạn</a>
        </div>
      </div>
    </div>`;
    });
    strBB += "</tbody>";
    strBB += "</table>";
    data=data.substr(0, indexBanBe)+strBB+data.substr(indexBanBe); 
  
    let strInputLoiMoi='<div id="HTdskb" style="" class="row" id="danhSachKB" ></div>';
    let indexLoiMoi = data.indexOf(strInputLoiMoi)+strInputLoiMoi.length-6;
    let strLM = "";
    // strLM += "<table>";
    // strLM += "<tbody>";
    objLoiMoi.data.Items.forEach((LoiMoi) => {
      strLM = strLM + `<div class="col-3" style="width: 200px;height: 200px;text-align: center;padding: 10px;margin-top: 10px;">
      <i class="fa fa-user fa-2x"></i>
      <div>`;//${LoiMoi.TenDN}
      objUser.data.Items.forEach((user)=>{
        if(user.TenDN===LoiMoi.TenDN){
          strLM = strLM + user.HoTen;
          strLM = strLM +`<div>
          <span><a class="btn btn-success" href="/xacnhan?MaDanhBa=${LoiMoi.MaDanhBa}&TenDN=${LoiMoi.TenKhach}&TenKhach=${LoiMoi.TenDN}"/>Xác nhận</a></span>
          <span><a class="btn btn-danger" href="/xoaloimoi?TenKhach=${req.session.User.name_DN}&TenDN=${user.TenDN}"/>Hủy</a></span>
      </div> `; 
        }
      });
    });
    // strLM += "</tbody>";
    // strLM += "</table>";
    data=data.substr(0, indexLoiMoi)+strLM+data.substr(indexLoiMoi); 
  res.write(data);
}
function WriteTable_KetBan(req,res,nameUser,Obj_LoiMoi, Obj_MinhMoi,obj_DanhBa,obj_User){
  let data = fs.readFileSync('Views/PageUser.html', 'utf-8');
  res.writeHead(200, {'Content-Type': 'text/html'});

  // Hien Thi Lai Danh Ba Cua User Dang Nhap
  let strInputNameUser = '<span class="menu-collapsed" id="HoTenDN"></span>';
  let indexNameUser = data.indexOf(strInputNameUser) + strInputNameUser.length - 7;
  data = data.substr(0, indexNameUser)  + nameUser +  data.substr(indexNameUser);
  let strInputLinkNhom = '<a style="color: black;" id="DSNhom" >';
  let indexLinkNhom = data.indexOf(strInputLinkNhom) + strInputLinkNhom.length - 1;
  data = data.substr(0, indexLinkNhom)  + ` href="/DSNhom/?TenDN=${req.session.User.name_DN}"` +  data.substr(indexLinkNhom);
  let strInputBanBe = '<div class="control-group" id="tu"></div>';
  let indexBanBe = data.indexOf(strInputBanBe)+ strInputBanBe.length - 6;
  let str = "";
  str += "<table>";
  str += "<tbody>";
  obj_DanhBa.data.forEach((DanhBa) => {
      str = str + `<div class="ds" style="padding-top: 10px;border-bottom: 1px solid rgb(134, 134, 125);cursor:pointer;">
      <div class="dropdown show">
        <a href="/Chat?MaChat=${DanhBa.MaChat}&BietDanh=${DanhBa.BietDanh}&TenKhach=${DanhBa.TenKhach}" id="dskb" style="color: black;"><i class="fa fa-user fa-2x"></i>
            <span style="color: black;">${DanhBa.BietDanh}</span></a> 
        <a style="float:right;width: auto;height:30px;padding: 10px;color: #000;" class="dropdown-toggle" href="#" role="button" 
        id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></a> 
        <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
          <a class="dropdown-item" href="/XoaBan?TenDN=${req.session.User.name_DN}&TenKhach=${DanhBa.TenKhach}">Xóa bạn</a>
        </div>
      </div>
    </div>`;
    });
    str += "</tbody>";
    str += "</table>";
    data=data.substr(0, indexBanBe)+str+data.substr(indexBanBe); 

    let strInputGiaoDienKB = '<div id="HienThiGiaoDienKB_div" class="row"  style=""></div>';
    let indexGiaoDienKB = data.indexOf(strInputGiaoDienKB) + strInputGiaoDienKB.length - 6;
    let str_HienThiDsBan = "";
    obj_User.data.Items.forEach((user) => {
      str_HienThiDsBan = str_HienThiDsBan + `<div class="col-4" style="width: 200px;height: 200px;text-align: center;padding: 10px;margin-top: 10px;">
      <i class="fa fa-user fa-2x"></i>
      <div>${user.HoTen} </div>`;       
      //Bản thân
        if(user.TenDN===req.session.User.name_DN){
          str_HienThiDsBan = str_HienThiDsBan + `<a class="btn btn-primary" href="/editThongTinCaNhan">Sửa thông tin</a>`
        }
        else{
          //Lời mời
          let a1=false;
          Obj_LoiMoi.data.Items.forEach((LoiMoi) => {
            if(LoiMoi.TenDN===user.TenDN){
              str_HienThiDsBan = str_HienThiDsBan + 
            `<div>
                <span><a class="btn btn-success" href="/xacnhan?MaDanhBa=${LoiMoi.MaDanhBa}&TenDN=${LoiMoi.TenKhach}&TenKhach=${LoiMoi.TenDN}"/>Xác nhận</a></span>
                <span><a class="btn btn-danger" href="/xoaloimoi?TenDN=${user.TenDN}&TenKhach=${req.session.User.name_DN}"/>Hủy</a></span>
                </div>`;
              a1=true;
            }
          });
          if(!a1){
            //Mình mời
            let a2=false;
            Obj_MinhMoi.data.Items.forEach((LoiMoi1) => {
              if(LoiMoi1.TenKhach===user.TenDN){
                str_HienThiDsBan = str_HienThiDsBan + `<div>
                    <span><a class="btn btn-danger" href="/xoaloimoi?TenDN=${req.session.User.name_DN}&TenKhach=${user.TenDN}"/>Hủy kết bạn</a></span>
                </div>`;
                a2=true;
              }
            });
            if(!a2){
              //Bạn bè
              let a3=false;
              obj_DanhBa.data.forEach((DB) => {
                if(DB.TenKhach===user.TenDN){
                  str_HienThiDsBan = str_HienThiDsBan + 
                  ` <div>
                      <span><a class="btn btn-success" href="/NhanTin?TenDN=${req.session.User.name_DN}&TenKhach=${user.TenDN}"/>Nhắn tin</a></span>
                      <span><a class="btn btn-danger" href="/XoaBan?TenDN=${req.session.User.name_DN}&TenKhach=${user.TenDN}"/>Xóa bạn</a></span>
                  </div>`;
                  a3=true;
                }
              });
              if(!a3){
                str_HienThiDsBan = str_HienThiDsBan + `<a class="btn btn-success" href="/ketban?TenDN=${req.session.User.name_DN}&TenKhach=${user.TenDN}&BietDanh=${user.HoTen}">Kết Bạn</a>`
              }
            }
          }
        }
        str_HienThiDsBan = str_HienThiDsBan +`</div>`;
      });
      data = data.substr(0, indexGiaoDienKB)+str_HienThiDsBan+data.substr(indexGiaoDienKB); 
  res.write(data);
}
function PageCapNhapThongTinChuTaiKhoan(req,res,obj_ChuTK,obj_DanhBa,nameUser)
  {
  let data = fs.readFileSync('Views/PageUser.html', 'utf-8');
  res.writeHead(200, {'Content-Type': 'text/html'});
  let strInputNameUser = '<span class="menu-collapsed" id="HoTenDN"></span>';
  let indexNameUser = data.indexOf(strInputNameUser) + strInputNameUser.length - 7;
  data = data.substr(0, indexNameUser)  + nameUser +  data.substr(indexNameUser);
  let strInputLinkNhom = '<a style="color: black;" id="DSNhom" >';
  let indexLinkNhom = data.indexOf(strInputLinkNhom) + strInputLinkNhom.length - 1;
  data = data.substr(0, indexLinkNhom)  + ` href="/DSNhom/?TenDN=${req.session.User.name_DN}"` +  data.substr(indexLinkNhom);
  let strInputBanBe = '<div class="control-group" id="tu"></div>';
  let indexBanBe = data.indexOf(strInputBanBe)+ strInputBanBe.length - 6;
  let strBB = "";
  strBB += "<table>";
  strBB += "<tbody>";
  obj_DanhBa.data.forEach((DanhBa) => {
      strBB = strBB + `<div class="ds" style="padding-top: 10px;border-bottom: 1px solid rgb(134, 134, 125);cursor:pointer;">
      <div class="dropdown show">
        <a href="/Chat?MaChat=${DanhBa.MaChat}&BietDanh=${DanhBa.BietDanh}&TenKhach=${DanhBa.TenKhach}" id="dskb" style="color: black;"><i class="fa fa-user fa-2x"></i>
            <span style="color: black;">${DanhBa.BietDanh}</span></a> 
        <a style="float:right;width: auto;height:30px;padding: 10px;color: #000;" class="dropdown-toggle" href="#" role="button" 
        id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></a> 
        <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
          <a class="dropdown-item" href="/XoaBan?TenDN=${req.session.User.name_DN}&TenKhach=${DanhBa.TenKhach}">Xóa bạn</a>
        </div>
      </div>
    </div>`;
    });
    strBB += "</tbody>";
    strBB += "</table>";
    data=data.substr(0, indexBanBe)+strBB+data.substr(indexBanBe); 
  
    let TenDN,HoTen,Gender,SDT,Email;
    obj_ChuTK.data.Items.forEach((User)=> {
     TenDN = User.TenDN;
     HoTen = User.HoTen;
     Gender = User.GioiTinh;
     SDT = User.SDT;
     Email = User.Email;
    });
    let strInputTT = '<div id="HienThiCapNhatTT" class="row"></div>';
    let indexTT = data.indexOf(strInputTT)+ strInputTT.length - 6;
    let str = "";
    if(Gender==="Nam"){
        str = str + `<form action="/saveEditThongTinCaNhan" method="get">                      
        <table>
           <tr>
               <td>Tên đăng nhập:</td> 
               <td><input class="input-form" name="TenDN" id ="TenDN" type="text" value="${TenDN}" 
                   placeholder="Nhập tên đăng nhập" onblur ="check_TenDN()" readonly />                                    
               </td>                         
           </tr>
           <tr>
              <td>Họ tên: </td>
              <td><input class="input-form" name="HoTen" id ="HoTen" type="text" value="${HoTen}" 
               placeholder="Nhập họ tên" onblur ="check_hoTen()" required />                               
               </td>
           </tr>
           <tr><td colspan="2"><span id ="error_hoTen" style="color: red;"></span></tr></td>
           <tr>
              <td>Giới tính: </td>
              <td><input name="GioiTinh" type="radio" value="Nam" id="Nam" checked/> Nam
               <input name="GioiTinh" type="radio" value="Nữ" id="Nu" /> Nữ   
              </td>                   
           </tr>
           <tr>
               <td>Gmail: </td>
               <td><input class="input-form" name="Email" id="mail" type="email" value="${Email}" 
                   placeholder="Nhập gmail" onblur ="check_Email()" required />                                    
               </td>   
           </tr>
           <tr><td colspan="2"><span id ="error_email" style="color:red;"></span></tr></td>
           <tr>
               <td>Số điện thoại: </td>
               <td><input class="input-form" name="SDT" id="SDT" type="number" value="${SDT}" 
                   placeholder="Nhập số điện thoại" onblur="check_SDT()" required />                                    
               </td>
           </tr>
           <tr><td colspan="2"><span id ="error_SDT" style="color: red;"></span></tr></td>
           <tr>
             <td colspan="2" style="text-align: center;"> <button type="submit" id="CNTT" class="btn btn-info">Xác nhận</button>   </td>                  
           </tr>
          </table>                          
   </form>`;
    }else{
      str = str + `<form action="/saveEditThongTinCaNhan" method="get">                      
        <table>
           <tr>
               <td>Tên đăng nhập:</td> 
               <td><input class="input-form" name="TenDN" id ="TenDN" type="text" value="${TenDN}"
                   placeholder="Nhập tên đăng nhập" onblur ="check_TenDN()" readonly />                                    
               </td>                         
           </tr>
           <tr>
              <td>Họ tên: </td>
              <td><input class="input-form" name="HoTen" id ="HoTen" type="text" value="${HoTen}"
               placeholder="Nhập họ tên" onblur ="check_hoTen()" required />                               
               </td>
           </tr>
           <tr><td colspan="2"><span id ="error_hoTen" style="color: red;"></span></tr></td>
           <tr>
              <td>Giới tính: </td>
              <td><input name="GioiTinh" type="radio" value="Nam" id="Nam" /> Nam
               <input name="GioiTinh" type="radio" value="Nữ" id="Nu" checked/> Nữ   
              </td>                   
           </tr>
           <tr>
               <td>Gmail: </td>
               <td><input class="input-form" name="Email" id="mail" type="email" value="${Email}"
                   placeholder="Nhập gmail" onblur ="check_Email()" required />                                    
               </td>   
           </tr>
           <tr><td colspan="2"><span id ="error_email" style="color:red;"></span></tr></td>
           <tr>
               <td>Số điện thoại: </td>
               <td><input class="input-form" name="SDT" id="SDT" type="number" value="${SDT}"
                   placeholder="Nhập số điện thoại" onblur="check_SDT()" required />                                    
               </td>
           </tr>
           <tr><td colspan="2"><span id ="error_SDT" style="color: red;"></span></tr></td>
           <tr>
             <td colspan="2" style="text-align: center;"> <button type="submit" id="CNTT" class="btn btn-info">Xác nhận</button>   </td>                  
           </tr>
          </table>                          
   </form>`;
    }
      data=data.substr(0, indexTT)+str+data.substr(indexTT);   
  res.write(data);
  }
function insertgmailHidden(data,email){
  let strInputSDT ='<input type="hidden" name="email"  id="emailID" />';
  let indexSDT = data.indexOf(strInputSDT) + strInputSDT.length -2;
  return data.substr(0,indexSDT) + ` value='${email}'` +data.substr(indexSDT);
}
function NhapThongTinDKSDT(SDT,res){
  let data = fs.readFileSync('Views/PageNhapThongTinDKSDT.html', 'utf-8');
  res.writeHead(200, {'Content-Type': 'text/html'});
  data=insertSDTformDK(data,SDT);
  res.write(data);
}
function PageDKBangSDT(res){
  let data = fs.readFileSync('Views/PageDKBangSDT.html', 'utf-8');
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(data);
}
function NhapThongTinDK(email,res){
  let data = fs.readFileSync('Views/PageNhapThongTinDK.html', 'utf-8');
  res.writeHead(200, {'Content-Type': 'text/html'});
  data=insertGmailformDK(data,email);
  res.write(data);
}
function PageDKBangGmail(res,req){
    let data = fs.readFileSync('Views/PageDKBangGmail.html', 'utf-8');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
}
function NhapMaKichHoatBangGmail(email,res,req){
  if(req.session.ThongBaoKTEmail.tb != "Email đã tồn tại !.")
  {
    let data = fs.readFileSync('Views/NhapMaKichHoatGmail.html', 'utf-8');
    res.writeHead(200, {'Content-Type': 'text/html'});
    data=insertgmailHidden(data,email);
    res.write(data);
  }else{
    let data = fs.readFileSync('Views/PageDKBangGmail.html', 'utf-8');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(`<script language="javascript">alert('${req.session.ThongBaoKTEmail.tb}')</script>`);
    res.write(data);
  }
  
}
function insertGmailformDK(data,Email) {
  let strInputGmail ='<input class="input-form" name="GmailDK" id="mail" type="email" placeholder="Nhập gmail" onblur ="check_Email()" readonly="readonly" />';
  let indexGmail = data.indexOf(strInputGmail) + strInputGmail.length - 2;
  return data.substr(0,indexGmail) + `value='${Email}'` +data.substr(indexGmail);
}
function insertSDTformDK(data,SDT){
  let strInputSDT ='<input class="input-form" name="SDT" type="number" placeholder="Nhập số điện thoại" required readonly="readonly" />';
  let indexSDT = data.indexOf(strInputSDT) + strInputSDT.length -2;
  return data.substr(0,indexSDT) + ` value='${SDT}'` +data.substr(indexSDT);
}
function insertDangNhapLoi(data) {
  let strInputName = '<button type="submit" class="loginhny-btn btn">Đăng Nhập</button>';
  let indexName = data.indexOf(strInputName);
  return data.substr(0, indexName) + ` <h5 style="color:red;">Sai thông tin đăng nhập, vui lòng kiểm tra lại</h5> ` + data.substr(indexName);
}
function PageDangNhapSaiMatKhau(res) {
  let data = fs.readFileSync('Views/PageDangNhap.html', 'utf-8');
  res.writeHead(200, {'Content-Type': 'text/html'});
  data = insertDangNhapSaiMatKhau(data);
  res.write(data);
}
function PageDangNhapSaiThongTin(res) {
  let data = fs.readFileSync('Views/PageDangNhap.html', 'utf-8');
  res.writeHead(200, {'Content-Type': 'text/html'});
  data = insertDangNhapSaiEmailHoacSDT(data);
  res.write(data);
}
function insertDangNhapSaiMatKhau(data) {
  let strInputName = '<button type="submit" class="loginhny-btn btn">Đăng Nhập</button>';
  let indexName = data.indexOf(strInputName);
  return data.substr(0, indexName) + ` <h5 style="color:red;">Mật khẩu sai vui lòng kiểm tra lại</h5> ` + data.substr(indexName);
}
function insertDangNhapSaiEmailHoacSDT(data) {
  let strInputName = '<button type="submit" class="loginhny-btn btn">Đăng Nhập</button>';
  let indexName = data.indexOf(strInputName);
  return data.substr(0, indexName) + ` <h5 style="color:red;">Thông tin đăng nhập sai vui lòng kiểm tra lại</h5> ` + data.substr(indexName);
}
function PageDangNhapChuaKichHoat(res) {
  let data = fs.readFileSync('Views/PageDangNhap.html', 'utf-8');
  res.writeHead(200, {'Content-Type': 'text/html'});
  data = insertDangNhapChuaKichHoat(data);
  res.write(data);
}
function insertDangNhapChuaKichHoat(data) {
  let strInputName = '<button type="submit" class="loginhny-btn btn">Đăng Nhập</button>';
  let indexName = data.indexOf(strInputName);
  return data.substr(0, indexName) + ` <h5 style="color:red;">Tài khoản chưa được kích hoạt</h5> ` + data.substr(indexName);
}

function WriteTable_DanhSachBanBe(obj, res) {
    res.write('<table>');
    //res.write('<table class="table table-striped table-bordered table-list" border="1px solid black" style="margin-left:250px;width:80%;"><thead> <tr> <th>Họ tên</th><th style="width:auto;">Số Điện Thoại</th> <th style="width:auto;">Giới Tính</th><th style="width:auto;">Gmail</th><th style="width:auto;">Quyền</th><th style="width:auto;">Trạng Thái</th><th colspan="2" style="width:auto;"></th> </tr></thead> ');
    if (obj.err) {
      res.write(`<h5 style="color:red;">Error:: ${obj.err}</h5>`);
      res.write('<tr><td colspan="5">Nothing to show</td></tr>');
    } else {
      if (obj.data.Items.length === 0) {
        res.write('<tr><td colspan="5">Nothing to show</td></tr>');
      }
      obj.data.Items.forEach((user) => {
        res.write(`
        <td>${user.TenKhach}</td>`);   
      });
    }
    res.write('</table>' );
    res.end();
  }
  function insertNhapSaiOTP(data) {
    let strInputName = '<input type="number" name="maKH" class="input-form" placeholder="Nhập mã kích hoạt." required="required" id="maKH" />';
    let indexName = data.indexOf(strInputName);
    return data.substr(0, indexName) + ` <h5 style="color:red;">Mã OTP không trùng</h5> ` + data.substr(indexName);
  }
  function LoadKhungChat(req,res,obj, nameUser,BietDanh,danhsachtinnhan,tenChu,MaChat,MaKhach) {
    let data = fs.readFileSync('Views/Chat.html', 'utf-8');
    res.writeHead(200, {'Content-Type': 'text/html'});
    let strInputNameUser = '<span class="menu-collapsed" id="HoTenDN"></span>';
    let indexNameUser = data.indexOf(strInputNameUser) + strInputNameUser.length - 7;
    data = data.substr(0, indexNameUser)  + nameUser +  data.substr(indexNameUser);
    let strInputLinkNhom = '<a style="color: black;" id="DSNhom" >';
    let indexLinkNhom = data.indexOf(strInputLinkNhom) + strInputLinkNhom.length - 1;   
    data = data.substr(0, indexLinkNhom)  + `href="/DSNhom/?TenDN=${req.session.User.name_DN}"` +  data.substr(indexLinkNhom);
    let strInputBanBe = '<div class="control-group" id="tu"></div>';
    let indexBanBe = data.indexOf(strInputBanBe)+ strInputBanBe.length - 6;
    let str = "";
    str += "<table>";
    str += "<tbody>";
    
      obj.data.forEach((DanhBa) => {
        str = str + `<div class="ds" style="padding-top: 10px;border-bottom: 1px solid rgb(134, 134, 125);cursor:pointer;">
        <div class="dropdown show">
          <a href="/Chat?MaChat=${DanhBa.MaChat}&BietDanh=${DanhBa.BietDanh}&TenKhach=${DanhBa.TenKhach}" id="dskb" style="color: black;"><i class="fa fa-user fa-2x"></i>
              <span style="color: black;">${DanhBa.BietDanh}</span></a> 
          <a style="float:right;width: auto;height:30px;padding: 10px;color: #000;" class="dropdown-toggle" href="#" role="button" 
          id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></a> 
          <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
            <a class="dropdown-item" href="/XoaBan?TenDN=${req.session.User.name_DN}&TenKhach=${DanhBa.TenKhach}">Xóa bạn</a>
          </div>
        </div>
      </div>`;
      });
      str += "</tbody>";
      str += "</table>";
      data=data.substr(0, indexBanBe)+str+data.substr(indexBanBe);
      let strInputChat = '<div id="Chat">';
    let indexChat = data.indexOf(strInputChat)+ strInputChat.length - 0;
    let strChat="";
    strChat+=`    
    <i class="fa fa-user fa-2x"></i><b style="font-size: 18px;"> ${BietDanh}</b>   
     <hr/>
     <div>
     <input type="hidden" value="${MaChat}" id="MaChat">
     <input type="hidden" value="${nameUser}" id="HoTen">
     <input type="hidden" value="${MaKhach}" id="NguoiNhan">
     <input type="hidden" value="${tenChu}" id="NguoiGui">
       <div id="content">`;
          danhsachtinnhan.data.Items.forEach((TinNhan)=>{
            if(TinNhan.NguoiGui==tenChu){
              strChat+= `<div class="DesignChatBenPhai">
             <div style="text-align:right;">${TinNhan.NoiDung}</div>`
             if(TinNhan.HinhAnh !== "undefined")
             {
               strChat+=`<div> <img src="${TinNhan.HinhAnh}" width="100" height="100" /> </div>`
             }
             strChat+=`
             <div style="text-align:right;">${TinNhan.ThoiGian}</div>
             </div>`            
            }else{
              strChat+= `<div class="DesignChatBenTrai">
              <div style="text-align:left;"><b>${BietDanh}</b>:${TinNhan.NoiDung}</div>`
              if(TinNhan.HinhAnh !== "undefined")
              {
                strChat+=`<div> <img src="${TinNhan.HinhAnh}" width="100" height="100" /> </div>`
              }
              strChat+=`
              <div style="text-align:left;">${TinNhan.ThoiGian}</div>
              </div>`
            }
              
          })
          strChat+= `</div>
     </div>`;
    data = data.substr(0, indexChat)  + strChat +  data.substr(indexChat);
    res.write(data);
    res.end();
  }
  function LoadNhomChat(req,res,objNhom,objBan, nameUser) {
    let data = fs.readFileSync('Views/PageUser.html', 'utf-8');
    res.writeHead(200, {'Content-Type': 'text/html'});
    let strInputNameUser = '<span class="menu-collapsed" id="HoTenDN"></span>';
    let indexNameUser = data.indexOf(strInputNameUser) + strInputNameUser.length - 7;
    data = data.substr(0, indexNameUser)  + nameUser +  data.substr(indexNameUser);
    let strInputLinkNhom = '<a style="color: black;" id="DSNhom" >';
    let indexLinkNhom = data.indexOf(strInputLinkNhom) + strInputLinkNhom.length - 1;
    data = data.substr(0, indexLinkNhom)  + ` href="/DSNhom/?TenDN=${req.session.User.name_DN}"` +  data.substr(indexLinkNhom);
    let strInputBanBe = '<div class="control-group" id="tu"></div>';
    let indexBanBe = data.indexOf(strInputBanBe)+ strInputBanBe.length - 6;
    let str = "";
    str += "<table>";
    str += "<tbody>";
  
    objBan.data.forEach((DanhBa) => {
        str = str + `<div class="ds" style="padding-top: 10px;border-bottom: 1px solid rgb(134, 134, 125);cursor:pointer;">
        <div class="dropdown show">
          <a href="/Chat?MaChat=${DanhBa.MaChat}&BietDanh=${DanhBa.BietDanh}&TenKhach=${DanhBa.TenKhach}" id="dskb" style="color: black;"><i class="fa fa-user fa-2x"></i>
              <span style="color: black;">${DanhBa.BietDanh}</span></a> 
          <a style="float:right;width: auto;height:30px;padding: 10px;color: #000;" class="dropdown-toggle" href="#" role="button" 
          id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></a> 
          <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
            <a class="dropdown-item" href="/XoaBan?TenDN=${req.session.User.name_DN}&TenKhach=${DanhBa.TenKhach}">Xóa bạn</a>
          </div>
        </div>
      </div>`;
      });
      str += "</tbody>";
      str += "</table>";
      data=data.substr(0, indexBanBe)+str+data.substr(indexBanBe);
      let strInputNhomChat = '<div id="Nhom"></div>';
    let indexNhomChat = data.indexOf(strInputNhomChat)+ strInputNhomChat.length - 6;
    let strNhom = "";
    strNhom += `<div id="Nhom">
    <h3><i class="fa fa-users fa-2x"></i><b>Danh sách nhóm</b></h3>
    <hr/>
    <div class="row" >`;
    objNhom.data.forEach((NhomChat) => {
        strNhom = strNhom + `<a href="/ChatNhom?NguoiNhan=${NhomChat.TenKhach}&BietDanh=${NhomChat.BietDanh}&MaChat=${NhomChat.MaChat}" class="col-3 nhom">
        <div style="text-align: center;"><b>${NhomChat.BietDanh}</b></div>
        <div style="text-align: center;"><i class="fa fa-user fa-4x"></i></div>
        </a>`;
      });
      strNhom += "</div>";
      data=data.substr(0, indexNhomChat)+strNhom+data.substr(indexNhomChat);
    res.write(data);
    res.end();
  }
  function LoadKhungChatNhomKhongLaChuNhom(req,res,obj, nameUser,BietDanh,danhsachtinnhan,tenChu,MaChat,NguoiNhan,danhSachThanhVien) {
    
    let data = fs.readFileSync('Views/ChatNhom.html', 'utf-8');
    res.writeHead(200, {'Content-Type': 'text/html'});
    let strInputNameUser = '<span class="menu-collapsed" id="HoTenDN"></span>';
    let indexNameUser = data.indexOf(strInputNameUser) + strInputNameUser.length - 7;
    data = data.substr(0, indexNameUser)  + nameUser +  data.substr(indexNameUser);
    let strInputLinkNhom = '<a style="color: black;" id="DSNhom" >';
    let indexLinkNhom = data.indexOf(strInputLinkNhom) + strInputLinkNhom.length - 1;   
    data = data.substr(0, indexLinkNhom)  + `href="/DSNhom/?TenDN=${req.session.User.name_DN}"` +  data.substr(indexLinkNhom);
    let strInputBanBe = '<div class="control-group" id="tu"></div>';
    let indexBanBe = data.indexOf(strInputBanBe)+ strInputBanBe.length - 6;
    let str = "";
    str += "<table>";
    str += "<tbody>";
      obj.data.forEach((DanhBa) => {
        str = str + `<div class="ds" style="padding-top: 10px;border-bottom: 1px solid rgb(134, 134, 125);cursor:pointer;">
        <div class="dropdown show">
          <a href="/Chat?MaChat=${DanhBa.MaChat}&BietDanh=${DanhBa.BietDanh}&TenKhach=${DanhBa.TenKhach}" id="dskb" style="color: black;"><i class="fa fa-user fa-2x"></i>
              <span style="color: black;">${DanhBa.BietDanh}</span></a> 
          <a style="float:right;width: auto;height:30px;padding: 10px;color: #000;" class="dropdown-toggle" href="#" role="button" 
          id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></a> 
          <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
            <a class="dropdown-item" href="/XoaBan?TenDN=${req.session.User.name_DN}&TenKhach=${DanhBa.TenKhach}">Xóa bạn</a>
          </div>
        </div>
      </div>`;
      });
      str += "</tbody>";
      str += "</table>";
      data=data.substr(0, indexBanBe)+str+data.substr(indexBanBe);
      let strInputChat = '<div id="Chat">';
    let indexChat = data.indexOf(strInputChat)+ strInputChat.length - 0;
    let strChat="";
    strChat+=`    
    <i class="fa fa-user fa-2x"></i><b style="font-size: 18px;"> ${BietDanh}</b>   
    <span class="dropdown show" style="text-align:end;">
                        <a style="float:right;width: auto;height:30px;padding: 10px;color: #000;" class="dropdown-update" href="#" role="button" 
                        id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog fa-2x"></i></a> 
                        <div class="dropdown-menu" aria-labelledby="dropdownMenuLink" style="cursor:pointer;">
                        <a type="button" class="dropdown-item" data-toggle="modal" data-target="#exampleModal">
                          Thành viên(${danhSachThanhVien.data.length}) 
                        </a>
                          <a class="dropdown-item" href="/RoiNhom?MaNhom=${NguoiNhan}">Rời nhóm</a>
                        </div>
                      </span>     
     <hr/>
     <div>
     <input type="hidden" value="${MaChat}" id="MaChat">
     <input type="hidden" value="${nameUser}" id="HoTen">
     <input type="hidden" value="${NguoiNhan}" id="NguoiNhan">
     <input type="hidden" value="${tenChu}" id="NguoiGui">
       <div id="content">`;
          danhsachtinnhan.data.Items.forEach((TinNhan)=>{            
              //console.log(danhSachThanhVien);
            if(TinNhan.NguoiGui==tenChu){
              strChat+= `<div class="DesignChatBenPhai">
             <div style="text-align:right;">${TinNhan.NoiDung}</div>`
             if(TinNhan.HinhAnh !== "undefined")
             {
               strChat+=`<div> <img src="${TinNhan.HinhAnh}" width="100" height="100" /> </div>`
             }
             strChat+=` 
             <div style="text-align:right;">${TinNhan.ThoiGian}</div>           
             </div>`            
            }else{   
              let HoTen;
              danhSachThanhVien.data.forEach((ThanhVien)=>{    
                if(TinNhan.NguoiGui ==ThanhVien.TenDN){   
                  HoTen=ThanhVien.HoTen;         
                }            
              }) 
              strChat+= `<div class="DesignChatBenTrai">
              <div style="text-align:left;"><b>${HoTen}</b>:${TinNhan.NoiDung}</div>`
              if(TinNhan.HinhAnh !== "undefined")
              {
                strChat+=`<div> <img src="${TinNhan.HinhAnh}" width="100" height="100" /> </div>`
              }
              strChat+=` 
              <div style="text-align:left;">${TinNhan.ThoiGian}</div>            
              </div>`                            
            }                         
        })
          strChat+= `</div>
     </div>`;
    data = data.substr(0, indexChat)  + strChat +  data.substr(indexChat);
    let strInputTVNhom = '<div id="thanhVienTrongNhom"></div>';
    let indexTVNhom = data.indexOf(strInputTVNhom)+ strInputTVNhom.length - 6;
    let strTVNhom="";
    danhSachThanhVien.data.forEach((tv)=>{
       strTVNhom+=`<h4>${tv.HoTen}</h4>`
   })
   data = data.substr(0, indexTVNhom)  + strTVNhom +  data.substr(indexTVNhom);
    res.write(data);
    res.end();
  }
  function LoadKhungChatNhomLaChuNhom(req,res,obj, nameUser,BietDanh,danhsachtinnhan,tenChu,MaChat,NguoiNhan,danhSachThanhVien) {
    
    let data = fs.readFileSync('Views/ChatNhom.html', 'utf-8');
    res.writeHead(200, {'Content-Type': 'text/html'});
    let strInputNameUser = '<span class="menu-collapsed" id="HoTenDN"></span>';
    let indexNameUser = data.indexOf(strInputNameUser) + strInputNameUser.length - 7;
    data = data.substr(0, indexNameUser)  + nameUser +  data.substr(indexNameUser);
    let strInputLinkNhom = '<a style="color: black;" id="DSNhom" >';
    let indexLinkNhom = data.indexOf(strInputLinkNhom) + strInputLinkNhom.length - 1;   
    data = data.substr(0, indexLinkNhom)  + `href="/DSNhom/?TenDN=${req.session.User.name_DN}"` +  data.substr(indexLinkNhom);
    let strInputBanBe = '<div class="control-group" id="tu"></div>';
    let indexBanBe = data.indexOf(strInputBanBe)+ strInputBanBe.length - 6;
    let str = "";
    str += "<table>";
    str += "<tbody>";
      obj.data.forEach((DanhBa) => {
        str = str + `<div class="ds" style="padding-top: 10px;border-bottom: 1px solid rgb(134, 134, 125);cursor:pointer;">
        <div class="dropdown show">
          <a href="/Chat?MaChat=${DanhBa.MaChat}&BietDanh=${DanhBa.BietDanh}&TenKhach=${DanhBa.TenKhach}" id="dskb" style="color: black;"><i class="fa fa-user fa-2x"></i>
              <span style="color: black;">${DanhBa.BietDanh}</span></a> 
          <a style="float:right;width: auto;height:30px;padding: 10px;color: #000;" class="dropdown-toggle" href="#" role="button" 
          id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></a> 
          <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
            <a class="dropdown-item" href="/XoaBan?TenDN=${req.session.User.name_DN}&TenKhach=${DanhBa.TenKhach}">Xóa bạn</a>
          </div>
        </div>
      </div>`;
      });
      str += "</tbody>";
      str += "</table>";
      data=data.substr(0, indexBanBe)+str+data.substr(indexBanBe);
      let strInputChat = '<div id="Chat">';
    let indexChat = data.indexOf(strInputChat)+ strInputChat.length - 0;
    let strChat="";
    strChat+=`    
    <i class="fa fa-user fa-2x"></i><b style="font-size: 18px;"> ${BietDanh}</b>   
    <span class="dropdown show" style="text-align:end;">
                        <a style="float:right;width: auto;height:30px;padding: 10px;color: #000;" class="dropdown-update" href="#" role="button" 
                        id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog fa-2x"></i></a> 
                        <div class="dropdown-menu" aria-labelledby="dropdownMenuLink" style="cursor:pointer;">
                        <a type="button" class="dropdown-item" data-toggle="modal" data-target="#exampleModal">
                          Thành viên(${danhSachThanhVien.data.length}) 
                        </a>
                          <a class="dropdown-item" href="/XoaNhom?MaNhom=${NguoiNhan}">Xóa nhóm</a>
                        </div>
                      </span>     
     <hr/>
     <div>
     <input type="hidden" value="${MaChat}" id="MaChat">
     <input type="hidden" value="${nameUser}" id="HoTen">
     <input type="hidden" value="${NguoiNhan}" id="NguoiNhan">
     <input type="hidden" value="${tenChu}" id="NguoiGui">
       <div id="content">`;
          danhsachtinnhan.data.Items.forEach((TinNhan)=>{            
              //console.log(danhSachThanhVien);
            if(TinNhan.NguoiGui==tenChu){
              strChat+= `<div class="DesignChatBenPhai">
             <div style="text-align:right;">${TinNhan.NoiDung}</div>`
             if(TinNhan.HinhAnh !== "undefined")
             {
               strChat+=`<div> <img src="${TinNhan.HinhAnh}" width="100" height="100" /> </div>`
             }
             strChat+=` 
             <div style="text-align:right;">${TinNhan.ThoiGian}</div>           
             </div>`            
            }else{   
              let HoTen;
              danhSachThanhVien.data.forEach((ThanhVien)=>{    
                if(TinNhan.NguoiGui ==ThanhVien.TenDN){   
                  HoTen=ThanhVien.HoTen;         
                }            
              }) 
              strChat+= `<div class="DesignChatBenTrai">
              <div style="text-align:left;"><b>${HoTen}</b>:${TinNhan.NoiDung}</div>`
              if(TinNhan.HinhAnh !== "undefined")
              {
                strChat+=`<div> <img src="${TinNhan.HinhAnh}" width="100" height="100" /> </div>`
              }
              strChat+=` 
              <div style="text-align:left;">${TinNhan.ThoiGian}</div>            
              </div>`                            
            }                         
        })
          strChat+= `</div>
     </div>`;
    data = data.substr(0, indexChat)  + strChat +  data.substr(indexChat);
    let strInputTVNhom = '<div id="thanhVienTrongNhom"></div>';
    let indexTVNhom = data.indexOf(strInputTVNhom)+ strInputTVNhom.length - 6;
    let strTVNhom="";
    danhSachThanhVien.data.forEach((tv)=>{
      if(tv.TenDN==tenChu){
        strTVNhom+=`<h4>${tv.HoTen}</h4>`;
      }
      else{
        strTVNhom+=`<h4>${tv.HoTen} &nbsp; <a style="float:right;" href="/Kick?TenKhach=${NguoiNhan}&TenDN=${tv.TenDN}">Xóa thành viên</a></h4>`
      }
       
   })
   data = data.substr(0, indexTVNhom)  + strTVNhom +  data.substr(indexTVNhom);
    res.write(data);
    res.end();
  }
  function HienThiTaoNhom(req,res,obj, nameUser) {
    let data = fs.readFileSync('Views/TaoNhom.html', 'utf-8');
    res.writeHead(200, {'Content-Type': 'text/html'});
    let strInputNameUser = '<span class="menu-collapsed" id="HoTenDN"></span>';
    let indexNameUser = data.indexOf(strInputNameUser) + strInputNameUser.length - 7;
    data = data.substr(0, indexNameUser)  + nameUser +  data.substr(indexNameUser);
    let strInputLinkNhom = '<a style="color: black;" id="DSNhom" >';
    let indexLinkNhom = data.indexOf(strInputLinkNhom) + strInputLinkNhom.length - 1;
    data = data.substr(0, indexLinkNhom)  + ` href="/DSNhom/?TenDN=${req.session.User.name_DN}"` +  data.substr(indexLinkNhom);
    let strInputTaoNhom = '<div id="noiDungTaoNhom"></div>';
    let indexTaoNhom = data.indexOf(strInputTaoNhom)+ strInputTaoNhom.length - 6; 
    let strTaoNhom=""; 
      obj.data.forEach((DanhBa) => {
        strTaoNhom+=`<div><span>${DanhBa.BietDanh}</span>
        <span><input type="button" id="Them${DanhBa.TenKhach}" name="${DanhBa.TenKhach}" class="btn btn-default" onclick="ThemBanVaoNhom(this.name)" value="Thêm" />
        <input type="button" id="Huy${DanhBa.TenKhach}" name="${DanhBa.TenKhach}" class="btn btn-default" onclick="HuyBanVaoNhom(this.name)" value="Hủy" style="display:none;" />
        </span>
        </div>`
      })  
      data=data.substr(0, indexTaoNhom)+strTaoNhom+data.substr(indexTaoNhom); 
    let strInputBanBe = '<div class="control-group" id="tu"></div>';
    let indexBanBe = data.indexOf(strInputBanBe)+ strInputBanBe.length - 6;
    let str = "";
    str += "<table>";
    str += "<tbody>";
  
      obj.data.forEach((DanhBa) => {
        str = str + `<div class="ds" style="padding-top: 10px;border-bottom: 1px solid rgb(134, 134, 125);cursor:pointer;">
        <div class="dropdown show">
          <a href="/Chat?MaChat=${DanhBa.MaChat}&BietDanh=${DanhBa.BietDanh}&TenKhach=${DanhBa.TenKhach}" id="dskb" style="color: black;"><i class="fa fa-user fa-2x"></i>
              <span style="color: black;">${DanhBa.BietDanh}</span></a> 
          <a style="float:right;width: auto;height:30px;padding: 10px;color: #000;" class="dropdown-toggle" href="#" role="button" 
          id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></a> 
          <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
            <a class="dropdown-item" href="/XoaBan?TenDN=${req.session.User.name_DN}&TenKhach=${DanhBa.TenKhach}">Xóa bạn</a>
          </div>
        </div>
      </div>`;
      
      });
      str += "</tbody>";
      str += "</table>";
      data=data.substr(0, indexBanBe)+str+data.substr(indexBanBe);        
    res.write(data);
    res.end();
  }
module.exports = {
  PageDangNhap: PageDangNhap,
  PageUser:PageUser,
  insertDangNhapChuaKichHoat:insertDangNhapChuaKichHoat,
  PageDangNhapSaiThongTin:PageDangNhapSaiThongTin,
  PageDangNhapSaiMatKhau:PageDangNhapSaiMatKhau,
  PageDangNhapChuaKichHoat:PageDangNhapChuaKichHoat,
  insertDangNhapLoi:insertDangNhapLoi,
  WriteTable_DanhSachBanBe:WriteTable_DanhSachBanBe,
  WriteTable_KetBan:WriteTable_KetBan,
  PageLoadLoiMoiKetBan_DanhBa:PageLoadLoiMoiKetBan_DanhBa,
  insertNhapSaiOTP:insertNhapSaiOTP,
  NhapMaKichHoatBangGmail:NhapMaKichHoatBangGmail,
  PageDKBangGmail:PageDKBangGmail,
  NhapThongTinDK:NhapThongTinDK,
  PageDKBangSDT:PageDKBangSDT,
  NhapThongTinDKSDT:NhapThongTinDKSDT,
  PageCapNhapThongTinChuTaiKhoan:PageCapNhapThongTinChuTaiKhoan,
  LoadKhungChat:LoadKhungChat,
  LoadNhomChat:LoadNhomChat,
  LoadKhungChatNhomKhongLaChuNhom:LoadKhungChatNhomKhongLaChuNhom,
  LoadKhungChatNhomLaChuNhom:LoadKhungChatNhomLaChuNhom,
  HienThiTaoNhom:HienThiTaoNhom
};
