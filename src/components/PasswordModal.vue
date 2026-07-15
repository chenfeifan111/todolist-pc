<template>
  <transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-icon">🔐</div>
        <h2 class="modal-title">数据已加密</h2>
        <p class="modal-text">请输入密钥以解锁数据</p>
        
        <div class="input-wrapper">
          <input
            ref="passwordInput"
            type="password"
            class="password-input"
            v-model="password"
            placeholder="请输入密钥"
            @keypress.enter="confirm"
            maxlength="50"
          />
        </div>
        
        <div class="modal-actions">
          <button class="btn btn-cancel" @click="closeModal">取消</button>
          <button class="btn btn-primary" @click="confirm">确认</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'PasswordModal',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'confirm'],
  data() {
    return {
      password: ''
    };
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.password = '';
        this.$nextTick(() => {
          this.$refs.passwordInput?.focus();
        });
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    confirm() {
      if (!this.password) {
        return;
      }
      this.$emit('confirm', this.password);
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 40px 30px 30px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.modal-title {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px 0;
}

.modal-text {
  font-size: 14px;
  color: #666;
  margin: 0 0 25px 0;
  line-height: 1.6;
}

.input-wrapper {
  margin-bottom: 25px;
}

.password-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 15px;
  outline: none;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.password-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn {
  padding: 12px 30px;
  border: none;
  border-radius: 25px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;
}

.btn-cancel {
  background: #f0f0f0;
  color: #666;
}

.btn-cancel:hover {
  background: #e0e0e0;
  transform: translateY(-2px);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn:active {
  transform: translateY(0);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
