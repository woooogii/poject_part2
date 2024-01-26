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
import com.gosutil.FileManager;
import com.gosutil.MyUtil;
import com.oreilly.servlet.MultipartRequest;
import com.oreilly.servlet.multipart.DefaultFileRenamePolicy;

public class ProductServlet extends HttpServlet{

	private static final long serialVersionUID = 1L;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		process(req, resp);
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		process(req, resp);
	}
	
	protected void forward(HttpServletRequest req, HttpServletResponse resp,String url) throws ServletException, IOException {
		RequestDispatcher rd = req.getRequestDispatcher(url);
		rd.forward(req, resp);
	}
	
	protected void process(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		req.setCharacterEncoding("UTF-8");
		String cp = req.getContextPath();
		
		Connection conn = DBConnection.getConnection();
		CreateProductDAO dao = new CreateProductDAO(conn);

		
		MyUtil myUtil = new MyUtil();
		
		String uri = req.getRequestURI();
		String url;
		
		String root = getServletContext().getRealPath("/");
		String path = root+"productImgs"+File.separator+"saveImage";
		
		File f = new File(path);
		if(!f.exists()) {
			f.mkdirs();
		}
		
		if(uri.indexOf("shop/create.gos")!=-1) {
			
			url = "/joden/product/create.jsp";
			forward(req, resp, url);
			
		}else if(uri.indexOf("shop/create_ok.gos")!=-1) {
			
			String enctype="UTF-8";
			int maxSize = 10*1024*1024;
			
			MultipartRequest mr = new MultipartRequest(req, path,maxSize,enctype, new DefaultFileRenamePolicy());
			
			if(mr.getFile("upload")!=null) {
				
				int productNum = dao.getAllProductMaxNum();
				
				CreateProductDTO dto = new CreateProductDTO();
				
				dto.setCategory(mr.getParameter("category"));
				dto.setProductNum(productNum+1);
				dto.setProductName(mr.getParameter("productName"));
				dto.setPrice(Integer.parseInt(mr.getParameter("price")));
				dto.setAmount(Integer.parseInt(mr.getParameter("amount")));
				dto.setImgSaveFileName(mr.getFilesystemName("upload"));
				dto.setImgOriginalFileName(mr.getOriginalFileName("upload"));
				dto.setProductDetailContent(mr.getParameter("productDetailContent"));
				
				dao.insertProduct(dto);
				
			}
			
			url=cp+"/cabin/shop/productList.gos";
			resp.sendRedirect(url);


			

		}else if(uri.indexOf("main.gos")!=-1){
			
			url = "/joden/main/main.jsp";
			forward(req, resp, url);
		
			

		}else if(uri.indexOf("shop/productList.gos")!=-1){

			String pageNum = req.getParameter("pageNum");
			int currentPage = 1;
			if(pageNum!=null) {
				currentPage = Integer.parseInt(pageNum);
			}
			
			String searchValue = req.getParameter("searchValue");
			
			if(searchValue!=null) {
				if(req.getMethod().equalsIgnoreCase("GET")) {
					searchValue = URLDecoder.decode(searchValue,"UTF-8");
					
				}
			} else {
				searchValue = "";
			}
			
			int dataCount = dao.getAllDataCount(searchValue);
			
			
			int numPerPage = 4;
			int totalPage = myUtil.getPageCount(numPerPage, dataCount);
			if(currentPage>totalPage) {
				currentPage=totalPage;
			}
			int start = (currentPage-1)*numPerPage+1;
			int end = currentPage*numPerPage;
			
			List<CreateProductDTO> allProductList = dao.allProductList(start, end, searchValue);
			
			String param = "";
			if(searchValue!=null && !searchValue.equals("")) {
				param = "searchValue="+URLEncoder.encode(searchValue,"UTF-8");
			}
			
			String urlList = cp+"/cabin/shop/productList.gos";
			if(!param.equals("")) {
				urlList += "?" + param;
			}
			
			String pageIndexList = myUtil.pageIndexList(currentPage, totalPage, urlList);

			req.setAttribute("allProductList", allProductList);
			req.setAttribute("pageIndexList", pageIndexList);
			req.setAttribute("dataCount", dataCount);
			req.setAttribute("pageNum",currentPage);
			
			String articleUrl = cp + "/cabin/shop/productDetail.gos?pageNum="+currentPage;
			if(!param.equals("")) {
				articleUrl += "&" + param;
			}
			req.setAttribute("articleUrl", articleUrl);

			String imagePath = cp + "/productImgs/saveImage";
			String deletePath = cp + "/cabin/shop/all_delete.gos";
			req.setAttribute("imagePath", imagePath);
			req.setAttribute("deletePath", deletePath);
			
			url = "/joden/product/productList.jsp";
			forward(req, resp, url);
			
		}else if(uri.indexOf("shop/cateList.gos")!=-1){
			
			String category = req.getParameter("category");
			String catePageNum = req.getParameter("pageNum");
			
			int cateCurrentPage = 1;
			
			if(catePageNum!=null) {
				cateCurrentPage = Integer.parseInt(catePageNum);
			}
			
			String searchValue = req.getParameter("searchValue");
			
			if(searchValue!=null) {
				if(req.getMethod().equalsIgnoreCase("GET")) {
					searchValue = URLDecoder.decode(searchValue,"UTF-8");
				}
			}else {
				searchValue = "";
			}
			
			int cateDataCount = dao.getCategoryDataCount(category,searchValue);
			
			int cateNumPerPage = 4;
			int cateTotalPage = myUtil.getPageCount(cateNumPerPage, cateDataCount);
			
			if(cateCurrentPage>cateTotalPage) {
				cateCurrentPage=cateTotalPage;
			}
			
			int start = (cateCurrentPage-1)*cateNumPerPage+1;
			int end = cateCurrentPage*cateNumPerPage;
			
			List<CreateProductDTO> categoryLists = dao.cateProductList(category, start, end,searchValue);
			
			String param = "";
			if(searchValue!=null && !searchValue.equals("")) {
				param= "searchValue="+URLEncoder.encode(searchValue,"UTF-8");
			}
			
			String cateUrlList = cp+"/cabin/shop/cateList.gos?category="+category;
			if(!param.equals("")) {
				cateUrlList += "&" + param;
			}
			
			String cateIndexList = myUtil.pageIndexList(cateCurrentPage, cateTotalPage, cateUrlList);

			req.setAttribute("categoryLists", categoryLists);
			req.setAttribute("cateIndexList", cateIndexList);
			req.setAttribute("dataCount", cateDataCount);
			req.setAttribute("pageNum",cateCurrentPage);
			
			
			String articleUrl = cp + "/cabin/shop/productDetail.gos?pageNum="+cateCurrentPage;
			if(!param.equals("")) {
				articleUrl += "&" + param;
			}
			req.setAttribute("articleUrl", articleUrl);
			
			String imagePath = cp + "/productImgs/saveImage";
			String cateDeletePath = cp + "/cabin/shop/cate_delete.gos";
			req.setAttribute("imagePath", imagePath);
			req.setAttribute("deletePath", cateDeletePath);
			
			url = "/joden/product/categoryList.jsp";
			forward(req, resp, url);
			
			
			
		}else if(uri.indexOf("shop/productDetail.gos")!=-1) {
			

			int proNo = Integer.parseInt(req.getParameter("num"));
			CreateProductDTO productList = dao.getReadProduct(proNo);
			

//			HttpSession session = req.getSession();
//			UserDTO user = (UserDTO) session.getAttribute("user");
//			
//			if(user!=null) {
//				String userId = user.getUserId();
//				
//				boolean isCart = cartDao.isCart(userId, proNo);
//				req.setAttribute("isCart", isCart);
//				
//			}
			
			String pageNum = req.getParameter("pageNum");
			if(productList==null) {
				url = cp+"/cabin/shop/productList.gos";
				resp.sendRedirect(url);
			}
			
			String param = "pageNum="+pageNum;
			
			req.setAttribute("productList", productList);
			
			req.setAttribute("params", param);
			req.setAttribute("pageNum", pageNum);
			
			String imagePath = cp + "/productImgs/saveImage";
			req.setAttribute("imagePath", imagePath);
			
			url = "/joden/product/productDetail.jsp";
			forward(req, resp, url);	
			
		}else if(uri.indexOf("shop/all_delete.gos")!=-1) {
			int productNum = Integer.parseInt(req.getParameter("num"));
			String pageNum = req.getParameter("pageNum");
			
			CreateProductDTO dto = dao.getReadProduct(productNum);
			
			FileManager.doFileDelete(dto.getImgSaveFileName(), path);
			
			dao.deleteData(productNum);
			
			url = cp+"/cabin/shop/productList.gos?pageNum="+pageNum;
			resp.sendRedirect(url);
			
		}else if(uri.indexOf("shop/cate_delete.gos")!=-1) {
			int cateProductNum = Integer.parseInt(req.getParameter("num"));
			String catePageNum = req.getParameter("pageNum");
			String category = req.getParameter("category");
			
			CreateProductDTO dto = dao.getReadProduct(cateProductNum);
			
			FileManager.doFileDelete(dto.getImgSaveFileName(), path);
			
			dao.deleteData(cateProductNum);
			
			String encodedCategory = URLEncoder.encode(category, "UTF-8");
			url = cp + "/cabin/shop/cateList.gos?category=" + encodedCategory + "&pageNum=" + catePageNum;
			
			resp.sendRedirect(url);
			
		}
		

	}
}