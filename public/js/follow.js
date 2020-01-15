// 팔로우하기
function followDo(id, me) {
	var ok = confirm(id +"님을 팔로잉 할까요?");
		
	if(ok) {
		$.ajax({
			url: "/user/insert/follower",
			type:"post",
			data: {wf_id: id, wf_follower: me},
			success: function(result){
				if(result == "OK") {
					alert(id + "님을 팔로우 하였습니다!!!");
					$("#followBnt").attr("id", "").attr("id", "followingBnt").text("팔로잉");
					$("#followingBnt").text("팔로잉");
					followerCnt(id); // 팔로워수 업뎃
				}
			}
		});
	}
}

function unfollowDo(id, me) {
	var ok = confirm(id +"님을 언팔 할까요?");
	
	if(ok) {
		$.ajax({
			url: "/user/delete/follower",
			data: {wf_id: id, wf_follower: me},
			success: function(result){
				if(result == "OK") {
					alert(id + "님을 언팔하였습니다!!!");
					$("#followBnt").text("팔로우");
					$("#followingBnt").attr("id", "").attr("id", "followBnt").text("팔로우");
					followerCnt(id);
				}
			}
		});
	}
}

// 팔로워수 세기
function followerCnt(yId){
	$.ajax({
		url: "/user/follower/cnt",
		data: {wf_id: yId},
		success: function(xml){
			var cnt = $(xml).find("follow").length;
			$('#followerCntSpan').text(cnt);
		}
	});
}
// 팔로잉수 세기
function followCnt(yId){
	$.ajax({
		url: "/user/following/cnt",
		data: {wf_follower: yId},
		success: function(xml){
			var cnt = $(xml).find("follow").length;
			$('#followCntSpan').text(cnt);
		}
	});
}

function followBtnOper(yourId, myId, yesOrNo, waverOpen) {
		
    if(yesOrNo == "팔로우") {
        // 비공개면 승인받아야함
        if(waverOpen == -1) {
            followWait(yourId, myId);
        } else {
            followDo(yourId, myId);
        }
    } else if(yesOrNo == "승인중") {
        unFollowWaitDo(yourId, myId);
    } else {
        unfollowDo(yourId, myId);
    }
    
    // 팔로우, 팔로잉 버튼 누를 시 공개여부 즉각 반응
    //if(waverOpen == 'close') {
        //followOrNot2(yourId, myId);
    //}
}

// 팔로우 여부 확인
function followOrNot(id, me){
	$.ajax({
		url: "/user/follow/ornot",
		data: {wf_id: id, wf_follower: me},
		success: function(xml){
			var cnt = $(xml).find("follow").length;
			if(cnt > 0) {
				$("#followBnt").attr("id", "").attr("id", "followingBnt").text("팔로잉");
			}
		}
	});
}

// 팔로워 목록 보기
function searchFollowerEvent(yId, meId) {
	$("#followerTd").click(function() {
		$.ajax({
			url : "/user/follower/cnt",
			data : {
				wf_id : yId
			},
			success : function(xml) {
				var ok = $(xml).find("follow").length;
				
				$('#searchFollowerDiv').remove();
				$('#followDiv').remove();
				$('#closeDiv').remove();
				var displayDiv = $('<div></div>');
				var followDiv = $('<div></div>');
				var closeDiv = $('<div></div>').attr("id","closeDiv");
	
				if (ok >= 1) {
					displayDiv.attr("id","searchFollowerDiv");
					followDiv.attr("id","followDiv");
					
					var idSpan;
					var nameSpan;
					
					$(xml).find("follow").each(function(i, e){

						var followerId = $(e).find('wm_id').text();
						var followerImg = "";
						var followerName = "";
						
						followerImg = $(e).find('wm_img').text();
						followerName = $(e).find('wm_name').text();									
									
						var aTag = $('<a></a>').attr('class', 'dvsATag');
						if(followerId == meId) {
							aTag.attr('href','/');
						} else {
							aTag.attr('href','/user/wave?wave_id='+followerId);
						}
								
						var followTb = $('<table></table>').attr("class", "followTb");
								
						followTb.css("border-bottom", "1px #E0E0E0 solid");
					
						var tr = $('<tr></tr>');
						var td1 = $('<td></td>').css('width', '45px');
						var td2 = $('<td></td>');				
									
						idImg = $('<img></img>').attr('class', 'searchIdImg').attr('src', followerImg);
						td1.append(idImg);
									
						idSpan = $('<span></span>').attr("class", "searchIdSpan").text(followerId);
						nameSpan = $('<span></span>').attr("class", "searchIdNameSpan").text(followerName);
						td2.append(idSpan, '<br>', nameSpan);
									
						tr.append(td1, td2);
						followTb.append(tr);
						aTag.append(followTb)
									
						followDiv.append(aTag);
						displayDiv.append(followDiv)
					});
					
				} else {
					displayDiv.attr("id","searchFollowerDiv");
					
					var noIdDiv = $("<div></div>").attr('class','noFollowDiv').text("아무도 없어용..");
					
					displayDiv.append(noIdDiv);
				}
				closeDiv.text('x');
				displayDiv.append(closeDiv);
				
				$('#loBd').append(displayDiv);
				
				// 닫기 버튼
				$('#closeDiv').click(function(){
					$('#searchFollowerDiv').hide();
				});
			}
		});
	});
}

//팔로잉 수 보기
function searchFollowEvent(yId, meId) {
	$("#followTd").click(function() {
		$.ajax({
			url : "/user/following/cnt",
			data : {
				wf_follower : yId
			},
			success : function(xml) {
				var ok = $(xml).find("follow").length;
				
				$('#searchFollowerDiv').remove();
				$('#followDiv').remove();
				$('#closeDiv').remove();
				var displayDiv = $('<div></div>');
				var followDiv = $('<div></div>');
				var closeDiv = $('<div></div>').attr("id","closeDiv");
	
				if (ok >= 1) {
					displayDiv.attr("id","searchFollowerDiv");
					followDiv.attr("id","followDiv");
					
					var idSpan;
					var nameSpan;
					var imgSpan;
					
					$(xml).find("follow").each(function(i, e){
						var followId = $(e).find('wm_id').text();
						var followImg = "";
						var followName = "";

						followImg = $(e).find('wm_img').text();
						followName = $(e).find('wm_name').text();									
									
						var aTag = $('<a></a>').attr('class', 'dvsATag');
						if(followId == meId) {
							aTag.attr('href','/');
						} else {
							aTag.attr('href','/user/wave?wave_id='+followId);
						}
						var followTb = $('<table></table>').attr("class", "followTb");
								
						followTb.css("border-bottom", "1px #E0E0E0 solid");
					
						var tr = $('<tr></tr>');
						var td1 = $('<td></td>').css('width', '45px');
						var td2 = $('<td></td>');				
									
						idImg = $('<img></img>').attr('class', 'searchIdImg').attr('src', followImg);
						td1.append(idImg);
									
						idSpan = $('<span></span>').attr("class", "searchIdSpan").text(followId);
						nameSpan = $('<span></span>').attr("class", "searchIdNameSpan").text(followName);
						td2.append(idSpan, '<br>', nameSpan);
									
						tr.append(td1, td2);
						followTb.append(tr);
						aTag.append(followTb)
									
						followDiv.append(aTag);	
						displayDiv.append(followDiv)
					});
					
				} else {
					displayDiv.attr("id","searchFollowerDiv");
					
					var noIdDiv = $("<div></div>").attr('class','noFollowDiv').text("아무도 없어용..");
					
					displayDiv.append(noIdDiv);
				}
				closeDiv.text('x');
				displayDiv.append(closeDiv);
				
				$('#loBd').append(displayDiv);
				
				// 닫기 버튼
				$('#closeDiv').click(function(){
					$('#searchFollowerDiv').hide();
				});
			}
		});
		
	});
}
/********************************************************* */
//���������� ����
function followWaitOrNot(id, me){
	$.ajax({
		url: "followWait.ornot",
		data: {wfw_id: id, wfw_follower: me},
		success: function(xml){
			var cnt = $(xml).find("waiter").length;
			if(cnt > 0) {
				$("#followBnt").attr("id", "").attr("id", "followWaitBnt").text("������");
			}
			
			//return cnt;
		}
	});
}

function waiterAccept(me, you) {
	//alert(me);
	// �ȷο��ϱ�
	$.ajax({
		url: "insert.follower",
		type:"post",
		data: {wf_id: me, wf_follower: you},
		success: function(result){
			if(result == "OK") {
				followerCnt(me); // �ȷο� �� ����
			}
		}
	});
	// waiter ��� �����
	$.ajax({
		url: "delete.waiter",
		type:"post",
		data: {wfw_id: me, wfw_follower: you},
		success: function(result){
			if(result == "OK") {
				$("#waiterTb_"+you).remove(); // ���� ����� waiter ����
			}
		}
	});
}

function waiterAcceptCancel(me, you) {
	//alert(me);
	// waiter ��� �����
	$.ajax({
		url: "delete.waiter",
		type:"post",
		data: {wfw_id: me, wfw_follower: you},
		success: function(result){
			if(result == "OK") {
				$("#waiterTb_"+you).remove(); // ���� ����� waiter ����
			}
		}
	});
}

function waitersForFollow(me) {
	// follower ��ȸ
	$("#alarmWaiter").click(function() {
		$.ajax({
			url: "count.waitforme",
			data: {wfw_id: me},
			success: function(xml){
				var cnt = $(xml).find("waiter").length;
				
				$('#searchWaiterDiv').remove();
				$('#waiterDiv').remove();
				$('#closeDiv').remove();
				
				var displayDiv = $('<div></div>');
				var waiterDiv = $('<div></div>');
				var closeDiv = $('<div></div>').attr("id","closeDiv");
	
				if (cnt >= 1) {
					displayDiv.attr("id","searchWaiterDiv");
					waiterDiv.attr("id","waiterDiv");
					
					var idSpan;
					var nameSpan;
					var imgSpan;
					var okBnt;
					var delBnt;
					
					$(xml).find("waiter").each(function(i, e){
						var followerId = $(e).find('wfw_follower').text();
						var followerImg = "";
						var followerName = "";
						
						// id�� ȸ�������� �������� ���۽�
						$.ajax({
							url : "member.id.check",
							data : {
								wm_id : followerId
							},
							success : function(xml2) {
								var fm = $(xml2).find('member');
								followerImg = fm.find('wm_img').text();
								followerName = fm.find('wm_name').text();									
									
								//var aTag = $('<a></a>').attr('class', 'dvsATag');
								
								//aTag.attr('href','follow.wave?wm_id='+followerId);
								
								var waiterTb = $('<table></table>').attr("class", "waiterTb").attr("id", "waiterTb_"+followerId);
								
								waiterTb.css("border-bottom", "1px #E0E0E0 solid");
					
								var tr = $('<tr></tr>');
								var td1 = $('<td></td>').css('width', '45px');
								var td2 = $('<td></td>');
								var td3 = $('<td></td>').attr('align', 'right');
									
								idImg = $('<img></img>').attr('class', 'searchIdImg').attr('src', 'resources/img/' + followerImg);
								td1.append(idImg);
									
								idSpan = $('<span></span>').attr("class", "searchIdSpan").text(followerId);
								nameSpan = $('<span></span>').attr("class", "searchIdNameSpan").text(followerName);
								td2.append(idSpan, '<br>', nameSpan);
								
								okBnt = $('<button></button>').attr("class", "followOkBnt").attr("onclick", "waiterAccept(\'" + me + "\',\'" + followerId + "\');").text("Ȯ��");
								delBnt = $('<button></button>').attr("class", "followDelBnt").attr("onclick", "waiterAcceptCancel(\'" + me + "\',\'" + followerId + "\');").text("���");
								td3.append(okBnt, delBnt);
								
								tr.append(td1, td2, td3);
								waiterTb.append(tr);
								//aTag.append(waiterTb)
									
								waiterDiv.append(waiterTb);
							}
						});
							
						displayDiv.append(waiterDiv)
					});
					
				} else {
					displayDiv.attr("id","searchWaiterDiv");
					
					var noIdDiv = $("<div></div>").attr('class','noWaiterDiv').text("�ƹ��� �����ϴ�.");
					
					displayDiv.append(noIdDiv);
				}
				closeDiv.text('x');
				displayDiv.append(closeDiv);
				
				$('#loBd').append(displayDiv);
				
				// �ݱ� ��ư ���� ��
				$('#closeDiv').click(function(){
					//$('#closeDiv').remove();
					//$('#followDiv').remove();
					$('#searchWaiterDiv').hide();
					countWaitForMe(me); // �ȷο� ��û�� ��� ������ ��Ÿ���� ��Ƽ ���� ����
				});
			}
		});
		
	});
}

function countWaitForMe(me) {
	$.ajax({
		url: "count.waitforme",
		data: {wfw_id: me},
		success: function(xml){
			var cnt = $(xml).find("waiter").length;
			
			if(cnt > 0) {
				$("#alarmWaiter").css("visibility", "visible");
				
				$("#alarmCnt").text(cnt);
				
				var mok = 0;
				for(var i =10;i<=cnt;i*=10) {
					mok++;
				}
				
				$('#alarmImg').css('width', 80+(5*mok)+"px");
			} else {
				$("#alarmWaiter").css("visibility", "hidden");
			} 
		}
	});
}

function followWait(id, me) {
	var ok = confirm(id +"���� �ȷο� �մϱ�?");
	
	if(ok) {
		$.ajax({
			url: "insert.waiter",
			type:"post",
			data: {wfw_id: id, wfw_follower: me},
			success: function(result){
				if(result == "OK") {
					alert(id + "���� ������ ������ ��ٸ�����...");
					$("#followBnt").attr("id", "").attr("id", "followWaitBnt").text("������");
					$("#followingBnt").attr("id", "").attr("id", "followWaitBnt").text("������");
				}
			}
		});
	}
}

function unFollowWaitDo(id, me) {
	var ok = confirm("���� ��� �մϱ�?");
	
	if(ok) {
		$.ajax({
			url: "delete.waiter",
			type:"post",
			data: {wfw_id: id, wfw_follower: me},
			success: function(result){
				if(result == "OK") {
					alert("���� ��� �߽��ϴ�!!");
					$("#followWaitBnt").attr("id", "").attr("id", "followBnt").text("�ȷο�");
					$("#followBnt").text("�ȷο�");
				}
			}
		});
	}
}
