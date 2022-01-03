<template>
  <header>
    <h1 class="logo">
      <router-link to="/">
        M&D
      </router-link>
    </h1>
    <div
      class="ham-btn"
      :class="{'ham-btn--active':isNavOpen}"
      @click="toggleIsNavOpen"
    >
      <span />
      <span />
      <span />
    </div>
  </header>
  <Nav />
  <section
    class="content"
  >
    <router-view />
  </section>
  <footer>
    <p>
      &copy; Copyright 2021 g6165310@gmail.com
    </p>
  </footer>
</template>

<script>

import useStore from '../methods/store'
import Nav from '../components/Nav'
export default {
  components: {
    Nav
  },
  setup () {
    // ---- Nav ----//
    const { isNavOpen, toggleIsNavOpen } = useStore()
    return {
      toggleIsNavOpen,
      isNavOpen
    }
  }
}
</script>

<style lang='scss' scoped>

header{
  padding: 20px;
}
.content{
  position: relative;
}
footer{
  padding:$b-space-m 0;
  text-align: center;
}

</style>
