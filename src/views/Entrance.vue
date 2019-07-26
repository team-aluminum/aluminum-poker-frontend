<template lang="pug">
.entrance
  router-link.entrance__back(to="/") back
  .entrance__cards(v-if="cards")
    card.entrance__card(v-for="(card, i) in cards" :key="i" :suit="card.suit" :number="card.number")
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
    this.roomCode = Math.random().toString(36).slice(-8)
    localStorage.roomCode = this.roomCode
    this.$utils.apiClient(
      'post',
      'http://0.0.0.0:3000/rooms',
      { room_code: this.roomCode }
    ).then(res => {
      this.cards = res.data.room.keys.split(',').map(key => {
        return { suit: key.slice(0, 1), number: key.slice(1, 3) }
      })
      this.userCode = res.data.user.code
      this.timerId = setInterval(() => {
        this.getRoom()
      }, 2000)
    })
  },
  methods: {
    getRoom () {
      this.$utils.apiClient(
        'get',
        `http://0.0.0.0:3000/rooms/${this.roomCode}`
      ).then(res => {
        console.log(res.data)
      })
    }
  },
  beforeDestroy () {
    clearInterval(this.timerId)
  }
}
</script>

<style lang="stylus">
.entrance
  h1
    color: #ddd
  &__back
    color: black
    background-color: #ddd
    padding: 5px 10px
    display: inline-block
    margin-bottom: 30px
    border-radius: 3px
  &__cards
    display: flex
  &__card
    margin: 0 10px
</style>
