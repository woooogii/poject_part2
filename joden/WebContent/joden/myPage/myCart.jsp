<%@page import="com.myPage.CartDTO"%>
<%@page import="com.myPage.CartDAO"%>
<%@page import="java.net.URLEncoder"%>
<%@page import="java.net.URLDecoder"%>
<%@page import="com.util.MyUtil"%>
<%@page import="java.util.List"%>
<%@page import="com.util.DBConn"%>
<%@page import="java.sql.Connection"%>
<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
	request.setCharacterEncoding("UTF-8");
	String cp = request.getContextPath();
	

%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<script type="text/javascript">if (typeof EC_ROUTE === "undefined") {
    /**
     * 프론트용 라우트 플러그인
     * @type {{bInit: boolean, init: EC_ROUTE.init}}
     * CAFE24.ROUTE 참조
     */
    var EC_ROUTE = {
        EC_DOMAIN_PATH_INFO: 'EC_DOMAIN_PATH_INFO',
        bInit: false,
        aFromList: [],
        aToList: [],
        aCleanFilter: null,
        init: function () {
            if (this.bInit || typeof CAFE24.ROUTE === 'undefined') {
                return;
            }
            this.bInit = true;
            this.aCleanFilter = [
                /^shop[1-9][0-9]*$/,
                /^(m|p)$/,
                new RegExp('^(' + Object.keys(CAFE24.ROUTE.support_language_list).join('|')  + ')$'),
                /^skin-(base|skin[1-9][0-9]*|mobile[0-9]*)$/,
            ];
        },
        isNeedRoute: function ()
        {
            return CAFE24.ROUTE.is_need_route;
        },
        /**
         *
         * @param iShopNo
         * @param bMobile
         * @param sFrontLanguage
         * @param sSkinCode
         * @returns {*|string}
         */
        getUrlDomain: function (iShopNo, bMobile, sFrontLanguage, sSkinCode)
        {
            var oRouteConfig = {};
            if (typeof iShopNo == 'undefined') {
                oRouteConfig.shop_no = CAFE24.SDE_SHOP_NUM;
            } else {
                oRouteConfig.shop_no = iShopNo;
            }
            if (typeof bMobile == 'undefined') {
                oRouteConfig.is_mobile = false;
            } else {
                oRouteConfig.is_mobile = bMobile;
            }
            if (typeof sFrontLanguage == 'undefined') {
                oRouteConfig.language_code = '';
            }else {
                oRouteConfig.language_code = sFrontLanguage; // 내부에서 로직으로 동작할땐 언어_지역 형태의 로케일 형태를 따른다.
            }
            if (typeof sSkinCode == 'undefined') {
                oRouteConfig.skin_code = '';
            }else {
                oRouteConfig.skin_code = sSkinCode;
            }

            var sDomain = '';
            if (oRouteConfig.shop_no != CAFE24.SDE_SHOP_NUM) {
                // 접근된 다른 멀티샵 도메인 정보는 primary domain 를 조회해야함으로 ajax 를 통해 정보를 얻는다.
                sDomain = this._getUrlDomainMultishop(oRouteConfig);
            } else {
                // 샵이 동일할 경우에는 접근된 domain 에 path 정보만 정리하여 반환함.
                sDomain = this._getUrlDomain(oRouteConfig);
            }
            return sDomain;
        },
        _getUrlDomainMultishop: function (oRouteConfig)
        {
            var sDomain = '';
            EC$.ajax({
                type: 'GET',
                url: '/exec/front/Shop/Domain',
                data: {
                    '_shop_no' : oRouteConfig.shop_no,
                    'is_mobile' : oRouteConfig.is_mobile,
                    'language_code' : oRouteConfig.language_code,
                    'skin_code' : oRouteConfig.skin_code,
                },
                async: false,
                dataType: 'json',
                cache: true,
                success: function(oResult) {
                    switch (oResult.code) {
                        case '0000' :
                            sDomain = oResult.data;
                            break;
                        default :
                            break;
                    }
                    return false;
                }
            });
            return sDomain;
        },
        _getUrlDomain: function (oRouteConfig)
        {
            oRouteConfig.domain = this._getCreateHost(oRouteConfig);
            return location.protocol + '//' + oRouteConfig.domain + this._getCreateUri(oRouteConfig);
        },
        _getCreateHost : function (oRouteConfig)
        {
            var sHost = location.host;
            var aHost = sHost.split('.');
            if (this.isBaseDomain(sHost)) {
                if (aHost.length > 3) {
                    aHost[0] = '';
                }
            } else if (oRouteConfig.is_mobile) {
                if (this.isMobileDomain()) {
                    oRouteConfig.is_mobile = false;
                }
            }
            return aHost.filter(Boolean).join('.');
        },
        _getCreateUri: function (oRouteInfo)
        {
            var aUrl = [];
            if (this.isBaseDomain() && oRouteInfo.shop_no > 1) {
                aUrl.push('shop' + oRouteInfo.shop_no);
            }
            if (oRouteInfo.is_mobile) {
                aUrl.push('m');
            }
            if (oRouteInfo.language_code != 'ZZ' && oRouteInfo.language_code != '') {
                var iIndex = Object.values(CAFE24.ROUTE.support_language_list).indexOf(oRouteInfo.language_code);
                if (iIndex !== -1) {
                    aUrl.push(Object.keys(CAFE24.ROUTE.support_language_list)[iIndex]);
                }
            }
            if (this.isBaseDomain() && oRouteInfo.skin_code != 'default' && oRouteInfo.skin_code != '') {
                aUrl.push('skin-' + oRouteInfo.skin_code);
            }
            var sUrl= '/';
            if (aUrl.length > 0) {
                sUrl= '/' + aUrl.join('/');
                sUrl = this.rtrim(sUrl, '/');
            }
            return sUrl;
        },
        /**
         * en, en-US => en_US
         */
        convertValidLanguageCode: function (sUrlLanguageCode)
        {
            if (typeof CAFE24.ROUTE.support_language_list[sUrlLanguageCode] != 'undefined') {
                return CAFE24.ROUTE.support_language_list[sUrlLanguageCode];
            }
            return false;
        },
        isMobileDomain: function (sHost)
        {
            if (typeof sHost == 'undefined') {
                sHost = location.host;
            }
            var aMatched = sHost.match(/^(m|mobile|skin\-mobile|skin\-mobile[0-9]+[\-]{2}shop[0-9]+|skin\-mobile[0-9]+|mobile[\-]{2}shop[0-9]+)\./i);
            return aMatched != null;
        },
        isBaseDomain: function (sHost)
        {
            if (typeof sHost == 'undefined') {
                sHost = location.host;
            }
            return sHost.indexOf(CAFE24.GLOBAL_INFO.getRootDomain()) !== -1;
        },
        removePrefixUrl: function (sUrl)
        {
            if (this.isNeedRoute()) {
                sUrl = sUrl.replace(this.getPrefixUrl('/'), '/'); // 자동으로  prefix 붙은 영역을 제거해준다.
            }
            return sUrl;
        },
        getPrefixUrl: function (sUrl)
        {
            if (this.isNeedRoute() === false) {
                return sUrl;
            }
            if (sUrl.indexOf('/') !== 0) {
                return sUrl;
            }
            if (sUrl.match(/^\/{2,}/) !== null) {
                return sUrl;
            }

            var iCachedPosition = this.aFromList.indexOf(sUrl);
            if (iCachedPosition > -1) {
                return this.aToList[iCachedPosition];
            }

            var bTailSlash = (sCleanUrl !== '/' && sUrl.substr(-1) === '/');
            var sCleanUrl = this.getCleanUrl(sUrl);
            var aPrefixPart = CAFE24.ROUTE.path.prefix.split('/');
            var aUrlPart = sCleanUrl.split('/');
            var bMatched = true;
            var sReturnUrl = sCleanUrl;
            if (aUrlPart.length < aPrefixPart.length) {
                bMatched = false;
            } else {
                for (var i = 0; i < aPrefixPart.length ; i++) {
                    if (aPrefixPart[i] != aUrlPart[i]) {
                        bMatched = false;
                        break;
                    }
                }
            }
            if (bMatched === false) {
                if (sCleanUrl == '/') {
                    sReturnUrl = CAFE24.ROUTE.path.prefix;
                } else {
                    sReturnUrl = CAFE24.ROUTE.path.prefix +  sCleanUrl;
                }
                sReturnUrl = bTailSlash ? sReturnUrl : this.rtrim(sReturnUrl, '/')
                this.aFromList.push(sUrl);
                this.aToList.push(sReturnUrl);
            }
            return sReturnUrl;
        },
        /**
         * document.location.pathname 이 필요할 경우 사용한다.
         * @returns {*}
         */
        getPathName: function()
        {
            if (typeof CAFE24.ROUTE.path.result == 'undefined') {
                return document.location.pathname;
            }
            return CAFE24.ROUTE.path.result;
        },
        rtrim: function (str, chr)
        {
            var rgxtrim = (!chr) ? new RegExp('\\s+$') : new RegExp(chr+'+$');
            return str.replace(rgxtrim, '');
        },
        getShopNo: function ()
        {
            return CAFE24.ROUTE.shop_no;
        },
        getSkinCode: function ()
        {
            return CAFE24.ROUTE.skin_code;
        },
        getLanguageCode: function ()
        {
            return CAFE24.ROUTE.language_code;
        },
        getMobile: function ()
        {
            return CAFE24.ROUTE.is_mobile;
        },
        getIsMobile: function ()
        {
            return CAFE24.ROUTE.is_mobile || CAFE24.ROUTE.skin_code.match(/^mobile[0-9]*$/);
        },
        getCleanUrl: function (sUrl)
        {
            if (sUrl === '/') {
                return sUrl;
            }

            var aUrl = sUrl.split('/');
            aUrl.shift();

            if (aUrl.length < 1) {
                return sUrl;
            }

            // 현재 4 depth 까지 미리보기 기능이 구현되어있음
            var iPos = 0;
            var bFind = false;
            for (var i = 0; i < aUrl.length ; i++) {
                bFind = false;
                for (var iSub = iPos, iSubCount = this.aCleanFilter.length; iSub < iSubCount ; iSub++) {
                    if (aUrl[i].match(this.aCleanFilter[iSub]) !== null) {
                        bFind = true;
                        iPos = iSub + 1;
                        aUrl.splice(i, 1);
                        i--; // aUrl 을 삭제해 주었으니 검색 조건을 -1 제거하여 초기화 한다. 다음 for i++ 로 증감 조회됨.
                        break;
                    }
                }
                if (bFind === false) {
                    break;
                }
            }
            return '/' + aUrl.join('/');
        },
        getIsEasyUrl : function ()
        {
            return !window.location.pathname.match(/^[\w\/\-\.]+(php|html|htm)$/i);
        }
    };
    EC_ROUTE.init();
}

</script>
<title>joden/myCartjsp</title>
<link rel="stylesheet" type="text/css" href="<%=cp%>/myPage/scc/myCart.css" />
<link rel="stylesheet" type="text/css" href="<%=cp%>/myPage/scc/dcart.css" />
<script type="text/javascript" src="<%=cp%>/myPage/util.js"></script>
<script type="text/javascript">
	
	function searchData() {
		
		var f = document.searchForm;
		
		f.action = "<%=cp%>/myPage/myCart.gos"
		f.submit();
	}
	

	
	var aBasketProductData = [];
	aBasketProductData[0] = {"delvtype":"A","main_cate_no":58,"categories":[58,74,95,142,147,473,664],"product_no":24689,"opt_id":"000A","product_type":"normal_type","naver_used_exception":"F","quantity":1,"check_quantity":1,"check_quantity_type":"O","product_qty":1,"option_add":"F","product_min":1,"product_max_type":"F","product_max":0,"product_code":"P000BKNP","product_price":1600,"opt_price":0,"product_sum_price":1550,"product_sale_price":1550,"product_name":"\uc0b0\ub9ac\uc624 \uc870\uac01 \uc2a4\ud2f0\ucee4 : \uc2dc\ub098\ubaa8\ub864","opt_str":"","item_code":"P000BKNP000A","option_type":"T","has_option":"F","has_option_add":"F","is_set_product":"F","set_product_name":"","set_product_no":0,"basket_prd_no":5089628,"item_listing_type":"C","is_oversea_able":false,"set_product_list":null,"buy_unit":1,"check_buy_unit_type":"O","wish_selected_item":"","wish_save_data":"","olink_data":"","product_paymethod":"card,cash,cell,kakaopay,icash,mileage,tcash","option_attached_file_info_json":"","total_unit_add_sale":50,"use_store_pickup":"F","sIsBenefitEventProduct":"F","add_sale_related_qty":50,"add_sale_not_related_qty":0,"supplier_id":"tiggers","param":"?product_no=24689&cate_no=58","img":"\/\/saladmarket.co.kr\/web\/product\/tiny\/202401\/4168b7469b4add575a7fb08f9ba49e8e.jpg","name_alt":"\uc0b0\ub9ac\uc624 \uc870\uac01 \uc2a4\ud2f0\ucee4 : \uc2dc\ub098\ubaa8\ub864","product_name_link":"<a href = \"\/product\/\uc0b0\ub9ac\uc624-\uc870\uac01-\uc2a4\ud2f0\ucee4-\uc2dc\ub098\ubaa8\ub864\/24689\/category\/58\/\" class=\"ec-product-name\" >\uc0b0\ub9ac\uc624 \uc870\uac01 \uc2a4\ud2f0\ucee4 : \uc2dc\ub098\ubaa8\ub864<\/a>","form_quantity":"<input id=\"quantity_id_0\" name=\"quantity_name_0\" size=\"2\" value=\"1\" type=\"text\"  \/>","option_change_display":false,"product_price_div_id":"product_price_div0","discount":"","product_price_display":false,"product_price_str":"1,600\uc6d0","product_sale_price_div_id":"product_sale_price_div0","product_sale_price_display":"displaynone","product_sale_price_front_id":"product_sale_price_front0","product_sale_price_str":"1,550\uc6d0","sum_price_front_id":"sum_price_front0","sum_price":"1,600\uc6d0","sum_price_org":1600,"is_subscription":"F","custom_data":null,"custom_data_idx":null,"use_basket_sale_price_display":"","volume_size_serial":"","product_image":"\/\/saladmarket.co.kr\/web\/product\/tiny\/202401\/4168b7469b4add575a7fb08f9ba49e8e.jpg","option_str":null,"shipping_fee_type":"M","is_side_product":"F","check_buy_unit":1};
	aBasketProductData[0].product_name = "aaaaa";
	aBasketProductData[0].set_product_name = "";
	aBasketProductData[0].opt_str = "";
	aBasketProductData[0].sIsBenefitEventProduct = "F";
	aBasketProductData[0].is_side_product = "F";
	aBasketProductData[0].layer_option_str = "";
	
</script>

</head>
<body>
	<div id="container">
		<div id="contents_sub">

			<div class="titleArea">
				<h2>장바구니</h2>
			</div>

			<div class="xans-order-basketpackage ">
				<div class="orderListArea ec-base-table typeList">
					<div class="title">
						<h3>일반상품 (2)</h3>
					</div>

					<table>
						<colgroup>
							<col style="width: 27px">
							<col style="width: 200px">
							<col style="width: auto">
							<col style="width: 88px">
							<col style="width: 110px">
							<col style="width: 110px">
						</colgroup>
						
						<thead>
							<tr>
								<th scope="col"><input type="checkbox"
									onclick="Basket.setCheckBasketList('basket_product_normal_type_normal', this);"></th>
								<th scope="col">이미지</th>
								<th scope="col">상품정보</th>
								<th scope="col">수량</th>
								<th scope="col">상품구매금액</th>
								<th scope="col">선택</th>
							</tr>
						</thead>
						
						<tbody class="center">
						
							<c:forEach var="dto" items="${lists }">
								<tr class="">
									<td><input type="checkbox" id="basket_chk_id_0" name=""></td>
									<td>
									<%-- <img src="<%=cp %>/product/mangto1.jpg"> --%>
									<a href="${articleUrl }&num=${dto.productNum}">
									<img style="max-width: 100px;" src="${imagePath }/${dto.imgSaveFileName }"></a>
									</td>
									<td class="left"><strong class="name" id="basket_prod_id_0">${dto.productName}</strong></td>
									
									<td class="right">${dto.cartAmount }
									<span class=""> 
										<span class="ec-base-qty">
										<input id="quantity_id_0" name="quantity_name_0" size="2" value="1" type="text">
										
										<a href="javascript:;" class="up" onclick="Basket.addQuantityShortcut('quantity_id_0', 0);">
										<img src="//img.echosting.cafe24.com/skin/base/common/btn_quantity_up.gif" alt="수량증가"></a>
										
										<a href="javascript:;" class="down" onclick="Basket.outQuantityShortcut('quantity_id_0', 0);">
										<img src="//img.echosting.cafe24.com/skin/base/common/btn_quantity_down.gif" alt="수량감소"></a>
										</span>
										
										<a href="javascript:;" class="btnNormal gBlank5" onclick="Basket.modifyQuantity()">변경</a>
									</span>
									
									<span class="displaynone">${dto.cartAmount }</span></td>
									
									<td>
										<div><strong>${dto.price}</strong><p class="displaynone"></p></div>
									</td>
	
	
									<td class="button">
										<a href="javascript:;" class="btnSubmit " onclick="Basket.orderBasketItem(0);">주문하기</a>
										<a href="javascript:;" class="btnNormal" onclick="BasketNew.moveWish(0);">관심상품등록</a> 
										<a href="javascript:;" onclick="Basket.deleteBasketItem(0);">
										<a href="${deletePath }?name=${dto.productName}" class="btnNormal"> <i class="icoDelete"></i>
											삭제</a></td>
								</tr>
							</c:forEach>
							
							
							<c:if test="${dataCount == 0}">
				                장바구니가 비어 있습니다.
				            </c:if>
							
						</tbody>
						
						
						
						
						
												
						<tfoot class="right">
							<c:forEach var="dto" items="${lists }">
							    <tr>
							        <td colspan="10">
							            <span class="gLeft">[기본배송]</span> 상품구매금액 
							            <strong>${dto.cartAmount * dto.price }<span class="displaynone">()</span></strong>
							            + 배송비 <span>3,000</span>
							            <span class="displaynone"> </span> 
							            = 합계 : <strong class="gIndent10">
							            <span class="txt18">${dto.cartAmount * dto.price+3000}</span>원</strong>
							            <span class="displaynone"> </span>
							        </td>
							    </tr>
						    </c:forEach>
						</tfoot>
					</table>

				</div>

				<div><br/>
					<table>
						<tr>
							<td align="left"><strong class="text">선택상품을</strong>
							<a href="#none" class="btnEm" onclick="Basket.deleteBasket()"><i class="icoDelete"></i> 삭제하기</a>
							</td>
							<%-- <a href="${deletePath}?num=${dto.num}&pageNum=${pageNum}">삭제</a> --%>
							<td align="right">
							<!-- <a href="#none" class="btnNormal" onclick="Basket.emptyBasket()"> -->
							<a href="" class="btnNormal">
							장바구니비우기</a>
							</td>
						</tr>
					</table>
				</div>


				<div class="xans-order-totalorder ec-base-button justify">
					<a href="<%=cp %>/cabin/pay/pay.gos" onclick="Basket.orderAll(this)"
						link-order="/order/orderform.html?basket_type=all_buy"
						link-login="/member/login.html" class="btnSubmitFix sizeM  ">전체상품주문</a>
					<a href="<%=cp %>/cabin/pay/pay.gos" onclick="Basket.orderSelectBasket(this)"
						link-order="/order/orderform.html?basket_type=all_buy"
						link-login="/member/login.html" class="btnEmFix sizeM ">선택상품주문</a>
						<span class="gRight"> <a href="<%=cp %>/cabin/shop/productList.gos" class="btnNormalFix sizeM">쇼핑계속하기</a>
					</span>

				</div>

			


			<div id="bbs_title">
				<table border="1">

					<tr>
						
						<ol><h4>장바구니 이용안내</h4>
							<li>해외배송 상품과 국내배송 상품은 함께 결제하실 수 없으니 장바구니 별로 따로 결제해 주시기 바랍니다.</li>
							<li>해외배송 가능 상품의 경우 국내배송 장바구니에 담았다가 해외배송 장바구니로
								이동하여 결제하실 수 있습니다.</li>
							<li>선택하신 상품의 수량을 변경하시려면 수량변경 후 [변경] 버튼을 누르시면
								됩니다.</li>
							<li>[쇼핑계속하기] 버튼을 누르시면 쇼핑을 계속 하실 수 있습니다.</li>
							<li>장바구니와 관심상품을 이용하여 원하시는 상품만 주문하거나 관심상품으로 등록하실
								수 있습니다.</li>
							<li>파일첨부 옵션은 동일상품을 장바구니에 추가할 경우 마지막에 업로드 한 파일로
								교체됩니다.</li>
						</ol>
					</tr>
				</table>
			</div><br/><br/><br/><br/><br/>
		</div>

		<hr class="layout">
	</div>
</div>

<jsp:include page="footer.jsp"/>

</body>
</html>