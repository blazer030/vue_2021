const addBtn = document.getElementById('addProduct');
const clearAllBtn = document.getElementById('clearAll');

const productTable = document.getElementById('productTable');
const productCount = document.getElementById('productCount');

const openModalBtn = document.getElementById('openModal');
const productModalLabel = document.getElementById('productModalLabel');
const nameInput = document.getElementById('name');
const originPriceInput = document.getElementById('originPrice');
const priceInput = document.getElementById('price');

let updateIndex = -1;
let productList = [];
//定義修改時執行渲染函式
productList.push = function() { 
  Array.prototype.push.apply(this, arguments);  
  render();
};

productList.splice = function() {
  Array.prototype.splice.apply(this, arguments);  
  render();
}

productList.update = function(index, data) {
  productList[index] = data;
  render();
}


function openProductModal(product) {
    if (product) {
        productModalLabel.innerHTML = '修改商品';
        nameInput.value = product.name;
        originPriceInput.value = product.originPrice;
        priceInput.value = product.price;
    } else {
        productModalLabel.innerHTML = '新增商品';
        nameInput.value = '';
        originPriceInput.value = '0';
        priceInput.value = '0';
    }
    $("#productModal").modal('show');
}

function addProduct() {
    if (nameInput.value !== '') {
        if (updateIndex == -1) {
            productList.push({
                name: nameInput.value.trim(),
                originPrice: parseInt(originPriceInput.value) || 0,
                price: parseInt(priceInput.value) || 0,
                enable: false
            });
        } else {
            productList.splice(updateIndex, 1, {
                name: nameInput.value.trim(),
                originPrice: parseInt(originPriceInput.value) || 0,
                price: parseInt(priceInput.value) || 0,
                enable: productList[updateIndex].enable
            });
        }
        $("#productModal").modal('toggle');
    } else {
        alert('請輸入產品標題');
    }
}

function editProduct(e) {
    const action = e.target.dataset.action;
    const index = e.target.dataset.id;
    switch (action) {
        case 'status':
            const productData = productList[index];
            productData.enable = !productData.enable;
            productList.splice(index, 1, {...productData});
            break;
        case 'edit':
            updateIndex = index;
            openProductModal(productList[index]);
            break;
        case 'remove':
            productList.splice(index, 1);
            break;
    }
}

//渲染函式
function render() {
  let productListHtml = '';
  productList.forEach((product, index) => {
    productListHtml += `
    <tr>
      <td>${product.name}</td>
      <td width="120">
        ${product.originPrice}
      </td>
      <td width="120">
        ${product.price}
      </td>
      <td width="100">
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" id="chk${ index }" ${ product.enable ? 'checked': '' } data-action="status" data-id="${ index }">
          <label class="form-check-label" for="chk${ index }">${ product.enable ? '啟用' : '未啟用' }</label>
        </div>
      </td>
      <td width="120">
        <button type="button" class="btn btn-sm btn-outline-success move" data-action="edit" data-id="${index}"> 編輯 </button>
      </td>
      <td width="120">
        <button type="button" class="btn btn-sm btn-outline-danger move" data-action="remove" data-id="${index}"> 刪除 </button>
      </td>
    </tr>
    `;
  });
  productTable.innerHTML = productListHtml;
  productCount.textContent = productList.length;
}

//設定監聽
openModalBtn.addEventListener('click', function() {
    updateIndex = -1;
    openProductModal();
});
clearAllBtn.addEventListener('click', function() {
    productList.splice(0, productList.length);
});
addBtn.addEventListener('click', addProduct);
productTable.addEventListener('click', editProduct);

render();