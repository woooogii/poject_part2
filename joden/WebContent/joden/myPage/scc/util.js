var Basket = {
	    /**
	     * 장바구니 수량 체크
	     */
	    initCheckStock: function() {
	        if (aBasketProductData.length > 0 && EC$("[id^=basket_prod_id]").length >0) {
	            var aParam = {};
	            var count = 0;
	            for (var i=0,n=aBasketProductData.length; i < n; i++) {
	                aParam["selected_item["+count+"]"] = count + "||" + aBasketProductData[i].item_code;
	                count++;
	                // 세트 상품 확인
	                if (aBasketProductData[i].set_product_list) {
	                    var setArrayLength =  aBasketProductData[i].set_product_list.length
	                    for (var j=0;j<setArrayLength;j++) {
	                        aParam["selected_item["+count+"]"] = count + "||" + aBasketProductData[i].set_product_list[j].item_code;
	                        count++;
	                    }
	                }
	            }
	            aParam['command'] = 'select_soldout';
	            this._callBasketAjax(aParam);
	        }
	    },

	    /***
	     * itemCode를 기반으로 프론트 상품이름 영역에 품절 표시
	     * @param array aSoldoutItemCode 품절된 itemCode
	     */
	    showSoldout: function (aSoldoutItemCode) {
	        for (var i=0; i<aBasketProductData.length; i++) {
	            var iCurItemCode = aBasketProductData[i].item_code;
	            var bCheck = false;
	            if (aSoldoutItemCode[iCurItemCode]) {
	                EC$('[id=basket_prod_id_'+i+']').append('<span> ['+__('SOLD.OUT', 'SHOP.FRONT.BASKET.JS') + ']</span>');
	                bCheck = true;
	            }
	            if (aBasketProductData[i].set_product_list) {
	                var setArrayLength =  aBasketProductData[i].set_product_list.length
	                for (var j=0;j<setArrayLength;j++) {
	                    var iSetCurItemCode =  aBasketProductData[i].set_product_list[j].item_code;
	                    if (aSoldoutItemCode[iSetCurItemCode] && bCheck === false) {
	                        EC$('[id=basket_prod_id_'+i+']').append('<span> ['+__('SOLD.OUT', 'SHOP.FRONT.BASKET.JS') + ']</span>');
	                        bCheck= true;
	                    }
	                }
	            }
	        }

	    },
	    /**
	     * '수정' 버튼 클릭
	     */
	    modifyQuantity: function(sId) {
	        // 수량 유효성 검사 (빈값, 숫자, 숫자가 1이상인지 체크)
	        if (this._checkQuantity() == false) {
	            alert(__('수량은 1 이상이어야 합니다.'));
	            return;
	        }

	        var aParam = {};
	        for (var i=0,n=aBasketProductData.length; i < n; i++) {
	            // index값 가져오기(변경버튼을 클릭했느냐 아니면 +/- 버튼을 클릭했는냐  판단을 위한 값임)
	            // index값이 있다는것은  +/- 버튼 클릭했을경우임.
	            if (bIsNewProduct == true && (typeof(sId) !== "undefined" && sId != null)) {
	                var iIndex = sId.split("_")[2];
	                if (isNaN(iIndex) == false && iIndex != i) {
	                    continue;
	                }
	            }

	            var iProdNo = aBasketProductData[i].product_no;
	            var iSetProdNo = aBasketProductData[i].set_product_no;
	            var sOptId = aBasketProductData[i].opt_id;
	            var bOptAdd = aBasketProductData[i].option_add;
	            var iOldQty = aBasketProductData[i].quantity;
	            var iCheckQty = aBasketProductData[i].check_quantity;
	            var sIsSetProduct = (iSetProdNo > 0) ? 'T' : 'F';
	            var sIsBenefitEventProduct = aBasketProductData[i].sIsBenefitEventProduct;
	            var iCustomDataIdx = aBasketProductData[i].custom_data_idx;
	            var sDelvType = aBasketProductData[i].delvtype;

	            // 1+N 상품의 경우 수량 옵션 등 변경 불가.
	            if (sIsBenefitEventProduct == 'T') {
	                continue;
	            }

	            if (bOptAdd == "T" && EC$('#quantity_id_'+i).val() != iOldQty && iCustomDataIdx == null) {
	                alert(__('사용자 지정 옵션 상품은 수량 변경이 불가능합니다.'));
	                EC$('#quantity_id_'+i).val(iOldQty);
	                return;
	            }

	            //aParam['prod_id'+i] = iProdNo + ':' + sOptId + ':'+ iSetProdNo;
	            aParam['prod_id'+i] = iProdNo + ':' + sOptId + ':'+ iSetProdNo + ':'+ sDelvType;
	            aParam['quantity'+i] = EC$('#quantity_id_'+i).val();
	            aParam['custom_data_idx'+i] = iCustomDataIdx;

	            // 뉴상품 재고체크 로직 태우기위한 파리미터(변경버튼 클릭시)
	            try {
	                if (isNaN(iIndex)) {
	                    aParam["selected_item["+i+"]"] = aParam['quantity'+i] + "||" + aBasketProductData[i].item_code;
	                }
	            } catch (e) {}

	            // 뉴상품일경우 구매주문단위 유효성 체크(현재수량에서 +/- 값이 구매단위로 이루어졌는지)
	            // 추가 최소 구매 수량 체크 , 최대 주문수량 체크
	            if (bIsNewProduct) {
	                var iQuantity = parseInt(EC$('#quantity_id_'+i).val(), 10);
	                var iBuyUnit = this.getBuyUnit(i);
	                if ((iQuantity % iBuyUnit) > 0 && aBasketProductData[i].check_buy_unit_type == 'O') {
	                    alert(sprintf(__('구매 주문단위는 %s개 입니다.')
	                            , iBuyUnit));
	                    EC$('#quantity_id_'+i).val(iOldQty);
	                    return;
	                }

	                // (체크해야할 수량(상품/품목) - 수량변경전 품목의 수량) + 변경한 수량
	                iQuantity = (iCheckQty - iOldQty) + iQuantity;

	                var iMin = parseInt(aBasketProductData[i].product_min);
	                var iMax = parseInt(aBasketProductData[i].product_max);
	                if (iCheckQty < iMin && iQuantity > iCheckQty) {
	                    // DB에 저장된 값이 이미 최소수량보다 적게 들어갔을 때
	                    // 그리고 수정하려는 값이 DB에 저장된 값보다 클 경우에만 (수량 증가할 때)
	                    // 수량 변경을 처리해준다.
	                    // 장바구니 구매 시도시에 잘못된 수량을 한 번 더 걸러낸다.
	                } else {
	                    if (iQuantity < iMin && iMin > 0 && aBasketProductData[i].check_quantity_type == 'O') {
	                        alert(sprintf(__('최소 주문수량은 %s개 입니다.'), iMin));
	                        EC$('#quantity_id_'+i).val(iOldQty);
	                        return;
	                    }
	                }
	                if (iCheckQty > iMax && iQuantity < iCheckQty) {
	                    // DB에 저장된 값이 이미 최대값 보다 클때. 수량 변경을 허용한다.
	                    // 그리고 수정하려는 값이 DB에 저장된 값보다 작을때 (수량 감소할 때)
	                    // 장바구니 구매 시도시에 잘못된 수량을 한 번 더 걸러낸다.
	                } else {
	                    if (aBasketProductData[i].product_max_type == 'T' && iQuantity > iMax && iMax > 0 && aBasketProductData[i].check_quantity_type == 'O') {
	                        alert(sprintf(__('최대 주문수량은 %s개 입니다.'), iMax));
	                        EC$('#quantity_id_'+i).val(iOldQty);
	                        return;
	                    }
	                }
	            }

	            if (typeof ACEWrap !== 'undefined') {
	                ACEWrap.modQuantity(iProdNo, aParam['quantity'+i]);
	            }
	        }

	        aParam['command'] = 'update';
	        aParam['num_of_prod'] = aBasketProductData.length;

	        // 최소/최대 구매수량 체크
	        // 전체 체크는 이 위치에서 수행할 필요가?
	        if (bIsNewProduct == false) {
	            if (this.isAbleQuantityForMaxMin(true) == false) {
	                return;
	            }
	        }

	        // for new product
	        try {
	            // iIndex값이 유효한 경우는 '+/-' 버튼을 클릭한 경우임.
	            if (isNaN(iIndex) == false) {
	                aParam["product_no"] = aBasketProductData[iIndex].product_no;
	                aParam["set_product_no"] = aBasketProductData[iIndex].set_product_no;
	                aParam["main_cate_no"] = aBasketProductData[iIndex].main_cate_no;
	                aParam["option_type"] = aBasketProductData[iIndex].option_type;
	                aParam["product_price"] = aBasketProductData[iIndex].product_price;
	                aParam["has_option"] = aBasketProductData[iIndex].has_option;
	                aParam["selected_item["+iIndex+"]"] = aParam['quantity'+iIndex] + "||" + aBasketProductData[iIndex].item_code;
	                aParam["basket_prd_no"] = aBasketProductData[iIndex].basket_prd_no;
	                aParam["custom_data_idx"] = aBasketProductData[iIndex].custom_data_idx;
	                //console.log(aParam["custom_data_idx"]);
	            }
	        } catch (e) {}
	        // 배송유형
	        if (sBasketDelvType != undefined && sBasketDelvType != '') {
	            aParam["delvtype"] = sBasketDelvType;
	        }

	        this._callBasketAjax(aParam);

	        // 세션스토리지 BasketProduct 캐시 삭제
	        EC$(function() {
	            try {
	                CAPP_ASYNC_METHODS.BasketProduct.removeCache();
	            } catch (e) {
	            }
	        });
	    },

	    /**
	     * ECHOSTING-14079, selee01
	     * '옵션변경' 버튼 클릭시 레이어보기
	     * @param sId: 변경시킬 폼 id
	     */
	    showLayer: function(sId) {
	        EC$('[id^="optModify_id_"]').each(function() {
	            EC$('[id^="optModify_id_"]').hide();
	        });

	        EC$('#'+sId).parents('.prdInfo').first().css({'zIndex': 2});
	        EC$('#'+sId).parents('.prdInfo').first().siblings('.prdInfo').css({'zIndex': 1});
	        EC$('#'+sId).show();
	    },

	    closeLayer: function(sId) {
	        EC$('#'+sId).hide();
	    },

	    /**
	     * '옵션변경'레이어에서 '적용하기' 버튼 클릭
	     */
	    modifyOption: function(sIdx) {

	        // 구상품 모바일 스킨을 사용하는 뉴상품몰에서 옵션변경 오류 수정 - (ECHOSTING-94860, by wcchoi)
	        if (mobileWeb && bIsNewProduct) {
	            BasketNew.modify(sIdx, 'modify'); // 뉴상품용으로 호출
	            return;
	        }

	        //필수옵션 체크
	        if (this.checkOptionRequired() == false) return;

	        //추가옵션 체크
	        if (this.checkAddOption() == false) return;

	        var aParam = {};
	        var aOptionStr = [];
	        var aAddOption = [];
	        var aAdd_option_name = [];
	        var aAdd_option = [];

	        var iPrdNo = aBasketProductData[sIdx].product_no; //상품번호

	        var old_opt_id = aBasketProductData[sIdx].opt_id; //basket_product 업데이트할때 where 조건으로 필요해서
	        var aOptId = (aBasketProductData[sIdx].opt_id + '').split('-'); //옵션아이디

	        var iCnt = 0;

	        var aSelectedValue = [];

	        EC$('select[id^="product_option_id"]:visible').each(function() {
	            if (EC$(this).prop('required') === true) {
	                aParam['opt_title'] = EC$(this).attr('option_title');
	            }
	            var iSelectedIndex = EC$(this).get(0).selectedIndex;
	            if (EC$(this).prop('required') && iSelectedIndex > 0) iSelectedIndex -= 1;

	            aOptId[iCnt] = iSelectedIndex;

	            if (iSelectedIndex > 0) {
	                var sValue = EC$(this).find(':selected').val();
	                var aVal = sValue.split("|");
	                var sText = EC$(this).find(':selected').text();
	                aOptionStr.push(EC$(this).attr('option_title')+'='+sText);

	                aSelectedValue.push(sValue); // ECHOSTING-94860, by wcchoi
	            }
	            iCnt++;
	        });
	        var sOptId = aOptId.join('-'); //변경하려는 옵션아이디

	        for (var i=0,n=aBasketProductData.length; i < n; i++) {
	            var iProdNo = aBasketProductData[i].product_no;
	            var bOptAdd = aBasketProductData[i].option_add;
	            var iOldQty = aBasketProductData[i].quantity;
	            var sDelvType = aBasketProductData[i].delvtype;
	            if (bOptAdd == "T") {
	                alert(__("사용자 지정 옵션 상품은 옵션변경을 하실 수 없습니다."));
	                EC$('#quantity_id_'+i).val(iOldQty);
	                return;
	            }
	            //aParam['quantity'+i] = aBasketProductData[i].quantity;
	            if (i == sIdx) { // 옵션변경할 놈
	                /*aParam['prod_id'+i] = iProdNo + ':' + sOptId;
	                aParam['old_opt_id'+i] = old_opt_id;*/
	                //aParam['prod_id'] = iProdNo + ':' + sOptId;
	                aParam['prod_id'] = iProdNo + ':' + sOptId + '::'+ sDelvType;
	                aParam['old_opt_id'] = old_opt_id;
	                aParam['quantity'] = aBasketProductData[i].quantity;
	            }
	            /*else {
	                var sOptionId  = aBasketProductData[i].opt_id;
	                aParam['prod_id'+i]  = iProdNo + ':' + sOptionId;
	                aParam['old_opt_id'+i] = sOptionId;
	            }*/
	        }
	        aParam['opt_str'] = aOptionStr.join(',');

	        EC$('input[id^="add_option"]:visible').each(function() {
	            //aAddOption.push(EC$(this).attr('name')+'='+ EC$(this).val()+';');
	            aAdd_option_name.push(EC$(this).attr('name'));
	            aAdd_option.push(EC$(this).val());
	        });
	        /*aParam['option_add'+sIdx] = aAdd_option;
	        aParam['add_option_name'+sIdx] = aAdd_option_name.join(';');*/
	        aParam['option_add'] = aAdd_option;
	        aParam['add_option_name'] = aAdd_option_name.join(';');

	        aParam['command'] = 'update';
	        aParam['option_change'] = 'T';
	        aParam['num_of_prod'] = 1;

	        this._callBasketAjax(aParam);
	    },

	    /**
	     * 필수옵션 체크 여부
	     * @return bool true: 체크 / false: 체크안함
	     */
	    checkOptionRequired: function() {
	        var bResult = true;
	        EC$('select[id^="product_option_id"]:visible').each(function() {
	            if (EC$(this).prop('required')) {
	                if (EC$('option:selected', this).val().indexOf('*') > -1) {
	                    alert(__('필수 옵션을 선택해주세요.'));
	                    EC$(this).focus();
	                    bResult = false;
	                    return false;
	                }
	            }
	        });
	        return bResult;
	    },


	    /**
	     * 추가옵션 체크
	     * @return bool true: 추가옵션이 다 입력되었으면 / false: 아니면
	     */
	    checkAddOption: function() {
	        var bResult = true;
	        EC$('[id^="add_option"]:visible').each(function() {
	            var oThis = EC$(this);

	            // 선택항목인 경우
	            if (oThis.attr('require') === 'F') {
	                return;
	            }

	            if (oThis.val().replace(/^[\s]+[\s]+$/g, '').length == 0) {
	                alert(__('추가 옵션을 입력해주세요.'));
	                oThis.focus();
	                bResult = false;
	            }
	        });
	        return bResult;
	    },


	    /**
	     * '주문하기' 버튼 클릭 (구스킨 선택한상품 주문시 사용)
	     * @param sProductType normal_type, installment_type
	     * @param object 클릭한 element 객체
	     */
	    orderBasket: function(sProductType, oElem) {
	        if (this._existsChecked(true) == false) return;

	        // 타입에 맞게 선택된 상품 체크
	        var aCheckedProduct = [];
	        var bSelected = false;
	        var aProdList = this._getCheckedProduct();
	        for (var i=0,n=aProdList.length; i < n; i++) {
	            var iSeq = aProdList[i].seq;
	            if (aBasketProductData[iSeq].product_type != sProductType) continue;

	            aCheckedProduct.push(aProdList[i].val);
	            bSelected = true;
	        }

	        if (bSelected == false) {
	            alert(__('선택된 상품이 없습니다.'));
	            return;
	        }

	        //최소/최대 구매수량 체크
	        if (this.isAbleQuantityForMaxMin(false) == false) {
	            return;
	        }

	        this._callOrderAjax({
	            checked_product: aCheckedProduct.join(','),
	            basket_type: this._getBasketType(sProductType)
	        }, oElem);
	    },

	    /**
	     * '견적서 출력' 버튼 클릭
	     * @param object 클릭한 element 객체
	     */
	    estimatePrint: function(oElem) {
	        if (this._existsBasket(true) == false) return;
	        var sPopupLink = EC$(oElem).attr('link');
	        if (!sPopupLink || sPopupLink.length<1) sPopupLink = '/estimate/userform.html';

	        // 구상품에서 sBasketDelvType - ECHOSTING-92787, by wcchoi
	        var _delvtype = sBasketDelvType;
	        if (_delvtype == '' && aBasketProductData.length > 0) {
	            _delvtype = aBasketProductData[0].delvtype;
	        }

	        //선택한 상품
	        var checked_product = this._getCheckedProductList().join(',');
	        //견적서에서 할인 재계산 여부
	        var discount_recalc = 'F';
	        if (bCheckedProductCalc !== true) { //장바구니에 재계산 적용 기능이 안되어 있으면, 견적서에서 재계산 필요함.
	            discount_recalc = 'T';
	        }

	        if (sPopupLink.indexOf('?') == -1) sPopupLink += '?delvtype=' + _delvtype;
	        else sPopupLink += '&delvtype=' + _delvtype;

	        //견적서에서 할인 재계산 여부
	        sPopupLink += '&discount_recalc='+discount_recalc;
	        //전체선택 여부
	        sPopupLink += '&all_checked='+sAllChecked;
	        //선택한 상품만 적용되도록
	        sPopupLink += '&checked_product='+checked_product;

	        var option = "toolbar=no," + "location=0," + "directories=0," +
	                     "status=0," + "menubar=0," + "scrollbars=1," +
	                     "resizable=1," + "width=600," + "height=500," +
	                     "top=50," + "left=200";

	        window.open(sPopupLink, "online_estimate_print_pop", option);
	    },

	    /**
	     * '장바구니 비우기' 버튼 클릭
	     */
	    emptyBasket: function() {
	        if (this._existsBasket(true) == false) return;
	        if (confirm(__('장바구니를 비우시겠습니까?')) == false) return;

	        if (typeof ACEWrap !== 'undefined') {
	            ACEWrap.delAllBasket();
	        }

	        this._callBasketAjax({command: 'delete', delvtype: sBasketDelvType});
	    },

	    /**
	     * '선택상품 삭제' 버튼 클릭
	     */
	    deleteBasket: function() {
	        if (this._existsBasket(true) == false) return;
	        if (this._existsChecked(true) == false) return;
	        if (confirm(__('선택하신 상품을 삭제하시겠습니까?')) == false) return;

	        if (typeof ACEWrap !== 'undefined') {
	            ACEWrap.delCheckedBasket();
	        }

	        this._callBasketAjax({
	            command: 'select_delete',
	            checked_product: this._getCheckedProductList().join(','),
	            delvtype: sBasketDelvType
	        });
	    },

	    /**
	     * '관심상품 담기' 버튼 클릭
	     */
	    addWishList: function() {
	        if (this._existsBasket(true) == false) return;
	        if (this._existsChecked(true) == false) return;

	        try {
	            var aProdList = this._getCheckedProduct();

	            if (bIsNewProduct === true) {
	                window.bIsAddWishListCall = true;

	                for (var i=0, n=aProdList.length; i<n; i++) {
	                    BasketNew.moveWish(aProdList[i].seq);
	                }

	                location.href = '/myshop/wish_list.html';
	                return false;
	            } else {
	                var sOptionType = '';
	                for (var i=0,n=aProdList.length; i < n; i++) {
	                    if (aProdList[i].option_type == 'F') {
	                        sOptionType = aProdList[i].option_type;
	                    }
	                }
	            }
	        } catch (e) {}

	        if (bIsNewProduct === false) {
	            this._callBasketAjax({
	                command: 'select_storage',
	                checked_product: this._getCheckedProductList().join(","),
	                delvtype: sBasketDelvType,
	                option_type: sOptionType // 단독 구성 옵션 상품/품목이 하나라도 있는 경우 'F' 를 보냄
	            });
	        }
	    },

	    /**
	     * '해외배송상품 장바구니로 이동' 버튼 클릭
	     */
	    moveOversea: function() {
	        if (this._existsBasket(true) == false) return;
	        if (this._existsChecked(true) == false) return;
	        try {
	            var aProdList = this._getCheckedProduct();
	            var iOnlyDomestic = 0;
	            var iAbleOversea = 0;
	            var sOptionType = '';
	            for (var i=0,n=aProdList.length; i < n; i++) {
	                if (aProdList[i].is_oversea_able == true) {
	                    iAbleOversea++;
	                } else {
	                    iOnlyDomestic++;
	                }
	                if (aProdList[i].option_type == 'F') {
	                    sOptionType = aProdList[i].option_type;
	                }
	            }

	            // 국내배송만 가능한경우
	            if (iAbleOversea == 0) {
	                alert(__('국내배송상품은 해외배송상품 장바구니로 이동이 불가능합니다.'));
	                return;
	            }

	            // 국내배송 + 해외배송 상품이 섞여있는 경우
	            if (iAbleOversea > 0 && iOnlyDomestic > 0) {
	                alert(__('국내배송상품이 포함되어 있어 해외배송상품 장바구니로 이동이 불가능합니다.'));
	                return;
	            }

	            var bConfirm = confirm(__('선택하신 상품을 해외배송상품 장바구니로 이동하시겠습니까?'));
	            if (bConfirm == false) {
	                return;
	            }
	        } catch (e) {}

	        var sRedirectUrl = location.pathname + '?delvtype=B';

	        this._callBasketAjax({
	            command: 'move_oversea',
	            checked_product: this._getCheckedProductList().join(','),
	            option_type: sOptionType // 단독 구성 옵션 상품/품목이 하나라도 있는 경우 'F' 를 보냄
	        }, sRedirectUrl);
	    },

	    /**
	     * 국내배송 장바구니
	     */
	    goDomesticBasket: function() {
	        var sRedirectUrl = location.pathname;
	        //랜딩결제 : ch_ref 붙여주기
	        sRedirectUrl = CAFE24.attachChRef(sRedirectUrl);
	        window.location.href = sRedirectUrl;
	        return false;
	    },

	    /**
	     * 해외배송 장바구니
	     */
	    goOverseaBasket: function() {
	        var sRedirectUrl = location.pathname + '?delvtype=B';
	        //랜딩결제 : ch_ref 붙여주기
	        sRedirectUrl = CAFE24.attachChRef(sRedirectUrl);
	        window.location.href = sRedirectUrl;
	        return false;
	    },

	    /**
	     * 상품조르기
	     * @param string sMemberId 회원아이디
	     */
	    hopeProduct: function(sMemberId) {
	        if (sMemberId == '') {
	            window.location.href = '/member/login.html';
	            return false;
	        }


	        if (this._existsBasket(true) == false) return false;
	        if (this._existsChecked(true) == false) return false;

	        // 선택 상품번호 추출
	        var aPrdInfo = this._getCheckedProduct();
	        var aProductNo = [];
	        for (var i=0, length = aPrdInfo.length; i < length; i++) {
	            aProductNo.push('product_no[]=' + aPrdInfo[i].product_no + ':' + aPrdInfo[i].set_product_no);
	        }

	        // 상품조르기 페이지 호출
	        window.open('/product/request.html?' + aProductNo.join('&'), "상품조르기", "width=700,height=1000");
	        return false;
	    },


	    /**
	     * 모듈(패키징)단위로 체크박스 선택
	     * @param sBoxName
	     */
	    setModuleCheckBasketList: function(sBoxName) {

	        EC$('[id^="'+ BASKET_CHK_ID_PREFIX +'"]').each(function() {
	            if (EC$(this).is(':checked')) {
	                var sId = EC$(this).attr('id');
	                var sName = EC$(this).attr('name');
	                if (sBoxName != sName) {
	                    EC$(this).prop('checked', false);
	                }
	            }
	        });

	    },
	    /**
	     * 모듈(패키징)단위로 선택구매
	     * @param sBoxName
	     * @param oElem
	     */
	    orderSelectSuppBasket: function(sBoxName,oElem) {

	        this.setModuleCheckBasketList(sBoxName);
	        this.orderSelectBasket(oElem);

	    },
	    /**
	     * 모둘(패키징)단위로 선택삭제
	     * @param sBoxName
	     * @param oElem
	     */
	    deleteSuppBasket: function(sBoxName,oElem) {

	        this.setModuleCheckBasketList(sBoxName);
	        this.deleteBasket();

	    },
	    /**
	     * 모듈(패키징)단위로 전체구매
	     * @param sBoxName
	     * @param oElem
	     */
	    orderSuppAll: function(sBoxName,oElem) {

	        EC$('[id^="'+ BASKET_CHK_ID_PREFIX +'"]').each(function() {
	            sName = (EC$(this).attr('name'));
	            if (sBoxName != sName) {
	                EC$(this).prop('checked', false);
	            } else {
	                EC$(this).prop('checked', true);
	            }
	        });
	        this.orderSelectBasket(oElem);

	    },

	    /**
	     * '전체상품 주문' 버튼 클릭
	     * @param object 클릭한 element 객체
	     */
	    orderAll: function(oElem) {
	        EC$("input[id^='basket_chk_id']").each(function() {
	            EC$(this).prop('checked', true);
	        });

	        if (!this.orderSelectBasket(oElem, 'all_buy')) {
	            EC$("input[id^='basket_chk_id']").each(function() {
	                EC$(this).prop('checked', false);
	            });
	        }

	        return;
	        /* 국내,해외 동시활성화에 따라 디자인 하위호환성을 위해 */


	        if (this._existsBasket(true) == false) return;

	        // 최소,최대 주문가능 수량 체크
	        if (this.isAbleQuantityForMaxMin(true) == false) {
	            return;
	        }

	        if (this._chkInstallment() == false)
	        {
	            return;
	        }

	        this._callOrderAjax({basket_type: 'all_buy'}, oElem);
	    },

	    /**
	     * 모듈(패키징)단위로 체크박스 선택
	     * @param sBoxName
	     */
	    setModuleCheckBasketList: function(sBoxName) {

	        EC$('[id^="'+ BASKET_CHK_ID_PREFIX +'"]').each(function() {
	            if (EC$(this).is(':checked')) {
	                var sId = EC$(this).attr('id');
	                var sName = EC$(this).attr('name');
	                if (sBoxName != sName) {
	                    EC$(this).prop('checked', false);
	                }
	            }
	        });

	    },
	    /**
	     * 모듈(패키징)단위로 선택구매
	     * @param sBoxName
	     * @param oElem
	     */
	    orderSelectSuppBasket: function(sBoxName,oElem) {

	        this.setModuleCheckBasketList(sBoxName);
	        this.orderSelectBasket(oElem);

	    },
	    /**
	     * 모둘(패키징)단위로 선택삭제
	     * @param sBoxName
	     * @param oElem
	     */
	    deleteSuppBasket: function(sBoxName,oElem) {

	        this.setModuleCheckBasketList(sBoxName);
	        this.deleteBasket();

	    },
	    /**
	     * 모듈(패키징)단위로 전체구매
	     * @param sBoxName
	     * @param oElem
	     */
	    orderSuppAll: function(sBoxName,oElem) {

	        EC$('[id^="'+ BASKET_CHK_ID_PREFIX +'"]').each(function() {
	            sName = (EC$(this).attr('name'));
	            if (sBoxName != sName) {
	                EC$(this).prop('checked', false);
	            } else {
	                EC$(this).prop('checked', true);
	            }
	        });
	        this.orderSelectBasket(oElem);

	    },

	    /**
	     * '전체상품 주문' 버튼 클릭
	     * @param object 클릭한 element 객체
	     */
	    orderLayerAll: function(oElem) {

	        this._callOrderAjax({basket_type: 'all_buy'}, oElem);
	    },

	    /**
	     * 무이자 할부를 적용받을 수 없는경우의 컨펌
	     */
	    _chkInstallment: function()
	    {


	        return confirm(__("일반상품과 무이자 할부상품을 동시에 구매할경우 무이자 할부가 적용되지 않습니다.\n\n") +
	                __("단, 카드사에서 진행하는 무이자할부 기간에는 전체주문 총 금액에 대해 무이자 할부가 적용됩니다.\n\n") +
	                __("주문하시겠습니까?"));
	    },

	    /**
	     * '선택상품 주문하기'(장바구니 타입 제한없음) 버튼 클릭
	     * @param sProductType normal_type, installment_type
	     * @param object 클릭한 element 객체
	     * @return bool
	     */
	    orderSelectBasket: function(oElem, sBasketType, sType, res)
	    {
	        if (this._existsChecked(true) == false) return false;
	        if (this._chkMixedBasketType() === true) {
	            if (this._chkInstallment() == false) {
	                return false;
	            }
	        }
	        var aCheckedProduct = [];
	        var bSelected = false;
	        var aProdList = this._getCheckedProduct();

	        for (var i=0,n=aProdList.length; i < n; i++) {
	            var iSeq = aProdList[i].seq;
	            aCheckedProduct.push(aProdList[i].val);
	            bSelected = true;
	        }

	        if (bSelected == false) {
	            alert(__('선택된 상품이 없습니다.'));
	            return false;
	        }

	        // 최소,최대 주문가능 수량 체크
	        if (this.isAbleQuantityForMaxMin(false) == false) {
	            return false;
	        }

	        // 상품별 결제수단 체크 - (ECHOSTING-75708, by wcchoi)
	        if (! this._isValidProductPaymethod(aProdList)) {
	            alert(__('주문 상품에 대하여 함께 결제할 수 없습니다. 상품의 결제수단을 확인해 주세요.'));
	            return;
	        }

	        // 정기배송 + 1회 구매 섞여있는지 체크
	        if (! this._isValidProductSubscription(aProdList)) {
	            alert(__('NOT.PURCHASED.TOGETHER', 'SHOP.FRONT.BASKET.JS')); //정기배송 상품과 1회구매 상품은 함께 구매할 수 없습니다. 상품을 다시 선택해주세요.
	            return;
	        }

	        // 단독구매 상품 Validation
	        var sMsg = this._isSideProductValidation(aProdList);
	        if (sMsg !== undefined) {
	            alert(sprintf(__('PRODUCT.MARKED.ITEMS', 'SHOP.FRONT.BASKET.JS'), sMsg));
	            return;
	        }

	        this._callOrderAjax({
	            checked_product : aCheckedProduct.join(','),
	            basket_type     : sBasketType,
	            delvtype : sBasketDelvType
	        }, oElem, sType, res);

	        return true;
	    },
	    /**
	     * 상품별 결제수단 체크 - (ECHOSTING-75708, by wcchoi)
	     */
	    _isValidProductPaymethod: function(aProdList)
	    {
	        if (bIsNewProduct == false) return true; // 뉴상품
	        if (sUsePaymentMethodPerProduct != 'T') return true;

	        var aList = [];
	        for (var i=0,n=aProdList.length; i < n; i++) {
	            var _paymethod = CAFE24.UTIL.trim(aBasketProductData[aProdList[i].seq].product_paymethod);
	            if (_paymethod == '') return false; // 결제수단이 없는 상품이 존재하면 주문 불가

	            aList.push(_paymethod.split(','));
	        }

	        return (this._intersectAll(aList).length > 0);
	    },

	    /**
	     * 단독구매 상품 Validation
	     *
	     * @param aProdList
	     * @returns {string}
	     * @private
	     */
	    _isSideProductValidation: function(aProdList)
	    {
	        var sMsg = '';
	        var bNormalCheck = false;
	        var aProductCheck = [];

	        for (var i=0,n=aProdList.length; i < n; i++) {
	            var aProduct = aBasketProductData[aProdList[i].seq];

	            // is_side_product값이 O 이면 단독구매 상품
	            if (aProduct.is_side_product == 'O') {
	                sMsg += '\n- '+aProduct.product_name;

	                // 단독구매 상품 갯수를 추출하기 위해 배열 할당
	                if (aProductCheck.indexOf(aProduct.product_no) == -1) {
	                    aProductCheck.push(aProduct.product_no);
	                }
	            } else {
	                bNormalCheck = true;
	            }
	        }

	        // 단독구매 상품과 일반상품이 있는경우 || 단독구매상품은 1개만 구매 가능
	        if ((sMsg !== '' && bNormalCheck === true) || aProductCheck.length > 1) {
	            return sMsg;
	        }
	    },

	    /**
	     * 정기배송 + 1회 구매 섞여있는지 체크
	     */
	    _isValidProductSubscription: function(aProdList)
	    {
	        if (bIsNewProduct == false) return true; // 뉴상품

	        var aList = [];
	        for (var i=0,n=aProdList.length; i < n; i++) {
	            var _subscription = CAFE24.UTIL.trim(aBasketProductData[aProdList[i].seq].is_subscription);
	            aList.push(_subscription);
	        }

	        return (this._intersectAll(aList).length > 0);
	    },

	    /**
	     * multiple arrays intersection
	     */
	    _intersectAll: function(aList)
	    {
	        if (aList.length == 0) return [];
	        if (aList.length == 1) return aList[0];

	        // 2 arrays intersection
	        var _intersect = function(arr1, arr2) {
	            var r = [], o = {}, l = arr2.length, i, v;
	            for (i = 0; i < l; i++) { o[arr2[i]] = true; }
	            l = arr1.length;
	            for (i = 0; i < l; i++) {
	                v = arr1[i];
	                if (v in o) r.push(v);
	            }
	            return r;
	        };

	        var partialInt = aList[0];
	        for (var i = 1; i < aList.length; i++) {
	            partialInt = _intersect(partialInt, aList[i]);
	        }

	        return partialInt;
	    },

	    /**
	     * 네이버 페이 주문
	     */
	    orderNaverCheckout: function()
	    {
	        if (this._existsBasket(true) == false) return;

	        if (this._existsInstallmentType() == true) {
	            if (!confirm(__("네이버 페이 구매시 무이자혜택을 받을 수 없습니다."))) {
	                return;
	            }
	        }

	        this._checkoutcallOrderAjax({basket_type: 'all_buy',navercheckout_flag: 'T'});

	        var sUrl = '/exec/front/order/navercheckout?sType=basket';

	        // inflow param from naver common JS to Checkout Service
	        try {
	            if (typeof(wcs) === 'object') {
	                var inflowParam = wcs.getMileageInfo();
	                if (inflowParam != false) {
	                    sUrl = sUrl + '&naver_inflow_param=' + inflowParam;
	                }
	            }
	        } catch (e) {}

	        if (is_order_page == 'N' && bIsMobile == false) {
	            window.open(sUrl);
	            return false;
	        } else {
	            location.href = sUrl;
	            return false;
	        }
	    },
	    /**
	     * 간편결제수단 "카카오페이" 가 세팅이 된 주문서로 이동
	     */
	    orderEasyKakaopay: function () {
	        if (this._existsBasket(true) == false) return;

	        this._callOrderAjax({basket_type: "all_buy", paymethod: "kakaopay", only_one_paymethod: "T"}, this);
	    },

	    /**
	     * 쇼핑계속하기
	     */
	    continueShopping: function(oElem) {
	        var sLink = EC$(oElem).attr('link') || '/';
	        location.href = sLink;
	    },

	    /**
	     * 수량 유효성 체크(1 이상의 수)
	     * @return bool 1이상이면 ? TRUE : FALSE
	     */
	    _checkQuantity: function() {
	        var bReturn = true;
	        EC$('[id^="quantity_id_"]').each(function() {
	            var iQnty = CAFE24.UTIL.trim(EC$(this).val());
	            EC$(this).val(iQnty);

	            if (isNaN(iQnty) == true || iQnty < 1) {
	                EC$(this).select();
	                bReturn = false;
	                return false;
	            }
	        });

	        return bReturn;
	    },

	    /**
	     * 체크된 상품 정보 가져오기
	     * @return array 체크된 상품 정보
	     */
	    _getCheckedProduct: function() {
	        var aData = [];
	        EC$('[id^="'+ BASKET_CHK_ID_PREFIX +'"]').each(function() {

	            if (EC$(this).is(':checked')) {
	                var iSeq = EC$(this).attr('id').replace(BASKET_CHK_ID_PREFIX, '');
	                var iProdNo = aBasketProductData[iSeq].product_no;
	                var iSetProdNo = aBasketProductData[iSeq].set_product_no;
	                var iBpPrdNo = aBasketProductData[iSeq].basket_prd_no;
	                var sOptId = aBasketProductData[iSeq].opt_id;
	                var sIsSubscription = aBasketProductData[iSeq].is_subscription;
	                var bIsOverseaAble = true;
	                var sIsSetProduct = 'F';
	                var sOptionType = '';
	                var iCustomDataIdx = aBasketProductData[iSeq].custom_data_idx;
	                var sDelvType = aBasketProductData[iSeq].delvtype;

	                try {
	                    if (aBasketProductData[iSeq].is_oversea_able != undefined) {
	                        bIsOverseaAble = aBasketProductData[iSeq].is_oversea_able;
	                    }
	                } catch (e) {}
	                try {
	                    if (aBasketProductData[iSeq].option_type != undefined) {
	                        // 단독구성 옵션일 경우 'F'
	                        sOptionType = aBasketProductData[iSeq].option_type;
	                    }
	                } catch (e) {}

	                if (iSetProdNo > 0) {
	                    sIsSetProduct = 'T';
	                } else {
	                    sIsSetProduct = 'F';
	                }

	                aData.push({
	                   seq: iSeq,
	                   val: iProdNo + ':' + sOptId + ':' + sIsSetProduct + ':' + iBpPrdNo + ':' + iCustomDataIdx + ':' + sDelvType,
	                   product_no: iProdNo,
	                   is_oversea_able: bIsOverseaAble,
	                   option_type: sOptionType,
	                   set_product_no: iSetProdNo,
	                   is_subscription: sIsSubscription
	                });
	            }
	        });

	        return aData;
	    },

	    /**
	     * 전체 상품 정보 가져오기
	     * @return array 체크된 상품 정보
	     */
	    _getAllProduct: function() {
	        var aData = [];
	        EC$('[id^="'+ BASKET_CHK_ID_PREFIX +'"]').each(function() {
	            var iSeq = EC$(this).attr('id').replace(BASKET_CHK_ID_PREFIX, '');
	            var iProdNo = aBasketProductData[iSeq].product_no;
	            var sOptId = aBasketProductData[iSeq].opt_id;
	            aData.push({
	               seq: iSeq,
	               val: iProdNo + ':' + sOptId,
	            });
	        });

	        return aData;
	    },

	    /**
	     * 체크된 상품 정보 Array 가져오기
	     * @return array 체크된 상품 정보
	     */
	    _getCheckedProductList: function() {
	        var aCheckedList = [];
	        var aProdList = this._getCheckedProduct();
	        for (var i=0,n=aProdList.length; i < n; i++) {
	            aCheckedList.push(aProdList[i].val);
	        }

	        return aCheckedList;
	    },

	    /**
	     * basket_type 가져오기
	     * @param string product_type (normal_type, installment_type)
	     * @return string basket_type(A0000, A0001)
	     */
	    _getBasketType: function(sProductType) {
	        return (sProductType == 'installment_type') ? 'A0001' : 'A0000';
	    },

	    /**
	     * 장바구니 상품 중 하나 이상 체크가 되어 있는지
	     * @param bool bAlert 얼럿메세지 여부
	     * @return bool 하나 이상 체크 ? true : false
	     */
	    _existsChecked: function(bAlert) {
	        if (this._getCheckedProduct().length > 0) return true;

	        if (bAlert) alert(__('선택된 상품이 없습니다.'));
	        return false;
	    },

	    /**
	     * 장바구니 상품이 존재하는지 체크
	     * @param bool bAlert 얼럿메세지 여부
	     * @return bool 상품이 1개 이상 있으면 true, 없으면 false
	     */
	    _existsBasket: function(bAlert) {
	        if (aBasketProductData.length > 0) return true;

	        if (bAlert) alert(__('상품이 없습니다.'));
	        return false;
	    },

	    /**
	     * 상품 중 '무이자할부' 타입이 있는지 체크
	     * @return bool 있으면 ? TRUE : FALSE
	     */
	    _existsInstallmentType: function() {
	        for (var i=0,n=aBasketProductData.length; i < n; i++) {
	            if (aBasketProductData[i].product_type == 'installment_type') return true;
	        }
	        return false;
	    },

	    /**
	     * '무이자할부' 상품과 그냥상품 섞여있는지
	     * @return bool 있으면 ? TRUE : FALSE
	     */
	    _isMixedProductForInstallmentType: function() {
	        var iNormalPrdCnt = 0;
	        var iInstPrdCnt = 0;
	        for (var i=0,n=aBasketProductData.length; i < n; i++) {
	            if (aBasketProductData[i].product_type == 'installment_type') {
	                iInstPrdCnt++;
	            } else {
	                iNormalPrdCnt++;
	            }
	        }

	        // 무이자 상품과 일반상품이 섞여 있다면?
	        if (iInstPrdCnt > 0 && iNormalPrdCnt > 0) {
	            return true;
	        }

	        return false;
	    },

	    /**
	     * 상품 중 무이자할부와 일반타입 상품이 섞인경우 체크
	     * @return bool 있으면 ? TRUE : FALSE
	     */
	    _chkMixedBasketType: function() {
	        var iInstallment = 0;
	        var iNormal = 0;
	        var aProdList = this._getCheckedProduct();
	        for (var i=0, n=aProdList.length; i<n; i++) {
	            var iSeq = aProdList[i].seq;
	            if (aBasketProductData[iSeq].product_type != 'installment_type') {
	                iInstallment++;
	            } else if (aBasketProductData[iSeq].product_type != 'normal_type') {
	                iNormal++;
	            }
	        }
	        if (iNormal > 0 && iInstallment > 0) {
	            return true;
	        } else {
	            return false;
	        }
	    },

	    /**
	     * 장바구니 command수행을 위한 ajax 호출
	     * @param array aParam post전송할 파라미터
	     * @param string sRedirectUrl redirect할 url
	     */
	    _callBasketAjax: function(aParam, sRedirectUrl) {

	        var sActionUrl = '/exec/front/order/basket/';
	        //랜딩결제 : ch_ref 붙여주기
	        aParam.ch_ref = CAFE24.getChRefData();
	        if (sRedirectUrl) {
	            sRedirectUrl = CAFE24.attachChRef(sRedirectUrl);
	        }

	        EC$.post(sActionUrl, aParam, function(data) {
	            Basket.isInProgressMigrationCartData(data);
	            if (data.result < 0) {
	                var msg = data.alertMSG.replace('\\n', '\n');
	                try {
	                    msg = decodeURIComponent(decodeURIComponent(msg));
	                } catch (err) {}
	                alert(msg);
	                // after 수량변경
	                if (aParam['command'] == 'update') {
	                    location.reload();
	                }

	                // 관심상품
	                if (aParam['command'] === 'select_storage') {
	                    if (typeof(data.isLogin) !== "undefined" && data.isLogin == "F") {
	                        sUrl = '/member/login.html';
	                        sUrl += '?returnUrl=' + encodeURIComponent("/order/basket.html?delvtype=" + aParam['delvtype']);
	                        location.href = sUrl;
	                        return false;
	                    }
	                    CAFE24.PLUSAPP_BRIDGE.addWishList(CAFE24.PLUSAPP_BRIDGE.getProductNo(aParam.checked_product));
	                    if (typeof CAFE24.KAKAO_PIXEL_BRIDGE !== 'undefined') {
	                        CAFE24.KAKAO_PIXEL_BRIDGE.addWishList(CAFE24.KAKAO_PIXEL_BRIDGE.getProductNo(aParam.checked_product));
	                    }
	                }
	                if (data.result == -113) {
	                    location.reload();
	                }
	            } else {
	                if (aParam['command'] === 'select_storage') {
	                    CAFE24.PLUSAPP_BRIDGE.addWishList(CAFE24.PLUSAPP_BRIDGE.getProductNo(aParam.checked_product));
	                    if (typeof CAFE24.KAKAO_PIXEL_BRIDGE !== 'undefined') {
	                        CAFE24.KAKAO_PIXEL_BRIDGE.addWishList(CAFE24.KAKAO_PIXEL_BRIDGE.getProductNo(aParam.checked_product));
	                    }

	                    alert(__('IT.BEEN.ADDED.WISH.LIST', 'SHOP.FRONT.BASKET.JS'));

	                    if (typeof (sViewWishListBasket) !== 'undefined' && sViewWishListBasket != 'T') {
	                        location.href = '/myshop/wish_list.html';
	                        return false;
	                    }
	                }
	                if (aParam['command'] === 'select_soldout') {
	                    Basket.showSoldout(data.aResultSoldoutItems.data);
	                    return;
	                }
	                (sRedirectUrl) ? location.href = sRedirectUrl : location.reload();
	            }
	        }, 'json');
	    },

	    /**
	     * 주문하기 (is_prd 업데이트 후 orderform으로 redirect)
	     * 비로그인 주문일 경우 noMember, returnUrl 파라미터 추가하여 로그인페이지로 이동
	     * @param array aParam post전송할 파라미터
	     * @param object 클릭한 element 객체
	     */
	    _callOrderAjax : function(aParam, oElem, sType, res) {
	        var sOrderUrl = EC$(oElem).attr('link-order') || '/order/orderform.html?basket_type=' + aParam.basket_type;

	        if (sBasketDelvType != "") {
	            sOrderUrl += '&delvtype=' + sBasketDelvType;
	        }
	        if (EC$(oElem).data('paymethod') != "" && EC$(oElem).data('paymethod') != undefined) {
	            sOrderUrl += '&paymethod=' + EC$(oElem).data('paymethod');
	        }

	        if (aParam.paymethod != "" && aParam.paymethod != undefined) {
	            sOrderUrl += '&paymethod=' + aParam.paymethod;
	        }

	        if (aParam.only_one_paymethod != "" && aParam.only_one_paymethod != undefined) {
	            sOrderUrl += '&only_one_paymethod=' + aParam.only_one_paymethod;
	        }

	        //랜딩결제 : ch_ref 붙여주기
	        var sChRef = CAFE24.getChRefData();
	        aParam.ch_ref = sChRef;
	        sOrderUrl = CAFE24.attachChRef(sOrderUrl);

	        var sLoginUrl = EC$(oElem).attr('link-login') || '/member/login.html';

	        EC$.post('/exec/front/order/order/', aParam, function(data) {
	            if (data.result < 0) {
	                alert(data.alertMSG);
	                return;
	            }
	            if (aParam.navercheckout_flag == 'T') {
	                return true;
	            }

	            if(sType == 'app') {
	                res();
	                return true;
	            }

	            if (data.isLogin == 'F') { // 비로그인 주문
	                // 로그인페이지로 이동
	                sUrl = sLoginUrl + '?noMember=1&returnUrl=' + escape(sOrderUrl);

	                if (aParam.checked_product != '') {
	                   sUrl += '&checked_product=' + encodeURIComponent(aParam.checked_product);
	                }
	                location.href = sUrl;
	            } else {
	                location.href = sOrderUrl;
	            }

	            // 랜딩결제 : 비회원 > 로그인페이지가 아닌 주문서로 이동
	            if ((sChRef && CAFE24.checkChannelUI() === true) || (CAFE24.isOwnMallLandingUI() === true)) {
	                //랜딩결제 전용 디자인인 경우에만
	                location.href = sOrderUrl;
	            }
	        }, 'json');
	    },

	    /**
	     * checkout용(네이버페이, 카카오페이) : 특정기기에서 ajax 비동기화시 이슈가 되어 동기화로 호출 By ECHOSTING-512334
	     * is_prd 업데이트
	     *
	     * @param array aParam post전송할 파라미터
	     * @param object 클릭한 element 객체
	     */
	    _checkoutcallOrderAjax : function(aParam) {
	        EC$.ajax({
	            type: 'POST',
	            url: '/exec/front/order/order/',
	            async: false,
	            data: aParam,
	            dataType: 'json',
	            success: function(data) {
	                if (data.result < 0) {
	                    alert(data.alertMSG);
	                    return;
	                }
	            }
	        });
	    },

	    /**
	     * 선택한 상품금액 계산하기
	     * @param array aParam post전송할 파라미터
	     */
	    _callCalcAjax : function(aParam) {

	        if (bCheckedProductCalc === true) {
	            BasketAppDiscount.doCalculate(aParam, sDiscountApp);
	        }
	    },

	    /**
	     * '△' 버튼 클릭, 수량증가
	     * @param sId: 변경시킬 폼 id
	     * @param int iIdx 품목정보 배열 인덱스
	     */
	    addQuantityShortcut: function(sId, iIdx)
	    {
	        //var iQuantity = parseInt(EC$('#'+sId).val(), 10) + this.getBuyUnit(iIdx);
	        var iQuantity = aBasketProductData[iIdx].quantity + this.getBuyUnit(iIdx);
	        if (isNaN(iQuantity) === false) {
	            EC$('#'+sId).val(iQuantity);
	        }
	        this.modifyQuantity(sId);
	    },
	    /**
	     * '▽' 버튼 클릭, 수량감소
	     * @param sId : 클릭한 id
	     * @param int iIdx 품목정보 배열 인덱스
	     */
	    outQuantityShortcut: function(sId, iIdx)
	    {
	        //var iQuantity = parseInt(EC$('#'+sId).val(), 10) - this.getBuyUnit(iIdx);
	        var iQuantity = aBasketProductData[iIdx].quantity - this.getBuyUnit(iIdx);
	        if (iQuantity < 1) iQuantity = 1;
	        if (isNaN(iQuantity) === false) {
	            EC$('#'+sId).val(iQuantity);
	        }
	        this.modifyQuantity(sId);
	    },

	    /**
	     * 구매 주문단위값 가져오기
	     * @param int iIdx 품목정보 배열 인덱스
	     */
	    getBuyUnit: function(iIdx)
	    {
	        try {
	            if (bIsNewProduct) {
	                return aBasketProductData[iIdx].buy_unit;
	            }
	        } catch (e) {}

	        return 1;
	    },

	    /**
	     * 장바구니 리스트의 '주문하기' 버튼 클릭
	     * @param iIdx: 품목정보 배열 인덱스
	     */
	    orderBasketItem: function(iIdx)
	    {
	        // 각 항목별 수량체크에 성공할 경우에 주문페이지로 이동.
	        if (this.isAbleQuantityForMaxMinSingle(iIdx)) {
	            var aData = [];
	            var iProdNo = aBasketProductData[iIdx].product_no;
	            var sOptId = aBasketProductData[iIdx].opt_id;
	            var sProductType = aBasketProductData[iIdx].product_type;
	            var sIsSetProduct = aBasketProductData[iIdx].is_set_product;
	            var iBasketPrdNo = aBasketProductData[iIdx].basket_prd_no;
	            var iCustomDataIdx = aBasketProductData[iIdx].custom_data_idx;
	            var sDelvType = aBasketProductData[iIdx].delvtype;

	            // 장바구니 분리형세트 상품 판단을 위한 세트번호
	            var iSetPrdNo = parseInt(aBasketProductData[iIdx].set_product_no);

	            // 분리형세트의 선택주문시 관련세트 구성 전부 체크후 선택주문하기처리
	            if (iSetPrdNo > 0) {
	                this.setAddSingleSetItemCheckedAction(iSetPrdNo, 'orderSelectBasket');
	                return false;
	            }

	            var sKey = iProdNo + ':' + sOptId + ':' + sIsSetProduct + ':' + iBasketPrdNo + ':' + iCustomDataIdx + ':' + sDelvType;

	            aData.push(sKey);

	            this._callOrderAjax({
	                checked_product: aData.join(','),
	                basket_type: this._getBasketType(sProductType),
	                delvtype: sBasketDelvType
	            });
	        }
	    },

	    /**
	     * 장바구니상 분리형세트 단독 처리 불가능하게 액션처리
	     */
	    setAddSingleSetItemCheckedAction: function(iSetPrdNo, sAction)
	    {

	        for (i = 0; i < aBasketProductData.length; i++) {
	            if (aBasketProductData[i].set_product_no == iSetPrdNo) {
	                EC$("#" + BASKET_CHK_ID_PREFIX + i).prop("checked", true);
	            } else {
	                EC$("#" + BASKET_CHK_ID_PREFIX + i).prop("checked", false);
	            }
	        }

	        // 선택액션 임시 엘리먼트 생성
	        var oTmpElem = document.createElement('a');
	        oTmpElem.id = 'oBasketSetAction';
	        oTmpElem.setAttribute("link-login","/member/login.html");
	        oTmpElem.setAttribute("link-order","/order/orderform.html?basket_type=all_buy");

	        switch (sAction) {
	            case 'orderSelectBasket' : this.orderSelectBasket(oTmpElem); break;
	            case 'deleteBasket' : this.deleteBasket(); break;
	           // case 'orderSelectBasket' : this.orderSelectBasket(); break;

	        }

	    },

	    /**
	     * 장바구니 리스트의 '관심상품등록' 버튼 클릭
	     * @param iIdx: 품목정보 배열 인덱스
	     */
	    addWishListItem: function(iIdx)
	    {
	        var aData = [];
	        var iProdNo = aBasketProductData[iIdx].product_no;
	        var sOptId = aBasketProductData[iIdx].opt_id;
	        var sProductType = aBasketProductData[iIdx].product_type;
	        var sIsSetProduct = aBasketProductData[iIdx].is_set_product;
	        var iBasketPrdNo = aBasketProductData[iIdx].basket_prd_no;
	        var sKey = iProdNo + ':' + sOptId + ':' + sIsSetProduct + ':' + iBasketPrdNo;
	        aData.push(sKey);
	        this._callBasketAjax({
	            command: 'select_storage',
	            checked_product: aData.join(','),
	            delvtype: sBasketDelvType
	        });
	    },
	    /**
	     * 장바구니 리스트의 '삭제' 버튼 클릭
	     * @param iIdx: 품목정보 배열 인덱스
	     */
	    deleteBasketItem: function(iIdx)
	    {
	        // 장바구니 분리형세트 상품 판단을 위한 세트번호
	        var iSetPrdNo = parseInt(aBasketProductData[iIdx].set_product_no);

	        // 분리형세트의 선택주문시 관련세트 구성 전부 체크후 선택주문하기처리
	        if (iSetPrdNo > 0) {
	            this.setAddSingleSetItemCheckedAction(iSetPrdNo, 'deleteBasket');
	            return false;

	        }

	        if (confirm(__('선택하신 상품을 삭제하시겠습니까?')) == false) return;

	        if (typeof ACEWrap !== 'undefined') {
	            ACEWrap.delCheckedBasket();
	        }
	        var aData = [];
	        var iProdNo = aBasketProductData[iIdx].product_no;
	        var sOptId = aBasketProductData[iIdx].opt_id;
	        var sProductType = aBasketProductData[iIdx].product_type;
	        var sIsSetProduct = aBasketProductData[iIdx].is_set_product;
	        var iBasketPrdNo = aBasketProductData[iIdx].basket_prd_no;
	        var iCustomDataIdx = aBasketProductData[iIdx].custom_data_idx;
	        var sDelvType = aBasketProductData[iIdx].delvtype;

	        var sKey = iProdNo + ':' + sOptId + ':' + sIsSetProduct + ':' + iBasketPrdNo + ':' + iCustomDataIdx + ':' + sDelvType;

	        aData.push(sKey);
	        this._callBasketAjax({
	            command: 'select_delete',
	            checked_product: aData.join(','),
	            delvtype: sBasketDelvType
	        });
	    },
	    /**
	     * 장바구니 리스트의 체크박스 전체선택
	     * @param sBoxName: 선택할 종류이름
	     * @param oElem: object 클릭한 element 객체
	     */
	    setCheckBasketList: function(sBoxName, oElem)
	    {
	        if (this._existsBasket(true) == false) return;
	        EC$('input[name="'+ sBoxName +'"]:checkbox').each(function() {
	            if (EC$(oElem).prop('checked') === true) {
	                EC$(this).prop('checked', true);
	            } else {
	                EC$(this).prop('checked', false);
	            }
	        });

	        // 전체 선택 여부
	        sAllChecked = 'F';
	        if (EC$('[id^="basket_chk_id_"]:checked').length == EC$('[id^="basket_chk_id_"]').length || EC$('[id^="basket_chk_id_"]:checked').length == 0) { //전체선택 or 전체해제
	            sAllChecked = 'T';
	        }
	        
	        Basket._callCalcAjax({
	            checked_product: Basket._getCheckedProductList().join(','),
	            all_checked : sAllChecked
	        });
	    },

	    /**
	     * 각각의 장바구니 아이템별로 객체화한다.
	     * @param iIndex 장바구니인덱스.
	     * @return Object 장바구니내의 개별 아이템객체
	     */
	    makeBasketPrdInfo: function(iIndex) {
	        var iProdNo = aBasketProductData[iIndex].product_no;
	        var sOptId = aBasketProductData[iIndex].opt_id;
	        var sKeyProdWithOpt = iProdNo + '__' + sOptId;

	        var objBasketPrdInfo = [];

	      if (objBasketPrdInfo.length == 0) {
	      // [상품번호__옵션]별 객체 초기화.
	          objBasketPrdInfo[sKeyProdWithOpt] = {
	                "minMaxKey": sKeyProdWithOpt,
	                "buyUnitKey": sKeyProdWithOpt,
	                "quantity": 0,
	                "min": 0,
	                "max": 0,
	                "maxType": "F",
	                "buy_unit": 1,
	                "product_name_quantity": aBasketProductData[iIndex].product_name.replace(/\\(.)/mg, "$1"),
	                "product_name_buy_unit": aBasketProductData[iIndex].product_name.replace(/\\(.)/mg, "$1")
	            };
	        }

//	      폼전송이 발생하기전 화면에 입력된 값은 무시. (2015-12-11)
//	      objBasketPrdInfo[sKeyProdWithOpt].quantity += parseInt(EC$('#quantity_id_'+ iIndex).val());
	        objBasketPrdInfo[sKeyProdWithOpt].quantity = aBasketProductData[iIndex].quantity;
	        // ECHOSTING-336171 대응
	        // 1+N 상품 일 경우, 주문수량 제한 > 최대 주문수량 체크 하지 않음
	        objBasketPrdInfo[sKeyProdWithOpt].maxType = aBasketProductData[iIndex].sIsBenefitEventProduct == 'T' ? 'F' : aBasketProductData[iIndex].product_max_type;
	        //objBasketPrdInfo[sKeyProdWithOpt].maxType  = aBasketProductData[iIndex].product_max_type;
	        objBasketPrdInfo[sKeyProdWithOpt].min = aBasketProductData[iIndex].product_min;
	        objBasketPrdInfo[sKeyProdWithOpt].max = aBasketProductData[iIndex].product_max;
	        objBasketPrdInfo[sKeyProdWithOpt].buy_unit = aBasketProductData[iIndex].check_buy_unit;

	        if (Olnk.isLinkageType(aBasketProductData[iIndex].option_type) === true) {
	            objBasketPrdInfo[sKeyProdWithOpt].min = aBasketProductData[iIndex].product_min;
	            objBasketPrdInfo[sKeyProdWithOpt].max = aBasketProductData[iIndex].product_max;
	        }

	        if (aBasketProductData[iIndex].check_quantity_type == 'P') {
	            objBasketPrdInfo[sKeyProdWithOpt].minMaxKey = iProdNo;
	        } else {
	            objBasketPrdInfo[sKeyProdWithOpt].product_name_quantity += aBasketProductData[iIndex].opt_str.replace(/\\(.)/mg, "$1");
	        }

	        if (aBasketProductData[iIndex].check_buy_unit_type == 'P') {
	            objBasketPrdInfo[sKeyProdWithOpt].buyUnitKey = iProdNo;
	        } else {
	            objBasketPrdInfo[sKeyProdWithOpt].product_name_buy_unit += aBasketProductData[iIndex].opt_str.replace(/\\(.)/mg, "$1");
	        }

	        return objBasketPrdInfo[sKeyProdWithOpt];
	    },


	    /**
	     * 최소/최대 주문가능 수량 체크
	     * @param boolean bIsAll 전체상품주문여부
	     * @return boolean
	     */
	    isAbleQuantityForMaxMin: function(bIsAll)
	    {
	        var aBasketPrdInfo = [];
	        var aBasketCheckQuantity = [];
	        var aBasketCheckBuyUniyQuantity = [];
	        for (var i=0,n=aBasketProductData.length; i < n; i++) {
	            // 선택상품 주문인경우 선택한 상품에 대해서만
	            if (bIsAll == false) {
	                if (EC$("#" + BASKET_CHK_ID_PREFIX + i).prop("checked") === false) {
	                    continue;
	                }
	            }

	            if (aBasketProductData[i].check_quantity_type == 'P') {
	                var sKey = aBasketProductData[i].product_no;
	                if (typeof aBasketCheckQuantity[sKey] === 'undefined') {
	                    aBasketCheckQuantity[sKey] = aBasketProductData[i].quantity;
	                } else {
	                    aBasketCheckQuantity[sKey] += aBasketProductData[i].quantity;
	                }
	            } else {
	                var sKey = aBasketProductData[i].product_no + '__' + aBasketProductData[i].opt_id;
	                aBasketCheckQuantity[sKey] = aBasketProductData[i].quantity;
	            }

	            if (aBasketProductData[i].check_buy_unit_type == 'P') {
	                var sKey = aBasketProductData[i].product_no;
	                if (typeof aBasketCheckBuyUniyQuantity[sKey] === 'undefined') {
	                    aBasketCheckBuyUniyQuantity[sKey] = aBasketProductData[i].quantity;
	                } else {
	                    aBasketCheckBuyUniyQuantity[sKey] += aBasketProductData[i].quantity;
	                }
	            } else {
	                var sKey = aBasketProductData[i].product_no + '__' + aBasketProductData[i].opt_id;
	                aBasketCheckBuyUniyQuantity[sKey] = aBasketProductData[i].quantity;
	            }

	            aBasketPrdInfo.push(this.makeBasketPrdInfo(i));
	        }

//	        alert(aBasketPrdInfo.toString());
	        // 유효성 체크
	        var iBasketPrdCnt = aBasketPrdInfo.length;
	        for (var index = 0; index < iBasketPrdCnt; index++) {
	            // 최소구매수량 체크
	            var iProductMinCount = aBasketPrdInfo[index].min <= 0 ? 1 : aBasketPrdInfo[index].min;
	            if (aBasketCheckQuantity[aBasketPrdInfo[index].minMaxKey] < iProductMinCount) {
	                alert(aBasketPrdInfo[index].product_name_quantity+' '+sprintf(__('최소 주문수량은 %s개 입니다.'), iProductMinCount));
	                this.resetQuantityFromBasket();
	                return false;
	            }
	            // 최대구매수량 체크
	            if ((aBasketPrdInfo[index].maxType == 'T' && aBasketPrdInfo[index].max > 0)
	                    && aBasketPrdInfo[index].max < aBasketCheckQuantity[aBasketPrdInfo[index].minMaxKey]) {
	                alert(aBasketPrdInfo[index].product_name_quantity+' '+sprintf(__('최대 주문수량은 %s개 입니다.'), aBasketPrdInfo[index].max));
	                this.resetQuantityFromBasket();
	                return false;
	            }

	            if ((aBasketCheckBuyUniyQuantity[aBasketPrdInfo[index].buyUnitKey] % aBasketPrdInfo[index].buy_unit) > 0) {
	                alert(aBasketPrdInfo[index].product_name_buy_unit+' '+sprintf(__('구매 주문단위는 %s개 입니다.'), aBasketPrdInfo[index].buy_unit));
	                return false;
	            }
	        }

	        return true;
	    },

	    /**
	     * 최소/최대 주문가능 수량 체크 (단일상품)
	     * @param boolean iIndex 장바구니 인덱스.
	     * @return boolean
	     */
	    isAbleQuantityForMaxMinSingle: function(iIndex)
	    {
	        var aBasketPrdInfo = [];
	        aBasketPrdInfo.push(this.makeBasketPrdInfo(iIndex));
	        // 유효성 체크
	        // 최소구매수량 체크
	        var iProductMinCount = aBasketPrdInfo[0].min <= 0 ? 1 : aBasketPrdInfo[0].min; //구상품 최소 구매수량 0으로 저장 가능
	        if (aBasketPrdInfo[0].quantity < iProductMinCount) {
	            alert(sprintf(__('최소 주문수량은 %s개 입니다.'), iProductMinCount));
	            this.resetQuantityFromBasket();
	            return false;
	        }
	        // 최대구매수량 체크
	        if ((aBasketPrdInfo[0].maxType == 'T' && aBasketPrdInfo[0].max > 0)
	                && aBasketPrdInfo[0].max < aBasketPrdInfo[0].quantity) {
	            alert(sprintf(__('최대 주문수량은 %s개 입니다.'), aBasketPrdInfo[0].max));
	            this.resetQuantityFromBasket();
	            return false;
	        }

	        if ((aBasketPrdInfo[0].quantity % aBasketPrdInfo[0].buy_unit) > 0) {
	            alert(sprintf(__('구매 주문단위는 %s개 입니다.'), aBasketPrdInfo[0].buy_unit));
	            return false;
	        }

	        return true;
	    },

	    /**
	     * 상품수량 장바구니 정보로 초기화
	     */
	    resetQuantityFromBasket: function()
	    {
	        try {
	            for (var i=0,n=aBasketProductData.length; i < n; i++) {
	                var iOldQty = parseInt(aBasketProductData[i].quantity);
	                var iCurQty = parseInt(EC$('#quantity_id_'+i).val());
	                if (iOldQty != iCurQty) {
	                    EC$('#quantity_id_'+i).val(iOldQty);
	                }
	            }
	        } catch (e) {}
	    },

	    /**
	     * 옵션변경 레이어 노출
	     * @param string sId 옵션변경 layer id
	     */
	    showOptionChangeLayer: function(sId, oThis)
	    {
	        var aIndex = sId.split("_");
	        var iIndex = aIndex[3];
	        var iSetIndex = sId.split("_")[4];

	        if (EC$("#ec-basketOptionModifyLayer").length > 0) { // 비동기 옵션 변경 레이어 사용일경우 - ECHOSTING-229719
	            /** 추가/변경 버튼 클릭 이벤트 끊어주기 **/
	            EC$(".ec-basketOptionModifyLayer-add").off("click");
	            EC$(".ec-basketOptionModifyLayer-modify").off("click");
	            /** 선택옵션, 추가옵션 템플릿 제외하고 다 지워주기 **/
	            EC$("#ec-basketOptionModifyLayer").find(".ec-basketOptionModifyLayer-options").slice(1).remove();
	            EC$("#ec-basketOptionModifyLayer").find(".ec-basketOptionModifyLayer-addOptions").slice(1).remove();
	            
	            var aParam = {
	                iIndex: iIndex,
	                iSetIndex: iSetIndex,
	                aProductData: aBasketProductData[iIndex]
	            };

	           EC$.ajax({
	                type: 'POST',
	                url: '/exec/front/Product/OptionForm/',
	                data: aParam,
	                dataType: 'json',
	                async: false,
	                success: function(data) {
	                  if (data.result == 0) {
	                    var aProductOption = data.aProductOption; 
	                    EC$(".ec-basketOptionModifyLayer-productName").html(aProductOption.product_name);
	                    EC$(".ec-basketOptionModifyLayer-optionStr").html(aProductOption.layer_option_str);
	 
	                    /** 선택 옵션 **/
	                    for (let i = 0; i < aProductOption.optionList.length; i++) {
	                        var oOptionElement = EC$(".ec-basketOptionModifyLayer-options").first().clone();
	                        var sOptionElement = oOptionElement.html();
	                        sOptionElement = sOptionElement.replace(/{\$option_name}/g, aProductOption.optionList[i].option_name);
	                        sOptionElement = sOptionElement.replace(/{\$form.option_value}/g, aProductOption.optionList[i].form_option_value);
	                        oOptionElement.html(sOptionElement);
	                        EC$(".ec-basketOptionModifyLayer-options").last().after(oOptionElement.show());
	                    }

	                    /** 추가입력 옵션 **/
	                    for (let i = 0; i < aProductOption.optionAddList.length; i++) {
	                        var oOptionElement = EC$(".ec-basketOptionModifyLayer-addOptions").first().clone();
	                        var sOptionElement = oOptionElement.html();
	                        sOptionElement = sOptionElement.replace(/{\$option_name}/g, aProductOption.optionAddList[i].option_name);
	                        sOptionElement = sOptionElement.replace(/{\$form.option_value}/g, aProductOption.optionAddList[i].form_option_value);
	                        oOptionElement.html(sOptionElement);
	                        EC$(".ec-basketOptionModifyLayer-addOptions").last().after(oOptionElement.show());
	                    }
	                    
	                    /** 옵션 추가 버튼 **/
	                    if (aProductOption.option_add_display == true) {
	                        EC$(".ec-basketOptionModifyLayer-add").show();
	                        EC$(".ec-basketOptionModifyLayer-add").click(function() {
	                            BasketNew.modify(iIndex, 'add');
	                        });
	                    } else {
	                        EC$(".ec-basketOptionModifyLayer-add").hide();
	                    }

	                    /** 옵션 변경 버튼 **/
	                    EC$(".ec-basketOptionModifyLayer-modify").click(function() {
	                        if (aBasketProductData[iIndex]['is_set_product']=='T' && aBasketProductData[iIndex]['set_product_no']==0) {
	                            NewBasketSetOption.modify(iIndex, iSetIndex); // 일체세트
	                        } else {
	                            BasketNew.modify(iIndex, 'modify');
	                        }
	                    });

	                    /** 옵션 폼 이벤트 초기화 **/
	                    CAFE24.SHOP_FRONT_NEW_OPTION_COMMON.initObject();
	                    CAFE24.SHOP_FRONT_NEW_OPTION_COMMON.init();
	                    CAFE24.SHOP_FRONT_NEW_OPTION_BIND.initChooseBox();
	                    CAFE24.SHOP_FRONT_NEW_OPTION_DATA.initData();
	                  }
	                }
	            });

	            /** 옵션변경 이벤트 발생시킨 엘리먼트 바로 뒤에 붙여줌 **/
	            oThis.after(EC$("#ec-basketOptionModifyLayer"));
	            EC$("#ec-basketOptionModifyLayer").show();
	            
	        } else {
	            EC$("[id^='option_modify_layer']").hide();
	            EC$(".optionModify").hide();
	            EC$("#" + sId).show();

	            if (bIsNewProduct === true) {
	                EC$("#" + sId).find('[id^="product_option_id"]').eq(0).val('*').trigger('change');
	            }
	        }
	    },
	    /**
	     *  상품명위에 [당일배송][퀵배송] 문구 노출
	     *  @param aPrdNo : 장바구니페이지의 상품번호 array
	     */
	    isCustomshipAjax: function(aQuickPrdNo, aQuickItemCode)
	    {
	        if (!aQuickItemCode) return;
	        var aParam = {};
	        var sDeliveryAreaAjaxUrl = '/exec/front/order/Basketcustomship/';

	        aParam['aPrdNo'] = aQuickPrdNo;
	        aParam['aItemCode'] = aQuickItemCode;

	        EC$.ajax({
	            type: 'POST',
	            url: sDeliveryAreaAjaxUrl,
	            data: aParam,
	            dataType: 'json',
	            async: false,
	            success: function(data) {
	                if (data.result == 0) {
	                    var sToday = data.sDisplayToday;
	                    var sQuick = data.sDisplayQuick;

	                    try {
	                        for (var key1 in sQuick) {
	                            if (sQuick[key1] == 'T') EC$('[id^="custom_quick_id_show_' + key1 + '"]').removeClass('displaynone');
	                            if (sQuick[key1] == 'T') EC$('[id^="custom_quick_id_' + key1 + '"]').html(sQuick['sc_name']);
	                        }
	                        for (var key in sToday) {
	                            if (sToday[key] == 'T') EC$('[id^="custom_today_id_show_' + key + '"]').removeClass('displaynone');
	                            if (sToday[key] == 'T') EC$('[id^="custom_today_id_' + key + '"]').html(sToday['sc_name']);
	                        }
	                    } catch (e) {}
	                }
	            }
	        });
	    },

	    /**
	     * 장바구니 스토어픽업전용상품 선택하기
	     */
	    orderStorePickupSelectBasket: function (oElem) {
	        var aSetNoArray = new Array();

	        for (i = 0; i < aBasketProductData.length; i++) {
	            if (aBasketProductData[i].use_store_pickup == 'T') {
	                EC$("#" + BASKET_CHK_ID_PREFIX + i).prop("checked", true);
	                //대상상품중 분리세트가 전용설정이면 같이 선택되게 한다.
	                if (parseInt(aBasketProductData[i].set_product_no) > 0) {
	                    aSetNoArray.push(aBasketProductData[i].set_product_no);
	                }
	            } else {
	                EC$("#" + BASKET_CHK_ID_PREFIX + i).prop("checked", false);
	            }
	        }

	        if (aSetNoArray.length > 0) {
	            this.setSetProductCheckedSync(aSetNoArray);
	        }

	    },

	    setSetProductCheckedSync: function (aSetNo) {
	        for (i = 0; i < aSetNo.length; i++) {
	            for (j = 0; j < aBasketProductData.length; j++) {
	                if (parseInt(aBasketProductData[j].set_product_no) == aSetNo[i]) {
	                    EC$("#" + BASKET_CHK_ID_PREFIX + j).prop("checked", true);
	                }
	            }
	        }
	    },

	    isInProgressMigrationCartData: function(aData) {
	    if (aData['isInProgressMigrationCartData'] === true) {
	        alert(__('SYSTEM.IS.BUSY.PLEASE.TRY', 'SHOP.FRONT.BASKET.JS'));
	        window.location.reload();
	    }
	}

	};
	
	
	
	
	
	
	
/**
 * 뉴상품 상품옵션변경
 */
var BasketNew = {
    /**
     * '옵션변경'레이어에서 '적용하기' 버튼 클릭
     * @param int iIdx 품목정보배열 index
     * @param string sMode 액션모드(modify: 변경, add: 추가)
     */
    modify: function(iIdx, sMode)
    {
        // // 사용자지정옵션인경우 옵션변경불가(기존사양)
        // if (sMode == 'modify') {
        //     if (aBasketProductData[iIdx].option_add == "T") {
        //         alert(__("사용자 지정 옵션 상품은 옵션변경을 하실 수 없습니다."));
        //         EC$('#quantity_id_'+iIdx).val(aBasketProductData[iIdx].quantity);
        //         return false;
        //     }
        // }

        // 오직 추가옵션만 있는지
        var isOnlyOptionAdd = false;
        if (aBasketProductData[iIdx].has_option == "F" && aBasketProductData[iIdx].has_option_add == "T") {
            isOnlyOptionAdd = true;
        }

        //필수옵션 체크
        if (this.checkOptionRequired() == false) return;

        //추가옵션 체크
        if (this.checkAddOption() == false) return;

        // 파리미터 담을 객체
        var aParam = {};

        // 상품번호
        var iProductNo = aBasketProductData[iIdx].product_no;

        // 품목코드
        var sItemCode = aBasketProductData[iIdx].item_code;

        // 상품연동형 옵션타입인지 여부
        var isOptionEtype = Olnk.isLinkageType(aBasketProductData[iIdx].option_type);

        // 분리형세상품번호
        var iSetProductNo = aBasketProductData[iIdx].set_product_no;

        // 선택 품목정보 추출
        var oItemInfo = {};
        if (isOptionEtype === true) {
            oItemInfo = Olnk.getMockItemInfo({
                'product_no': aBasketProductData[iIdx].product_no,
                'product_code': aBasketProductData[iIdx].product_code
            });
        } else {
            oItemInfo = this.getItemInfo(iIdx, iProductNo);
        }

        // 선택옵션인경우만 체크
        if (isOptionEtype == false && isOnlyOptionAdd == false) {
            // 재고정보 추출
            var sKey = "option_stock_data" + iProductNo;
            var oItemStock = CAFE24.UTIL.parseJSON(window[sKey]);

            var oItem = oItemStock[oItemInfo.item_code];

            // 판매여부 체크
            if (oItem.is_selling == "F") {
                alert(sprintf(__('선택하신 %s 옵션은 판매하지 않은 옵션입니다.\n다른 옵션을 선택해 주세요.'), oItem.option_value));
                return false;
            }

            // 재고체크
            if (oItem.use_stock === true) {
                // ECHOSTING-318729 대응,
                // 상품 쪽 설정에 따라, 재고가 있을때 stock_number 가 없는 데이터가 들어오게 되므로
                // 에러방지를 위한 undefined 체크 추가
                if (oItem.is_selling == "F" || (oItem.stock_number != undefined && oItem.stock_number < 1)) {
                    alert(__('재고 수량이 부족합니다.'));
                    return false;
                }
            }
        }
        // 동일품목 추가여부 확인
        if (isOptionEtype === true && isOnlyOptionAdd === false) {
            var sOptionData = aBasketProductData[iIdx].olink_data;

            var aDulicationArray = new Array();
            EC$('.ProductOption'+iIdx+':visible').each(function(i) {
                if (/^\*+$/.test(EC$(this).val()) === false) {
                    aDulicationArray.push(EC$(this).val());
                }
            });

            var sDulicationData = aDulicationArray.join('!@#');

            if (sDulicationData === sOptionData) {
                alert(sprintf(__('동일상품이 장바구니에 %s개 있습니다.'), aBasketProductData[iIdx].quantity));
                return false;
            }
        }
        // 수량
        var iBuyQuantity = aBasketProductData[iIdx].quantity;
        var iBuyUnit = parseInt(aBasketProductData[iIdx].buy_unit);
        var iProductMin = parseInt(aBasketProductData[iIdx].product_min);


        // 주문추가의 경우에는 입력된 수량이 아닌 초기 설정 수량이 필요함.
        // 최소 주문수량과 주문단위를 비교하는 로직 추가.
        if (sMode == "add") {
            // 주문단위 설정이 상품 단위인 경우에는 수량 1로 상품 추가
            iBuyQuantity = (aBasketProductData[iIdx].check_buy_unit_type == 'P') ? 1 : BasketNew.getInitialQuantity(iBuyUnit, iProductMin);
        }

        // 액션
        aParam["command"] = (sMode == "modify") ? "update" : "add";

        // 품목정보
        aParam["product_no"] = oItemInfo.product_no;
        aParam["item_code"] = oItemInfo.item_code;
        aParam["opt_id"] = oItemInfo.opt_id;
        aParam["quantity"] = iBuyQuantity;
        aParam["item_code_before"] = aBasketProductData[iIdx].item_code;
        aParam["opt_id_before"] = aBasketProductData[iIdx].opt_id;
        aParam["set_product_no"] = aBasketProductData[iIdx].set_product_no;

        // 추가입력옵션
        var aAddOptionName = [];
        EC$("input[id^='add_option']:visible").each(function(index) {
            aAddOptionName.push(EC$(this).attr("name"));
            aParam["option_add[" + index + "]"] = EC$(this).val();
        });

        aParam["add_option_name"] = aAddOptionName.join(";");
        aParam["option_change"] = "T";
        aParam["is_new_product"] = "T";
        aParam["delvtype"] = (typeof(sBasketDelvType) === "undefined") ? "A" : sBasketDelvType;

        // 유효성 체크(기존)
        aParam["selected_item[]"] = iBuyQuantity + "||" + oItemInfo.item_code;
        aParam["num_of_prod"] = iBuyQuantity;

        // '추가' 일경우
        if (sMode == "add") {
            aParam["main_cate_no"] = aBasketProductData[iIdx].main_cate_no;
            aParam["num_of_prod"] = 1;
        }

        aParam = Olnk.hookParamForBasket(aParam, {
           'product_code': aBasketProductData[iIdx].product_code,
           'option_type': aBasketProductData[iIdx].option_type,
           'quantity': iBuyQuantity,
           'targets': EC$('.ProductOption' + iIdx + ':visible')
        });


        var aBasketOlnkData = Olnk.getProductAllSelected(aBasketProductData[iIdx].product_code ,EC$('.ProductOption'+iIdx+':visible') , iBuyQuantity);
        if (aBasketOlnkData !== false) {
            aParam['selected_item_by_etype[]'] = EC$.toJSON(aBasketOlnkData);
        }

        // 옵션변경 레이어팝업에서 추가/변경시 필수 옵션 체크 하지 않도록 한다.
        if (sMode == "add" || sMode == "modify") {
            aParam["call_from"] = 'option_modify';
        }

        Basket._callBasketAjax(aParam);
    },

    /**
     * 기본단위를 구하는 함수.
     * 주문단위와 최소구매수량을 비교하여 결정한다.
     */
    getInitialQuantity: function(iBuyUnit, iProductMin) {
        // 기본 최초 구매 단위는 1로 설정.
        var initialQuantity = 1;
        // 주문단위가 1 이상이면... 주문단위가 최소값.
        if (iBuyUnit > initialQuantity) {
            // 주문단위보다 최소 주문수량이 큰 경우.
            // 기본단위는 최소 주문수량보다 큰 최소 주문단위로 설정.
            initialQuantity = iBuyUnit;
            if (iBuyUnit < iProductMin) {
                while (iProductMin % iBuyUnit != 0) {
                    iProductMin ++;
                }
                initialQuantity = iProductMin;
            }
        } else {
            // 주문단위가 없는 경우.
            // 최소주문단위가 initialQuantity 보다 큰 경우
            if (iProductMin > initialQuantity) {
                initialQuantity = iProductMin;
            }
        }
        return initialQuantity;
    },

    /**
     * 필수옵션 체크 여부
     * @return bool true: 체크 / false: 체크안함
     */
    checkOptionRequired: function()
    {
        var bIsPass = true;
        EC$('select[id^="product_option_id"]:visible').each(function() {
            if (EC$(this).prop('required')) {
                var sOptionValue = EC$('option:selected', this).val();

                if (EC$.inArray(sOptionValue, ['*', '**']) !== -1) {
                    alert(__('필수 옵션을 선택해주세요.'));
                    EC$(this).focus();
                    bIsPass = false;
                    return false;
                }
            }
        });
        return bIsPass;
    },


    /**
     * 추가옵션 체크
     * @return bool true: 추가옵션이 다 입력되었으면 / false: 아니면
     */
    checkAddOption: function()
    {
        var bIsPass = true;
        EC$('[id^="add_option"]:visible').each(function() {
            var oThis = EC$(this);

            // 선택항목인 경우
            if (oThis.attr('require') === 'F') {
                return;
            }

            if (oThis.val().replace(/^[\s]+[\s]+$/g, '').length == 0) {
                alert(__('추가 옵션을 입력해주세요.'));
                oThis.focus();
                bIsPass = false;
                return false;
            }
        });
        return bIsPass;
    },

    /**
     * 뉴상품의 경우 아이템 코드를 받아오는 로직
     * @param int iIdx 품목정보배열 index
     * @param int iProductNo 상품번호
     */
    getItemInfo: function(iIdx, iProductNo)
    {
        // 상품정보
        var oPrdData = aBasketProductData[iIdx];
        var oItemInfo = {
            "product_no": iProductNo,
            "item_code": "",
            "opt_id": "",
            "opt_str": ""
        };

        // 오직 추가옵션만 있는지
        var isOnlyOptionAdd = false;
        if (oPrdData.has_option == "F" && oPrdData.has_option_add == "T") {
            isOnlyOptionAdd = true;
        }

        // 오직 추가옵션만 있는경우 임의 가공
        if (isOnlyOptionAdd) {
            oItemInfo.item_code = oPrdData.product_code + "000A";
            oItemInfo.opt_id = "000A";
            return oItemInfo;
        }

        // 옵션 있는경우 품목코드 추출
        if (eval("item_listing_type" + iProductNo) == "C" || eval("option_type" + iProductNo) == "F") {
            oItemInfo.item_code = EC$('.ProductOption' + iIdx).val();
            oItemInfo.opt_str = EC$('.ProductOption' + iIdx + ' :selected').text();
            oItemInfo.opt_str = oItemInfo.opt_str.replace(/\-/g, "/");
        } else {
            var aItemValue = new Array();
            EC$(".ProductOption" + iIdx + ":visible").each(function() {
                aItemValue.push(EC$(this).val());
            });
            var aItemMapper = CAFE24.UTIL.parseJSON(eval("option_value_mapper" + iProductNo));

            oItemInfo.item_code = aItemMapper[aItemValue.join("#$%")];
            oItemInfo.opt_str = aItemValue.join("/");
        }
        oItemInfo.opt_id = oItemInfo.item_code.substr(8);

        return oItemInfo;
    },


    /**
     * 관심상품등록
     * @param int iIdx 품목정보배열 index
     */
    moveWish: function(iIdx)
    {
        var aPrdData = aBasketProductData[iIdx];

        if (aPrdData.is_set_product == "T" && parseInt(aPrdData.set_product_no) == 0) {
            var aParam = [];
            aParam.push("command=add");
            aParam.push("from=basket");
            aParam.push("is_set_product=T");
            aParam.push("basket_prd_no=" + aPrdData.basket_prd_no);
            aParam.push("main_cate_no=" + aPrdData.main_cate_no);
            aParam.push("product_no=" + aPrdData.product_no);
            aParam.push("product_code=" + aPrdData.product_code);
            aParam.push("quantity=" + aPrdData.quantity);
            aParam.push("delvType=" + aPrdData.delvtype);
            aParam.push("product_min=" + aPrdData.product_min);
            aParam.push("selected_item[]=" + aPrdData.wish_selected_item);
            aParam.push("save_data=" + aPrdData.wish_save_data);

            var sParam = aParam.join('&');
            EC$.post("/exec/front/Product/Wishlist/", sParam, function(data) {
                if (window.bIsAddWishListCall === false) {
                    add_wishlist_result(data, aPrdData);
                }

                if (data.result == 'NOT_LOGIN') {
                    btn_action_move_url('/member/login.html');
                } else if (window.bIsAddWishListCall === false) {
                    location.reload();
                }
            }, 'json');
        } else if (parseInt(aPrdData.set_product_no) > 0) {
            //분리형세트
            var aSetData = [];
            var sSetKey = '';
            var iSetPrdNo = aBasketProductData[iIdx].set_product_no;
            for (i = 0; i < aBasketProductData.length; i++) {
                if (iSetPrdNo == aBasketProductData[i].set_product_no) {
                    //sSetKey = aBasketProductData[i].product_no + ':' + aBasketProductData[i].opt_id + ':' + 'T' + ':' + aBasketProductData[i].basket_prd_no + ':' + aBasketProductData[i].custom_data_idx;
                    sSetKey = aBasketProductData[i].product_no + ':' + aBasketProductData[i].opt_id + ':' + 'T' + ':' + aBasketProductData[i].basket_prd_no + ':' + aBasketProductData[i].custom_data_idx + ':' + aBasketProductData[i].delvtype;
                    aSetData.push(sSetKey);
                }
            }
            Basket._callBasketAjax({
                command: 'select_storage',
                checked_product: aSetData.join(','),
                delvtype: sBasketDelvType,
                option_type: aPrdData.option_type // 단독 구성 옵션 상품/품목이 하나라도 있는 경우 'F' 를 보냄
            });
        } else {
            var aData = [];
            //var sKey = aPrdData.product_no + ':' + aPrdData.opt_id + ':' + 'F' + ':' + aPrdData.basket_prd_no + ':' + aPrdData.custom_data_idx;
            var sKey = aPrdData.product_no + ':' + aPrdData.opt_id + ':' + 'F' + ':' + aPrdData.basket_prd_no + ':' + aPrdData.custom_data_idx + ':' + aPrdData.delvtype;
            aData.push(sKey);
            Basket._callBasketAjax({
                command: 'select_storage',
                checked_product: aData.join(','),
                delvtype: sBasketDelvType,
                option_type: aPrdData.option_type // 단독 구성 옵션 상품/품목이 하나라도 있는 경우 'F' 를 보냄
            });
        }
    }
};
