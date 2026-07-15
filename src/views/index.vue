<template>
  <div id="app">
    <!-- 头部组件 -->
    <TodoHeader
      :is-encrypted="isEncrypted"
      @add-todo="addTodo"
      @export="exportData"
      @import="triggerImport"
      @encrypt="showEncryptModal"
      @clear="clearAllData"
    />
    
    <!-- 主内容区 -->
    <main class="main-content">
      <div class="content-wrapper">
        
        <!-- 已完成列表 -->
        <TodoList
          title="✨ 已完成的计划"
          :items="completedTodos"
          empty-icon="💤"
          empty-text="还没有完成的事项哦~"
          allow-delete
          @toggle="toggleTodo"
          @delete="deleteTodo"
          @edit="editTodo"
        />
        
        <!-- 待完成列表 -->
        <TodoList
          title="📝 待完成的计划"
          :items="pendingTodos"
          empty-icon="🎈"
          empty-text="太棒了！暂无待办事项~"
          @toggle="toggleTodo"
          @delete="moveToDone"
          @edit="editTodo"
        />
      </div>
    </main>
    
    <!-- 加密设置弹窗 -->
    <EncryptModal
      :show="showEncrypt"
      :currently-encrypted="isEncrypted"
      @close="showEncrypt = false"
      @confirm="handleEncrypt"
    />
    
    <!-- 清空确认弹窗 -->
    <ClearModal
      :show="showClear"
      @close="showClear = false"
      @confirm="confirmClear"
    />
    
    <!-- 密码输入弹窗 -->
    <PromptModal
      :show="showPassword"
      title="数据已加密"
      message="请输入密钥以解锁数据"
      placeholder="请输入密钥"
      @close="handlePasswordCancel"
      @confirm="handlePasswordConfirm"
    />
    
    <!-- Toast 提示 -->
    <Toast ref="toast" />
    
    <!-- 隐藏的文件导入input -->
    <input
      ref="fileInput"
      type="file"
      accept=".json"
      style="display: none"
      @change="handleFileImport"
    />
  </div>
</template>

<script>
import TodoHeader from '../components/TodoHeader.vue';
import TodoList from '../components/TodoList.vue';
import EncryptModal from '../components/EncryptModal.vue';
import ClearModal from '../components/ClearModal.vue';
import PromptModal from '../components/PromptModal.vue';
import Toast from '../components/Toast.vue';
import {
  saveData,
  loadData,
  isDataEncrypted,
  exportData,
  importData,
  clearData,
  getStatistics
} from '../utils/storage';

export default {
  name: 'App',
  components: {
    TodoHeader,
    TodoList,
    EncryptModal,
    ClearModal,
    PromptModal,
    Toast
  },
  data() {
    return {
      todoList: [],
      currentEncryptKey: null,
      isEncrypted: false,
      showEncrypt: false,
      showClear: false,
      showPassword: false,
      nextId: 1
    };
  },
  computed: {
    pendingTodos() {
      return this.todoList.filter(item => !item.done);
    },
    completedTodos() {
      return this.todoList.filter(item => item.done);
    },
    statistics() {
      return getStatistics(this.todoList);
    }
  },
  mounted() {
    this.loadFromStorage();
  },
  methods: {
    // 从存储加载数据
    loadFromStorage() {
      try {
        this.isEncrypted = isDataEncrypted();
        
        if (this.isEncrypted) {
          // 数据已加密，显示密码弹窗
          this.showPassword = true;
          return;
        }
        
        this.todoList = loadData(this.currentEncryptKey);
        
        // 计算下一个ID
        if (this.todoList.length > 0) {
          this.nextId = Math.max(...this.todoList.map(item => item.id)) + 1;
        }
      } catch (e) {
        this.$refs.toast?.show('加载数据失败：' + e.message, 'error');
        this.todoList = [];
      }
    },
    
    // 处理密码确认
    handlePasswordConfirm(password) {
      try {
        this.currentEncryptKey = password;
        this.todoList = loadData(this.currentEncryptKey);
        
        // 计算下一个ID
        if (this.todoList.length > 0) {
          this.nextId = Math.max(...this.todoList.map(item => item.id)) + 1;
        }
        
        this.showPassword = false;
        this.$refs.toast.show('数据加载成功', 'success');
      } catch (e) {
        this.$refs.toast.show('密钥错误或数据损坏', 'error');
      }
    },
    
    // 处理密码取消
    handlePasswordCancel() {
      this.showPassword = false;
      this.todoList = [];
    },
    
    // 保存到存储
    saveToStorage() {
      saveData(this.todoList, this.currentEncryptKey);
    },
    
    // 添加待办事项
    addTodo(text) {
      const newTodo = {
        id: this.nextId++,
        todo: text,
        done: false,
        timestamp: Date.now()
      };
      this.todoList.push(newTodo);
      this.saveToStorage();
    },
    
    // 切换完成状态
    toggleTodo(id) {
      const todo = this.todoList.find(item => item.id === id);
      if (todo) {
        todo.done = !todo.done;
        this.saveToStorage();
      }
    },
    
    // 删除待办事项（已完成的）
    deleteTodo(id) {
      this.todoList = this.todoList.filter(item => item.id !== id);
      this.saveToStorage();
    },
    
    // 移动到已完成
    moveToDone(id) {
      const todo = this.todoList.find(item => item.id === id);
      if (todo) {
        todo.done = true;
        this.saveToStorage();
        this.$refs.toast.show('已移至完成列表', 'success');
      }
    },
    
    // 确认删除（不再使用）
    confirmDelete() {
      this.todoList = this.todoList.filter(item => item.id !== this.deleteId);
      this.saveToStorage();
      this.showDeleteConfirm = false;
      this.deleteId = null;
    },
    
    // 编辑待办事项
    editTodo(id, newText) {
      const todo = this.todoList.find(item => item.id === id);
      if (todo) {
        todo.todo = newText;
        this.saveToStorage();
      }
    },
    
    // 导出数据
    exportData() {
      if (this.todoList.length === 0) {
        this.$refs.toast.show('暂无数据可导出', 'warning');
        return;
      }
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const filename = `todolist-backup-${timestamp}.json`;
      
      if (exportData(this.todoList, filename)) {
        this.$refs.toast.show('导出成功', 'success');
      } else {
        this.$refs.toast.show('导出失败，请重试', 'error');
      }
    },
    
    // 触发文件选择
    triggerImport() {
      this.$refs.fileInput.click();
    },
    
    // 处理文件导入
    async handleFileImport(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      try {
        const data = await importData(file);
        
        // 直接合并模式，不再询问
        const imported = data.map(item => ({
          ...item,
          id: this.nextId++,
          timestamp: item.timestamp || Date.now()
        }));
        this.todoList.push(...imported);
        
        this.saveToStorage();
        this.$refs.toast.show(`成功导入 ${data.length} 条数据`, 'success');
      } catch (e) {
        this.$refs.toast.show('导入失败：' + e.message, 'error');
      }
      
      // 清空input，允许重复导入同一文件
      event.target.value = '';
    },
    
    // 显示加密弹窗
    showEncryptModal() {
      this.showEncrypt = true;
    },
    
    // 处理加密设置
    handleEncrypt(oldKey, newKey) {
      try {
        if (this.isEncrypted) {
          // 验证旧密钥
          loadData(oldKey);
          
          if (newKey) {
            // 修改密钥
            this.currentEncryptKey = newKey;
            this.isEncrypted = true;
            this.$refs.toast.show('密钥修改成功', 'success');
          } else {
            // 移除加密
            this.currentEncryptKey = null;
            this.isEncrypted = false;
            this.$refs.toast.show('已移除加密', 'info');
          }
        } else {
          // 设置新密钥
          this.currentEncryptKey = newKey;
          this.isEncrypted = true;
          this.saveToStorage();
          this.showEncrypt = false;
          this.$refs.toast.show('加密设置成功，页面即将刷新', 'success', 2000);
          
          // 2秒后刷新页面
          setTimeout(() => {
            window.location.reload();
          }, 2000);
          return;
        }
        
        this.saveToStorage();
        this.showEncrypt = false;
      } catch (e) {
        this.$refs.toast.show('操作失败：' + e.message, 'error');
      }
    },
    
    // 清除所有数据
    clearAllData() {
      this.showClear = true;
    },
    
    // 确认清空
    confirmClear() {
      clearData();
      this.todoList = [];
      this.currentEncryptKey = null;
      this.isEncrypted = false;
      this.nextId = 1;
      this.showClear = false;
      this.$refs.toast.show('数据已清除', 'success');
    }
  }
};
</script>

<style scoped>
#app {
  min-height: 100vh;
  background: #f5f7fa;
}

.main-content {
  padding: 30px 20px;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }
}
</style>
