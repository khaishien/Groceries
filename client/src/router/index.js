import Vue from "vue";
import Router from "vue-router";
import SearchGroceries from "@/components/SearchGroceries";
import EditGrocery from "@/components/EditGrocery";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "SearchGroceries",
      component: SearchGroceries
    },
    {
      path: "/edit/:id",
      name: "EditGrocery",
      component: EditGrocery,
      props: true
    }
  ]
});

export default router;
