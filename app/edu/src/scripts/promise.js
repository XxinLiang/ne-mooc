/**
* @Author: zhangxinliang
* @Date:   2016-09-06 15:28:10
* @Last modified by:   zhangxinliang
* @Last modified time: 2016-09-06 16:56:42
*/

'use strict'

import _ from './util'

class Promise {
    constructor(fn) {
        let state = 'PENDING',
            value = null,
            deferreds = []

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

        function reject(reason) {
            state = 'REJECTED'
            value = reason
            finale()
        }

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
