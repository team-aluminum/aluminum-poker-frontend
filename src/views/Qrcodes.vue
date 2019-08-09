<template lang="pug">
.qrcodes(@click="cancelFocus")
  table
    thead
      tr
        th
        th(v-for="suit in suits") {{ suit }}
    tbody(v-for="number in numbers")
      tr
        th {{ number }}
        td(v-for="suit in suits" @click.stop)
          div(:class="{'-hidden': isHidden(suit, number)}")
            p {{ evaluate(suit, number) }}
            qrcode.qrcode(:value="evaluate(suit, number)" :options="{ width: 100 }" @click.native="focus(suit, number)")
</template>

<script>
export default {
  data () {
    return {
      suits: ['spade', 'heart', 'diamond', 'club'],
      numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'],
      focusing: {
        active: false,
        suit: null,
        number: null
      }
    }
  },
  methods: {
    evaluate (suit, number) {
      return suit.slice(0, 1) + number
    },
    focus (suit, number) {
      this.focusing.active = true
      this.focusing.suit = suit
      this.focusing.number = number
    },
    cancelFocus () {
      if (this.focusing.active) {
        this.focusing.active = false
        this.focusing.suit = null
        this.focusing.number = null
      }
    },
    isHidden (suit, number) {
      return this.focusing.active && !(this.focusing.suit === suit && this.focusing.number === number)
    }
  }
}
</script>

<style lang="stylus">
#app
  height: unset
  background-color: white
.qrcodes
  table
    td
      padding: 3px
      .-hidden
        visibility: hidden
      .qrcode
        border: 1px solid black
</style>
