<script setup>
import DText from '../../dist';
import { ref, watch, onMounted } from 'vue';

const evalText = ref('h1.Hello!\nThis is a [b]test[/b] of "dtext-parser":https://github.com/e6Hub/dtext-parser .');
const parsedText = ref('');

async function parseText() {
  parsedText.value = await DText.parse(evalText.value);
}

watch(evalText, parseText);
onMounted(parseText);
</script>

<template>
  <main id="container">
    <header>
      <h1>DText Parser Playground</h1>
      <a href="https://e926.net/help/dtext" target="_blank" rel="noopener noreferrer">View DText reference</a>
    </header>
    <div id="sections">
      <div id="section-editor" class="section">
        <h2>Editor</h2>
        <textarea v-model="evalText" />
      </div>
      <div id="section-preview" class="section">
        <h2>Preview</h2>
        <div id="preview" v-html="parsedText" />
      </div>
    </div>
    
  </main>
</template>
