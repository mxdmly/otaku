<script setup lang="ts">

import { onMounted, ref } from 'vue';
import axios from 'axios';

const fileList = <any>ref([])
const imgList = <any>ref([])
const imgPath = <any>ref({})
const videoList = <any>ref([])
const videoPath = <any>ref({})
const imgOrVideo = ref(true)
const imgIndex = ref(0)
const videoFile = ref('')

const path = 'http://127.0.0.1:3100/'

onMounted(()=>{
  axios.get(path + 'every_file').then(async(result) => {
    let list = await result.data
    fileList.value = list
    list.forEach((file:any) => {
      if (/\.(jpeg|png|gif|bmp|webp|jfif)$/i.test(file)) {
        imgPath.value[file.match(/.*\\/i)?.[0]] = imgPath.value[file.match(/.*\\/i)?.[0]]?[...imgPath.value[file.match(/.*\\/i)?.[0]],path + file]:[path + file]
      }else if(/\.(mp4|mp3|avi|mov|wmv|flv|mkv|mpeg|mpg)$/i.test(file)){
        videoPath.value[file.match(/.*\\/i)?.[0]] = videoPath.value[file.match(/.*\\/i)?.[0]]?[...videoPath.value[file.match(/.*\\/i)?.[0]],path + file]:[path + file]
        // videoList.value.push(file)
      }
    })
  }).catch((err) => {
    alert(err.message)
  })
})
</script>

<template>
  <div style="display: flex;">
    <el-switch v-model="imgOrVideo" />
    <el-select
      v-if="imgOrVideo"
      v-model="imgList">
      <el-option v-for="(file, index) of imgPath" :key="index" :label="index" :value="file">{{ index }}</el-option>
    </el-select>
    <el-select
      v-if="! imgOrVideo"
      v-model="videoList">
      <el-option v-for="(file, index) of videoPath" :key="index" :label="index" :value="file">{{ index }}</el-option>
    </el-select>
  </div>
  <br />
  <el-image 
    v-if="imgOrVideo"
    v-for="(file, index) in imgList"
    :key="index"
    :src="file"
    :preview-src-list="imgList"
    :hide-on-click-modal="true"
    :initial-index="imgIndex"
    @click="imgIndex = index"
    style="width: 100px; height: 100px"
    loading="lazy"
  >
  </el-image>
  <video
    v-if="! imgOrVideo"
    :src="path + videoFile"
    loading="lazy"
    controls
    style="width: 100%; height: 30vh"
  ></video>
  <div style="width: 100%; height: 50vh;overflow-y: scroll;">
    <el-button
      v-if="! imgOrVideo"
      v-for="file in videoList"
      @click="(_:any)=>{videoFile = file}"
    >{{ file }}</el-button>
  </div>
</template>

<style  scoped>
  .el-image-viewer__next{
    border-radius:0;
    height: 100%;
  }
</style>