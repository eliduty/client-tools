<script setup lang="ts">
const sourceMapPath = ref();
const change = async () => {
  const filePath = await window.ipcRenderer.invoke("dialog:openFile");
  sourceMapPath.value = filePath;
};
const line = ref();
const column = ref();
const errorCode = ref();
const handleParse = async () => {
  const data = {
    sourcemapPath: sourceMapPath.value,
    line: line.value,
    column: column.value,
  };

  window.ipcRenderer.invoke("parse-sourcemap", data).then((code) => {
    errorCode.value = code;
  });
};
</script>

<template>
  <div class="flex flex-col w-full h-full">
    <div class="flex justify-center text-30 py-10 border-b border-black/10">SourceMap解析工具</div>
    <div class="flex flex-1 pt-10">
      <div class="px-10 w-[30%]">
        <t-form :label-width="100" label-align="right">
          <t-form-item label="map文件" name="name" initial-data="TDesign">
            <t-space direction="vertical">
              <t-button @click="change" class="w-full" variant="outline">选择文件</t-button>
              <pre>{{ sourceMapPath }}</pre>
            </t-space>
          </t-form-item>
          <t-form-item label="异常行号" name="tel" initial-data="123456">
            <t-input v-model="line" />
          </t-form-item>
          <t-form-item label="异常列号" name="tel" initial-data="123456">
            <t-input v-model="column" />
          </t-form-item>
          <t-form-item>
            <t-space size="small">
              <t-button @click="handleParse">解析</t-button>
              <t-button theme="default" variant="base" type="reset">重置</t-button>
            </t-space>
          </t-form-item>
        </t-form>
      </div>
      <div class="flex-1">
        <pre v-if="errorCode">{{ errorCode }}</pre>
      </div>
    </div>
  </div>
</template>

<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
