function vote(){
	var vt = parseInt($('hvotetype').value);//0是单选 1是多选
	var v;//投票选项
	var c = getCookie("vote");
	if(c=="YES"){alert('对不起，您已经投票过，不允许重复投票');return false;}
	
	//单选
	if(vt==0){
		v = radiovalue('item');
		if(v==0){alert('请至少选择一个选项投票！');return false;}
	}
	//多选
	else if(vt==1){
		var v = $("cv").value;
		if(v==""){
			alert('请至少选择一个选项投票！');return false;
		}
	}
	//开始投票
	var url="/ajaxprocess.php?menu=vote";
	var sendstr = "v="+v+"&vt="+vt;
	breezeajax(url,sendstr,1,"#_vote");
}
//点击复选框
function setc(v,c){
	var cv = $("cv").value;
	//选中
	if(c){
		if(cv==""){$("cv").value=v;}else{$("cv").value = cv+","+v;}
	}else{
		$("cv").value = $("cv").value.replace(v+",","");
		$("cv").value = $("cv").value.replace(","+v,"");
		$("cv").value = $("cv").value.replace(v,"");
	}
}
function _vote(info){
	var infoa = info.split("^");
	if(infoa[0]=="OK"){
		alert("投票成功");
		//设置COOKIE记录
		setCookie("vote","YES","h12");
		//打开投票显示页
		window.open("/index.php?menu=vote&id="+infoa[1]+"",'','width=600,heigth=200,toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,top=150,left=200')
	}else{alert("出错了，请与管理员联系");}
}