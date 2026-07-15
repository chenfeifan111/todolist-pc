<template>
  <li class="todo-item" :class="{ completed: item.done }">
    <!-- 复选框 -->
    <input 
      type="checkbox" 
      class="todo-checkbox"
      :checked="item.done"
      @change="$emit('toggle', item.id)"
    />
    
    <!-- 文本显示/编辑 -->
    <input 
      v-if="isEditing"
      type="text"
      class="todo-edit-input"
      v-model="editText"
      @blur="confirmEdit"
      @keypress.enter="confirmEdit"
      ref="editInput"
      maxlength="200"
    />
    <span 
      v-else
      class="todo-text"
      @click="startEdit"
    >
      {{ item.todo }}
    </span>
    
    <!-- 时间戳 -->
    <span class="todo-timestamp" v-if="item.timestamp">
      {{ formatTime(item.timestamp) }}
    </span>
    
    <!-- 删除按钮 -->
    <button class="todo-delete-btn" @click="$emit('delete', item.id)" :title="allowDelete ? '删除' : '移至已完成'">
      {{ allowDelete ? '×' : '→' }}
    </button>
  </li>
</template>

<script>
export default {
  name: 'TodoItem',
  props: {
    item: {
      type: Object,
      required: true
    },
    allowDelete: {
      type: Boolean,
      default: false
    }
  },
  emits: ['toggle', 'delete', 'edit'],
  data() {
    return {
      isEditing: false,
      editText: ''
    };
  },
  methods: {
    startEdit() {
      this.isEditing = true;
      this.editText = this.item.todo;
      this.$nextTick(() => {
        this.$refs.editInput.focus();
        this.$refs.editInput.select();
      });
    },
    confirmEdit() {
      const text = this.editText.trim();
      if (text.length === 0) {
        this.editText = this.item.todo;
        return;
      }
      if (text !== this.item.todo) {
        this.$emit('edit', this.item.id, text);
      }
      this.isEditing = false;
    },
    formatTime(timestamp) {
      const date = new Date(timestamp);
      const now = new Date();
      const diff = now - date;
      
      // 一分钟内
      if (diff < 60000) {
        return '刚刚';
      }
      // 一小时内
      if (diff < 3600000) {
        return `${Math.floor(diff / 60000)}分钟前`;
      }
      // 今天
      if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
      }
      // 其他
      return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
    }
  }
};
</script>

<style scoped src="../styles/todo.css"></style>
