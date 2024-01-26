<%@ page contentType="text/html; charset=UTF-8"%>

<%
	request.setCharacterEncoding("UTF-8");
	String cp = request.getContextPath();
%>


<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>아이디 찾기</title>
<link rel="stylesheet" href="<%=cp%>/joden/login/css/style.css" type="text/css"/>

<script type="text/javascript">

	function searchId(){
		
		var f = document.myForm;
		
		if(!f.userEmail.value){
			alert("이메일을 입력하세요!");
			f.userEmail.focus();
			return;
		}
		
		if(!f.userTel.value){
			alert("전화번호를 입력하세요");
			f.userTel.focus();
			return;
		}
		
		alert("가입한 메일주소로 메일이 전송되었습니다.")
		
		f.action = "/joden/cabin/membership/login.gos";
		f.submit();
		
	}
</script>

</head>
<body>

<br/>&nbsp;<br/>

<form action="" method="post" name="myForm">

<div>

    <div></div>

    <div>
        <b>아이디 찾기</b>
    </div>

    <div></div>

    <div>
        <div>이메일</div>
        <div>
            <input type="text" name="userEmail" maxlength="50" size="15"/>
        </div>
    </div>

    <div></div>

    <div>
        <div>전화번호</div>
        <div>
            <input type="text" name="userTel" maxlength="50" size="15"/>
        </div>
    </div>

    <div></div>

    <div>
        <input type="button" value="확인" class="btn2" onclick="searchId();"/>
        <input type="button" value="취소" class="btn2" onclick="javascript:location.href='/joden/cabin/membership/login.gos';"/>
    </div>

</div>

</form>

<jsp:include page="footer.jsp"></jsp:include>



</body>
</html>