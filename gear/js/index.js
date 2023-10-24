// Basic initialization is like this:
// $('.your-class').slick();

// I added some other properties to customize my slider
// Play around with the numbers and stuff to see
// how it works.
$('.slick-carousel').slick({
    infinite: true,
    slidesToShow: 6, // Shows a three slides at a time
    slidesToScroll: 1, // When you click an arrow, it scrolls 1 slide at a time
    arrows: true, // Adds arrows to sides of slider
    dots: true // Adds the dots on the bottom
});

function sign_in_sucsess()
{
    var user = document.getElementById("cachusername").value;
    var pass = document.getElementById("cachpassword").value;
    if (user==""||pass=="")
    alert("Tên đăng nhập hoặc mật khẩu còn trống");
    else
    alert("BẠN ĐÃ ĐĂNG KÝ THÀNH CÔNG !!");
}