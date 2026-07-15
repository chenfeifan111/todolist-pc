<template>
  <header class="todo-header">
    <div class="header-content">
      <!-- 标题和工具栏 -->
      <div class="header-top">
        <h1 class="title-text">📝 ToDoList待办列表</h1>
        
        <!-- 工具栏 -->
        <div class="toolbar">
          <button class="tool-btn" @click="$emit('export')" title="导出数据">
            <span class="text">导出</span>
          </button>
          <button class="tool-btn" @click="$emit('import')" title="导入数据">
            <span class="text">导入</span>
          </button>
          <button class="tool-btn" @click="$emit('encrypt')" :title="isEncrypted ? '已加密' : '加密设置'">
            <span class="icon">{{ isEncrypted ? '🔒' : '🔓' }}</span>
          </button>
          <button class="tool-btn danger" @click="$emit('clear')" title="清除所有数据">
            <span class="icon">🗑️</span>
          </button>
        </div>
      </div>
      
      <!-- 输入区域 -->
      <div class="input-section">
        <input 
          type="text" 
          class="todo-input"
          ref="todoInput"
          v-model="newTodo"
          @keypress.enter="addTodo"
          placeholder="添加新的待办事项..."
          maxlength="200"
        />
        <button class="add-btn" @click="addTodo">
          <span class="btn-icon">+</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'TodoHeader',
  props: {
    isEncrypted: {
      type: Boolean,
      default: false
    }
  },
  emits: ['add-todo', 'export', 'import', 'encrypt', 'clear'],
  data() {
    return {
      newTodo: ''
    };
  },
  mounted() {
    // 页面加载时聚焦输入框
    this.focusInput();
  },
  methods: {
    addTodo() {
      const text = this.newTodo.trim();
      if (text.length === 0) {
        return;
      }
      this.$emit('add-todo', text);
      this.newTodo = '';
      // 添加后重新聚焦
      this.$nextTick(() => {
        this.focusInput();
      });
    },
    focusInput() {
      this.$refs.todoInput?.focus();
    }
  }
};
</script>

<style scoped>
.todo-header {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  padding: 20px 20px 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 900px;
  margin: 0 auto;
}

/* 顶部区域 */
.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.title-text {
  font-size: 24px;
  font-weight: 600;
  color: white;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 输入区域 */
.input-section {
  display: flex;
  gap: 10px;
  align-items: center;
}

.todo-input {
  flex: 1;
  padding: 12px 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  font-size: 15px;
  outline: none;
  background: rgba(255, 255, 255, 0.95);
  transition: all 0.3s ease;
}

.todo-input:focus {
  border-color: white;
  background: white;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2);
}

.todo-input::placeholder {
  color: #999;
}

.add-btn {
  width: 45px;
  height: 45px;
  border: none;
  border-radius: 50%;
  background: white;
  color: #00b4d8;
  font-size: 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.add-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.add-btn:active {
  transform: scale(0.95);
}

/* 工具栏 */
.toolbar {
  display: flex;
  gap: 8px;
}

.tool-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.tool-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.tool-btn.danger:hover {
  background: rgba(245, 87, 108, 0.5);
}

.tool-btn .icon {
  font-size: 16px;
}

.tool-btn .text {
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-top {
    flex-direction: column;
    gap: 15px;
  }
  
  .title-text {
    font-size: 20px;
  }
  
  .toolbar {
    width: 100%;
    justify-content: center;
  }
}
</style>
