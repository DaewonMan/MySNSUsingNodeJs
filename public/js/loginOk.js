$(function(){
    var myId = $("mainUserID").val();
    var yourId = $("mainWaveID").val();
    var waverOpen = $("#mainWaverOpen").val();
    var firstLoc = 0;
    
    var mainImg = $("<img></img>").attr("src", "/img/wonsta.jpg").css("width", "35px");
    var mainImgA = $("<a></a>").attr("href", "home.go").css("transition", ".5s ease").css("opacity", "0");
    mainImgA.append(mainImg);
    $(".cttHeadTd").append(mainImgA);
    mainImgA.hide();
    
    $(window).scroll(function(){
        var wScrollTop = $(window).scrollTop(); // 스크롤 상단의 좌표
        
        if(wScrollTop == 0) {
            $(".homeImg").show();
            $(".homeImg").css("opacity", "1");
            mainImgA.css("opacity", "0");
            mainImgA.hide();
            
            $(".cttHeadTd").attr("align", "left");
            $("#cttHead").css("height", "100px");
            $("#mainHead").css("height", "100px");
            
            $("#searchInfo").css("opacity", "1");
        } else {
            $("#searchIdDiv").hide();
            $("#triDiv").hide();
            
            mainImgA.show();
            mainImgA.css("opacity", "1");
            $(".homeImg").css("opacity", "0");
            $(".homeImg").hide();
            
            $(".cttHeadTd").attr("align", "center");
            $("#cttHead").css("height", "70px");
            $("#mainHead").css("height", "70px");
            
            $("#searchInfo").css("opacity", "0");
            $("#searchInfo").val("");
        }
    });
    
    $("#bottomMenuDv").click(function(){
        addPostGo();
    });
    // 하단 메뉴
    $("#bottomMenuDv").mouseenter(function(){
        $("#bottomMenuDv").css("height", "120px");
        
        $("#bottomMenuDv").css("background-position", "0 0");
                
        $("#addPostDiv").css("color","white");
        
    });
    $("#bottomMenuDv").mouseleave(function(){
        $("#bottomMenuDv").css("height", "50px");
        $("#bottomMenuDv").css("background-color", "##BCAAA4");
        $("#bottomMenuDv").css("background-image", "linear-gradient(to left, transparent, transparent 50%, #0D47A1 50%, #0D47A1)");
        $("#bottomMenuDv").css("background-position", "100% 0");
        $("#bottomMenuDv").css("background-size", "200% 100%");
        $("#addPostDiv").css("color","#333333");
    });
    
    // 검색 input에 대한 포커스
    $('#searchInfo').focus(function(){
        $(this).css('text-align', 'left');
        $('#searchIdDiv').css("opacity", "1");
        $('#triDiv').css("opacity", "1");
    });
    
    
    $('#searchInfo').blur(function(){
        $(this).css('text-align', 'center');
        $('#searchIdDiv').css("opacity", "0");
        $('#triDiv').css("opacity", "0");
    });
    
    // 검색 내용 출력
    searchIdEvent(myId);
    
    // 다른 멤버의  게시물 페이지로 갔을 때 공개 여부에 따른 화면 표시
    //if(yourId != myId && waverOpen == 'close') {
    //    followOrNot2(yourId, myId);
    //}
    
    // 팔로우 신청 알람 아이콘 클릭 시
    //waitersForFollow(myId);
});