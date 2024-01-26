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
<title>카테고리별 리스트</title>

<link rel="stylesheet" type="text/css" href="<%=cp %>/joden/product/css1/style.css"/>
<link rel="stylesheet" type="text/css" href="<%=cp %>/joden/product/css1/list.css"/>>

<script type="text/javascript">

</script>

</head>
<body>
<jsp:include page="header.jsp"></jsp:include>

<div id="bbsList">

	<div id="bbsList_title">
	카테고리별 상품
	</div>
	
	<div id="bbsList_header">
		<div id="leftHeader">
		
			전체상품: ${dataCount }
		</div>
			
		<div id="rightHeader">
			<select name="searchCategory" class="selectField">
			<option value="신상품순">신상품순</option>
			<option value="신상품순">조회순</option>
			<option value="신상품순">가격순</option>
			</select>
		</div>
		
	</div>
	
	<div id="bbsList_list">
		<div style="padding-top: 5px;">
			<div style="display: flex; flex-wrap: wrap;">
				<c:forEach var="cate" items="${categoryLists }">
					<div style="margin-bottom: 10px; align-items: center;">
						<div style="width: 280px; height: 280px; text-align: center;">
							<a href="${articleUrl }&num=${cate.productNum}">
							<img src="${imagePath }/${cate.imgSaveFileName }" width="210" height="200"/></a>
							<br/>${cate.productName }
							<a href="${deletePath }cateList.gos?category=${cate.category }&num=${cate.productNum}&pageNum=${pageNum }" >삭제</a>
						</div>
					</div>
				</c:forEach>
			</div>
		</div>


		<div id="footer">
			<c:if test="${dataCount!=0 }">
			${cateIndexList }
			</c:if>
			<c:if test="${dataCount==0 }">
			등록된 게시물이 없습니다.
			</c:if>
		</div>

	</div>

</div>





<br/><br/><br/><br/><br/><br/>
<br/><br/><br/><br/><br/><br/>
<br/><br/><br/><br/><br/><br/>
</body>
</html>