package com.gos;


public class CreateProductDTO {
	
	//상품 등록 시 필요한 DTO
	
	private int productNum;
	private String category;
	private String productName;
	private int price;
	private int amount;
	private String productDetailContent;
	private String imgSaveFileName;
	private String imgOriginalFileName;
	
	
	public int getProductNum() {
		return productNum;
	}
	public void setProductNum(int productNum) {
		this.productNum = productNum;
	}
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	}
	public String getProductName() {
		return productName;
	}
	public void setProductName(String productName) {
		this.productName = productName;
	}
	public int getPrice() {
		return price;
	}
	public void setPrice(int price) {
		this.price = price;
	}
	public int getAmount() {
		return amount;
	}
	public void setAmount(int amount) {
		this.amount = amount;
	}
	public String getImgSaveFileName() {
		return imgSaveFileName;
	}
	public void setImgSaveFileName(String imgSaveFileName) {
		this.imgSaveFileName = imgSaveFileName;
	}
	public String getImgOriginalFileName() {
		return imgOriginalFileName;
	}
	public void setImgOriginalFileName(String imgOriginalFileName) {
		this.imgOriginalFileName = imgOriginalFileName;
	}
	public String getProductDetailContent() {
		return productDetailContent;
	}
	public void setProductDetailContent(String productDetailContent) {
		this.productDetailContent = productDetailContent;
	}


}
