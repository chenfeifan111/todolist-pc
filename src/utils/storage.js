/**
 * 本地存储工具类
 * 提供加密存储、读取、导出、导入功能
 */

const STORAGE_KEY = 'todolist_data';
const ENCRYPT_KEY = 'todolist_encrypt_key';

/**
 * 简单的 XOR 加密/解密函数
 * @param {string} str - 要加密/解密的字符串
 * @param {string} key - 密钥
 * @returns {string} 加密/解密后的字符串
 */
function xorEncrypt(str, key) {
  if (!key) return str;
  
  let result = '';
  for (let i = 0; i < str.length; i++) {
    result += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(result); // Base64 编码
}

function xorDecrypt(str, key) {
  if (!key) return str;
  
  try {
    const decoded = atob(str); // Base64 解码
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  } catch (e) {
    console.error('解密失败:', e);
    return null;
  }
}

/**
 * 保存数据到本地存储
 * @param {Array} data - 待办事项数组
 * @param {string} encryptKey - 加密密钥（可选）
 */
export function saveData(data, encryptKey = null) {
  try {
    const jsonStr = JSON.stringify(data);
    
    // 如果提供了加密密钥，则加密存储
    if (encryptKey) {
      const encrypted = xorEncrypt(jsonStr, encryptKey);
      localStorage.setItem(STORAGE_KEY, encrypted);
      localStorage.setItem(ENCRYPT_KEY, 'true');
    } else {
      localStorage.setItem(STORAGE_KEY, jsonStr);
      localStorage.setItem(ENCRYPT_KEY, 'false');
    }
    
    return true;
  } catch (e) {
    console.error('保存数据失败:', e);
    return false;
  }
}

/**
 * 从本地存储读取数据
 * @param {string} encryptKey - 解密密钥（如果数据已加密）
 * @returns {Array} 待办事项数组
 */
export function loadData(encryptKey = null) {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    const isEncrypted = localStorage.getItem(ENCRYPT_KEY) === 'true';
    
    if (!storedData) {
      return [];
    }
    
    // 如果数据已加密，需要解密
    if (isEncrypted) {
      if (!encryptKey) {
        throw new Error('数据已加密，请提供解密密钥');
      }
      const decrypted = xorDecrypt(storedData, encryptKey);
      if (!decrypted) {
        throw new Error('解密失败，密钥可能不正确');
      }
      return JSON.parse(decrypted);
    }
    
    return JSON.parse(storedData);
  } catch (e) {
    console.error('读取数据失败:', e);
    throw e;
  }
}

/**
 * 检查数据是否已加密
 * @returns {boolean}
 */
export function isDataEncrypted() {
  return localStorage.getItem(ENCRYPT_KEY) === 'true';
}

/**
 * 导出数据为 JSON 文件
 * @param {Array} data - 待办事项数组
 * @param {string} filename - 文件名
 */
export function exportData(data, filename = 'todolist-backup.json') {
  try {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    return true;
  } catch (e) {
    console.error('导出数据失败:', e);
    return false;
  }
}

/**
 * 从 JSON 文件导入数据
 * @param {File} file - 文件对象
 * @returns {Promise<Array>} 待办事项数组
 */
export function importData(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('请选择文件'));
      return;
    }
    
    if (!file.name.endsWith('.json')) {
      reject(new Error('请选择 JSON 格式的文件'));
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        // 验证数据格式
        if (!Array.isArray(data)) {
          reject(new Error('文件格式不正确'));
          return;
        }
        
        // 验证每个项目的格式
        for (const item of data) {
          if (!Object.prototype.hasOwnProperty.call(item, 'todo') || !Object.prototype.hasOwnProperty.call(item, 'done')) {
            reject(new Error('文件格式不正确'));
            return;
          }
        }
        
        resolve(data);
      } catch (e) {
        reject(new Error('文件解析失败：' + e.message));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };
    
    reader.readAsText(file);
  });
}

/**
 * 清除所有数据
 */
export function clearData() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(ENCRYPT_KEY);
}

/**
 * 获取数据统计信息
 * @param {Array} data - 待办事项数组
 * @returns {Object} 统计信息
 */
export function getStatistics(data) {
  const total = data.length;
  const completed = data.filter(item => item.done).length;
  const pending = total - completed;
  
  return {
    total,
    completed,
    pending,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
  };
}
