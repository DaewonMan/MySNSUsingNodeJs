/* 게시물 보고 난 뒤, x 닫기를 눌러 메인화면으로 갈때, 사용자와 파도탄 인원 비교 */
function goToMemberDisplay(id, me){
	if(id == me) {
		alert("same?");
		location.href = "/";				
	} else {
		//location.href = "follow.wave?wm_id="+id;
		location.href = "/user/wave?wave_id="+id;	
	}
}

//============================================================================================================

function postDeleteDo(no) {
	var ok = confirm("�Խù��� �����մϱ�?");
	
	if(ok) {
		// �Խù� ����
		$.ajax({
			url: "post.delete",
			type:"post",
			data: {wp_no: no}, 
			success: function(result){
				if(result == "OK") {
					//$(".postATag"+ no).remove();
					location.href = "home.go";
				} else {
					alert("�Խù� ���� ����!!");
				}
			}
		});
	}
}

function repleDeleteDo(no, pNo) {
	var ok = confirm("����� �����մϱ�?");
	
	if(ok) {
		// ���� ����
		$.ajax({
			url: "reple.delete",
			type:"post",
			data: {wr_no: no}, 
			success: function(result){
				if(result == "OK") {
					//alert("����� ���� �Ǿ����ϴ�!");
					checkRepleCnt(pNo);
					$(".eachReples"+ no).remove();
				} else {
					alert("��� ���� ����!!");
				}
			}
		});
	}
	
}


function postCheck() { 
	var titleField = document.postForm.wp_title;
	var imgField = document.postForm.wp_img;
	
	if(isEmpty(titleField)) {
		alert("���� �ٽ�");
		titleField.value = "";
		titleField.focus();
		return false;
	} else if(isEmpty(imgField) || isNotType(imgField, "jpg")
				&& isNotType(imgField, "png")
				&& isNotType(imgField, "gif")
				&& isNotType(imgField, "jpeg")) {
		alert("�̹��� �ٽ�");
		imgField.value = "";
		imgField.focus();
		return false;
	} 
	
	return true;
}

// �ȷο� ���ο� ���� �Խù� ���
function followOrNot2(id, me){
	
	$.ajax({
		url: "follow.ornot",
		data: {wf_id: id, wf_follower: me},
		success: function(xml){
			var cnt = $(xml).find('follow').length;
			//alert(cnt);	
			if(cnt > 0) {
				$('#noPostDiv2').remove(); // �ش��±� ����
				$('#postTb').show(); // �Խù� ��� ǥ��
				$('#noPostDiv').show(); // �Խù� ���� ǥ��
			} else {
				$('#postTb').hide(); // �Խù� ��� �����
				$('#noPostDiv').hide(); // �Խù� ���� ǥ�� �����
				//nonOpenDiv.show();
				
				var nonOpenDiv = $('<div></div>').attr('id', 'noPostDiv2');
				var nonOpenImg = $('<img></img>').attr('src', 'resources/img/wonsta.jpg');
				var nonOpenSpan = $('<span></span>').text('�����!');
				nonOpenDiv.append(nonOpenImg, '<p>', nonOpenSpan);
				$('.mainCttTd').append(nonOpenDiv);
			}
		}		
	});	
}

$(function(){
	// 게시물 등록 시, 이미지 업로드할 때 
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
	
	$(".postUploadInputTd").each(function(e, c){
		var child = $(c).children();
		child.focus(function(){
			$(this).css("border", "1px solid #9E9E9E");
		});
		child.focusout(function(){
			$(this).css("border", "1px solid #E0E0E0");
		});
	});

	/*게시물 올리기 border*/
	$("#postUploadTb").focusin(function(){
		 $(this).css("border", "3px solid #795548");
	});
	$("#postUploadTb").focusout(function(){
		$(this).css("border", "1px solid #E0E0E0");
	});
	
});