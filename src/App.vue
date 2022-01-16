<template>
  <div class="json-wrapper">
    <div class="operate-box">
      <div class="json-tips">
        <i class="el-icon-warning"></i>
        <span class="tips"
          >json文件仅支持无嵌套json数组，上传文件仅支持CSV、XSL、XSLX、JSON格式</span
        >
      </div>
      <div class="btns-box">
        <div class="btn">
          <el-upload
            action="/api/upload"
            :on-success="handleFileSuccess"
            :before-upload="beforeUpload"
            :limit="1"
            :on-exceed="handleExceed"
          >
            <el-button slot="trigger" size="small" type="primary"
              >上传文件一</el-button
            >
          </el-upload>
        </div>

        <div class="btn">
          <el-upload
            action="/api/upload"
            :on-success="handleFileSuccessSec"
            :limit="1"
            :before-upload="beforeUpload"
            :on-exceed="handleExceed"
          >
            <el-button slot="trigger" size="small" type="primary"
              >上传文件二</el-button
            >
          </el-upload>
        </div>
        <div class="btn btn-right">
          <el-button
            class="start-btn"
            type="danger"
            icon="el-icon-video-play"
            :loading="isComparing"
            @click="startCompare"
            element-loading-text="对比中，请稍等～"
            v-loading.fullscreen.lock="fullscreenLoading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            >开始对比</el-button
          >
        </div>
      </div>
    </div>
    <div class="compare-result">
      <h3 class="title">对比结果</h3>
      <el-empty
        :image-size="200"
        v-if="compareResult.length == 0"
        class="result-empty"
      ></el-empty>
      <div class="result-content" v-html="compareResult" v-else></div>
    </div>
  </div>
</template>

<script>
import * as API from "./api/index";
export default {
  name: "App",
  data() {
    return {
      isComparing: false, //表示开始对比按钮是否在loading中
      compareResult: "", //对比结果
      fullscreenLoading: false, //遮罩层是否显示
      firstFileName: "",
      secondFileName: "",
    };
  },
  methods: {
    handleExceed() {
      this.$message.warning("请删除已选文件后再选择文件");
    },
    beforeUpload(file) {
      const fileType = ["csv", "xls", "xlsx", "json"];
      const isTrue = fileType.some((type) => file.name.split(".")[1] === type);
      if (!isTrue) {
        this.$message.warning("上传文件仅支持 xlsx、xls、csv、json 格式！");
        return false;
      }
      return true;
    },
    handleFileSuccess(response, file) {
      this.firstFileName = file.name;
    },
    handleFileSuccessSec(response, file) {
      this.secondFileName = file.name;
    },
    switchCompare(flag) {
      this.isComparing = flag;
    },
    startCompare() {
      if (this.firstFileName == "" || this.secondFileName == "") {
        this.$message.warning("必须上传两个文件才可以进行比较～");
        return;
      }
      this.switchCompare(true);
      this.fullscreenLoading = true;
      API.compareFileData({
        fileNameList: [this.firstFileName, this.secondFileName],
      }).then((respone) => {
        //这里模拟调用的接口
        this.switchCompare(false); //将开始对比按钮loading改为可用
        this.fullscreenLoading = false;
        this.compareResult = respone;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.json-wrapper {
  background: #eee;
  min-height: 600px;
  padding: 20px;
  .operate-box {
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    .json-tips {
      .el-icon-warning {
        margin-right: 5px;
        color: yellowgreen;
        font-size: 14px;
      }
      .tips {
        font-size: 12px;
      }
    }
    .btns-box {
      margin-top: 20px;
      display: flex;
      .btn {
        display: flex;
        flex-direction: column;
        margin-right: 20px;
        position: relative;
        .file-one {
          position: absolute;
          top: 0px;
          left: 0px;
          width: 130px;
          height: 40px;
          opacity: 0;
          cursor: pointer;
        }
        .file-view {
          margin-top: 10px;
          &:hover .file-name {
            color: blue;
          }
          &:hover .el-icon-delete {
            color: blue;
          }
          .file-name {
            color: #333;
            margin-right: 10px;
          }
          .el-icon-delete {
            cursor: pointer;
          }
        }
        .btn-view {
          width: 130px;
        }
      }
      .btn-right {
        flex: 1;
        align-items: flex-end;
        .start-btn {
          width: 130px;
          margin-left: 50px;
        }
      }
    }
  }
  .compare-result {
    background: #fff;
    padding: 0px 20px 20px 20px;
    border-radius: 8px;
    margin-top: 20px;
    .title {
      color: #666;
      height: 60px;
      line-height: 60px;
      border-bottom: 1px solid #eee;
    }
    .result-content {
      white-space: pre-wrap;
      height: 600px;
      overflow: scroll;
      background: #333;
      color: #fff;
      padding: 10px;
    }
    .result-empty {
      height: 600px;
    }
  }
}
</style>
