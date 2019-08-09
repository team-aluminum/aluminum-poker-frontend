<template lang="pug">
.user
  .user__chips ${{ user.chips }}
  .user__chipImages
    img(:src="require('@/assets/coin-black.png')")
</template>

<script>
export default {
  props: ['user', 'side']
}
</script>

<style lang="stylus">
.user
  padding: 0 30px 30px
  background-color: tan
  &__chips
    color: white
    font-size: 32px
    font-weight: bold
  &__chipImages
    img
      width: 30px
</style>
