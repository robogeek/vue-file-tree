<template>
    <span>
    <sl-vue-tree
           id="file-tree"
           ref="slvuetree"
           :value="nodes"
           :allowMultiselect="false"
           @nodeclick="nodeClick"
           @nodedblclick="nodeDoubleClick"
           @select="nodeSelect"
           @toggle="nodeToggle"
           @drop="nodeDrop"
           @nodecontextmenu="nodeContextMenu"
           @externaldrop.prevent="onExternalDropHandler">

      <template slot="toggle" slot-scope="{ node }">
          <span v-if="!node.isLeaf">
            <font-awesome-icon 
                icon="caret-right" 
                v-if="!node.isExpanded"></font-awesome-icon>
            <font-awesome-icon 
                icon="caret-down"
                v-else-if="node.isExpanded"></font-awesome-icon>
          </span>
      </template>

      <template slot="title" slot-scope="{ node }">
          <font-awesome-icon 
                :icon="[ 'fab', 'js' ]" 
                v-if='node.data.type === "application/javascript"'></font-awesome-icon>
          <font-awesome-icon 
                icon="table" 
                v-else-if='node.data.type === "application/json"'></font-awesome-icon>
          <font-awesome-icon 
                icon="image" 
                v-else-if='node.data.type === "IMAGE"'></font-awesome-icon>
          <font-awesome-icon 
                icon="code" 
                v-else-if='node.data.type === "EJS"'></font-awesome-icon>
          <font-awesome-icon 
                :icon="[ 'fab', 'vuejs' ]" 
                v-else-if='node.data.type === "VUEJS"'></font-awesome-icon>
          <font-awesome-icon 
                icon="file" 
                v-else-if="node.isLeaf"></font-awesome-icon>
           {{ node.title }} </template>


      <template slot="sidebar" slot-scope="{ node }">
          <font-awesome-icon 
                icon="circle" 
                v-if="node.data.isModified"></font-awesome-icon>
      </template>
    </sl-vue-tree>


    <aside class="menu contextmenu" 
            ref="contextmenu" 
            v-show="contextMenuIsVisible">
        <slot name="context-menu"></slot>
    </aside>


    </span>
</template>

<!-- script src="./vue-file-tree.js"/ -->

<script>

// import Vue from 'vue';

import path from 'path';
import util from 'util';
// import pd from 'path-directories';
import splitter from './path-splitdirs';

import mime from 'mime';

import slVueTree from 'sl-vue-tree';
// import 'sl-vue-tree/dist/sl-vue-tree-dark.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCaretRight, faCaretDown, faTable, faImage, faFile, faCircle, faCode
} from '@fortawesome/free-solid-svg-icons';
import { faJs, faVuejs } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faJs, faVuejs, faCaretRight, faCaretDown, faTable, faImage, faFile, faCircle, faCode);

// Vue.component('font-awesome-icon', FontAwesomeIcon);


// TODO: Prevent dragging a file into a place where there's already one of the same name
//       In such a case ask the user what to do?  How?

// TODO: Support copy/paste

// TODO: Support right-click menu

// TODO: Support delete

// TODO: move to own project -- publish as npm package

export default {

    data() {
        return {
            nodes: [],
            contextMenuIsVisible: false
        }
    },
    components: {
        'sl-vue-tree': slVueTree,
        'font-awesome-icon': FontAwesomeIcon
    },
    created() {
        /*
         * Derived from Buefy's b-dropdown
         * https://github.com/buefy/buefy/blob/dev/src/components/dropdown/Dropdown.vue
         */
        if (typeof window !== 'undefined') {
            document.addEventListener('click', this.clickedOutside)
        }
    },
    methods: {
        nodeClick(node, event) {
            this.$emit('nodeClick', event, node);
        },
        nodeDoubleClick(node, event) {
            console.log(`nodeDoubleClick ${node.title} ${node.data.type} isLeaf ${node.isLeaf} ${util.inspect(node)}`);
            if (!node.isLeaf) {
                this.$refs.slvuetree.onToggleHandler(event, node);
                return;
            }
            this.$emit('nodeDoubleClick', node);
        },
        nodeSelect(node) {
            console.log(`nodeSelect ${util.inspect(node)}`);
        },
        nodeToggle(node) {
            console.log(`nodeToggle ${util.inspect(node)}`);
        },
        nodeDrop(node) {
            console.log(`nodeDrop ${util.inspect(node)}`);
            this.$emit('nodeDrop', node);
        },
        nodeContextMenu(node, event) {
            console.log(`nodeContextMenu ${util.inspect(node)}`);
            this.contextMenuIsVisible = true;
            const $contextMenu = this.$refs.contextmenu;
            $contextMenu.style.left = event.clientX + 'px';
            $contextMenu.style.top = event.clientY + 'px';
        },
        /**
         * Close dropdown if clicked outside.
         * Derived from Buefy's b-dropdown
         * https://github.com/buefy/buefy/blob/dev/src/components/dropdown/Dropdown.vue
         */
        clickedOutside(event) {
            if (!this.isInWhiteList(event.target)) this.contextMenuIsVisible = false;
        },
        // If the "clickOutside" is on a target where we should ignore the click
        // then we should ignore this.  
        // See: https://github.com/buefy/buefy/blob/dev/src/components/dropdown/Dropdown.vue
        isInWhiteList(el) { return false; },
        onExternalDropHandler(cursorPosition, event) {
            console.log('external drop', cursorPosition, util.inspect(event));
        },
        addPathToTree(fn, stat, isDir) {
            console.log(`addPathToTree ${fn} ${util.inspect(stat)} ${isDir}`);
            console.log(`addPathToTree ${util.inspect(process)}`);
            console.log(util.inspect(path));
            fn = path.normalize(fn);
            console.log(`addPathToTree NORMALIZED ${fn}`);
            const basenm = path.basename(fn);
            console.log(`addPathToTree BASENAME ${basenm}`);

            // NEED TO REWRITE FOR path-splitdirs

            const split = splitter(fn);

            // const dirs = pd(fn);
            console.log(`addPathToTree dirs ${util.inspect(split)}`);
            let curnodes = this.nodes;
            for (let dir of split.dirs) {
                if (dir === '.') continue;
                let found = undefined;
                for (let cur of curnodes) {
                    if (cur.isLeaf === false && cur.title === dir) {
                        found = cur;
                        break;
                    }
                }
                if (!found) {
                    let newnode = {
                        title: dir, 
                        isLeaf: false, 
                        children: [], 
                        data: { 
                            type: "DIRECTORY",
                            pathname: fn, 
                            stat 
                        }
                    };
                    console.log(`addPathToTree !found push newnode ${util.inspect(newnode)}`);
                    curnodes.push(newnode);
                    curnodes = newnode.children;
                } else {
                    curnodes = found.children;
                }
            }
            let newnode = {
                title: basenm, 
                isLeaf: !isDir, 
                data: { 
                    type: mime.getType(fn),
                    pathname: fn,
                    stat
                }
            };
            if (!newnode.data.type) newnode.data.type = "text/plain";
            if (newnode.data.type.startsWith('image/')) newnode.data.type = "IMAGE";
            if (fn.endsWith('.ejs')) newnode.data.type = "EJS";
            if (fn.endsWith('.vue')) newnode.data.type = "VUEJS";
            if (!newnode.isLeaf) newnode.children = [];
            console.log(`addPathToTree FINAL push newnode ${util.inspect(newnode)}`);
            curnodes.push(newnode);
        }
    }
}

</script>

<style>

.contextmenu {
    position: absolute;
    background-color: white;
    color: black;
    border-radius: 2px;
    cursor: pointer;
}

.contextmenu > div {
    padding: 10px;
}

.contextmenu > div:hover {
    background-color: rgba(100, 100, 255, 0.5);
}

#file-tree {
    height: 100%;
}

.sl-vue-tree {
    position: relative;
    cursor: default;
    user-select: none;
}

.sl-vue-tree.sl-vue-tree-root {
    border: 1px solid rgb(9, 22, 29);
    background-color: rgb(9, 22, 29);
    color: rgba(255, 255, 255, 0.5);
    border-radius: 3px;
}

.sl-vue-tree-root > .sl-vue-tree-nodes-list {
    overflow: hidden;
    position: relative;
    padding-bottom: 4px;
}

.sl-vue-tree-selected > .sl-vue-tree-node-item {
    background-color: #13242d;
    color: white;
}

.sl-vue-tree-node-item:hover,
.sl-vue-tree-node-item.sl-vue-tree-cursor-hover {
    color: white;
}

.sl-vue-tree-node-item {
    position: relative;
    display: flex;
    flex-direction: row;

    padding-left: 10px;
    padding-right: 10px;
    line-height: 28px;
    border: 1px solid transparent;
}


.sl-vue-tree-node-item.sl-vue-tree-cursor-inside {
    border: 1px solid rgba(255, 255, 255, 0.5);
}

.sl-vue-tree-gap {
    width: 25px;
    min-height: 1px;

}

.sl-vue-tree-toggle {
    display: inline-block;
    text-align: left;
    width: 20px;
}

.sl-vue-tree-sidebar {
    margin-left: auto;
}

.sl-vue-tree-cursor {
    position: absolute;
    border: 1px solid rgba(255, 255, 255, 0.5);
    height: 1px;
    width: 100%;
}

.sl-vue-tree-drag-info {
    position: absolute;
    background-color: rgba(0,0,0,0.5);
    opacity: 0.5;
    margin-left: 20px;
    padding: 5px 10px;
}

</style>