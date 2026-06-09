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
     * 保存流程定义 JSON 到 Oracle 数据库
     */
    @PostMapping("/save")
    public Map<String, Object> saveWorkflow(@RequestBody Map<String, Object> workflowJson) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 将接收到的 JSON 树转换为字符串
            String jsonString = objectMapper.writeValueAsString(workflowJson);
            
            // 构建实体对象
            WorkflowDef def = new WorkflowDef();
            def.setName("测试审批流"); // 实际场景中应从前端传递或单独抽取
            def.setWorkflowJson(jsonString);
            def.setCreateTime(new Date());
            def.setUpdateTime(new Date());
            
            // 使用 MyBatis-Plus 保存到数据库
            workflowDefService.save(def);
            
            response.put("code", 200);
            response.put("message", "流程配置保存成功");
            response.put("data", def.getId()); // 返回 MyBatis 生成的主键 ID
            
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
