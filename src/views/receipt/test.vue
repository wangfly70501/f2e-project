<template>

 <div id="app">
   <input v-model='search' />
    <ul v-for="item in searchData"  :key='item'>
    <li>{{item.name}},價格:￥{{item.price}}</li>
   </ul>
 </div>
</template>

<script>
export default {
  data: function () {
    return {
      search: '',
      products: [{
        name: '蘋果',
        price: 25,
        category: '水果'
      }, {
        name: '香蕉',
        price: 15,
        category: '水果'
      }, {
        name: '雪梨',
        price: 65,
        category: '水果'
      }, {
        name: '寶馬',
        price: 2500,
        category: '汽車'
      }, {
        name: '賓士',
        price: 10025,
        category: '汽車'
      }, {
        name: '柑橘',
        price: 15,
        category: '水果'
      }, {
        name: '奧迪',
        price: 25,
        category: '汽車'
      }]
    }
  },
  computed: {
    searchData: function () {
      var search = this.search

      if (search) {
        return this.products.filter(function (product) {
          return Object.keys(product).some(function (key) {
            return String(product[key]).toLowerCase().indexOf(search) > -1
          })
        })
      }

      return this.products
    }
  }
}
</script>
