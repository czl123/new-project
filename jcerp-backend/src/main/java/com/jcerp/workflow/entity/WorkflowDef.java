package com.jcerp.workflow.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.util.Date;

@Data
@TableName("OA_WORKFLOW_DEF")
public class WorkflowDef {
    
    // 使用 MyBatis-Plus 自带的雪花算法生成唯一 ID
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    
    // 流程名称
    private String name;

    // 业务单据类型
    @TableField("BIZTYPE")
    private String bizType;
    
    // 流程配置生成的完整 JSON 字符串 (映射到 Oracle 的 CLOB)
    private String workflowJson;
    
    private Date createTime;
    private Date updateTime;
}
