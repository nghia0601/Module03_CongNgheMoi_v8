var listThanhVien=[];
    
    function ThemBanVaoNhom(tenDN){
        listThanhVien.push(tenDN);
        document.getElementById("Them"+tenDN).style.display = 'none';
        document.getElementById("Huy"+tenDN).style.display = 'block';
        console.log(listThanhVien);
}
function HuyBanVaoNhom(tenDN){
  for(var i=0;i<listThanhVien.length;i++){
    if(listThanhVien[i]==tenDN){
      document.getElementById("Them"+tenDN).style.display = 'block';
      document.getElementById("Huy"+tenDN).style.display = 'none';
      listThanhVien.splice(i,1);
      console.log(listThanhVien);
    }
  }  
}
function HienThiTaoNhom(){
    window.location=`/HienThiTaoNhom`;
  }
  function TaoNhom(){
    var jsonThanhVienNhom=JSON.stringify(listThanhVien);
    var tennhom = document.getElementById("tenNhom").value;
    tennhom = tennhom.replace(/\s/g, '');
    if(tennhom===""){
      alert("Vui lòng nhập tên nhóm");
    }else{
      if(listThanhVien.length<=1){
        alert("Nhóm phải có 2 thành viên trở lên");
      }else{
        window.location=`/TaoNhom?ListThanhVien=${jsonThanhVienNhom}&TenNhom=${tennhom}`;
      }
    }
  }