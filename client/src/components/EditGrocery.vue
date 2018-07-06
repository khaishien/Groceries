<template>
	<div class="edit">
		<h1>Edit Grocery</h1>
    <b-alert v-if="isShowSuccessAlert == true"
        variant="success"
        show
        dismissible
        @dismissed="isShowSuccessAlert=false">Success update!</b-alert>
    <b-alert v-if="error !== undefined" show variant="danger">{{error.message}}</b-alert>
    <b-container fluid>
        <b-form @submit="onSubmit" @reset="onReset">
            <b-form-group horizontal
                    id="formInputBrandGroup"
                    label="Brand:"
                    label-for="formInputBrand">
                <b-form-input id="formInputBrand"
                            type="text"
                            v-model="editForm.brand"
                            required
                            placeholder="Brand">
                </b-form-input>
            </b-form-group>
            <b-form-group horizontal
                    id="formInputNameGroup"
                    label="Name:"
                    label-for="formInputName">
                <b-form-input id="formInputName"
                            type="text"
                            v-model="editForm.name"
                            required
                            placeholder="Name">
                </b-form-input>
            </b-form-group>
            <b-form-group horizontal
                    id="formInputBarcodeGroup"
                    label="Barcode:"
                    label-for="formInputBarcode">
                    <b-row>
                        <b-col md="6">
                            <b-form-input id="formInputBarcode"
                                type="number"
                                v-model="editForm.upc12"
                                required
                                placeholder="Barcode"/>
                        </b-col>
                        <b-col md="6">
                            <barcode :value="Number(editForm.upc12)" :options="{ height: '25', width: '2' }"/>
                        </b-col>
                    </b-row>
            </b-form-group>
             <b-row align-h="start">
                <b-col md="2" offset-md="1"><b-button variant="primary" type="submit">Edit</b-button></b-col>
                <b-col md="2" ><b-button variant="danger" type="reset">Reset</b-button></b-col>
            </b-row>
        </b-form>
        <b-row align-h="end">
            <b-col md="2" ><b-button variant="success" @click="onClickBack">Back</b-button></b-col>
        </b-row>
    </b-container>
	</div>
</template>

<script>
import GroceryService from "@/services/GroceryService";
export default {
  name: "edit",
  data() {
    return {
      isShowSuccessAlert: false,
      error: undefined,
      groceryId: "",
      editForm: {
        brand: "",
        name: "",
        upc12: "",
        seq: ""
      },
      defaultForm: {
        brand: "",
        name: "",
        upc12: "",
        seq: ""
      }
    };
  },
  created() {
    this.groceryId = Number(this.$route.params.id);
  },
  mounted() {
    this.getGrocery();
  },
  methods: {
    showAlertSuccess() {
      this.isShowSuccessAlert = true;
    },
    onClickBack() {
      this.$router.push("/");
    },
    onSubmit(event) {
      event.preventDefault();
      this.putGrocery();
    },
    onReset(event) {
      event.preventDefault();
      this.editForm = Object.assign({}, this.defaultForm);
      this.updateGrocery(this.editForm);
    },
    updateGrocery(object) {
      object.upc12 = Number(object.upc12);
    },
    async getGrocery() {
      GroceryService.getGrocery(this.groceryId)
        .then(response => {
          let error;
          if (response.status !== 200) {
            error = { message: "http error code" + response.status };
          } else {
            error = response.data.error;
          }
          if (error) {
            this.error = error;
            this.grocery = {};
          } else {
            const data = response.data;
            this.error = undefined;
            this.defaultForm = Object.assign({}, data.grocery);
            this.editForm = Object.assign({}, data.grocery);
            this.updateGrocery(this.defaultForm);
            this.updateGrocery(this.editForm);
          }
        })
        .catch(error => {
          this.error = error;
        });
    },
    async putGrocery() {
      GroceryService.putGrocery(this.groceryId, this.editForm)
        .then(response => {
          let error;
          if (response.status !== 200) {
            error = { message: "http error code" + response.status };
          } else {
            error = response.data.error;
          }
          if (error) {
            this.error = error;
            this.grocery = {};
          } else {
            const data = response.data;
            this.error = undefined;
            this.defaultForm = Object.assign({}, data.grocery);
            this.editForm = Object.assign({}, data.grocery);
            this.updateGrocery(this.defaultForm);
            this.updateGrocery(this.editForm);
            this.showAlertSuccess();
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
