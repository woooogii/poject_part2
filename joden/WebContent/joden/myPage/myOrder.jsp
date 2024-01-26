<%@page import="java.util.Calendar"%>
<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%
	request.setCharacterEncoding("UTF-8");
	String cp = request.getContextPath();
	
	Calendar cal = Calendar.getInstance();
	
	int nowYear = cal.get(Calendar.YEAR);
	int nowMonth = cal.get(Calendar.MONTH)+1;
	int nowDay = cal.get(Calendar.DAY_OF_MONTH);
	
	// 사용자가 get방식으로 넘겨주면서 표시하고싶은 년,월
	String strYear = request.getParameter("year");
	String strMonth = request.getParameter("month"); // 넘긴 데이터가 있으면 받고 없으면 null
	
	// 달력에 표시할 년,월
	int year = nowYear;
	int month = nowMonth;
	
	if(strYear!=null){
		
		year = Integer.parseInt(strYear);
	}
	
	if(strMonth!=null){
		
		month = Integer.parseInt(strMonth);
	}
	
	// 화살표 1월 전 달은 전 년 12월
	int preYear = year, preMonth = month-1;
	if(preMonth<1){
		
		preYear = year-1;
		preMonth = 12;
	}
	
	// 12월 다음 달은 다음 해 1월
	int nextYear = year, nextMonth = month+1;
	if(nextMonth>12){
		nextYear = year+1;
		nextMonth = 1;
	}
	
	
	// 표시할 달력 셋팅
	cal.set(year,month-1,1);
	
	int startDay = 1;
	int endDay = cal.getActualMaximum(Calendar.DAY_OF_MONTH);
	
	// year년 month월 1일의 요일 구하기
	int week = cal.get(Calendar.DAY_OF_WEEK);
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>myPage/myOrder.jsp</title>
<style type="text/css">
 
body {
	
	font-size: 11pt;
}
 
td {
	
	font-size: 11pt;
}
 
</style>
 
<script type="text/javascript">
 
	function init(){
		
		let f = document.myForm;
		
		let fyear = f.year; //select- year
		let nowYear = <%=year%> //현재시간
		let startYear = nowYear - 5;
		
		for(i=0;i<11;i++){ // 2015부터 11번 돌기
			
			fyear[i] = new Option(startYear, startYear); //fyear[i] : select = 옵션만든것 
		
			if(fyear[i].value == nowYear){
				
				fyear[i].selected = true;
			}
			
			startYear++;
		}
		
		let fmonth = f.month;
		for(i=0;i<12;i++){
			
			fmonth[i] = new Option(i+1,i+1);
		}
	
			let nowMonth = <%=month%>;
			fmonth[nowMonth-1].selected = true;
	}
	
 
	function calendarChange() {
		
		let f = document.myForm;
		
		f.submit();
	}
 
	
</script>

<link rel="stylesheet" type="text/css" href="<%=cp%>/myPage/scc/myOrder.css" />
<link rel="stylesheet" type="text/css" href="<%=cp%>/myPage/scc/order.css" />
</head>
<body onload="init();">
 
<br/><br/>

	<div id="container">
		<div id="contents_sub">
													<br/><br/><br/>
			<div class="titleArea">
				<h2>주문조회</h2>
			</div>
			<form action="" method="get" name="myForm">
			<!-- <form method="GET" id="OrderHistoryForm" name="OrderHistoryForm">샐러드 달력 -->
				<div class="xans-element- xans-myshop xans-myshop-orderhistoryhead">
					<fieldset class="ec-base-box">
						<legend>검색기간설정</legend>
						<div class="stateSelect ">
							<select id="order_status" name="order_status" class="fSelect">
								<option value="all">전체 주문처리상태</option>
								<option value="shipped_standby">배송준비중</option>
								<option value="shipped_begin">배송중</option>
								<option value="shipped_complate">배송완료</option>
								<option value="order_cancel">취소</option>
							</select>
						</div>
						<span class="period"> 
							<a href="<%=cp %>/cabin/order/myOrder.gos" class="btnNormal" days="00"> 
							<img src="//img.echosting.cafe24.com/skin/base_ko_KR/myshop/btn_date1.gif" alt="오늘"></a> 
							<a href="#none" class="btnNormal" days="07">
							<img src="//img.echosting.cafe24.com/skin/base_ko_KR/myshop/btn_date2.gif" alt="1주일"></a> 
							<a href="#none" class="btnNormal" days="90">
							<img src="//img.echosting.cafe24.com/skin/base_ko_KR/myshop/btn_date4.gif" alt="3개월"></a> 
							<a href="#none" class="btnNormal" days="180">
							<img src="//img.echosting.cafe24.com/skin/base_ko_KR/myshop/btn_date5.gif" alt="6개월"></a>
						</span> 
						<input id="history_start_date" name="history_start_date"
							class="fText hasDatepicker" readonly="readonly" size="10"
							value="2023-10-26" type="text">
						<button type="button" class="ui-datepicker-trigger">
							<img
								src="//img.echosting.cafe24.com/skin/admin_ko_KR/myshop/ico_cal.gif"
								alt="..." title="...">
						</button>
						~ <input id="history_end_date" name="history_end_date"
							class="fText hasDatepicker" readonly="readonly" size="10"
							value="2024-01-24" type="text">
						<button type="button" class="ui-datepicker-trigger">
							<img
								src="//img.echosting.cafe24.com/skin/admin_ko_KR/myshop/ico_cal.gif"
								alt="..." title="...">
						</button>

							<b>
							<select name = "year" onchange="calendarChange();"></select>년
							&nbsp;&nbsp;
							<select name = "month" onchange="calendarChange();"></select>월
							</b>	

						<input alt="조회" id="order_search_btn" type="image"
							src="//img.echosting.cafe24.com/skin/admin_ko_KR/myshop/btn_search.gif">
					</fieldset>

				</div>
				<input id="mode" name="mode" value="" type="hidden"> <input
					id="term" name="term" value="" type="hidden">
			</form>
			<div
				class="xans-element- xans-myshop xans-myshop-orderhistorylistitem ec-base-table typeList">
				<!--
        $login_url = /member/login.html
    -->
				<div class="title">
					<h3>주문 상품 정보</h3>
				</div>
				<table border="1" summary="">
					<caption>주문 상품 정보</caption>
					<colgroup>
						<col style="width: 200px;">
						<col style="width: 93px;">
						<col style="width: auto;">
						<col style="width: 61px;">
						<col style="width: 111px;">
						<col style="width: 111px;">
					</colgroup>
					<thead>
						<tr>
							<th scope="col">주문일자<br>[주문번호]
							</th>
							<th scope="col">이미지</th>
							<th scope="col">상품정보</th>
							<th scope="col">수량</th>
							<th scope="col">상품구매금액</th>
							<th scope="col">주문처리상태</th>
						</tr>
					</thead>
					<tbody class="center ">
					
					
						<c:forEach var="dto" items="${lists }">
							<tr class="xans-record-">
								<td class="number ">
									<p></p> ${dto.orderDate }
									<p><a href="detail.html?order_id=20240124-0000317&amp;page=1&amp;history_start_date=2023-10-26&amp;history_end_date=2024-01-24" class="line">[20240124-0000317]</a></p>
									<a href="#none" class="btnNormal" onclick="OrderHistory.orderCancel('20240124-0000317')">주문취소</a>
								</td>
								<td class="thumb">
									<a href="/product/detail.html?product_no=24052&amp;cate_no=575">
									<img src="${imagePath }/${dto.imgSaveFileName }"></a>
								</td>
								<td class="product left top"><strong class="name">
									<a href="/product/bgm-라이프-마스킹테이프-15mm-내츄럴-퍼플/24052/category/575/" class="ec-product-name">${dto.productName}</a></strong>
									<div class="option "></div>
								</td>
								<td>${dto.orderAmount }</td>
								<td class="right"><strong>${dto.totalPrice }</strong>
									<div class="displaynone"></div></td>
								<td class="state">
									<p class="txtEm">입금전</p>
								</td>
	
							</tr>
						</c:forEach>
						
						
					</tbody>
				</table>
					<c:if test="${dataCount == 0}">
		                <p class="message ">주문 내역이 없습니다.</p>
		            </c:if>
				
			</div>


			<div style="margin: 80px 0px 0px 0px;"></div>
		</div>

		<hr class="layout">
	</div>
<jsp:include page="footer.jsp"/>
</body>
</html>