D.ajax = (options) => {
    return new Promise((success, reject) => {
        let {
            method,
            type,
            formData,
            data,
            url,
            onProgressUpload,
            headers,
            timeout
        } = options;

        let xhr = new XMLHttpRequest();

        xhr.open(method || "get", url);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        if (headers) {
            Object.keys(headers).forEach((header) => {
                xhr.setRequestHeader(header, headers[header]);
            });
        }

        if (timeout) {
            xhr.timeout = timeout * 1000;
        }

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (type === 'json') {
                    try {
                        const json = JSON.parse(xhr.responseText);
                        return success(json);
                    } catch (e) {
                       return reject(new Error(e.message));
                    }
                }

                return success(xhr.responseText);
            }
        };

        xhr.upload.onprogress = function(event) {
            const total = event.total;
            const load  = event.loaded;
            const percent  = load / total * 100;
            if (typeof onProgressUpload === 'function') {
                onProgressUpload(event, percent);
            }
        };

        let params = [];
        if (!formData && data) {
            const keys = Object.keys(data);
            keys.forEach((key) => {
                params.push(`${key}=${encodeURIComponent(data[key])}`);
            });
        }

        xhr.onerror   = (e) => reject(e);
        xhr.ontimeout = (e) => reject(e);

        xhr.send(formData || (params.length && params.join('&')) || null);
    });
};

module.exports = D.ajax;
