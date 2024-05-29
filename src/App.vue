<script setup lang="ts">
import { codeToHtml } from "shiki/bundle/web";
import { invoke } from "./utils";
import { FormProps } from "tdesign-vue-next";
const initData = () => ({
  sourceMapPath: "",
  line: undefined,
  column: undefined,
});

const parseData = ref(initData());
const rules = {
  sourceMapPath: [{ required: true, message: "请选择sourcemap文件" }],
  line: [{ required: true, message: "请输入错误行号" }],
  column: [{ required: true, message: "请输入错误列号" }],
};

const isOpen = ref<boolean>(false);
const change = () => {
  if (!isOpen.value) {
    isOpen.value = true;
    invoke("dialog:openFile").then((filePath) => {
      parseData.value.sourceMapPath = filePath;
      isOpen.value = false;
    });
  }
};

interface ParseResult {
  filename: string;
  line: number;
  column: number;
  content: string;
}

const parseResult = ref<ParseResult>();
const handleParse: FormProps["onSubmit"] = async ({ validateResult }) => {
  if (validateResult !== true) return;
  invoke("parse-sourcemap", toRaw(parseData.value)).then((code) => {
    parseResult.value = code;
  });
};
const code = ref();
watchEffect(async () => {
  if (parseResult.value?.content) {
    code.value = await codeToHtml(parseResult.value.content, {
      lang: "vue",
      theme: "vitesse-dark",
      transformers: [
        {
          line(node, line) {
            node.properties["data-line"] = line;
            if ([parseResult.value?.line].includes(line)) this.addClassToHast(node, "highlight");
          },
        },
      ],
    });
  }
});
const handleRest = () => {
  code.value = "";
};
</script>

<template>
  <div class="flex flex-col w-full h-full">
    <div class="flex flex-1 min-h-0">
      <div class="w-max-[500px]">
        <div class="flex justify-center text-30 pt-10 pb-5 border-b border-black/10 relative">
          <span class="text">Source Map Parser</span>
        </div>
        <t-form class="p-5 pr-10" ref="form" :data="parseData" :rules="rules" :label-width="100" label-align="right" @reset="handleRest" @submit="handleParse">
          <t-form-item label="map文件" name="sourceMapPath">
            <t-input v-model="parseData.sourceMapPath" readonly placeholder="请选择map文件" @click="change">
              <template #suffix>
                <span class="cursor-pointer">{{ parseData.sourceMapPath ? "重新选择" : "选择文件" }}</span>
              </template>
            </t-input>
          </t-form-item>
          <t-form-item label="异常行号" name="line">
            <t-input v-model="parseData.line" />
          </t-form-item>
          <t-form-item label="异常列号" name="column">
            <t-input v-model="parseData.column" />
          </t-form-item>
          <t-form-item>
            <t-space size="small">
              <t-button theme="primary" type="submit">解析</t-button>
              <t-button theme="default" variant="base" type="reset">重置</t-button>
            </t-space>
          </t-form-item>
        </t-form>
      </div>
      <div class="flex-1 code min-h-0 overflow-auto bg-[#121212]">
        <div class="h-full" v-if="code" v-html="code"></div>
        <div class="flex text-white/30 flex justify-center items-center h-full" v-else>暂无解析代码</div>
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
.code pre {
  min-height: 100%;
  padding: 20px;
}

.code pre .line.highlight {
  background-color: #d4565620;
  transition: background-color 0.5s;

  width: 100%;
  display: inline-block;
}

.text {
  color: transparent;
  background-image: linear-gradient(-45deg, #47caff 40%, #bd34fe 50%);
  background-clip: text;
}
</style>
