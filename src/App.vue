<template>
  <div id="app">
    <Compilador />
  </div>
</template>

<script>
import Compilador from './components/Compilador.vue';

export default {
  name: 'App',
  components: {
    Compilador,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
