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
<title>카테고리별 리스트</title>

<link rel="stylesheet" type="text/css" href="<%=cp %>/joden/css1/style.css"/>
<link rel="stylesheet" type="text/css" href="<%=cp %>/joden/css1/list.css"/>

</head>
<body>

<br/><br/>

<!-- 전체 박스 시작 -->
<div id="bbsList">

	<div align="center">
		카테고리별 리스트
	</div>
		<br/><br/>

	<div id="bbsList_header">

			<div id="leftHeader">
				<dl>
				<dt>전체상품: ${dataCount }</dt>
				</dl>
			</div>
				
			<div id="rightHeader">
				<input type="button" value="게시물 등록" onclick="location='<%=cp%>/image/write.do';"/>
			</div>

	</div>	
	
<!-- 상품리스트 -->
	<div id="bbsList_list">
		<div style="padding-top: 5px;">
		
			<div style="display: flex; flex-wrap: wrap;">
				<c:forEach var="dto" items="${lists }">
					<div style="margin-bottom: 10px;">
					  	
						<div style="width: 230px; text-align: center;">
							${pageNum }
							<a href="./image/">
								<img src="${imagePath }/${dto.saveFileName}" width="210" height="200"/></a>
							<br/>${dto.num }
							<a href="${deletePath }?num=${dto.num}&pageNum=${pageNum }" >삭제</a>
						</div>
							
					</div>
				</c:forEach>
			
			</div>
			
			<div id="footer" >
				<c:if test="${dataCount!=0 }">
				${pageIndexList }
				</c:if>
				<c:if test="${dataCount==0 }">
				등록된 게시물이 없습니다.
				</c:if>
			</div>
		
		</div>	
		
	</div>

</div>

</body>
</html>