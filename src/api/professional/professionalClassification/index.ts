import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { ProfessionalClassificationVO, ProfessionalClassificationForm, ProfessionalClassificationQuery } from '@/api/professional/professionalClassification/types';

/**
 * 查询专业分类列表
 * @param query
 * @returns {*}
 */

export const listProfessionalClassification = (query?: ProfessionalClassificationQuery): AxiosPromise<ProfessionalClassificationVO[]> => {
  return request({
    url: '/professional/professionalClassification/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询专业分类详细
 * @param id
 */
export const getProfessionalClassification = (id: string | number): AxiosPromise<ProfessionalClassificationVO> => {
  return request({
    url: '/professional/professionalClassification/' + id,
    method: 'get'
  });
};

/**
 * 新增专业分类
 * @param data
 */
export const addProfessionalClassification = (data: ProfessionalClassificationForm) => {
  return request({
    url: '/professional/professionalClassification',
    method: 'post',
    data: data
  });
};

/**
 * 修改专业分类
 * @param data
 */
export const updateProfessionalClassification = (data: ProfessionalClassificationForm) => {
  return request({
    url: '/professional/professionalClassification',
    method: 'put',
    data: data
  });
};

/**
 * 删除专业分类
 * @param id
 */
export const delProfessionalClassification = (id: string | number | Array<string | number>) => {
  return request({
    url: '/professional/professionalClassification/' + id,
    method: 'delete'
  });
};
