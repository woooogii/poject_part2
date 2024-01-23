package com.gosutil;

public class MyUtil {
	//전체 페이지의 갯수를 구하는 메소드
	
	public int getPageCount(int numPerPage, int dataCount) {
		
		int pageCount = 0;
		pageCount = dataCount / numPerPage;
		if(dataCount % numPerPage !=0) {
			pageCount++;
		}
		return pageCount;	
	}
	
	//페이징처리 메소드
	 
	public String pageIndexList(int currentPage, int totalPage, String listUrl) {
		
		int numPerBlock = 5;
		int currentPageSetup = 6;
		int page;
		
		StringBuffer sb = new StringBuffer();
		
		if(currentPage==0 || totalPage==0) {
			return "";
		}
		
		//listUrl > list.jsp 넣어놓을 예정
		
		//list.jsp?searchKey=name&searchValue=suzi
		if(listUrl.indexOf("?")!=-1) {//list.jsp뒤에 ?가 있으면
			listUrl = listUrl+"&";//
		}else {//list.jsp + ? + 페이지넘버(pageNum=2)
			listUrl = listUrl+"?";
		}
		
		currentPageSetup = (currentPage/numPerBlock)*numPerBlock;
		
		if(currentPage%numPerBlock==0) {
			currentPageSetup=currentPageSetup-numPerBlock;
		}
		
		//◀이전 > 만들기
		if(totalPage > numPerBlock && currentPageSetup>0) {
			sb.append("<a href=\""+listUrl+"pageNum="+currentPageSetup+"\">◀이전</a>&nbsp;");//\" > 문자로 인식
		}//<a href="list.jsp?pageNum=5">◀이전</a>&nbsp;
		
		//바로가기 페이지
		page = currentPageSetup+1;
		while(page<=totalPage && page<=(currentPageSetup+numPerBlock)) {
			
			if(page==currentPage) {
				sb.append("<font color=\"Fuchsia\">"+page+"</font>&nbsp;");
				//<font color="Fuchsia">page</font>&nbsp;
			}else {
				sb.append("<a href=\""+listUrl+"pageNum="+page+"\">"+page+"</a>&nbsp;");
				//<a href="list.jsp?pageNum=2">2</a>&nbsp;
			}
			page++;
		}
		
		//다음▶ > 만들기
		
		if(totalPage-currentPageSetup>numPerBlock) {
			sb.append("<a href=\""+listUrl+"pageNum="+page+"\">다음▶</a>&nbsp;");
			//<a href="list.jsp?pageNum=6">▶다음</a>&nbsp;
		}
		return sb.toString();
		
		
		
		
		
		
	
	}
	

	
	
	
}
