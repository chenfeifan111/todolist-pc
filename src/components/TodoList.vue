<template>
  <div class="todo-list-container">
    <div class="list-title">
      <span>{{ title }}</span>
      <span class="count-badge">{{ items.length }}</span>
    </div>
    
    <div v-if="items.length === 0" class="empty-state">
      <div class="empty-state-icon">{{ emptyIcon }}</div>
      <p>{{ emptyText }}</p>
    </div>
    
    <ul v-else class="todo-list">
      <TodoItem
        v-for="item in items"
        :key="item.id"
        :item="item"
        :allow-delete="allowDelete"
        @toggle="$emit('toggle', $event)"
        @delete="$emit('delete', $event)"
        @edit="$emit('edit', $event, $arguments[1])"
      />
    </ul>
  </div>
</template>

<script>
import TodoItem from './TodoItem.vue';

export default {
  name: 'TodoList',
  components: {
    TodoItem
  },
  props: {
    title: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      required: true
    },
    emptyIcon: {
      type: String,
      default: '📋'
    },
    emptyText: {
      type: String,
      default: '暂无内容'
    },
    allowDelete: {
      type: Boolean,
      default: false
    }
  },
  emits: ['toggle', 'delete', 'edit']
};
</script>

<style scoped>
.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
