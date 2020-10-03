<template>
  <div class="compilador">
    <!-- <button @click="test">TESTE</button> -->
    <input type="file" @change="test" class='file'>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Compilador',
  methods: {
    test(e) {
      axios({
        method: 'post',
        url: 'http://localhost:3000/api/code',
        data: {
          file: e.target.files[0].path,
        },
      }).then((values) => {
        console.log(values);
      }).catch((err) => {
        console.err(err);
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>
