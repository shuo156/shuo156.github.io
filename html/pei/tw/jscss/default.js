
function chkidno(Id) {
    //轉大寫 
    Id = Id.toUpperCase()
    //除空白 
    while (Id.indexOf(" ") != -1) {
        Id = Id.replace(" ", "")
    }
    
    //比對長度 
    if (Id.length != 10) { return 'N' }

    //判斷第一碼 
    var Id1 = "ABCDEFGHJKLMNPQRSTUVXYWZIO"

    //	if (Id1.indexOf(Id.substring(0,1)) == -1){alert("身分證字號第一碼為英文");return false} 
    { Id1 = Id1.indexOf(Id.substring(0, 1)) + 10 }    
    //判斷後九碼 
    //if (isNaN(Id.substring(1,10))){alert("身分證字號後九碼為數字");return false} 
    //轉換字串 
    Id = Id.replace(Id.substring(0, 1), Id1)
    //計算數字和 
    var Idsum = 0
    Idsum = Id.substring(0, 1) * 1 + Id.substring(10, 11) * 1
    for (i = 1; i < 10; i++) {
        Idsum = Idsum + Id.substring(i, i + 1) * (10 - i)
    }
    //判對是否正確    

    if ((Idsum % 10) != 0) {
        return 'N';
    }
    else {
        return 'Y';
    }
    
}

function isAvail(chkStr) {
    var cmp = "0123456789";
    var rc = true;
    var cmpChar;

    for (var i = 0; i < chkStr.length; i++) {
        cmpChar = chkStr.substring(i, i + 1)
        if (cmp.indexOf(cmpChar) < 0)
            rc = false;
    }
    return rc;
}

function isAvaildate(chkStr) {
    var cmp = "0123456789-/";
    var rc = true;
    var cmpChar;

    for (var i = 0; i < chkStr.length; i++) {
        cmpChar = chkStr.substring(i, i + 1)
        if (cmp.indexOf(cmpChar) < 0)
            rc = false;
    }
    return rc;
}

function isAvailnumdot(chkStr) {
    var cmp = "0123456789.";
    var rc = true;
    var cmpChar;

    for (var i = 0; i < chkStr.length; i++) {
        cmpChar = chkStr.substring(i, i + 1)
        if (cmp.indexOf(cmpChar) < 0)
            rc = false;
    }
    return rc;
}

function isAvail_tel(chkStr) {
    var cmp = "0123456789()-";
    var rc = true;
    var cmpChar;

    for (var i = 0; i < chkStr.length; i++) {
        cmpChar = chkStr.substring(i, i + 1)
        if (cmp.indexOf(cmpChar) < 0)
            rc = false;
    }
    return rc;
}

function KeyPressPhone(key) {
    if ((key >= 48 && key <= 57) || (key == 35) || (key == 45) || (key == 40) || (key == 41)) {
        return true;
    }
    else {
        return false;
    }
}

function KeyPressOnlyNum(key) {
    if (key >= 48 && key <= 57) {
        return true;
    }
    else {
        return false;
    }
}

function KeyPressOnlyNumDot(key) {
    if ((key >= 48 && key <= 57) || (key == 46)) {
        return true;
    }
    else {
        return false;
    }
}



function checkDate(str) {
    var t = Date.parse(str);
    if (isNaN(t)) {
        return false;
    } else {
        return true;
    }
}