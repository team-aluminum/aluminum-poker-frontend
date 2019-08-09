<template lang="pug">
.room
  videos(:user="user" :oppositeUser="oppositeUser" :userCode="userCode")
  template(v-if="status === 'preparing'")
    router-link.room__back(to="/") Leave Room
    .room__prepareConsole
      .room__cardKeys(v-if="card_keys")
        card.room__card(v-for="(card, i) in card_keys" :key="i" :suit="card.suit" :number="card.number")
      .room__startButton.button(v-if="hosting" :class="{'-disabled': !startable}" @click="setup")
        | Start Game
    .room__qrcode
      p(v-if="!mobileUser") Read on your phone
      p(v-else) Mobile Connected!
      a(:href="mobileUrl" v-show="!mobileUser")
        qrcode(:value="mobileUrl" :options="{ width: 200 }")
  template(v-else)
    user-status.room__user.-opposite(:user="oppositeUser" side="left" :status="status" :fold="fold")
    user-status.room__user.-me(:user="user" side="right" :status="status" :fold="fold")
    .room__comunity
      .room__pod(v-if="room") ${{ room.pod_chips }}
      .room__comunityCards(v-if="comunityCards.flop.length > 0")
        card.room__comunityCard(v-for="card in comunityCards.flop" :key="card.id"
          :suit="card.suit" :number="card.number" :size="100")
        template
          card.room__comunityCard(v-if="comunityCards.turn" :size="100"
            :suit="comunityCards.turn.suit" :number="comunityCards.turn.number")
          card.room__comunityCard(v-else :back="true" :size="100")
        template
          card.room__comunityCard(v-if="comunityCards.river" :size="100"
            :suit="comunityCards.river.suit" :number="comunityCards.river.number")
          card.room__comunityCard(v-else :back="true" :size="100")
</template>

<script>
import Videos from '@/components/Videos'
import UserStatus from '@/components/UserStatus'
export default {
  components: { Videos, UserStatus },
  data () {
    return {
      userCode: null,
      oppositeUser: null,
      user: null,
      mobileUser: null,
      hosting: false,
      status: null,
      comunityCards: {
        flop: [],
        turn: null,
        river: null
      },
      room: null,

      card_keys: null,
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
    startable () {
      return !!(this.mobileUser && this.oppositeUser)
    },
    fold () {
      return (this.user && this.user.result === 'fold') || (this.oppositeUser && this.oppositeUser.result === 'fold')
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
      this.timerId = setInterval(() => { this.getUser() }, 100000)
    },
    getUser () {
      return this.$utils.apiClient(
        'get',
        `/users/${this.userCode}`
      ).then(res => {
        this.status = res.data.status
        if (this.status === 'preparing') {
          this.hosting = res.data.hosting
          if (!this.card_keys && res.data.keys) {
            this.card_keys = res.data.keys.split(',').map(key => {
              return { suit: key.slice(0, 1), number: key.slice(1, 3) }
            })
          }
        }
        if (!this.mobileUser) {
          this.mobileUser = res.data.mobile_user
        }
        this.oppositeUser = res.data.opposite_user
        this.user = res.data.user
        this.room = res.data.room
        this.comunityCards = res.data.cards
      })
    },
    setup () {
      if (!this.startable) {
        return
      }
      this.$utils.apiClient(
        'post',
        '/rooms/setup',
        { user_code: this.userCode }
      ).then(_ => {
        this.getUser()
      })
    }
  },
  beforeDestroy () {
    clearInterval(this.timerId)
  }
}
</script>

<style lang="stylus">
#app
  padding: 0
.room
  position: relative
  height: 100%
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
  &__cardKeys
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
  &__user
    bottom: 300px
    position: absolute
    &.-opposite
      left: 0
    &.-me
      right: 0
  &__pod
    text-align: center
    color: white
    font-size: 32px
    font-weight: bold
  &__comunity
    width: 550px
    padding-top: 50px
    margin: auto
    &Cards
      display: flex
      justify-content: space-between
</style>
