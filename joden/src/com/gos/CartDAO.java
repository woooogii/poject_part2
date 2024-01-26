package com.gos;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class CartDAO {
	
private Connection conn;
	
	public CartDAO(Connection conn) {
		this.conn = conn;
	}

	// ��ٱ��� CART ��ü ������ ����
	public int getCartDataCount() {
		
		int dataCount = 0;
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		String sql;
		
		try {
			
			sql = "select nvl(count(*),0) from CART";
			pstmt = conn.prepareStatement(sql);
			rs = pstmt.executeQuery();
			if(rs.next()) {
				dataCount = rs.getInt(1);
			}
			
			rs.close();
			pstmt.close();
		} catch (Exception e) {

			System.out.println(e.toString());
		}
		
		return dataCount;
	}
	
	// ��ǰ PRODUCTINFO ��ü ��ٱ��� ������ ����Ʈ
	public  List<CartDTO> getCartLists(int start,int end){
		List<CartDTO> lists = new ArrayList<CartDTO>();
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		String sql;
		
		try {

			sql = "select * from (select rownum rnum, data.* from (";
			sql+= "select userId,productName,cartAmount,price,imgSaveFileName ";
			sql+= "from CART) Data) where rnum>=? and rnum<=?";
			pstmt = conn.prepareStatement(sql);

			pstmt.setInt(1, start);
			pstmt.setInt(2, end);
			
			rs = pstmt.executeQuery();
			while(rs.next()) {
				
				CartDTO dto = new CartDTO();

				dto.setUserId(rs.getString("userId"));
				dto.setProductName(rs.getString("productName"));
				dto.setCartAmount(rs.getInt("cartAmount"));
				dto.setPrice(rs.getInt("price"));
				dto.setImgSaveFileName(rs.getString("imgSaveFileName"));
				
				lists.add(dto);
			}
			
			rs.close();
			pstmt.close();
		} catch (Exception e) {
			
			System.out.println(e.toString());
		}
		
		return lists;
	}
	// productName���� �� ���� ������ ��������
	public CartDTO getReadCartData(String productName) {
		
		CartDTO dto = null;
		
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		String sql;
		
		try {
			
			sql = "SELECT b.productName,b.userId,b.cartAmount,";
			sql+= "b.Price, b.imgSaveFileName FROM CART ";
			sql+= "b INNER JOIN PRODUCTINFO p ON b.productName ";
			sql+= "= p.productName WHERE b.productName=?";
			
			pstmt = conn.prepareStatement(sql);
			
			pstmt.setString(1, productName);
			
			rs = pstmt.executeQuery();
			
			if(rs.next()) {
				
				dto = new CartDTO();

				dto.setUserId(rs.getString("userId"));
				dto.setProductName(rs.getString("productName"));
				dto.setCartAmount(rs.getInt("cartAmount"));
				dto.setPrice(rs.getInt("Price"));
				dto.setImgSaveFileName(rs.getString("imgSaveFileName"));
			}
			
			rs.close();
			pstmt.close();
		} catch (Exception e) {
			
			System.out.println(e.toString());
		}
		
		return dto;
	}

	
	// ��ٱ��� ���� // int -> String//////
	public int deleteCart(String productName) {
		
		int result = 0;
		
		PreparedStatement pstmt = null;
		String sql;
		
		try {
			
			sql = "delete CART where productName=?";
			
			pstmt = conn.prepareStatement(sql);

			pstmt.setString(1, productName);
			
			result = pstmt.executeUpdate();
			
			pstmt.close();
			
		} catch (Exception e) {

			System.out.println(e.toString());
		}
		
		return result;
	}
	
	// ��ٱ��� ���� ����
	public int updateCart(CartDTO dto) {
		
		int result = 0;
		
		PreparedStatement pstmt = null;
		String sql;
		
		try {
			
			sql = "update CART set cartAmount=? where productName=?";
			
			pstmt = conn.prepareStatement(sql);

			pstmt.setInt(1, dto.getCartAmount());
			pstmt.setString(2, dto.getProductName());
			
			result = pstmt.executeUpdate();
			
			pstmt.close();
			
		} catch (Exception e) {
			
			System.out.println(e.toString());
		}
		
		return result;
	}
	
	/*
	// num�� max ���ϱ�
	public int getMaxNum() {
		
		int maxNum = 0;
		
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		String sql;
		
		try {
			
			sql = "select nvl(max(num),0) from board";
			
			pstmt = conn.prepareStatement(sql);
			
			rs = pstmt.executeQuery();
			
			if(rs.next()) {
				
				maxNum = rs.getInt(1);
			}
			
			rs.close();
			pstmt.close();
		} catch (Exception e) {

			System.out.println(e.toString());
		}
		
		return maxNum;
	}
	
	// �Է�
	public int insertData(BoardDTO dto) {
		
		int result = 0;
		
		PreparedStatement pstmt = null;
		String sql;
		
		try {
			
			sql = "insert into board (num,name,pwd,email,subject,content,";
			sql+= "ipAddr,hitCount,created) values (?,?,?,?,?,?,?,0,sysdate)";
			
			pstmt = conn.prepareStatement(sql);
			
			pstmt.setInt(1, dto.getNum());
			pstmt.setString(2, dto.getName());
			pstmt.setString(3, dto.getPwd());
			pstmt.setString(4, dto.getEmail());
			pstmt.setString(5, dto.getSubject());
			pstmt.setString(6, dto.getContent());
			pstmt.setString(7, dto.getIpAddr()); // created �� hitCount �� �ڵ����� ��
			
			result = pstmt.executeUpdate();
			
			pstmt.close();
		} catch (Exception e) {
			
			System.out.println(e.toString());
		}
		
		return result;
	}
	*/

}
