let base_url = "https://scamalytics.com/ip/"

var url = "https://api.ip.sb/geoip"
var opts = {
    policy: $environment.params
};
var myRequest = {
    url: url,
    opts: opts,
    timeout: 4000
};

var message = ""
const paras = ["ip","isp","country_code","city"]
const paran = ["IP","ISP","地区","城市"]
$task.fetch(myRequest).then(response => {
    message = response? json2info(response.body,paras) : ""
    let ip = JSON.parse(response.body)["ip"]
    var myRequest1 = {
        url: base_url+ip,
        opts: opts,
        timeout: 4000
    };
    var myRequest2 = {
        url: "https://api.ipdata.co/?api-key=e2591b3a85fca5a39e04c34f530fc8d4b82400ff70df867b67eb3681&ip="+ip,
        opts: opts,
        timeout: 4000
    };

    $task.fetch(myRequest1).then(response => {
        $task.fetch(myRequest2).then(resp => {
            message = message + Display(response.body, JSON.parse(resp.body))
            message = message+ "------------------------------"+"</br>"+"<font color=#6959CD>"+"<b>节点</b> ➟ " + $environment.params+ "</font>"
            message =  `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">` + message + `</p>`
            $done({"title": "🔎  查询结果", "htmlMessage": message});
        }),reason => {
            message = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: bold;">` + message + `</p>`
            $done({"title": "🔎  查询结果", "htmlMessage": message});
        }
    }, reason => {
        message = "</br></br>🛑 查询超时"
        message = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: bold;">` + message + `</p>`
        $done({"title": "🔎  查询结果", "htmlMessage": message});
    })
}, reason => {
    message = "</br></br>🛑 查询超时"
    message = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: bold;">` + message + `</p>`
    $done({"title": "🔎  查询结果", "htmlMessage": message});
})

function json2info(cnt,paras) {
    var res = "------------------------------"
    cnt =JSON.parse(cnt)
    for (i=0;i<paras.length;i++) {
        cnt[paras[i]] = paras[i] == "country_code"? cnt[paras[i]]+" ⟦"+flags.get(cnt[paras[i]].toUpperCase())+"⟧":cnt[paras[i]]
        res = cnt[paras[i]]?   res +"</br><b>"+ "<font  color=>" +paran[i] + "</font> : " + "</b>"+ "<font  color=>"+cnt[paras[i]] +"</font></br>" : res
    }
    // res =res+ "------------------------------"+"</br>"+"<font color=#6959CD>"+"<b>节点</b> ➟ " + $environment.params+ "</font>"
    // res =  `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">` + res + `</p>`
    return res
}

function Display(cnt, data) {
    let score = cnt.indexOf(`"score":`)!=-1 ? cnt.split(`"score":`)[1].split("\n")[0]: "NA"
    score = "</br><b>"+ "<font  color=>" +"欺诈 " + "</font> : " + "</b>"+ "<font  color=>"+ score.replace(/"|,/g,"") +"</font></br>"
    let risk = cnt.indexOf(`"risk":`)!=-1 ?  cnt.split(`"risk":`)[1].split("\n")[0] : "NA"
    risk = "</br><b>"+ "<font  color=>" +"风险 " + "</font> : " + "</b>"+ "<font  color=>"+ E2C(risk.replace(/"|,/g,"")) +"</font></br>"
    risk = risk + "</br><b>"+ "<font  color=>" +"代理 " + "</font> : " + "</b>"+ "<font  color=>"+data["threat"]["is_proxy"]+"</font></br>"
    risk = risk + "</br><b>"+ "<font  color=>" +"恶意 " + "</font> : " + "</b>"+ "<font  color=>"+data["threat"]["is_known_attacker"]+"</font></br>"
    risk = risk + "</br><b>"+ "<font  color=>" +"滥用 " + "</font> : " + "</b>"+ "<font  color=>"+data["threat"]["is_known_abuser"]+"</font></br>"
    risk = risk + "</br><b>"+ "<font  color=>" +"类型 " + "</font> : " + "</b>"+ "<font  color=>"+data.asn.type+"</font></br>"
    return (score+risk)
}

//极高风险‼️、高风险⚠️ 和 中风险🟡 低风险✅
function E2C(cnt){
    res = "NA"
    if (cnt.indexOf("very high")!=-1) {
        res = "极高风险 ‼️"
    } else if(cnt.indexOf("high")!=-1) {
        res = "高风险 ⚠️"
    } else if(cnt.indexOf("medium")!=-1) {
        res = "中风险 🟡"
    } else if(nt.indexOf("low")!=-1) {
        res = "低风险 ✅"
    }
    return res
}

var flags = new Map([[ "AC" , "🇦🇨" ] ,["AE","🇦🇪"], [ "AF" , "🇦🇫" ] , [ "AI" , "🇦🇮" ] , [ "AL" , "🇦🇱" ] , [ "AM" , "🇦🇲" ] , [ "AQ" , "🇦🇶" ] , [ "AR" , "🇦🇷" ] , [ "AS" , "🇦🇸" ] , [ "AT" , "🇦🇹" ] , [ "AU" , "🇦🇺" ] , [ "AW" , "🇦🇼" ] , [ "AX" , "🇦🇽" ] , [ "AZ" , "🇦🇿" ] , ["BA", "🇧🇦"], [ "BB" , "🇧🇧" ] , [ "BD" , "🇧🇩" ] , [ "BE" , "🇧🇪" ] , [ "BF" , "🇧🇫" ] , [ "BG" , "🇧🇬" ] , [ "BH" , "🇧🇭" ] , [ "BI" , "🇧🇮" ] , [ "BJ" , "🇧🇯" ] , [ "BM" , "🇧🇲" ] , [ "BN" , "🇧🇳" ] , [ "BO" , "🇧🇴" ] , [ "BR" , "🇧🇷" ] , [ "BS" , "🇧🇸" ] , [ "BT" , "🇧🇹" ] , [ "BV" , "🇧🇻" ] , [ "BW" , "🇧🇼" ] , [ "BY" , "🇧🇾" ] , [ "BZ" , "🇧🇿" ] , [ "CA" , "🇨🇦" ] , [ "CF" , "🇨🇫" ] , [ "CH" , "🇨🇭" ] , [ "CK" , "🇨🇰" ] , [ "CL" , "🇨🇱" ] , [ "CM" , "🇨🇲" ] , [ "CN" , "🇨🇳" ] , [ "CO" , "🇨🇴" ] , [ "CP" , "🇨🇵" ] , [ "CR" , "🇨🇷" ] , [ "CU" , "🇨🇺" ] , [ "CV" , "🇨🇻" ] , [ "CW" , "🇨🇼" ] , [ "CX" , "🇨🇽" ] , [ "CY" , "🇨🇾" ] , [ "CZ" , "🇨🇿" ] , [ "DE" , "🇩🇪" ] , [ "DG" , "🇩🇬" ] , [ "DJ" , "🇩🇯" ] , [ "DK" , "🇩🇰" ] , [ "DM" , "🇩🇲" ] , [ "DO" , "🇩🇴" ] , [ "DZ" , "🇩🇿" ] , [ "EA" , "🇪🇦" ] , [ "EC" , "🇪🇨" ] , [ "EE" , "🇪🇪" ] , [ "EG" , "🇪🇬" ] , [ "EH" , "🇪🇭" ] , [ "ER" , "🇪🇷" ] , [ "ES" , "🇪🇸" ] , [ "ET" , "🇪🇹" ] , [ "EU" , "🇪🇺" ] , [ "FI" , "🇫🇮" ] , [ "FJ" , "🇫🇯" ] , [ "FK" , "🇫🇰" ] , [ "FM" , "🇫🇲" ] , [ "FO" , "🇫🇴" ] , [ "FR" , "🇫🇷" ] , [ "GA" , "🇬🇦" ] , [ "GB" , "🇬🇧" ] , [ "HK" , "🇭🇰" ] ,["HU","🇭🇺"], [ "ID" , "🇮🇩" ] , [ "IE" , "🇮🇪" ] , [ "IL" , "🇮🇱" ] , [ "IM" , "🇮🇲" ] , [ "IN" , "🇮🇳" ] , [ "IS" , "🇮🇸" ] , [ "IT" , "🇮🇹" ] , [ "JP" , "🇯🇵" ] , [ "KR" , "🇰🇷" ] , [ "LU" , "🇱🇺" ] , [ "MO" , "🇲🇴" ] , [ "MX" , "🇲🇽" ] , [ "MY" , "🇲🇾" ] , [ "NL" , "🇳🇱" ] , [ "PH" , "🇵🇭" ] , [ "RO" , "🇷🇴" ] , [ "RS" , "🇷🇸" ] , [ "RU" , "🇷🇺" ] , [ "RW" , "🇷🇼" ] , [ "SA" , "🇸🇦" ] , [ "SB" , "🇸🇧" ] , [ "SC" , "🇸🇨" ] , [ "SD" , "🇸🇩" ] , [ "SE" , "🇸🇪" ] , [ "SG" , "🇸🇬" ] , [ "TH" , "🇹🇭" ] , [ "TN" , "🇹🇳" ] , [ "TO" , "🇹🇴" ] , [ "TR" , "🇹🇷" ] , [ "TV" , "🇹🇻" ] , [ "TW" , "🇨🇳" ] , [ "UK" , "🇬🇧" ] , [ "UM" , "🇺🇲" ] , [ "US" , "🇺🇸" ] , [ "UY" , "🇺🇾" ] , [ "UZ" , "🇺🇿" ] , [ "VA" , "🇻🇦" ] , [ "VE" , "🇻🇪" ] , [ "VG" , "🇻🇬" ] , [ "VI" , "🇻🇮" ] , [ "VN" , "🇻🇳" ] , [ "ZA" , "🇿🇦"]])
