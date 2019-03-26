import dialog from "./dialog.js"

import {
    api as apiMap,
    domain
} from '../global.js'

import user from "./user.js"
const http = {
    defaultOptions: {
        needLogin: false,
        errorHandle: true,
        dataHandle: true,
        responseHandle: true,
        showLoading: true,
    },

    get(api, options) {
        if (!options) {
            options = {}
        }
        options.api = api
        options.method = "get"
        this.handle(options)
    },

    post(api, options) {
        if (!options) {
            options = {}
        }
        options.api = api
        options.method = "post"
        this.handle(options)
    },

    /**
     * 处理请求参数
     * @param  {object} options
     * {
     *   api 请求的api名称或者url地址
     *   method  发起请求动作
     *   data  发起请求附带的参数data
     *   extParams  其他参数
     *   needLogin 是否需要登入即请求是否需要带上cookie或者相关标识
     *   success 请求成功后的回调方法
     *   fail  请求失败的回调方法
     *   metaSource 请求参数中的meta
     *   metaVersion 请求参数中的meta
     *   metaType 请求参数中的meta
     *   platform 请求参数中的平台
     *   errorHandle 默认错误处理是否开启
     *   dataHandle  默认数据处理是否开启
     *   responseHandle 默认相应处理开启
     *   extOptions  axios相关的其他参数，比如header之类的
     *   showLoading 是否显示加载
     * }
     * @return {}         [description]
     */
    handle(options) {
        options = Object.assign({}, this.defaultOptions, options)
        let httpOptions = {
            url: this.getUrlWithApi(options.api),
            method: options.method,
            data: options.dataHandle ? this.handleData(options) : options.data
        }

        if (options.extOptions) {
            httpOptions = object.assign(httpOptions, options.extOptions)
        }
        let handleOptions = {
            success: options.success ? options.success : false,
            fail: options.fail ? options.fail : false,
            errorHandle: options.errorHandle ? true : false,
            responseHandle: options.responseHandle ? true : false
        }

        if (options.showLoading) {
            dialog.loading()
        }
        if (options.needLogin) {
            data.user_sid = user.info().user_sid
            if (!user.isLogin({}, true)) {
                return false
            }
        }
        httpOptions.success = (res) => {
            if (options.showLoading) {
                dialog.hideLoading()
            }
            this.handleResponse(res, handleOptions)
        }

        httpOptions.fail = (res) => {
            if (options.showLoading) {
                dialog.hideLoading()
            }
            if (typeof options.fail == "function") {
                options.fail()
            }
            if (!options.errorHandle) {
                return false
            }
            http.handleError()
        }

        wx.request(httpOptions)
    },

    getUrlWithApi(api) {
        console.log(domain + (apiMap[api] ? apiMap[api] : api));

        return domain + (apiMap[api] ? apiMap[api] : api)
    },

    handleData(options) {
        if (!options.data) {
            options.data = {}
        }
        return options.data
    },

    handleResponse(response, options) {
        let data = response.data.response
        if (!options.responseHandle) {
            if (typeof options.success == "function") {
                options.success(data)
            }
            return
        }
        console.log(data);

        if (data.result == 200) {
            if (typeof options.success == "function") {
                options.success(data)
            }
        } else {
            if (options.errorHandle) {
                if (data.result == 404) {
                    dialog.tips('登录过期,请重新登录')
                    setTimeout(() => {
                        wx.navigateTo({ //关闭当前页面，跳转到应用内的某个页面
                            url: "/pages/user/register/register"
                        })
                    }, 1500)
                } else {
                    this.handleError(data.reason)
                }
            }
            if (typeof options.fail == "function") {
                options.fail(data)
            }
        }
    },
    handleError(msg) {
        console.log(msg);

        if (msg) {
            dialog.tips(msg)
        } else {
            dialog.tips(1004)
        }
    }
}

export default http