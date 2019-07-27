<template lang="pug">
.room
  router-link.room__back(to="/") Leave Room
  .room__cards(v-if="cards")
    card.room__card(v-for="(card, i) in cards" :key="i" :suit="card.suit" :number="card.number")
  .room__screen
  .room__qrcode
    p Read on your phone
    a(:href="mobileUrl")
      qrcode(:value="mobileUrl" :options="{ width: 200 }")
</template>

<script>
export default {
  data () {
    return {
      roomCode: null,
      userCode: null,
      cards: null,
      timerId: null
    }
  },
  created () {
    if (localStorage.roomCode && localStorage.userCode) {
      this.roomCode = localStorage.roomCode
      this.userCode = localStorage.userCode
      this.getRoom()
      this.timerId = setInterval(() => { this.getRoom() }, 2000)
    } else {
      this.createRoom()
    }
  },
  computed: {
    mobileUrl () {
      return `http://0.0.0.0:8080/mobile/room?roomCode=${this.roomCode}&userCode=${this.userCode}`
    }
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
    getRoom () {
      return this.$utils.apiClient(
        'get',
        `http://0.0.0.0:3000/rooms/${this.roomCode}`
      ).then(res => {
        if (!this.cards) {
          this.cards = res.data.room.keys.split(',').map(key => {
            return { suit: key.slice(0, 1), number: key.slice(1, 3) }
          })
        }
      })
    }
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
  &__cards
    display: flex
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
