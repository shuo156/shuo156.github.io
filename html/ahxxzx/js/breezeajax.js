//根据浏览器的不同创建AJAX对象
function createAjax()
{
	var _xmlhttp;
	try
	{
		_xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	catch(e)
	{
		try
		{
			_xmlhttp=new XMLHttpRequest();
		}
		catch(e)
		{
			_xmlhttp=false;
		}
	}
	return _xmlhttp;
}
function checkcsv(c)
{
	var c1 = document.getElementById(c).value;
	var c2 = c1.split(".");var c3= c2.length - 1;
	var j = c2[c3];j = j.toLowerCase();
	if(j!= "csv" && j!="xls")
	{
		alert("文件格式不正确哦，只允许上传csv文件");return false;
	}else if(j=="xls"){
		alert("请把该EXCEL文件打开，另存为CSV格式文件，再上传该CSV文件");return false;
	}
	return true;
}
//删除多余的空格
function trim(str)  
{ 
  return str.replace(/(^\s*)|(\s*$)/g,"");
  //或者return(rTrim(lTrim(str)));
}
/// <summary>
/// 根据id查找对象
/// </summary>
/// <param name="id">id名称</param>
/// <param name="parent">容器对象</param>
/// <returns>页面元素对象</returns>
function $(id, parent)
{
    parent = (parent ? (parent.document ? parent.document : parent) : document);
    return parent.getElementById(id);
}

//AJAX_post方法
/*
	url :请求的服务器地址
	sendstr:以POST方式传递过去的字符串
	ajaxtype:以GET方式还是POST方式0是GET1是POST
	op:自己定义的，对应的操作
*/
function breezeajax(url,sendstr,ajaxtype,op)
{
	/* Ajax处理登录*/
		var ajax=createAjax();
		if(ajaxtype)//POST
		{
			ajax.open("POST",url,true);
		}
		else
		{
			ajax.open("GET",url,true);
		}
		ajax.onreadystatechange= function()
		{
			if(ajax.readyState==4)
			{
			if(ajax.status==200)
			{
					var info = ajax.responseText;
					info = trim(info);
					if(trim(op).substr(0,1)=="#")
					{
						eval(trim(op).substr(1))(info);return;
					}
					switch(trim(op))//针对各种情况，执行各种操作
					{
						
						//-----------------------------------------------------------------超级管理员登录-----------------------------------------------------
						case "delinfo"://删除单条信息
							//alert(info);
							if(info=="breezeqx")
							{
								alert("对不起，您所在的用户组没有权限");return false;
							}
							info = info.split("^");
							var p = "tr"+trim(info[0]);
							if(trim(info[1]) == "ok")
							{
								document.getElementById(p).style.display='none';
						
							}
							else if(trim(info[1]) == "sorry")
							{
								alert("对不起,您不能删除它");
							}
							
						break;
						case "settype":
							//alert(info);
							var alla = info.split("#");
							var labels=alla[0].split("|");
							document.getElementById(alla[2]).options.length=0;
							if(document.all)
							{
								if(alla[3].length>0)//添加了顶端类别
								{
									document.getElementById(alla[2]).add(document.createElement("OPTION"));
									document.getElementById(alla[2]).options[0].text=alla[3];
									document.getElementById(alla[2]).options[0].value="0";
								}
								for(var ii=0;ii<labels.length;ii++)
								{
									var nn = labels[ii].split("*");
									if(alla[3].length>0){var jj = ii+1;}else{var jj = ii;}
									document.getElementById(alla[2]).add(document.createElement("OPTION"));
									document.getElementById(alla[2]).options[jj].text=nn[1];
									document.getElementById(alla[2]).options[jj].value=nn[0];
								}
							}
							else
							{
								if(alla[3].length>0)//添加了顶端类别
								{
									var option = document.createElement("option");
									option.text = alla[3];
									option.value = "0";
									document.getElementById(alla[2]).appendChild(option);
								}
								for(var ii=0;ii<labels.length;ii++)
								{
									var nn = labels[ii].split("*");
									if(alla[3].length>0){var jj = ii+1;}else{var jj = ii;}
									var option = document.createElement("option");
									option.text = nn[1];
									option.value = nn[0];
									document.getElementById(alla[2]).appendChild(option);
									
								}
								
							}
							document.getElementById(alla[2]).selectedIndex = 0; 
							break;
					}
			}
			else{alert(ajax.status);}
			}

		}
		if(ajaxtype)//post
		{
			ajax.setRequestHeader('Content-type','application/x-www-form-urlencoded');
			ajax.send(sendstr);
		}
		else
		{
			ajax.send(null);
		}
}


//获取单选按纽选定值 - 指定radio的name 属性
function radiovalue(n)
{
  var temp=document.getElementsByName(n);
  for (i=0;i<temp.length;i++){
  //遍历Radio
     if(temp[i].checked)
     {
		return temp[i].value;
      }
  }
  return 0;
}

/*
二级联动菜单通用函数
Author:BreezeXu Date:2009-8-26 anyproblem please link qq 56469038
bigid : 二级联动的大类ID名
smallid : 二级联动的小类ID名
tb:获取分类的表名
zd:获取表名的字段名 zd1|zd2 其中zd1是option里的value值 zd2是option里的text值
addop:是否需要添加个option 比如所有小类 是的话对应的value都是0 如果addop是空的话，则不需要添加这个option
该函数需要配合breezeajax.js使用 
*/
function settype(bigid,smallid,tb,zd,addop)
{
	var bigvalue = document.getElementById(bigid).value;
	// Ajax处理登录
	var url="/ajaxprocess.php?menu=settype";
	var sendstr = "bigid="+bigid+"&smallid="+smallid+"&tb="+tb+"&zd="+zd+"&bigvalue="+bigvalue+"&addop="+encodeURIComponent(escape(addop));
	breezeajax(url,sendstr,1,"settype");//POST方式。对应的LOGIN操作在上面		
}
function settypep(bigid,smallid,tb,zd,addop)
{
	var bigvalue = document.getElementById(bigid).value;
	// Ajax处理登录
	var url="/ajaxprocess.php?menu=settypep";
	var sendstr = "bigid="+bigid+"&smallid="+smallid+"&tb="+tb+"&zd="+zd+"&bigvalue="+bigvalue+"&addop="+encodeURIComponent(escape(addop));
	breezeajax(url,sendstr,1,"settype");//POST方式。对应的LOGIN操作在上面		
}
/*

//登陆
function Login()
{
   if(CheckUser() && CheckPwd() && CheckCode())
   {
       var newdiv = $("SubMsg");
	   var newdiv1 = $("CodeSpan");
       newdiv.className = "divprompt";
       newdiv.innerHTML = "<img src='../images/wait.gif'/>";
       var un = $("User_Name").value;
       var pw = $("User_Pwd").value;
	   var code = $("VerifyCode").value;
	   
       newdiv.style.display = "";
       un = trim(un);
       pw = trim(pw);
	   code = trim(code);
	   // Ajax处理登录
	   var url="adminajax.php?menu=login";
	   var sendstr = "name="+un+"&pwd="+pw+"&code="+code;
	   breezeajax(url,sendstr,1,"login");//POST方式。对应的LOGIN操作在上面		
	}
}

对应服务器程序的头部
	  response.charset = "gb2312"
	  Response.Buffer =True
      Response.ExpiresAbsolute =Now() - 1
      Response.Expires=0
      Response.CacheControl="no-cache"
*/

