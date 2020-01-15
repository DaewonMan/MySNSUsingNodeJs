$(function(){
    var myId = $("#mainUserID").val();
    var yourId = $("#mainWaveID").val();
    var waverOpen = $("#mainWaverOpen").val();

    if(myId != yourId) {
        // 팔로우 여부
        followOrNot(yourId, myId);	
    }
    /*
    // 팔로우 신청을 여부
    if(followWaitOrNot(yourId, myId) == 0) {
        // 팔로우 여부
        followOrNot(yourId, myId);				
    }
    */
    // 공개여부
    if(waverOpen == 1){
        $("#postOpen").text("전체공개");
    } else {
        $("#postOpen").text("비공개");
    }
                            
    // 비공개하기
    $('#postOpen').click(function(){
        var ok;
        if(waverOpen == 1) {
            ok = confirm("게시물 비공개 할까요?");
        } else {
            ok = confirm("게시물 공개 할까요?");
        }

        if(ok) {
            waverOpen *= -1;

            $.ajax({
                url: "/user/open/update",
                data: {wm_open: waverOpen, wm_id: myId},
                success: function(result){
                    if(result == "OK") {
                        if(waverOpen == 1) 
                            $("#postOpen").text("전체공개");
                        else
                            $("#postOpen").text("비공개");
                    }
                }
            });
        }
    });

    // 팔로워 수
    followerCnt(yourId);
    
    // 팔로우 수
    followCnt(yourId);
    
    // 팔로우 하기
    $('#followBnt').click(function(){
        var yesOrNo = $(this).text();
        followBtnOper(yourId, myId, yesOrNo, waverOpen);
    });
    
    // 언팔로우 하기
    $('#followingBnt').click(function(){
        var yesOrNo = $(this).text();
        followBtnOper(yourId, myId, yesOrNo, waverOpen);
    });

    // 팔로워 수 클릭 시
    searchFollowerEvent(yourId, myId);
    
    // 팔로우 수 클릭 시
    searchFollowEvent(yourId, myId);
    /************************************************************ */
    // 승인중 취소하기
    $('#followWaitBnt').click(function(){
        var yesOrNo = $(this).text();
        followBtnOper(yourId, myId, yesOrNo, waverOpen);
    });
});