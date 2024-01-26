<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Calendar"%>
<%@page import="java.util.Date"%>
<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%
	request.setCharacterEncoding("UTF-8");
String cp = request.getContextPath();
%>

 <%
              // 현재 날짜를 가져오기
              Calendar calendar = Calendar.getInstance();
 			  SimpleDateFormat dateFormat = new SimpleDateFormat("MM/dd (E)");
              String currentDate = dateFormat.format(calendar.getTime());
              calendar.add(Calendar.DAY_OF_MONTH, 2);
              String futureDate = dateFormat.format(calendar.getTime());
 %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
</head>
<body>

	<div style="margin: auto;">

		<form action="<%=cp%>/cabin/pay/pay_ok.gos" method="post"
			name="myForm">

			<div>
			<table width="800" border="0" cellpadding="1" cellspacing="0"
					style="margin: auto;">
					<tr>
						<!-- 로고 -->
						<td>
							<div>
								<img src="<%=cp%>/joden/pay/image/jodensLogo.png">
							</div> <!-- 로고 -->
						</td>
					</tr>
				</table>

				<table width="100%">
					<tr>
						<td colspan="2" height="1" bgcolor="#dbdbdb" align="center"
							style="width: 100%;"></td>
					</tr>
				</table>

				<table width="800" border="0" cellpadding="1" cellspacing="0"
					style="margin: auto;">
					<tr>
						<td>
							<div>구매 완료<br/>주문이 완료되었습니다.<br/>감사합니다!</div>
						</td>
					</tr>

					<tr>
						<td colspan="2" height="3" bgcolor="#686868" align="center"></td>
					</tr>

					



					<tr>
						<td colspan="2" height="3" bgcolor="#dbdbdb" align="center"></td>
					</tr>

					

					<tr>
						<td><%= futureDate %> 새벽 도착 보장</td>
					</tr>

					<tr>
						<td colspan="2" height="1" bgcolor="#dbdbdb" align="center"></td>
					</tr>

				</table>
				<br/> 
				<br/>



				<table width="800" border="0" cellpadding="1" cellspacing="0"
					style="margin: auto;">

					



					<tr>
						<td colspan="2" height="3" bgcolor="#dbdbdb" align="center"></td>
					</tr>

					<tr>
						<td width="140" height="30" bgcolor="#eeeeee"
							style="padding-left: 20px">이름</td>
						<td width="460" style="padding-left: 10px;">${pdto.userName }
							<input type="hidden" name="buyerName" value="${dto.userName }" />
						</td>
					</tr>


					<tr>
						<td colspan="2" height="1" bgcolor="#dbdbdb" align="center"></td>
					</tr>


					<tr>
						<td width="140" height="30" bgcolor="#eeeeee"
							style="padding-left: 20px">받는 주소</td>
						<td width="460" style="padding-left: 10px;">
						${pdto.userAddr }
						<input type="hidden" name="buyerAddr" value="${pdto.userAddr }"
							readonly="readonly" size="35" /> </td>
					</tr>




					<tr>
						<td colspan="2" height="1" bgcolor="#dbdbdb" align="center"></td>
					</tr>


					<tr>
						<td width="140" height="30" bgcolor="#eeeeee"
							style="padding-left: 20px">연락처</td>
						<td width="460" style="padding-left: 10px;">
						${pdto.userTel }
						<input type="hidden" name="buyerTel" value="${dto.userTel }" /></td>
					</tr>

					<tr>
						<td colspan="2" height="1" bgcolor="#dbdbdb" align="center"></td>
					</tr>
				
				</table>
				<br/>	
				<br/>

			

								<table width="800" border="0" cellpadding="1" cellspacing="0"
					style="margin: auto;">

					



					<tr>
						<td colspan="2" height="3" bgcolor="#dbdbdb" align="center"></td>
					</tr>

					<tr>
						<td width="140" height="30" bgcolor="#eeeeee"
							style="padding-left: 20px">총 상품 가격</td>
						<td width="460" style="padding-left: 10px;">10000원
							<input type="hidden" name="buyerName" value="${dto.userName }" />
						</td>
					</tr>


					<tr>
						<td colspan="2" height="1" bgcolor="#dbdbdb" align="center"></td>
					</tr>


					<tr>
						<td width="140" height="30" bgcolor="#eeeeee"
							style="padding-left: 20px">사용 마일리지</td>
						<td width="460" style="padding-left: 10px;">
						1000원
						<input type="hidden" name="buyerAddr" value="${pdto.userAddr }"
							readonly="readonly" size="35" /> </td>
					</tr>




					<tr>
						<td colspan="2" height="1" bgcolor="#dbdbdb" align="center"></td>
					</tr>


					<tr>
						<td width="140" height="30" bgcolor="#eeeeee"
							style="padding-left: 20px">총 결제 가격</td>
						<td width="460" style="padding-left: 10px;">
						9000원
						<input type="hidden" name="buyerTel" value="${dto.userTel }" /></td>
					</tr>

					<tr>
						<td colspan="2" height="1" bgcolor="#dbdbdb" align="center"></td>
					</tr>
				
				
				
				<tr>
					<td>
						<button onclick="">쇼핑 계속하기</button>
					</td>
				</tr>
				</table>




			</div>
		</form>





	</div>

	


	<jsp:include page="footer.jsp"></jsp:include>




</body>
</html>