
factors = []
products = []
factor_id = ''
search_input = $('#search')
window.addEventListener('DOMContentLoaded', function () {
    factors_sumaary = localStorage.getItem("factors")
    data = localStorage.getItem("products")

    if (factors_sumaary) {
        factors = JSON.parse(factors_sumaary)
        products = JSON.parse(data)
    }
    renderCustomerTable()
    update_factor_id()
    console.log(factor_id)
})

$("#create-invoice").on('click', function () {
    $("#invoiceModal").modal("show")
})
search_input.on('input', function () {
    const tbody = $("#customeer-table-body");
    tbody.html("");
    let counter = 1;
    const keyword = search_input.val().trim().toLowerCase();

    factors.forEach((factor, index) => {
        if (factor.customerName && factor.customerName.toLowerCase().includes(keyword)) {
            let total = 0;
            if (Array.isArray(factor.products)) {
                total = factor.products.reduce((sum, product) => sum + (product.price * product.quantity), 0)
            }

            const row = `
                <tr>
                    <td class="text-center">${counter}</td>
                    <td class="text-center">${factor.customerName || "-"}</td>
                    <td class="text-center">${factor.id || "-"}</td>
                    <td class="text-center">${Number(total).toLocaleString()} </td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-info" onclick="viewFactor(${index})">نمایش</button>
                        <button class="btn btn-sm btn-primary" onclick="editFactor(${index})">ویرایش</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteFactor(${index})">حذف</button>
                    </td>
                </tr>
            `;
            tbody.append(row);
            counter++;
        }
    });

    // اگر هیچ موردی پیدا نشد:
    if (counter === 1) {
        tbody.html(`<tr><td colspan="5" class="text-center text-muted">هیچ نتیجه‌ای یافت نشد.</td></tr>`);
    }
});


function renderCustomerTable() {
    const tbody = $("#customeer-table-body");
    tbody.html("");

    if (!Array.isArray(factors) || factors.length === 0) {
        tbody.html(`<tr><td colspan="5" class="text-center text-muted">هیچ فاکتوری یافت نشد.</td></tr>`);
        return;
    }

    factors.forEach((factor, index) => {
        let total = 0;
        total = factor.products.reduce((sum, product) => sum + (product.price * product.quantity), 0)
        const row = `
            <tr>
                <td class="text-center">${index + 1}</td>
                <td class="text-center">${factor.customerName || "-"}</td>
                <td class="text-center">${factor.id || "-"}</td>
                <td class="text-center">${Number(total).toLocaleString()}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-info" onclick="viewFactor(${index})">نمایش</button>
                    <button class="btn btn-sm btn-primary" onclick="editFactor(${index})">ویرایش</button>
                    <button class="btn btn-sm btn-danger"  onclick="deleteFactor(${index})">حذف</button>
                </td>
            </tr>
        `;
        tbody.append(row);
    });
}


function deleteFactor(index) {
    Swal.fire({
        title: "آیا از حذف فاکتور مطمئن هستید؟",
        text: "پس از حذف قادر به بازگرداندن فاکتور نخواهید بود!",
        icon: "warning",
        cancelButtonText: 'لغو',
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "بله، حذف شود"
    }).then((result) => {
        if (result.isConfirmed) {
            factors.splice(index, 1)

            localStorage.setItem("factors", JSON.stringify(factors));
            renderCustomerTable()

            Swal.fire({

                text: "فاکتور با موفقیت حذف شد.",
                icon: "success",
                confirmButtonText: "تایید"
            });
        }
    });

}

function viewFactor(index) {
    window.location.href = `./index.html2?factorId=${factors[index].id}&state=view`

}

function editFactor(index) {
    window.location.href = `./index.html2?factorId=${factors[index].id}&state=edit`

}

function update_factor_id() {
    let id = localStorage.getItem('factor-id');

    if (id === null) {
        factor_id = "1000";
        localStorage.setItem('factor-id', factor_id);
    } else {
        factor_id = id;
    }
}

$("#createInvoiceBtn").on("click", function () {
    const customerName = $("#customer-name").val();
    const invoiceTitle = $("#invoiceTitle").val();
    const invoiceDate = $("#invoiceDate").val();
    const customerType = $("input[name='customer-type']:checked").val();


    let factorId = Number(localStorage.getItem("factor-id")) || 1000;

    const newFactor = {
        id: factorId,
        customerName: customerName,
        invoiceTitle: invoiceTitle,
        invoiceDate: invoiceDate,
        customerType: customerType,
        products: []
    };

    factors.push(newFactor);

    localStorage.setItem("factors", JSON.stringify(factors));
    localStorage.setItem("factor-id", factorId + 1);
    window.location.href = `./index2.html?factorId=${factorId}&state=edit`

    $("#invoiceForm")[0].reset();

    const modal = bootstrap.Modal.getInstance(document.getElementById("invoiceModal"));
    modal.hide();
})