/* global process */
import { execSync } from 'child_process'

try {
  // 执行 ESLint 检测但允许无限数量的警告
  execSync('eslint --fix --max-warnings=1000000', { stdio: 'inherit' })
} catch (e) {
  // 当有 error 类型规则被触发时，才会退出并阻止提交
  process.exit(e.status)
}
