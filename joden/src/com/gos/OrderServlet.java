package com.gos;

import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServlet;

public class OrderServlet extends HttpServlet{
	
	private static final long serialVersionUID = 1L;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		
		process(req, resp);
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		
		process(req, resp);
	}
	
	protected void forward(HttpServletRequest req, HttpServletResponse resp, String url) throws ServletException, IOException {
		
		RequestDispatcher rd = req.getRequestDispatcher(url);
		rd.forward(req, resp);
	}
	
	protected void process(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		
		
		String cp = req.getContextPath();
		
		Connection conn = DBConn.getConnection();
		CartDAO cdao = new CartDAO(conn);
		OrderDAO odao = new OrderDAO(conn);
		PageDAO pdao = new PageDAO(conn);
		
		MyUtil myUtil = new MyUtil();

		String uri = req.getRequestURI();
		String url;
		
		String root = getServletContext().getRealPath("/");
		String path = root+"productImgs"+File.separator+"saveImage";
		
		File f = new File(path);
		if(!f.exists()) {
			
			f.mkdirs();
		}
		
		if(uri.indexOf("order/myCart.gos")!=-1) {
			
			HttpSession session = req.getSession();
			
			GosInfo info = (GosInfo)session.getAttribute("GosInfo");
			/*
			if(info==null) {
				
				url = "/myPage/login.jsp";
				forward(req, resp, url);
				return;
			}
			*/
			
			String productName = req.getParameter("productName");
			int currentPage = 1;
			
			if(productName!=null) {
				
				currentPage = Integer.parseInt(productName);
			}
			
			int dataCount = cdao.getCartDataCount();
			
			int numPerPage = 10;
			int totalPage = myUtil.getPageCount(numPerPage, dataCount);
			
			if(currentPage>totalPage) {
				
				currentPage = totalPage;
			}
 
			int start = (currentPage-1)*numPerPage+1;
			int end = currentPage*numPerPage;
			
			List<CartDTO> lists = cdao.getCartLists(start,end);
			
			String imagePath = cp + "/productImgs/saveImage";		
			String deletePath = cp + "/cabin/order/myCartDelete.gos";			
			String articleUrl = cp + "/cabin/shop/productDetail.gos";
			
			req.setAttribute("lists", lists);
			req.setAttribute("imagePath", imagePath);
			req.setAttribute("articleUrl", articleUrl);
			req.setAttribute("deletePath", deletePath);

			
			url = "/myPage/myCart.jsp";
				
			forward(req, resp, url);	
			
		}else if(uri.indexOf("order/myCartDelete.gos")!=-1) {
			
			String productName = req.getParameter("productName");
			
			cdao.deleteCart(productName);
			
			url = cp + "/cabin/order/myCart.gos";
			resp.sendRedirect(url);
			
		}else if(uri.indexOf("order/myOrder.gos")!=-1) {
			
			HttpSession session = req.getSession();
			
			GosInfo info = (GosInfo)session.getAttribute("GosInfo");
			/*
			if(info==null) {
				
				url = "/myPage/login.jsp";
				forward(req, resp, url);
				return;
			}
			*/
			
			String productName = req.getParameter("productName");
			int currentPage = 1;
			
			if(productName!=null) {
				
				currentPage = Integer.parseInt(productName);
			}
			
			int dataCount = odao.getOrderDataCount();
			
			int numPerPage = 10;
			int totalPage = myUtil.getPageCount(numPerPage, dataCount);
			
			if(currentPage>totalPage) {
				
				currentPage = totalPage;
			}
 
			int start = (currentPage-1)*numPerPage+1;
			int end = currentPage*numPerPage;
			
			List<OrderDTO> lists = odao.getOrderLists(start,end);
			
			String imagePath = cp + "/productImgs/saveImage";			
			String deletePath = cp + "/cabin/order/myOrderDelete_ok.gos";			
			String articleUrl = cp + "/cabin/shop/productDetail.gos";
			
			req.setAttribute("lists", lists);
			req.setAttribute("imagePath", imagePath);
			req.setAttribute("articleUrl", articleUrl);
			req.setAttribute("deletePath", deletePath);
			
			url = "/myPage/myOrder.jsp";
				
			forward(req, resp, url);	
			
		}else if(uri.indexOf("myOrderDelete_ok.do")!=-1) { /////////////////
			
			int orderNum = Integer.parseInt(req.getParameter("orderNum"));
			String pageNum = req.getParameter("pageNum");
			
			odao.deleteDataOrderList(orderNum);
			
			String param = "pageNum=" + pageNum;
			
			//url = cp + "/cabin/myOrder.gos?" + param;
			url = cp + "/cabin/myOrder.gos";
			resp.sendRedirect(url);
			
		}else if(uri.indexOf("order/myPage.gos")!=-1) {
			
			HttpSession session = req.getSession();
			
			GosInfo info = (GosInfo)session.getAttribute("GosInfo");
			/*
			if(info==null) {
				
				url = "/myPage/login.jsp";
				forward(req, resp, url);
				return;
			}*/
			
			url = "/myPage/myPage.jsp";
				
			forward(req, resp, url);	
			
		}
	}

}
