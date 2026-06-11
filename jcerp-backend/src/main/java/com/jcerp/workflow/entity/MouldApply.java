package com.jcerp.workflow.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.util.Date;

@Data
@TableName("OA_MOULD_APPLY")
public class MouldApply {
    
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    
    // 关联提案号
    private String proposalNo;
    
    // 模具名称
    private String mouldName;
    
    // 运营人员 (JSON 数组存储)
    private String operator;
    
    // 是否自主设计 (是/否)
    private String isSelfDesigned;
    
    // ID 设计师
    private String idDesigner;
    
    // 是否免费 (是/否)
    private String isFree;
    
    // 报价金额
    private Double quoteAmount;
    
    // 报价意见
    private String quoteOpinion;
    
    // 功能及自主设计特点 (JSON 数组存储)
    private String features;
    
    // 备注说明
    private String remark;
    
    // 状态：0-草稿, 1-审批中, 2-已通过, 3-已驳回
    private Integer status;
    
    private Date createTime;
    private Date updateTime;
}
