<template>
  <div class="compilador">
    <input type="file" @change="showCode" class='file'>
    <button @click="test"> RUN </button>
    <textarea v-model="textAreaValue" style="background-color: white;"/>
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
      fileName: '',
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
      [this.fileName] = file.name.split('.');
      const reader = new FileReader();
      await reader.readAsText(file);

      reader.onloadend = async () => {
        this.textAreaValue = await reader.result;
      };
      this.success = '';
      this.error = '';
    },
    async test() {
      axios({
        headers: { 'Access-Control-Allow-Origin': '*' },
        method: 'post',
        url: 'https://compilador-teste.herokuapp.com/api/code',
        data: {
          code: this.textAreaValue,
        },
      }).then((values) => {
        this.error = '';
        this.success = 'Passou liso!';

        const blob = new Blob([values.data]);
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', `${this.fileName || 'Codigo'}_compilado.txt`);
        document.body.appendChild(link);
        link.click();
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
      background-position-y: -2px;
      padding-left: 35px;
      padding-top: 10px;
      border-color:#ccc;
      line-height: 125%;
    }

    .success{
      color: green;
    }

    .error {
      color: red;
    }
  }

</style>
