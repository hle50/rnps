import {
  AsyncStorage,
  Platform
} from 'react-native';
import Config from '../constants/Config';
import Alerts from '../utils/Alert';

let inFlightAuthRequest = null;
let numberOfRetried = 0;
let maxRetry = 3;

export default class ApiService {
  constructor() {
    this.requests = [];
  }

  async _toastError(e) {
    let res = e.response;
    console.log('_toastError', res);

    let message = e.message || '';
    console.log('_toastError message', message);
    if (res && res.status === 404) {
      // let error = res ? res.json() : {message: ''};
      // MessageBar.showErrorAlert({title: `ERROR`, message: `${res.status} - Request not found`});
    }
    else if (res && res.status === 500) {
      // let error = res ? res.json() : {message: ''};
      // MessageBar.showErrorAlert({title: `ERROR`, message: `500 - Server Internal Error`});
    }
    else if (res && res.status === 400) {
      // let error = res ? res.json() : {message: ''};
      // MessageBar.showErrorAlert({title: `ERROR`, message: `${res.status}${message ? ` - ${message}` : ''}`});
    } else {
      // MessageBar.showErrorAlert({title: `ERROR`, message: `${message.length > 0 ? message : 'Uncaught error'}`});
    }
  }

  async _getToken() {
    return await AsyncStorage.getItem('token');
  }

  async _getRefreshToken() {
    return await AsyncStorage.getItem('refreshToken');
  }

  async _recall(request, resolve, reject, config) {
    request.config.headers = await this._generateHeader();
    fetch(request.url, request.config)
      .then(async (response) => {
        try {
          delete request.config.headers;
          await this._checkStatus(response, resolve, request, reject, config);
        }
        catch (e) {
          console.log('RECALL catch....', e);
          reject(e);
        }
      });
  }

  async _checkStatus(response, resolve, request, reject, config) {
    console.log('_checkStatus', response);
    if (response.status >= 200 && response.status < 300) {
      // If response is ok then return response
      let jsonResult = await response.text();
      //extract data from jsonP
      let json = JSON.parse(/^callback\((.*?)\);$/.exec(jsonResult)[1]);
      return resolve(json);

    } else {
      let jsonResult;

      // If response is not ok
      if (response.status === 401) {
        numberOfRetried++;
        if (numberOfRetried > maxRetry) {
          numberOfRetried = 0;
          let err = new Error('Reached maximum retry!!! LOGGED OUT!');

          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('refreshToken');
          await AsyncStorage.removeItem('isShowMenuAdmin');

          if (reject) {
            reject(err);
            return;
          }

          // Throw error
          throw error;
        }
        // and this response status is 401
        if (inFlightAuthRequest) { // Check if there is already a promise get new token
          // then handle the promise callback
          inFlightAuthRequest.then(async () => {
            // when promise get new token resolved, re-call the request
            await this._recall(request, resolve, reject, config);
          }, (err) => {
            console.log('inFlightAuthRequest error 1', err);
          }).catch((e) => {
            console.log('inFlightAuthRequest catch 1', e);
          });
          return;
        }
        try {
          // get new token by refresh token
          await this._refreshToken(reject);

          // then handle the promise callback
          inFlightAuthRequest.then(async () => {
            // when promise get new token resolved, re-call the request
            await this._recall(request, resolve, reject, config);
          }, (err) => {
            console.log('inFlightAuthRequest error 2', err);
          }).catch((e) => {
            console.log('inFlightAuthRequest catch 2', e);
          });
        } catch (e) {
          reject(e);
        }

        return response;
      }
      else if (response.status === 400) {
        console.log('Response', response);
        try {
          jsonResult = await response.json();
          console.log('Response Json Result', jsonResult);
        } catch (e) {
          console.log('_checkStatus await response.json()', e);
        }
        console.log('Response json', jsonResult);
      }

      let error = new Error(jsonResult ? jsonResult.message : '');
      error.response = response;
      if (!config || !config.disabledToast) {
        await this._toastError(error);
      }

      if (reject) {
        reject(jsonResult);
        return;
      }

      // Throw error
      throw error;
    }
  }

  _convertToQueryString(obj) {
    obj = obj || {};
    let result = [];
    for (let i in obj) {
      if (obj.hasOwnProperty(i)) {
        result.push(`${i}=${obj[i]}`);
      }
    }
    return result.join('&');
  }

  async _generateHeader() {
    //let token = await this._getToken();
    let header = {
      // 'Accept': 'application/json',
      // 'Content-Type': 'application/json'
    };
    // if (token) {
    //   header['Authorization'] = `Bearer ${token}`
    // }
    return await header;
  }

  async _refreshToken() {
    let mess = 'You\'re no longer logged in, please sign out and sign in again!';
    let refreshToken = await this._getRefreshToken();
    if (!refreshToken) {
      let er = new Error(mess);
      await this._toastError(er);
      throw er;
    }
    try {
      console.log('Get new token..');
      inFlightAuthRequest = this.post('/m-services/profile/refresh-token', {
        refreshToken: refreshToken
      }).then(async (res) => {
        await AsyncStorage
          .multiSet([['token', res.data.accessToken], ['refreshToken', res.data.refreshToken]]);
        return res;
      }, (err) => {
        console.log('get new token error', err);
      }).catch((e) => {
        console.log('get new token catch', e);
      });
    } catch (e) {
      console.log('get new token failed');
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('isShowMenuAdmin');
      let er = new Error(mess);
      await this._toastError(er);
      throw er;
    }
  }

  // async _catch(e) {
  //   console.log('API call error', e.response);
  //   if (e && e.response && e.response.status === 401) {
  //     console.log('Token was expired, getting new token now');
  //     // await this._refreshToken();
  //   }
  //   else {
  //     // let err = new Error('Error');
  //     // err.response = e.response;
  //     // throw err;
  //   }
  // }

  async get(url, qs, config) {
    let queryString = this._convertToQueryString(qs);
    let header = await this._generateHeader();
    let requestUrl = `${Config.api_domain}${url}${queryString.length ? ('?' + queryString) : ''}`;
    let requestConfig = {
      method: 'GET',
      headers: header
    };
    console.log('requestConfig', requestConfig);
    return new Promise((resolve, reject) => {
      fetch(requestUrl, requestConfig)
        .then(async (response) => {
          console.log('responseresponse', response);
          try {
            //delete requestConfig.headers;
            await this._checkStatus(response, resolve, {
              url: requestUrl,
              config: requestConfig
            }, reject, config);
          }
          catch (e) {
            console.log('GET catch....', e);
            reject(e);
          }
        })
        .catch((e) => {
          console.log('GET CATCH 2', e);
          reject(e);
        });
    });
  }

  async post(url, body, qs, config) {
    let queryString = this._convertToQueryString(qs);
    let header = await this._generateHeader();
    let requestUrl = `${Config.api_domain}${url}${queryString.length ? ('?' + queryString) : ''}`;
    let requestConfig = {
      method: 'POST',
      headers: header,
      body: JSON.stringify(body)
    };
    return new Promise((resolve, reject) => {
      console.log('POST: ', requestUrl, requestConfig);
      fetch(requestUrl, requestConfig)
        .then(async (response) => {
          try {
            delete requestConfig.headers;
            await this._checkStatus(response, resolve, {
              url: requestUrl,
              config: requestConfig
            }, reject, config);
          }
          catch (e) {
            console.log('POST catch....', e);
            reject(e);
          }
        })
        .catch((e) => {
          console.log('GET CATCH 2', e);
          reject(e);
        });
    });
  }

  async patch(url, body, qs, config) {
    let queryString = this._convertToQueryString(qs);
    let header = await this._generateHeader();
    let requestUrl = `${Config.api_domain}${url}${queryString.length ? ('?' + queryString) : ''}`;
    let requestConfig = {
      method: 'PATCH',
      headers: header,
      body: JSON.stringify(body)
    };
    return new Promise((resolve, reject) => {
      fetch(requestUrl, requestConfig)
        .then(async (response) => {
          try {
            delete requestConfig.headers;
            await this._checkStatus(response, resolve, {
              url: requestUrl,
              config: requestConfig
            }, reject, config);
          }
          catch (e) {
            console.log('PATCH catch....', e);
            reject(e);
          }
        })
        .catch((e) => {
          console.log('GET CATCH 2', e);
          reject(e);
        });
    });
  }

  async put(url, body, qs, config) {
    let queryString = this._convertToQueryString(qs);
    let header = await this._generateHeader();
    let requestUrl = `${Config.api_domain}${url}${queryString.length ? ('?' + queryString) : ''}`;
    let requestConfig = {
      method: 'PUT',
      headers: header,
      body: JSON.stringify(body)
    };
    return new Promise((resolve, reject) => {
      fetch(requestUrl, requestConfig)
        .then(async (response) => {
          try {
            delete requestConfig.headers;
            await this._checkStatus(response, resolve, {
              url: requestUrl,
              config: requestConfig
            }, reject, config);
          }
          catch (e) {
            console.log('PUT catch....', e);
            reject(e);
          }
        })
        .catch((e) => {
          console.log('GET CATCH 2', e);
          reject(e);
        });
    });
  }

  async delete(url, qs, config) {
    let queryString = this._convertToQueryString(qs);
    let header = await this._generateHeader();
    let requestUrl = `${Config.api_domain}${url}${queryString.length ? ('?' + queryString) : ''}`;
    let requestConfig = {
      method: 'DELETE',
      headers: header
    };
    return new Promise((resolve, reject) => {
      fetch(requestUrl, requestConfig)
        .then(async (response) => {
          try {
            delete requestConfig.headers;
            await this._checkStatus(response, resolve, {
              url: requestUrl,
              config: requestConfig
            }, reject, config);
          }
          catch (e) {
            console.log('DELETE catch....', e);
            reject(e);
          }
        })
        .catch((e) => {
          console.log('GET CATCH 2', e);
          reject(e);
        });
    });
  }

  async uploadImage(imageUri) {
    let photo = {
      uri: imageUri,
      type: 'image/jpeg',
      name: `${new Date().getTime().toString()}.jpg`
    };

    let body = new FormData();
    body.append('file', photo);

    return await fetch(`${Config.api_domain}/m-api/file`, {
      method: 'POST',
      body: body
    });
  }

  async uploadAvatar(imageUri) {
    let photo = {
      uri: imageUri,
      type: 'image/jpeg',
      name: `${new Date().getTime().toString()}.jpg`
    };

    let body = new FormData();
    body.append('file', photo);
    let header = await this._generateHeader();

    header['Content-Type'] = 'multipart/form-realm';

    return await fetch(`${Config.api_domain}/m-api/file/avatar`, {
      method: 'POST',
      headers: header,
      body: body
    });
  }
}
