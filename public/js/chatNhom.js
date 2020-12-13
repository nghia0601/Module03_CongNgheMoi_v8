
$(function () {
    //Kết nối tới server socket đang lắng nghe
   // var DATA = require('../../aws');
    var PhatSinhMaChatTheoHinh;
   // var socket = io.connect('http://localhost:3000');
   var socket = io.connect('3.12.103.93:3000');
    //Socket nhận data và append vào giao diện

    socket.on("sendChatNhom", function (data) {
        var NguoiGui=$('#NguoiGui').val();
        if(NguoiGui==data.NguoiGui){
            $("#content").append('<div class="DesignChatBenPhai">'+
            '<div style="text-align:right;">'+data.message+'</div>'+
            '<div style="text-align:right;">'+data.date+'</div></div>')
            
        }else{
            $("#content").append('<div class="DesignChatBenTrai">'+
            '<div style="text-align:left;"><b>'+data.HoTen+'</b>:'+data.message+'</div>'+
            '<div style="text-align:left;">'+data.date+'</div></div>')
        }
    })
    
        socket.on("sendHinh_ChatNhom", function (data) {        
            var NguoiGui=$('#NguoiGui').val();
            if(NguoiGui==data.NguoiGui){
                $("#content").append('<div class="DesignChatBenPhai">'+
            '<div><img src="https://congnghemoixanuforest.s3.us-east-2.amazonaws.com/' +PhatSinhMaChatTheoHinh+ '" width = "100" height ="100" /> </div>'+
            '</div>')
                
            }else{
                $("#content").append('<div class="DesignChatBenTrai">'+
            '<div><img src="https://congnghemoixanuforest.s3.us-east-2.amazonaws.com/' +PhatSinhMaChatTheoHinh+ '" width = "100" height ="100" /> </div>'+
            '</div>')
            }})

    //Bắt sự kiện click gửi message
    $("#sendMessage").on('click', function () {
        var message = $('#message').val();
        var MaChat=$('#MaChat').val();
        var HoTen=$('#HoTen').val();
        var NguoiNhan=$('#NguoiNhan').val();
        var NguoiGui=$('#NguoiGui').val();
        var currentdate = new Date();
    var date=currentdate.getHours() +":"+currentdate.getMinutes()+":"+currentdate.getSeconds()+" - "+ 
    (currentdate.getMonth()+1)+"-"+currentdate.getDate() +"-"+
    currentdate.getFullYear();
    var x = document.getElementById("HinhAnh").files;
    var file = x[0];
    var HinhAnh="undefined";

    if(file!=null){
        //     var loca ="/Chat?Link="+ f.name;
        //  window.location = loca;
         HinhAnh = file.name;      
    }
    else
    {
        HinhAnh="undefined";
    }

        socket.emit('sendChatNhom', { message: message,MaChat:MaChat,HoTen:HoTen,date:date,NguoiGui:NguoiGui,NguoiNhan:NguoiNhan,HinhAnh:HinhAnh});
        socket.emit('sendHinh_ChatNhom', { message: message,MaChat:MaChat,HoTen:HoTen,date:date,NguoiGui:NguoiGui,NguoiNhan:NguoiNhan,HinhAnh:HinhAnh});       
        var input = $("#HinhAnh");
        input.replaceWith(input.val('').clone(true));
        $(".emojionearea-editor").html('');
    })


    //Send iamges
    $("#HinhAnh").on('change', function () {     
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
        PhatSinhMaChatTheoHinh = PhatSinhMaChat();
        var x = document.getElementById("HinhAnh").files;
        var file = x[0];
        var HinhAnh="undefined";
        if(file!=null){
            //     var loca ="/Chat?Link="+ f.name;
            //  window.location = loca;
            HinhAnh = file.name;
            getSignedRequest(file);
        }
        else
        {
            HinhAnh="undefined";
        }

        var delayInMilliseconds = 1000; //1 second

        setTimeout(function() {           
            alert("Upload ảnh thành công!");         
        }, delayInMilliseconds);   
        socket.emit('LuuHinhVeAWS', {HinhAnh:HinhAnh,PhatSinhMaChatTheoHinh:PhatSinhMaChatTheoHinh});
    })
    
    const getSignedRequest = file => {
        const xhr = new XMLHttpRequest();
        xhr.open(
          "GET",
          `3.12.103.93:3000/sign-s3?file-name=${PhatSinhMaChatTheoHinh}&file-type=${file.type}.png`
        );
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              const response = JSON.parse(xhr.responseText);
              uploadFile(file, response.signedRequest, response.url);
            } else {
       //       alert("Could not get signed URL.");
            }
          }
        };
        xhr.send();
      };
      const uploadFile = (file, signedRequest, url) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", signedRequest);
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              console.log(`Upload succeed to: ${url}`);
            } else {
         //     alert("Could not upload file.");
            }
          }
        };
        xhr.send(file);
      };


})