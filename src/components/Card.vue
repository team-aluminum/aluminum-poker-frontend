<template lang="pug">
.card(:style="colorStyle")
  .card__number {{ displayNumber }}
  .card__suit {{ displaySuit }}
</template>

<script>
export default {
  props: ['suit', 'number', 'size'],
  data () {
    return {
    }
  },
  computed: {
    displaySuit () {
      return { s: '♠', h: '♥', d: '♦', c: '♣' }[this.suit]
    },
    displayNumber () {
      if (['1', '11', '12', '13'].includes(this.number)) {
        const numberToStringMap = { '1': 'A', '11': 'J', '12': 'Q', '13': 'K' }
        return numberToStringMap[this.number]
      }
      return this.number
    },
    colorStyle () {
      if (this.suit === 's' || this.suit === 'c') {
        return { color: '#333' }
      } else if (this.suit === 'h' || this.suit === 'd') {
        return { color: '#f33' }
      } else {
        return {}
      }
    }
  }
}
</script>

<style lang="stylus">
.card
  background-color: #eee
  position: relative
  border-radius: 5px
  width: 150px
  height: calc(150px * 1.6)
  &__number
    position: absolute
    top: 10px
    left: 10px
  &__suit
    position: absolute
    top: 30px
    left: 10px
</style>
