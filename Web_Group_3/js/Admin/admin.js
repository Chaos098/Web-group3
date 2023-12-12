
// menu toggle
let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");

toggle.onclick = function () {
    navigation.classList.toggle("active");
    main.classList.toggle("active");
};


//Upload ảnh
function chooseFile(fileInput, targetImageId) {
    if (fileInput.files && fileInput.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#' + targetImageId).attr('src', e.target.result);
        }
        reader.readAsDataURL(fileInput.files[0]);
    }
}

//Xoá sản phẩm 

function Delete_1() {
    var sp_1 = document.getElementById('sp_1')
    if (confirm("Chắc chắn xoá ?") == true) {
        sp_1.remove()
        alert("Xoá hoàn tất")
    } else {
        alert("Tiếp tục chỉnh sửa")
    }
}

function Delete_2() {
    var sp_2 = document.getElementById('sp_2')
    if (confirm("Chắc chắn xoá ?") == true) {
        sp_2.remove()
        alert("Xoá hoàn tất")
    } else {
        alert("Tiếp tục chỉnh sửa")
    }
}

function Delete_3() {
    var sp_3 = document.getElementById('sp_3')
    if (confirm("Chắc chắn xoá ?") == true) {
        sp_3.remove()
        alert("Xoá hoàn tất")
    } else {
        alert("Tiếp tục chỉnh sửa")
    }
}


//Xoá ảnh 
function DeleteImg_1() {
    $("#image_1").removeAttr("src");
    $("#image_1").attr("src","");
}

function DeleteImg_2() {
    $("#image_2").removeAttr("src");
}

function DeleteImg_3() {
    $("#image_3").removeAttr("src");
}

function DeleteImg_4() {
    $("#image_4").removeAttr("src");
}


let amountEl_1 = document.getElementById('amount_1');
let amount_1 = amountEl_1.value;

let render_1 = () => {
    amountEl_1.value = amount_1;
}

let HandlePlus_1 = () => {
    amount_1++;
    render_1(amount_1);
}

let HandleMinus_1 = () => {
    if (amount_1 > 1)
        amount_1--;
    render_1(amount_1);
}

let amountEl_2 = document.getElementById('amount_2');
let amount_2 = amountEl_1.value;

let render_2 = () => {
    amountEl_2.value = amount_2;
}

let HandlePlus_2 = () => {
    amount_2++;
    render_2(amount_2);
}

let HandleMinus_2 = () => {
    if (amount_2 > 1)
        amount_2--;
    render_1(amount_2);
}



// Chỉnh sửa trạng thái người dùng
function changeState() {
    let state = document.getElementById('state')
    let options = state.options
    let static = document.getElementById('static')
    for (var i = 0; i < options.length; i++) {
        if (options[i].selected == true) {
            static.innerHTML = options[i].value
        }
    }
}

function submitAdd() {
    let name = document.getElementById('name').value
    let phone = document.getElementById('phone').value
    let address = document.getElementById('address').value

    if (name === "" || phone === "" || address === "")
        alert('Chưa nhập thông tin')
    else {
        if (confirm("Đã hoàn thành ?") == true) {
            alert("Thêm thành công")
        } else {
            alert("Tiếp tục chỉnh sửa")
        }
    }
}

function submitChange() {
    // Lấy giá trị ban đầu 
    // Tạo thẻ p mới để thay thế
    let name = document.getElementById('name-guest')
    let p_name = document.createElement('p')

    let phone = document.getElementById('phone-guest')
    let p_phone = document.createElement('p')

    let address = document.getElementById('address')
    let p_address = document.createElement('p')


    // Lấy giá trị trong input để thay thế
    let name_change = document.getElementById('name-change').value
    let phone_change = document.getElementById('phone-change').value
    let address_change = document.getElementById('address-change').value


    // Thay thế giá trị từ input
    p_name.classList.add('d-inline')
    p_name.style.fontWeight = 'bolder'
    p_name.innerHTML = name_change
    name.parentNode.replaceChild(p_name, name)


    p_phone.classList.add('d-inline')
    p_phone.style.fontWeight = 'bolder'
    p_phone.innerHTML = phone_change
    phone.parentNode.replaceChild(p_phone, phone)


    p_address.classList.add('d-inline')
    p_address.style.fontWeight = 'bolder'
    p_address.innerHTML = address_change
    address.parentNode.replaceChild(p_address, address)



    if (name_change.length != 0) 
        name.innerHTML = name_change
    if (phone_change.length != 0)
        phone.innerHTML = phone_change
    if (address_change.length != 0)
        address.innerHTML = address_change


        
    if (confirm("Đã hoàn thành ?") == true) {
        alert("Chỉnh sửa thành công")
    } else {
        alert("Tiếp tục chỉnh sửa")
    }
}





