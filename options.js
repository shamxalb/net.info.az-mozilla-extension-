document.getElementById("cleaning").addEventListener("click", clearCache);
document.getElementById("checkbox").addEventListener("click", onCheckbox);
document.getElementById("progress").style.visibility = "hidden";
document.getElementById("message").innerHTML = "";

function clearCache() {

    document.getElementById("progress").style.visibility = "visible";

    chrome.storage.local.get(["detect_website"]).then((result) => {

        var object = result["detect_website"];
        var detect_website = "0";
        //console.log("object is " + object);

        if (object == "1") detect_website = "1";


        chrome.storage.local.clear(function() {
            var error = chrome.runtime.lastError;
            if (error) {

                document.getElementById("progress").style.visibility = "hidden";
                document.getElementById("message").innerHTML = error;
                //console.error(error);
            }
            // do something more
            document.getElementById("progress").style.visibility = "hidden";
            document.getElementById("message").innerHTML = "Cache Cleared.";

            chrome.storage.local.set({
                ["detect_website"]: detect_website
            }).then(() => {
                //console.log(key + " Value is set to " + value);
            });



        });



    });



}

function onCheckbox() {
    // Get the checkbox
    var checkbox = document.getElementById("checkbox");
    var message = document.getElementById("message");
    if (checkbox.checked == true) {
        message.innerHTML = "Auto detect is Enabled.";

        chrome.storage.local.set({
            ["detect_website"]: "1"
        }).then(() => {
            //console.log(key + " Value is set to " + value);
        });


    } else {
        message.innerHTML = "Auto detect is Disabled.";

        chrome.storage.local.set({
            ["detect_website"]: "0"
        }).then(() => {
            //console.log(key + " Value is set to " + value);
        });
    }
}

chrome.storage.local.get(["detect_website"]).then((result) => {

    var checkbox = document.getElementById("checkbox");
    var object = result["detect_website"];

    //console.log("object is " + object);

    if (object == "1")
        checkbox.checked = true;
    else checkbox.checked = false;
});