# vue-file-tree

Customizable draggable file-system-tree component for Vue.js.  This component is meant to display files in the file system.  It is a wrapper around [sl-vue-tree](https://www.npmjs.com/package/sl-vue-tree) and therefore quite a lot of the documentation for that Vue.js component applies to this one.

For a blog post describing what is here, see: https://techsparx.com//nodejs/electron/file-browser-component.html

For a demo application see:  https://github.com/robogeek/vue-file-tree-demo

# Installation

In `package.json` put this into the `package.json` of your Vue.js project.

```json
"dependencies": {
    ...
    "vue-file-tree": "github:robogeek/vue-file-tree"
    ...
}
```

Then run `npm install`

# Quick Start

In your application, add this:

```js
import FileBrowserTree from 'vue-file-tree';
```

That's the Vue component.  You can declare it as a global component:

```js
Vue.component('file-browser-tree', FileBrowserTree);
```

Or add it to an application description:

```js
components: {
    'file-browser-tree': FileBrowserTree,
},
```

Then in the application template:

```html
<file-browser-tree 
        id="file-tree"
        ref="filetree"
        class="column"
        @nodeClick="nodeClick"
        @nodeDoubleClick="nodeDoubleClick"
        @nodeDrop="nodeDrop">

    <template slot="context-menu">
        <div @click="doDashboard">Dashboard</div>
        <div @click="doCustomers">Customers</div>
    </template>

</file-browser-tree>
```

Then add these methods:

```js
methods: {
    nodeClick(event, node) {
        console.log(`nodeClick ${util.inspect(node)}`);
    },
    nodeDoubleClick(node) {
        console.log(`nodeDoubleClick ${util.inspect(node)}`);
    },
    nodeDrop(node) {
        console.log(`nodeDrop ${util.inspect(node)}`);
    },
    doCustomers() {
        console.log(`doCustomers`);
        this.$refs.filetree.contextMenuIsVisible = false;
    },
    doDashboard() {
        console.log(`doDashboard`);
        this.$refs.filetree.contextMenuIsVisible = false;
    }
}
```

Finally, to add files to the component call this function

```js
created: function() {
    messageBus.$on('file', (fn, stat) => { 
        this.$refs.filetree.addPathToTree(fn, stat, false);
    });
    messageBus.$on('directory', (fn, stat) => { 
        this.$refs.filetree.addPathToTree(fn, stat, true);
    });
}
```

Adding files and directories to the tree occurs by handling these messages multiple times.