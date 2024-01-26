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
<title>Insert title here</title>
</head>
<body>

<div id="header-second">
			<div class="btn-group header-second-btn-box">
				<c:choose>
					<c:when
						test="${pageContext.request.requestURI eq '/shop/main.jsp' }">
						<button type="button" id="header-sec-home"
							onclick="location.href='/shop/';"
							class="btn btn-basic header-second-btn-group border-btm-red">
							홈</button>
					</c:when>
					<c:otherwise>
						<button type="button" id="header-sec-home"
							onclick="location.href='/shop/';"
							class="btn btn-basic header-second-btn-group">홈</button>
					</c:otherwise>
				</c:choose>
				<c:choose>
					<c:when test="${pageContext.request.requestURI eq '/shop/product/rank.jsp' }">
						<button type="button" id="header-sec-rank" class="btn btn-basic header-second-btn-group border-btm-red" onclick="location.href='/shop/product?cmd=rank';">랭킹</button>
					</c:when>
					<c:otherwise>
						<button type="button" id="header-sec-rank" style=""
							class="btn btn-basic header-second-btn-group" onclick="location.href='/shop/product?cmd=rank';">랭킹</button>
					</c:otherwise>
				</c:choose>
				
				<div class="btn-group">
					<button type="button" id="header-sec-items"
						class="btn btn-basic dropdown-toggle header-second-btn-group"
						data-toggle="dropdown">브랜드별</button>
					<div class="dropdown-menu">
						<c:forEach var="comp" items="${brandNameList}">
							<a class="dropdown-item"
								href="<%=request.getContextPath()%>/product?cmd=search&compNo=${comp.id}">${comp.name}</a>
						</c:forEach>
					</div>
				</div>
				
				<c:choose>
					<c:when test="${pageContext.request.requestURI eq '/shop/product/categories.jsp' }">
						<button type="button" id="header-sec-rank" class="btn btn-basic header-second-btn-group border-btm-red" onclick="location.href='/shop/product?cmd=category';">전체상품</button>
					</c:when>
					<c:otherwise>
						<button type="button" id="header-sec-rank" style=""
							class="btn btn-basic header-second-btn-group" onclick="location.href='/shop/product?cmd=category';">전체상품</button>
					</c:otherwise>
				</c:choose>
			</div>
		</div>

<!-- 상세페이지 > 1. 상품 설명 -->

<div class="favor-item-box" id="favor-item-box">
		<div class="favor-prd-list" id="favor-prd-list">
			<c:forEach var="product" items="${allProductList}">
				<div class="favor-prd-box">
				<a class="favor-link-prod"
					href="/shop/product?cmd=detail&prodNo=${product.productId}">
				</a>
				<img src="${product.imgUrl_1}" class="main-prd-item-img" />
					<ul class="favor-prd-item">
						<!-- 상품이미지 -->
						<li class="prd-item-company">${product.companyName}</li>
						<!-- 제조사 -->
						<li class="prd-item-name">${product.productName}</li>
						<!-- 상품명 -->
						<li class="prd-item-price"><fmt:formatNumber value="${product.price}" type="number" /></li>
						<!-- 가격 -->
						<li class="prd-item-soldCount">${product.soldCount}개구매중</li>
						<!-- 판매량 default = 0 -->
					</ul>
				</div>
			</c:forEach>
		</div>
	</div>
	
	<!-- 상세페이지 > 2. 구매버튼 -->
			<c:choose>
				<c:when test="${sessionScope.principal != null}">
					<button type="button" class="buy-btn" onclick="location.href='<%=request.getContextPath()%>/user?cmd=directBuy&prodId=${prodDto.prodId}&userId=${sessionScope.principal.id}';">바로 구매</button>
				</c:when>
				<c:otherwise>
					<button type="button" class="buy-btn" onclick="needLogin();">바로 구매</button>
				</c:otherwise>
			</c:choose>
			
int prodNo = Integer.parseInt(request.getParameter("prodNo"));
			// 상품 정보 받아오기 시작
			DetailProdRespDto prodDto = productService.상품상세보기(prodNo);
			request.setAttribute("prodDto", prodDto);
			// 상품 정보 받아오기 끝
			
			// 찜 여부, 카트 여부 받아오기 시작
			HttpSession session = request.getSession();
			User principal = (User) session.getAttribute("principal");
			if (principal != null) {
				int userId = principal.getId();
				
				FavorService favorService = new FavorService();
				boolean isFavor = favorService.찜여부(userId, prodNo);
				request.setAttribute("isFavor", isFavor);
				
				CartService cartService = new CartService();
				boolean isCart = cartService.장바구니여부(userId, prodNo);
				request.setAttribute("isCart", isCart);
			}
			// 찜 여부, 카트 여부 받아오기 끝


<br/><br/><br/><br/><br/><br/>
<br/><br/><br/><br/><br/><br/>
<br/><br/><br/><br/><br/><br/>user.
</body>
</html>