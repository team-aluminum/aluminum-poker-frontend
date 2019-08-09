<template lang="pug">
.card(v-if="!back" :style="[colorStyle, sizeStyle]")
  .card__number {{ displayNumber }}
  .card__suit {{ displaySuit }}
.card(v-else :style="[colorStyle, sizeStyle]")
  img.card__backImage(:src="require('@/assets/card.png')")
</template>

<script>
export default {
  props: ['suit', 'number', 'size', 'back'],
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
    },
    sizeStyle () {
      if (!this.size) {
        return {}
      }
      return { width: `${this.size}px`, height: `${this.size * 1.6}px` }
    }
  }
}
</script>

<style lang="stylus">
.card
  background-color: #eee
  position: relative
  border-radius: 7px
  width: 160px
  height: calc(160px * 1.6)
  &__number
    position: absolute
    top: 10px
    left: 10px
  &__suit
    position: absolute
    top: 30px
    left: 10px
  &__back
    &Image
      width: 100%
      height: 100%
</style>
