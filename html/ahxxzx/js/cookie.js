//���������Щ��Դ Add By BreezeXU 2010-5-7
//д��COOKIE
	//JS����cookies����!  //дcookies  
	/*
	function setCookie(name,value)  
	{  
		var Days = 30;  
		var exp = new Date();
		exp.setTime(exp.getTime() + Days*24*60*60*1000);
		document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();  
	} 
	
	//ʹ��ʾ�� 
	setCookie("name","hayden");  alert(getCookie("name"));    
	*/
	//�����Ҫ�趨�Զ������ʱ��  //��ô�������setCookie������������������������ok;    
	//�������  
	function setCookie(name,value,time)
	{
		var strsec = getsec(time);
		var exp = new Date();
		exp.setTime(exp.getTime() + strsec*1);
		document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
	}
	
	function getsec(str)
	{
		//alert(str); 
		var str1=str.substring(1,str.length)*1;
		var str2=str.substring(0,1);
		if (str2=="s")
		{
			return str1*1000; 
		}
		else if (str2=="h")
		{
			return str1*60*60*1000;
		}
		else if (str2=="d")
		{     
			return str1*24*60*60*1000;
		}
	}

	//��ȡcookies  
	function getCookie(name)  
	{
		var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		if(arr=document.cookie.match(reg)) return unescape(arr[2]);
		else return null;  
	}  
	//ɾ��cookies  
	function delCookie(name)  
	{
		var exp = new Date();  
		exp.setTime(exp.getTime() - 1);
		var cval=getCookie(name);
		if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();
	}  
	//�������趨����ʱ���ʹ��ʾ����  //s20�Ǵ���20��  //h��ָСʱ����12Сʱ���ǣ�h12  
	//d��������30����d30  //��ʱֻд�������֣���֪��˭�и��õķ������Ǻ�  setCookie("name","hayden","s20");