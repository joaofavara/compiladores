<template>
  <div class="compilador">
    <input type="file" @change="showCode" class='file'>
    <button @click="test"> RUN </button>
    <textarea v-model="textAreaValue" />
    <div v-if="error || success" :class="{ success: isSuccess, error: isError }">
      {{ error || success }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Compilador',
  data() {
    return {
      textAreaValue: '',
      error: '',
      success: '',
    };
  },
  computed: {
    isSuccess() {
      return this.success !== '';
    },
    isError() {
      return this.error !== '';
    },
  },
  methods: {
    async showCode(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      await reader.readAsText(file);

      reader.onloadend = async () => {
        this.textAreaValue = await reader.result;
      };
      this.success = '';
      this.error = '';
    },
    async test() {
      // const file = e.target.files[0];
      // const reader = new FileReader();
      // await reader.readAsText(file);

      // reader.onloadend = async () => {
      //   this.textAreaValue = await reader.result;
      // };
      axios({
        method: 'post',
        url: 'http://localhost:3000/api/code',
        data: {
          code: this.textAreaValue,
        },
      }).then((values) => {
        console.log('Values: ', values);
        this.error = '';
        this.success = 'Passou liso!';
      }).catch((err) => {
        this.error = err.response.data.error;
        this.success = '';
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .compilador {
    display: flex;
    flex-direction: column;

    button {
      width: fit-content;
      height: 35px;
    }

    textarea{
      margin: 10px;
      width: 500px;
      height: 500px;
      background: url(http://i.imgur.com/2cOaJ.png);
      background-attachment: local;
      background-repeat: no-repeat;
      padding-left: 35px;
      padding-top: 10px;
      border-color:#ccc;
    }

    .success{
      color: green;
    }

    .error {
      color: red;
    }
  }

</style>
