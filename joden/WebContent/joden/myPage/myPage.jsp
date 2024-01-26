<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%
	request.setCharacterEncoding("UTF-8");
String cp = request.getContextPath();
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>myPage/myPage.jsp</title>
<link rel="stylesheet" type="text/css" href="<%=cp%>/myPage/scc/myPage.css" />
<link rel="stylesheet" type="text/css" href="<%=cp%>/myPage/scc/page.css" />

</head>
<body>

	<div id="container">
		<div id="contents_sub"><br/><br/><br/>

			<div class="titleArea">
				<h2>마이쇼핑</h2>
			</div>



			<div class="xans-myshop-asyncbenefit">
				<div class="ec-base-box">
					<br/><br/><br/>
				</div>


				<div class="xans-myshop-orderstate">
					<div class="title">
						<h3>
							나의 주문처리 현황 <span class="desc">(최근 <em>3개월</em> 기준)
							</span>
						</h3>
					</div>
					<div class="state">
						<ul class="order">
							<li><strong>배송준비중</strong> 
								<a href="/myshop/order/list.html?order_status=shipped_before" class="count">
								<span id="xans_myshop_orderstate_shppied_before_count">0</span></a>
							</li>

							<li><strong>배송중</strong> 
								<a href="/myshop/order/list.html?order_status=shipped_begin" class="count">
								<span id="xans_myshop_orderstate_shppied_begin_count">0</span></a>
							</li>
							<li><strong>배송완료</strong> 
								<a href="/myshop/order/list.html?order_status=shipped_complate" class="count">
								<span id="xans_myshop_orderstate_shppied_complate_count">0</span></a>
							</li>
							<li><strong>취소</strong> 
								<a href="/myshop/order/list.html?order_status=shipped_standby" class="count">
								<span id="xans_myshop_orderstate_shppied_standby_count">0</span></a>
							</li>
						</ul>

					</div>
				</div>

			</div>

			<div
				class="xans-myshop-asyncbankbook ec-base-box gHalf">
				<ul>
					<li class=" "><strong class="title">가용적립금</strong> <strong
						class="data use">&nbsp;<span
							id="xans_myshop_bankbook_avail_mileage">2,000원</span></strong> <a
						href="/myshop/mileage/historyList.html" class="btnNormal">조회</a></li>
					<li class=""><strong class="title">총적립금</strong> <strong
						class="data"><span
							id="xans_myshop_bankbook_total_mileage">2,000원</span></strong></li>
					<li class=""><strong class="title">사용적립금</strong> <strong
						class="data"><span id="xans_myshop_bankbook_used_mileage">0원</span></strong>
					</li>
					<li class="displaynone"><strong class="title"></strong> <strong
						class="data use">&nbsp;</strong> <a
						href="/myshop/deposits/historyList.html" class="btnNormal">조회</a>
					</li>
					<li><strong class="title">총주문</strong> <strong class="data"><span
							id="xans_myshop_bankbook_order_price">0원</span>(<span
							id="xans_myshop_bankbook_order_count">0</span>회)</strong></li>
					<li class=""><strong class="title">쿠폰</strong> <strong
						class="data"><span id="xans_myshop_bankbook_coupon_cnt">0</span><span>개</span></strong>
						<a href="/myshop/coupon/coupon.html" class="btnNormal">조회</a></li>
				</ul>
			</div>


			<div id="myshopMain"
				class="xans-element- xans-myshop xans-myshop-main">
				<ul>
					<li class="shopMain order">
						<h3>
							<a href="<%=cp %>/cabin/order/myOrder.gos"><strong>Order</strong><span>주문내역 조회</span></a>
						</h3>
						<p>
							<a href="<%=cp %>/cabin/order/myOrder.gos">고객님께서 주문하신 상품의<br>
								주문내역을 확인하실 수 있습니다.
							</a>
						</p>
					</li>
					<li class="shopMain profile">
						<h3>
							<a href="<%=cp %>/cabin/updated.gos"><strong>Profile</strong><span>회원
									정보</span></a>
						</h3>
						<p>
							<a href="<%=cp %>/cabin/updated.gos">회원이신 고객님의 개인정보를<br> 관리하는
								공간입니다.
							</a>
						</p>
					</li>
					<li class="shopMain wishlist">
						<h3>
							<a href="/myshop/wish_list.html"><strong>Wishlist</strong><span>관심
									상품</span></a>
						</h3>
						<p>
							<a href="/myshop/wish_list.html">관심상품으로 등록하신<br> 상품의 목록을
								보여드립니다.
							</a>
						</p>
					</li>
					<li class="shopMain likeIt displaynone ">
						<h3>
							<a href=""><strong>Like it</strong><span>좋아요</span></a>
						</h3>
						<p>
							<a href="">'좋아요'를 선택한 상품과<br> 상품분류 목록을 보여드립니다.
							</a>
						</p>
					</li>
					<li class="shopMain cart ">
						<h3>
							<a href="<%=cp %>/cabin/order/myCart.gos"><strong>Cart</strong><span>장바구니</span></a>
						</h3>
						<p>
							<a href="<%=cp %>/cabin/order/myCart.gos">고객님이 장바구니에 담으신<br>
								상품을 보여드립니다.
							</a>
						</p>
					</li>




				</ul>
			</div>

			<div style="margin: 80px 0px 0px 0px;"></div>
		</div>

		<hr class="layout">
	</div>
<jsp:include page="footer.jsp"/>
</body>
</html>