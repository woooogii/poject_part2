package com.gos;

import java.io.IOException;
import java.sql.Connection;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.gosutil.DBConnection;

public class UserServlet extends HttpServlet{

	private static final long serialVersionUID = 1L;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		process(req, resp);
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		process(req, resp);
	}
	
	protected void forward(HttpServletRequest req, HttpServletResponse resp, String url)
			throws ServletException, IOException {
		RequestDispatcher rd = req.getRequestDispatcher(url);
		rd.forward(req, resp);
	}

	protected void process(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

		req.setCharacterEncoding("UTF-8");
		String cp = req.getContextPath();

		Connection conn = DBConnection.getConnection();
		LoginDAO dao = new LoginDAO(conn);

		String uri = req.getRequestURI();
		String url;

		if (uri.indexOf("login.gos") != -1) {
			url = "/joden/login/login.jsp";
			forward(req, resp, url);

		} else if (uri.indexOf("created.gos") != -1) {
			url = "/joden/login/created.jsp";
			forward(req, resp, url);

		} else if (uri.indexOf("created_ok.gos") != -1) {

			UserDTO dto = new UserDTO();

			dto.setUserId(req.getParameter("userId"));
			dto.setUserPwd(req.getParameter("userPwd"));
			dto.setUserName(req.getParameter("userName"));
			dto.setUserEmail(req.getParameter("userEmail"));
			dto.setUserTel(req.getParameter("userTel"));
			dto.setUserGender(req.getParameter("userGender"));
			dto.setUserAddr(req.getParameter("userAddr"));
			dto.setUserBirth(req.getParameter("userBirth"));
			dto.setUserReg(req.getParameter("userReg"));

			dao.insertData(dto);

			url = cp + "/joden/login/created_ok.jsp";
			resp.sendRedirect(url);

		}else if (uri.indexOf("login_ok.gos") != -1) {

			String userId = req.getParameter("userId");
			String userPwd = req.getParameter("userPwd");

			UserDTO dto = dao.getReadData(userId);

			if (dto == null || (!dto.getUserPwd().equals(userPwd))) {
				req.setAttribute("message1", "아이디 또는 패스워드를 입력해주세요");

				url = "/joden/login/login.jsp";
				forward(req, resp, url);

				return;
			}

			HttpSession session = req.getSession();

			UserInfo info = new UserInfo();

			info.setUserId(dto.getUserId());
			info.setUserName(dto.getUserName());

			session.setAttribute("UserInfo", info);

			url = cp + "/cabin/membership/login/test.gos";
			resp.sendRedirect(url);

		} else if (uri.indexOf("logout.gos") != -1) {

			HttpSession session = req.getSession();

			session.removeAttribute("UserInfo");
			session.invalidate();

			url = cp;
			resp.sendRedirect(url);

		} else if (uri.indexOf("searchPw.gos") != -1) {

			url = "/joden/login/searchPw.jsp";
			forward(req, resp, url);

		} else if (uri.indexOf("searchId.gos") != -1) {

			url = "/joden/login/searchId.jsp";
			forward(req, resp, url);

		}else if (uri.indexOf("searchPw_ok.gos") != -1) {
			String userId = req.getParameter("userId");
			String userEmail = req.getParameter("userEmail");

			UserDTO dto = dao.getReadData1(userId, userEmail);

			if (dto == null) {
				req.setAttribute("message", "입력오류");

				url = "/joden/login/login.jsp";
				forward(req, resp, url);
				return;
			}

			//

			url = "/joden/login/login.jsp";
			forward(req, resp, url);

		} else if (uri.indexOf("searchId_ok.gos") != -1) {
			String userTel = req.getParameter("userTel");
			String userEmail = req.getParameter("userEmail");

			UserDTO dto = dao.getReadData2(userTel, userEmail);

			if (dto == null) {
				req.setAttribute("message", "입력오류");

				url = "/joden/login/login.jsp";
				forward(req, resp, url);
				return;
			}

			url = "/joden/login/login.jsp";
			forward(req, resp, url);

		} else if (uri.indexOf("updated.gos") != -1) {

			HttpSession session = req.getSession();
			UserInfo info = (UserInfo) session.getAttribute("UserInfo");

			if (info != null) {
				String userId = info.getUserId();
				UserDTO dto = dao.getReadData(userId);

				req.setAttribute("dto", dto);
			}

			url = "/joden/login/updated.jsp";
			forward(req, resp, url);
			return;

		} else if (uri.indexOf("test.gos") != -1) {

			HttpSession session = req.getSession();
			UserInfo info = (UserInfo) session.getAttribute("UserInfo");

			if (info != null) {
				String userId = info.getUserId();
				UserDTO dto = dao.getReadData(userId);

				req.setAttribute("dto", dto);
			}

			url = "/joden/login/test.jsp";
			forward(req, resp, url);
			return;

		} else if (uri.indexOf("updated_ok.gos") != -1) {

			UserDTO dto = new UserDTO();

			dto.setUserPwd(req.getParameter("userPwd"));
			dto.setUserName(req.getParameter("userName"));
			dto.setUserEmail(req.getParameter("userEmail"));
			dto.setUserTel(req.getParameter("userTel"));
			dto.setUserGender(req.getParameter("userGender"));
			dto.setUserAddr(req.getParameter("userAddr"));
			dto.setUserBirth(req.getParameter("userBirth"));

			dao.updateData(dto);

			url = cp + "/joden/login/updated_ok.gos";
			resp.sendRedirect(url);

		}
	}

}
