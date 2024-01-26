<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%
	request.setCharacterEncoding("UTF-8");
String cp = request.getContextPath();
%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>조든의 오두막 결제창</title>
<link rel="icon" href="<%=cp %>/joden/pay/image/jodenfavicon.jpg">

<script type="text/javascript"
	src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
<!-- iamport.payment.js -->
<script type="text/javascript"
	src="https://cdn.iamport.kr/js/iamport.payment-1.2.0.js"></script>
<script>
	var IMP = window.IMP;
	IMP.init("imp67011510");

	var today = new Date();
	var hours = today.getHours(); // 시
	var minutes = today.getMinutes(); // 분
	var seconds = today.getSeconds(); // 초
	var milliseconds = today.getMilliseconds();
	var makeMerchantUid = hours + minutes + seconds + milliseconds;

	function requestPay() {
		IMP.request_pay({
			pg : 'kakaopay',
			merchant_uid : "IMP" + makeMerchantUid,
			name : '당근 10kg',
			amount : 1004,
			buyer_email : 'Iamport@chai.finance',
			buyer_name : '아임포트 기술지원팀',
			buyer_tel : '010-1234-5678',
			buyer_addr : '서울특별시 강남구 삼성동',
			buyer_postcode : '123-456'
		}, function(rsp) { // callback
			if (rsp.success) {
				console.log(rsp);
			} else {
				console.log(rsp);
			}
		});
	}
</script>

<script language="javascript">
	// opener관련 오류가 발생하는 경우 아래 주석을 해지하고, 사용자의 도메인정보를 입력합니다. ("팝업API 호출 소스"도 동일하게 적용시켜야 합니다.)
	//document.domain = "abc.go.kr";

	function goPopup() {
		// 주소검색을 수행할 팝업 페이지를 호출합니다.
		// 호출된 페이지(jusopopup.jsp)에서 실제 주소검색URL(https://business.juso.go.kr/addrlink/addrLinkUrl.do)를 호출하게 됩니다.
		var pop = window.open("/joden/pay/jusoPopup.jsp", "pop",
				"width=570,height=420, scrollbars=yes, resizable=yes");

		// 모바일 웹인 경우, 호출된 페이지(jusopopup.jsp)에서 실제 주소검색URL(https://business.juso.go.kr/addrlink/addrMobileLinkUrl.do)를 호출하게 됩니다.
		//var pop = window.open("/popup/jusoPopup.jsp","pop","scrollbars=yes, resizable=yes"); 
	}

	function jusoCallBack(roadFullAddr) {
		// 팝업페이지에서 주소입력한 정보를 받아서, 현 페이지에 정보를 등록합니다.
		document.myForm.buyerAddr.value = roadFullAddr;

	}
</script>


<style type="text/css">
.layout {
	width: 1366px;
	height: 768px;
	display: grid;
	grid: "header" auto "main" 1fr "footer" auto/1fr;
	gap: 8px;
}

.header {
	grid-area: header;
}

.main {
	grid-area: main;
}

.footer {
	grid-area: footer;
}
</style>



</head>
<body>

	<div style="margin: auto;">











		<form action="<%=cp %>/cabin/pay/pay_ok.gos" method="post" name="myForm">




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
							<div>주문/결제</div>
						</td>
					</tr>

					<tr>
						<td colspan="2" height="3" bgcolor="#686868" align="center"></td>
					</tr>

					<tr>
						<td>
							<div>구매자 정보</div>
						</td>
					</tr>



					<tr>
						<td colspan="2" height="3" bgcolor="#dbdbdb" align="center"></td>
					</tr>

					<tr>
						<td width="140" height="30" bgcolor="#eeeeee"
							style="padding-left: 20px">이름</td>
						<td width="460" style="padding-left: 10px;">${dto.userName }
							<input type="hidden" name="userName" value="${dto.userName }" />
						</td>
					</tr>


					<tr>
						<td colspan="2" height="1" bgcolor="#dbdbdb" align="center"></td>
					</tr>


					<tr>
						<td width="140" height="30" bgcolor="#eeeeee"
							style="padding-left: 20px">이메일</td>
						<td width="460" style="padding-left: 10px;">${dto.userEmail }
							<input type="hidden" name="userEmail" value="${dto.userEmail }" />
						</td>
					</tr>


					<tr>
						<td colspan="2" height="1" bgcolor="#dbdbdb" align="center"></td>
					</tr>


					<tr>
						<td width="140" height="30" bgcolor="#eeeeee"
							style="padding-left: 20px">전화번호</td>
						<td width="460" style="padding-left: 10px;"><input
							type="text" name="userTel" size="35" maxlength="50" class="boxTF"
							value="${dto.userTel }"  placeholder="010-0000-0000" />
							</td>
					</tr>

					<tr>
						<td colspan="2" height="1" bgcolor="#dbdbdb" align="center"></td>
					</tr>

				</table>
				<br />
				<br />



				<table width="800" border="0" cellpadding="1" cellspacing="0"
					style="margin: auto;">

					<tr>
						<td>
							<div>구매자 정보</div>
						</td>
					</tr>



					<tr>
						<td colspan="2" height="3" bgcolor="#dbdbdb" align="center"></td>
					</tr>

					<tr>
						<td width="140" height="30" bgcolor="#eeeeee"
							style="padding-left: 20px">이름</td>
						<td width="460" style="padding-left: 10px;">${dto.userName }
							<input type="hidden" name="buyerName" value="${dto.userName }" />
						</td>
					</tr>


					<tr>
						<td colspan="2" height="1" bgcolor="#dbdbdb" align="center"></td>
					</tr>


					<tr>
						<td width="140" height="30" bgcolor="#eeeeee"
							style="padding-left: 20px">배송주소</td>
						<td width="460" style="padding-left: 10px;">
							<input type="text" name="buyerAddr" value="${dto.userAddr }" readonly="readonly" size="35"/>
							<input type="button" onClick="goPopup();" value="주소검색"/>
						</td>
					</tr>
					
					
					

					<tr>
						<td colspan="2" height="1" bgcolor="#dbdbdb" align="center"></td>
					</tr>


					<tr>
						<td width="140" height="30" bgcolor="#eeeeee"
							style="padding-left: 20px">연락처</td>
						<td width="460" style="padding-left: 10px;">
						 <input	type="text" name="buyerTel" value="${dto.userTel }" />
						</td>
					</tr>

					<tr>
						<td colspan="2" height="1" bgcolor="#dbdbdb" align="center"></td>
					</tr>





					<tr>
						<td>
							<button onclick="submit();">결제하기</button>
						</td>
					</tr>

				</table>






			</div>
		</form>





	</div>

	<table>
		<tr>
			<td colspan="2" height="1" bgcolor="#dbdbdb" align="center"	style="width: 100%;"></td>
		</tr>
	</table>

	
	<jsp:include page="footer.jsp"></jsp:include>

</body>
</html>
