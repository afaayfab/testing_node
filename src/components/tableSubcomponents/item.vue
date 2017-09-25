<template>
    <div>
        <li>
            <div :class="{bold: isFolder}" @click="toggle">
                {{model.decription}}
                <span v-if="isFolder">[{{open ? '-' : '+'}}]</span>
            </div>
            <ul v-show="open" v-if="isFolder">
                <item class="item" v-for="model in model.children" :model="model">
                </item>                
            </ul>
        </li>
    </div>
</template>

<script>
export default {
    name: 'item',
    props: {
        model: Object
    },
    data: function() {
        return {
            open: true
        }
    },
    computed: {
        isFolder: function() {
            return this.model.children &&
                this.model.children.length
        }
    },
    methods: {
        toggle: function() {
            if (this.isFolder) {
                this.open = !this.open
            }
        }, addChild: function(item) {
            this.model.children.push(item)
        }
    }
}
</script>



<style>
body {
    font-family: Menlo, Consolas, monospace;
    color: #444;
}

.item {
    cursor: pointer;
}

.bold {
    font-weight: bold;
}

ul {
    padding-left: 1em;
    line-height: 1.5em;
    list-style-type: dot;
}
</style>