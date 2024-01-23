package com.gosutil;

import java.sql.Connection;
import java.sql.DriverManager;

public class DBConnection {

private static Connection conn = null;
	
	public static Connection getConnection() {
		try {
			String url= "jdbc:oracle:thin:@localhost:1521:xe";
			String user = "gos";
			String pwd = "a123";
			
			if(conn==null) {
				
				Class.forName("oracle.jdbc.driver.OracleDriver");
				conn = DriverManager.getConnection(url, user, pwd);
				
			}
			
			
		} catch (Exception e) {
			System.out.println(e.toString());
		}
		
		return conn;
	}
	
	public static void close() {
	
		if(conn==null) {
			return;
		}
		
		try {
			if(!conn.isClosed()) {
				conn.close();
			}
		} catch (Exception e) {
			System.out.println(e.toString());
		}
		conn = null;
	}

}
