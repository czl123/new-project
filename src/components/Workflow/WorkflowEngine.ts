/**
 * 简易流程引擎模拟类
 * 用于解析从 Workflow Editor 生成的 JSON，并根据传入的业务表单数据（如金额）计算出真实的审批路径。
 */

export interface FormContext {
  [key: string]: any;
}

export class WorkflowEngine {
  private workflowConfig: any;

  constructor(workflowConfig: any) {
    this.workflowConfig = workflowConfig;
  }

  /**
   * 评估条件表达式（极其简化的版本，仅用于演示）
   * 实际生产环境推荐使用 jsep 或类似于 rules-engine 的成熟库
   */
  private evaluateCondition(conditionContent: string, context: FormContext): boolean {
    if (!conditionContent || conditionContent === '其他条件' || conditionContent === '默认情况') {
      return true; // 默认分支兜底
    }

    try {
      // 模拟简单的数值比较，例如 "预估金额 > 10000"
      if (conditionContent.includes('>')) {
        const [fieldStr, valStr] = conditionContent.split('>');
        // 这里强行映射 "预估金额" 到 context.amount，实际应有严格的字段映射
        const contextValue = fieldStr.includes('金额') ? context.amount : 0;
        return Number(contextValue) > Number(valStr);
      }
      return true;
    } catch (e) {
      console.warn('条件评估失败', e);
      return false;
    }
  }

  /**
   * 递归解析流程树，根据业务上下文（context）计算出线性的审批节点列表
   */
  public resolvePath(context: FormContext, currentNode: any = this.workflowConfig, path: any[] = []): any[] {
    if (!currentNode) return path;

    // 记录有效节点（排除单纯的路由辅助节点）
    if (currentNode.type !== 'route' && currentNode.type !== 'condition') {
      path.push({
        nodeId: currentNode.nodeId,
        type: currentNode.type,
        name: currentNode.name,
        content: currentNode.content,
        assigneeType: currentNode.props?.assigneeType,
        status: 'pending' // 初始状态为待处理
      });
    }

    if (currentNode.childNode) {
      // 如果下一级是路由节点（条件分支）
      if (currentNode.childNode.type === 'route') {
        const routeNode = currentNode.childNode;
        let matchedBranch = null;

        // 遍历所有分支寻找匹配的条件
        for (const branch of routeNode.conditionNodes || []) {
          if (this.evaluateCondition(branch.content, context)) {
            matchedBranch = branch;
            break; // 匹配到第一个满足的分支即跳出
          }
        }

        // 如果找到匹配分支，则深入解析分支内部的节点
        if (matchedBranch && matchedBranch.childNode) {
          this.resolvePath(context, matchedBranch.childNode, path);
        }

        // 分支解析完毕后，继续解析路由节点合并后的后续公共节点
        if (routeNode.childNode) {
          this.resolvePath(context, routeNode.childNode, path);
        }
      } else {
        // 如果是普通节点，直接递归
        this.resolvePath(context, currentNode.childNode, path);
      }
    }

    return path;
  }
}
