<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="教育层级" prop="educationHierarchy">
              <el-select v-model="queryParams.educationHierarchy" placeholder="请选择教育层级" clearable style="width: 200px">
                <el-option label="专科" value="专科" />
                <el-option label="本科" value="本科" />
              </el-select>
            </el-form-item>
            <el-form-item label="国家-专业编码" prop="code" label-width="auto">
              <el-input v-model="queryParams.code" placeholder="请输入编码- 国家定义专业编码" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="国家-专业名称" prop="name" label-width="auto">
              <el-input v-model="queryParams.name" placeholder="请输入专业名称" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['professional:professionalClassification:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['professional:professionalClassification:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['professional:professionalClassification:remove']">删除</el-button>
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
                  <el-dropdown-item v-if="checkPermi(['professional:professionalClassification:import'])" icon="Top" @click="handleImport">导入数据</el-dropdown-item>
                  <el-dropdown-item v-if="checkPermi(['professional:professionalClassification:export'])" icon="Download" @click="handleExport">导出数据</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table 
        v-loading="loading" 
        border 
        :data="professionalClassificationList" 
        @selection-change="handleSelectionChange"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="国家-专业编码" align="center" prop="code" />
        <el-table-column label="国家-专业名称" align="center" prop="name" />
        <el-table-column label="教育层级" align="center" prop="educationHierarchy" />
        <el-table-column label="操作" align="center" fixed="right"  class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['professional:professionalClassification:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['professional:professionalClassification:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改专业分类对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="professionalClassificationFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="教育层级" prop="educationHierarchy" label-width="auto">
          <el-input v-model="form.educationHierarchy" placeholder="请输入教育层级" />
        </el-form-item>
        <el-form-item label="专业编码" prop="code" label-width="auto" >
          <el-input v-model="form.code" placeholder="请输入编码(国家定义)" :disabled="!!form.id" />
        </el-form-item>
        <el-form-item label="专业名称" prop="name" label-width="auto">
          <el-input v-model="form.name" placeholder="请输入专业名称(国家定义)" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 导入对话框 -->
    <el-dialog v-model="upload.open" :title="upload.title" width="600px" append-to-body>
      <el-form ref="uploadFormRef" :model="uploadForm" :rules="uploadRules" label-width="100px">
        <el-form-item label="教育层级" prop="collegeLevel">
          <el-select v-model="uploadForm.collegeLevel" placeholder="请选择教育层级" style="width: 100%">
            <el-option label="专科" value="专科" />
            <el-option label="本科" value="本科" />
          </el-select>
        </el-form-item>
        <el-form-item label="导入文件">
          <el-upload
            ref="uploadRef"
            :limit="1"
            accept=".xlsx, .xls"
            :disabled="upload.isUploading"
            :on-change="handleFileChange"
            :auto-upload="false"
            drag
          >
            <el-icon class="el-icon--upload">
              <i-ep-upload-filled />
            </el-icon>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <template #tip>
              <div class="text-center el-upload__tip">
                <span>仅允许导入xls、xlsx格式文件。</span>
                <el-link type="primary" :underline="false" style="font-size: 12px; vertical-align: baseline" @click="importTemplate">下载模板</el-link>
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <div style="">
            <p style="color: #f56c6c;">请注意！此项操作会清空原有数据！！！请谨慎操作！！</p>
            <el-checkbox v-model="uploadWarningConfirmed">我已阅读并确认</el-checkbox>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" :disabled="!uploadWarningConfirmed || upload.isUploading" @click="submitFileForm">确 定</el-button>
          <el-button @click="cancelUpload">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="ProfessionalClassification" lang="ts">
import { listProfessionalClassification, getProfessionalClassification, delProfessionalClassification, addProfessionalClassification, updateProfessionalClassification, treeProfessionalClassification } from '@/api/professional/professionalClassification';
import { globalHeaders } from '@/utils/request';
import request from '@/utils/request';
import { checkPermi } from '@/utils/permission';
import { ProfessionalClassificationVO, ProfessionalClassificationQuery, ProfessionalClassificationForm } from '@/api/professional/professionalClassification/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const professionalClassificationList = ref<ProfessionalClassificationVO[]>([]);
const allTreeData = ref<ProfessionalClassificationVO[]>([]); // 存储所有树形数据
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const professionalClassificationFormRef = ref<ElFormInstance>();
const uploadRef = ref<ElUploadInstance>();
const uploadFormRef = ref<ElFormInstance>();

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
  url: import.meta.env.VITE_APP_BASE_API + '/professional/professionalClassification/importData'
});

const uploadWarningConfirmed = ref(false);
const uploadForm = reactive({
  collegeLevel: undefined as string | undefined,
  file: undefined as UploadFile | undefined
});

const uploadRules = {
  collegeLevel: [
    { required: true, message: '请选择教育层级', trigger: 'change' }
  ]
};

const initFormData: ProfessionalClassificationForm = {
  id: undefined,
  educationHierarchy: undefined,
  code: undefined,
  name: undefined,
  hierarchy: undefined
}
const data = reactive<PageData<ProfessionalClassificationForm, ProfessionalClassificationQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    educationHierarchy: undefined,
    code: undefined,
    name: undefined,
    hierarchy: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "主键不能为空", trigger: "blur" }
    ],
    educationHierarchy: [
      { required: true, message: "教育层级不能为空", trigger: "blur" }
    ],
    code: [
      { required: true, message: "编码(国家定义)不能为空", trigger: "blur" }
    ],
    name: [
      { required: true, message: "专业名称(国家定义)不能为空", trigger: "blur" }
    ],
    hierarchy: [
      { required: true, message: "层级不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 过滤树形数据 */
const filterTree = (tree: ProfessionalClassificationVO[], params: ProfessionalClassificationQuery): ProfessionalClassificationVO[] => {
  const { educationHierarchy, code, name } = params;
  
  // 如果没有搜索条件，直接返回原树
  if (!educationHierarchy && !code && !name) {
    return JSON.parse(JSON.stringify(tree)); // 深拷贝避免修改原数据
  }
  
  const filter = (nodes: ProfessionalClassificationVO[]): ProfessionalClassificationVO[] => {
    return nodes.filter(node => {
      let match = true;
      
      if (educationHierarchy && node.educationHierarchy !== educationHierarchy) {
        match = false;
      }
      if (code && !node.code?.includes(code)) {
        match = false;
      }
      if (name && !node.name?.includes(name)) {
        match = false;
      }
      
      // 递归过滤子节点
      if (node.children && node.children.length > 0) {
        node.children = filter(node.children);
        // 如果有子节点匹配，父节点也要保留
        if (node.children.length > 0) {
          match = true;
        }
      }
      
      return match;
    }).map(node => ({ ...node })); // 深拷贝避免修改原数据
  };
  
  return filter(JSON.parse(JSON.stringify(tree)));
};

/** 对根节点进行分页 */
const paginateRootNodes = (rootNodes: ProfessionalClassificationVO[], pageNum: number, pageSize: number): ProfessionalClassificationVO[] => {
  const start = (pageNum - 1) * pageSize;
  const end = start + pageSize;
  return rootNodes.slice(start, end);
};

/** 查询专业分类列表 */
const getList = async () => {
  loading.value = true;
  try {
    // 获取树形结构数据
    const res = await treeProfessionalClassification(queryParams.value);
    allTreeData.value = res.data || [];
    
    // 过滤数据
    const filteredTree = filterTree(allTreeData.value, queryParams.value);
    
    // 总数是根节点的数量
    total.value = filteredTree.length;
    
    // 对根节点进行分页（每个根节点及其所有子节点作为一个整体）
    const pageNum = queryParams.value.pageNum || 1;
    const pageSize = queryParams.value.pageSize || 10;
    professionalClassificationList.value = paginateRootNodes(filteredTree, pageNum, pageSize);
    
  } finally {
    loading.value = false;
  }
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  professionalClassificationFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: ProfessionalClassificationVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加专业分类";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: ProfessionalClassificationVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getProfessionalClassification(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改专业分类";
}

/** 提交按钮 */
const submitForm = () => {
  professionalClassificationFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateProfessionalClassification(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addProfessionalClassification(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: ProfessionalClassificationVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除专业分类编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delProfessionalClassification(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('professional/professionalClassification/export', {
    ...queryParams.value
  }, `professionalClassification_${new Date().getTime()}.xlsx`)
}

/** 下载模板 */
const importTemplate = () => {
  proxy?.download('professional/professionalClassification/importTemplate', {}, `professionalClassification_template_${new Date().getTime()}.xlsx`);
};

/** 导入按钮操作 */
const handleImport = () => {
  upload.title = '专业分类导入';
  upload.open = true;
  uploadWarningConfirmed.value = false;
  uploadForm.collegeLevel = undefined;
  uploadForm.file = undefined;
  uploadFormRef.value?.resetFields();
  uploadRef.value?.clearFiles();
};

/** 取消导入 */
const cancelUpload = () => {
  upload.open = false;
  uploadWarningConfirmed.value = false;
  uploadForm.collegeLevel = undefined;
  uploadForm.file = undefined;
  uploadFormRef.value?.resetFields();
  uploadRef.value?.clearFiles();
};

/** 文件选择变化处理 */
const handleFileChange = (file: UploadFile) => {
  uploadForm.file = file;
};

/** 提交上传文件 */
function submitFileForm() {
  uploadFormRef.value?.validate(async (valid: boolean) => {
    if (!valid) {
      return;
    }
    if (!uploadWarningConfirmed.value) {
      ElMessage.warning('请先确认已阅读并理解提示信息');
      return;
    }
    if (!uploadForm.file) {
      ElMessage.warning('请选择导入文件');
      return;
    }
    if (!uploadForm.collegeLevel) {
      ElMessage.warning('请选择教育层级');
      return;
    }

    proxy?.$modal.loading('正在导入数据，请稍候...');
    upload.isUploading = true;

    try {
      const formData = new FormData();
      formData.append('file', uploadForm.file.raw as File);
      formData.append('collegeLevel', uploadForm.collegeLevel);

      const result = await request({
        url: '/professional/professionalClassification/importData',
        method: 'post',
        data: formData,
        headers: {
          ...upload.headers
        }
      });

      upload.open = false;
      upload.isUploading = false;
      uploadWarningConfirmed.value = false;
      uploadForm.collegeLevel = undefined;
      uploadForm.file = undefined;
      uploadFormRef.value?.resetFields();
      uploadRef.value?.clearFiles();
      proxy?.$modal.closeLoading();
      ElMessageBox.alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + result.msg + '</div>', '导入结果', {
        dangerouslyUseHTMLString: true
      });
      await getList();
    } catch (error: any) {
      upload.isUploading = false;
      uploadWarningConfirmed.value = false;
      proxy?.$modal.closeLoading();
      ElMessage.error(error.message || error.msg || '文件上传失败，请重试');
      uploadRef.value?.clearFiles();
      uploadForm.file = undefined;
    }
  });
}

onMounted(() => {
  getList();
});
</script>
