<template>
  <div class="compilador">
    <!-- <button @click="test">TESTE</button> -->
    <input type="file" @change="test" class='file'>
  </div>
</template>

<script>
import teste from '../mixin/lexico/index';

export default {
  name: 'Compilador',
  methods: {
    test(e) {
      teste(e);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>
