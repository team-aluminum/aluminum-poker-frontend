<template lang="pug">
.-mobile.entrance
  h1 mobile entrance
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
.-mobile.entrance
  h1
    color: #ddd
</style>
