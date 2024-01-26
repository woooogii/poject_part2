package com.gos;

public class CartDTO {

		//장바구니 CART
	private int productNum;
	private String productName;
	private String category;
	private int price;
	private int amount;
	private String imgSaveFileName;
	private String imgOriginalFileName;
	private String productDetailContent;
	private String userId;
	
	
	
	
	public int getProductNum() {
		return productNum;
	}
	public void setProductNum(int productNum) {
		this.productNum = productNum;
	}
	public String getProductName() {
		return productName;
	}
	public void setProductName(String productName) {
		this.productName = productName;
	}
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
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
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public int getCartAmount() {
		return cartAmount;
	}
	public void setCartAmount(int cartAmount) {
		this.cartAmount = cartAmount;
	}
	private int cartAmount;
		
		
		
}
