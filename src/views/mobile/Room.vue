<template lang="pug">
.mobileRoom
  h1 {{ status }}
  //- .mobileRoom__readCard(v-if="!status || status === 'read_card'")
  //-   select(v-model="selecting.suit")
  //-     option(v-for="suit in suits") {{ suit }}
  //-   select(v-model="selecting.number")
  //-     option(v-for="number in numbers") {{ number }}
  //-   button(@click="submit") 送信
  .mobileRoom__console(v-if="status === 'active'")
    .button(v-if="limpLabel === 'check'" @click="action('check')")
      img(:src="require('@/assets/coin-red.png')")
      p check
    .button(v-if="limpLabel === 'call'" @click="action('call')") 
      img(:src="require('@/assets/coin-red.png')")
      p ${{ callAmount }} to call
    .button(@click="action('fold')")
      img(:src="require('@/assets/coin-black.png')")
      p fold
    .button(@click="action('raise')")
      img(:src="require('@/assets/coin-blue.png')")
      p raise
  template(v-if="status === 'active'")
    .raiseInput
      input(v-model="raiseAmount")
    .notes
      span min: {{ minRaiseAmount }},
      span max: {{ maxRaiseAmount }}
  qrcode(:value="mobileUrl" :options="{ width: 200 }")
</template>

<script>
export default {
  data () {
    return {
      userCode: null,
      status: null,

      suits: ['spade', 'heart', 'diamond', 'club'],
      numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'],
      selecting: {
        suit: null,
        number: null
      },
      timerId: null,

      callAmount: null,
      limpLabel: null,
      raiseAmount: 0,
      minRaiseAmount: 0,
      maxRaiseAmount: 0
    }
  },
  created () {
    this.userCode = this.$route.query.userCode
    this.$utils.apiClient(
      'post',
      '/mobile_events/mobile_user',
      { user_code: this.userCode }
    )
    this.getStatusByInterval()
  },
  computed: {
    mobileUrl () {
      if (process.env.NODE_ENV === 'development') {
        return `${process.env.VUE_APP_FRONTEND_ENDPOINT}/mobile/room?userCode=${this.userCode}`
      } else {
        if (this.hosting) {
          return `alpoker://entry?userCode=${this.userCode}&hosting=true`
        } else {
          return `alpoker://entry?userCode=${this.userCode}`
        }
      }
    },
  },
  methods: {
    submit () {
      if (!(this.selecting.suit && this.selecting.number)) {
        alert('選択必須')
        return
      }
      const card = this.selecting.suit.slice(0, 1) + this.selecting.number
      this.$utils.apiClient(
        'post',
        '/mobile_events/read_card',
        { card, user_code: this.userCode }
      ).then(res => {
        console.log(res.data)
        this.selecting.suit = null
        this.selecting.number = null
      })
    },
    getStatusByInterval () {
      this.getStatus()
      this.timerId = setInterval(() => {
        this.getStatus()
      }, 500)
    },
    getStatus () {
      this.$utils.apiClient(
        'get',
        `/mobile_events/status?user_code=${this.userCode}`
      ).then(res => {
        this.status = res.data.status
        if (this.status === 'active') {
          this.minRaiseAmount = res.data.min_raise_amount
          this.maxRaiseAmount = res.data.max_raise_amount
          this.limpLabel = res.data.limp_label
          this.callAmount = res.data.call_amount
        }
      })
    },
    action (type) {
      if (type === 'raise' && this.raiseAmount < this.minRaiseAmount) {
        alert(`最低$${this.minRaiseAmount}からレイズしてください`)
        return
      }
      this.$utils.apiClient(
        'post',
        '/mobile_events/action',
        { user_code: this.userCode, type, amount: this.raiseAmount }
      ).then(res => {
        console.log(res.data)
      }).catch(error => {
        console.log(error.response.data)
      })
    }
  },
  beforeDestroy () {
    clearInterval(this.timerId)
  }
}
</script>

<style lang="stylus">
.mobileRoom
  padding: 50px
  position: relative
  h1
    color: #ddd
  &__console
    display: flex
    justify-content: space-around
    margin-bottom: 10px
    .button
      position: relative
      width: 100px
      height: 100px
      img, p
        position: absolute
        width: 100px
        height: 100px
        top: 0
        left: 0
        right: 0
        bottom: 0
      p
        color: white
        font-weight: bold
        text-align: center
        line-height: 100px
  .raiseInput
    text-align: right
    input
      padding: 10px 5px
      border-radius: 5px
      font-size: 24px
      width: 100px
  .notes
    text-align: right
    font-size: 24px
    color: white
    span
      width: 100px
      margin-left: 10px
</style>
