<template>
  <div id="app">

    <navbarHome/>
   

    <router-view />
   
    <footerHome/>

  </div>
</template>
<script>

import navbarHome from '@/components/navbarHome.vue'
import footerHome from '@/components/footerHome'
export default {
  components: {
    navbarHome,
    footerHome,
    
  },
  computed:{
    test () {
      return this.$store.state.bobby
    }
  },
   created: function(){
      this.$store.commit('checkLogin')
  }
}
</script>
<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
