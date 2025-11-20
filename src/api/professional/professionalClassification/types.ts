export interface ProfessionalClassificationVO {
  /**
   * 主键
   */
  id: string | number;

  /**
   * 教育层级（本科、专科）
   */
  educationHierarchy: string;

  /**
   * 编码(国家定义)
   */
  code: string;

  /**
   * 专业名称(国家定义)
   */
  name: string;

  /**
   * 层级
   */
  hierarchy: string;

  /**
   * 子节点
   */
  children?: ProfessionalClassificationVO[];

  /**
   * 是否有子节点
   */
  hasChildren?: boolean;

}

export interface ProfessionalClassificationForm extends BaseEntity {
  /**
   * 主键
   */
  id?: string | number;

  /**
   * 教育层级（本科、专科）
   */
  educationHierarchy?: string;

  /**
   * 编码(国家定义)
   */
  code?: string;

  /**
   * 专业名称(国家定义)
   */
  name?: string;

  /**
   * 层级
   */
  hierarchy?: string;

}

export interface ProfessionalClassificationQuery extends PageQuery {

  /**
   * 教育层级（本科、专科）
   */
  educationHierarchy?: string;

  /**
   * 编码(国家定义)
   */
  code?: string;

  /**
   * 专业名称(国家定义)
   */
  name?: string;

  /**
   * 层级
   */
  hierarchy?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
