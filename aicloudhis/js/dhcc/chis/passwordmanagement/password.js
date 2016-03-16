function updatePassword(){
	if($("#oldPassword").val() == ""){
		$CommonUI.alert("请输入旧密码");
		return;
	}
	if($("#password1").val() == ""){
		$CommonUI.alert("请输入新密码");
		return;
	}
	if($("#password1").val().length < 6){
		$CommonUI.alert("新密码最小长度为6");
		return;
	}
	if($("#password2").val() == ""){
		$CommonUI.alert("请输入确认密码");
		return;
	}
	if($("#password1").val() != $("#password2").val()){
		$CommonUI.alert("新密码与确认密码不一致");
		return;
	}
	$.ajax({
		 type: "post",
			url: $WEB_ROOT_PATH+"/frame/updatePassword.ajax",
			data:{
				"oldPassword":$("#oldPassword").val(),
				"newPassword":$("#password1").val()
				},

	        dataType: "json",
	        success: function(data){
	        	if(data.errorMessage == "pwdError"){
	        		$CommonUI.alert("旧密码不正确");
	        	}
	        	else if (data.errorMessage=="success"){
	        		$CommonUI.alert("密码修改成功!");
	        		closePasswordDlg();
	        	} else {
	        		 $CommonUI.alert("密码修改失败，请稍后再试！", 'error');
	        	}
	        }
	});
}

function showPasswordPop(){
	$('#passwordDlg').dialog('open').dialog('setTitle', '修改密码');
	$("#passwordDlg").dialog('open');
}
/**
 * 关闭pop界面
 */
function closePasswordDlg(){
	$("#passwordDlg").dialog('close');
}
