<template lang="pug">
.room
  template(v-if="preparing")
    router-link.room__back(to="/") Leave Room
    .room__prepareConsole
      .room__cards(v-if="cards")
        card.room__card(v-for="(card, i) in cards" :key="i" :suit="card.suit" :number="card.number")
      .room__startButton.button(v-if="hosting" :class="{'-disabled': !startable}")
        | Start Game
    videos(:oppositeUser="oppositeUser" :userCode="userCode")
    .room__qrcode
      p(v-if="!mobileUser") Read on your phone
      p(v-else) Mobile Connected!
      a(:href="mobileUrl" v-show="!mobileUser")
        qrcode(:value="mobileUrl" :options="{ width: 200 }")
  template(v-else)
</template>

<script>
import Videos from '@/components/Videos'
export default {
  components: { Videos },
  data () {
    return {
      userCode: null,
      oppositeUser: null,
      mobileUser: null,
      hosting: false,
      preparing: true,

      cards: null,
      timerId: null
    }
  },
  created () {
    this.hosting = !!this.$route.query.hosting
    if (localStorage.userCode) {
      this.userCode = localStorage.userCode
    }

    if (this.userCode) {
      this.$router.push('/room')
      this.getUserByInterval()
    } else {
      if (this.hosting) {
        this.createRoom().then(res => {
          this.userCode = res.data.user.code
          localStorage.userCode = this.userCode
          this.getUserByInterval()
        })
      } else {
        this.createUser().then(res => {
          this.userCode = res.data.user.code
          localStorage.userCode = this.userCode
          this.getUserByInterval()
        })
      }
    }
  },
  computed: {
    mobileUrl () {
      return `${process.env.VUE_APP_FRONTEND_ENDPOINT}/mobile/room?userCode=${this.userCode}`
    },
    startable () {
      return !!(this.mobileUser && this.oppositeUser)
    }
  },
  methods: {
    createRoom () {
      return this.$utils.apiClient(
        'post',
        '/rooms'
      )
    },
    createUser () {
      return this.$utils.apiClient(
        'post',
        '/users'
      )
    },
    getUserByInterval () {
      this.getUser()
      this.timerId = setInterval(() => { this.getUser() }, 10000)
    },
    getUser () {
      return this.$utils.apiClient(
        'get',
        `/users/${this.userCode}`
      ).then(res => {
        this.hosting = res.data.hosting
        if (!this.cards && res.data.keys) {
          this.cards = res.data.keys.split(',').map(key => {
            return { suit: key.slice(0, 1), number: key.slice(1, 3) }
          })
        }
        if (!this.mobileUser) {
          this.mobileUser = res.data.mobile_user
        }
        this.oppositeUser = res.data.opposite_user
      })
    },
  },
  beforeDestroy () {
    clearInterval(this.timerId)
  }
}
</script>

<style lang="stylus">
.room
  h1
    color: #eee
  &__back
    color: black
    position: absolute
    top: 5px
    left: 5px
    background-color: #eee
    padding: 5px 10px
    display: inline-block
    margin-bottom: 30px
    border-radius: 3px
  &__prepareConsole
    position: absolute
    width: 400px
    height: 300px
    top: 100px
    left: 0
    right: 0
    margin: auto
  &__startButton
    width: 80%
    border-radius: 50px
    background-color: #30e
    color: white
    text-align: center
    padding: 10px
    margin: auto
    &.-disabled
      background-color: #aaa
  &__cards
    display: flex
    justify-content: center
    margin-bottom: 20px
  &__card
    margin: 0 10px
  &__qrcode
    position: absolute
    bottom: 0
    right: 400px
    p
      color: #eee
      font-weight: bold
</style>
