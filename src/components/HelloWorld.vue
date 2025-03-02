<script setup lang="ts">
import { ref } from 'vue'

// 这里有多个需要 lint 的错误 eslint 检测测试代码
// const unusedVar = 'test'  // 未使用的变量
// const  testFunc = ()=>{  // 箭头函数空格问题
// console.log('hello')      // 缩进问题
// }
// 在任意组件中测试
// console.log('当前环境变量:', import.meta.env)
defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
    <h1>{{ msg }}</h1>

    <div class="card">
        <el-button>el-element Plus</el-button>
        <button type="button" @click="count++">count is {{ count }}</button>
        <p>
            Edit
            <code>components/HelloWorld.vue</code>
            to test HMR
        </p>
    </div>

    <p>
        Check out
        <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>
        , the official Vue + Vite starter
    </p>
    <p>
        Learn more about IDE Support for Vue in the
        <a href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support" target="_blank">
            Vue Docs Scaling up Guide
        </a>
        .
    </p>
    <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
    color: #888;
}
</style>
