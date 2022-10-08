import { PROTOCOL, DOMAIN, API_PREFIX, LOCAL_STORAGE_PREFIX } from "utils/constants";
import axios from "axios";
import moment from "moment";

function removeElement(array, elem) {
  let index = array.indexOf(elem);
  if (index > -1) {
    array.splice(index, 1);
  }
}

export default class Utils {
  static DATE_REABLE_FORMAT = "DD/MM/YYYY";
  static DATE_ISO_FORMAT = "YYYY-MM-DD";

  /**
   * responseIntercept.
   *
   * @returns {void}
   */
  static responseIntercept() {
    axios.defaults.withCredentials = false;
    axios.defaults.xsrfHeaderName = "X-CSRFToken";
    axios.defaults.xsrfCookieName = "csrftoken";
  }

  /**
   * getValueFromEvent.
   *
   * @param {DOMEvent} e
   * @returns {string}
   */
  static getValueFromEvent(e) {
    const target = e.target;
    return target.value || "";
  }

  /**
   * getCheckedFromEvent.
   *
   * @param {DOMEvent} e
   * @returns {boolean}
   */
  static getCheckedFromEvent(e) {
    const target = e.target;
    return !!target.checked || false;
  }

  /**
   * removeEmptyKey.
   *
   * @param {Object} obj
   * @returns {Object}
   */
  static removeEmptyKey(obj = {}) {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      if (Utils.isBlank(value)) result[key] = value;
    }
    return result;
  }

  /**
   * isBlank.
   *
   * @param {number|Object|string} input
   * @returns {boolean}
   */
  static isBlank(input) {
    return typeof input !== "number" && !input;
  }

  /**
   * setFormErrors.
   *
   * @param {Dict} errors
   * @returns {FormikErrorDict}
   */
  static setFormErrors(errors) {
    return Object.entries(errors)
      .map(([key, value]) => [key, Utils.errorFormat(value)])
      .filter((item) => !!item[1].length)
      .reduce((result, [key, value]) => {
        result[key] = value;
        return result;
      }, {});
  }

  /**
   * errorFormat.
   *
   * @param {string | number | Dict | string[]} input
   * @returns {string[]}
   */
  static errorFormat(input) {
    if (!input) return [];
    if (typeof input === "string") return [input];
    if (Array.isArray(input)) return input.filter((item) => item).map((item) => item.toString());
    return [];
  }

  /**
   * getApiBaseUrl.
   *
   * @returns {string}
   */
  static getApiBaseUrl() {
    return "http://localhost:8000/api/v1";
  }

  /**
   * convertParams.
   *
   * @param {Method} method
   * @param {Dict} data
   * @returns {Dict}
   */
  static convertParams(method, data) {
    if (["post", "put"].includes(method.toLowerCase())) return data;
    return { params: data };
  }

  /**
   * prefixMapValues.
   *
   * @param {Object} input
   * @param {string} input.prefix
   * @param {Object} input.endpoints
   * @returns {Object}
   */
  static prefixMapValues({ prefix, endpoints }) {
    const result = {};
    for (const key in endpoints) {
      const value = endpoints[key];
      result[key] = [prefix, value].join("/");
      if (result[key][result[key].length - 1] !== "/") {
        result[key] += "/";
      }
    }
    return result;
  }

  /**
   * fileInObject.
   *
   * @param {Object} data
   * @returns {boolean}
   */
  static fileInObject(data) {
    return !!Object.values(data).filter((item) => {
      if (item instanceof Blob) {
        return true;
      } else if (Array.isArray(item)) {
        for (let val of item) {
          if (val instanceof Blob) {
            return true;
          }else{
            return false;
          }
        }
      }
    }).length;
  }

  /**
   * getJsonPayload.
   *
   * @param {Object} data
   * @returns {Object}
   */
  static getJsonPayload(data) {
    return {
      data: data,
      "Content-Type": "application/json",
    };
  }

  /**
   * getFormDataPayload.
   *
   * @param {Object} data
   * @returns {Object}
   */
  static getFormDataPayload(data) {
    const formData = new FormData();
    for (const key in data) {
      const value = data[key];
      if (Array.isArray(value)) {
        value.map((val) => {
          formData.append(key, val);
        });
      } else {
        formData.set(key, value);
      }
    }
    return {
      data: formData,
      "Content-Type": "",
    };
  }

  /**
   * cleanAndMoveToLoginPage.
   *
   * @param {History} history
   * @returns {void}
   */
  static cleanAndMoveToLoginPage(history) {
    const currentUrl = window.location.href.split("#")[1];
    Utils.removeStorage("auth");
    if (history) {
      Utils.navigateTo(history)(`/login?next=${currentUrl}`);
    } else {
      window.location.href = `/#/login?next=${currentUrl}`;
    }
  }

  /**
   * setToken.
   *
   * @param {string} token
   * @returns {void}
   */
  static setToken(token) {
    const authData = Utils.getStorageObj("auth");
    authData["token"] = token;
    Utils.setStorage("auth", authData);
  }

  /**
   * request.
   *
   * @param {string} url
   * @param {Object} params
   * @param {string} method
   * @returns {Promise}
   */
  static async request(url, params = {}, method = "get", blobResponseType = false) {
    const { data, "Content-Type": contentType } = Utils.fileInObject(params)
      ? Utils.getFormDataPayload(params)
      : Utils.getJsonPayload(params);
    const token = Utils.getToken();
    const config = {
      method,
      baseURL: this.getApiBaseUrl(),
      url,
      headers: {
        FINGERPRINT: "",
        Authorization: token ? `Bearer ${token}` : undefined,
        "Content-Type": contentType,
      },
      data: this.convertParams(method, data),
    };
    if (blobResponseType) {
      config.responseType = "blob";
    }
    if (!Utils.isEmpty(params) && method === "get") {
      delete config.data;
      const query = new URLSearchParams(params).toString();
      config.url = [config.url, query].join("?");
    }
    return await axios(config);
  }

  /**
   * apiCall.
   *
   * @param {string} url
   * @param {Object} params
   * @param {string} method
   * @returns {Promise}
   */
  static async apiCall(url, params = {}, method = "get", blobResponseType = false) {
    const emptyError = {
      response: {
        data: {},
      },
    };
    try {
      return await Utils.request(url, params, method, blobResponseType);
    } catch (err) {
      if (err.response.status === 401) {
        const baseUrl = Utils.getApiBaseUrl();
        const refreshUrl = `${baseUrl}/auth/refresh/`;
        try {
          const refreshResponse = await Utils.request(refreshUrl, {}, "POST");

          // Save token here
          Utils.setToken(refreshResponse.data.token);

          try {
            return await Utils.request(url, params, method);
          } catch (err) {
            if (err.response.status === 401) {
              // Logout
              Utils.cleanAndMoveToLoginPage();
              return Promise.reject(emptyError);
            }
            // Return error
            return Promise.reject(err);
          }
        } catch (err) {
          Utils.request(refreshUrl).catch(() => {
            // Logout
            Utils.cleanAndMoveToLoginPage();
            return Promise.reject(emptyError);
          });
        }
      }
      // Return error
      return Promise.reject(err);
    }
  }

  /**
   * parseJson.
   *
   * @param {string} input
   * @returns {string}
   */
  static parseJson(input) {
    try {
      return JSON.parse(input);
    } catch (error) {
      return String(input);
    }
  }

  /**
   * setStorage.
   *
   * @param {string} key
   * @param {string | Dict} value
   * @returns {void}
   */
  static setStorage(key, value) {
    try {
      localStorage.setItem(LOCAL_STORAGE_PREFIX + "_" + key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * setStorageObj.
   *
   * @param {Object} input
   * @returns {void}
   */
  static setStorageObj(input) {
    for (const key in input) {
      const value = input[key];
      this.setStorage(key, value);
    }
  }

  /**
   * getStorageObj.
   *
   * @param {string} key
   * @returns {Object}
   */
  static getStorageObj(key) {
    try {
      const value = this.parseJson(localStorage.getItem(LOCAL_STORAGE_PREFIX + "_" + key));
      if (value && typeof value === "object") {
        return value;
      }
      return {};
    } catch (error) {
      return {};
    }
  }

  /**
   * getStorageStr.
   *
   * @param {string} key
   * @returns {string}
   */
  static getStorageStr(key) {
    try {
      const value = this.parseJson(localStorage.getItem(LOCAL_STORAGE_PREFIX + "_" + key));
      if (!value || typeof value === "object") {
        return "";
      }
      return String(value);
    } catch (error) {
      return "";
    }
  }

  /**
   * getToken.
   *
   * @returns {string}
   */
  static getToken() {
    const authObj = this.getStorageObj("auth");
    const token = authObj.token;
    return token ? token : "";
  }

  /**
   * getAuthId.
   *
   * @returns {number}
   */
  static getAuthId() {
    const authObj = this.getStorageObj("auth");
    return authObj.id;
  }

  /**
   * getVisibleMenus.
   *
   * @returns {string[]}
   */
  static getVisibleMenus() {
    const authObj = this.getStorageObj("auth");
    const menu = authObj.permissions;
    return menu ? menu : [];
  }

  /**
   * navigateTo.
   *
   * @param {History} history
   */
  static navigateTo(history) {
    return (url = "/", params = []) => {
      history.push([url, ...params].join("/"));
    };
  }

  /**
   * removeStorage.
   *
   * @param {string} key
   * @returns {void}
   */
  static removeStorage(key) {
    localStorage.removeItem(LOCAL_STORAGE_PREFIX + "_" + key);
  }

  /**
   * logout.
   *
   * @param {History} history
   */
  static logout(history) {
    return () => {
      const baseUrl = Utils.getApiBaseUrl();
      const logoutUrl = `${baseUrl}auth/logout/`;
      Utils.toggleGlobalLoading();
      const payload = {
        firebase_token: "",
        staff_id: Utils.getAuthId(),
      };
      Utils.apiCall(logoutUrl, payload, "POST")
        .then(() => {
          Utils.cleanAndMoveToLoginPage(history);
        })
        .finally(() => {
          Utils.toggleGlobalLoading(false);
        });
    };
  }

  /**
   * appendKey.
   *
   * @param {Object[]} list
   * @returns {Object[]}
   */
  static appendKey(list) {
    return list.map((item, index) => {
      if (item.id !== undefined) {
        item.key = item.id;
      } else {
        item.key = index;
      }
      return item;
    });
  }
  static idToLabel(listID, listLabel, field) {
    return listID.map((item) => {
      listLabel.map((subItem) => {
        if (subItem.value === item[`${field}`]) {
          item[`${field}`] = subItem.label;
        }
      });
    });
  }

  static arrIDToLabel(listID, listLabel, field) {
    return listID.map((item) => {
      listLabel.map((subItem) => {
        if (item[`${field}`].includes(subItem.value)) {
          removeElement(item[`${field}`], subItem.value);
          item[`${field}`].push(subItem.label);
        }
      });
    });
  }

  static getCurrentTime() {
    let date = moment.utc().format("YYYY-MM-DD HH:mm:ss");
    let stillUtc = moment.utc(date).toDate();
    let localDateTime = moment(stillUtc).local().format("YYYY-MM-DD HH:mm:ss");
    return localDateTime;
  }

  /**
   * isEmpty.
   *
   * @param {Object} obj
   * @returns {boolean}
   */
  static isEmpty(obj) {
    if (!obj) return true;
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }

  /**
   * appendIdForGroupOptions.
   *
   * @param {Object[]} groups
   * @returns {Object[]}
   */
  static appendIdForGroupOptions(groups) {
    return groups.map((group) => {
      group.options = group.options.map((option) => {
        option.value = [group.value, option.value].join("|");
        return option;
      });
      return group;
    });
  }

  /**
   * getDialogTitle.
   *
   * @param {number} id
   * @param {Object} messages
   * @returns {string}
   */
  static getDialogTitle(id, messages) {
    const action = id ? "Sửa" : "Thêm";
    const subject = messages.heading.toLowerCase();
    return `${action} ${subject}`;
  }

  /**
   * dateFormat.
   *
   * @param {string} strDate
   * @returns {string}
   */
  static dateFormat(strDate) {
    if (!strDate) return strDate;
    if (strDate.includes("T")) {
      strDate = strDate.split("T")[0];
    }
    try {
      return strDate.split("-").reverse().join("/");
    } catch (_err) {
      return strDate;
    }
  }

  /**
   * dateFormat.
   *
   * @param {string} strDate
   * @returns {string}
   */
  static isoToReadableDatetimeStr(strDate) {
    if (!strDate) return strDate;
    if (!strDate.includes("T")) return strDate;
    const dateArr = strDate.split("T");
    let datePart = dateArr[0];
    let timePart = dateArr[1];
    try {
      datePart = datePart.split("-").reverse().join("/");
      timePart = timePart.split(":");
      timePart.pop();
      timePart = timePart.join(":");
      return datePart + " " + timePart;
    } catch (_err) {
      return strDate;
    }
  }

  /**
   * dateStrReadableToIso.
   *
   * @param {string} dateStr
   * @returns {string}
   */
  static dateStrReadableToIso(dateStr) {
    return dateStr.split("/").reverse().join("-");
  }

  /**
   * ensurePk.
   *
   * @param {string | number} rawPk
   * @returns {number}
   */
  static ensurePk(rawPk) {
    rawPk = String(rawPk);
    if (rawPk.includes("_")) {
      return parseInt(rawPk.split("_")[1]);
    }
    return parseInt(rawPk);
  }

  static event = {
    /**
     * listen.
     *
     * @param {string} eventName
     * @param {function} callback
     * @returns {void}
     */
    listen: (eventName, callback) => {
      window.document.addEventListener(eventName, callback, false);
    },

    /**
     * remove.
     *
     * @param {string} eventName
     * @param {function} callback
     * @returns {void}
     */
    remove: (eventName, callback) => {
      window.document.removeEventListener(eventName, callback, false);
    },

    /**
     * dispatch.
     *
     * @param {string} eventName
     * @param {Object | boolean | string | number} detail
     * @returns {void}
     */
    dispatch: (eventName, detail) => {
      const event = new CustomEvent(eventName, { detail });
      window.document.dispatchEvent(event);
    },
  };

  /**
   * toggleGlobalLoading.
   *
   * @param {boolean} spinning
   * @returns {void}
   */
  static toggleGlobalLoading(spinning = true) {
    Utils.event.dispatch("TOGGLE_SPINNER", spinning);
  }

  /**
   * toggleGlobalLoading.
   *
   * @param {Object} data
   * @param {string} filename
   * @returns {void}
   */
  static handleDownload(data, filename) {
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
  }
}
