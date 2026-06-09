export const mockWorkflowData = {
  nodeId: "node_start",
  type: "start",
  name: "发起人",
  content: "所有人",
  childNode: {
    nodeId: "node_1",
    type: "approver",
    name: "部门主管审批",
    content: "直属主管",
    props: {
      assigneeType: "director",
      signType: "and"
    },
    childNode: {
      nodeId: "node_route",
      type: "route",
      conditionNodes: [
        {
          nodeId: "cond_1",
          name: "金额大于1万",
          type: "condition",
          content: "预估金额 > 10000",
          childNode: {
            nodeId: "node_2",
            type: "approver",
            name: "总经理审批",
            content: "指定人员：张总",
            childNode: null
          }
        },
        {
          nodeId: "cond_2",
          name: "默认情况",
          type: "condition",
          content: "其他条件",
          childNode: null
        }
      ],
      childNode: {
        nodeId: "node_3",
        type: "cc",
        name: "抄送财务",
        content: "抄送给：财务部",
        childNode: null
      }
    }
  }
}
