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
$task.fetch(myRequest).then(resp => {
    let ip = JSON.parse(resp.body)["ip"]
    var myRequest1 = {
        url: "https://api.ipdata.co/"+ip+"?api-key=e2591b3a85fca5a39e04c34f530fc8d4b82400ff70df867b67eb3681",
        opts: opts,
        timeout: 4000
    };
    $task.fetch(myRequest1).then(response => {
        message = Display(response.body)
        message = message+ "------------------------------"+"</br>"+"<font color=#6959CD>"+"<b>节点</b> ➟ " + $environment.params+ "</font>"
        message =  `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">` + message + `</p>`
        $done({"title": "🔎  查询结果", "htmlMessage": message});
    }), reason => {
        message = "</br></br>🛑 查询超时"
        message = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: bold;">` + message + `</p>`
        $done({"title": "🔎  查询结果", "htmlMessage": message});
    }
}, reason => {
    message = "</br></br>🛑 查询超时"
    message = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: bold;">` + message + `</p>`
    $done({"title": "🔎  查询结果", "htmlMessage": message});
})

function Display(resp) {
    let body = JSON.parse(resp)
    let data =""
    data = data + "</br><b>"+ "<font  color=>" +"I P " + "</font> : " + "</b>"+ "<font  color=>"+body.ip+"</font></br>"
    data = data + "</br><b>"+ "<font  color=>" +"ISP " + "</font> : " + "</b>"+ "<font  color=>"+body.asn.name+"</font></br>"
    data = data + "</br><b>"+ "<font  color=>" +"邮编 " + "</font> : " + "</b>"+ "<font  color=>"+body.postal+"</font></br>"
    data = data + "</br><b>"+ "<font  color=>" +"地区 " + "</font> : " + "</b>"+ "<font  color=>"+body.country_code+"⟦"+data.emoji_flag+"⟧</font></br>"
    data = data + "</br><b>"+ "<font  color=>" +"大洲 " + "</font> : " + "</b>"+ "<font  color=>"+body.continent_name+"</font></br>"
    data = data + "</br><b>"+ "<font  color=>" +"城市 " + "</font> : " + "</b>"+ "<font  color=>"+body.city+"</font></br>"
    data = data + "</br><b>"+ "<font  color=>" +"类型 " + "</font> : " + "</b>"+ "<font  color=>"+body.asn.type+"</font></br>"
    data = data + "</br><b>"+ "<font  color=>" +"恶意 " + "</font> : " + "</b>"+ "<font  color=>"+body.threat.is_known_attacker+"</font></br>"
    data = data + "</br><b>"+ "<font  color=>" +"滥用 " + "</font> : " + "</b>"+ "<font  color=>"+body.threat.is_known_abuser+"</font></br>"
    return data
}
