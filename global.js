//  export const domain = "https://b.bbrecycle.cn/"
 export const domain = "https://backend.sandbox.bbrecycle.cn:8443/"
 export const iconUrl = domain + "category/icon/obtain/?top_type=" // 获取种类icon
 export const api = {
     // 用户登录
     login: 'user/login/login/',
     smsCode: 'user/login/submit_pn/',
     register: 'user/login/validate/',
     // 首页
    //  nearby: "business/obtain/nearby/",
      nearby: "business/c/rb/distance/list/",
    //  nearby_detail: "business/obtain/rb_detail/",
   nearby_detail: "business/c/rb/distance/",
     // 个人中心
     center: 'user/obtain/self_info/',
     // 用户余额
     balance: "wallet/obtain/balance/",
     // 余额明细
     listhistory: "wallet/obtain/history/",
     // 我的投递
     overview: 'order/obtain/overview/',
     // 我的投递list
     overviewList: 'order/obtain/order_list/',
     // 获取货物种类以及价格区间
     label: 'order/obtain/c_type/',
     // 获取用户收货地址
     adress: 'order/obtain/delivery_info/',
     // 用户提交收货地址
     submitadress: 'order/operate/submit_delivery_info/',
     // 获取客户未完成订单
     uncompleted: "order/obtain/uncompleted",
     // 取消订单理由列表
     reasonList: "order/obtain/cancel_reason",
     // 取消订单
    //  cancelOrder: 'order/operate/cancel_order/',
   cancelOrder:'order/c/order/cancel/',
     // 一键下单
     order: 'order/operate/one_click_order/',
     // 个人中心二维码
     qrcode: 'user/obtain/qr_info/',
     // 订单汇总
     summary: "order/c/detail/summary/",
     // 订单汇总详情
    //  summaryDetail: 'order/c/detail/detail/',
   summaryDetail: 'order/c/order/',
   //  个人投递记录
  //  personDeliveRecord: 'order/c/order/',
     // 查询订单结果
     finishOrder: 'order/obtain/order_details_c/',
     // 退出登录
     loginOut: 'user/login/logout/',
     //  收货完成
     finsh: 'order/c/detail/final_t_p_detail/',
     //  业务员
     name: 'user/c/rec_info/',
     //  banner
     banner: 'appearance/banner/banner_url',
     // 申请站长以及查看站长申请状态
     referrer: 'referrer/referrer/',
     //获取站长营业额概况
     promSummary: 'referrer/promotion/summary/',
     //接口-获取推广二维码
     referrerQr: 'referrer/referrer/qr/',
     //获取用户营业额-用户汇总
     referrerAgg: 'referrer/promotion/agg/',
     //获取用户营业额-用户详情
     promotionDetail: 'referrer/promotion/detail/',
     //  首页品类--实时价格
     categ: 'category/list/',
     //   首页品类
     indexCateg: 'category/index/',
     //  一键下单品类
     ordercate: '/category/price/',
     //  获取下单时间
     picking_time: 'order/c/picking_time/',
     //   新一键下单
     neworder: 'order/c/order/',
    
    
 }
 export const error = {
     '401': '验证错误',
     '403': '此订单已完成或者已被取消，不能执行此操作',
     '404': '未找到sid，sid可能已过期',
     '409': 'pn与sid冲突',
     '418': '用户不是站长',
     '500': '未知错误'
 }

 export const transaction_type = {
     '0': '余额收到款项',
     '1': '用户发起提现申请',
     '2': '用户提现成功',
     '3': '用户提现失败，返回到余额'
 }

 //  站长申请状态
 export const matserStu = {
     '0': '申请中',
     '1': '申请通过',
     '2': '申请未通过',
 }
 export const serviceTel = "400-8118-598"