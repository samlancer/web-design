
productName = $("#product-name")
quantity = $("#quantity")
price = $("#price")
addButton = $("#add-btn")
addForm = $("#add-form")
productTableBody = $('#productTableBody');
payable = $("#payable")

factors = []
products = []
const params = new URLSearchParams(window.location.search);
const factorId = params.get("factorId");
const state = params.get("state");

window.addEventListener('DOMContentLoaded', function () {
    factors_sumaary = localStorage.getItem("factors")
    data = localStorage.getItem("products")
    if (state == 'view') {
        $("#list-title1, #list-title2, #add-form").addClass("d-none")
    }

    if (factors_sumaary) {
        factors = JSON.parse(factors_sumaary)
        products = JSON.parse(data)
    }
    factors.forEach((factor, index) => {
        if (factor.id == factorId) {
            $('#f-title').text(`${factor.invoiceTitle}`)
            $('#f-code').text(`${factor.id}`)
            $('#f-date').text(`${factor.invoiceDate}`)
            $('#c-name').text(`${factor.customerName}`)



        }
    });
    renderTable()
})

addForm.on("submit", function (e) {
    e.preventDefault();
    factors.forEach((factor, index) => {
        if (factor.id == factorId) {
            factor.products.push({ name: productName.val(), quantity: parseFloat(quantity.val()), price: parseFloat(price.val()), total_price: (parseFloat(quantity.val()) * parseFloat(price.val())) })
            productName.val('')
            quantity.val('')
            price.val('')
            saveToLocal()
            renderTable()
        }

    })
})
function saveToLocal() {
    localStorage.setItem("factors", JSON.stringify(factors))
}

function renderTable() {

    productTableBody.html("");
    factors.forEach((factor, index) => {
        if (factor.id == factorId) {
            factor.products.forEach((product, index) => {
                const row = document.createElement('tr');

                const total = product.quantity * product.price;

                if (state == "view") {
                    row.innerHTML = `
                                <td class='text-center'>${index + 1}</td>
                                <td class='text-center'>${product.name}</td>
                                <td class='text-center'>${Number(product.quantity).toLocaleString()}</td>
                                <td class='text-center'>${Number(product.price).toLocaleString()}</td>
                                <td class='text-center'>${Number(total).toLocaleString()}</td>
                                <td class='text-center'>
                                </td>
                            `;
                } else {
                    row.innerHTML = `
                                <td class='text-center'>${index + 1}</td>
                                <td class='text-center'>${product.name}</td>
                                <td class='text-center'>${Number(product.quantity).toLocaleString()}</td>
                                <td class='text-center'>${Number(product.price).toLocaleString()}</td>
                                <td class='text-center'>${Number(total).toLocaleString()}</td>
                                <td class='text-center'>
                                <button class="btn btn-sm btn-warning" onclick="editProduct(${index})">ویرایش</button>
                                <button class="btn btn-sm btn-danger" onclick="deleteProduct(${index})">حذف</button>
                                </td>
                            `;
                }
                productTableBody.append(row);
                updatePayable()
            });
        }
    })

}
function calculateDiscount(total) {
    const discountVal = parseFloat($("#discount-value").val()) || 0;
    const discountType = $("#discout-type").val();

    let discountAmount = 0;
    if (discountType === "%") {
        discountAmount = (discountVal / 100) * total;
    } else if (discountType === "$") {
        discountAmount = discountVal;
    }

    return Math.min(discountAmount, total);
}

function updatePayable() {
    factors.forEach((factor) => {
        if (factor.id == factorId) {
            const totalBeforeDiscount = factor.products.reduce(
                (sum, product) => sum + (product.price * product.quantity),
                0
            );

            const discountAmount = calculateDiscount(totalBeforeDiscount);
            const finalAmount = totalBeforeDiscount - discountAmount;

            $("#payable").text(finalAmount.toLocaleString() + " تومان");
        }
    });
}

function deleteProduct(index) {
    Swal.fire({
        title: "آیا از حذف محصول مطمئن هستید؟",
        icon: "warning",
        cancelButtonText: 'لغو',
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "بله، حذف شود"
    }).then((result) => {
        if (result.isConfirmed) {
            factors.forEach((factor, index) => {
                if (factor.id == factorId) {
                    factor.products.splice(index, 1)

                }

            })

            localStorage.setItem("factors", JSON.stringify(factors));
            renderTable()

        }
    })

}

////////////////////////////////////////////////////////////////////////////////////////////////
function editProduct(index) {
    const factor = factors.find(f => f.id == factorId);
    const product = factor.products[index];

    // پر کردن فرم مودال با اطلاعات قبلی
    $('#edit-index').val(index);
    $('#edit-name').val(product.name);
    $('#edit-quantity').val(product.quantity);
    $('#edit-price').val(product.price);

    // نمایش مودال
    const modal = new bootstrap.Modal(document.getElementById('editProductModal'));
    modal.show();
}

$("#edit-product-form").on("submit", function (e) {
    e.preventDefault();

    const index = Number($("#edit-index").val());
    const name = $("#edit-name").val().trim();
    const quantity = parseFloat($("#edit-quantity").val());
    const price = parseFloat($("#edit-price").val());

    if (!name || isNaN(quantity) || isNaN(price)) {
        Swal.fire("خطا", "لطفاً مقادیر معتبر وارد کنید", "error");
        return;
    }

    // بروزرسانی محصول
    factors.forEach(factor => {
        if (factor.id == factorId) {
            factor.products[index] = {
                name,
                quantity,
                price,
                total_price: quantity * price
            };
        }
    });

    saveToLocal();
    renderTable();

    // بستن مودال
    bootstrap.Modal.getInstance(document.getElementById("editProductModal")).hide();

    // SweetAlert موفقیت
    Swal.fire({
        title: "انجام شد!",
        text: "محصول با موفقیت ویرایش شد.",
        icon: "success",
        confirmButtonText: "باشه"
    });
});
///////////////////////////////////////////////////////////////////////////////////////////////
$("#discount-value").on('input',function(){
    updatePayable()
})