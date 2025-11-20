<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="院校名称" prop="collegeName">
              <el-input v-model="queryParams.collegeName" placeholder="请输入院校名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="院校代码" prop="collegeCode">
              <el-input v-model="queryParams.collegeCode" placeholder="请输入院校代码" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="学校隶属信息" label-width="auto" prop="affiliationInfo">
              <el-input v-model="queryParams.affiliationInfo" placeholder="请输入学校隶属信息" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="办学性质" prop="institutionNature">
              <el-select v-model="queryParams.institutionNature" placeholder="请选择办学性质" clearable>
                <el-option v-for="item in institutionNatureOptions" :key="item" :label="item" :value="item" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['ceg:collegeInfo:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['ceg:collegeInfo:edit']"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['ceg:collegeInfo:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-dropdown class="mt-[1px]">
              <el-button plain type="info">
                更多
                <el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item icon="Download" @click="importTemplate">下载模板</el-dropdown-item>
                  <el-dropdown-item v-if="checkPermi(['ceg:collegeInfo:import'])" icon="Top" @click="handleImport">导入数据</el-dropdown-item>
                  <el-dropdown-item v-if="checkPermi(['ceg:collegeInfo:export'])" icon="Download" @click="handleExport">导出数据</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="collegeInfoList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="院校名称" width="300" align="center" prop="collegeName" />
        <el-table-column label="院校代码" align="center" prop="collegeCode" />
        <el-table-column label="办学性质" align="center" prop="institutionNature" />
        <el-table-column label="学校隶属信息" align="center" prop="affiliationInfo" />
        <el-table-column label="学校类别" align="center" prop="collegeType" />
        <el-table-column label="学校地址信息" align="center" prop="addressInfo" />
        <el-table-column label="硕士点" align="center" prop="flagPostgraduate" />
        <el-table-column label="博士点" align="center" prop="flagPhd" />
        <el-table-column label="双高计划" align="center" prop="flagDoubleHeightPlan" />
        <el-table-column label="示范院校" align="center" prop="flagDemonstrateVocationalCollege" />
        <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['ceg:collegeInfo:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['ceg:collegeInfo:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 导入对话框 -->
    <el-dialog v-model="upload.open" :title="upload.title" width="400px" append-to-body>
      <el-upload
        ref="uploadRef"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :on-error="handleFileError"
        :auto-upload="false"
        drag
      >
        <el-icon class="el-icon--upload">
          <i-ep-upload-filled />
        </el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="text-center el-upload__tip">
            <!-- <div class="el-upload__tip"><el-checkbox v-model="upload.updateSupport" />是否更新已经存在的数据</div> -->
            <div style="margin-bottom: 10px;">
              <el-checkbox v-model="uploadWarningConfirmed">我已阅读并确认</el-checkbox>
            </div>
            <p style="color: #f56c6c;">请注意！院校代码不能重复，如果系统中已经存在相同的代码，则会更新原有数据，请谨慎操作。</p>
            <span>仅允许导入xls、xlsx格式文件。</span>
            <el-link type="primary" :underline="false" style="font-size: 12px; vertical-align: baseline" @click="importTemplate">下载模板</el-link>
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" :disabled="!uploadWarningConfirmed || upload.isUploading" @click="submitFileForm">确 定</el-button>
          <el-button @click="upload.open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 添加或修改院校信息对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="900px" append-to-body>
      <el-form ref="collegeInfoFormRef" :model="form" :rules="rules" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="院校名称" prop="collegeName">
              <el-input v-model="form.collegeName" placeholder="请输入院校名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="院校代码" prop="collegeCode">
              <el-input v-model="form.collegeCode" placeholder="请输入院校代码" :disabled="!!form.id" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="办学性质" prop="institutionNature">
              <el-input v-model="form.institutionNature" placeholder="请输入办学性质" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学校隶属信息" prop="affiliationInfo">
              <el-input v-model="form.affiliationInfo" placeholder="请输入学校隶属信息" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="学校类别" prop="collegeType">
              <el-input v-model="form.collegeType" placeholder="请输入学校类别" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学校地址信息" prop="addressInfo">
              <el-input v-model="form.addressInfo" placeholder="请输入学校地址信息" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="官网地址" prop="officialWebsiteUrl">
              <el-input v-model="form.officialWebsiteUrl" placeholder="请输入官网地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="百科地址" prop="baikeUrl">
              <el-input v-model="form.baikeUrl" placeholder="请输入百科地址" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="硕士点" prop="flagPostgraduate">
              <el-input v-model="form.flagPostgraduate" placeholder="请选择" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="博士点" prop="flagPhd">
              <el-input v-model="form.flagPhd" placeholder="请选择" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="双高计划" prop="flagDoubleHeightPlan">
              <el-input v-model="form.flagDoubleHeightPlan" placeholder="请输入双高计划类目" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="示范院校" prop="flagDemonstrateVocationalCollege">
              <el-input v-model="form.flagDemonstrateVocationalCollege" placeholder="请输入示范院校类目" />
            </el-form-item>
          </el-col>
        </el-row>
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

<script setup name="CollegeInfo" lang="ts">
import { listCollegeInfo, getCollegeInfo, delCollegeInfo, addCollegeInfo, updateCollegeInfo, queryInstitutionNatureList } from '@/api/ceg/collegeInfo';
import { globalHeaders } from '@/utils/request';
import { checkPermi } from '@/utils/permission';
import { CollegeInfoVO, CollegeInfoQuery, CollegeInfoForm } from '@/api/ceg/collegeInfo/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const collegeInfoList = ref<CollegeInfoVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const collegeInfoFormRef = ref<ElFormInstance>();
const uploadRef = ref<ElUploadInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const upload = reactive<ImportOption>({
  open: false,
  title: '',
  isUploading: false,
  updateSupport: 0,
  headers: globalHeaders(),
  url: import.meta.env.VITE_APP_BASE_API + '/ceg/collegeInfo/importData'
});

const uploadWarningConfirmed = ref(false);
const institutionNatureOptions = ref<string[]>([]);

const initFormData: CollegeInfoForm = {
  id: undefined,
  collegeName: undefined,
  collegeCode: undefined,
  institutionNature: undefined,
  affiliationInfo: undefined,
  collegeType: undefined,
  addressInfo: undefined,
  officialWebsiteUrl: undefined,
  baikeUrl: undefined,
  flagPostgraduate: undefined,
  flagPhd: undefined
};
const data = reactive<PageData<CollegeInfoForm, CollegeInfoQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    collegeName: undefined,
    collegeCode: undefined,
    collegeCodeNum: undefined,
    institutionNature: undefined,
    affiliationInfo: undefined,
    collegeType: undefined,
    addressInfo: undefined,
    flagPostgraduate: undefined,
    flagPhd: undefined,
    params: {}
  },
  rules: {
    id: [{ required: true, message: '主键不能为空', trigger: 'blur' }],
    collegeName: [{ required: true, message: '院校名称不能为空', trigger: 'blur' }],
    collegeCode: [{ required: true, message: '院校代码不能为空', trigger: 'blur' }],
    institutionNature: [{ required: true, message: '办学性质不能为空', trigger: 'change' }],
    affiliationInfo: [{ required: true, message: '学校隶属信息不能为空', trigger: 'blur' }],
    collegeType: [{ required: true, message: '学校类别不能为空', trigger: 'change' }],
    addressInfo: [{ required: true, message: '学校地址信息不能为空', trigger: 'change' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询院校信息列表 */
const getList = async () => {
  loading.value = true;
  const res = await listCollegeInfo(queryParams.value);
  collegeInfoList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  collegeInfoFormRef.value?.resetFields();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: CollegeInfoVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = '添加院校信息';
};

/** 修改按钮操作 */
const handleUpdate = async (row?: CollegeInfoVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getCollegeInfo(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = '修改院校信息';
};

/** 提交按钮 */
const submitForm = () => {
  collegeInfoFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateCollegeInfo(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addCollegeInfo(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: CollegeInfoVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除院校信息编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delCollegeInfo(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'ceg/collegeInfo/export',
    {
      ...queryParams.value
    },
    `collegeInfo_${new Date().getTime()}.xlsx`
  );
};

const importTemplate = () => {
  proxy?.download('ceg/collegeInfo/importTemplate', {}, `collegeInfo_template_${new Date().getTime()}.xlsx`);
};

const handleImport = () => {
  upload.title = '院校信息导入';
  upload.open = true;
  uploadWarningConfirmed.value = false;
};

const handleFileUploadProgress = () => {
  upload.isUploading = true;
};

const handleFileSuccess = (response: any, file: UploadFile) => {
  upload.open = false;
  upload.isUploading = false;
  uploadWarningConfirmed.value = false;
  uploadRef.value?.handleRemove(file);
  proxy?.$modal.closeLoading();
  ElMessageBox.alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + '</div>', '导入结果', {
    dangerouslyUseHTMLString: true
  });
  getList();
};

const handleFileError = (error: any, file: UploadFile) => {
  upload.isUploading = false;
  uploadWarningConfirmed.value = false;
  proxy?.$modal.closeLoading();
  ElMessage.error('文件上传失败，请重试');
  uploadRef.value?.handleRemove(file);
};

function submitFileForm() {
  if (!uploadWarningConfirmed.value) {
    ElMessage.warning('请先确认已阅读并理解提示信息');
    return;
  }
  proxy?.$modal.loading('正在导入数据，请稍候...');
  upload.isUploading = true;
  uploadRef.value?.submit();
}

/** 获取办学性质列表 */
const getInstitutionNatureList = async () => {
  try {
    const res = await queryInstitutionNatureList();
    institutionNatureOptions.value = res.data || [];
  } catch (error) {
    console.error('获取办学性质列表失败:', error);
  }
};

onMounted(() => {
  getList();
  getInstitutionNatureList();
});
</script>
