<template>
  <transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>🔐 数据加密设置</h2>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        
        <div class="modal-body">
          <div v-if="currentlyEncrypted" class="info-box warning">
            <p>⚠️ 您的数据当前已加密</p>
          </div>
          
          <div v-else class="info-box info">
            <p>💡 设置密钥后，数据将被加密存储</p>
            <p class="small">请妥善保管密钥，遗失后将无法恢复数据</p>
          </div>
          
          <div v-if="currentlyEncrypted" class="form-group">
            <label>当前密钥</label>
            <input 
              type="password"
              class="input"
              v-model="password"
              placeholder="请输入当前密钥进行验证"
              @keypress.enter="handleSubmit"
              maxlength="50"
            />
          </div>
          
          <div v-if="!currentlyEncrypted || showNewPassword" class="form-group">
            <label>{{ currentlyEncrypted ? '新密钥' : '设置密钥' }}</label>
            <input 
              type="password"
              class="input"
              v-model="confirmPassword"
              :placeholder="currentlyEncrypted ? '输入新密钥或留空移除加密' : '请输入密钥'"
              @keypress.enter="handleSubmit"
              maxlength="50"
            />
          </div>
          
          <div v-if="!currentlyEncrypted && confirmPassword" class="form-group">
            <label>确认密钥</label>
            <input 
              type="password"
              class="input"
              v-model="confirmPassword2"
              placeholder="再次输入密钥"
              @keypress.enter="handleSubmit"
              maxlength="50"
            />
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal">取消</button>
          <button 
            v-if="currentlyEncrypted && confirmPassword === '' && !showNewPassword"
            class="btn btn-warning"
            @click="showNewPassword = true"
          >
            修改/移除密钥
          </button>
          <button class="btn btn-primary" @click="handleSubmit">
            {{ getButtonText }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'EncryptModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    currentlyEncrypted: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'confirm'],
  data() {
    return {
      password: '',
      confirmPassword: '',
      confirmPassword2: '',
      showNewPassword: false
    };
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.password = '';
        this.confirmPassword = '';
        this.confirmPassword2 = '';
        this.showNewPassword = false;
      }
    }
  },
  computed: {
    getButtonText() {
      if (this.currentlyEncrypted) {
        if (this.showNewPassword || this.confirmPassword) {
          return this.confirmPassword ? '确认修改' : '移除加密';
        }
        return '下一步';
      }
      return '启用加密';
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    handleSubmit() {
      if (this.currentlyEncrypted) {
        // 已加密的情况
        if (!this.password) {
          alert('请输入当前密钥！');
          return;
        }
        
        if (this.showNewPassword || this.confirmPassword) {
          // 修改密钥或移除加密（移除长度限制）
          this.$emit('confirm', this.password, this.confirmPassword || null);
        } else {
          // 仅验证当前密钥，准备修改
          this.showNewPassword = true;
        }
      } else {
        // 未加密的情况 - 设置新密钥（移除长度限制）
        if (!this.confirmPassword) {
          alert('请输入密钥！');
          return;
        }
        if (this.confirmPassword !== this.confirmPassword2) {
          alert('两次输入的密钥不一致！');
          return;
        }
        this.$emit('confirm', null, this.confirmPassword);
      }
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
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 25px;
  border-bottom: 2px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.close-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: #f0f0f0;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

.close-btn:hover {
  background: #e0e0e0;
  transform: rotate(90deg);
}

.modal-body {
  padding: 25px;
}

.info-box {
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.info-box.warning {
  background: linear-gradient(135deg, #fff3cd 0%, #ffe69c 100%);
  border: 2px solid #ffc107;
}

.info-box.info {
  background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);
  border: 2px solid #17a2b8;
}

.info-box p {
  margin: 0;
  color: #333;
  font-size: 14px;
}

.info-box .small {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.modal-footer {
  padding: 20px 25px;
  border-top: 2px solid #f0f0f0;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-warning {
  background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
  color: white;
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
