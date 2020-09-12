<template>
  <div class="compilador">
    <!-- <button @click="test">TESTE</button> -->
    <input type="file" @change="fileReader" class='file'>
    <textarea v-show="codeLines" rows="20" cols="50" :value="codeLines"></textarea>
  </div>
</template>

<script>
import Lexico from '../mixin/lexico/index';

export default {
  name: 'Compilador',
  mixins: [Lexico],
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .compilador {
    display: flex;
    flex-direction: column;
    textarea {
      margin-top: 10px;
    }
  }

</style>
