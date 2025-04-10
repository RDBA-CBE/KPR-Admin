import instance from '../../utils/axios.utils';

const auth = {
    login: (data: any) => {
        let promise = new Promise((resolve, reject) => {
            let url = `token/`;
            instance()
                .post(url, data)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => {
                    if (error.response) {
                        // ✅ Log the server response for more details
                        console.log('🚨 Server Error:', error.response.data);
                        console.log('📌 Status Code:', error.response.status);
                        console.log('📝 Headers:', error.response.headers);
                    } else if (error.request) {
                        // ✅ No response received from the server
                        console.log('⚠️ No Response from Server:', error.request);
                    } else {
                        // ✅ Axios failed before sending the request
                        console.log('❌ Request Setup Error:', error.message);
                    }
                    reject(error);
                });
        });
        return promise;
    },

    main_menu: () => {
        let promise = new Promise((resolve, reject) => {
            let url = `main-menus/`;
            instance()
                .get(url)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => {
                    console.log('errorsss: ', error);
                    if (error.response) {
                        reject(error.response.data.error);
                    } else {
                        reject(error);
                    }
                });
        });
        return promise;
    },

    sub_menu: (id: any) => {
        let promise = new Promise((resolve, reject) => {
            let url = `sub-menus/?main_menu=${id}`;
            instance()
                .get(url)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => {
                    if (error.response) {
                        reject(error.response.data.error);
                    } else {
                        reject(error);
                    }
                });
        });
        return promise;
    },

    document_list: (id: any, body) => {
        let promise = new Promise((resolve, reject) => {
            let url = `documents/?submenu=${id}`;
            if (body.year) {
                url += `&year=${encodeURIComponent(body.year)}`;
            }
            instance()
                .get(url)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => {
                    console.log('errorsss: ', error);
                    if (error.response) {
                        reject(error.response.data.error);
                    } else {
                        reject(error);
                    }
                });
        });
        return promise;
    },

    document_details: (id: any) => {
        let promise = new Promise((resolve, reject) => {
            let url = `documents/${id}/`;
            instance()
                .get(url)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => {
                    console.log('errorsss: ', error);
                    if (error.response) {
                        reject(error.response.data.error);
                    } else {
                        reject(error);
                    }
                });
        });
        return promise;
    },

    add_document: (data: any) => {
        let promise = new Promise((resolve, reject) => {
            let url = `documents/`;
            instance()
                .post(url, data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => {
                    if (error.response) {
                        // ✅ Log the server response for more details
                        console.log('🚨 Server Error:', error.response.data);
                        console.log('📌 Status Code:', error.response.status);
                        console.log('📝 Headers:', error.response.headers);
                    } else if (error.request) {
                        // ✅ No response received from the server
                        console.log('⚠️ No Response from Server:', error.request);
                    } else {
                        // ✅ Axios failed before sending the request
                        console.log('❌ Request Setup Error:', error.message);
                    }
                });
        });
        return promise;
    },

    update_document: (id: any, data) => {
        let promise = new Promise((resolve, reject) => {
            let url = `documents/${id}/`;
            instance()
                .patch(url, data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => {
                    console.log('errorsss: ', error);
                    if (error.response) {
                        reject(error.response.data.error);
                    } else {
                        reject(error);
                    }
                });
        });
        return promise;
    },

    delete_document_files: (id: any) => {
        let promise = new Promise((resolve, reject) => {
            let url = `document-files/${id}/`;
            instance()
                .delete(url)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => {
                    console.log('errorsss: ', error);
                    if (error.response) {
                        reject(error.response.data.error);
                    } else {
                        reject(error);
                    }
                });
        });
        return promise;
    },

    delete_document: (id: any) => {
        let promise = new Promise((resolve, reject) => {
            let url = `documents/${id}/`;
            instance()
                .delete(url)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => {
                    console.log('errorsss: ', error);
                    if (error.response) {
                        reject(error.response.data.error);
                    } else {
                        reject(error);
                    }
                });
        });
        return promise;
    },

    add_document_file: (data: any) => {
        let promise = new Promise((resolve, reject) => {
            let url = `document-files/`;
            instance()
                .post(url, data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => {
                    if (error.response) {
                        // ✅ Log the server response for more details
                        console.log('🚨 Server Error:', error.response.data);
                        console.log('📌 Status Code:', error.response.status);
                        console.log('📝 Headers:', error.response.headers);
                    } else if (error.request) {
                        // ✅ No response received from the server
                        console.log('⚠️ No Response from Server:', error.request);
                    } else {
                        // ✅ Axios failed before sending the request
                        console.log('❌ Request Setup Error:', error.message);
                    }
                });
        });
        return promise;
    },

    update_document_file: (id, data: any) => {
        let promise = new Promise((resolve, reject) => {
            let url = `document-files/${id}/`;
            instance()
                .patch(url, data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => {
                    if (error.response) {
                        // ✅ Log the server response for more details
                        console.log('🚨 Server Error:', error.response.data);
                        console.log('📌 Status Code:', error.response.status);
                        console.log('📝 Headers:', error.response.headers);
                    } else if (error.request) {
                        // ✅ No response received from the server
                        console.log('⚠️ No Response from Server:', error.request);
                    } else {
                        // ✅ Axios failed before sending the request
                        console.log('❌ Request Setup Error:', error.message);
                    }
                });
        });
        return promise;
    },

    main_document_list: (id: any, body: any) => {
        let promise = new Promise((resolve, reject) => {
            let url = `documents/?main_menu=${id}`;
            if (body.year) {
                url += `&year=${encodeURIComponent(body.year)}`;
            }
            instance()
                .get(url)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => {
                    console.log('errorsss: ', error);
                    if (error.response) {
                        reject(error.response.data.error);
                    } else {
                        reject(error);
                    }
                });
        });
        return promise;
    },
};

export default auth;
