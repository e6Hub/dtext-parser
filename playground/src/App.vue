<script setup>
import DText from '../../dist';
import { ref, watch, onMounted } from 'vue';

const evalText = ref('h1.Hello!\nThis is a test of dtext-parser.');
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
      <a href="https://e926.net/help/dtext" target="_blank" rel="noopener noreferrer">View reference</a>
    </header>
    <textarea v-model="evalText" />
    <div class="separator">
      <h2>Preview</h2>
    </div>
    <div id="preview" v-html="parsedText" />
  </main>
</template>
