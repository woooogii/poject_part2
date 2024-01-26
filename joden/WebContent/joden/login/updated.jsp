<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    
<%
	request.setCharacterEncoding("UTF-8");
	String cp = request.getContextPath();
%>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>개인정보 수정</title>
    <link rel="stylesheet" type="text/css" href="<%=cp%>/joden/login/css/style.css"/>
	

    <script type="text/javascript">
        function sendIt() {
			var f = document.myForm;
            f.action = "<%=cp%>/cabin/membership/updated_ok.gos";
            f.submit();
        }

        function isValidKorean(input) {
            var koreanRegex = /^[가-힣]+$/;
            return koreanRegex.test(input);
        }

        function isValidEmail(input) {
            var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            return emailRegex.test(input);
        }

    </script>
</head>
<body>
<div id="bbs">

	<div id = "bbs_title">
		회원수정
	</div>

	<form action="" method="post" name="myForm">
	<div id="bbsCreated">
	
		<div class="bbsCreated_bottomLine">
			<dl>
				<dt>아&nbsp;이&nbsp;디</dt>
				<dd>
 					${GosInfo.userId}				
 				</dd>
			</dl>
		</div>
		
	
		<div class="bbsCreated_bottomLine">
			<dl>
				<dt>패&nbsp;스&nbsp;워&nbsp;드</dt>
				<dd>
				<input type="password" name="userPwd" size="35" maxlength="20" class="boxTF" value="${dto.userPwd }"/>
				</dd>
			</dl>
		</div>
	
		<div class="bbsCreated_bottomLine">
			<dl>
				<dt>이&nbsp;&nbsp;&nbsp;&nbsp;름</dt>
				<dd>
				<input type="text" name="userName" size="35" maxlength="50" class="boxTF" value="${dto.userName }"/>
				</dd>
			</dl>
		</div>
	
		<div class="bbsCreated_bottomLine">
			<dl>
				<dt>전&nbsp;&nbsp;&nbsp;&nbsp;화</dt>
				<dd>
				<input type="text" name="userTel" size="35" maxlength="50" class="boxTF" value="${dto.userTel }"/>
				</dd>
			</dl>
		
		</div>
		<div class="bbsCreated_bottomLine">
				<dl>
					<dt>이&nbsp;메&nbsp;일</dt>
					<dd>
					<input type="text" name="userEmail" size="35" maxlength="50" class="boxTF" value="${dto.userEmail}"/>
					</dd>
				</dl>
			</div>
		
		
	
		<div class="bbsCreated_bottomLine">
			<dl>
				<dt>성&nbsp;&nbsp;&nbsp;&nbsp;별</dt>
				<dd>
				<input type="radio" name="userGender" size="35" maxlength="50" class="boxTF"/>
				남자
				<input type="radio" name="userGender" size="35" maxlength="50" class="boxTF"/>
				여자
				</dd>
			</dl>
		</div>
			
		<div class="bbsCreated_bottomLine">
			<dl>
				<dt>주&nbsp;&nbsp;&nbsp;&nbsp;소</dt>
				<dd>
				<input type="text" name="userAddr" size="35" maxlength="50" class="boxTF" value="${dto.userAddr}"/>
				</dd>
			</dl>
		</div>
	
		<div class="bbsCreated_bottomLine">
			<dl>
				<dt>가입날짜</dt>
				<dd>
				${dto.userReg}				
				</dd>
			</dl>
		</div>
	
	</div>
	
	<div id="bbsCreated_footer">
		<input type="button" value="수정하기" class="btn2" onclick="sendIt();"/>
		
		<input type="button" value="수정취소" class="btn2" onclick="location='<%=cp%>/cabin/membership/login/login_ok.gos';"/>
		
	</div>
	
	
	
	
	
	
	</form>

<jsp:include page="footer.jsp"></jsp:include>


</div>




</body>
</html>