//get JSON object from http://it2wi1.if-lab.de/rest/ft_ablauf (project resource)
var http = require("http");
http.get("http://it2wi1.if-lab.de/rest/ft_ablauf", (res) => {
    const { statusCode} = res;
    const contentType = res.headers["content-type"];

    let error;
    //200 = success

    // TEST über VSC
    // ashdashhdsa

    if(statusCode !== 200) {
        error = new Error("Request Failed.\n" + "Status Code: ${statusCode}");
    } else if (!/^application\/json/.test(contentType)) {
        error = new Error("Invalid content-type.\n" + "Expected application/json but received ${contentType}");
    }
    if(error) {
        console.error(error.message);
        //free up memory
        res.resume();
        return;
    }

    res.setEncoding("utf8");
    let rawData = "";
    res.on("data", (chunk) => { rawData += chunk; });
    res.on("end", () => {
        try {
            const parsedData = JSON.parse(rawData);
            console.log(parsedData);
        } catch (e) {
            console.error(e.message);
        }
    });
}).on("error", (e) => {
    console.error("Got error: ${e.message}");
});

