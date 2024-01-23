<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%
request.setCharacterEncoding("UTF-8");
String cp = request.getContextPath();

%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>

<!-- material icon -->
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

<link rel="stylesheet" type="text/css" href="<%=cp %>/joden/css/style.css"/>
<link rel="stylesheet" type="text/css" href="<%=cp %>/joden/css/style_header.css"/>
</head>
<body>

<section id="header1">
	 	<div id="header-first">
			<div class="">
			<a class="header-join">회원가입</a>
				<div id="header-first-line"></div>
			<a class="header-login">로그인</a>
			</div>
		</div>

	
	<form action="" method="post" name="myForm">
		<div id="header-secound">
		
	<!-- 카테고리 -->

			<div class="header-secound-category-img">
				<img alt="" src="./image/category.png" class="header-secound-category-img">
			</div>
			
			<div>
				<span class="header-secound-category-text">카테고리</span>
			</div>
			
			<div id="header-secound-logo">
				<a href="<%=cp%>/cabin/main.gos">
				<img alt="" src="./image/logo.png" class="header-secound-category-img"></a>
			</div>
	
			<div id="headerSearchForm">
				<div id="headerSearchForm_box">
					<input type="text" name="searchValue" placeholder="상품명 검색" class="headerSearchForm-input"/>
					<a href="location='<%=cp%>/cabin/list.gos';"><img src="./image/logo.png"></a>
				</div>
			</div>
			
			<div>
				마이페이지
			</div>
			
			<div>
				장바구니
			</div>
	
		</div>
	
	</form>
	
</section>


</body>
</html>