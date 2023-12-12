// Lấy giá trị giá tiền
let amountEl = document.getElementById('amount');
let amount = amountEl.value;

let render = () => {
    amountEl.value= amount;
}

// Tăng số lượng sản phẩm 
// Tính tổng tiền 1 sản phẩm
let HandlePlus = () => {
    amount++;
    render(amount);
}



let HandleMinus = () => {
    if (amount > 1)
        amount--;
    render(amount);
}



// Lấy giá trị giá tiền
let amountEl_1 = document.getElementById('amount_1');
let amount_1 = amountEl_1.value;

let render_1 = () => {
    amountEl_1.value= amount_1;
}

// Tăng số lượng sản phẩm 
// Tính tổng tiền 1 sản phẩm
let HandlePlus_1 = () => {
    amount_1++;
    render_1(amount_1);
}

let HandleMinus_1 = () => {
    if (amount_1 > 1)
        amount_1--;
    render_1(amount_1);
}



// Lấy giá trị giá tiền
let amountEl_2 = document.getElementById('amount_2');
let amount_2 = amountEl_2.value;

let render_2 = () => {
    amountEl_2.value= amount_2;
}

// Tăng số lượng sản phẩm 
// Tính tổng tiền 1 sản phẩm
let HandlePlus_2 = () => {
    amount_2++;
    render_2(amount_2);
}

let HandleMinus_2 = () => {
    if (amount_2 > 1)
        amount_2--;
    render_2(amount_2);
}


// Tính tổng tiền đơn hàng
let HandleTotal = () => {
    let price_1 = parseFloat(document.getElementById('price_1').innerHTML)
    let price_2 = parseFloat(document.getElementById('price_2').innerHTML)
    let price_3 = parseFloat(document.getElementById('price_3').innerHTML)
    let amountEl = document.getElementById('amount').value
    let amountEl_1 = document.getElementById('amount_1').value
    let amountEl_2 = document.getElementById('amount_2').value
    let totalprice = document.getElementById('totalprice')
    totalprice.innerHTML = price_1 * amountEl + price_2 * amountEl_1 + price_3 * amountEl_2 + '.000.000₫'

}

// Xoá sản phẩm
function removeCart_1() {
    let sp = document.getElementById('sp_1')
    sp.remove()
}

function removeCart_2() {
    let sp = document.getElementById('sp_1')
    sp.remove()
}

function removeCart_3() {
    let sp = document.getElementById('sp_1')
    sp.remove()
}

function removeCart_4() {
    let sp = document.getElementById('sp_1')
    sp.remove()
}

