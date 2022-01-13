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
          <el-button class="btn-view" type="primary" icon="el-icon-upload"
            >文件一上传</el-button
          >
          <input
            type="file"
            class="file-one"
            @change="changeFileFirst"
            @click="clickFirstFile"
          />
          <div class="file-view" v-if="firstFileName">
            <span class="file-name">{{ firstFileName }}</span>
            <i class="el-icon-delete" @click="deleteFile('first')"></i>
          </div>
        </div>

        <div class="btn">
          <el-button class="btn-view" type="success" icon="el-icon-upload"
            >文件二上传</el-button
          >
          <input
            type="file"
            class="file-one"
            @change="changeFileSecond"
            @click="clickSecondFile"
          />
          <div class="file-view" v-if="secondFileName">
            <span class="file-name">{{ secondFileName }}</span>
            <i class="el-icon-delete" @click="deleteFile('second')"></i>
          </div>
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
export default {
  name: "App",
  data() {
    return {
      isComparing: false,
      compareResult: "",
      firstFileName: "",
      secondFileName: "",
      firstFileContent: "",
      secondFileContent: "",
      fullscreenLoading: false,
    };
  },
  methods: {
    clickFirstFile(e) {
      if (this.firstFileContent.length > 0) {
        this.preventDefaultEvent(e);
      }
    },
    clickSecondFile(e) {
      if (this.secondFileContent.length > 0) {
        this.preventDefaultEvent(e);
      }
    },
    preventDefaultEvent(e) {
      e.preventDefault();
      this.$message({
        message: "请先删除现有文件，再进行提交",
        type: "warning",
        center: true,
      });
    },
    changeFileFirst(event) {
      const file = event.target.files[0];
      if (file) {
        const flag = this.checkFileName(file.name);
        if (flag) {
          this.firstFileName = file.name;
          try {
            var reader = new FileReader();
            reader.readAsText(file, "UTF-8"); //这里可以改编码格式，获取文件信息
            reader.onload = (event) => {
              this.firstFileContent = event.target.result;
              console.log(this.firstFileContent);
              this.$message({
                message: "成功提交文件",
                type: "success",
                center: true,
              });
            };
          } catch (error) {
            this.$message({
              message: "浏览器版本过低，请升级版本或者更换浏览器～",
              type: "warning",
              center: true,
            });
          }
        } else {
          this.$message({
            message: "提交文件格式不正确，请重新提交",
            type: "error",
            center: true,
          });
        }
      }
    },
    changeFileSecond(event) {
      const file = event.target.files[0];
      if (file) {
        const flag = this.checkFileName(file.name);
        if (flag) {
          this.secondFileName = file.name;
          try {
            var reader = new FileReader();
            reader.readAsText(file, "UTF-8"); //这里可以改编码格式，获取文件信息
            reader.onload = (event) => {
              this.secondFileContent = event.target.result;
              console.log(this.secondFileContent);
              this.$message({
                message: "成功提交文件",
                type: "success",
                center: true,
              });
            };
          } catch (error) {
            this.$message({
              message: "浏览器版本过低，请升级版本或者更换浏览器～",
              type: "warning",
              center: true,
            });
          }
        } else {
          this.$message({
            message: "提交文件格式不正确，请重新提交",
            type: "error",
            center: true,
          });
        }
      }
    },
    checkFileName(name) {
      const extsArr = name.split(".");
      const exts = extsArr[extsArr.length - 1];
      return ["csv", "xls", "xlsx", "json"].includes(exts);
    },

    deleteFile(index) {
      if (index === "first") {
        this.firstFileContent = "";
        this.firstFileName = "";
      } else {
        this.secondFileName = "";
        this.secondFileContent = "";
      }
    },
    switchCompare(flag) {
      this.isComparing = flag;
    },
    startCompare() {
      this.switchCompare(true);
      this.fullscreenLoading = true;
      setTimeout(() => {
        //这里模拟调用的接口
        this.switchCompare(false);
        this.fullscreenLoading = false;
        this.compareResult = "对比结果";
      }, 1000);
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
