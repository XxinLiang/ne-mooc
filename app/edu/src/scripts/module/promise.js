/**
* @Author: zhangxinliang
* @Date:   2016-09-06 15:28:10
* @Last modified by:   zhangxinliang
* @Last modified time: 2016-09-09 14:18:20
*/

import _ from './util'

class Promise {
    constructor(fn) {
        let state = 'PENDING',//状态 只存在PENDING、FULFILLED及REJECTED三种状态
            value = null,
            deferreds = []//异步队列

        //Promise.then方法，返回一个Promise实例
        this.then = function (onFulfilled = null, onRejected = null) {
            return new Promise((resolve, reject) => {
                handle({
                    onFulfilled,
                    onRejected,
                    resolve,
                    reject
                })
            })
        }

        //handle函数-确保onFulfilled与onRejected只会触发其中一个
        function handle(deferred) {
            if (state === 'PENDING') {
                deferreds.push(deferred)
                return
            }

            let cb = state === 'FULFILLED' ? deferred.onFulfilled : deferred.onRejected,
                ret

            if (!cb) {
                cd = state === 'FULFILLED' ? deferred.resolve : deferred.reject
                cd(value)
                return
            }

            try {
                ret = cb(value)
                deferred.resolve(ret)
            } catch (e) {
                deferred.reject(e)
            }
        }

        //resolve函数-状态PENDING转变为FULFILLED
        function resolve(newValue) {
            if (newValue && (_.isType('object', newValue) || _.isType('function', newValue))) {
                let then = newValue.then
                if (_.isType('function', then)) {
                    then.call(newValue, resolve, reject)
                    return
                }
            }
            state = 'FULFILLED'
            value = newValue
            finale()
        }

        //reject函数-状态PENDING转变为REJECTED
        function reject(reason) {
            state = 'REJECTED'
            value = reason
            finale()
        }

        //finale函数-确保总是保持异步
        function finale() {
            setTimeout(() => {
                deferreds.forEach((deferred) => {
                    handle(deferred)
                })
            }, 0)
        }

        fn(resolve, reject)
    }
}

export default Promise
