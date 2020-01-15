$(function(){
		
    $("#loginIdInput").focus(function(){
        $("#loginIdInput").css("border", "1px solid #9E9E9E");
    });
    $("#loginIdInput").focusout(function(){
        $("#loginIdInput").css("border", "1px solid #E0E0E0");
    });
    
    $("#loginPwInput").focus(function(){
        $("#loginPwInput").css("border", "1px solid #9E9E9E");
    });
    $("#loginPwInput").focusout(function(){
        $("#loginPwInput").css("border", "1px solid #E0E0E0");
    });
    
    /*로그인 border*/
    $("#loginTb").focusin(function(){
         $(this).css("border", "3px solid #795548");
    });
    $("#loginTb").focusout(function(){
        $(this).css("border", "1px solid #E0E0E0");
    });
});