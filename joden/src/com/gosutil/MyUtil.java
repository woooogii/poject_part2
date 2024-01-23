package com.gosutil;

public class MyUtil {
	//��ü �������� ������ ���ϴ� �޼ҵ�
	
	public int getPageCount(int numPerPage, int dataCount) {
		
		int pageCount = 0;
		pageCount = dataCount / numPerPage;
		if(dataCount % numPerPage !=0) {
			pageCount++;
		}
		return pageCount;	
	}
	
	//����¡ó�� �޼ҵ�
	 
	public String pageIndexList(int currentPage, int totalPage, String listUrl) {
		
		int numPerBlock = 5;
		int currentPageSetup = 6;
		int page;
		
		StringBuffer sb = new StringBuffer();
		
		if(currentPage==0 || totalPage==0) {
			return "";
		}
		
		//listUrl > list.jsp �־���� ����
		
		//list.jsp?searchKey=name&searchValue=suzi
		if(listUrl.indexOf("?")!=-1) {//list.jsp�ڿ� ?�� ������
			listUrl = listUrl+"&";//
		}else {//list.jsp + ? + �������ѹ�(pageNum=2)
			listUrl = listUrl+"?";
		}
		
		currentPageSetup = (currentPage/numPerBlock)*numPerBlock;
		
		if(currentPage%numPerBlock==0) {
			currentPageSetup=currentPageSetup-numPerBlock;
		}
		
		//������ > �����
		if(totalPage > numPerBlock && currentPageSetup>0) {
			sb.append("<a href=\""+listUrl+"pageNum="+currentPageSetup+"\">������</a>&nbsp;");//\" > ���ڷ� �ν�
		}//<a href="list.jsp?pageNum=5">������</a>&nbsp;
		
		//�ٷΰ��� ������
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
		
		//������ > �����
		
		if(totalPage-currentPageSetup>numPerBlock) {
			sb.append("<a href=\""+listUrl+"pageNum="+page+"\">������</a>&nbsp;");
			//<a href="list.jsp?pageNum=6">������</a>&nbsp;
		}
		return sb.toString();
		
		
		
		
		
		
	
	}
	

	
	
	
}
