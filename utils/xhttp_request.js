function get(url,params = undefined, response, readyState = 4, status = 200, request_header = [{ key: "Content-Type", value: "application/x-www-form-urlencoded" }]) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
       
        if (this.readyState == readyState && this.status == status) {
            response(this.responseText)
        }
    }
    xhttp.open("GET", url, true);

    for (var p in request_header) {
        xhttp.setRequestHeader(request_header[p].key, request_header[p].value);
    }

    xhttp.send();
}

function post(url, params = undefined, response, readyState = 4, status = 200, request_header = [{ key: "Content-Type", value: "application/x-www-form-urlencoded" }]) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == readyState && this.status == status) {
            response(this.responseText)
        }
    }
    xhttp.open("POST", url, true);

    for (var p in request_header) {
        xhttp.setRequestHeader(request_header[p].key, request_header[p].value);
    }

    xhttp.send(params != undefined ? params : "");
}