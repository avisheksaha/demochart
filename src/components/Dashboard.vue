<template>
  <div class="dashboard">
    <div class="row">
      <div class="col-md-2">
        <p class="text-muted" style="font-size: 16px;">Feed</p>
        <h5 class="mb-4 border-bottom">Categories</h5>
        <div style="position: fixed">
          <p class="text-muted" style="font-size: 16px;">Web Development</p>
          <p class="text-muted" style="font-size: 16px;">Design</p>
          <p class="text-muted" style="font-size: 16px;">Invention and Inventions</p>
          <p class="text-muted" style="font-size: 16px;">Mobile Phones</p>
          <p class="text-muted" style="font-size: 16px;">Technologies</p>
          <p class="text-muted" style="font-size: 16px;">Science</p>
          <p class="text-muted" style="font-size: 16px;">Web Development</p>
          <p class="text-muted" style="font-size: 16px;">Invention and Inventions</p>
          <p class="text-muted" style="font-size: 16px;">Feed</p>
        </div>
      </div>
      <div class="col-md-7 pl-5">
        <button class="btn btn-danger mb-1" @click="toggle_question = !toggle_question">Ask Question</button>
        <div v-if="toggle_question">
          <div class="my-2">
            <div class="form-group" style="margin-bottom: 2px!important;">
              <input
                type="text"
                class="form-control"
                v-model="title"
                placeholder="Title Of Question"
              />
              <div v-if="errors && errors.title" class="text-danger">{{ errors.title[0] }}</div>
            </div>
            <div class="mb-1">
              <ckeditor
                :editor="editor"
                v-model="editorData"
                :config="editorConfig"
                class="rounded-lg"
              ></ckeditor>
              <div v-if="errors && errors.content" class="text-danger">{{ errors.content[0] }}</div>
            </div>
            <div>
              <input-tag placeholder="Add Tag" v-model="tags" :limit="3" class="rounded-lg"></input-tag>
              <div v-if="errors && errors.tags" class="text-danger">{{ errors.tags[0] }}</div>
            </div>
            <div>
              <file-input
                v-model="article_image_path"
                class="pr-6 pb-8 w-full lg:w-1/2"
                type="file"
                accept="image/*"
                label="Company Logo"
                :errors="errors['article_image_path']"
              ></file-input>
            </div>
            <button class="btn btn-primary my-1" @click="createArticle">Create</button>
          </div>
        </div>
        <div v-for="(gotarticle,index) in gotarticles" :key="index" class="mb-2">
          <div class="card card-body shadow-sm">
            <div class="row">
              <div class="col-md-2 px-2">
                <div class="text-center align-middle border border-info rounded-lg my-2">
                  <span style="font-size:20px;">10</span>
                  <p style="font-size:12px;">Votes</p>
                </div>
                <div
                  class="text-center align-middle text-white border border-info rounded-lg bg-info my-2"
                >
                  <span style="font-size:20px;">11</span>
                  <p style="font-size:12px;">Answers</p>
                </div>
              </div>
              <div class="col-md-10">
                <!-- {{gotarticle.article_tags}} -->
                <router-link :to="{name: 'article-page', params: {id: gotarticle.id}}">
                  <h5 class="text-dark">{{gotarticle.title}}</h5>
                </router-link>
                <ul class="list-unstyled">
                  <li class="media">
                    <img src="../assets/logo.png" width="20" class="mr-3" alt />
                    <div class="media-body">
                      <small>
                        Avantika Malhotra, lives in Bhopal, MaadhyaPradesh,
                        India
                      </small>
                    </div>
                  </li>
                </ul>
                <div style="font-size: 15px;" v-html=" gotarticle.content "></div>
                <span
                  v-for="(tag,index) in gotarticle.article_tags"
                  :key="index"
                  class="border border-info px-2 pb-1 mr-2 bg-light text-primary rounded-sm"
                >
                  <small>{{tag}}</small>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3"></div>
    </div>
  </div>
</template>

<script>
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import InputTag from "vue-input-tag";
import FileInput from "../components/tuis/FileInput";

// import axios from "axios";

export default {
  data() {
    return {
      toggle_question: false,

      editor: ClassicEditor,
      editorData: "",
      editorConfig: {
        toolbar: [
          "bold",
          "italic",
          "link",
          "bulletedList",
          "numberedList",
          "undo",
          "redo"
        ]
        // The configuration of the editor.
      },

      title: "",
      tags: [],
      article_image_path: null,

      gotarticles: null,
      errors: {}
    };
  },
  components: {
    InputTag,
    FileInput
  },
  mounted() {
    this.receiveArticles();
  },
  methods: {
    receiveArticles() {
      this.axios
        .get("http://helloworld.test/api/articles/index")
        .then(response => {
          this.gotarticles = response.data.data;
        })
        .catch(error => {
          this.errors = error.response.data.errors;
        })
        .finally();
    },
    createArticle() {
      let formData = new FormData();
      this.getFormData(formData, {
        title: this.title || "",
        content: this.editorData || "",
        tags: this.tags || "",
        article_image_path: this.article_image_path || ""
      });

      this.axios
        .post("http://helloworld.test/api/article/create", formData)
        .then(() => {
          this.title = "";
          this.editorData = "";
          this.tags = [];
          this.article_image_path = null;

          this.receiveArticles();
        })
        .catch(error => {
          this.errors = error.response.data.errors;
        })
        .finally();
    },

    getFormData(formData, data, previousKey) {
      if (data instanceof Object) {
        Object.keys(data).forEach(key => {
          const value = data[key];
          if (value instanceof Blob) {
            formData.append(key, value);
          }
          if (value instanceof Object && !Array.isArray(value)) {
            return this.getFormData(formData, value, key);
          }
          if (previousKey) {
            key = `${previousKey}[${key}]`;
          }
          if (Array.isArray(value)) {
            value.forEach(val => {
              formData.append(`${key}[]`, JSON.stringify(val));
            });
          } else {
            formData.append(key, value || "");
          }
        });
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
