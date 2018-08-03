
// import Vue from 'vue';

import path from 'path';
import util from 'util';
import pd from 'path-directories';

import mime from 'mime';

import slVueTree from 'sl-vue-tree';
import 'sl-vue-tree/dist/sl-vue-tree-dark.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCaretRight, faCaretDown, faTable, faImage, faFile, faCircle, faCode
} from '@fortawesome/free-solid-svg-icons';
import { faJs, faVuejs } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

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
            nodes: []
        }
    },
    components: {
        slVueTree,
        'font-awesome-icon': FontAwesomeIcon
    },
    methods: {
        nodeClick(node) {
            this.$emit('nodeClick', node);
        },
        nodeDoubleClick(node) {
            console.log(`nodeDoubleClick ${util.inspect(node)}`);
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
        nodeContextMenu(node) {
            console.log(`nodeContextMenu ${util.inspect(node)}`);
        },
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
            const dirs = pd(fn);
            console.log(`addPathToTree dirs ${util.inspect(dirs)}`);
            let curnodes = this.nodes;
            for (let dir of dirs) {
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
    },
    created: function() {
        library.add(faJs, faVuejs, faCaretRight, faCaretDown, faTable, 
                faImage, faFile, faCircle, faCode);
    },
    template: `
    <sl-vue-tree
           id="file-tree"
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
    `
}