package com.jcerp.workflow.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jcerp.workflow.entity.WorkflowDef;
import com.jcerp.workflow.service.IWorkflowDefService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/workflow/def")
public class WorkflowDefController {

    @Autowired
    private IWorkflowDefService workflowDefService;

    @Autowired
    private ObjectMapper objectMapper;

    /**
     * 获取所有流程定义列表
     */
    @GetMapping("/list")
    public Map<String, Object> listWorkflows() {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("code", 200);
            response.put("data", workflowDefService.list());
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", "查询失败: " + e.getMessage());
        }
        return response;
    }

    /**
     * 根据业务类型获取流程定义
     */
    @GetMapping("/get")
    public Map<String, Object> getWorkflowByBizType(@RequestParam String bizType) {
        Map<String, Object> response = new HashMap<>();
        try {
            WorkflowDef def = workflowDefService.lambdaQuery()
                    .eq(WorkflowDef::getBizType, bizType)
                    .orderByDesc(WorkflowDef::getUpdateTime)
                    .last("FETCH FIRST 1 ROWS ONLY") // 仅取最新的一条
                    .one();
            
            response.put("code", 200);
            response.put("data", def);
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", "查询失败: " + e.getMessage());
        }
        return response;
    }

    /**
     * 删除流程定义
     */
    @DeleteMapping("/delete/{id}")
    public Map<String, Object> deleteWorkflow(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            boolean success = workflowDefService.removeById(id);
            if (success) {
                response.put("code", 200);
                response.put("message", "删除成功");
            } else {
                response.put("code", 404);
                response.put("message", "记录不存在");
            }
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", "删除失败: " + e.getMessage());
        }
        return response;
    }

    /**
     * 保存流程定义 JSON 到 Oracle 数据库
     */
    @PostMapping("/save")
    public Map<String, Object> saveWorkflow(@RequestBody Map<String, Object> payload) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String bizType = (String) payload.get("bizType");
            Object workflowData = payload.get("workflowData");
            
            // 将接收到的 JSON 树转换为字符串
            String jsonString = objectMapper.writeValueAsString(workflowData);
            
            // 检查数据库中是否已存在该类型的配置
            WorkflowDef def = workflowDefService.lambdaQuery()
                    .eq(WorkflowDef::getBizType, bizType)
                    .orderByDesc(WorkflowDef::getUpdateTime)
                    .last("FETCH FIRST 1 ROWS ONLY")
                    .one();
            
            if (def == null) {
                // 不存在则新建
                def = new WorkflowDef();
                def.setBizType(bizType);
                def.setCreateTime(new Date());
            }
            
            // 更新属性
            def.setName(bizType + "审批流");
            def.setWorkflowJson(jsonString);
            def.setUpdateTime(new Date());
            
            // 使用 MyBatis-Plus 保存或更新
            workflowDefService.saveOrUpdate(def);
            
            response.put("code", 200);
            response.put("message", "流程配置保存成功");
            response.put("data", def.getId());
            
        } catch (JsonProcessingException e) {
            response.put("code", 500);
            response.put("message", "JSON 序列化失败");
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", "数据库保存失败: " + e.getMessage());
        }

        return response;
    }
}
