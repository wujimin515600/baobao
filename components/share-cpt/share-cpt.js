// component/share-cpt.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onShareAppMessage() {
      this.triggerEvent('onShareAppMessage')
    },
    shareWithFriends() {
      this.triggerEvent('shareWithFriends')

    },
    cancel() {
      this.triggerEvent('cancelShare')
    }
  }
})