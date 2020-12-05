<template>
  <div align="center" class="compilador">
    <div style="display: inline-block">
      <button @click="test"> Compilar </button>
      <input type="file" @change="showCode" class='file'>
    </div>
    <div style="display: inline-block">
      <textarea id="atext" v-model="textAreaValue" style="background-color: white;"/>
      <div v-if="error || success" :class="{ success: isSuccess, error: isError }">
        {{ error || success }}
      </div>
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
        const tarea = document.getElementById('atext');
        this.selectTextareaLine(tarea, err.response.data.line);

        this.error = err.response.data.error;
        this.success = '';
      });
    },
    selectTextareaLine(tarea, lineNum) {
      let text = tarea.value;
      let cont = 0;

      text = text.split('\n');

      for (let i = 0; i <= lineNum - 1; i += 1) {
        if (i === lineNum - 1) {
          tarea.focus();
          tarea.setSelectionRange(cont, cont + text[i].length);
          break;
        }
        cont = cont + text[i].length + 1;
      }
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
      height: 21px;
      margin: 10px;
    }

    textarea{
      margin: 5px;
      width: 900px;
      height: 500px;
      background: url(http://i.imgur.com/2cOaJ.png);
      background-attachment: local;
      background-repeat: no-repeat;
      background-position-y: -2px;
      padding-left: 35px;
      padding-top: 10px;
      border-color:#ccc;
      line-height: 120%;
    }

    .success{
      color: green;
    }

    .error {
      color: red;
    }
  }

</style>
