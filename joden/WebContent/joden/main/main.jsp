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

<!-- header 전체 -->
<div id="header">

<!-- 로그인,회원가입 버튼 디자인 -->
	<div id="header-first">
		<a class="header-join">회원가입</a>
			<div id="header-first-line"></div>
		<a class="header-login">로그인</a>
	</div>

<!-- 검색창,로고 전체 -->
	<div id="header-secound">
	
<!-- 카테고리 -->
		<div id="header-secound-main">
			<div id="header-secound-category">
				<img alt="" src="*/image/category.png" class="header-secound-category-img">
				<span class="header-secound-category-text">카테고리</span>
			</div>
		</div>
		
		<div id="header-secound-logo">
		<a href="<%=cp%>/cabin/main.gos">
				<img alt="" src="*/image/category.png" class="header-secound-category-img"></a>
		</div>

		<form action="" method="post" id="headerSearchForm">
		<div id="headerSearchForm_box">
		<input name="searchProduct" placeholder="상품명 검색"
						class="headerSearchForm-input"/>
		<button class="headerSearchForm-btn">
		<i class="tiny material-icons">search</i></button>
		</div>
		</form>


	</div>


</div>

</body>
</html>