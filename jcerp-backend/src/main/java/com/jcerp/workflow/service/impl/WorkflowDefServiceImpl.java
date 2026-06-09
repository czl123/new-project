package com.jcerp.workflow.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.jcerp.workflow.entity.WorkflowDef;
import com.jcerp.workflow.mapper.WorkflowDefMapper;
import com.jcerp.workflow.service.IWorkflowDefService;
import org.springframework.stereotype.Service;

@Service
public class WorkflowDefServiceImpl extends ServiceImpl<WorkflowDefMapper, WorkflowDef> implements IWorkflowDefService {
}
