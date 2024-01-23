package com.gos;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class GosDAO3 {
	
	private Connection conn=null;
	public GosDAO3(Connection conn) {
		this.conn = conn;
	}
	
	//카테고리별 상품 maxnum
	public int getMaxNum(String category) {
		
		int maxNum = 0;
		
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		String sql = "select nvl(max(prodoctNum),0) from PRODUCTINFO where category=?";
		
		try {
			
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, category);
			
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
	
	public int productDataCount(String category) {
		int dataCount = 0;
		
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		String sql = "select nvl(count(*),0) from PRODUCTINFO where category=?";
		
		try {
			
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, category);
			
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
	
	public int totalDataCount(String searchKey,String searchValue) {
		int dataCount = 0;
		
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		String sql = "select nvl(count(*),0) from PRODUCTINFO where "+searchKey+" ?";
		
		try {
			
			searchValue = "="+searchValue;
			
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1,searchValue);
			
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
	
	//상품 insert
	public int insertProduct(GosDTO3 dto) {
		int result = 0;
		
		PreparedStatement pstmt = null;
		String sql = "insert into PRODUCTINFO values (?,?,?,?,?)";
		
		try {
			
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, dto.getProductNum());
			pstmt.setString(2, dto.getProductName());
			pstmt.setString(3, dto.getCategory());
			pstmt.setInt(4, dto.getPrice());
			pstmt.setInt(5, dto.getAmount());
			
			pstmt.close();
	
		} catch (Exception e) {
			System.out.println(e.toString());
		}		
		return result;
	}
	
	
	//PRODUCTINFO select
	public List<GosDTO3> getProductInfoList(int start,int end,String searchKey,String searchValue){
		List<GosDTO3> productInfolists = new ArrayList<>();
		GosDTO3 dto = null;
		
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		String sql = "select * from (select rownum rnum,data.* from (select * from PRODUCTINFO where "+searchKey+" ? order by productNum desc) data) where rnum>=? and rnum<=?";
		try {
			searchValue = "="+searchValue;
			
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, searchValue);
			pstmt.setInt(2, start);
			pstmt.setInt(3, end);
			rs = pstmt.executeQuery();
			
			while(rs.next()) {
				dto = new GosDTO3();
				
				dto.setCategory(rs.getString("category"));
				dto.setProductName(rs.getString("productName"));
				dto.setPrice(rs.getInt("prie"));
				dto.setAmount(rs.getInt("amount"));
				dto.setProductNum(rs.getInt("productNum"));
				
			}
			
			rs.close();
			pstmt.close();
			
			
		} catch (Exception e) {
			System.out.println(e.toString());
		}
		
		return productInfolists;
	}
	
	//REVIEW select
		public List<GosDTO3> getReviewList(int productNum,int start,int end){
			List<GosDTO3> reviewLists = new ArrayList<>();
			GosDTO3 dto = null;
			
			PreparedStatement pstmt = null;
			ResultSet rs = null;
			String sql = "select * from (select rownum rnum,data.* from (select * from REVIEW where productNum=? order by reviewDate desc) data) where rnum>=? and rnum<=?;";
			try {
				
				pstmt = conn.prepareStatement(sql);
				pstmt.setInt(1, productNum);
				pstmt.setInt(2, start);
				pstmt.setInt(3, end);
				rs = pstmt.executeQuery();
				
				while(rs.next()) {
					dto = new GosDTO3();
					
					dto.setProductNum(rs.getInt("productNum"));
					dto.setUserId(rs.getString("userId"));
					dto.setProductName(rs.getString("productName"));
					dto.setUserName(rs.getString("userName"));
					dto.setUserPwd(rs.getString("userPwd"));
					dto.setContent(rs.getString("content"));
					dto.setReviewDate(rs.getString("reviewDate"));
					
				}
				
				rs.close();
				pstmt.close();
				
				
			} catch (Exception e) {
				System.out.println(e.toString());
			}
			
			return reviewLists;
		}


}
