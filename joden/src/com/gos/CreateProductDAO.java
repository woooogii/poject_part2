package com.gos;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class CreateProductDAO {
	
private Connection conn;
	
	public CreateProductDAO(Connection conn) {
		this.conn = conn;
	}
	
	//1. 상품 등록 (createProduct)
	public int insertProduct(CreateProductDTO dto) {
		int result = 0;
		
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		String sql = "insert into PRODUCTINFO values (?,?,?,?,?,?,?,?)";
		
		try {
			
			pstmt = conn.prepareStatement(sql);

			pstmt.setInt(1, dto.getProductNum());
			pstmt.setString(2, dto.getProductName());
			pstmt.setString(3, dto.getCategory());
			pstmt.setInt(4, dto.getPrice());
			pstmt.setInt(5, dto.getAmount());
			pstmt.setString(6, dto.getImgSaveFileName());
			pstmt.setString(7, dto.getImgOriginalFileName());
			pstmt.setString(8, dto.getProductDetailContent());
			
			rs = pstmt.executeQuery();
			
			if(rs.next()) {
				
				dto.setProductNum(rs.getInt("productNum"));
				dto.setProductName(rs.getString("productName"));
				dto.setCategory(rs.getString("category"));
				dto.setPrice(rs.getInt("price"));
				dto.setAmount(rs.getInt("amount"));
				dto.setImgSaveFileName(rs.getString("imgSaveFileName"));
				dto.setImgOriginalFileName(rs.getString("imgOriginalFileName"));
				dto.setProductDetailContent(rs.getString("productDetailContent"));
				
			}
			
			result = pstmt.executeUpdate();
			
			rs.close();
			pstmt.close();
	
		} catch (Exception e) {
			System.out.println(e.toString());
		}		
		return result;
	}
	
	//2-1. 카테고리 전상품 select (AllProductList)
	public List<CreateProductDTO> allProductList(int start,int end, String searchValue){
		List<CreateProductDTO> allProductLists = new ArrayList<CreateProductDTO>();
		
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		String sql = "select * from (select rownum rnum,data.* from "
				+ "(select * from PRODUCTINFO where productName like ? or category like ? order by productNum desc) data) where rnum>=? and rnum <=?";
		try {
			searchValue = "%"+searchValue+"%";
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, searchValue);
			pstmt.setString(2, searchValue);
			pstmt.setInt(3, start);
			pstmt.setInt(4, end);
			
			rs = pstmt.executeQuery();
			
			while(rs.next()) {
				CreateProductDTO dto = new CreateProductDTO();
				
				dto.setProductNum(rs.getInt("productNum"));
				dto.setProductName(rs.getString("productName"));
				dto.setCategory(rs.getString("category"));
				dto.setPrice(rs.getInt("price"));
				dto.setAmount(rs.getInt("amount"));
				dto.setImgSaveFileName(rs.getString("imgSaveFileName"));
				dto.setImgOriginalFileName(rs.getString("imgOriginalFileName"));
				dto.setProductDetailContent(rs.getString("productDetailContent"));
				
				allProductLists.add(dto);	
			}
			
			rs.close();
			pstmt.close();
		} catch (Exception e) {
			System.out.println(e.toString());
		}
		return allProductLists;
	}
	
	//2-2. 한 카테고리 내 전상품 select (cateProductList)
	public List<CreateProductDTO> cateProductList(String category,int start,int end,String searchValue){
		List<CreateProductDTO> categoryLists = new ArrayList<CreateProductDTO>();
		
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		String sql = "select * from (select rownum rnum,data.* from (select * from PRODUCTINFO where category = ? order by productNum desc) data where productName like ?) where rnum>=? and rnum <=?";
		try {
			
			searchValue = "%"+searchValue+"%";
			
			pstmt = conn.prepareStatement(sql);
			
			pstmt.setString(1, category);
			pstmt.setString(2, searchValue);
			pstmt.setInt(3, start);
			pstmt.setInt(4, end);
			
			rs = pstmt.executeQuery();
			
			while(rs.next()) {
				CreateProductDTO dto = new CreateProductDTO();
				
				dto.setCategory(rs.getString("category"));
				dto.setProductName(rs.getString("productName"));
				dto.setPrice(rs.getInt("price"));
				dto.setProductDetailContent(rs.getString("productDetailContent"));
				dto.setAmount(rs.getInt("amount"));
				dto.setProductNum(rs.getInt("productNum"));
				dto.setImgSaveFileName(rs.getString("imgSaveFileName"));
				dto.setImgOriginalFileName(rs.getString("imgOriginalFileName"));

				categoryLists.add(dto);
			}
			
			rs.close();
			pstmt.close();
			
		} catch (Exception e) {
			System.out.println(e.toString());
		}
		return categoryLists;
	}

	//3. 특정 상품 select (productDetail)
	public CreateProductDTO getReadProduct(int productNum) {
		CreateProductDTO dto = null;
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		String sql = "select * from PRODUCTINFO where productNum=?";
	
		try {
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, productNum);
			rs = pstmt.executeQuery();
			
			if(rs.next()) {
				dto = new CreateProductDTO();
				
				dto.setCategory(rs.getString("category"));
				dto.setProductName(rs.getString("productName"));
				dto.setPrice(rs.getInt("price"));
				dto.setProductDetailContent(rs.getString("productDetailContent"));
				dto.setAmount(rs.getInt("amount"));
				dto.setProductNum(rs.getInt("productNum"));
				dto.setImgSaveFileName(rs.getString("imgSaveFileName"));
				dto.setImgOriginalFileName(rs.getString("imgOriginalFileName"));
				
			}
			
			rs.close();
			pstmt.close();
			
		} catch (Exception e) {
			System.out.println(e.toString());
		}
		
		return dto;
	}
	
	//4. 전체 상품 maxnum
	public int getAllProductMaxNum() {
		
		int maxNum = 0;
		
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		String sql = "select nvl(max(productNum),0) from PRODUCTINFO";
		
		try {
			
			pstmt = conn.prepareStatement(sql);
			
			rs = pstmt.executeQuery();
			
			while(rs.next()) {
				maxNum = rs.getInt(1);
			}
			rs.close();
			pstmt.close();
			
		} catch (Exception e) {
			System.out.println(e.toString());
		}
		
		return maxNum;
		
	}

	
	//5-1. 전체 카테고리 내 상품 Count;
	public int getAllDataCount(String searchValue) {
		int dataCount = 0;
		
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		String sql = "select nvl(count(*),0) from PRODUCTINFO where productName like ? or category like ?";
		
		try {
			searchValue = "%"+searchValue+"%";
			
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, searchValue);
			pstmt.setString(2, searchValue);
			rs = pstmt.executeQuery();
			
			while(rs.next()) {
				dataCount = rs.getInt(1);
			}
			rs.close();
			pstmt.close();
			
		} catch (Exception e) {
			System.out.println(e.toString());
		}
		return dataCount;

	}
	
	//5-2. 1가지 카테고리 내 상품 Count;
	public int getCategoryDataCount(String category,String searchValue) {
		int dataCount = 0;
		
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		String sql = "select nvl(count(*),0) from (select * from PRODUCTINFO where category = ? and productName like ?)";
		
		try {
			searchValue = "%"+searchValue+"%";
			
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, category);
			pstmt.setString(2, searchValue);
			
			rs = pstmt.executeQuery();
			
			while(rs.next()) {
				dataCount = rs.getInt(1);
			}
			rs.close();
			pstmt.close();
			
		} catch (Exception e) {
			System.out.println(e.toString());
		}
		return dataCount;

	}
	
	//6. 상품 삭제
	public int deleteData(int productNum) {
		int result = 0;
		
		PreparedStatement pstmt = null;
		String sql = "delete PRODUCTINFO where productNum = ?";
		
		try {
			
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, productNum);
			
			result = pstmt.executeUpdate();
			
			pstmt.close();
			
			
		} catch (Exception e) {
			System.out.println(e.toString());
		}
		return result;
	}


}
