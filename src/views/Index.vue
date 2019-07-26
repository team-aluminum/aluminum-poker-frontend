<template lang="pug">
#index
  h1 Aluminum Poker
  p
    router-link(to='/room') Create Room
  p
    router-link(to='/enter') Enter Room
  p
    router-link(to="#") Game History
</template>

<script>
export default {
  created () {
    localStorage.removeItem('roomCode')
    localStorage.removeItem('userCode')
  }
}
</script>

<style lang="stylus">
#index
  color: #ddd
  text-align: center
  h1
    font-size: 64px
    margin-bottom: 50px
  p
    margin-bottom: 20px
  a
    font-size: 48px
    &:hover
      text-decoration: underline
</style>
