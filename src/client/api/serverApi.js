import 'isomorphic-fetch';

export function readData() {

    return fetch('/api/readData', {
        method: 'get',
        headers: {
            'Accept': 'application/json'
        }
    })
        .then( response => {
            console.log('Received response: ' + response);
            console.log('Received response: ' + response.status);
            console.log('Received response: ' + response.statusText);
            if (response.status >= 200 && response.status < 300) {
                return response;
            } else {
                var error = new Error(response.statusText);
                error.response = response;
                throw error;
            }
        })
        .then( response => {
            return response.json();
        });

}
