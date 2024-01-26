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

<style type="text/css">

.layout {
  display: flex;
  gap: 60px;
  margin: auto;
  
  color: grey;
  
}

</style>


<title>Insert title here</title>


</head>
<body>


    <section class="layout" style="width: 1000px; height:200px;">

        <h1><a href="<%=cp%>/main"><img src="<%=cp %>/joden/pay/image/jodensLogo.png"  /></a></h1>
        
       	 <div>
            <address>
                상호명 및 호스팅 서비스 제공 : 조든의 오두막<br/>
                대표이사 : 리프리트 조든<br/>
                라퀴에트 상업도시 하비엘 스트리트 245-12 <br/>
                사업자 등록번호 : 123-45-67890 <br/>
                통신판매업신고 : 2024-라퀴에트하비엘-0224<br/>
                
            </address>
            </div>
            
            
            
            <div>
               
                    <strong>365고객센터</strong> | 전자금융거래분쟁처리담당<br/>
                    <em><font size="5"><b>1577-1234</b>(유료)</font></em><br/>
                    라퀴에트 상업도시 하비엘 스트리트 245-12<br/>
                    <span class="contact-fax">email : help@jodenscavin.com</span>
                
            </div>
            <div>
	      
	                <strong>고블린은행 채무지급보증 안내</strong><br/>
	                <span>
	                  당사는 고객님이 현금 결제한<br/> 금액에 대해 고블린은행과<br/>채무지급보증 계약을 체결하여 안전거래를 보장하고 있습니다.<br/>
	              </span>
	                
	           
            </div>
   
    </section>
    <div style="width: 1000px; height:100px;" class="layout">
        <div >
        <img src="<%=cp %>/image/footerImg.jpg">
        </div>
    </div>
   


</body>
</html>