import {HOST} from '../settings';

const options: RequestInit = {
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    // headers: {
    //     'Content-Type': 'application/json'
    // },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
};

export class ApiRequestService {
    public static API_PREFIX = HOST;

    private extractBody(response: Response) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') !== -1) {
            return response?.json();
        } else {
            return response.text();
        }
    }

    private wrapResponse<T>(request: Promise<Response>): Promise<{ data: T; response: Response }> {
        return request
            .then(this.handleErrors)
            .then(
                (response) => (
                    this.extractBody(response).then((data) => {
                        return ({data, response});
                    })
                )
            );
    }

    private handleErrors(response: Response) {
        const {ok, status, statusText} = response;
        if (
            status === 401 ||
            ((status === 302 || response.redirected) && response.url.indexOf('idp-discovery.html') !== -1)
        ) {
            // onUnauthorized(response);
            return response.json()
                .then((errors) => Promise.reject({responseJSON: this.parseData(errors), ok, status, statusText}));
        }

        if (!ok) {
            return response.json()
                .then((errors) => Promise.reject({responseJSON: this.parseData(errors), ok, status, statusText}));
        }

        return response;
    }

    private parseData(respErr: {data: Record<string, unknown>; message: string; success: boolean}) {
        return {
            details: Object.keys(respErr.data).map((key) => ({
                message: respErr.data[key],
                field: key,
                type: 'error'
            })),
            message: respErr.message,
            success: respErr.success
        };
    }

    public post<T>(url: string, data: FormData) {
        return this.wrapResponse<T>(
            fetch(ApiRequestService.API_PREFIX + url, {
                ...options,
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                body: data // body data type must match "Content-Type" header
            })
        );
    }
}