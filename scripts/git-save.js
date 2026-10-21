import { execSync } from 'child_process';

function run(command, options = {}) {
  return execSync(command, { stdio: 'pipe', encoding: 'utf-8', ...options }).trim();
}

function runInherit(command) {
  execSync(command, { stdio: 'inherit' });
}

try {
  // 1. 获取当前分支
  let currentBranch = 'master';
  try {
    currentBranch = run('git branch --show-current') || 'master';
  } catch (e) {
    // fallback
  }

  // 2. 检查是否有修改
  const status = run('git status --porcelain');

  // 3. 提交信息（支持传参：npm run save "你的描述"）
  const customMsg = process.argv.slice(2).join(' ').trim();
  const dateStr = new Date().toLocaleString('zh-CN', { hour12: false });
  const commitMsg = customMsg || `update: ${dateStr}`;

  if (status) {
    console.log('\x1b[36m%s\x1b[0m', '📦 正在暂存并提交修改...');
    runInherit('git add -A');
    runInherit(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`);
    console.log('\x1b[32m%s\x1b[0m', `✓ 提交成功: "${commitMsg}"`);
  } else {
    console.log('\x1b[33m%s\x1b[0m', 'ℹ️ 工作区没有未提交的改动。');
  }

  // 4. 推送到远程仓库
  console.log('\x1b[36m%s\x1b[0m', `🚀 正在推送到远程 origin/${currentBranch}...`);
  runInherit(`git push origin ${currentBranch}`);
  console.log('\x1b[32m%s\x1b[0m', '🎉 全部操作完成！');
} catch (error) {
  console.error('\x1b[31m%s\x1b[0m', '❌ 提交或推送过程中出错:');
  if (error.stderr) {
    console.error(error.stderr);
  } else if (error.message) {
    console.error(error.message);
  }
  process.exit(1);
}
