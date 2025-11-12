import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CollegeInfoVO, CollegeInfoForm, CollegeInfoQuery } from '@/api/ceg/collegeInfo/types';

/**
 * 查询院校信息列表
 * @param query
 * @returns {*}
 */

export const listCollegeInfo = (query?: CollegeInfoQuery): AxiosPromise<CollegeInfoVO[]> => {
  return request({
    url: '/ceg/collegeInfo/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询院校信息详细
 * @param id
 */
export const getCollegeInfo = (id: string | number): AxiosPromise<CollegeInfoVO> => {
  return request({
    url: '/ceg/collegeInfo/' + id,
    method: 'get'
  });
};

/**
 * 新增院校信息
 * @param data
 */
export const addCollegeInfo = (data: CollegeInfoForm) => {
  return request({
    url: '/ceg/collegeInfo',
    method: 'post',
    data: data
  });
};

/**
 * 修改院校信息
 * @param data
 */
export const updateCollegeInfo = (data: CollegeInfoForm) => {
  return request({
    url: '/ceg/collegeInfo',
    method: 'put',
    data: data
  });
};

/**
 * 删除院校信息
 * @param id
 */
export const delCollegeInfo = (id: string | number | Array<string | number>) => {
  return request({
    url: '/ceg/collegeInfo/' + id,
    method: 'delete'
  });
};
