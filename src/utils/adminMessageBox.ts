import { h, type VNode } from 'vue';
import { ElMessageBox } from 'element-plus';

interface AdminConfirmOptions {
  title: string;
  message: string | VNode;
  confirmText?: string;
  cancelText?: string;
}

interface AdminPromptOptions {
  title: string;
  label?: string;
  placeholder?: string;
  confirmText?: string;
  cancelText?: string;
  inputType?: 'text' | 'textarea';
}

/** 管理端统一二次确认框；取消或关闭时返回 false，不向业务层抛出取消异常。 */
export async function confirmAdminAction({
  title,
  message,
  confirmText = '確認',
  cancelText = '取消',
}: AdminConfirmOptions): Promise<boolean> {
  try {
    await ElMessageBox.confirm(message, title, {
      type: 'info',
      customClass: 'admin-message-box--brand',
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      closeOnClickModal: false,
    });
    return true;
  } catch {
    return false;
  }
}

/** 管理端统一输入确认框；取消或关闭时返回 null。 */
export async function promptAdminAction({
  title,
  label = '',
  placeholder = '',
  confirmText = '確認',
  cancelText = '取消',
  inputType = 'textarea',
}: AdminPromptOptions): Promise<string | null> {
  try {
    const result = await ElMessageBox.prompt(label ? h('span', { class: 'admin-message-box__field-label' }, label) : '', title, {
      customClass: 'admin-message-box--brand',
      inputType,
      inputPlaceholder: placeholder,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      closeOnClickModal: false,
    });
    return result.value || '';
  } catch {
    return null;
  }
}
