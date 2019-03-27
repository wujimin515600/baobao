const numberUtil = {
    Format: function (value) {
        if (typeof value == 'string') {
            var v = parseInt(value)
        } else {
            var v = value
        }
        //强转Int，毕竟有可能返回是String类型的数字
        return v.toFixed(2)
    }
}
export default numberUtil