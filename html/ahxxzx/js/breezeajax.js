//����������Ĳ�ͬ����AJAX����
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
		alert("�ļ���ʽ����ȷŶ��ֻ�����ϴ�csv�ļ�");return false;
	}else if(j=="xls"){
		alert("��Ѹ�EXCEL�ļ��򿪣����ΪCSV��ʽ�ļ������ϴ���CSV�ļ�");return false;
	}
	return true;
}
//ɾ������Ŀո�
function trim(str)  
{ 
  return str.replace(/(^\s*)|(\s*$)/g,"");
  //����return(rTrim(lTrim(str)));
}
/// <summary>
/// ����id���Ҷ���
/// </summary>
/// <param name="id">id����</param>
/// <param name="parent">��������</param>
/// <returns>ҳ��Ԫ�ض���</returns>
function $(id, parent)
{
    parent = (parent ? (parent.document ? parent.document : parent) : document);
    return parent.getElementById(id);
}

//AJAX_post����
/*
	url :����ķ�������ַ
	sendstr:��POST��ʽ���ݹ�ȥ���ַ���
	ajaxtype:��GET��ʽ����POST��ʽ0��GET1��POST
	op:�Լ�����ģ���Ӧ�Ĳ���
*/
function breezeajax(url,sendstr,ajaxtype,op)
{
	/* Ajax�����¼*/
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
					switch(trim(op))//��Ը��������ִ�и��ֲ���
					{
						
						//-----------------------------------------------------------------��������Ա��¼-----------------------------------------------------
						case "delinfo"://ɾ��������Ϣ
							//alert(info);
							if(info=="breezeqx")
							{
								alert("�Բ��������ڵ��û���û��Ȩ��");return false;
							}
							info = info.split("^");
							var p = "tr"+trim(info[0]);
							if(trim(info[1]) == "ok")
							{
								document.getElementById(p).style.display='none';
						
							}
							else if(trim(info[1]) == "sorry")
							{
								alert("�Բ���,������ɾ����");
							}
							
						break;
						case "settype":
							//alert(info);
							var alla = info.split("#");
							var labels=alla[0].split("|");
							document.getElementById(alla[2]).options.length=0;
							if(document.all)
							{
								if(alla[3].length>0)//����˶������
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
								if(alla[3].length>0)//����˶������
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


//��ȡ��ѡ��Ŧѡ��ֵ - ָ��radio��name ����
function radiovalue(n)
{
  var temp=document.getElementsByName(n);
  for (i=0;i<temp.length;i++){
  //����Radio
     if(temp[i].checked)
     {
		return temp[i].value;
      }
  }
  return 0;
}

/*
���������˵�ͨ�ú���
Author:BreezeXu Date:2009-8-26 anyproblem please link qq 56469038
bigid : ���������Ĵ���ID��
smallid : ����������С��ID��
tb:��ȡ����ı���
zd:��ȡ�������ֶ��� zd1|zd2 ����zd1��option���valueֵ zd2��option���textֵ
addop:�Ƿ���Ҫ��Ӹ�option ��������С�� �ǵĻ���Ӧ��value����0 ���addop�ǿյĻ�������Ҫ������option
�ú�����Ҫ���breezeajax.jsʹ�� 
*/
function settype(bigid,smallid,tb,zd,addop)
{
	var bigvalue = document.getElementById(bigid).value;
	// Ajax�����¼
	var url="/ajaxprocess.php?menu=settype";
	var sendstr = "bigid="+bigid+"&smallid="+smallid+"&tb="+tb+"&zd="+zd+"&bigvalue="+bigvalue+"&addop="+encodeURIComponent(escape(addop));
	breezeajax(url,sendstr,1,"settype");//POST��ʽ����Ӧ��LOGIN����������		
}
function settypep(bigid,smallid,tb,zd,addop)
{
	var bigvalue = document.getElementById(bigid).value;
	// Ajax�����¼
	var url="/ajaxprocess.php?menu=settypep";
	var sendstr = "bigid="+bigid+"&smallid="+smallid+"&tb="+tb+"&zd="+zd+"&bigvalue="+bigvalue+"&addop="+encodeURIComponent(escape(addop));
	breezeajax(url,sendstr,1,"settype");//POST��ʽ����Ӧ��LOGIN����������		
}
/*

//��½
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
	   // Ajax�����¼
	   var url="adminajax.php?menu=login";
	   var sendstr = "name="+un+"&pwd="+pw+"&code="+code;
	   breezeajax(url,sendstr,1,"login");//POST��ʽ����Ӧ��LOGIN����������		
	}
}

��Ӧ�����������ͷ��
	  response.charset = "gb2312"
	  Response.Buffer =True
      Response.ExpiresAbsolute =Now() - 1
      Response.Expires=0
      Response.CacheControl="no-cache"
*/

