<template>
    <div id="app" class="flex m-8">
        <div id="logos" class="flex items-center w-1/2 justify-center">
            <img alt="DText parser logo" src="./assets/dtextparser_logo.png" class="w-32">
            <span class="text-4xl font-bold mx-4 text-gray-500">+</span>
            <img alt="Vue logo" src="./assets/vue_logo.png" class="w-32">
        </div>
        <HelloWorld class="w-1/2"/>
    </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
    name: 'app',
    components: { HelloWorld }
}
</script>
