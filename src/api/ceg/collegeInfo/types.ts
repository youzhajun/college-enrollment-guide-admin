export interface CollegeInfoVO {
  /**
   * 主键
   */
  id: string | number;

  /**
   * 院校名称
   */
  collegeName: string;

  /**
   * 院校代码-字母开头+数字
   */
  collegeCode: string;

  /**
   * 办学性质
   */
  institutionNature: string;

  /**
   * 学校隶属信息
   */
  affiliationInfo: string;

  /**
   * 学校类别
   */
  collegeType: string;

  /**
   * 学校地址信息
   */
  addressInfo: string;

  /**
   * 硕士点
   */
  flagPostgraduate: number;

  /**
   * 博士点
   */
  flagPhd: number;

  
 /**
   * 双高计划
   */
  flagDoubleHeightPlan?: string;

   /**
   * 示范院校
   */
  flagDemonstrateVocationalCollege?: string;


}

export interface CollegeInfoForm extends BaseEntity {
  /**
   * 主键
   */
  id?: string | number;

  /**
   * 院校名称
   */
  collegeName?: string;

  /**
   * 院校代码-字母开头+数字
   */
  collegeCode?: string;

  /**
   * 办学性质
   */
  institutionNature?: string;

  /**
   * 学校隶属信息
   */
  affiliationInfo?: string;

  /**
   * 学校类别
   */
  collegeType?: string;

  /**
   * 学校地址信息
   */
  addressInfo: string;

  /**
   * 官网地址
   */
  officialWebsiteUrl?: string;

  /**
   * 百科地址
   */
  baikeUrl?: string;

  /**
   * 硕士点
   */
  flagPostgraduate?: number;

  /**
   * 博士点
   */
  flagPhd?: number;


 /**
   * 双高计划
   */
  flagDoubleHeightPlan?: string;

   /**
   * 示范院校
   */
  flagDemonstrateVocationalCollege?: string;


}

export interface CollegeInfoQuery extends PageQuery {

  /**
   * 院校名称
   */
  collegeName?: string;

  /**
   * 院校代码-字母开头+数字
   */
  collegeCode?: string;

  /**
   * 院校代码-纯数字
   */
  collegeCodeNum?: number;

  /**
   * 办学性质
   */
  institutionNature?: string;

  /**
   * 学校隶属信息
   */
  affiliationInfo?: string;

  /**
   * 学校类别
   */
  collegeType?: string;

  /**
   * 学校地址信息
   */
  addressInfo: string;

  /**
   * 硕士点
   */
  flagPostgraduate?: number;

  /**
   * 博士点
   */
  flagPhd?: number;

 /**
   * 双高计划
   */
  flagDoubleHeightPlan?: string;

   /**
   * 示范院校
   */
  flagDemonstrateVocationalCollege?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
