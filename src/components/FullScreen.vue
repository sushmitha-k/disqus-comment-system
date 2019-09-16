<template>
  <div>
    <comment-grid baseURL="https://comment-system-3c858.firebaseio.com" apiKey="AIzaSyBVrdA5A5UHCrUfUcoZfdsgv9NWEdmdvDE"
    nodeName="commentDetails"></comment-grid> 
  </div>
</template>

<script>
  import Comments from "./comments/Comments.vue";
  export default {
    name: "fullscreenDemo",
    components: {
      CommentGrid: Comments
    }
  };
</script>

<style>

</style>
