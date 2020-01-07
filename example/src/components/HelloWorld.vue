<template>
    <div id="description">
        <div v-html="desc" class="whitespace-pre-line"></div>
    </div>
</template>

<script>
import DText from 'dtext-parser'

export default {
    name: 'Description',
    data: () => {
        return {
            desc: null
        }
    },
    mounted: function () {
        this.$nextTick(() => {
            DText.options({
                "Header": {
                    class: "font-bold text-2xl text-gray-800"
                },
                "External link": {
                    class: "font-bold text-purple-500"
                },
                "Code": {
                    class: "bg-gray-900 px-4 py-2 rounded-lg text-gray-300"
                },
                "Inline code": {
                    class: "bg-gray-300 px-2 py-1 rounded text-gray-700"
                }
            });

            DText.parse(`h2.DText usage example
            This is a example of using "DText":https://e621.net/help/show/dtext
            with a "Vue app":https://vuejs.org

            "Github Repo":https://github.com/e6Hub/dtext-parser

            To customize the parser you can just use the \`options\` method.

    [code]DText.options({
    "Header": {
        class: "font-bold text-2xl text-gray-800"
    },
    "External link": {
        class: "font-bold text-purple-500"
    },
    "Code": {
        class: "bg-gray-900 px-4 py-2 rounded-lg text-gray-300"
    },
    "Inline code": {
        class: "bg-gray-300 px-2 py-1 rounded text-gray-700"
    }
})
[/code]`).then((parsedText) => {
                this.desc = parsedText;
            })
        })
    }
}
</script>

<style>

</style>