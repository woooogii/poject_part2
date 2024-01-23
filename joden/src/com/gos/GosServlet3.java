package com.gos;

import java.io.File;
import java.io.IOException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.sql.Connection;
import java.util.List;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.gosutil.DBConnection;
import com.gosutil.MyUtil;
import com.oreilly.servlet.MultipartRequest;
import com.oreilly.servlet.multipart.DefaultFileRenamePolicy;

public class GosServlet3 extends HttpServlet{

	private static final long serialVersionUID = 1L;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		process(req,resp);
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		process(req,resp);
	}
	
	protected void forward(HttpServletRequest req, HttpServletResponse resp,String url) throws ServletException, IOException {
		RequestDispatcher rd = req.getRequestDispatcher(url);
		rd.forward(req, resp);
	}
	
	protected void process(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		Connection conn = DBConnection.getConnection();
		GosDAO3 dao = new GosDAO3(conn);
		MyUtil myUtil = new MyUtil();
		
		String cp = req.getContextPath();
		String uri = req.getRequestURI();
		String url;
		
		String root = getServletContext().getRealPath("/");
		String path = root+"imageBoard"+File.separator+"saveImage";
		
		File f = new File(path);
		if(!f.exists()) {
			f.mkdirs();
		}
		
		if(uri.indexOf("write.gos")!=-1) {
			
			url = "/joden/writh.jsp";
			forward(req, resp, url);
			
		}if(uri.indexOf("write_ok_gos")!=-1){
			
			String enctype="UTF-8";
			int maxSize = 10*1024*1024;
			
			MultipartRequest mr = new MultipartRequest(req, path,maxSize,enctype, new DefaultFileRenamePolicy());
			
			url=cp+"/joden/list.gos";
			resp.sendRedirect(url);
		
		}else if(uri.indexOf("main.gos")!=-1) {
			
			String pageNum = req.getParameter("pageNum");
			int currentPage = 1;
			
			if(pageNum!=null) {
				currentPage = Integer.parseInt(pageNum);
			}
			
			String searchKey = req.getParameter("searchKey");
			String searchValue = req.getParameter("searchValue");
			
			if(searchValue==null) {
				searchKey = "category";
				searchValue = "";
			}else {
				if(req.getMethod().equalsIgnoreCase("GET")) {
					searchValue = URLDecoder.decode(searchValue,"UTF-8");
				}
			}
			
			int totaldataCount = dao.totalDataCount(searchKey, searchValue);
			
			int numPerPage = 5;
			int totalPage = myUtil.getPageCount(numPerPage,totaldataCount);
			
			if(currentPage>totalPage) {
				currentPage=totalPage;
			}
			
			int start = (currentPage-1)*totalPage+1;
			int end = currentPage*totalPage;
			
			List<GosDTO3> lists = dao.getProductInfoList(start, end, searchKey, searchValue);
			
			String param = "";
			if(searchValue!=null && !searchValue.equals("")) {
				param = "searchKey="+searchKey+"&searchValue="+URLEncoder.encode(searchValue,"UTF-8");
			}
			
			String urlList = cp+"/cabin/main.gos";
			if(!param.equals("")) {
				urlList +="?"+param;
			}
			
			String pageIndexList = myUtil.pageIndexList(currentPage, totalPage, urlList);
			
			req.setAttribute("lists", lists);
			req.setAttribute("pageNum", currentPage);
			req.setAttribute("pageIndexList", pageIndexList);
			req.setAttribute("totaldataCount", totaldataCount);
//			
			url = "/joden/main.jsp";
			forward(req, resp, url);
			
		}else if(uri.indexOf("/cabin/shop/categories.gos")!=-1) {
			
		}
		
		
		
		
	}
	
	

}
