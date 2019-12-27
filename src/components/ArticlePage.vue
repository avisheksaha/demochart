<template>
  <div class="row">
    <div class="col-md-8">
      <div class="mb-3">
        <span
          v-for="(tag,index) in articleDetail.tags"
          :key="index"
          class="border border-light px-2 pb-1 mr-2 bg-light text-secondary rounded-sm"
        >{{tag.tag_name}}</span>
        <!-- <span class="border border-light px-2 pb-1 mr-2 bg-light text-secondary rounded-sm">laravel</span> -->
      </div>
      <div>
        <h4>{{articleDetail.title}}</h4>

        <div class="d-flex justify-content-between">
          <div>
            <span class="text-muted font-weight-bold">
              <img src="../assets/follow.png" width="20" height="20" alt />Answer
            </span>
            <span class="mx-3">&bull;</span>
            <span class="text-muted font-weight-bold">
              <img src="../assets/follow.png" width="20" height="20" alt />
              Follow
            </span>
            <!-- <span class="mx-3">&bull;</span> -->
            <!-- <span class="mr-3 text-muted font-weight-bold">
              <img src="../assets/follow.png" width="20" height="20" alt />Request
            </span>-->
          </div>
          <div>
            <span class="mr-3 text-muted font-weight-bold">
              <img src="../assets/uparrow.png" width="20" height="20" />Upvote
            </span>
            <span class="mr-3 text-muted font-weight-bold">
              <img src="../assets/downarrow.png" width="20" height="20" />Downvote
            </span>
            <span class="mr-3 text-muted font-weight-bold">facebook</span>
            <span class="mr-3 text-muted font-weight-bold">Twitter</span>
          </div>
        </div>
        <div class="mt-3" style="text-align: center;">
          <!-- <img src="../assets/laravel.png" width="70%" style="height: 270px;" alt class="border" /> -->
          <img
            :src="`http://helloworld.test/storage/${articleDetail.article_image_path}`"
            alt
            width="70%"
            style="height: 270px;"
            class="border"
          />
        </div>
        <div class="pt-3" style="font-size: 15px;" v-html="articleDetail.content"></div>
      </div>
      <div class="mt-3">
        <h5 class="border-bottom">100+ Answers</h5>
        <div class="border-bottom pt-1" v-for="(answer,index) in answers" :key="index">
          <div class="py-2">
            <div class="media pb-2">
              <img src class="align-self-start mr-3" alt="..." />
              <div class="media-body d-flex justify-content-between">
                <div class="text-muted">Avishek Saha, Guwahati, India</div>
                <div class="text-muted">Answered Mar,12,2019</div>
              </div>
            </div>
            <div v-html="answer.answer_desc"></div>
            <div>
              <img
                :src="`http://helloworld.test/storage/${answer.answer_image_path}`"
                alt
                width="50%"
                style="height: 200px;"
                class="border"
              />
            </div>

            <div class="pb-2">
              <span class="text-muted font-weight-bold mr-3">Like: 53</span>
              <span
                class="text-muted font-weight-bold mr-3"
                v-on:click="toggleComment(answer.id)"
              >Comments: 101</span>
              <!-- <span class="float-right font-weight-bold text-muted">view Comments</span> -->
            </div>
          </div>

          <div class="ml-5 bg-light px-5 py-2 rounded-lg" v-if="toggler === answer.id">
            <div class="d-flex">
              <div class="media flex-fill mr-2">
                <img src class="align-self-start mr-3" alt="..." />
                <div class="media-body">
                  <textarea
                    class="form-control"
                    placeholder="Add your Comment"
                    v-model="comment_desc"
                    required
                  ></textarea>
                </div>
              </div>
              <div class>
                <button
                  type="button"
                  class="btn-sm btn-primary"
                  v-on:click="createComment(answer.id)"
                >Comment</button>
              </div>
            </div>
            <div>
              <ul class="list-unstyled" v-for="(gotComment,index) in gotComments" :key="index">
                <li class="media py-2">
                  <img src="../assets/logo.png" width="20" class="mr-3" alt />
                  <div class="media-body">{{gotComment.comment_desc}}</div>
                </li>
              </ul>
            </div>
          </div>
          <div class="my-3"></div>
        </div>
      </div>
      <div>
        <label for class="font-weight-bold">Reply</label>
        <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
        <div v-if="errors && errors.answer_desc" class="text-danger">{{ errors.answer_desc[0] }}</div>

        <div class="my-2">
          <file-input
            v-model="answer_image_path"
            class="pr-6 pb-8 w-full lg:w-1/2"
            type="file"
            accept="image/*"
            :errors="errors['answer_image_path']"
          ></file-input>
        </div>
        <button class="btn btn-primary" @click="createAnswer">Reply</button>
      </div>
    </div>
    <div class="col-md-4">
      <div style="position: fixed;">
        <h5 class="border-bottom">Related Questions</h5>
        <div>
          <p class="pt-2" style="font-size:16px;">Is there a Stack Overflow for design questions?</p>
          <p class="pt-2" style="font-size:16px;">Is there a Stack Overflow for design questions?</p>
          <p class="pt-2" style="font-size:16px;">Is there a Stack Overflow for design questions?</p>
          <p class="pt-2" style="font-size:16px;">Is there a Stack Overflow for design questions?</p>
          <p class="pt-2" style="font-size:16px;">Is there a Stack Overflow for design questions?</p>
          <p class="pt-2" style="font-size:16px;">Is there a Stack Overflow for design questions?</p>
          <p class="pt-2" style="font-size:16px;">Is there a Stack Overflow for design questions?</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import FileInput from "../components/tuis/FileInput";

export default {
  data() {
    return {
      toggler: null,
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
      answer_image_path: null,

      articleDetail: null,
      answers: "",
      comment_desc: "",
      gotComments: null,
      errors: {}
    };
  },

  components: {
    FileInput
  },

  mounted() {
    this.showArticleDetail();
    this.receiveAnswers();
  },

  methods: {
    toggleComment(answer_id) {
      this.toggler = answer_id;
      console.log(answer_id);
      this.receiveComments(answer_id);
    },

    showArticleDetail() {
      // console.log(this.$route.params.id);
      this.axios
        .get(`http://helloWorld.test/api/article/${this.$route.params.id}/show`)
        .then(res => {
          this.articleDetail = res.data.data;
        })
        .catch();
    },

    createAnswer() {
      let formData = new FormData();
      formData.append("answer_desc", this.editorData);
      formData.append("answer_image_path", this.answer_image_path);
      this.axios
        .post(
          `http://helloWorld.test/api/answer/${this.articleDetail.id}/create`,
          formData
        )
        .then(() => {
          this.editorData = "";
          this.answer_image_path = "";
          this.receiveAnswers();
        })
        .catch(error => {
          this.errors = error.response.data.errors;
        });
    },

    receiveAnswers() {
      this.axios
        .get(
          `http://helloWorld.test/api/article/${this.$route.params.id}/answers/show`
        )
        .then(res => {
          this.answers = res.data.data;
        })
        .catch();
    },

    createComment(answer_id) {
      this.axios
        .post(`http://helloWorld.test/api/answer/${answer_id}/comment/create`, {
          comment_desc: this.comment_desc
        })
        .then(() => {
          this.comment_desc = "";
          this.receiveComments(answer_id);
        })
        .catch(error => {
          this.errors = error.response.data.errors;
        });
    },

    receiveComments(answer_id) {
      this.axios
        .get(`http://helloWorld.test/api/answer/${answer_id}/comments`)
        .then(response => {
          this.gotComments = response.data.data;
        })
        .catch(error => {
          this.errors = error.response.data.errors;
        });
    }
  }
};
</script>

<style lang="scss" scoped></style>
