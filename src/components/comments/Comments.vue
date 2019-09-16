<template>
  <div class="loader" v-if="loading">
    <div class="loader loader--style8" title="7">
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
         width="24px" height="30px" viewBox="0 0 24 30" style="enable-background:new 0 0 50 50;" xml:space="preserve">
        <rect x="0" y="10" width="4" height="10" fill="#333" opacity="0.2">
          <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0s" dur="0.6s" repeatCount="indefinite" />
          <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0s" dur="0.6s" repeatCount="indefinite" />
          <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0s" dur="0.6s" repeatCount="indefinite" />
        </rect>
        <rect x="8" y="10" width="4" height="10" fill="#333"  opacity="0.2">
          <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
          <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
          <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
        </rect>
        <rect x="16" y="10" width="4" height="10" fill="#333"  opacity="0.2">
          <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
          <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
          <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
        </rect>
      </svg>
    </div>
  </div>
  <div class="comments" :style="{background:background}" ref="wrapper" v-else @click="$emit('close-picker')"> <!-- this event for demo-->
    <div class="innerWrapper">
      <div class="addComment" key="addComment">
        <div class="avatar" :style="styleShadow">
          <img class="active-avatar" :src="selectedImage" alt="">
        </div>
        <div class="commentBox" key="commentBox" v-show="!showSignPanel && !auth || auth ">
            <div class="userName" :style="{color: userNameColor}">
              {{userName}}
              <div class="logOut" @click="clearAuth()" v-if="auth">Log out</div>
            </div>
            <textarea
              name="addComment"
              class="addComment"
              ref="addComment"
              placeholder="Add new comment"
              @keyup="resize"
              v-model="newComment"
              :style="{background:commentBackgroundColor, color: commentTextColor}"
              spellcheck="false"
              aria-label="Add comment"
            ></textarea>
            <button aria-label="Send" v-if="requestLoading"><div class="requestLoading"></div></button>
            <button @click="addComment" aria-label="Send" v-else>Send</button>
            <transition name="fade">
              <div class="alert" v-if="alert" :class="alertClass" :key="alertClass" style="align-self:start; margin-top: -5px;">
                <div>{{alertMessage}}</div>
              </div>
            </transition>
        </div>
        <sign-wrapper
          v-if="showSignPanel && !auth"
          :baseURL="baseURL"
          :apiKey= "apiKey"
          :maxUserNameLength="maxUserNameLength"
          v-on:sign-user="signUser"
        ></sign-wrapper>
      </div>
      <transition-group
        appear
        name="fade"
        mode="out-in"
        tag="div">
        <app-wrapper
          v-for="(item, index) in comments"
          v-if="index < limit"
          :baseURL="baseURL"
          :apiKey= "apiKey"
          :key="item.id"
          :id="item.id"
          :timestamp="item.timestamp"
          :lineCount="item.lineCount"
          :maxUserNameLength="maxUserNameLength"
          :maxCommentLength="maxCommentLength"
          :maxShowingDepth ="maxShowingDepth"
          :maxLineLimit="maxLineLimit"
          :nodeUserId="item.user_id"
          :nodeName="nodeName"
          :name="item.name"
          :comment="item.comment"
          :replies="item.reply"
          :depth="item.depth"
          :depthLength="1"
          v-on:delete-row="deleteFromParent(index)"
          v-on:sign-user="signUser"
          :initialMessageLimit="initialMessageLimit"
          :auth="auth"
          :userId="userId"
          :idToken="idToken"
          :isAdmin="isAdmin"
          :userName="userName"
          :commentBackgroundColor="commentBackgroundColor"
          :commentTextColor="commentTextColor"
          :userNameColor="userNameColor"
          :wrapperSize="wrapperSize.toString()"
          :custom="custom"
        ></app-wrapper>
        <div class="noCommentWrapper" @click="$refs.addComment.focus()" v-if="comments.length<1" key="noComment">
          <span class="noCommentText">Be the first to comment.</span>
        </div>
      </transition-group>
      <div class="updateLimit" @click="updateLimit" v-if="limit < comments.length">
        <span class="limit">Show more comment</span>
      </div>
    </div>
  </div>
</template>

<script>
  'use strict';
  import Wrapper from './Comment.vue'
  import Sign from './Sign.vue'
  import axios from 'axios'

  export default {
    name: 'Comments',
    props: {
      baseURL: {
        type: String,
        required: true
      },
      apiKey: {
        type: String,
        required: true
      },
      nodeName: {
        type: String,
        required: true
      },
      maxUserNameLength: {
        type: String,
        default: '30'
      },
      maxCommentLength: {
        type: String,
        default: '1000'
      },
      initialMessageLimit: {
        type: String,
        default: '10'
      },
      maxLineLimit: {
        type: String,
        default: '40'
      },
      maxShowingDepth: {
        type: String,
        default: '5'
      },
      background: {
        type: String,
        default: 'transparent'
      },
      commentBackgroundColor: {
        teype: String,
        default: 'white'
      },
      commentTextColor: {
        teype: String,
        default: '#1d2129'
      },
      userNameColor: {
        teype: String,
        default: 'rgb(6, 177, 183)'
      },
      custom: { // this is for demo
        teype: String,
        default: 'false'
      }
    },
    data() {
      return {
        loading: true,
        showSignPanel: false,
        comments: [],
        newComment: '',
        styleShadow: {
          boxShadow: '2px -2px rgba(' + Math.round(Math.random() * 244) + ',' + Math.round(Math.random() * 244) + ',' + Math.round(Math.random() * 244) + ',0.6)'
        },
        limit: parseInt(this.initialMessageLimit),
        alertMessage: '',
        alertClass: '',
        alert: false,
        idToken: null,
        userId: null,
        isAdmin: null,
        userName: '',
        expiresIn: null,
        auth: false,
        wrapperSize: '',
        requestLoading: false,
        logOutTimer: null,
        images: [
          'https://i.pravatar.cc/150?img=68',
          'https://i.pravatar.cc/150?img=56',
          'https://i.pravatar.cc/150?img=41',
          'https://i.pravatar.cc/150?img=38',
          'https://i.pravatar.cc/150?img=32',
          'https://i.pravatar.cc/150?img=12',
          'https://i.pravatar.cc/150?img=10',
        ]
      }
    },
    methods: {
      randomItem (items) {
        return items[Math.floor(Math.random()*items.length)]
      },
      checkAutoLogin() {
        const token = localStorage.getItem('commentToken')
        if (!token) {
          return
        }
        const expirationDate = localStorage.getItem('commentExpirationDate')
        const now = new Date()
        const remainingTime = Math.floor((new Date(expirationDate).getTime() - now.getTime()) / 1000);
        if (now >= expirationDate) {
          return
        }
        const userId = localStorage.getItem('commentUserId')
        const userName = localStorage.getItem('commentUserName')
        if(localStorage.getItem('commentAdmin') != 'undefined'){
          const data = [token, userId, userName, remainingTime, true]
          this.signUser(data);
        } else {
          const data = [token, userId, userName, remainingTime]
          this.signUser(data);
        }
      },
      signUser(data) {
        this.idToken = data[0]
        this.userId = data[1]
        this.userName = data[2]
        this.expiresIn = data[3]
        this.logOutTimer = setTimeout(() => {
          this.clearAuth()
        }, this.expiresIn * 1000);
        this.isAdmin = data[4]
        this.auth = true
        this.showSignPanel = false
      },
      clearAuth() {
        clearTimeout(this.logOutTimer);
        this.idToken = ''
        this.userId = ''
        this.userName = ''
        this.isAdmin = null
        this.auth = false
        localStorage.removeItem("commentToken")
        localStorage.removeItem("commentUserId")
        localStorage.removeItem("commentExpirationDate")
        localStorage.removeItem("commentUserName")
        localStorage.removeItem("commentAdmin")
      },
      updateLimit() {
        this.limit += parseInt(this.initialMessageLimit)
      },
      resize(event) {
        if (this.newComment == '') {
          this.$refs.addComment.style.height = 'auto'
          this.$refs.addComment.style.height = 32 + 'px'
        } else {
          event.target.style.height = 'auto'
          event.target.style.height = event.target.scrollHeight + "px"
        }
      },
      addComment() {
        if (this.custom != 'false') {
          this.setAlert('This for customization, if you want to comment please look at the Fullscreen demo.\n', 'fail')
          return
        }
        if (this.auth) {
          if (this.filterNewComment.length!=0) {
            this.requestLoading = true;
            let commentObj = { name: this.filterUserName, comment: this.filterNewComment, user_id: this.userId, timestamp: Date.now().toString(), lineCount: this.filterNewCommentLineCount }
            axios.post(this.baseURL + '/commentsGrid/' + this.nodeName + '/comments.json' + '?auth=' + this.idToken, commentObj)
              .then(res => {
                commentObj.id = res.data.name
                const repliedObj = { user_id: this.userId }
                axios.put(this.baseURL + '/commentsGrid/' + this.nodeName + '/replys/' + commentObj.id + '.json' + '?auth=' + this.idToken, repliedObj)
                  .then(res => {
                    commentObj.depth = 'commentsGrid/' + this.nodeName + '/comments/' + commentObj.id
                    this.comments.splice(0, 0, commentObj)
                    this.clearAlert()
                    this.newComment = ''
                    this.resize()
                  })
                  .catch(err => this.setAlert('Unauthorized!\n', 'fail'))
              })
              .catch(err => this.setAlert('İnvalid comment!\n', 'fail'))
          } else {
            this.setAlert('You can\'t send empty comment!\n', 'fail')
          }
        } else {
          this.showSignPanel = true
        }
      },
      deleteFromParent(index) {
        this.comments.splice(index, 1)
      },
      setAlert(message, style, type) {
        type == 'append' ? this.alertMessage += message : this.alertMessage = message
        this.alertClass = style
        this.alert = true
        this.requestLoading = false;
        setTimeout(() => {
          this.clearAlert();
        }, 5000);
      },
      clearAlert() {
        this.requestLoading = false;
        this.alertMessage = ''
        this.alertClass = ''
        this.alert = false
      }
    },
    computed: {
      remainigLetter() {
        return +(this.maxCommentLength) - this.newComment.length
      },
      filterUserName() {
        return this.userName.replace(/^ +/g, '').replace(/ +/g, ' ').replace(/ +$/g, '')
      },
      filterNewComment() {
        return this.newComment.replace(/^\n+/g, '').replace(/(\n{2,})+/g, '\n\n').replace(/\n+$/g, '').replace(/( {30,})+/g, ' ').replace(/ +$/g, '')
      },
      filterNewCommentLineCount() {
        return this.filterNewComment.split('\n').length
      }
    },
    watch: {
      loading() {
        this.$nextTick(() => {
          if (this.$refs.wrapper != 'undefined') {
            this.wrapperSize = this.$refs.wrapper.offsetWidth
          }
        })
      },
      initialMessageLimit() { // this is for demo
        this.limit = parseInt(this.initialMessageLimit)
      }
    },
    components: {
      appWrapper: Wrapper,
      signWrapper: Sign
    },
    created() {
      this.selectedImage = this.randomItem(this.images)
      this.checkAutoLogin();
      axios.get(this.baseURL + '/commentsGrid/' + this.nodeName + '/comments.json')
        .then(res => {
          const data = res.data;
          for (let key in data) {
            let comment = data[key]
            comment.id = key
            comment.depth = 'commentsGrid/' + this.nodeName + '/comments/' + comment.id
            this.comments.unshift(comment)
          }
          this.loading = false;
          this.$emit('loading-finished'); // this is for demo
        })
        .catch(err => console.log(err))
    }
  }
</script>

<style scoped>
  @import url("https://fonts.googleapis.com/css?family=Roboto:400,700");

  .loader {
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-rows: minmax(150px, auto);
    padding: 5px;
  }
  #loader {
    justify-self: center;
    align-self: center;
  }
  .loader{
    margin-top: 9%;
    height: 100px;
    width: 100%;
    text-align: center;
    padding: 1em;
    display: inline-block;
    vertical-align: top;
  }

  svg path,
  svg rect{
    fill: #041050;
  }

  .comments>>>.alert {
    grid-column: 1/3;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 5px;
    border-top-left-radius: 40px;
    border-bottom-right-radius: 40px;
    border-width: 3px 0 3px;
    border-style: solid;
    color: #fff;
    font-size: 13px;
    padding-top: 15px;
    padding-bottom: 15px;
    padding-left: 15px;
    white-space: pre-line;
    text-align: center;
  }
  .comments>>>.alert.alert {
    border-color: rgba(0, 0, 0, 0.12) !important;
  }
  .comments>>>.success {
    background-color: #4caf50 !important;
  }
  .comments>>>.pass {
    border-color: #4caf50 !important;
  }
  .comments>>>.info {
    background-color: #041050 !important;
  }
  .comments>>>.default {
    border-color: #041050 !important;
  }
  .comments>>>.alert.fail {
    background-color: #ff5252 !important;
  }
  .comments>>>.fail {
    border-color: #ff5252 !important;
  }
  .comments>>>::-webkit-input-placeholder {
    color: #92b1b3 !important;
    text-align: center;
  }
  .comments>>>::-moz-placeholder {
    color: #92b1b3 !important;
    text-align: center;
  }
  .comments>>>:-ms-input-placeholder {
    color: #92b1b3 !important;
    text-align: center;
  }
  .comments>>>:-moz-placeholder {
    color: #92b1b3 !important;
    text-align: center;
  }
  .comments {
    font-family: "Roboto", sans-serif;
    overflow: hidden;
    border-radius: 4px;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .comments>>>.comments {
    overflow-x: auto;
  }
  .comments > .innerWrapper {
    overflow-x: auto;
    padding: 10px 2px;
  }
  .comments>>>.noCommentWrapper {
    display: grid;
    padding-top: 15px;
  }
  .comments>>>.noCommentText {
    color: rgba(42, 94, 190, 1);
    cursor: pointer;
    text-align: center;
    border: 1px solid rgba(42, 94, 190, 1);
    padding: 8px 10px;
    font-weight: 700;
    border-radius: 18px;
    border-top-right-radius: 0;
    border-bottom-left-radius: 0px;
    transition: linear 0.1s all;
    -moz-transition: linear 0.1s all;
    -webkit-transition: linear 0.1s all;
  }
  .comments>>>.noCommentText:hover {
    color: #fff;
    background-color: rgba(42, 94, 190, 1);
  }
  .comments>>>.userName {
    grid-column: 1/3;
    display: grid;
    grid-template-columns: 1fr 0.001fr;
    font-size: 14px;
    line-height: 14px;
    margin-top: 2px;
    font-weight: 700;
    color: #041050 !important;
    word-break: break-word;
  }
  .comments>>>.userName > .logOut {
    grid-column: 2;
    white-space: nowrap;
    color: #92b1b3;
    cursor: pointer;
    margin-right: 10px;
    transition: color linear 0.1s;
    -moz-transition: color linear 0.1s;
    -webkit-transition: color linear 0.1s;
  }
  .comments>>>.userName > .logOut:hover {
    color: rgb(6, 177, 183);
  }
  .comments>>>.dot {
    color: #c2c6cc;
    font-size: 13px;
    white-space: nowrap;
  }
  .comments>>>.avatar {
    border-top-right-radius: 4px;
  }
  .active-avatar {
    width: 45px;
    height: 45px;
    border-radius: 5px;
    border: transparent;
  }
  .comments>>>.avatar > svg {
    border-radius: 50%;
    height: 44px;
    width: 44px;
    transition: 0.3s;
    -moz-transition: 0.3s;
    -webkit-transition: 0.3s;
  }
  .comments>>>.addComment {
    display: grid;
    grid-template-columns: 0.001fr 1fr;
    grid-auto-rows: minmax(0, auto);
    grid-column-gap: 10px;
    padding-top: 2px;
  }
  .comments>>>.commentBox {
    display: block;
    grid-template-columns: minmax(200px, auto) 0.2fr;
    grid-auto-rows: minmax(0, -webkit-max-content);
    grid-auto-rows: minmax(0, max-content);
    grid-auto-rows: minmax(0, -moz-max-content);
    grid-row-gap: 10px;
    overflow: auto;
  }
  .comments>>>.commentBox > textarea {
    font-family: "Roboto", sans-serif;
    color: #2a2e2e;
    justify-self: stretch;
    box-sizing: border-box;
    height: 32px;
    width: 80%;
    margin-bottom: 10px;
    padding-top: 8px;
    padding-bottom: 8px;
    padding-left: 10px;
    padding-right: 22px;
    font-size: 13px;
    line-height: 16px;
    border-radius: 4px;
    border: 1px solid rgba(204, 212, 216, 0.8);
    overflow: hidden;
    resize: none;
    outline: none;
    transition: linear 0.1s all;
    -moz-transition: linear 0.1s all;
    -webkit-transition: linear 0.1s all;
  }
  .comments>>>.commentBox > button {
    font-family: "Roboto", sans-serif;
    background-color: #6e7575;
    align-self: end;
    color: #fff;
    max-height: 30px;
    box-sizing: border-box;
    height: 32px;
    padding: 8px 20px;
    font-size: 13px;
    line-height: 16px;
    font-weight: 700;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    outline: none;
    transition: linear 0.1s all;
    -moz-transition: linear 0.1s all;
    -webkit-transition: linear 0.1s all;
    z-index: 100;
  }
  .comments>>>.commentBox > button:hover {
    background-color: rgba(37, 75, 145, 1);
  }
  .comments>>>.updateLimit {
    display: grid;
    grid-template-columns: 1fr;
  }
  .comments>>>.limit {
    color: rgb(6, 177, 183);
    font-weight: 700;
    justify-self: center;
    font-size: 14px;
    line-height: 14px;
    box-sizing: border-box;
    border-radius: 18px;
    padding: 8px 10px;
    cursor: pointer;
    transition: linear 0.1s all;
    -moz-transition: linear 0.1s all;
    -webkit-transition: linear 0.1s all;
  }
  .comments>>>.limit:hover {
    color: #fff;
    background-color: #2196f3;
  }
  .comments>>>.fade-enter {
    opacity: 0;
  }
  .comments>>>.fade-enter-active {
    transition: opacity 0.3s;
    -moz-transition: opacity 0.3s;
    -webkit-transition: opacity 0.3s;
  }
  .comments>>>.fade-leave-active {
    transition: opacity 0.3s;
    -moz-transition: opacity 0.3s;
    -webkit-transition: opacity 0.3s;
    opacity: 0;
  }
  @media only screen and (max-width: 480px) {
    .comments>>>.avatar > svg {
      height: 20px;
      width: 20px;
    }
    .comments>>>.nameWrapper > .time {
      overflow: hidden;
      width: 38px;
      text-overflow: ellipsis;
    }
  }
  @media (hover: none) {
    .comments>>>::-webkit-scrollbar {
      -webkit-appearance: none !important;
    }
    .comments>>>::-webkit-scrollbar {
      width: 5px !important;
      height: 5px !important;
      background-color: rgba(204, 212, 216, 0.2) !important;
    }
    .comments>>>::-webkit-scrollbar-thumb {
      background: rgba(204, 212, 216, 0.7) !important;
    }
    .comments>>>.commentBox {
      overflow: unset;
    }
  }
  .comments>>>.requestLoading {
    display: inline-block;
    border: 4px solid transparent;
    border-left-color: #fff;
    border-radius: 50%;
    width: 10px;
    height: 10px;
    animation: requestLoading-spin 0.5s linear infinite;
  }
  @keyframes requestLoading-spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
