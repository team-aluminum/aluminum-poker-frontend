<template lang="pug">
#app
  router-view
</template>

<style lang="stylus">
*
  margin: 0
  padding: 0
  box-sizing: border-box
  text-decoration: none
a
  color: inherit
#app
  position: relative
  background-color: #2d875a
  height: 100vh
  width: 100%
  padding: 50px
.button
  &:not(.-disabled)
    cursor: pointer
    &:hover
      opacity: 0.8
</style>
