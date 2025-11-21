<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="招生年份" prop="recruitmentYear" label-width="100">
              <el-select v-model="queryParams.recruitmentYear" placeholder="请选择招生年份" clearable style="width: 200px">
                <el-option v-for="item in selectData.recruitmentYear" :key="item" :label="String(item)" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="报考专业代码" prop="majorCodeCollege" label-width="100">
              <el-input v-model="queryParams.majorCodeCollege" placeholder="请输入报考专业代码" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="专业名称" prop="majorName" label-width="100">
              <el-input v-model="queryParams.majorName" placeholder="请输入专业名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="专业代码" prop="majorCodeNational" label-width="100">
              <el-input v-model="queryParams.majorCodeNational" placeholder="请输入专业代码" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="选科限制" prop="subjectRestriction" label-width="100">
              <el-select v-model="queryParams.subjectRestriction" placeholder="请选择选科限制" clearable style="width: 200px">
                <el-option v-for="item in selectData.subjectRestriction" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="招生类型" prop="recruitmentType" label-width="100">
              <el-select v-model="queryParams.recruitmentType" placeholder="请选择招生类型" clearable style="width: 200px">
                <el-option v-for="item in selectData.recruitmentType" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="双高计划" prop="flagDoubleHeightPlan" label-width="100">
              <el-select v-model="queryParams.flagDoubleHeightPlan" placeholder="请选择双高计划" clearable style="width: 240px">
                <el-option v-for="item in selectData.flagDoubleHeightPlan" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="示范高职" prop="flagDemonstrateVocationalCollege" label-width="100">
              <el-select v-model="queryParams.flagDemonstrateVocationalCollege" placeholder="请选择示范高职" clearable style="width: 240px">
                <el-option v-for="item in selectData.flagDemonstrateVocationalCollege" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="办学性质" prop="institutionNature" label-width="100">
              <el-select v-model="queryParams.institutionNature" placeholder="请选择办学性质" clearable style="width: 200px">
                <el-option v-for="item in selectData.institutionNature" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="教育层次" prop="educationHierarchy" label-width="100">
              <el-select v-model="queryParams.educationHierarchy" placeholder="请选择教育层次" clearable style="width: 200px">
                <el-option v-for="item in selectData.educationHierarchy" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['recruitment:collegeRecruitmentPlan:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['recruitment:collegeRecruitmentPlan:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['recruitment:collegeRecruitmentPlan:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['recruitment:collegeRecruitmentPlan:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="collegeRecruitmentPlanList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="院校名称" align="center" prop="collegeName" fixed="left" width="230"/>
        <el-table-column label="院校代码" align="center" prop="collegeCode" width="100"/>
        <el-table-column label="报考专业代码" align="center" prop="majorCodeCollege" width="120"/>
        <el-table-column label="专业名称" align="center" prop="majorName" width="450"/>
        <el-table-column label="专业代码" align="center" prop="majorCodeNational" width="100"/>
        <el-table-column label="专业大类" align="center" prop="pmajorName" width="180"/>
        <el-table-column label="招生类型" align="center" prop="recruitmentType" width="100"/>
        <el-table-column label="办学性质" align="center" prop="institutionNature" width="100"/>
        <el-table-column label="选科限制" align="center" prop="subjectRestriction" width="100"/>
        <el-table-column label="招生人数" align="center" prop="enrollmentNumbers" width="100"/>
        <el-table-column label="学制" align="center" prop="studyYears" width="80"/>
        <el-table-column label="学费" align="center" prop="tuitionFee" width="80"/>
        <el-table-column label="学校隶属" align="center" prop="affiliationInfo" width="150"/>
        <el-table-column label="学校类别" align="center" prop="collegeType" width="100"/>
        <el-table-column label="学校地址" align="center" prop="addressInfo" width="150"/>
        <el-table-column label="硕士点" align="center" prop="flagPostgraduate" width="100"/>
        <el-table-column label="博士点" align="center" prop="flagPhd" width="100"/>
        <el-table-column label="双高计划" align="center" prop="flagDoubleHeightPlan" width="120"/>
        <el-table-column label="示范高职" align="center" prop="flagDemonstrateVocationalCollege" width="100"/>
        <el-table-column label="操作" align="center" fixed="right"  class-name="small-padding fixed-width" width="100">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['recruitment:collegeRecruitmentPlan:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['recruitment:collegeRecruitmentPlan:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改院校招生计划对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="collegeRecruitmentPlanFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="目标省份" prop="targetProvince">
          <el-input v-model="form.targetProvince" placeholder="请输入目标省份" />
        </el-form-item>
        <el-form-item label="招生年份" prop="recruitmentYear">
          <el-input v-model="form.recruitmentYear" placeholder="请输入招生年份" />
        </el-form-item>
        <el-form-item label="学校ID" prop="collegeId">
          <el-input v-model="form.collegeId" placeholder="请输入学校ID" />
        </el-form-item>
        <el-form-item label="专业名称" prop="majorName">
          <el-input v-model="form.majorName" placeholder="请输入专业名称" />
        </el-form-item>
        <el-form-item label="专业代码 - 院校代码" prop="majorCodeCollege">
          <el-input v-model="form.majorCodeCollege" placeholder="请输入专业代码 - 院校代码" />
        </el-form-item>
        <el-form-item label="专业代码 - 国家代码" prop="majorCodeNational">
          <el-input v-model="form.majorCodeNational" placeholder="请输入专业代码 - 国家代码" />
        </el-form-item>
        <el-form-item label="专业大类" prop="majorCategoryName">
          <el-input v-model="form.majorCategoryName" placeholder="请输入专业大类" />
        </el-form-item>
        <el-form-item label="选科限制" prop="subjectRestriction">
          <el-input v-model="form.subjectRestriction" placeholder="请输入选科限制" />
        </el-form-item>
        <el-form-item label="招生人数" prop="enrollmentNumbers">
          <el-input v-model="form.enrollmentNumbers" placeholder="请输入招生人数" />
        </el-form-item>
        <el-form-item label="学费" prop="tuitionFee">
          <el-input v-model="form.tuitionFee" placeholder="请输入学费" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="CollegeRecruitmentPlan" lang="ts">
import { listCollegeRecruitmentPlan, getCollegeRecruitmentPlan, delCollegeRecruitmentPlan, addCollegeRecruitmentPlan, updateCollegeRecruitmentPlan, getSelectData } from '@/api/recruitment/collegeRecruitmentPlan';
import { CollegeRecruitmentPlanVO, CollegeRecruitmentPlanQuery, CollegeRecruitmentPlanForm } from '@/api/recruitment/collegeRecruitmentPlan/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const collegeRecruitmentPlanList = ref<CollegeRecruitmentPlanVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const selectData = reactive<{
  recruitmentYear: number[];
  recruitmentType: string[];
  subjectRestriction: string[];
  flagDoubleHeightPlan: string[];
  flagDemonstrateVocationalCollege: string[];
  institutionNature: string[];
  educationHierarchy: string[];
}>({
  recruitmentYear: [],
  recruitmentType: [],
  subjectRestriction: [],
  flagDoubleHeightPlan: [],
  flagDemonstrateVocationalCollege: [],
  institutionNature: [],
  educationHierarchy: ['专科', '本科']
});

const queryFormRef = ref<ElFormInstance>();
const collegeRecruitmentPlanFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: CollegeRecruitmentPlanForm = {
  id: undefined,
  targetProvince: undefined,
  recruitmentYear: undefined,
  collegeId: undefined,
  recruitmentType: undefined,
  majorName: undefined,
  majorCodeCollege: undefined,
  majorCodeNational: undefined,
  majorCategoryName: undefined,
  subjectRestriction: undefined,
  enrollmentNumbers: undefined,
  tuitionFee: undefined
}
const data = reactive<PageData<CollegeRecruitmentPlanForm, CollegeRecruitmentPlanQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    targetProvince: undefined,
    recruitmentYear: undefined,
    collegeId: undefined,
    recruitmentType: undefined,
    majorName: undefined,
    majorCodeCollege: undefined,
    majorCodeNational: undefined,
    majorCategoryName: undefined,
    subjectRestriction: undefined,
    enrollmentNumbers: undefined,
    tuitionFee: undefined,
    flagDoubleHeightPlan: undefined,
    flagDemonstrateVocationalCollege: undefined,
    institutionNature: undefined,
    educationHierarchy: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "主键不能为空", trigger: "blur" }
    ],
    targetProvince: [
      { required: true, message: "目标省份不能为空", trigger: "blur" }
    ],
    recruitmentYear: [
      { required: true, message: "招生年份不能为空", trigger: "blur" }
    ],
    collegeId: [
      { required: true, message: "学校ID不能为空", trigger: "blur" }
    ],
    recruitmentType: [
      { required: true, message: "类型不能为空", trigger: "change" }
    ],
    majorName: [
      { required: true, message: "专业名称不能为空", trigger: "blur" }
    ],
    majorCodeCollege: [
      { required: true, message: "专业代码 - 院校代码不能为空", trigger: "blur" }
    ],
    majorCodeNational: [
      { required: true, message: "专业代码 - 国家代码不能为空", trigger: "blur" }
    ],
    majorCategoryName: [
      { required: true, message: "专业大类不能为空", trigger: "blur" }
    ],
    enrollmentNumbers: [
      { required: true, message: "招生人数不能为空", trigger: "blur" }
    ],
    tuitionFee: [
      { required: true, message: "学费不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询院校招生计划列表 */
const getList = async () => {
  loading.value = true;
  const res = await listCollegeRecruitmentPlan(queryParams.value);
  collegeRecruitmentPlanList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  collegeRecruitmentPlanFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: CollegeRecruitmentPlanVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加院校招生计划";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: CollegeRecruitmentPlanVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getCollegeRecruitmentPlan(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改院校招生计划";
}

/** 提交按钮 */
const submitForm = () => {
  collegeRecruitmentPlanFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateCollegeRecruitmentPlan(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addCollegeRecruitmentPlan(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: CollegeRecruitmentPlanVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除院校招生计划编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delCollegeRecruitmentPlan(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('recruitment/collegeRecruitmentPlan/export', {
    ...queryParams.value
  }, `collegeRecruitmentPlan_${new Date().getTime()}.xlsx`)
}

/** 获取下拉框数据 */
const fetchSelectData = async () => {
  try {
    const res = await getSelectData();
    if (res.data) {
      // 确保招生年份是数字数组
      selectData.recruitmentYear = (res.data.recruitmentYear || []).map((item: any) => Number(item));
      selectData.recruitmentType = res.data.recruitmentType || [];
      selectData.subjectRestriction = res.data.subjectRestriction || [];
      selectData.flagDoubleHeightPlan = res.data.flagDoubleHeightPlan || [];
      selectData.flagDemonstrateVocationalCollege = res.data.flagDemonstrateVocationalCollege || [];
      selectData.institutionNature = res.data.institutionNature || [];
    }
  } catch (error) {
    console.error('获取下拉框数据失败:', error);
  }
}

onMounted(() => {
  getList();
  fetchSelectData();
});
</script>
