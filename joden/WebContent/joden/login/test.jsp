<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%
	request.setCharacterEncoding("UTF-8");
	String cp = request.getContextPath();
%>

    
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
</head>
<body>
${GosInfo.userId }님 환영!
<br/>
${GosInfo.userName }님 환영합니다!

<table>


<tr height="30">
	<td colspan="2" align="center">
	<input type="button" value=" 로그아웃 " class="btn2" onclick="location='/joden/cabin/membership/login.gos';"/>
	</td>
</tr>

<tr height="30">
	<td colspan="2" align="center">
	<input type="button" value=" 개인정보수정 " class="btn2" onclick="location='/joden/cabin/membership/updated.gos';"/>
	</td>
</tr>

</table>

</body>
</html>