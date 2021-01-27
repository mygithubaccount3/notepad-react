import {API_URL} from '../.env';

class ApiRequestService {
    /**
     * Get API url
     */
    static getHost() {
        let host = API_URL;

        while (host[host.length - 1] === '/') {
            host = host.slice(0, host.length - 1);
        }

        return host;
    }

    /**
     * Make request headers
     */
    static async makeHeaders() {
        return {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...(localStorage.getItem('access_token')
                ? {Authorization: 'Bearer ' + localStorage.getItem('access_token')}
                : {}),
        };
    }

    /**
     * Make GET Request
     *
     * @param endpoint
     * @param data
     * @param headers
     * @param callback
     */
    static get(
        endpoint,
        data = {},
        headers = {},
        callback = (_callback) => _callback,
    ) {
        return this.ajax('GET', endpoint, data, headers, callback);
    }

    /**
     * Make POST Request
     *
     * @param endpoint
     * @param data
     * @param headers
     * @param callback
     */
    static post(
        endpoint,
        data = {},
        headers = {},
        callback = (_callback) => _callback,
    ) {
        return this.ajax('POST', endpoint, data, headers, callback);
    }

    /**
     * Make PATCH Request
     *
     * @param endpoint
     * @param data
     * @param headers
     * @param callback
     */
    static patch(
        endpoint,
        data= {},
        headers = {},
        callback = _callback => _callback,
    ) {
        return this.ajax('PATCH', endpoint, data, headers, callback);
    }

    /**
     * Make PUT Request
     *
     * @param endpoint
     * @param data
     * @param headers
     * @param callback
     */
    static put(
        endpoint,
        data = {},
        headers = {},
        callback = _callback => _callback,
    ) {
        return this.ajax('PUT', endpoint, data, headers, callback);
    }

    /**
     * Make DELETE Request
     *
     * @param endpoint
     * @param data
     * @param headers
     * @param callback
     */
    static _delete(
        endpoint,
        data = {},
        headers= {},
        callback = _callback => _callback,
    ) {
        return this.ajax('DELETE', endpoint, data, headers, callback);
    }

    /**
     * Make AJAX Request
     *
     * @param method
     * @param endpoint
     * @param data
     * @param headers
     * @param callback
     */
    static ajax(
        method,
        endpoint,
        data = {},
        headers = {},
        callback = (_callback) => _callback,
    ) {
        return new Promise(async (resolve, reject) => {
            let getQueryString = '';
            let params = {
                method: method,
                credentials: 'include',
                headers: {...(await this.makeHeaders()), ...headers},
            };

            Object.keys(params.headers).forEach((key) => {
                if (params.headers[key] === undefined) {
                    delete params.headers[key];
                }
            });

            if (typeof data === 'object' && !(data instanceof FormData)) {
                data = { ...data };
            }

            if (method === 'GET') {
                getQueryString = this.dataToGetQueryString(data);
            } else {
                params = { ...params, ...{ body: JSON.stringify(data) } };
            }

            params = callback(params);
            

            fetch(this.endpointToUrl(endpoint, getQueryString), params).then(async (res) => {
                let _data = await res.text();

                try {
                    _data = JSON.parse(_data);
                } catch (e) {}

                let resData = {
                    status: res.status,
                    data: _data,
                    response: res,
                };

                if (res.status === 200 || res.status === 201 || res.status === 204) {
                    resolve(resData);
                } else {
                    reject(resData);
                }
            });
        });
    }

    /**
     * Build GET query paramethers string
     *
     * @param data
     */
    static dataToGetQueryString(data) {
        let props = Object.keys(data);
        let queryParams = [];

        props.forEach((prop) => {
            if (Array.isArray(data[prop])) {
                data[prop + '[]'] = data[prop];
                delete data[prop];
            } else {
                queryParams.push(prop + '=' + data[prop]);
            }
        });

        return queryParams.length > 0 ? '?' + queryParams.join('&') : '';
    }

    /**
     * @param endpoint
     * @param getParamsString
     */
    static endpointToUrl(endpoint, getParamsString) {
        return this.getHost() + (endpoint || '') + getParamsString;
    }
}

export default ApiRequestService;
