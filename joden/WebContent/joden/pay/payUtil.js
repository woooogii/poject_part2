const IMP = window.IMP;
IMP.init("imp20856334");

const button = document.querySelector("#payButton");

const onClickPay = async = () => {
	IMP.request_pay({
		
		pg: "kakaopay",
		pay_method: "card",
		amount: "100",
		name: "마법 스크롤",
		merchant_uid: "ord-0001",
		
	});
	
	
	
};

button.addEventListener("click", onClickPay);