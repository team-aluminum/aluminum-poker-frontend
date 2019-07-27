<template lang="pug">
.-mobile.room
  h1 mobile room
</template>

<script>
export default {
  data () {
    return {
      roomCode: null,
      userCode: null
    }
  },
  created () {
    this.roomCode = this.$route.query.roomCode
    this.userCode = this.$route.query.userCode
    this.$utils.apiClient(
      'post',
      `http://0.0.0.0:3000/rooms/${this.roomCode}/mobile_user`,
      { user_code: this.userCode }
    ).then(res => {
    })
  }
}
</script>

<style lang="stylus">
.-mobile.room
  h1
    color: #ddd
</style>
