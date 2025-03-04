import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createI18n } from 'vue-i18n'
import messagesZh from './locales/zh.ts'
import messagesEn from './locales/en.ts'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import App from './App.vue'
import router from './router'

// 创建 i18n 实例
const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  globalInjection: true, // 全局注入 $t 函数
  locale: 'zh', // 默认语言
  fallbackLocale: 'en', // 备用语言
  messages: {
    zh: messagesZh,
    en: messagesEn,
  },
})

const app = createApp(App)

// 配置 Element Plus
app.use(ElementPlus, {
  locale: zhCn, // Element Plus 的默认语言
})

app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')
