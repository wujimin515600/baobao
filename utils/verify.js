/**
 * 验证相关
 */
const verify = {
    /**
     * 验证手机号
     * [verifyPhone description]
     * @param  {[type]} phone [description]
     * @return {[type]}       [description]
     */
    verifyPhone(phone) {
        return /^1[34578]\d{9}$/.test(phone)
    },
    /**
     * 验证密码规范
     * [verifyPwd description]
     * @param  {[type]} pwd [description]
     * @return {[type]}     [description]
     */
    verifyPwd(pwd) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])\S{6,18}$/.test(pwd)
    },
    /**
     * 验证支付密码规范
     * [verifyPwd description]
     * @param  {[type]} pwd [description]
     * @return {[type]}     [description]
     */
    verifyPayPwd(pwd) {
        return !/^([\S|\s])\1{5}$/.test(pwd)
    },
    /**
     * 验证昵称
     * [verifyNickname description]
     * @param  {[type]} nickname [description]
     * @return {[type]}          [description]
     */
    verifyNickname(nickname) {
        return true
    }
}

export default verify