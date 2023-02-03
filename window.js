var xhttp = new XMLHttpRequest;
xhttp.onreadystatechange = function() {
    if (4 == this.readyState && 200 == this.status) {
        var t = JSON.parse(this.responseText);
        document.getElementById("progress").style.visibility = "hidden";
        var e = t.flags.png;
        e.replace("https://net.info.az/flags/png/", "flags/");
        document.getElementById("flag").src = e;
        document.getElementById("location").href = "https://www.google.com/maps/place/" + t.location.lat + "," + t.location.lon;
        document.getElementById("city").innerHTML = t.city;
        document.getElementById("ip").innerHTML = t.ip;
        document.getElementById("state").innerHTML = t.state;
        document.getElementById("country").innerHTML = t.country;
    }
}, xhttp.open("GET", "https://net.info.az/api", !0), xhttp.send();

var queryInfo = {
    active: true,
    currentWindow: true
};





chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];
    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;


    chrome.storage.local.get(["detect_website"]).then((result) => {

        var object = result["detect_website"];

        //console.log("object is " + object);

        if (object == "1")
            detectWebsite(url);
        else document.getElementById("hostname").remove();
    });

});


function detectWebsite(url) {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        document.getElementById("hostname").remove();
        return;
    }

    var hostname = extractHostname(url);
    //console.log('Chrome URL', url);

    var key = hostname + "_json";

    chrome.storage.local.get([key]).then((result) => {


        var object = result[key];
        //console.log("object is " + object);
        var json = JSON.parse(object);
        //console.log("json is " + json);
        var flag = "/flags/" + json.country_code + ".png";

        //console.log("country_code is " + json.country_code);
        //console.log("/flags/" + country_code + ".png");

        if (object != undefined) {
            document.getElementById("host_progress").style.visibility = "hidden";
            document.getElementById("host_flag").src = flag;
            document.getElementById("host_location").href = "https://www.google.com/maps/place/" + json.location.lat + "," + json.location.lon;
            document.getElementById("host_city").innerHTML = json.city;
            document.getElementById("host_ip").innerHTML = json.ip;
            document.getElementById("host_state").innerHTML = json.state;
            document.getElementById("host_country").innerHTML = json.country;
            document.getElementById("host_hostname").innerHTML = hostname;
        }


    });



}


function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    } else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}