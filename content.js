var currentTab = "";

chrome.tabs.onActivated.addListener(function(info) {
    getCurrentTabUrl();
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

    if (currentTab != tab.url) {
        currentTab = tab.url;
        getCurrentTabUrl();

    }
});

function getCurrentTabUrl() {

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
            else chrome.action.setIcon({ path: "/icons/logo_128.png" });
        });

    });
}

function detectWebsite(url) {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        chrome.action.setIcon({ path: "/icons/logo_128.png" });
        return;
    }

    var hostname = extractHostname(url);
    console.log('Chrome URL', url);


    var key = hostname + "_country_code";

    chrome.storage.local.get([key]).then((result) => {

        var country_code = result[key];
        //console.log("country_code is " + country_code);
        //console.log("/flags/" + country_code + ".png");

        if (country_code === undefined)
            onSendQuery(hostname);
        else chrome.action.setIcon({ path: "/flags/" + country_code + ".png" });
    });


}

function onSendQuery(hostname) {
    console.log('https://net.info.az/api/hostname/' + hostname);

    fetch('https://net.info.az/api/hostname/' + hostname)
        .then((response) => response.json())
        .then((obj) => {
            console.log(obj);
            console.log(obj.country_code);

            var key = hostname + "_country_code";
            var value = obj.country_code;

            var json_key = hostname + "_json";
            var json_value = JSON.stringify(obj);


            chrome.storage.local.set({
                [key]: value
            }).then(() => {
                console.log(key + " Value is set to " + value);
            });

            chrome.storage.local.set({
                [json_key]: json_value
            }).then(() => {
                console.log(json_key + " Value is set to " + json_value);
            });

            chrome.action.setIcon({
                path: "/flags/" + obj.country_code + ".png"
            });


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