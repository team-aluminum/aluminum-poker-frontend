<template lang="pug">
.videos
  video#my-video.videos__screen(width="400" autoplay playsinline)
  video#opposite-video.videos__screenOpposite(width="400" autoplay playsinline
    :class="{'-exist': oppositeUser}")
</template>

<script>
import Peer from 'skyway-js'
export default {
  props: ['oppositeUser', 'userCode'],
  data () {
    return {
      availableVideo: false,
      peer: null,
      peerId: null,
      localStream: null,
      connecting: false
    }
  },
  async mounted () {
    if (!this.availableVideo) {
      return
    }
    this.peer = new Peer({ key: process.env.VUE_APP_SKYWAY_API_KEY, debug: 3 })
    this.peer.on('open', () => {
      this.peerId = this.peer.id
      this.setPeerId()
    })
    this.peer.on('call', call => {
      call.answer(this.localStream)
      this.connect(call)
    })
    const deviseInfo = await navigator.mediaDevices.enumerateDevices()
    const camera = deviseInfo.find(devise => devise.kind === 'videoinput')
    this.connectLocalCamera(camera)
  },
  methods: {
    setPeerId () {
      if (!this.peerId) {
        return
      }
      this.$utils.apiClient(
        'patch',
        `/users/${this.userCode}`,
        { peer_id: this.peerId }
      )
    },
    connect (call) {
      call.on('stream', stream => {
        const el = document.getElementById('opposite-video')
        el.srcObject = stream
        el.play()
      })
    },
    async connectLocalCamera (camera) {
      const constraints = {
        video: { text: camera.label, value: camera.deviceId },
        audio: false
      }
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      document.getElementById('my-video').srcObject = stream
      this.localStream = stream
    },
    makeCall () {
      const call = this.peer.call(this.oppositeUser.peer_id, this.localStream)
      this.connect(call)
    }
  },
  watch: {
    oppositeUser () {
      if (this.availableVideo && this.oppositeUser && !this.connecting) {
        this.connecting = true
        setTimeout(() => { this.makeCall() }, 1000)
      }
    }
  }
}
</script>

<style lang="stylus">
.videos
  &__screen
    position: absolute
    bottom: 0
    right: 0
    height: 300px
    background-color: black
    &Opposite
      position: absolute
      bottom: 0
      left: 0
      height: 300px
      margin: auto
      background-color: black
      &.-exist
        background: gray
</style>
