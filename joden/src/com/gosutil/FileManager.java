package com.gosutil;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.OutputStream;

import javax.servlet.http.HttpServletResponse;

public class FileManager {
	
	public static boolean doFileDownload(HttpServletResponse response,String saveFileName,String originalFileName,String path){
		
		try {
			
			String filePath = path + File.separator + saveFileName;
			
			//파일을 다운 받을 때 한글이름 깨짐 방지
			originalFileName = new String(originalFileName.getBytes("euc-kr"),"ISO-8859-1");
			
			File f= new File(filePath);
			if(!f.exists()) {
				return false;
			}
			
			response.setContentType("application/octet-stream");//.jpg > 여기서 jpg가 application, "."이 octet
			response.setHeader("Content-disposition", "attachment;fileName="+originalFileName);
			
			BufferedInputStream bis = new BufferedInputStream(new FileInputStream(f));//reader써도 상관x
			
			OutputStream out = response.getOutputStream();
			int data;
			byte buffer[] = new byte[4096];
			
			while((data=bis.read(buffer,0,4096))!=-1) {
				out.write(buffer,0,data);
			}
			out.flush();
			out.close();
			bis.close();
			
			
		} catch (Exception e) {
			System.out.println(e.toString());
		}
		return false;
	}
	
	public static void doFileDelete(String fileName,String path) {
		
		try {
			
			String filePath = path + File.separator+fileName;
			File f = new File(filePath);
			
			if(f.exists()) {//f.exists() > f가 있으면
				f.delete();//물리적 파일 삭제
			}
			
		} catch (Exception e) {
			System.out.println(e.toString());
		}
		
		
	}
	
	
}
