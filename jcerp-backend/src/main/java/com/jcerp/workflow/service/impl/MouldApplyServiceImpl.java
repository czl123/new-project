package com.jcerp.workflow.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.jcerp.workflow.entity.MouldApply;
import com.jcerp.workflow.mapper.MouldApplyMapper;
import com.jcerp.workflow.service.IMouldApplyService;
import org.springframework.stereotype.Service;

@Service
public class MouldApplyServiceImpl extends ServiceImpl<MouldApplyMapper, MouldApply> implements IMouldApplyService {
}
