<template>
    <div id="app" class="flex m-8">
        <div id="logos" class="flex items-center">
            <img alt="DText parser logo" src="./assets/dtextparser_logo.png" class="w-20">
            <span class="text-3xl font-bold mx-2 text-gray-500">+</span>
            <img alt="Vue logo" src="./assets/vue_logo.png" class="w-20">
        </div>
        <HelloWorld/>
    </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
    name: 'app',
    components: { HelloWorld }
}
</script>
