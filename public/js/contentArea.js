$(function(){
		
    // 댓글 수
    $(".postTd").mouseenter(function(){
        var cnt = 0;
        var ele = $(this).children(); // 하위 a 태그 받기
        var ele2 = ele.children(); // 하위 img div
        var ele3 = ele2.eq(1).children(); // 하위 span들
        var ele4 = ele3.eq(0); // .likeCntSpan
        var ele5 = ele3.eq(1); // .repleCntSpan
        var targetPno = ele3.eq(2); // 숨겨져있는 input tag
    
        var eleNo = targetPno.val();
        eleNo *= 1; // 숫자로 변환
        
        // 댓글 갯수
        ele5.empty();
        $.ajax({
            url: "/post/reple/count",
            data: {wr_pno: eleNo},
            success: function(xml){
                $(xml).find("reple").each(function(e){
                    cnt++;
                });
                ele5.text(cnt);  
            }
        });
        
        // 좋아요 갯수
        ele4.empty();
        $.ajax({
            url: "/post/like/count",
            data: {wlb_pno: eleNo},
            success: function(xml){
                cnt = $(xml).find("like").length;
                ele4.text(cnt);
            }
        });
    });
});