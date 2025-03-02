<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const toIndexPage = () => {
    router.push('/posts')
}
</script>
<template>
    <h1>页面403：当前页面无权限访问</h1>
    <el-button @click="toIndexPage">返回首页</el-button>
</template>

<style scoped></style>
