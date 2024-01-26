package com.gos;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class LoginDAO {
	
	private Connection conn;

	public LoginDAO(Connection conn) {
		this.conn = conn;
	}

	public int insertData(UserDTO dto) {

		int result = 0;

		PreparedStatement pstmt = null;
		String sql;
		try {

			sql = "insert into USERINFO (userId,userPwd,userName,userEmail,";
			sql += "userTel,userGender,userAddr,userBirth,userReg) ";
			sql += "values (?,?,?,?,?,?,?,?,sysdate)";

			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, dto.getUserId());
			pstmt.setString(2, dto.getUserPwd());
			pstmt.setString(3, dto.getUserName());
			pstmt.setString(4, dto.getUserEmail());
			pstmt.setString(5, dto.getUserTel());
			pstmt.setString(6, dto.getUserGender());
			pstmt.setString(7, dto.getUserAddr());
			pstmt.setString(8, dto.getUserBirth());

			result = pstmt.executeUpdate();

			pstmt.close();

		} catch (Exception e) {
			System.out.println(e.toString());
		}

		return result;
	}

	public UserDTO getReadData(String userId) {
		UserDTO dto = null;
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		String sql;

		try {

			sql = "select userId, userPwd, userName, userEmail, userTel, userGender, userAddr, userBirth, userReg ";
			sql += "from USERINFO where userId=?";

			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, userId);
			rs = pstmt.executeQuery();

			if (rs.next()) {
				dto = new UserDTO();
				dto.setUserId(rs.getString("userId"));
				dto.setUserPwd(rs.getString("userPwd"));
				dto.setUserName(rs.getString("userName"));
				dto.setUserEmail(rs.getString("userEmail"));
				dto.setUserTel(rs.getString("userTel"));
				dto.setUserGender(rs.getString("userGender"));
				dto.setUserAddr(rs.getString("userAddr"));
				dto.setUserBirth(rs.getString("userBirth"));
				dto.setUserReg(rs.getString("userReg"));
			}

			rs.close();
			pstmt.close();

		} catch (Exception e) {
			System.out.println(e.toString());
		}
		return dto;
	}

	public UserDTO getReadData1(String userTel, String userEmail) {
		UserDTO dto = null;
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		String sql;

		try {

			sql = "select userId ";
			sql += "from gos where userTel=? and userEmail=?";

			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, userTel);
			pstmt.setString(2, userEmail);

			rs = pstmt.executeQuery();

			if (rs.next()) {
				dto = new UserDTO();
				dto.setUserId(rs.getString("userId"));
			}

			rs.close();
			pstmt.close();

		} catch (Exception e) {
			System.out.println(e.toString());
		}
		return dto;
	}

	public UserDTO getReadData2(String userId, String userEmail) {
		UserDTO dto = null;
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		String sql;

		try {

			sql = "select userPwd ";
			sql += "from gos where userId=? and userEmail=?";

			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, userId);
			pstmt.setString(2, userEmail);

			rs = pstmt.executeQuery();

			if (rs.next()) {
				dto = new UserDTO();
				dto.setUserPwd(rs.getString("userPwd"));
			}

			rs.close();
			pstmt.close();

		} catch (Exception e) {
			System.out.println(e.toString());
		}
		return dto;

	}

	public int updateData(UserDTO dto) {
		int result = 0;

		PreparedStatement pstmt = null;
		String sql;

		try {

			sql = "update login set userPwd=?,userName=?,userEmail=?,userTel=,";
			sql += "userGender=?,userAddr=?,userBirth=? where userId=?";

			pstmt = conn.prepareStatement(sql);

			pstmt.setString(1, dto.getUserPwd());
			pstmt.setString(2, dto.getUserName());
			pstmt.setString(3, dto.getUserEmail());
			pstmt.setString(4, dto.getUserTel());
			pstmt.setString(5, dto.getUserGender());
			pstmt.setString(6, dto.getUserAddr());
			pstmt.setString(7, dto.getUserBirth());
			pstmt.setString(8, dto.getUserId());

			result = pstmt.executeUpdate();

			pstmt.close();

		} catch (Exception e) {
			System.out.println(e.toString());
		}
		return result;
	}

	public UserDTO forgotId(String userTel, String userEmail) {
		UserDTO dto = null;
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		String sql;

		try {

			sql = "select userId ";
			sql += "from gos where userTel=? and userEmail=?";

			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, userTel);
			pstmt.setString(2, userEmail);

			rs = pstmt.executeQuery();

			if (rs.next()) {
				dto = new UserDTO();
				dto.setUserPwd(rs.getString("userId"));
			}

			rs.close();
			pstmt.close();

		} catch (Exception e) {
			System.out.println(e.toString());
		}
		return dto;

	}

}
