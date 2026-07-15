<template>
  <transition name="toast-fade">
    <div v-if="visible" class="toast" :class="type">
      <span class="toast-icon">{{ iconMap[type] }}</span>
      <span class="toast-message">{{ message }}</span>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ToastMessage',
  data() {
    return {
      visible: false,
      message: '',
      type: 'success',
      timer: null,
      iconMap: {
        success: '✓',
        error: '✗',
        warning: '⚠',
        info: 'ℹ'
      }
    };
  },
  methods: {
    show(message, type = 'success', duration = 2000) {
      this.message = message;
      this.type = type;
      this.visible = true;
      
      if (this.timer) {
        clearTimeout(this.timer);
      }
      
      this.timer = setTimeout(() => {
        this.visible = false;
      }, duration);
    }
  }
};
</script>

<style scoped>
.toast {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  padding: 15px 25px;
  border-radius: 25px;
  color: white;
  font-size: 15px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 9999;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  max-width: 90%;
}

.toast.success {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.toast.error {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.toast.warning {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.toast.info {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.toast-icon {
  font-size: 18px;
  font-weight: bold;
}

.toast-message {
  line-height: 1.4;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}

.toast-fade-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

.toast-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}
</style>
