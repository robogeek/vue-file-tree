<template>
    <span>
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


    <aside class="menu contextmenu" 
            ref="contextmenu" 
            v-show="contextMenuIsVisible">
        <slot name="context-menu"></slot>
    </aside>


    </span>
</template>

<script src="./vue-file-tree.js"/>

<style scoped>
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