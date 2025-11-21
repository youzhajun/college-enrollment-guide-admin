import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CollegeRecruitmentPlanVO, CollegeRecruitmentPlanForm, CollegeRecruitmentPlanQuery } from '@/api/recruitment/collegeRecruitmentPlan/types';

/**
 * 查询院校招生计划列表
 * @param query
 * @returns {*}
 */

export const listCollegeRecruitmentPlan = (query?: CollegeRecruitmentPlanQuery): AxiosPromise<CollegeRecruitmentPlanVO[]> => {
  return request({
    url: '/recruitment/collegeRecruitmentPlan/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询院校招生计划详细
 * @param id
 */
export const getCollegeRecruitmentPlan = (id: string | number): AxiosPromise<CollegeRecruitmentPlanVO> => {
  return request({
    url: '/recruitment/collegeRecruitmentPlan/' + id,
    method: 'get'
  });
};

/**
 * 新增院校招生计划
 * @param data
 */
export const addCollegeRecruitmentPlan = (data: CollegeRecruitmentPlanForm) => {
  return request({
    url: '/recruitment/collegeRecruitmentPlan',
    method: 'post',
    data: data
  });
};

/**
 * 修改院校招生计划
 * @param data
 */
export const updateCollegeRecruitmentPlan = (data: CollegeRecruitmentPlanForm) => {
  return request({
    url: '/recruitment/collegeRecruitmentPlan',
    method: 'put',
    data: data
  });
};

/**
 * 删除院校招生计划
 * @param id
 */
export const delCollegeRecruitmentPlan = (id: string | number | Array<string | number>) => {
  return request({
    url: '/recruitment/collegeRecruitmentPlan/' + id,
    method: 'delete'
  });
};

/**
 * 获取下拉框数据
 * @returns {*}
 */
export const getSelectData = (): AxiosPromise<{
  recruitmentYear: number[];
  recruitmentType: string[];
  subjectRestriction: string[];
  flagDoubleHeightPlan: string[];
  flagDemonstrateVocationalCollege: string[];
  institutionNature: string[];
}> => {
  return request({
    url: '/recruitment/collegeRecruitmentPlan/selectData',
    method: 'get'
  });
};