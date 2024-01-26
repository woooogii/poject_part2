<%@ page contentType="text/html; charset=UTF-8"%>

<%
	request.setCharacterEncoding("UTF-8");
	String cp = request.getContextPath();
%>

    
    
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>로그인</title>

<link rel="stylesheet" type="text/css" href="<%=cp%>/joden/login/css/style.css"/>

<script type="text/javascript">

function login(){
	
	var f = document.myForm;
	
	if(!f.userId.value){
		alert("아이디를 입력하세요.");
		f.userId.focus();
		return;
	}
	
	if(!f.userPwd.value){
		alert("패스워드를 입력하세요.");
		f.userPwd.focus();
		return;
	}
	
	f.action = "/joden/cabin/membership/login_ok.gos";
	f.submit();
	
}

</script>


</head>
<body>
<br/><br/>

<form action="" method="post" name="myForm">
    <div>
        <div></div>
    </div>

<div>
    <div><b>로그인</b></div>
</div>

<div>
    <div id="id">아이디</div>
    <div>
        <input type="text" name="userId" maxlength="50" size="15"/>
    </div>
</div>

<div>
	<div></div>
</div>

<div>
    <div>패스워드</div>
    <div>
        <input type="password" name="userPwd" maxlength="50" size="15"/>
    </div>
</div>

<div>
	<div></div>
</div>

<div>
    <div>
        <input type="button" value=" 로그인 " class="btn2" onclick="login();"/>
        <input type="button" value=" 회원가입 " class="btn2" onclick="location='/joden/cabin/membership/created.gos';"/>
    </div>
</div>



<div>
    <div></div>

    <div >
        <a href="/joden/cabin/membership/login/searchId.gos">
            아이디 찾기
        </a>
    </div>

    <div></div>
</div>

<div>
    <div></div>

    <div>
        <a href="/joden/cabin/membership/login/searchPw.gos">
            비밀번호 찾기
        </a>
    </div>

    <div></div>
</div>


</form>
<jsp:include page="footer.jsp"></jsp:include>
</body>
</html>