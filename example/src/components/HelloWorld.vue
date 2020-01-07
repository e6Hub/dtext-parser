<template>
    <div id="description">
        {{desc}}
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
                }
            });

            DText.parse(`h2.DText usage example
            This is a example of using "DText":https://e621.net/help/show/dtext with a "Vue app":https://vuejs.org

            [b]"Github Repo":https://github.com/e6Hub/dtext-parser[/b]

            h2.Options
            To customize the parser options you can just use the \`options\` method.

            [code]DText.options({
                "Header": {
                    class: "font-bold text-2xl text-gray-800"
                },
                "External link": {
                    class: "font-bold text-purple-500"
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