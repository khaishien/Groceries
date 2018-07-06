import Api from "@/services/Api";

export default {
  getGroceries(page, filterBrandStr, filterNameStr, selectedSort) {
    const params = new URLSearchParams();
    filterBrandStr !== "" && params.append("brand", filterBrandStr);
    filterNameStr !== "" && params.append("name", filterNameStr);
    params.append("sort", selectedSort);

    return Api().get("/groceries/" + page + "?" + params);
  },
  getGrocery(id) {
    return Api().get("/grocery/" + id);
  },
  putGrocery(id, body) {
    return Api().put("/grocery/" + id, body);
  }
};
