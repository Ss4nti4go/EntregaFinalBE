const socket = io();
   const idInput = document.getElementById('productId');
  // Escuchar cuando se actualiza la lista de productos
 
    socket.on('updateProducts', async (data) => {
      const productList = document.getElementById('productList');
      const productos = data.docs || [];
   
      productList.innerHTML = ''; // Limpiar la lista antes de agregar los productos actualizados

      productos.forEach(producto => {
        const thumbnails = Array.isArray(producto.thumbnails) ? producto.thumbnails : [];
        const li = document.createElement('li');
        li.classList.add('product-card');
        li.innerHTML = `
          <strong>${producto.title}</strong> - $${producto.price} <br>
          <small>${producto.description}</small><br>
          Código: ${producto.code} <br>
          Estado: ${producto.status ? 'Activo' : 'Inactivo'} <br>
          Stock: ${producto.stock} <br>
          Categoría: ${producto.category} <br>
          <div>
            ${thumbnails.map(thumbnail => `<img src="${thumbnail}" alt="Thumbnail de ${producto.title}" width="100" height="100">`).join('')}
          </div>
       
        `;
        productList.appendChild(li);
      });
    });
    function addProduct() {
    const title = document.getElementById('productTitle').value;
    const description = document.getElementById('productDescription').value;
    const code = document.getElementById('productCode').value; 
    const price = document.getElementById('productPrice').value;
    const status = document.getElementById('productStatus').checked;
    const stock = document.getElementById('productStock').value;
    const category = document.getElementById('productCategory').value;
    const thumbnails = [
      document.getElementById('productThumbnail1').value,
      document.getElementById('productThumbnail2').value
    ];

    socket.emit('newProduct', { title, description, code, price, status , stock, category, thumbnails });
    document.getElementById('productTitle').value= '';
    document.getElementById('productDescription').value= '';
    document.getElementById('productCode').value= ''; 
    document.getElementById('productPrice').value= '';
    document.getElementById('productStatus').checked = false;
    document.getElementById('productStock').value= '';
    document.getElementById('productCategory').value = '';
  }

  function deleteProduct() {
    socket.emit('deleteProduct', { id: idInput.value });
    document.getElementById('productId').value = '';
  }