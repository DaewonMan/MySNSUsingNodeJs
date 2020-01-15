$(function(){
    connectAddressSearchEvent(); /* address.js에서 가져옴 */
    connectIdCheckEvent(); /* member.js에서 가져옴 */
    
    
    // 회원가입 시, 이미지 업로드할 때 
    if (document.getElementById('imgs')) {
        document.getElementById('imgs').addEventListener('change', function (e) {
          var formData = new FormData();
          console.log(this, this.files);
          formData.append('img', this.files[0]);
          //console.log(this.files[0]);
          //console.log(formData);
          var xhr = new XMLHttpRequest();
          xhr.onload = function () {
            if (xhr.status === 200) {
              var url = JSON.parse(xhr.responseText).url;
              document.getElementById('imgUrl').value = url;
              document.getElementById('imgPreview').src = url;
              document.getElementById('imgPreview').style.display = 'inline';
            } else {
              console.error(xhr.responseText);
            }
          };
          xhr.open('POST', '/post/img');
          xhr.send(formData);
        });
    }

    /* 팔로잉 관련 로직 */
    document.querySelectorAll('.twit-follow').forEach(function (tag) {
        tag.addEventListener('click', function () {
            var isLoggedIn = document.querySelector('#my-id');
            if (isLoggedIn) {
                var userId = tag.parentNode.querySelector('.twit-user-id').value;
                var myId = isLoggedIn.value;
                if (userId !== myId) {
                    if (confirm('팔로잉하시겠습니까?')) {
                        var xhr = new XMLHttpRequest();
                        xhr.onload = function () {
                            if (xhr.status === 200) {
                                location.reload();
                            } else {
                                console.error(xhr.responseText);
                            }
                        };
                        xhr.open('POST', '/user/' + userId + '/follow');
                        xhr.send();
                    }
                }
            }
        });
    });
    
    /* 테두리 볼드 처리 */
    $(".joinCttTd").each(function(e, c){
        var child = $(c).children();
        child.focus(function(){
            $(this).css("border", "1px solid #9E9E9E");
        });
        child.focusout(function(){
            $(this).css("border", "1px solid #E0E0E0");
        });
    });
    $(".joinCttTd2").each(function(e, c){
        var child = $(c).children();
        child.focus(function(){
            $(this).css("border", "1px solid #9E9E9E");
        });
        child.focusout(function(){
            $(this).css("border", "1px solid #E0E0E0");
        });
    });
    
    /*가입하기 border*/
    $("#joinTb").focusin(function(){
         $(this).css("border", "3px solid #795548");
    });
    $("#joinTb").focusout(function(){
        $(this).css("border", "1px solid #E0E0E0");
    });
});