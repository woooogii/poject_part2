<%@ page contentType="text/html; charset=UTF-8"%>

<%
	request.setCharacterEncoding("UTF-8");
	String cp = request.getContextPath();
%>


<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>비밀번호 찾기</title>

<link rel="stylesheet" href="<%=cp%>/joden/login/css/style.css" type="text/css"/>

<script type="text/javascript">

	function searchPw(){
		
		var f = document.myForm;
		
		if(!f.userId.value){
			alert("아이디를 입력하세요!");
			f.userId.focus();
			return;
		}

		if(!f.userEmail.value){
			alert("이메일을 입력하세요!");
			f.userEmail.focus();
			return;
		}
	
		alert("가입한 메일주소로 메일이 전송되었습니다.")
		
		f.action = "/joden/cabin/membership/searchPw.gos"
		f.submit();
	
		
	}

</script>

</head>
<body>

<br/>&nbsp;<br/>

<form action="" method="post" name="myForm">

<div style="margin: auto;">

    <div style="height: 2px; background-color: #cccccc;"></div>

    <div style="height: 30px; display: flex; align-items: center; justify-content: center;">
        <b>비밀번호 찾기</b>
    </div>

    <div style="height: 2px; background-color: #cccccc;"></div>

    <div style="height: 25px; display: flex; align-items: center;">
        <div style="width: 80px; background-color: #e6e4e6; text-align: center;">아이디</div>
        <div style="width: 120px; padding-left: 5px;">
            <input type="text" name="userId" maxlength="50" size="15"/>
        </div>
    </div>

    <div style="height: 2px; background-color: #cccccc;"></div>

    <div style="height: 25px; display: flex; align-items: center;">
        <div style="width: 80px; background-color: #e6e4e6; text-align: center;">이메일</div>
        <div style="width: 120px; padding-left: 5px;">
            <input type="text" name="userEmail" maxlength="50" size="15"/>
        </div>
    </div>

    <div style="height: 2px; background-color: #cccccc;"></div>

    <div style="height: 30px; display: flex; align-items: center; justify-content: center;">
        <input type="button" value="확인" class="btn2" onclick="searchPw();"/>
        <input type="button" value="취소" class="btn2" onclick="javascript:location.href='/joden/cabin/login.gos';"/>
    </div>

</div>

</form>




<jsp:include page="footer.jsp"></jsp:include>







</body>
</html>