<template>
  <header>
    <div class="col-12">
      <router-view />
    </div>
  </header>
  <div>
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      variant="elevated"
      multi-line
      :timeout="4000"
    >
      <strong>{{ snackbar.message }}</strong>
      <template v-slot:actions>
        <v-btn color="black" variant="text" @click="snackbar.show = false">
          X
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  computed: {
    ...mapState(["snackbar"]),
  },
  methods: {
    ...mapActions(["connectSocket"]),
    // Other methods as needed
  },
  created() {
    // Connect socket when the component is created
    this.connectSocket();
  },
};
</script>

<style lang="scss" scoped></style>
