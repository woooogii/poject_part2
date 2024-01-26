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

<link rel="stylesheet" type="text/css" href="<%=cp%>/joden/product/css1/style.css"/>
<link rel="stylesheet" type="text/css" href="<%=cp%>/joden/product/css1/created.css"/>

<script type="text/javascript" src="<%=cp%>/joden1/product/js/create.js"></script>

</head>
<body>

<div id="bbs">

	<div id="bbs_title">
		상품 등록
	</div>
	
	<form action="<%=cp%>/cabin/shop/create_ok.gos" method="post" name="myForm" enctype="multipart/form-data">
	<div id="bbsCreated">	
		
		<div class="bbsCreated_bottomLine">
			<dl>
				<dt>상품 카테고리</dt>
				<dd>
					<select name="category" class="selectField">
						<option value="">카테고리 선택</option>
						<option value="의류">의류</option>
						<option value="무기">무기</option>
						<option value="도서">도서</option>
						<option value="음료">음료</option>
					</select>
				</dd>
			</dl>			
		</div>
		
		<div class="bbsCreated_bottomLine">
			<dl>
				<dt>상품 이름</dt>
				<dd>
				<input type="text" name="productName" size="60" maxlength="100" class="boxTF"/>
				</dd>
			</dl>			
		</div>
		
		<div class="bbsCreated_bottomLine">
			<dl>
				<dt>가격</dt>
				<dd>
				<input type="text" name="price" size="35" maxlength="20" class="boxTF"/>
				</dd>
			</dl>			
		</div>
		
		<div class="bbsCreated_bottomLine">
			<dl>
				<dt>재고수량</dt>
				<dd>
				<input type="text" name="amount" size="35" maxlength="50" class="boxTF"/>
				</dd>
			</dl>			
		</div>
		
		<div class="bbsCreated_bottomLine">
			<dl>
				<dt>상품 이미지</dt>
				<dd><input type="file" name="upload" maxlength="100" class="boxTF"/></dd>
			</dl>			
		</div>
		
		<div id="bbsCreated_content">
			<dl>
				<dt>상세 설명</dt>
				<dd>
				<textarea rows="12" cols="63" name="productDetailContent" class="boxTA" style="resize: none; background-color: #ffffff"></textarea>	
				</dd>
			</dl>			
		</div>
	
	</div>
	
	<div id="bbsCreated_footer">
		<input type="submit" value="등록하기" class="btn2" onclick="productUpload();" />
		<input type="reset" value="다시입력" class="btn2" onclick="document.myForm.productNum.focus();"/>
		<input type="button" value="작성취소" class="btn2" onclick="location='<%=cp%>/cabin/shop/productList.gos'"/>
	</div>
	
	</form>

</div>






<br/><br/><br/><br/><br/><br/>
<br/><br/><br/><br/><br/><br/>
<br/><br/><br/><br/><br/><br/>
</body>
</html>