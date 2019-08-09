<template lang="pug">
.user(:class="{'-reverse': side === 'right'}")
  template(v-if="user")
    .user__row
      .user__chipImagesList
        .user__chipImages
          img(:src="require('@/assets/coin-black.png')" v-for="i in ten_chip_count" :key="i")
        .user__chipImages
          img(:src="require('@/assets/coin-blue.png')" v-for="i in five_chip_count" :key="i")
        .user__chipImages
          img(:src="require('@/assets/coin-red.png')" v-for="i in one_chip_count" :key="i")
      .user__chips ${{ user.chips }}
    .user__row
      .user__result(:class="user.result" v-if="status === 'result'") {{ user.result }}
      .user__cards(v-if="status === 'result' && !fold")
        card.-card(v-for="c in user.cards" :suit="c.suit" :number="c.number"
          :size="100" :key="c.id")
      .user__cards(v-else)
        card.-card(:back="true" :size="100" v-for="i in user.card_count" :key="i")
    .user__row(:class="{'-hidden': !user.button}")
      .user__button B

    .user__row.-betting
      .user__chipImagesList
        .user__chipImages
          img(:src="require('@/assets/coin-black.png')" v-for="i in ten_betting_count" :key="i")
        .user__chipImages
          img(:src="require('@/assets/coin-blue.png')" v-for="i in five_betting_count" :key="i")
        .user__chipImages
          img(:src="require('@/assets/coin-red.png')" v-for="i in one_betting_count" :key="i")
      .user__chips ${{ user.betting }}
</template>

<script>
export default {
  props: ['user', 'side', 'status', 'fold'],
  computed: {
    ten_chip_count () {
      return parseInt(this.user.chips / 10)
    },
    five_chip_count () {
      return (this.user.chips % 10) >= 5 ? 1 : 0
    },
    one_chip_count () {
      return this.user.chips % 5
    },

    ten_betting_count () {
      return parseInt(this.user.betting / 10)
    },
    five_betting_count () {
      return (this.user.betting % 10) >= 5 ? 1 : 0
    },
    one_betting_count () {
      return this.user.betting % 5
    }
  }
}
</script>

<style lang="stylus">
.user
  padding: 0 30px 30px
  display: flex
  align-items: flex-end
  .-hidden
    visibility: hidden
  &__row
    &.-betting
      margin: 0 10px
  &__chips
    color: white
    font-size: 32px
    font-weight: bold
  &__chipImages
    display: flex
    flex-direction: column-reverse
    width: 30px
    img
      width: 30px
      perspective: 100px
    &List
      display: flex
      width: 90px
  &__cards
    display: flex
    margin: 0 25px 30px
    .-card
      margin: 0 5px
  &__result
    text-align: center
    font-size: 48px
    padding-bottom: 10px
    font-weight: bold
    &.draw
      color: black
    &.lose
      color: blue
    &.win
      color: red
  &__button
    background-color: #333
    color: white
    width: 40px
    height: 40px
    border-radius: 20px
    text-align: center
    font-weight: bold
    line-height: 40px
.-reverse
  &.user
    flex-direction: row-reverse
  .user
    &__chipImages
      &List
        flex-direction: row-reverse
    &__chips
      text-align: right
</style>
