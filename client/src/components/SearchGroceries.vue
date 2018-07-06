<template>
	<div class="search">
		<h1>Groceries</h1>
    <b-alert v-if="error !== undefined" show variant="danger">{{error.message}}</b-alert>
    <div v-else>
      <b-container fluid>
          <b-form @submit="onSubmit" @reset="onReset">
            <b-row class="justify-content-md-center">
              <b-col md="3"><b-input id="formInputBrand" placeholder="Brand" v-model="searchForm.brand"/></b-col>
              <b-col md="3"><b-input id="formInputName" placeholder="Name" v-model="searchForm.name"/></b-col>
              <b-col md="2">
                <b-form-select
                  v-model="selectedSort"
                  :options="optionsSort"
                  id="formInputSortOption">
                </b-form-select>
              </b-col>
              <b-col md="1"><b-button variant="primary" type="submit">Search</b-button></b-col>
              <b-col md="1"><b-button variant="danger" type="reset">Reset</b-button></b-col>
            </b-row>
          </b-form>
      </b-container>
      <br/>

      <b-container>
        <b-row md="10" class="justify-content-md-center">
          <b-pagination size="md" :total-rows="totalPage" v-model="currentPage" @change="onPageChange" :limit="limitPage"/>
        </b-row>
        <b-row md="10" class="table-wrap">
            <b-table striped hover :items="groceries" :fields="fields">
              <template slot="upc12" slot-scope="data">
                <barcode :value="Number(data.value.trim())" :options="{ height: '25', width: '2' }"></barcode>
              </template>
              <template slot="edit" slot-scope="data">
                <b-button size="sm" @click="onClickEditItem(data.item)" class="mr-2" variant="success"> Edit </b-button>
              </template>
            </b-table>
        </b-row>
      </b-container>
    </div>
	</div>
</template>

<script>
import GroceryService from "@/services/GroceryService";
export default {
  name: "search",
  data() {
    return {
      totalPage: 10,
      limitPage: 4,
      currentPage: 1,
      fields: [
        {
          key: "upc12",
          label: "barcode",
          sortable: false
        },
        {
          key: "brand",
          label: "Brand",
          sortable: false
        },
        {
          key: "name",
          label: "Name",
          sortable: false
        },
        {
          key: "edit",
          label: "",
          sortable: false
        }
      ],
      groceries: [],
      error: undefined,
      searchForm: {
        brand: "",
        name: ""
      },
      selectedSort: "ASC",
      optionsSort: [
        { value: "ASC", text: "A - Z" },
        { value: "DESC", text: "Z - A" }
      ]
    };
  },
  created() {},
  mounted() {
    this.getGroceries();
  },
  methods: {
    onClickEditItem(item) {
      // alert(JSON.stringify(item));
      this.$router.push("/edit/" + item.seq);
    },
    onPageChange(newPage) {
      this.currentPage = newPage;
      this.getGroceries(
        this.searchForm.brand,
        this.searchForm.name,
        this.selectedSort
      );
    },
    onSubmit(event) {
      event.preventDefault();
      // alert(JSON.stringify(this.searchForm));
      this.getGroceries(
        this.searchForm.brand,
        this.searchForm.name,
        this.selectedSort
      );
    },
    onReset(event) {
      event.preventDefault();
      this.searchForm = {
        brand: "",
        name: ""
      };
      this.getGroceries("", "", this.selectedSort);
    },
    async getGroceries(filterBrandStr = "", filterNameStr = "") {
      GroceryService.getGroceries(
        this.currentPage,
        filterBrandStr,
        filterNameStr,
        this.selectedSort
      )
        .then(response => {
          let error;
          if (response.status !== 200) {
            error = { message: "http error code" + response.status };
          } else {
            error = response.data.error;
          }
          if (error) {
            this.error = error;
            this.groceries = [];
          } else {
            const data = response.data;
            this.error = undefined;
            this.groceries = data.groceries;
            this.currentPage = Number(data.currentPage);
            this.totalPage = data.totalPage;
            this.limitPage = data.totalPage > 6 ? 6 : data.totalPage;
          }
        })
        .catch(error => {
          this.error = error;
        });
    }
  }
};
</script>

<style type="text/css">
.table-wrap {
  text-align: center;
}
</style>
