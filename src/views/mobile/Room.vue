<template lang="pug">
.-mobile.room
  select(v-model="selecting.suit")
    option(v-for="suit in suits") {{ suit }}
  select(v-model="selecting.number")
    option(v-for="number in numbers") {{ number }}
  button(@click="submit") 送信
</template>

<script>
export default {
  data () {
    return {
      userCode: null,

      suits: ['spade', 'heart', 'diamond', 'club'],
      numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'],
      selecting: {
        suit: null,
        number: null
      }
    }
  },
  created () {
    this.userCode = this.$route.query.userCode
    this.$utils.apiClient(
      'post',
      '/mobile_events/mobile_user',
      { user_code: this.userCode }
    )
  },
  methods: {
    submit () {
      if (!(this.selecting.suit && this.selecting.number)) {
        alert('選択必須')
        return
      }
      this.$utils.apiClient(
        'post',
        '/mobile_events/read_card',
        { suit: this.selecting.suit, number: this.selecting.number, user_code: this.userCode }
      ).then(res => {
        this.selecting.suit = null
        this.selecting.number = null
        console.log(res.data)
      })
    }
  }
}
</script>

<style lang="stylus">
.-mobile.room
  h1
    color: #ddd
</style>
