<template lang="pug">
.room
  router-link.room__back(to="/") Leave Room
  .room__startConsole(v-if="!enteringMode")
    .room__cards(v-if="cards")
      card.room__card(v-for="(card, i) in cards" :key="i" :suit="card.suit" :number="card.number")
    .room__startButton.button(:class="{'-disabled': !startable}")
      | Start Game
  .room__enteringConsole(v-else)
  .room__screen
  .room__qrcode
    p(v-if="!mobileUser") Read on your phone
    p(v-else) Mobile Connected!
    a(:href="mobileUrl" v-show="!mobileUser")
      qrcode(:value="mobileUrl" :options="{ width: 200 }")
</template>

<script>
// import Peer from 'skyway-js'
export default {
  data () {
    return {
      roomCode: null,
      userCode: null,
      cards: null,
      user: null,
      mobileUser: null,
      timerId: null,
      enteringMode: null,

      peer: null,
      peerId: null,
      localStream: null
    }
  },
  created () {
    this.enteringMode = this.$route.query.entering
    if (localStorage.roomCode && localStorage.userCode) {
      this.roomCode = localStorage.roomCode
      this.userCode = localStorage.userCode
      this.getRoom()
      this.timerId = setInterval(() => { this.getRoom() }, 2000)
    } else if (this.enteringMode && localStorage.userCode) {
    } else if (this.enteringMode) {
      this.createUser()
    } else {
      this.createRoom()
    }
  },
  computed: {
    mobileUrl () {
      return `http://0.0.0.0:8080/mobile/room?roomCode=${this.roomCode}&userCode=${this.userCode}`
    },
    startable () {
      return false
    }
  },
  mounted () {
    // this.peer = new Peer({ key: '0b7346a4-fe23-49c0-9423-0097e00c5e73', debug: 3 })
    // this.peer.on('open', () => {
    //   this.peerId = this.peer.id
    // })
    //
    // this.peer.on('call', call => {
    //   call.answer(this.localStream)
    //   this.connect(call)
    // })
  },
  methods: {
    createRoom () {
      this.roomCode = Math.random().toString(36).slice(-8)
      localStorage.roomCode = this.roomCode
      this.$utils.apiClient(
        'post',
        'http://0.0.0.0:3000/rooms',
        { room_code: this.roomCode }
      ).then(res => {
        this.userCode = res.data.user.code
        localStorage.userCode = this.userCode
        this.getRoom()
        this.timerId = setInterval(() => { this.getRoom() }, 2000)
      })
    },
    createUser () {
      this.$utils.apiClient(
        'post',
        'http://0.0.0.0:3000/users'
      ).then(res => {
        this.userCode = res.data.user.code
        localStorage.userCode = this.userCode
      })
    },
    getRoom () {
      return this.$utils.apiClient(
        'get',
        `http://0.0.0.0:3000/rooms/${this.roomCode}?user_code=${this.userCode}`
      ).then(res => {
        if (!this.cards) {
          this.cards = res.data.room.keys.split(',').map(key => {
            return { suit: key.slice(0, 1), number: key.slice(1, 3) }
          })
        }
        if (!this.user) {
          this.user = res.data.user
        }
        if (!this.mobileUser) {
          this.mobileUser = res.data.mobile_user
        }
      })
    }
    // connect (call) {
    //   call.on('stream', stream => {
    //     const el = document.getElementById('their-video')
    //     el.srcObject = stream
    //     el.play()
    //   })
    // }
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
  &__startConsole, &__enteringConsole
    position: absolute
    width: 400px
    height: 300px
    top: 0
    left: 0
    right: 0
    bottom: 0
    margin: auto
    background-color: gray
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
  &__screen
    position: absolute
    bottom: 0
    right: 0
    width: 400px
    height: 300px
    background-color: black
</style>
