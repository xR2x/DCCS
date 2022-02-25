<%@ page contentType="text/html; charset=utf-8" %>
<%@ page import = "javax.servlet.http.HttpSession" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%if(session.getAttribute("user_id") == null){%>
<jsp:include page='/front/login.jsp'>
    <jsp:param name="title" value="${title}" />
</jsp:include>
<%}else{%>
<jsp:include page='/front/main.jsp'>
    <jsp:param name="title" value="${title}" />
</jsp:include>
<%}%>
