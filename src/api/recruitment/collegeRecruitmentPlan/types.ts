export interface CollegeRecruitmentPlanVO {
  /**
   * 主键
   */
  id: string | number;

  /**
   * 目标省份
   */
  targetProvince: string;

  /**
   * 招生年份
   */
  recruitmentYear: number;

  /**
   * 学校ID
   */
  collegeId: string | number;

  /**
   * 学校名称
   */
  collegeName?: string;

  /**
   * 类型（专科招生、本科招生）
   */
  recruitmentType: string;

  /**
   * 专业名称
   */
  majorName: string;

  /**
   * 专业代码 - 院校代码
   */
  majorCodeCollege: string;

  /**
   * 专业代码 - 国家代码
   */
  majorCodeNational: string;

  /**
   * 专业大类
   */
  majorCategoryName: string;

  /**
   * 选科限制
   */
  subjectRestriction: string;

  /**
   * 招生人数
   */
  enrollmentNumbers: number;

  /**
   * 学费
   */
  tuitionFee: number;

  /**
   * 办学性质
   */
  institutionNature?: string;

  /**
   * 学校隶属
   */
  affiliationInfo?: string;

  /**
   * 学校类别
   */
  collegeType?: string;

  /**
   * 院校地址
   */
  addressInfo?: string;

  /**
   * 硕士点
   */
  flagPostgraduate?: string;

  /**
   * 博士点
   */
  flagPhd?: string;

  /**
   * 双高计划
   */
  flagDoubleHeightPlan?: string;

  /**
   * 示范高职
   */
  flagDemonstrateVocationalCollege?: string;

  /**
   * 专业大类
   */
  pMajorName?: string;

}

export interface CollegeRecruitmentPlanForm extends BaseEntity {
  /**
   * 主键
   */
  id?: string | number;

  /**
   * 目标省份
   */
  targetProvince?: string;

  /**
   * 招生年份
   */
  recruitmentYear?: number;

  /**
   * 学校ID
   */
  collegeId?: string | number;

  /**
   * 类型（专科招生、本科招生）
   */
  recruitmentType?: string;

  /**
   * 专业名称
   */
  majorName?: string;

  /**
   * 专业代码 - 院校代码
   */
  majorCodeCollege?: string;

  /**
   * 专业代码 - 国家代码
   */
  majorCodeNational?: string;

  /**
   * 专业大类
   */
  majorCategoryName?: string;

  /**
   * 选科限制
   */
  subjectRestriction?: string;

  /**
   * 招生人数
   */
  enrollmentNumbers?: number;

  /**
   * 学费
   */
  tuitionFee?: number;

}

export interface CollegeRecruitmentPlanQuery extends PageQuery {

  /**
   * 目标省份
   */
  targetProvince?: string;

  /**
   * 招生年份
   */
  recruitmentYear?: number;

  /**
   * 学校ID
   */
  collegeId?: string | number;

  /**
   * 类型（专科招生、本科招生）
   */
  recruitmentType?: string;

  /**
   * 专业名称
   */
  majorName?: string;

  /**
   * 专业代码 - 院校代码
   */
  majorCodeCollege?: string;

  /**
   * 专业代码 - 国家代码
   */
  majorCodeNational?: string;

  /**
   * 专业大类
   */
  majorCategoryName?: string;

  /**
   * 选科限制
   */
  subjectRestriction?: string;

  /**
   * 招生人数
   */
  enrollmentNumbers?: number;

  /**
   * 学费
   */
  tuitionFee?: number;

  /**
   * 双高计划
   */
  flagDoubleHeightPlan?: string;

  /**
   * 示范高职
   */
  flagDemonstrateVocationalCollege?: string;

  /**
   * 办学性质
   */
  institutionNature?: string;

  /**
   * 教育层次
   */
  educationHierarchy?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
