function vote(){
	var vt = parseInt($('hvotetype').value);//0�ǵ�ѡ 1�Ƕ�ѡ
	var v;//ͶƱѡ��
	var c = getCookie("vote");
	if(c=="YES"){alert('�Բ������Ѿ�ͶƱ�����������ظ�ͶƱ');return false;}
	
	//��ѡ
	if(vt==0){
		v = radiovalue('item');
		if(v==0){alert('������ѡ��һ��ѡ��ͶƱ��');return false;}
	}
	//��ѡ
	else if(vt==1){
		var v = $("cv").value;
		if(v==""){
			alert('������ѡ��һ��ѡ��ͶƱ��');return false;
		}
	}
	//��ʼͶƱ
	var url="/ajaxprocess.php?menu=vote";
	var sendstr = "v="+v+"&vt="+vt;
	breezeajax(url,sendstr,1,"#_vote");
}
//�����ѡ��
function setc(v,c){
	var cv = $("cv").value;
	//ѡ��
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
		alert("ͶƱ�ɹ�");
		//����COOKIE��¼
		setCookie("vote","YES","h12");
		//��ͶƱ��ʾҳ
		window.open("/index.php?menu=vote&id="+infoa[1]+"",'','width=600,heigth=200,toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,top=150,left=200')
	}else{alert("�����ˣ��������Ա��ϵ");}
}