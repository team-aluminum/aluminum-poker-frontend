<template lang="pug">
.qrcodes
  table
    thead
      tr
        th
        th(v-for="suit in suits") {{ suit }}
    tbody(v-for="number in numbers")
      tr
        th {{ number }}
        td(v-for="suit in suits")
          p {{ evaluate(suit, number) }}
          qrcode.qrcode(:value="evaluate(suit, number)" :options="{ width: 100 }")
</template>

<script>
export default {
  data () {
    return {
      suits: ['spade', 'heart', 'diamond', 'club'],
      numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13']
    }
  },
  methods: {
    evaluate (suit, number) {
      return suit.slice(0, 1) + number
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
      .qrcode
        border: 1px solid black
</style>
