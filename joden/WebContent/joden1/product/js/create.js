// 내용의 값의 빈공백을 trim(앞/뒤)
String.prototype.trim = function() {
		var TRIM_PATTERN = /(^\s*)|(\s*$)/g;
		return this.replace(TRIM_PATTERN, "");
};

//공백 검사
function productUpload() {
	var f = document.myLog;
	
	if(!f.productNum.value){
		alert("상품 번호를 입력해주세요!");
		f.productNum.focus();
		return;
	}
	if(!f.category.value){
		alert("카테고리를 선택 해주세요!");
		f.category.focus();
		return;
	}
	if(!f.productName.value){
		alert("상품 이름을 입력해주세요!");
		f.productName.focus();
		return;
	}
	if(!f.price.value){
		alert("상품 가격을 입력해주세요!");
		f.price.focus();
		return;
	}
	if(!f.amount.value){
		alert("재고 수량을 입력해주세요!");
		f.amount.focus();
		return;
	}
	if(!f.upload.value){
		alert("이미지를 업로드 해주세요!");
		f.upload.focus();
		return;
	}

	alert("상품 등록 완료");

	f.submit();
}

function onlyHan() {
	if(event.keyCode < 12592 || event.keyCode > 12687){
		event.returnValue=false
		alert("한글만 입력 가능합니다.");
	}
}

function onlyNum() {
	if(event.keyCode < 48 || event.keyCode > 57){
		event.returnValue=false;
		alert("숫자만 입력 가능합니다.");
	}
}

function cateCheck() {//카테고리 선택
	var f = document.myLog;
	var clength = f.tong.options.length;
	var cindex = f.tong.selectIndex;

	if(cindex==(clength-1)){
		//값 입력 안받아도됨
		f.value = f.tong.options[cindex].value;
		f.readOnly = true;
	}
}