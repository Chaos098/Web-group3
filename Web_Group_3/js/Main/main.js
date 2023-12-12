GVN = {};
window.proInCartJS = {};
window.cartJS = {};
window.accountJS = {
	"email": null,
	"first_name": null,
	"last_name": null,
	"name": null,
	"phone": null,
	"logged": false,
	"id": ""
};
window.productCollect = [];

/*Var Account*/
var isAccount = false;
var targetPopAccount = '';
var txtPopup = {
		'acc-login-box': 'ÄÄ‚NG NHáº¬P HOáº¶C Táº O TÃ€I KHOáº¢N',
		'acc-otp-box': 'XÃC THá»°C OTP',
		'acc-register-box': 'ÄÄ‚NG KÃ TÃ€I KHOáº¢N GEARVN',
		'acc-recovery-box': 'QUÃŠN Máº¬T KHáº¨U'
};
var txtSocialPopup = {
		'acc-login-box': 'hoáº·c Ä‘Äƒng nháº­p báº±ng',
		'acc-register-box': 'hoáº·c Ä‘Äƒng kÃ½ báº±ng'
}

/*Var Country*/
var countries = null;
const addressData = window.Countries;

/*Var Filter Collection*/
var hostShop = window.location.pathname;
var min_origin = '';
var max_origin = '';
var str = "";

/*Var App PE*/
var list_item_gift = [];
var dataItemsGift = {};

/*Get token OTP*/
function On_PhoneAuthRecaptchaCallback(token) {
	if(!token){
		GVN.Global.account.isSendAgain = true;
		return false;
	}
	console.log(token);

	var allowSubmit = true;
	var phone = $('#acc-recovery-box #phone_auth_recaptcha input[name="phone_number"]').val();
	var dom   = $('#acc-recovery-box #phone_auth_recaptcha input[name="phone_number"]').parent();
	var validatePhone = GVN.Global.account.checkPhone(phone);
	if(validatePhone == 1) dom.addClass('error1').removeClass('error2').removeClass('error3');
	if(validatePhone == 2) dom.addClass('error2').removeClass('error1').removeClass('error3');
	if(validatePhone == 3) dom.addClass('error3').removeClass('error1').removeClass('error2');
	if(validatePhone != 0) allowSubmit = false;

	if(allowSubmit){
		$('.btn-acc').addClass('btn-loading');
		$.ajax({
			type: "POST",
			url: '/phone_auth/send_verify_code',
			data: $('#phone_auth_recaptcha').serialize(),
			dataType : "json",
			success: function(data, textStatus, jqXHR){
				if(data && data.token){
					$('.modal-header h4').html('XÃC THá»°C OTP');
					$('.form-btn-social, .form-btn-bottom, #acc-login-box').addClass('d-none');
					$('#acc-register-box').addClass('d-none');
					$('#acc-recovery-box').removeClass('d-none');
					
					if ($('#acc-recovery-box #session_info').length > 0) {
						$('#acc-recovery-box #session_info').val(data.token);
					}
					/*$('#send_again').addClass('disable');*/
					GVN.Global.account.isSendAgain = true;
					GVN.Global.account.countDownOtp();
				}
				else {
					Swal.fire({
						title: '',
						text: data.message,
						icon: 'error',
						timer: 2000,
						showCancelButton: false,
						showConfirmButton: false
					});
				}
			},
			error: function(jqXHR, textStatus, errorThrown){
				$('.btn-acc').removeClass('btn-loading');
				
				Swal.fire({
					title: '',
					text: "KhÃ´ng thá»ƒ gá»­i tin nháº¯n xÃ¡c thá»±c. Vui lÃ²ng thá»­ láº¡i sau",
					icon: 'error',
					timer: 2000,
					showCancelButton: false,
					showConfirmButton: false
				});
				/*swal({
					title: "",
					text: "KhÃ´ng thá»ƒ gá»­i tin nháº¯n xÃ¡c thá»±c. Vui lÃ²ng thá»­ láº¡i sau",
					icon: "error",
				});*/
			}
		});
	}
	return;
}

GVN.Helper = {
	dataMinicartGiftPE: {},
	moneyFormat: function(number,format) {
		if(number != undefined){
			return number
				.toFixed(0) // always two decimal digits
				.replace(".", ",") // replace decimal point character with ,
				.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") + "" + format // use , as a separator
		}
	},
	formatDate: function(date) { // account pages
		var day = days[date.getDay()];
		var time = (date.getHours() < 10 ? ('0' + date.getHours()): date.getHours()) + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
		var _date = (date.getDate() < 10 ? ('0' + date.getDate()):date.getDate());
		var month = date.getMonth() + 1;
		month = month < 10 ? ('Thg 0' + month): month;
		var year = date.getFullYear();

		return day + ', ' + time + ' ' + _date + ' ' + month + ', ' + year
	},
	delayTime:function (func, wait) {
		return function() {
			var that = this,
					args = [].slice(arguments);
			clearTimeout(func._throttleTimeout);
			func._throttleTimeout = setTimeout(function() {
				func.apply(that, args);
			}, wait);
		};
	},
	uniques: function(arr) {
		var a = [];
		for (var i=0, l=arr.length; i<l; i++)
			if (a.indexOf(arr[i]) === -1 && arr[i] !== '')
				a.push(arr[i]);
		return a;
	},
	change_alias: function(alias){
		var str = alias;
		str = str.toLowerCase();
		str = str.replace(/Ã |Ã¡|áº¡|áº£|Ã£|Ã¢|áº§|áº¥|áº­|áº©|áº«|Äƒ|áº±|áº¯|áº·|áº³|áºµ/g,"a"); 
		str = str.replace(/Ã¨|Ã©|áº¹|áº»|áº½|Ãª|á»|áº¿|á»‡|á»ƒ|á»…/g,"e"); 
		str = str.replace(/Ã¬|Ã­|á»‹|á»‰|Ä©/g,"i"); 
		str = str.replace(/Ã²|Ã³|á»|á»|Ãµ|Ã´|á»“|á»‘|á»™|á»•|á»—|Æ¡|á»|á»›|á»£|á»Ÿ|á»¡/g,"o"); 
		str = str.replace(/Ã¹|Ãº|á»¥|á»§|Å©|Æ°|á»«|á»©|á»±|á»­|á»¯/g,"u"); 
		str = str.replace(/á»³|Ã½|á»µ|á»·|á»¹/g,"y"); 
		str = str.replace(/Ä‘/g,"d");
		str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\â€¢|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
		str = str.replace(/ /g,"-");
		str = str.trim(); 
		return str;
	},
	inputTypeDate: function(){
		$('input[type="date"], input[type="datetime"], input[type="datetime-local"], input[type="month"], input[type="time"], input[type="week"]').each(function() {
			var el = this, type = $(el).attr('type');
			if ($(el).val() == '') $(el).attr('type', 'text');
			$(el).focus(function() {
				$(el).attr('type', type);
				el.click();
			});
			$(el).blur(function() {
				if ($(el).val() == '') $(el).attr('type', 'text');
			});
		});
	},
	checkemail: function(email) {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	},
	checkPhone: function(phone){
		var re = /(^0[2-9]\d{8}$)|(^01\d{9}$)/;
		return re.test(phone); 
	},
	flyCart: function(img){
		var cart = $('.main-header .main-header--cart');
		var imgtodrag = img;
		if (imgtodrag) {
			var imgclone = imgtodrag.clone()
			.offset({
				top: imgtodrag.offset().top,
				left: imgtodrag.offset().left
			})
			.css({
				'opacity': '0.5',
				'position': 'absolute',
				'width': '150px',
				'z-index': '999999'
			})
			.appendTo($('body'))
			.animate({
				'top': cart.offset().top + 10,
				'left': cart.offset().left + 10,
				'width': 75
			}, 1000, 'easeInOutExpo');
			imgclone.animate({
				'width': 0,
				'height': 0
			}, function () {
				$(this).detach()
			});
		}
	},
	FilterInput: function(event) {
		var keyCode = ('which' in event) ? event.which : event.keyCode;
		isNotWanted = (keyCode == 69 || keyCode == 190 || keyCode == 189);
		return !isNotWanted;
	},
	smoothScroll: function(a,b){
		$('body,html').animate({
			scrollTop : a
		}, b);
	},
	handlePaste: function(e) {
		var clipboardData, pastedData;
		// Get pasted data via clipboard API
		clipboardData = e.clipboardData || window.clipboardData;
		pastedData = clipboardData.getData('Text').toUpperCase();
		if(pastedData.indexOf('E')>-1) {
			//alert('found an E');
			e.stopPropagation();
			e.preventDefault();
		}
	},
	notiProduct: function(product){
		var image = '';
		if(product['image'] == null){ 
			image = 'https://hstatic.net/0/0/global/noDefaultImage6.gif';
		}
		else{
			image = Haravan.resizeImage(product['image'], 'small');
		}
		var $info = '<div class="row"><div class="col-md-12 col-12"><p class="jGowl-text">ÄÃ£ thÃªm vÃ o giá» hÃ ng thÃ nh cÃ´ng!</p></div><div class="col-md-4 col-4"><a href="' + product['url'] + '"><img width="70px" src="' + image + '" alt="' + product['title'] + '"/></a></div><div class="col-md-8 col-8"><div class="jGrowl-note"><a class="jGrowl-title" href="' + product['url'] + '">' + product['title'] +  '</a><ins>' + Haravan.formatMoney(product['price'], window.shop.moneyFormat).replace(/\,/g,'.') + '</ins></div></div></div>';
		var wait = setTimeout(function(){
			$.jGrowl($info,{
				life: 2000,		
			});	
		});
	},
	accountPopup: function(type){

		$('.modal .modal-header h4').html(txtPopup[type]);
		$('.modal .acc-content-box').addClass('d-none');
		$('.modal .acc-content-box#'+type).removeClass('d-none');
		$('.modal .modal-body .line span').html(txtSocialPopup[type]);
		$('.modal .form-btn-bottom').addClass('d-none');
		$('.modal .form-btn-bottom[data-box="'+type+'"]').removeClass('d-none');
		GVN.Helper.checkInput(type);

		$('#modal-account').modal();
	},	
	SwalWarning: function(title,content,icon,cancel,confirm,timeclose){
		Swal.fire({
			title: title,
			text: content,
			icon: icon,
			timer: timeclose != undefined ? timeclose : false,
			showCancelButton: cancel,
			showConfirmButton: confirm,
			confirmButtonText: 'Äá»“ng Ã½',
			cancelButtonText: 'KhÃ´ng',
		}).then((result) => {
			if (result.isConfirmed) {
				//Swal.fire('Saved!', '', 'success')
			} else if (result.isDenied) {
				//Swal.fire('Changes are not saved', '', 'info')
			}
		})
	},
	plusQuantity: function() {
		if ( jQuery('input[name="quantity"]').val() != undefined ) {
			var currentVal = parseInt(jQuery('input[name="quantity"]').val());
			if (!isNaN(currentVal)) {
				jQuery('input[name="quantity"]').val(currentVal + 1);
			} else {
				jQuery('input[name="quantity"]').val(1);
			}
		}
		else {
			console.log('error: Not see elemnt ' + jQuery('input[name="quantity"]').val());
		}
	},
	minusQuantity: function() {
		if (jQuery('input[name="quantity"]').val() != undefined ) {
			var currentVal = parseInt(jQuery('input[name="quantity"]').val());
			if (!isNaN(currentVal) && currentVal > 1) {
				jQuery('input[name="quantity"]').val(currentVal - 1);
			}
		}else {
			console.log('error: Not see elemnt ' + jQuery('input[name="quantity"]').val());
		}
	},	
	slickSlider: function(element, itemsOne, itemsTwo, itemsThree, options){
		if( $(element).length > 0 ){
			$(element).slick({
				slidesToShow: itemsOne,
				prevArrow: '<button type="button" class="slick-prev"><svg width="8" height="17" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 50 50" enable-background="new 0 0 50 50" xml:space="preserve"><metadata><?xpacket begin="&#65279;" id="W5M0MpCehiHzreSzNTczkc9d"?><x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 5.3-c011 66.145661, 2012/02/06-14:56:27"/><?xpacket end="w"?></metadata><g display="none"><rect x="1" y="1" display="inline" fill="#000000" width="48" height="48"/></g><g><g><polygon points="34.675,47.178 12.497,25 34.675,2.822 37.503,5.65 18.154,25 37.503,44.35   "/></g></g></svg></button>',
				nextArrow: '<button type="button" class="slick-next"><svg width="8" height="17" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve"><polygon points="6.379,20.908 7.546,22.075 17.621,12 7.546,1.925 6.379,3.092 15.287,12 "/></svg></button>',
				rows: options && options.rows ? options.rows: 1,
				centerMode: options && options.centerMode ? options.centerMode: false,
				focusOnSelect: options && options.focusOnSelect ? options.focusOnSelect: false,
				autoplay: options && options.autoplay ? options.autoplay: false,
				infinite: options && options.infinite ? options.infinite: false,
				autoplaySpeed: 4000,
				fade: options && options.fade ? options.fade: false,
				speed: 1000,
				arrows: true,
				dots: true,
				responsive: [
					{
						breakpoint: 991, 
						settings: {
							slidesToShow: itemsThree,
							arrows: false,
							dots: true
						}
					},
					{
						breakpoint: 1024,
						settings: {
							slidesToShow: itemsTwo,
						}
					},
					{
						breakpoint: 1200,
						settings: {
							slidesToShow: itemsOne,
						}
					}
				]
			});
		}
	},
	getCartSidebar: function(){
		var cart = null;
		jQuery.getJSON('/cart.js', function(cart, textStatus) {
			if(cart) {
				//$('.sidebar-cart-top h2 span').html('(' + cart.item_count + ')');
				/*
				if(cart.item_count == 0){				
					jQuery('#cart-view').html('<tr><td class="mini-cart__empty-state"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="512" height="512" x="0" y="0" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><linearGradient id="a" x1="165.429" x2="498.076" y1="-44.178" y2="453.582" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffe53b"></stop><stop offset="1" stop-color="#ff2525"></stop></linearGradient><linearGradient xlink:href="#a" id="b" x1="57.413" x2="390.059" y1="28.008" y2="525.768"></linearGradient><linearGradient xlink:href="#a" id="c" x1="85.808" x2="418.455" y1="9.032" y2="506.792"></linearGradient><linearGradient xlink:href="#a" id="d" x1="223.177" x2="555.823" y1="-82.77" y2="414.99"></linearGradient><linearGradient xlink:href="#a" id="e" x1="22.607" x2="355.254" y1="51.269" y2="549.028"></linearGradient><linearGradient xlink:href="#a" id="f" x1="16.636" x2="349.282" y1="55.259" y2="553.019"></linearGradient><linearGradient xlink:href="#a" id="g" x1="134.341" x2="466.987" y1="-23.402" y2="474.358"></linearGradient><linearGradient xlink:href="#a" id="h" x1="134.34" x2="466.987" y1="-23.401" y2="474.358"></linearGradient><linearGradient xlink:href="#a" id="i" x1="211.697" x2="544.344" y1="-75.098" y2="422.662"></linearGradient><linearGradient xlink:href="#a" id="j" x1="91.895" x2="424.542" y1="4.964" y2="502.724"></linearGradient><linearGradient xlink:href="#a" id="k" x1="211.642" x2="544.288" y1="-75.181" y2="422.579"></linearGradient><linearGradient xlink:href="#a" id="l" x1="131.598" x2="464.244" y1="-21.569" y2="476.191"></linearGradient><linearGradient xlink:href="#a" id="m" x1="177.387" x2="510.034" y1="-52.169" y2="445.591"></linearGradient><g data-name="39.Empty Cart"><path fill="url(#a)" d="M476.604 132.427h-72.58a6 6 0 0 0-5.634 3.935 64.027 64.027 0 0 1-120.212 0 6 6 0 0 0-5.634-3.935h-72.58a28.977 28.977 0 0 0-22.514 11.235 37.432 37.432 0 0 0-6.954 31.321l5.51 24.89a6 6 0 0 0 11.717-2.593l-5.511-24.892a25.337 25.337 0 0 1 4.596-21.215 16.831 16.831 0 0 1 13.157-6.746h68.515a76.029 76.029 0 0 0 139.608 0h68.516a16.832 16.832 0 0 1 13.117 6.687 25.333 25.333 0 0 1 4.686 21.097l-30.6 142.968c-2.107 9.831-9.428 16.697-17.803 16.697h-214.39c-8.302 0-15.606-6.792-17.762-16.516l-15.77-71.28a6 6 0 0 0-11.717 2.593l15.772 71.283c3.384 15.261 15.506 25.92 29.477 25.92h214.39c14.087 0 26.234-10.766 29.538-26.183l30.6-142.97a37.434 37.434 0 0 0-7.09-31.154c-5.81-7.186-13.782-11.142-22.448-11.142z" data-original="url(#a)"></path><path fill="url(#b)" d="M189.33 232.335a6 6 0 0 0 4.563-7.154l-1.99-9a6 6 0 1 0-11.717 2.591l1.99 9a5.992 5.992 0 0 0 7.155 4.563z" data-original="url(#b)"></path><path fill="url(#c)" d="M238.198 300.932h1.46a25.17 25.17 0 0 0 25.142-25.141V200.52a25.17 25.17 0 0 0-25.142-25.142h-1.46a25.17 25.17 0 0 0-25.14 25.142v75.27a25.17 25.17 0 0 0 25.14 25.142zm-13.14-100.412a13.156 13.156 0 0 1 13.14-13.142h1.46A13.157 13.157 0 0 1 252.8 200.52v75.27a13.157 13.157 0 0 1-13.142 13.142h-1.46a13.156 13.156 0 0 1-13.141-13.141z" data-original="url(#c)"></path><path fill="url(#d)" d="M438.377 300.932a25.17 25.17 0 0 0 25.142-25.141V200.52a25.17 25.17 0 0 0-25.142-25.142h-1.46a25.17 25.17 0 0 0-25.142 25.142v75.27a25.17 25.17 0 0 0 25.142 25.142zm-14.602-25.141V200.52a13.157 13.157 0 0 1 13.142-13.142h1.46a13.157 13.157 0 0 1 13.142 13.142v75.27a13.157 13.157 0 0 1-13.142 13.142h-1.46a13.157 13.157 0 0 1-13.142-13.141z" data-original="url(#d)"></path><path fill="url(#e)" d="M72.92 67.487H34.241A29.275 29.275 0 0 0 5 96.729v1.774a29.274 29.274 0 0 0 29.242 29.242h38.677a29.274 29.274 0 0 0 29.242-29.242V96.73a29.275 29.275 0 0 0-29.242-29.242zm17.24 31.016a17.26 17.26 0 0 1-17.24 17.242H34.241A17.26 17.26 0 0 1 17 98.503V96.73a17.261 17.261 0 0 1 17.242-17.242h38.677a17.261 17.261 0 0 1 17.242 17.242z" data-original="url(#e)"></path><path fill="url(#f)" d="M247.502 356.925a43.794 43.794 0 1 0 43.794 43.794 43.843 43.843 0 0 0-43.794-43.794zm0 75.588a31.794 31.794 0 1 1 31.794-31.794 31.83 31.83 0 0 1-31.794 31.794z" data-original="url(#f)" class=""></path><path fill="url(#f)" d="M247.502 375.851a24.868 24.868 0 1 0 24.869 24.868 24.897 24.897 0 0 0-24.869-24.868zm0 37.737a12.868 12.868 0 1 1 12.869-12.869 12.883 12.883 0 0 1-12.869 12.868z" data-original="url(#f)" class=""></path><path fill="url(#g)" d="M417.775 356.925a43.794 43.794 0 1 0 43.794 43.794 43.843 43.843 0 0 0-43.794-43.794zm0 75.588a31.794 31.794 0 1 1 31.794-31.794 31.83 31.83 0 0 1-31.794 31.794z" data-original="url(#g)"></path><path fill="url(#h)" d="M417.775 375.851a24.868 24.868 0 1 0 24.868 24.868 24.897 24.897 0 0 0-24.868-24.868zm0 37.737a12.868 12.868 0 1 1 12.868-12.869 12.883 12.883 0 0 1-12.868 12.868z" data-original="url(#h)"></path><path fill="url(#i)" d="M299.575 120.328H377a6 6 0 0 0 0-12h-77.426a6 6 0 0 0 0 12z" data-original="url(#i)"></path><path fill="url(#j)" d="M472.288 356.925H194.56L125.343 96.078a6 6 0 0 0-5.799-4.461h-23.38a6 6 0 0 0 0 12h18.765l69.217 260.849c.005.017.013.033.018.05a5.958 5.958 0 0 0 .306.858c.015.035.033.068.049.102a6 6 0 0 0 .44.788l.007.01a6.016 6.016 0 0 0 .54.68c.039.041.075.084.114.125a6.046 6.046 0 0 0 .614.556c.045.035.09.068.136.102a6.01 6.01 0 0 0 .724.469l.023.011a5.973 5.973 0 0 0 .783.343c.05.018.098.038.148.055a5.949 5.949 0 0 0 .82.209c.062.011.125.02.188.029a6.023 6.023 0 0 0 .847.07c.014 0 .028.004.042.004h198.739l.03-.002h83.575a6 6 0 0 0 0-12z" data-original="url(#j)" class=""></path><path fill="url(#k)" d="M338.288 190.328a76 76 0 1 0-76-76 76.086 76.086 0 0 0 76 76zm0-140a64 64 0 1 1-64 64 64.072 64.072 0 0 1 64-64z" data-original="url(#k)"></path><path fill="url(#l)" d="M305.899 175.379h-1.461a25.17 25.17 0 0 0-25.142 25.141v75.27a25.17 25.17 0 0 0 25.142 25.142h1.46a25.17 25.17 0 0 0 25.142-25.141V200.52a25.17 25.17 0 0 0-25.141-25.142zM319.04 275.79a13.156 13.156 0 0 1-13.14 13.141h-1.462a13.157 13.157 0 0 1-13.142-13.141V200.52a13.157 13.157 0 0 1 13.142-13.142h1.46a13.156 13.156 0 0 1 13.142 13.142z" data-original="url(#l)"></path><path fill="url(#m)" d="M372.138 175.379h-1.46a25.17 25.17 0 0 0-25.142 25.141v75.27a25.17 25.17 0 0 0 25.141 25.142h1.461a25.17 25.17 0 0 0 25.142-25.141V200.52a25.17 25.17 0 0 0-25.142-25.142zM385.28 275.79a13.157 13.157 0 0 1-13.142 13.141h-1.46a13.157 13.157 0 0 1-13.142-13.141V200.52a13.157 13.157 0 0 1 13.141-13.142h1.461a13.157 13.157 0 0 1 13.142 13.142z" data-original="url(#m)"></path></g></g></svg><p class="">Giá» hÃ ng cá»§a báº¡n Ä‘ang trá»‘ng,</p><p>Ä‘ang cÃ³ nhiá»u khuyáº¿n mÃ£i láº¯m, <a href="/">Mua ngay</a></p></td></tr>');
				}
				else{
					jQuery('#cart-view').html('');
				}

				var cartNewQty = {}; 
				// Get product for cart view
				jQuery.each(cart.items,function(i,item){
					var total_line = 0;
					var total_line = item.quantity * item.price;
					//clone item cart
					GVN.Helper.cloneItem(item,i);
					cartNewQty[item.variant_id] = item.quantity;
				});
				cartQty = cartNewQty;
				*/
				
				cartJS = cart;
				$('.count-holder .count').html(cart.item_count);
				
				/*
				if(window.shop_settings.freeship_promo.show){
					var setupPriceFS = window.shop_settings.freeship_promo.hanmuc *100;
					var needmore = setupPriceFS - cart.total_price; 
					var percentprice = Math.round((cart.total_price / setupPriceFS)*100);
					var html = '';
					if (needmore < 0) {
						$(".progress.progress-moved").removeAttr("data-percent");
						$('.progress-title').html('<p><strong>ÄÆ¡n hÃ ng cá»§a báº¡n Ä‘Ã£ Ä‘Æ°á»£c miá»…n phÃ­ váº­n chuyá»ƒn</strong></p>');
						$('.progress.progress-moved').html('<div class="progress-bar" style="width:100%;"></div><div class="progress-ic-moved" style="left:calc(100% - 30px);"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="512" height="512" x="0" y="0" viewBox="0 0 412.005 412.005" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path d="M0 283.525c0 4.224 2.96 7.539 7.184 7.539h11.47c7.707-17 25.254-29.864 45.628-29.864 20.375 0 37.918 12.864 45.629 29.864H259v-61H0v53.461z" fill="#ffffff" data-original="#000000" class=""></path><path d="M64.282 277.32c-18.673 0-33.81 15.137-33.81 33.81 0 18.673 15.137 33.81 33.81 33.81 18.664-.021 33.789-15.146 33.81-33.81 0-18.672-15.137-33.81-33.81-33.81zM407.6 205.217l-32.2-14.153H275v100h19.488c7.712-17 25.254-29.864 45.628-29.864s37.921 12.864 45.628 29.864h19.072c4.224 0 7.184-3.315 7.184-7.539v-71.034a7.774 7.774 0 0 0-4.4-7.274zM342.295 133.408a22.967 22.967 0 0 0-20.73-12.344H275v54h88.915l-21.62-41.656zM236.036 67.064H22.844C9.985 67.064 0 77.65 0 90.509v123.555h259V90.509l.001-.108c.103-12.785-10.179-23.234-22.965-23.337z" fill="#ffffff" data-original="#000000" class=""></path><path d="M340.114 277.32c-18.673.001-33.81 15.138-33.809 33.811.001 18.673 15.138 33.81 33.811 33.809 18.664-.021 33.788-15.146 33.809-33.81v-.001c-.001-18.672-15.138-33.809-33.811-33.809z" fill="#ffffff" data-original="#000000" class=""></path></g></svg></div>');
						$(".progress.progress-moved").attr("data-percent",'100%');
						$(".progress-ic-moved").css("left",'calc(100% - 30px)');
						$('.progress-box').addClass('freeship');
					}
					else {
						html +=  '<div>Báº¡n HÃ£y mua thÃªm <span class="progress-price">' + Haravan.formatMoney(needmore) + 'â‚«</span> Ä‘á»ƒ Ä‘Æ°á»£c</div><p><strong>Miá»…n phÃ­ váº­n chuyá»ƒn</strong></p> ';
						$(".progress.progress-moved").removeAttr("data-percent");
						$('.progress-title').html(html);
						$('.progress.progress-moved .progress-bar').css('width',percentprice + '%');
						$(".progress.progress-moved").attr("data-percent",percentprice + '%');
						$(".progress-ic-moved").css("left", 'calc(' + percentprice + '% - 10px)');
						$('.progress-box').removeClass('freeship');
					}
				}
				
				if(cart.items.length > 0){
					var prdIds = cart.items.map(x => {return x.product_id});
					var queryCart = "/search?q=filter=((id:product="+prdIds.join(')||(id:product=')+"))";
					
					$.ajax({
						type:'GET',
						async: false,
						url: queryCart+'&view=item-cart',
						success: function(search){
							window.proInCartJS = JSON.parse(search);
						}
					});
					//$('.count-holder .count').html( cart.item_count);
					//$('.sidebar-cart-top h2 span').html('(' + cart.item_count + ')');
					$('.sidebar-cart #cart-view').html('');
					$('.sidebar-cart #cart-view').append(GVN.Helper.checkItemMiniCart(cart));
					$('.sidebar-cart #total-view-cart').html(GVN.Helper.moneyFormat(cart.total_price/100, 'â‚«'));
				}
				else {
					$('.sidebar-cart #cart-view').html('<div class="mini-cart__empty-state"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="512" height="512" x="0" y="0" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><linearGradient id="a" x1="165.429" x2="498.076" y1="-44.178" y2="453.582" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffe53b"></stop><stop offset="1" stop-color="#ff2525"></stop></linearGradient><linearGradient xlink:href="#a" id="b" x1="57.413" x2="390.059" y1="28.008" y2="525.768"></linearGradient><linearGradient xlink:href="#a" id="c" x1="85.808" x2="418.455" y1="9.032" y2="506.792"></linearGradient><linearGradient xlink:href="#a" id="d" x1="223.177" x2="555.823" y1="-82.77" y2="414.99"></linearGradient><linearGradient xlink:href="#a" id="e" x1="22.607" x2="355.254" y1="51.269" y2="549.028"></linearGradient><linearGradient xlink:href="#a" id="f" x1="16.636" x2="349.282" y1="55.259" y2="553.019"></linearGradient><linearGradient xlink:href="#a" id="g" x1="134.341" x2="466.987" y1="-23.402" y2="474.358"></linearGradient><linearGradient xlink:href="#a" id="h" x1="134.34" x2="466.987" y1="-23.401" y2="474.358"></linearGradient><linearGradient xlink:href="#a" id="i" x1="211.697" x2="544.344" y1="-75.098" y2="422.662"></linearGradient><linearGradient xlink:href="#a" id="j" x1="91.895" x2="424.542" y1="4.964" y2="502.724"></linearGradient><linearGradient xlink:href="#a" id="k" x1="211.642" x2="544.288" y1="-75.181" y2="422.579"></linearGradient><linearGradient xlink:href="#a" id="l" x1="131.598" x2="464.244" y1="-21.569" y2="476.191"></linearGradient><linearGradient xlink:href="#a" id="m" x1="177.387" x2="510.034" y1="-52.169" y2="445.591"></linearGradient><g data-name="39.Empty Cart"><path fill="url(#a)" d="M476.604 132.427h-72.58a6 6 0 0 0-5.634 3.935 64.027 64.027 0 0 1-120.212 0 6 6 0 0 0-5.634-3.935h-72.58a28.977 28.977 0 0 0-22.514 11.235 37.432 37.432 0 0 0-6.954 31.321l5.51 24.89a6 6 0 0 0 11.717-2.593l-5.511-24.892a25.337 25.337 0 0 1 4.596-21.215 16.831 16.831 0 0 1 13.157-6.746h68.515a76.029 76.029 0 0 0 139.608 0h68.516a16.832 16.832 0 0 1 13.117 6.687 25.333 25.333 0 0 1 4.686 21.097l-30.6 142.968c-2.107 9.831-9.428 16.697-17.803 16.697h-214.39c-8.302 0-15.606-6.792-17.762-16.516l-15.77-71.28a6 6 0 0 0-11.717 2.593l15.772 71.283c3.384 15.261 15.506 25.92 29.477 25.92h214.39c14.087 0 26.234-10.766 29.538-26.183l30.6-142.97a37.434 37.434 0 0 0-7.09-31.154c-5.81-7.186-13.782-11.142-22.448-11.142z" data-original="url(#a)"></path><path fill="url(#b)" d="M189.33 232.335a6 6 0 0 0 4.563-7.154l-1.99-9a6 6 0 1 0-11.717 2.591l1.99 9a5.992 5.992 0 0 0 7.155 4.563z" data-original="url(#b)"></path><path fill="url(#c)" d="M238.198 300.932h1.46a25.17 25.17 0 0 0 25.142-25.141V200.52a25.17 25.17 0 0 0-25.142-25.142h-1.46a25.17 25.17 0 0 0-25.14 25.142v75.27a25.17 25.17 0 0 0 25.14 25.142zm-13.14-100.412a13.156 13.156 0 0 1 13.14-13.142h1.46A13.157 13.157 0 0 1 252.8 200.52v75.27a13.157 13.157 0 0 1-13.142 13.142h-1.46a13.156 13.156 0 0 1-13.141-13.141z" data-original="url(#c)"></path><path fill="url(#d)" d="M438.377 300.932a25.17 25.17 0 0 0 25.142-25.141V200.52a25.17 25.17 0 0 0-25.142-25.142h-1.46a25.17 25.17 0 0 0-25.142 25.142v75.27a25.17 25.17 0 0 0 25.142 25.142zm-14.602-25.141V200.52a13.157 13.157 0 0 1 13.142-13.142h1.46a13.157 13.157 0 0 1 13.142 13.142v75.27a13.157 13.157 0 0 1-13.142 13.142h-1.46a13.157 13.157 0 0 1-13.142-13.141z" data-original="url(#d)"></path><path fill="url(#e)" d="M72.92 67.487H34.241A29.275 29.275 0 0 0 5 96.729v1.774a29.274 29.274 0 0 0 29.242 29.242h38.677a29.274 29.274 0 0 0 29.242-29.242V96.73a29.275 29.275 0 0 0-29.242-29.242zm17.24 31.016a17.26 17.26 0 0 1-17.24 17.242H34.241A17.26 17.26 0 0 1 17 98.503V96.73a17.261 17.261 0 0 1 17.242-17.242h38.677a17.261 17.261 0 0 1 17.242 17.242z" data-original="url(#e)"></path><path fill="url(#f)" d="M247.502 356.925a43.794 43.794 0 1 0 43.794 43.794 43.843 43.843 0 0 0-43.794-43.794zm0 75.588a31.794 31.794 0 1 1 31.794-31.794 31.83 31.83 0 0 1-31.794 31.794z" data-original="url(#f)" class=""></path><path fill="url(#f)" d="M247.502 375.851a24.868 24.868 0 1 0 24.869 24.868 24.897 24.897 0 0 0-24.869-24.868zm0 37.737a12.868 12.868 0 1 1 12.869-12.869 12.883 12.883 0 0 1-12.869 12.868z" data-original="url(#f)" class=""></path><path fill="url(#g)" d="M417.775 356.925a43.794 43.794 0 1 0 43.794 43.794 43.843 43.843 0 0 0-43.794-43.794zm0 75.588a31.794 31.794 0 1 1 31.794-31.794 31.83 31.83 0 0 1-31.794 31.794z" data-original="url(#g)"></path><path fill="url(#h)" d="M417.775 375.851a24.868 24.868 0 1 0 24.868 24.868 24.897 24.897 0 0 0-24.868-24.868zm0 37.737a12.868 12.868 0 1 1 12.868-12.869 12.883 12.883 0 0 1-12.868 12.868z" data-original="url(#h)"></path><path fill="url(#i)" d="M299.575 120.328H377a6 6 0 0 0 0-12h-77.426a6 6 0 0 0 0 12z" data-original="url(#i)"></path><path fill="url(#j)" d="M472.288 356.925H194.56L125.343 96.078a6 6 0 0 0-5.799-4.461h-23.38a6 6 0 0 0 0 12h18.765l69.217 260.849c.005.017.013.033.018.05a5.958 5.958 0 0 0 .306.858c.015.035.033.068.049.102a6 6 0 0 0 .44.788l.007.01a6.016 6.016 0 0 0 .54.68c.039.041.075.084.114.125a6.046 6.046 0 0 0 .614.556c.045.035.09.068.136.102a6.01 6.01 0 0 0 .724.469l.023.011a5.973 5.973 0 0 0 .783.343c.05.018.098.038.148.055a5.949 5.949 0 0 0 .82.209c.062.011.125.02.188.029a6.023 6.023 0 0 0 .847.07c.014 0 .028.004.042.004h198.739l.03-.002h83.575a6 6 0 0 0 0-12z" data-original="url(#j)" class=""></path><path fill="url(#k)" d="M338.288 190.328a76 76 0 1 0-76-76 76.086 76.086 0 0 0 76 76zm0-140a64 64 0 1 1-64 64 64.072 64.072 0 0 1 64-64z" data-original="url(#k)"></path><path fill="url(#l)" d="M305.899 175.379h-1.461a25.17 25.17 0 0 0-25.142 25.141v75.27a25.17 25.17 0 0 0 25.142 25.142h1.46a25.17 25.17 0 0 0 25.142-25.141V200.52a25.17 25.17 0 0 0-25.141-25.142zM319.04 275.79a13.156 13.156 0 0 1-13.14 13.141h-1.462a13.157 13.157 0 0 1-13.142-13.141V200.52a13.157 13.157 0 0 1 13.142-13.142h1.46a13.156 13.156 0 0 1 13.142 13.142z" data-original="url(#l)"></path><path fill="url(#m)" d="M372.138 175.379h-1.46a25.17 25.17 0 0 0-25.142 25.141v75.27a25.17 25.17 0 0 0 25.141 25.142h1.461a25.17 25.17 0 0 0 25.142-25.141V200.52a25.17 25.17 0 0 0-25.142-25.142zM385.28 275.79a13.157 13.157 0 0 1-13.142 13.141h-1.46a13.157 13.157 0 0 1-13.142-13.141V200.52a13.157 13.157 0 0 1 13.141-13.142h1.461a13.157 13.157 0 0 1 13.142 13.142z" data-original="url(#m)"></path></g></g></svg><p class="">Giá» hÃ ng cá»§a báº¡n Ä‘ang trá»‘ng,</p><p>Ä‘ang cÃ³ nhiá»u khuyáº¿n mÃ£i láº¯m, <a href="/">Mua ngay</a></p></div>');
				}				
				$('.sidebar-cart #total-view-cart').html(GVN.Helper.moneyFormat(cart.total_price/100, 'â‚«'));
				*/
			}
		});
	},
	renderItemMiniCart: function(resultItem,type,line) {
		var itemOjProperties = {}
		var htmlLine = '';

		htmlLine +=	'<div class="item line-item '+((type == 'giftApp') ? 'line-gift' : '' )+'" data-line="'+(line+1)+'" data-variant-id="'+resultItem.variant_id+'" data-pro-id="'+resultItem.product_id+'">';
		htmlLine +=		'<div class="left">';
		htmlLine +=			'<div class="item-img">';
		htmlLine +=				'<a href="'+resultItem.url+'">';
		if ( resultItem.image == null ) {
			htmlLine +=					'<img src="//theme.hstatic.net/200000636033/1001033735/14/no-image.jpg" alt="'+resultItem.title+'" />';
		}
		else {
			htmlLine +=					'<img src="'+resultItem.image+'" alt="'+resultItem.title+'" />';
		}
		htmlLine +=				'</a>';
		htmlLine +=			'</div>';
		if (!(type == 'comboApp' || type == 'bxsyApp' || type == 'giftOmni' || type == 'giftApp')) {
			if (resultItem.price > 0){
				htmlLine +=	'<div class="item-remove">';
				htmlLine += 		'<a href="javascript:void(0);" onclick="GVN.Helper.deleteItemMiniCartSingle(' + (line+1) + ')" >';
				htmlLine +=				'<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.883309 11.9998C0.99933 12.0001 1.11426 11.9774 1.22146 11.933C1.32866 11.8886 1.426 11.8235 1.50786 11.7412L6.00003 7.24907L10.4922 11.7412C10.5742 11.8233 10.6716 11.8883 10.7787 11.9327C10.8859 11.9771 11.0008 11.9999 11.1168 11.9999C11.2327 11.9999 11.3476 11.9771 11.4548 11.9327C11.5619 11.8883 11.6593 11.8233 11.7413 11.7412C11.8233 11.6592 11.8884 11.5619 11.9328 11.4547C11.9772 11.3475 12 11.2327 12 11.1167C12 11.0007 11.9772 10.8858 11.9328 10.7787C11.8884 10.6715 11.8233 10.5742 11.7413 10.4921L7.24913 5.99997L11.7413 1.5078C11.8233 1.42578 11.8884 1.32841 11.9328 1.22125C11.9772 1.11409 12 0.999237 12 0.883247C12 0.767258 11.9772 0.652404 11.9328 0.545243C11.8884 0.438083 11.8233 0.340714 11.7413 0.258697C11.6593 0.17668 11.5619 0.11162 11.4548 0.0672326C11.3476 0.0228453 11.2327 0 11.1168 0C11.0008 0 10.8859 0.0228453 10.7787 0.0672326C10.6716 0.11162 10.5742 0.17668 10.4922 0.258697L6.00003 4.75087L1.50786 0.258697C1.34222 0.0930559 1.11756 0 0.883309 0C0.649057 0 0.424399 0.0930559 0.258758 0.258697C0.0931175 0.424338 6.15255e-05 0.648996 6.15255e-05 0.883247C6.15255e-05 1.1175 0.0931175 1.34216 0.258758 1.5078L4.75093 5.99997L0.258758 10.4921C0.135213 10.6156 0.0510723 10.773 0.0169805 10.9444C-0.0171113 11.1157 0.000376611 11.2933 0.0672335 11.4547C0.13409 11.6161 0.247312 11.754 0.392576 11.851C0.537839 11.9481 0.708618 11.9998 0.883309 11.9998Z" fill="#878787"></path></svg>';
				htmlLine +=			'</a>';
				htmlLine +=	'</div>';	
			}
		}
		htmlLine +=		'</div>';

		htmlLine +=		'<div class="right">';
		htmlLine +=			'<div class="item-info">';
		htmlLine +=				'<a href="'+resultItem.url+'">';
		htmlLine +=					'<h3>'+resultItem.title+'</h3>';
		if(resultItem.variant_options[0] != 'Default Title') {
			htmlLine +=					'<div class="item-desc"><span class="variant_title">'+resultItem.variant_options.join(' / ')+'</span></div>';
		}
		htmlLine +=				'</a>';
		if (!$.isEmptyObject(GVN.Helper.dataMinicartGiftPE)) {
			$.each(GVN.Helper.dataMinicartGiftPE, function(keyGiftPE,htmlGiftFE){
				if(resultItem.properties.hasOwnProperty('PE-gift-item-buy ' + keyGiftPE)) {
					htmlLine += htmlGiftFE;
				}
			})
		}
		
		htmlLine +=			'</div>';

		htmlLine +=			'<div class="item-meta">';
		if (type == 'comboApp' ){
			if (resultItem.price > 0){
				if(resultItem.price_original > resultItem.price) {
					htmlLine +=			'<div class="item-price"><span>'+ GVN.Helper.moneyFormat(resultItem.price/100,'â‚«')+'</span>';
					htmlLine +=			'<del>'+ GVN.Helper.moneyFormat(resultItem.price_original/100,'â‚«')+'</del></div>';
				}
				else {
					htmlLine +=			'<div class="item-price"><span>'+ GVN.Helper.moneyFormat(resultItem.price/100,'â‚«')+'</span></div>';
				}
				htmlLine +=			'<div class="item-total-price d-none">';
				htmlLine +=					'<span>'+GVN.Helper.moneyFormat(resultItem.line_price/100,'â‚«')+'</span>';
				htmlLine +=			'</div>';
			}
			else {
				htmlLine +=			'<div class="item-price"></div>';
				htmlLine +=			'<div class="item-total-price d-none"><span>QuÃ  táº·ng</span></div>';															
			}
		}
		else if (type == 'giftApp' || type == 'giftOmni') {
			htmlLine +=			'<div class="item-price"></div>';
			htmlLine +=			'<div class="item-total-price d-none"><span>QuÃ  táº·ng</span></div>';															
		}
		else {
			if (resultItem.price > 0){
				if(resultItem.price_original > resultItem.price) {
					htmlLine +=			'<div class="item-price"><del>'+GVN.Helper.moneyFormat(resultItem.price_original/100,'â‚«')+'</del></div>';
				}
				else {
					var checkVr = proInCartJS[resultItem.product_id].variants[resultItem.variant_id];
					if (checkVr != undefined){
						htmlLine +=			'<div class="item-price">';
						htmlLine +=				'<span>'+GVN.Helper.moneyFormat(resultItem.price/100,'â‚«')+'</span>';
						if (checkVr.compare_price > resultItem.price) {
							htmlLine +=			'<del>'+GVN.Helper.moneyFormat(checkVr.compare_price/100,'â‚«')+'</del>';
						}
						htmlLine +=			'</div>';
					}
				}

				htmlLine +=			'<div class="item-total-price d-none">';
				htmlLine +=					'<span>'+GVN.Helper.moneyFormat(resultItem.line_price/100,'â‚«')+'</span>';
				htmlLine +=			'</div>';

			}
			else {
				htmlLine +=			'<div class="item-price"></div>';
				htmlLine +=			'<div class="item-total-price d-none"><span>QuÃ  táº·ng</span></div>';															
			}
		}
		if (!(type == 'comboApp' || type == 'bxsyApp' || type == 'giftOmni' || type == 'giftApp')) {
			if (resultItem.price > 0){
				htmlLine +=			'<div class="item-quan">';
				htmlLine +=				'<span class="txt-qty d-none">'+resultItem.quantity+'</span>';
				htmlLine +=				'<div class="qty quantity-partent qty-click-mini">';
				if(resultItem.quantity > 1){
					htmlLine +=					'<button type="button" class="qtyminus-mini qty-btn">';
					htmlLine += 					'<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.3332 8H7.99984H2.6665" stroke="#111111" stroke-width="2" stroke-linecap="round"/></svg>';
					htmlLine +=					'</button>';
				}
				else {
					htmlLine +=					'<button type="button" class="qtyminus-mini qty-btn disabled" disabled>';
					htmlLine += 					'<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.3332 8H7.99984H2.6665" stroke="#cfcfcf" stroke-width="2" stroke-linecap="round"/></svg>';
					htmlLine +=					'</button>';
				}
				htmlLine +=					'<input readonly data-vid="'+resultItem.variant_id+'" data-quantity="'+resultItem.quantity+'" data-product="'+resultItem.product_id+'" type="text" size="4" name="updates[]" min="1" id="updates_'+resultItem.variant_id+'" data-price="'+resultItem.price+'" value="'+resultItem.quantity+'" class="tc line-item-qty item-quantity-mini">';
				htmlLine +=					'<button type="button" class="qtyplus-mini qty-btn"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.00033 13.3334V8.00008M8.00033 8.00008V2.66675M8.00033 8.00008H13.3337M8.00033 8.00008H2.66699" stroke="#111111" stroke-width="2" stroke-linecap="round"/></svg></button>';
				htmlLine +=				'</div>';
				htmlLine +=			'</div>';

			}
			else {
				htmlLine +=				'<div class="item-quan d-none">';
				htmlLine +=					'<span>'+resultItem.quantity+'</span>';
				htmlLine +=				'</div>';
			}
		}
		htmlLine +=			'</div>';
		htmlLine +=		'</div>';
		htmlLine +=	'</div>';

		return htmlLine;
	},
	renderItemGiftPEMiniCart: function(resultItem,line) {
		var itemOjProperties = {}
		var htmlLine = '';
		htmlLine +=	'<div class="line-gift" data-line="'+(line+1)+'" data-variant-id="'+resultItem.variant_id+'" data-pro-id="'+resultItem.product_id+'">';
		htmlLine +=			'<div class="gift-info">Táº·ng: ';
		htmlLine +=				' <a href="'+resultItem.url+'">'+resultItem.title+'</a>';
		htmlLine +=				'<span> Trá»‹ giÃ¡: ';

		var checkVr = proInCartJS[resultItem.product_id].variants[resultItem.variant_id];
		if (checkVr != undefined){
			if (checkVr.compare_price > resultItem.price) {
				htmlLine +=			GVN.Helper.moneyFormat(checkVr.compare_price/100,'â‚«');
			}
            else {
                htmlLine +=			GVN.Helper.moneyFormat(resultItem.price_original/100,'â‚«')
            }
		}

		htmlLine += 			'</span>';
		htmlLine +=			'</div>';
		htmlLine +=	'</div>';
		return htmlLine;
	},
	checkItemMiniCart: function(cart) {
		var itemOjProperties = {}
		var countPromo = 0;
		var typePromo = '';

		var Combos = []; //mÃ£ combo
		var titleCombos = []; //tÃªn combo
		var lineCombo = [];

		var Gift = []; //mÃ£ gift
		var titleGift = []; //tÃªn program gift
		var lineGift = [];

		var checkItemGiftOmni = false;
		var checkItemGift = false;
		var checkItemCombo = false;

		for(var i = 0; i < cart.items.length; i++) {
			var item = cart.items[i];
			itemOjProperties = item.properties;
			for (const property in itemOjProperties){
				if (property.indexOf('PE-combo-item') > -1){
					checkItemCombo = true;
					// PE-combo-item: "ma-combo | tÃªn combo"
					var temp1 = itemOjProperties[property].split('|')[0].trim();
					var titleTemp1 = itemOjProperties[property].split('|')[1].trim();
					if(Combos.includes(temp1)) {
						var indexExist = Combos.indexOf(temp1);
						lineCombo[indexExist].push(i);
						continue;
					}
					else {
						Combos.push(temp1);
						titleCombos.push(titleTemp1);
						var temp11 = [];
						temp11.push(i);
						lineCombo.push(temp11);
					}
				}
				else if(property.indexOf('PE-gift-item ') > -1) {
					checkItemGift = true;
					//PE-gift-item-buy magift: "tÃªn sáº£n pháº©m"
					//PE-gift-item magift: "tÃªn sáº£n pháº©m"
					var temp3 = itemOjProperties[property];
					var titleTemp3 = temp3;
					var codeTemp3 = property.split(' ')[1].trim();
					if(Gift.includes(codeTemp3)) {
						var indexExist = Gift.indexOf(codeTemp3);
						lineGift[indexExist].push(i);
						continue;
					}
					else {
						Gift.push(codeTemp3);
						titleGift.push(titleTemp3);
						var temp33 = [];
						temp33.push(i);
						lineGift.push(temp33);
					}
				}
				else if(property.indexOf('Khuyáº¿n mÃ£i') > -1) {
					checkItemGiftOmni = true;
				}		
			}
		}

		//Khuyáº¿n mÃ£i
		if(Gift.length > 0) {
			for(var i = 0; i < Gift.length; i++) {
				var gf = Gift[i];
				var itemInGift = cart.items.filter((x,index) => x.properties.hasOwnProperty('PE-gift-item ' + gf) && x.properties['PE-gift-item ' + gf].indexOf(titleGift[i]) > -1);
				if (itemInGift.length > 0) {
					var htmlGiftApp = '<div class="gifts-list"><h4>QuÃ  táº·ng khuyáº¿n mÃ£i</h4>';
					for(var j = 0; j < itemInGift.length; j++) {
						countPromo = countPromo + itemInGift[j].quantity;
						htmlGiftApp += GVN.Helper.renderItemGiftPEMiniCart(itemInGift[j],lineGift[i][j]);
					}
					htmlGiftApp += '</div>';	
					GVN.Helper.dataMinicartGiftPE[gf] = htmlGiftApp;
				}
			}
		}
		//Combo
		if(Combos.length > 0) {
			for(var i = 0; i < Combos.length; i++) {
				var cmb = Combos[i];
				var html = 	'<div class="cart-group combo">';
				html += 			'<div class="quantity-combo-mini d-flex align-items-center">';
				html +=  				'<h4>Æ¯u Ä‘Ã£i:' + titleCombos[i] + '</h4>';
				html += 				'<div class="label-quantity-combo-mini"> <span>Sá»‘ lÆ°á»£ng: x '+ cart.attributes['PE-combo-detail '+Combos[i]]+'</span></div>'
				html += 				'<div class="update-quantity-mini d-flex align-items-center">';
				html +=						'<button type="button" class="qtyminus-new-mini qty-btn-new">-</button>';
				html +=	    			'<input type="text" value="'+ cart.attributes['PE-combo-detail '+Combos[i]]+'" class="update-combo-item-mini" data-item="" data-combo="'+Combos[i].replace('~','')+'" data-max="" data-quantity="'+ cart.attributes['PE-combo-detail '+Combos[i]]+'" />';
				html +=						'<button type="button" class="qtyplus-new-mini qty-btn-new">+</button>';
				html +=   			'</div>';
				html += 			'<div class="remove-combo-mini" data-combo="'+Combos[i]+'">XÃ³a</div>';
				html +=  		'</div>';
				
				var itemInCombo = cart.items.filter((x,index) => x.properties.hasOwnProperty('PE-combo-item') && x.properties['PE-combo-item'].indexOf(cmb) > -1);
				if (itemInCombo.length > 0) {
					for(var j = 0; j < itemInCombo.length; j++) {
						countPromo = countPromo + itemInCombo[j].quantity;
						html += GVN.Helper.renderItemMiniCart(itemInCombo[j],'comboApp',lineCombo[i][j]);
					}
				}
				html += '</div>';

				$('.sidebar-cart #cart-view').append(html);
			}
		}
		
		var promoGroup  = lineCombo.join(',').split(',');
		var promoGift   = lineGift.join(',').split(',');
		var promoSingle = lineGift.join(',').split(',');

		if(cart.item_count > countPromo) {
			var htmlHead = '';
			var parent = null;
			if (countPromo >= 0) {
				htmlHead += '<div class="cart-group single"></div>';
				$('.sidebar-cart #cart-view').append(htmlHead);
			} 
			else {
				parent = $('.sidebar-cart #cart-view');
			}
			for(var i = 0; i < cart.items.length; i++) {
				if (!promoGroup.includes(i+"") && !promoGift.includes(i+"") ) {
					var item = cart.items[i];
					var htmlNormal =	GVN.Helper.renderItemMiniCart(item,'',i,);
					$('.sidebar-cart #cart-view .cart-group.single').append(htmlNormal);
				}
			}
		}
	},
	UpdateChangeQtyMiniCart: function(comboCode,newQty,beforeQty,line) {
		var arrayUpdate = [];
		var comboItem = false;
		var listCart = document.querySelectorAll('[id^="updates_"]');
		if(window.cartJS.items[line].properties.hasOwnProperty('PE-combo-item')){
			comboItem = true;
			$.each(window.cartJS.items,function(i,v){
				if(v.properties.hasOwnProperty('PE-combo-item') && v.properties['PE-combo-item'].indexOf(comboCode) > -1){
					if(line == i){
						arrayUpdate.push(newQty);
					}
					else{
						arrayUpdate.push(v.quantity / beforeQty * newQty);
					}
				}
				else{
					arrayUpdate.push(v.quantity);
				}
			});		
		}
		else{
			$.each(window.cartJS.items,function(i,v){
				if(i == line){
					arrayUpdate.push(newQty);
				}
				else{
					arrayUpdate.push(v.quantity);
				}
			});
		}
		arrayUpdate = 'updates[]='+arrayUpdate.join('&updates[]=');
		var params = {
			type: 'POST',
			url: '/cart/update.js',
			data: arrayUpdate,
			dataType: 'json',
			success: function(data) { 
				window.cartJS = data;
				GVN.Helper.getCartSidebar();
				$('.cart-view-style').removeClass('js-loading');
			},
			error: function(XMLHttpRequest, textStatus) {
				Haravan.onError(XMLHttpRequest, textStatus);
			}
		};
		jQuery.ajax(params);
	},
	changeQtyItemMiniCart: function() {
		//SP láº»
		$(document).on('click','.qty-click-mini .qtyplus-mini',function(e){
			e.preventDefault();
			var input = $(this).parent('.quantity-partent').find('input');
			var currentVal = parseInt(input.val());
			if (!isNaN(currentVal)) {
				input.val(currentVal + 1);
			} else {
				input.val(1);
			}
		});
		$(document).on('click',".qty-click-mini .qtyminus-mini",function(e) {
			e.preventDefault();
			var input = $(this).parent('.quantity-partent').find('input');
			var currentVal = parseInt(input.val());
			if (!isNaN(currentVal) && currentVal > 1) {
				input.val(currentVal - 1);
			} else {
				input.val(1);
			}
		});
		$(document).on('click','.qty-click-mini button[class*="qty"]',GVN.Helper.delayTime(function(e){
			var beforeQty = parseInt($(this).parents('.item-quan').find('.txt-qty').html()),
					qtyChange = parseInt($(this).siblings('input').val());
			var line = parseInt($(this).parents('.line-item').attr('data-line')) - 1;
			$('.cart-view-style').addClass('js-loading');
			GVN.Helper.UpdateChangeQtyMiniCart(null,qtyChange,beforeQty,line);
		},500));
		//SP Combo
		$(document).on('click','.qtyplus-new-mini',function(e){
			e.preventDefault();
			$('.cart-view-style').addClass('js-loading');
			var input = $(this).parent('.update-quantity-mini').find('input');
			var currentVal = parseInt(input.val());
			if (!isNaN(currentVal)) {
				var qtyChange = currentVal + 1;
				input.val(qtyChange)
			} 
			else {
				var qtyChange = 1;
				input.val(qtyChange);
			}
			input.trigger('change');
		});
		$(document).on('click','.qtyminus-new-mini',function(e) {
			e.preventDefault();
			$('.cart-view-style').addClass('js-loading');
			var input = $(this).parent('.update-quantity-mini').find('input');
			var currentVal = parseInt(input.val());
			if (!isNaN(currentVal) && currentVal > 1) {
				var qtyChange = currentVal - 1;
				input.val(qtyChange);
			} 
			else {
				var qtyChange = 1;
				input.val(1);
			}
			input.trigger('change');
		});
		$(document).on('change','.update-combo-item-mini',function(e) {
			e.preventDefault();
			var current_quantity = parseInt($(this).val());
			var data_combo = $(this).attr('data-combo');
			var id = window.shop_app.productKeyCombo;
			var properties = {};
			var code = {};
			code[data_combo] = current_quantity;
			properties['PE-combo-set'] = JSON.stringify(code);
			var data_add = {id:id, quantity: 1};
			if(!$.isEmptyObject(properties)){
				data_add['properties'] = properties;
			}
			var param = {
				url: '/cart/add.js',
				type: 'POST',
				data: data_add,
				dataType: 'JSON',
				async: false,
				success: function(data){
					GVN.Helper.getCartSidebar();
					$('.cart-view-style').removeClass('js-loading');
				},
				error: function(x,y){
					if(x.status == 200 && x.responseText == ""){
						location.reload();
					}
					else{
						alert(JSON.parse(x.responseText).description);
						$('body').removeClass('loading');
					}
				}
			}
			$.ajax(param);
		});
	},
	deleteItemMiniCartSingle: function(line){
		var params = {
			type: 'POST',
			url: '/cart/change.js',
			data: 'quantity=0&line=' + line,
			dataType: 'json',
			success: function(cart) {
				GVN.Helper.getCartSidebar();
			},
			error: function(XMLHttpRequest, textStatus) {
				Haravan.onError(XMLHttpRequest, textStatus);
			}
		};
		jQuery.ajax(params);
	},
	deleteItemMiniCartCombo: function(){
		$(document).on('click','.remove-combo-mini',function(e) {
			e.preventDefault();
			$('.cart-view-style').addClass('js-loading');
			var current_quantity = 0;
			var data_combo = $(this).attr('data-combo');
			var id = window.shop_app.productKeyCombo;
			var properties = {};
			var code = {};
			code[data_combo] = current_quantity;
			properties['PE-combo-set'] = JSON.stringify(code);
			var data_add = {id:id,quantity:1};
			if(!$.isEmptyObject(properties)){
				data_add['properties'] = properties;
			}
			var param = {
				url: '/cart/add.js',
				type: 'POST',
				data: data_add,
				dataType: 'JSON',
				async: false,
				success: function(data){
					GVN.Helper.getCartSidebar();
					$('.cart-view-style').removeClass('js-loading');
				},
				error: function(x,y){
					if(x.status == 200 && x.responseText == ""){
						location.reload();
					}
				}
			}
			$.ajax(param);
		});	
	},
	addCartSupport: function(variant_id,quantity,buy_at,callback) {
		var params = {
			quantity:quantity,
			id:variant_id
		}
		jQuery.ajax({
			type: 'POST',
			url: '/cart/add.js',
			data: params,
			async: false,
			dataType: 'json',
			success: function(cart) {
				callback();
			},
			error: function(XMLHttpRequest, textStatus) {
				/*Haravan.onError(XMLHttpRequest, textStatus);*/
				/*alert('Sáº£n pháº©m báº¡n vá»«a mua Ä‘Ã£ vÆ°á»£t quÃ¡ tá»“n kho');*/
			}
		});
	},
	viewedProduct: function(){
		if(document.cookie.indexOf('last_viewed_products') !== -1){
			var last_viewd_pro_array = Cookies.getJSON('last_viewed_products');
			var recentview_promises = [];
			for(var i = 0; i < 8; i++){
				if(typeof last_viewd_pro_array[i] == 'string'){
					var promise = new Promise(function(resolve, reject) {
						$.ajax({
							url:'/products/' + last_viewd_pro_array[i] + '?view=viewed',
							success: function(product){
								resolve(product);
							},
							error: function(err){
								resolve('');
							}
						})
					});
					recentview_promises.push(promise);
				}
			}
			Promise.all(recentview_promises).then(function(values) {
				var viewed_items = [];
				$.each(values, function(i, v){
					if(v != ''){
						v = v.replace('viewed-loop-','viewed-loop-'+(i+1));
						/*if($('.slide-viewed-products').length > 0 ){
								$('.slide-viewed-products').append(v);
							}
							else {
								$('.list-productViewed').hide();
							}*/
						if(window.shop.template === 'customers[account].viewed' || window.shop.template === 'customers[account]'){
							if($('.viewedlist-account').length > 0 ){
								$('.viewedlist-account .data-account__empty').remove();
								$('.viewedlist-account').append(v);
							}
							else {
								$('.viewedlist-account').html('<div class="data-account__empty"><div class="icon-empty"><svg width="132" height="170" viewBox="0 0 132 170" fill="none" xmlns="http://www.w3.org/2000/svg"><g fill="white" ><path d="M125.486 120.371H113.585V91.6562H132V113.845C132 117.451 129.086 120.371 125.486 120.371Z" fill="#A1AAAF"></path><path d="M99.3294 167.226C95.6392 170.922 89.6482 170.922 85.949 167.226L50.2828 131.497C46.5926 127.801 46.5926 121.799 50.2828 118.094C53.973 114.397 59.964 114.397 63.6633 118.094L99.3294 153.822C103.029 157.528 103.029 163.529 99.3294 167.226Z" fill="#E1E4E6"></path><path d="M128.553 117.208C126.649 117.208 125.107 115.662 125.107 113.755V91.9459C125.107 91.8465 125.125 91.7561 125.134 91.6567H125.107V6.06465C125.107 2.72051 122.4 0 119.052 0H42.7036C39.3652 0 36.6494 2.71147 36.6494 6.06465V114.315C36.6494 117.66 39.3562 120.38 42.7036 120.38H113.585H125.107H125.486C129.086 120.38 132 117.461 132 113.855V113.764C132 115.662 130.457 117.208 128.553 117.208Z" fill="#E1E4E6"></path><path d="M40.1233 148.932C62.2828 148.932 80.2466 130.937 80.2466 108.739C80.2466 86.5409 62.2828 68.5459 40.1233 68.5459C17.9638 68.5459 0 86.5409 0 108.739C0 130.937 17.9638 148.932 40.1233 148.932Z" fill="#CBD1D6"></path><path d="M40.1235 136.577C55.4712 136.577 67.9129 124.113 67.9129 108.739C67.9129 93.3647 55.4712 80.9014 40.1235 80.9014C24.7758 80.9014 12.334 93.3647 12.334 108.739C12.334 124.113 24.7758 136.577 40.1235 136.577Z" fill="white"></path><path d="M51.6001 97.2418C52.9084 98.5524 52.9084 100.676 51.6001 101.987L33.3836 120.226C32.0753 121.537 29.955 121.537 28.6467 120.226C27.3385 118.916 27.3385 116.792 28.6467 115.481L46.8633 97.2328C48.1715 95.9313 50.2918 95.9313 51.6001 97.2418Z" fill="#F56F65"></path><path d="M51.6001 120.226C50.2918 121.537 48.1715 121.537 46.8633 120.226L28.6467 101.978C27.3385 100.667 27.3385 98.5435 28.6467 97.2329C29.955 95.9224 32.0753 95.9224 33.3836 97.2329L51.6001 115.481C52.9084 116.792 52.9084 118.925 51.6001 120.226Z" fill="#F56F65"></path><path d="M55.9488 25.7136C59.7112 25.7136 63.3112 22.4056 63.1398 18.5101C62.9684 14.6056 59.9819 11.3066 55.9488 11.3066C52.1864 11.3066 48.5864 14.6146 48.7578 18.5101C48.9293 22.4146 51.9157 25.7136 55.9488 25.7136Z" fill="white"></path><path d="M80.1925 25.7136C83.9549 25.7136 87.5549 22.4056 87.3834 18.5101C87.212 14.6056 84.2255 11.3066 80.1925 11.3066C76.4301 11.3066 72.8301 14.6146 73.0015 18.5101C73.1819 22.4146 76.1684 25.7136 80.1925 25.7136Z" fill="white"></path><path d="M104.445 25.7136C108.207 25.7136 111.807 22.4056 111.636 18.5101C111.464 14.6056 108.478 11.3066 104.445 11.3066C100.683 11.3066 97.0825 14.6146 97.2539 18.5101C97.4344 22.4146 100.421 25.7136 104.445 25.7136Z" fill="white"></path><path d="M108.28 44.9557H51.1307C49.678 44.9557 48.4961 43.7717 48.4961 42.3165V40.8071C48.4961 39.352 49.678 38.168 51.1307 38.168H108.28C109.732 38.168 110.914 39.352 110.914 40.8071V42.3165C110.914 43.7717 109.732 44.9557 108.28 44.9557Z" fill="white"></path><path d="M108.343 61.6042H51.0585C49.642 61.6042 48.4961 60.4563 48.4961 59.0373V57.7358C48.4961 56.3168 49.642 55.1689 51.0585 55.1689H108.343C109.759 55.1689 110.905 56.3168 110.905 57.7358V59.0373C110.914 60.4473 109.759 61.6042 108.343 61.6042Z" fill="white"></path></g></svg></div><p class="alert-empty">QuÃ½ khÃ¡ch chÆ°a xem sáº£n pháº©m nÃ o.</p><p><a href="/" class="button">TIáº¾P Tá»¤C MUA HÃ€NG</a></p></div>');
							}
							viewed_items.push(v);
						}
					}
					else{
						viewed_items.push(null);
					}
				});
				/*$.each(viewed_items,function(i,v){
						if(v != null){
							StickerAndPrice(v,'#viewed-loop-'+(i+1));
						}
					});*/
				GVN.Helper.renderFavorites();
			});
		}
		else{
			//$('.list-productViewed').hide();
			if(window.shop.template === 'customers[account].viewed' || window.shop.template === 'customers[account]' ){
				$('.viewedlist-account').html('<div class="data-account__empty"><div class="icon-empty"><svg width="132" height="170" viewBox="0 0 132 170" fill="none" xmlns="http://www.w3.org/2000/svg"><g fill="white" ><path d="M125.486 120.371H113.585V91.6562H132V113.845C132 117.451 129.086 120.371 125.486 120.371Z" fill="#A1AAAF"></path><path d="M99.3294 167.226C95.6392 170.922 89.6482 170.922 85.949 167.226L50.2828 131.497C46.5926 127.801 46.5926 121.799 50.2828 118.094C53.973 114.397 59.964 114.397 63.6633 118.094L99.3294 153.822C103.029 157.528 103.029 163.529 99.3294 167.226Z" fill="#E1E4E6"></path><path d="M128.553 117.208C126.649 117.208 125.107 115.662 125.107 113.755V91.9459C125.107 91.8465 125.125 91.7561 125.134 91.6567H125.107V6.06465C125.107 2.72051 122.4 0 119.052 0H42.7036C39.3652 0 36.6494 2.71147 36.6494 6.06465V114.315C36.6494 117.66 39.3562 120.38 42.7036 120.38H113.585H125.107H125.486C129.086 120.38 132 117.461 132 113.855V113.764C132 115.662 130.457 117.208 128.553 117.208Z" fill="#E1E4E6"></path><path d="M40.1233 148.932C62.2828 148.932 80.2466 130.937 80.2466 108.739C80.2466 86.5409 62.2828 68.5459 40.1233 68.5459C17.9638 68.5459 0 86.5409 0 108.739C0 130.937 17.9638 148.932 40.1233 148.932Z" fill="#CBD1D6"></path><path d="M40.1235 136.577C55.4712 136.577 67.9129 124.113 67.9129 108.739C67.9129 93.3647 55.4712 80.9014 40.1235 80.9014C24.7758 80.9014 12.334 93.3647 12.334 108.739C12.334 124.113 24.7758 136.577 40.1235 136.577Z" fill="white"></path><path d="M51.6001 97.2418C52.9084 98.5524 52.9084 100.676 51.6001 101.987L33.3836 120.226C32.0753 121.537 29.955 121.537 28.6467 120.226C27.3385 118.916 27.3385 116.792 28.6467 115.481L46.8633 97.2328C48.1715 95.9313 50.2918 95.9313 51.6001 97.2418Z" fill="#F56F65"></path><path d="M51.6001 120.226C50.2918 121.537 48.1715 121.537 46.8633 120.226L28.6467 101.978C27.3385 100.667 27.3385 98.5435 28.6467 97.2329C29.955 95.9224 32.0753 95.9224 33.3836 97.2329L51.6001 115.481C52.9084 116.792 52.9084 118.925 51.6001 120.226Z" fill="#F56F65"></path><path d="M55.9488 25.7136C59.7112 25.7136 63.3112 22.4056 63.1398 18.5101C62.9684 14.6056 59.9819 11.3066 55.9488 11.3066C52.1864 11.3066 48.5864 14.6146 48.7578 18.5101C48.9293 22.4146 51.9157 25.7136 55.9488 25.7136Z" fill="white"></path><path d="M80.1925 25.7136C83.9549 25.7136 87.5549 22.4056 87.3834 18.5101C87.212 14.6056 84.2255 11.3066 80.1925 11.3066C76.4301 11.3066 72.8301 14.6146 73.0015 18.5101C73.1819 22.4146 76.1684 25.7136 80.1925 25.7136Z" fill="white"></path><path d="M104.445 25.7136C108.207 25.7136 111.807 22.4056 111.636 18.5101C111.464 14.6056 108.478 11.3066 104.445 11.3066C100.683 11.3066 97.0825 14.6146 97.2539 18.5101C97.4344 22.4146 100.421 25.7136 104.445 25.7136Z" fill="white"></path><path d="M108.28 44.9557H51.1307C49.678 44.9557 48.4961 43.7717 48.4961 42.3165V40.8071C48.4961 39.352 49.678 38.168 51.1307 38.168H108.28C109.732 38.168 110.914 39.352 110.914 40.8071V42.3165C110.914 43.7717 109.732 44.9557 108.28 44.9557Z" fill="white"></path><path d="M108.343 61.6042H51.0585C49.642 61.6042 48.4961 60.4563 48.4961 59.0373V57.7358C48.4961 56.3168 49.642 55.1689 51.0585 55.1689H108.343C109.759 55.1689 110.905 56.3168 110.905 57.7358V59.0373C110.914 60.4473 109.759 61.6042 108.343 61.6042Z" fill="white"></path></g></svg></div><p class="alert-empty">QuÃ½ khÃ¡ch chÆ°a xem sáº£n pháº©m nÃ o.</p><p><a href="/" class="button">TIáº¾P Tá»¤C MUA HÃ€NG</a></p></div>');
			}
		}
	},
	setFavorites: function(id, handle, cb){
		$.ajax({
			type: 'POST',
			url: 'https://onapp.haravan.com/wishlist/frontend/api/likeproduct',
			async: false,
			data: {
				shop: window.Haravan.shop,
				customer_id: window.shop.account.id,
				product_id: id,
				product_handle: handle,
				email: window.shop.account.email
			},
			success: function(data){
				cb();
			}
		})
	},
	unSetFavorites: function(id, handle, cb){
		$.ajax({
			type: 'POST',
			url: 'https://onapp.haravan.com/wishlist/frontend/api/unlikeproduct',
			async: false,
			data: {
				shop: window.Haravan.shop,
				customer_id: window.shop.account.id,
				product_id: id,
				product_handle: handle,
				email: window.shop.account.email
			},
			success: function(data){
				cb();
			}
		})
	},
	listFavorites: function(cb){
		$.ajax({
			type: 'POST',
			url: 'https://onapp.haravan.com/wishlist/frontend/api/listproduct',
			data: {
				shop: window.Haravan.shop,
				customer_id: window.shop.account.id
			},
			success: function(data){
				cb(data);
			}
		})
	},
	renderFavorites: function(){
		try{
			if(typeof window.shop.favorites === 'object' && window.shop.favorites.length > 0){
				$.each(window.shop.favorites, function(i, v){
					$('.js-wishlist[data-handle="'+v+'"]').addClass('active');
				})
			}
		}catch(err){

		}
	},
	checkInput: function(from){
		$('#'+from+' input').blur(function(){
			tmpval = $(this).val();
			if(tmpval == '') {
				$(this).removeClass('is-filled');
			} else {
				$(this).addClass('is-filled');
			}
		});
	}, 
	pickItem: function(){
		$(document).on('click','.proloop .proloop-img .aspect-ratio, .proloop .proloop-name a, .proloop-fs .proloop-img .aspect-ratio, .proloop-fs .proloop-name a',function(e){
			e.preventDefault();
			var href = $(this).attr('href');
			var id = $(this).parents('.proloop-block').attr('data-id');
			GVN.GA4.selectItem(id);
			window.location = href;
		}); 
	}
}
GVN.AppPE = {
	totalPageItem: 0,
	renderComboNew: function(currentId,view){
		var aIdComboNew = [], aIdSearchComboNew = [], htmlComboNew = "";
		var dataItemsComboNew = [];
		var nameCombo = ""; // mÃ£ combo
		var codeCombo = "";
		const urlAppCb =  window.shop_app.apiComboList +"?fields=code,title,start_date,end_date,items&items.product_id=";
		var elSearch = urlAppCb + currentId;

		//-- COMBO NEW
		function render_img (result,aIdComboNew){
			var htmlImg = '';
			var numIdCombo = aIdComboNew.length - 1;
			htmlImg += '<div class="combo-content--images d-none">';
			$.each(aIdComboNew,function(i,v){
				htmlImg +=  '<a href="'+result[v].url+'" title="'+result[v].title+'" class="image ">';
				htmlImg +=    '<img src="'+Haravan.resizeImage(result[v].img,'medium')+'" alt="'+result[v].title+'">';
				htmlImg +=  '</a>';
				if(i < numIdCombo ){
					htmlImg +=  '<p class="plus">+</p>';
				}
			});
			htmlImg += '</div>';    
			return htmlImg;	
		}
		/*function render_price(dtCombo){
			var dt_of_combo = {}, price_combo = 0;

			dt_of_combo.quantity = dtCombo.quantity;
			switch (dtCombo.discount_type){
				case 'AMOUNT': // VNÄ
					price_combo = dtCombo.discount_value;
					break;
				case 'PERCENTAGE': // %Giáº£m 
					price_combo = dtCombo.price_original - (dtCombo.price_original * (dtCombo.discount_value / 100));
					break;
				default: // FIXED_PRICE - GiÃ¡ cá»©ng 
					price_combo = dtCombo.discount_value;
			}debugger;
			dt_of_combo.price = price_combo;

			return dt_of_combo;
		}
		*/
		function render_title(result,iCombo,nCombo){
			nameCombo = dataItemsComboNew[iCombo].title; 
			codeCombo = dataItemsComboNew[iCombo].code;
			var htmlTitleCb = '<div class="combo-content--title"><h4>Bá»™ Combo: ' + nameCombo + '</h4></div>';
			return htmlTitleCb;
		}
		function render_detail(result,iCombo,nCombo){
			/* Xá»­ lÃ½ giÃ¡ trá»‹ tá»« app */
			nameCombo = dataItemsComboNew[iCombo].title; 
			codeCombo = dataItemsComboNew[iCombo].code;

			var detail = {
				idFirst: null,
				available: true
			};

			var htmlDetail = '<div class="combo-content--detail">';
			htmlDetail +=    	 '<ul>';
			var totalPriceCombo = 0;
			$.each(nCombo,function(i,v){
				/* Xá»­ lÃ½ giÃ¡ trá»‹ tá»« app */
				var dtPrice = dataItemsComboNew[iCombo][v].price;
				var dtQty = dataItemsComboNew[iCombo][v].quantity;
				var dtVrId = dataItemsComboNew[iCombo][v].variant_id;
				var dtVrTt = dataItemsComboNew[iCombo][v].variant_title;
				var dtPrId = dataItemsComboNew[iCombo][v].product_id;
				if (!result[dtPrId].variants[dtVrId].available){
					detail.available = false;
				}

				totalPriceCombo += (dtPrice*dtQty);

				if(v == currentId){
					detail.idFirst = dtVrId;
					htmlDetail +=   '<li class="item-force cur-item'+ (result[v].price == 0 ? 'item-gift' : '' ) +'">';
					htmlDetail +=	    '<label for="item-force">';
					htmlDetail +=	        '<input type="checkbox" id="item-force" class="force" name="combo-option" value="'+result[v].first_available+'"  data-combo="'+dtPrice+'" data-quantity="'+dtQty+'" data-origin="'+result[v].price+'"  checked/>';
				}
				else {
					htmlDetail +=   '<li class="item-force'+ (result[v].price == 0 ? 'item-gift' : '' ) +'"><label>';
					htmlDetail +=   '<input type="checkbox" name="combo-option" value="'+result[v].first_available+'" data-combo="'+dtPrice+'" data-quantity="'+dtQty+'" data-origin="'+result[v].price+'"  checked/>';
				}
				htmlDetail +=	    '</label>';
				htmlDetail +=  		'<span class="img"><img src="'+Haravan.resizeImage(result[v].img,'medium')+'" alt="'+result[v].title+'"></span>';

				if(v == currentId){
					htmlDetail +=	    '<p class="combo-item--title">'+dtQty+' x ' + result[v].title + (result[v].price > 0 ? ('<strong> - </strong>' + result[v].variants[dtVrId].title) : '') ;
					htmlDetail +=	      '<span><b>'+ (result[v].price == 0 ? 'QuÃ  táº·ng' : Haravan.formatMoney(result[v].variants[dtVrId].price*100, window.shop.moneyFormat).replace(/\,/g,'.')) +'</b>' + (result[v].price < result[v].compare_at_price?'<del>'+Haravan.formatMoney(result[v].compare_at_price*100, window.shop.moneyFormat).replace(/\,/g,'.')+'</del>':'') + '</span>';
					htmlDetail +=	    '</p>';
				}
				else {
					htmlDetail +=	    '<p class="combo-item--title"><a href="'+ result[v].url +'">'+dtQty+' x ' + result[v].title + (result[v].price > 0 ? ('<strong> - </strong>' + result[v].variants[dtVrId].title) : '') ;
					htmlDetail +=	      '<span><b>'+ (result[v].price == 0 ? 'QuÃ  táº·ng' : Haravan.formatMoney(result[v].variants[dtVrId].price*100, window.shop.moneyFormat).replace(/\,/g,'.')) +'</b>' + (result[v].price < result[v].compare_at_price?'<del>'+Haravan.formatMoney(result[v].compare_at_price*100, window.shop.moneyFormat).replace(/\,/g,'.')+'</del>':'') + '</span>';
					htmlDetail +=	    '</a></p>';
				}

				htmlDetail +=	    '<p class="combo-item--price">'+ (result[v].price == 0 ? 'QuÃ  táº·ng' : (Haravan.formatMoney(dtPrice*dtQty*100, window.shop.moneyFormat).replace(/\,/g,'.')+(result[v].price > dtPrice?'<del>'+Haravan.formatMoney(result[v].price*dtQty*100, window.shop.moneyFormat).replace(/\,/g,'.')+'</del>':'')))+'</p>';
				htmlDetail +=	    '</li>';
			});
			htmlDetail +=		 	 '</ul>';
			htmlDetail +=		 '</div>';
			htmlDetail +=		 '<div class="combo-content--total">';
			htmlDetail +=			'<p>Tá»•ng tiá»n: <span class="combo-total-price">'+Haravan.formatMoney(totalPriceCombo*100, window.shop.moneyFormat).replace(/\,/g,'.')+'</span></p>';
			htmlDetail +=			'<button type="button" class="add-combo" data-codeCb="'+codeCombo+'" data-nameCb="'+nameCombo+'">ThÃªm '+nCombo.length+' vÃ o giá» hÃ ng</button>'
			htmlDetail +=	   '</div>';
			
			detail.htmlDetail = htmlDetail;
			return detail;
		}
		function addCombo(indx, aItems, callback){
			if(indx < aItems.length){
				$.ajax({
					url: '/cart/add.js',
					type: 'POST',
					data: 'id='+aItems[indx].vid+'&quantity='+aItems[indx].qty,
					async: false,
					success: function(data){
						indx++;
						addCombo(indx, aItems, callback);
					},
					error: function(){

					}
				});
			}
			else{
				if(typeof callback === 'function') return callback();
			}
		}

		// View product
		var parentDOM = '#combo-promo--product';

		// View Quickview														 
		if ( view != undefined && view == 'quickview') {
			var parentDOM = '#q-combo-promo--product ';
		}

		//View Modal
		if ( view != undefined && view == 'modalcombo') {
			var parentDOM = '#nhanqua-combo ';
		}

		$.ajax({
			url: elSearch,
			success: function(data){
				if(data.total > 0){
					$.each(data.items,function(i,v){
						var temp = [];
						var temp2 = {};
						$.each(v.items,function(j,k){
							temp.push(k.product_id);
							aIdSearchComboNew.push(k.product_id);
							temp2[k.product_id] = k;
							temp2.code = v.code;
							temp2.title = v.title;
						});
						aIdComboNew.push(temp);
						dataItemsComboNew.push(temp2);
					});
					aIdSearchComboNew = GVN.Helper.uniques(aIdSearchComboNew);
					var str = "/search?q=filter=((id:product="+aIdSearchComboNew.join(')||(id:product=')+'))';
					$.ajax({
						url: str+'&view=item-cart',
						type: 'GET',
						async: false,
						success: function(result){
							result = JSON.parse(result);
							$.each(aIdComboNew,function(i,v){
								var allAvailable = true;
								var aVid = [];
								/* Kiá»ƒm tra cÃ³ item nÃ o trong combo ko valid thÃ¬ khÃ´ng hiá»ƒn thá»‹ */
								/* Hoáº·c cÃ³ item nÃ o bá»‹ áº©n thÃ¬ ko hiá»ƒn thá»‹ */
								$.each(v,function(j,k){
									if(result[k]){
										if(!result[k].available){
											allAvailable = false;
											return false;
										}
										else{
											aVid.push(0);
										}
									}
									else{
										allAvailable = false;
										return false;
									}
								});
								/* Náº¿u kiá»ƒm tra cÃ¡c item trong combo Ä‘á»u cÃ²n hÃ ng thÃ¬ render */
								if(allAvailable){
									var htmlImg = render_img(result,v);
									var htmlTitleCb = render_title(result,i,v);
									var detail = render_detail(result,i,v);
									var htmlDetail = detail.htmlDetail;
									var classHide = '';
									var classSoldout = '';
									if (detail.available == false){
										classSoldout = ' soldout';
									}
									if (detail.idFirst != variantFirst){
										classHide = ' d-none';
									}

									htmlComboNew += '<div class="combo-info--content fw-variant-'+ detail.idFirst + classHide + classSoldout + '">'; 
									htmlComboNew += htmlImg;
									htmlComboNew += htmlTitleCb;
									htmlComboNew += htmlDetail;
									htmlComboNew += '</div>';
									checkComboNew = true;
								}
							});
							if(htmlComboNew != ''){
								//Product Page
								$('#combo-promo--product > .combo-promo--content > .combo-promo--lists').html('').append(htmlComboNew);
								// -- Quickview
								variantFirst = $('#product-select'+(view != undefined && view == 'quickview'?'-qv':'')).val();
								$('#q-combo-promo--product > .combo-promo--content > .combo-promo--lists').html('').append(htmlComboNew);
								// -- Chung
								$('.combo-promo--app').removeClass('d-none');
								checkGiftCombo(variantFirst,view);
								
								if ( view != undefined && view == 'modalcombo') {
									$('#nhanqua-combo > .list-gifts').html('').append(htmlComboNew);
									setTimeout(function(){
										checkGiftCombo(GVN.Global.variant_id,view);
										$('#nhanquamodal-combo').modal();
										$('body').addClass('nhanqua-open');
									},2000);
								}
								
								setTimeout(function(){
									$('#add-to-cart,#buy-now,#add-to-cart-qv').removeClass('loading');
								},3000);
							} 
							else {
								if ( view != undefined && view == 'modalcombo') {
									$.post('/cart/add.js','id='+GVN.Global.variant_id+'&quantity=1').done(function(){
										if(GVN.Global.action == 'addtocart'){
											GVN.Helper.flyCart(GVN.Global.imgtodrag);
											$('body').removeClass('modal-open').removeClass('nhanqua-open');
											GVN.Helper.getCartSidebar();
										}
										else{
											window.location.href = '/cart';
										}
									});
								}
								setTimeout(function(){
									$('#add-to-cart,#buy-now,#add-to-cart-qv').removeClass('loading');
								},3000);
							}
						}
					});
				}
				else {
					if(view != undefined && view == 'modalcombo'){
						$.post('/cart/add.js','id='+GVN.Global.variant_id+'&quantity=1').done(function(line){
							if(GVN.Global.action == 'addtocart'){
								GVN.Helper.flyCart(GVN.Global.imgtodrag);
								$('body').removeClass('modal-open').removeClass('nhanqua-open');
								GVN.Helper.getCartSidebar();
							}
							else{
								window.location.href = '/cart';
							}
						});
					}
					setTimeout(function(){
						$('#add-to-cart,#buy-now,#add-to-cart-qv').removeClass('loading');
					},3000);
				}
			}
		});

		//Add Combo to cart
		$(parentDOM).delegate('input[name="combo-option"]:not(.force)','change',function(){
			var ind = $(this).parents('li').index();
			var total = 0;
			if(ind >= 0){
				if($(this).is(':checked')){
					$(this).parents('.combo-info--content').find('.combo-content--images a:nth-child('+(ind*2 + 1)+')').removeClass('disabled');
				}
				else{
					$(this).parents('.combo-info--content').find('.combo-content--images a:nth-child('+(ind*2 + 1)+')').addClass('disabled');
				}

				var numCombo = $(this).parents('.combo-info--content').find('input').length;
				var numCheck = $(this).parents('.combo-info--content').find('input:checked').length;
				$(this).parents('.combo-info--content').find('input').each(function(){
					var combo = parseInt($(this).attr('data-combo').trim());
					var qty = parseInt($(this).attr('data-quantity').trim());
					var origin = parseInt($(this).attr('data-origin').trim());
					if(numCombo == numCheck){
						total += combo*qty;
						var htmlDel = '';
						if(origin > combo){
							htmlDel += '<del>'+Haravan.formatMoney(origin*qty*100, window.shop.moneyFormat).replace(/\,/g,'.')+'</del>';
						}
						$(this).parents('li').find('.combo-item--price').html(Haravan.formatMoney(combo*qty*100, window.shop.moneyFormat).replace(/\,/g,'.')+htmlDel);
					}
					else{
						var origin = parseInt($(this).attr('data-origin').trim());
						$(this).parents('li').find('.combo-item--price').html(Haravan.formatMoney(origin*qty*100, window.shop.moneyFormat).replace(/\,/g,'.'));
						if($(this).is(':checked')) total += origin*qty;
					}
				});
				$(this).parents('.combo-info--content').find('.combo-total-price').html(Haravan.formatMoney(total*100, window.shop.moneyFormat).replace(/\,/g,'.'));
			}
			var checkcount = $(this).parents('.combo-info--content').find('input[name="combo-option"]:checked').length;
			$(this).closest('.combo-info--content').find('.add-combo').html('ThÃªm '+(checkcount == 1 ? '' : checkcount + ' ')+'vÃ o giá»');
		});
		$(parentDOM).delegate('.add-combo','click',function(e){
			e.preventDefault();
			var addCodeCombo = $(this).attr('data-codecb') ;
			var addNameCombo = $(this).attr('data-namecb');
			var countCheckbox = $(this).parents('.combo-info--content').find('input').length;
			var countChecked = $(this).parents('.combo-info--content').find('input:checked').length;
			console.log(countCheckbox);
			console.log(countChecked);
			if (countCheckbox == countChecked){
				var properties = {};
				var data_add = { id: window.shop_app.productKeyCombo, quantity: 1};
				$.get('/cart.js').done(function(cart){
					var param = {}
					param[addCodeCombo] = 1;
					if(cart.attributes){
						$.each(cart.attributes, function(i,v){
							if(i == 'PE-combo-detail ' + addNameCombo){
								param[addCodeCombo] = parseInt(param[addCodeCombo]) + parseInt(v);
								param['Title Combo'] = addNameCombo;
							}
						});
					}
					properties['PE-combo-set'] = JSON.stringify(param);
					if(!$.isEmptyObject(properties)){
						data_add['properties'] = properties;
					}
					var params = {
						type: 'POST',
						url: '/cart/add.js',
						async: true,
						data: data_add,
						dataType: 'json',
						success: function(line_item) {
							$('.loader').addClass('open');
							setTimeout(function(){
								window.location = "/cart";
							}, 1000);
						},
						error: function(XMLHttpRequest, textStatus) {
							console.log(XMLHttpRequest, textStatus);
							alert(XMLHttpRequest.responseJSON.description);
						}
					};
					$.ajax(params);
				});
			} 
			else {
				var aItems = [];
				$(this).parents('.combo-info--content').find('input:checked').each(function(){
					var temp = {};
					temp.vid = $(this).val();
					//temp.qty = $(this).attr('data-quantity');
					temp.qty = 	parseInt($(this).attr('data-quantity')) * parseInt($('#quantity').val());
					aItems.push(temp);
				});
				addCombo(0, aItems, function(){
					window.location = '/cart';
				});
			}
		});
		$('.combo-promo--content .btn-more').on('click', function () {
			$('.combo_lists').toggleClass('full'); 
			if($(this).find('> span').text() === 'Xem thÃªm') {
				$(this).find('> span').text('Thu gá»n');
				$(this).find('> svg').css('transform', 'rotate(-90deg)');
			} 
			else {
				window.scroll(0, $('.combo_lists').offset().top - 150);
				$(this).find('> span').text('Xem thÃªm');
				$(this).find('> svg').css('transform', 'rotate(90deg)');
			}
		});
	},
	renderGift: function(currentId,view){
		var aIdGift = [], aIdSearchGift = [], htmlGiftList = "";

		function render_item(result,iGift,nGift){
			var htmlGift = '';
			$.each(nGift,function(i,v){
				if(result.hasOwnProperty(v)){ // xÃ©t result tá»« search náº¿u cÃ³ chá»©a id gift thÃ¬ má»›i render
					if (dataItemsGift[v].tags.length > 0) {
						var checkHighlight = false;
						$.each(dataItemsGift[v].tags,function(m,n){		
							if(n.code == 'highlight'){
								checkHighlight = true;
							}
						});
						if (checkHighlight){
							htmlGift += '<li class="higtlight"><a href="'+result[v].url+'" class="line-gift">TÄƒÌ£ng ngay <strong>'+result[v].title+'</strong> triÌ£ giaÌ <strong>'+GVN.Helper.moneyFormat( (result[v].price / 100),'â‚«')+'</strong></a></li>';
						}
						else {
							htmlGift += '<li><a href="'+result[v].url+'" class="line-gift"><span>'+result[v].title+'</span></a></li>';
						}
					}
					else {
						htmlGift += '<li><a href="'+result[v].url+'" class="line-gift"><span>'+result[v].title+'</span></a></li>';
					}
				}
			});
			return htmlGift;
		}
		
		const urlAppGift =  window.shop_app.apiGiftListSuggestion +"?list_product_id=";
		var elSearch = urlAppGift + currentId;
		
		$.ajax({
			url: elSearch,
			success: function(data){
				var result = data.data;
				if(result.total > 0){
					$.each(result.items,function(i,v){
						$.each(v.list_condition_and_gift_items,function(j,k){
							var temp = [];
							$.each(k.list_gift_items,function(l,m){
								temp.push(m.product_id);
								aIdSearchGift.push(m.product_id);
								m.tags = v.tags_array;
								dataItemsGift[m.product_id] = m;
							});
							aIdGift.push(temp);
						});
					});
					
					aIdSearchGift = GVN.Helper.uniques(aIdSearchGift);
					var str = "/search?q=filter=((id:product="+aIdSearchGift.join(')||(id:product=')+'))';
					$.ajax({
						url: str+'&view=item-cart',
						type: 'GET',
						async: false,
						success: function(resultNew){
							resultNew = JSON.parse(resultNew);
							htmlGiftList += '<ul>';
							$.each(aIdGift,function(i,v){
								var allAvailable = true;
								var aVid = [];
								/* Kiá»ƒm tra cÃ³ item nÃ o trong list ko valid thÃ¬ khÃ´ng hiá»ƒn thá»‹ */
								/* Hoáº·c cÃ³ item nÃ o bá»‹ áº©n thÃ¬ ko hiá»ƒn thá»‹ */
								
								$.each(v,function(j,k){
									if(resultNew[k]){
										if(!resultNew[k].available){
											allAvailable = false;
											return false;
										}
										else{
											aVid.push(0);
										}
									}
									else{
										allAvailable = false;
										return false;
									}
								});
								/* Náº¿u kiá»ƒm tra cÃ¡c item trong list Ä‘á»u cÃ²n hÃ ng thÃ¬ render */
								if(allAvailable){}
									htmlGiftList += render_item(resultNew,i,v);
								
							});
							htmlGiftList += '</ul>';
							if(htmlGiftList != '<ul></ul>'){
								// -- Product Page
								$('#gift-promo--product > .gift-promo--content > .gift-promo--lists').html('').append(htmlGiftList);
								// -- Quickview
								$('#q-gift-promo--product > .gift-promo--content > .gift-promo--lists').html('').append(htmlGiftList);
								// -- Chung
								$('.gift-promo--app').removeClass('d-none');
							}	
							else {
								$('.product-promo-box').removeClass('d-none');
							}
						}
					});
				}
				else {
				
				}
			}
		});
	},
	renderDiscount: function(currentId,view){
		var htmlDiscountList = "";
		function render_item(currentId,iDiscount,nDiscount){			
			var htmlDiscount = '';
			htmlDiscount += '<li>';
			htmlDiscount +=  '<div class="line-discount"><span>'+nDiscount.title+'</span> ';
			
			$.each(nDiscount.item_groups,function(j,k){		
				var las = [];
				const array = nDiscount.item_groups;
				const type = "ITEM_DISCOUNT";
				const count = array.filter((obj) => obj.item_type === type).length;
				const filterArray = array.filter(item => {
					if (item.item_type === type) {
						las.push(item);
					}
				});
				//console.log(las);
				//console.log(count);
				if (k.list_item_buy.length > 0) {
					$.each(k.list_item_buy,function(i,v){	
						if (v.product_id == currentId && k.item_type == 'ITEM_BUY') {
							$.each(las,function(b,c){	
								htmlDiscount +=  		'<a data-items-id="'+nDiscount._id+'" ';
								htmlDiscount += 				'data-itemgroup-id="IG'+(b+2)+'" ';
								htmlDiscount +=  				'href="/collections/chuong-trinh-khuyen-mai/?id='+nDiscount._id+'&item_group_id=IG'+(b+2)+'">';
								htmlDiscount += 				'(Xem thÃªm)';
								htmlDiscount += 				'</a> ';
							});
						}
						else if (v.product_id == currentId && k.item_type == 'ITEM_DISCOUNT') {
							htmlDiscount +=  		'<a ';
							htmlDiscount +=  							 'data-items-id="'+nDiscount._id+'" ';
							htmlDiscount += 							 'data-itemgroup-id="IG1" ';
							htmlDiscount +=  							 'href="/collections/chuong-trinh-khuyen-mai/?id='+nDiscount._id+'&item_group_id=IG1"';
							htmlDiscount += 		'>(Xem thÃªm)</a>';
						}
					});
				}		
			});
			htmlDiscount += 	'</div>';
			htmlDiscount += '</li>';
			return htmlDiscount;
		}
		
		const urlAppDiscount =  window.shop_app.apiDiscountListSuggestion +"?list_product_id=";
		var elSearch = urlAppDiscount + currentId;
		
		$.ajax({
			url: elSearch,
			success: function(data){
				var result = data.data;
				if(result.total > 0){
					//console.log(result.items);
					htmlDiscountList += '<ul>';
					$.each(result.items,function(i,v){
						var checkDiscount = false;
						if (v.tags_array.length > 0) {
							$.each(v.tags_array,function(m,n){		
								if(n.code == 'showweb'){
									checkDiscount = true;
								}
							});
						}
						if (checkDiscount){
							htmlDiscountList += render_item(currentId,i,v);
						}
					});
					
					htmlDiscountList += '</ul>';
					if(htmlDiscountList != '<ul></ul>'){
						// -- Product Page
						$('#discount-promo--product > .discount-promo--content > .discount-promo--lists').html('').append(htmlDiscountList);
						// -- Quickview
						$('#q-discount-promo--product > .discount-promo--content > .discount-promo--lists').html('').append(htmlDiscountList);
						// -- Chung
						$('.discount-promo--app').removeClass('d-none');
					}	
				}
				else {

				}
			}
		});
	},
	renderItemDiscount: function(){
		var aIdDiscount = [], aIdSearchDiscount = [], htmlDiscountList = "",  dataItemsDiscount = [], aIdVrDiscount = [];
		function render_item(r,m,n){
			var vrid = '';
			$.each(r[n].variants, function(key,val){
				vrid = key; return false
			});
			var htmlItem = '';
				htmlItem += '<div class="proloop" data-id="'+n+'">';
				htmlItem += 	'<div class="proloop-block" id="pe_discount_loop_'+m+'" data-id="'+n+'" data-variantid="'+vrid+'">';
				htmlItem += 		'<div class="proloop-img">';
				htmlItem += 			'<div class="proloop-label proloop-label--top d-none">';
				htmlItem += 				'<div class="proloop-label--tag"></div>';
				htmlItem += 				'<button type="button" class="popover-click proloop-label--gift d-none" data-toggle="popover" data-container="body" data-placement="bottom" data-popover-content="#giftPE-tooltip--2" data-class="giftPE-popover" title="QuÃ  táº·ng khuyáº¿n mÃ£i">';
				htmlItem += 					'<svg viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">';
				htmlItem += 						'<path d="M8.94231 5.2499H11.0577V10.4999H18.9423C19.2228 10.4999 19.4919 10.3913 19.6902 10.1979C19.8886 10.0045 20 9.74218 20 9.46868V6.28116C20 6.00765 19.8886 5.74535 19.6902 5.55195C19.4919 5.35855 19.2228 5.2499 18.9423 5.2499H16.0663C16.4558 4.46784 16.5465 3.57601 16.3222 2.7346C16.0978 1.89319 15.5731 1.15734 14.8423 0.659228C14.1115 0.161113 13.2225 -0.0666262 12.335 0.0169161C11.4475 0.100458 10.6196 0.489808 10 1.11503C9.37937 0.493234 8.55217 0.106895 7.66625 0.0250615C6.78034 -0.056772 5.89345 0.171234 5.16409 0.668329C4.43474 1.16542 3.91046 1.89921 3.68496 2.73853C3.45946 3.57785 3.54744 4.46801 3.93317 5.2499H1.05769C0.777175 5.2499 0.508147 5.35855 0.309791 5.55195C0.111435 5.74535 0 6.00765 0 6.28116V9.46868C0 9.74218 0.111435 10.0045 0.309791 10.1979C0.408007 10.2936 0.524606 10.3696 0.652931 10.4214C0.781256 10.4733 0.918794 10.4999 1.05769 10.4999H8.94231V5.2499ZM11.0577 3.65614C11.0577 3.34092 11.1536 3.03279 11.3332 2.77069C11.5128 2.5086 11.7681 2.30432 12.0668 2.1837C12.3655 2.06307 12.6941 2.03151 13.0112 2.093C13.3283 2.1545 13.6196 2.30629 13.8482 2.52918C14.0768 2.75207 14.2324 3.03605 14.2955 3.34521C14.3586 3.65437 14.3262 3.97482 14.2025 4.26605C14.0788 4.55727 13.8693 4.80618 13.6005 4.9813C13.3316 5.15643 13.0156 5.2499 12.6923 5.2499H11.0577V3.65614ZM5.67308 3.65614C5.67308 3.23345 5.84529 2.82807 6.15184 2.52918C6.4584 2.23029 6.87417 2.06238 7.30769 2.06238C7.74122 2.06238 8.15699 2.23029 8.46354 2.52918C8.77009 2.82807 8.94231 3.23345 8.94231 3.65614V5.2499H7.30769C6.87417 5.2499 6.4584 5.08199 6.15184 4.7831C5.84529 4.48421 5.67308 4.07883 5.67308 3.65614ZM11.0577 21H17.4038C17.6844 21 17.9534 20.8913 18.1517 20.698C18.3501 20.5046 18.4615 20.2423 18.4615 19.9687V11.9999H11.0577V21ZM1.53846 19.9687C1.53846 20.2423 1.6499 20.5046 1.84825 20.698C2.04661 20.8913 2.31564 21 2.59615 21H8.94231V11.9999H1.53846V19.9687Z" fill="#E30019"></path>';
				htmlItem += 					'</svg>';
				htmlItem += 				'</button>';
				htmlItem += 				'<div class="proloop-content--gift d-none" id="giftPE-tooltip--2"></div>';
				htmlItem += 			'</div>';
				htmlItem += 			'<a class="aspect-ratio fade-box" href="'+r[n].url+'" title="'+r[n].title+'" aria-label="'+r[n].title+'">';
				htmlItem += 				'<picture class="">';
				if (r[n].img == '') { 
					htmlItem += 	    		'<source srcset="//theme.hstatic.net/200000636033/1001033735/14/no-image.jpg" data-srcset="//theme.hstatic.net/200000636033/1001033735/14/no-image.jpg" media="(max-width: 767px)">';
					htmlItem += 					'<img class="img-default lazyloaded" src="//theme.hstatic.net/200000636033/1001033735/14/no-image.jpg" data-src="//theme.hstatic.net/200000636033/1001033735/14/no-image.jpg" alt="'+r[n].title+'">';
				}
				else {
					htmlItem += 	    		'<source srcset="'+r[n].img+'" data-srcset="'+r[n].img+'" media="(max-width: 767px)">';
					htmlItem += 					'<img class="img-default lazyloaded" src="'+r[n].img+'" data-src="'+r[n].img+'" alt="'+r[n].title+'">';
				}
				htmlItem += 				'</picture>';
				htmlItem += 			'</a>';
				htmlItem += 			'<div class="proloop-button" data-view=""> '; 
				htmlItem += 				'<button aria-label="Xem nhanh" class="proloop-action quick-view  full" data-handle="" data-id="'+n+'">Xem nhanh</button>';
				htmlItem += 				'<button aria-label="ThÃªm vÃ o giá»" class="proloop-action add-to-cart disabled" disabled="" data-id="'+n+'" data-variantid="">ThÃªm vÃ o giá»</button>  ';
				htmlItem += 			'</div>';
				htmlItem += 		'</div>';
				htmlItem += 		'<div class="proloop-detail">';
				htmlItem += 			'<div class="proloop-label  proloop-label--bottom d-none"></div>';
				htmlItem += 			'<h3 class="proloop-name"><a href="'+r[n].url+'">'+r[n].title+'</a></h3>';
				htmlItem += 			'<div class="proloop-price">';
				if (r[n].compare_at_price > 0 && r[n].compare_at_price > r[n].price){
					htmlItem += 				'<div class="proloop-price--compare"><del>'+GVN.Helper.moneyFormat(r[n].compare_at_price,'â‚«')+'</del></div>';
				}
				htmlItem += 				'<div class="proloop-price--default">';
				htmlItem += 					'<span class="proloop-price--highlight">'+ GVN.Helper.moneyFormat(r[n].price,'â‚«')+'</span>';
				if (r[n].compare_at_price > 0 && r[n].compare_at_price > r[n].price){
					htmlItem += 				'<span class="proloop-label--on-sale">-'+Math.round(100 - (r[n].price / (r[n].compare_at_price /100)) )+'%</span>';
				}
				htmlItem += 				'</div>';
				htmlItem += 			'</div>';
				htmlItem += 			'<div class="proloop-rating">';
				htmlItem += 				'<span class="number">0.0</span>';
				htmlItem += 				'<span class="icon">';
				htmlItem += 					'<svg viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">';
				htmlItem += 						'<path d="M2.09627 11.6195L2.82735 8.16864L0.268563 5.80414C0.268563 5.80414 -0.096986 5.48462 0.0248693 5.03728C0.146725 4.58994 0.634105 4.58994 0.634105 4.58994L4.04582 4.27041L5.38614 1.01124C5.38614 1.01124 5.5689 0.5 5.99538 0.5C6.42185 0.5 6.60461 1.01124 6.60461 1.01124L7.94493 4.27041L11.4785 4.58994C11.4785 4.58994 11.844 4.65385 11.9659 5.03728C12.0877 5.42071 11.844 5.67633 11.844 5.67633L9.1634 8.16864L9.89448 11.7473C9.89448 11.7473 10.0163 12.1308 9.71171 12.3864C9.40709 12.642 8.91971 12.3864 8.91971 12.3864L5.99538 10.5331L3.13197 12.3864C3.13197 12.3864 2.70551 12.642 2.33996 12.3864C1.97442 12.1308 2.09627 11.6195 2.09627 11.6195Z" fill="#FF8A00"></path>';
				htmlItem += 					'</svg>';
				htmlItem += 				'</span>';
				htmlItem += 				'<span class="count">(0 Ä‘Ã¡nh giÃ¡)</span>';
				htmlItem += 			'</div>';
				htmlItem += 		'</div> ';
				htmlItem += 	'</div>	';
				htmlItem += '</div>';

			window.shop_tracking[n] = r[n];
			
			return htmlItem;
		}
		if (!$.isEmptyObject(paramUrl)) {
			if (paramUrl.hasOwnProperty('id') && paramUrl.hasOwnProperty('item_group_id')) {debugger;
				function loadItems(page){
					const urlAppDiscount =  window.shop_app.apiDiscountListItemBuy;
					var elSearch = urlAppDiscount +"?id="+paramUrl.id+"&item_group_id="+paramUrl.item_group_id+'&page='+page+'&limit=50';
					$.ajax({
						url: elSearch,
						success: function(data){
							var result = data.data;
							console.log(data);
							if(result.total > 0){

								GVN.AppPE.totalPageItem = Math.ceil(result.total / 50);
								if(page < GVN.AppPE.totalPageItem){
									//$('#load_more_discount').find('span').html(result.total - (page * 50));
									$('#load_more_discount').attr('data-current',page+1);
									$('#load_more_discount').parents('.collection-pagi').removeClass('d-none');
								}
								else{
									$('#load_more_discount').parents('.collection-pagi').addClass('d-none');
								}

								var temp = [];
								var temp2 = {};
								var temp1 = [];
								$.each(result.items,function(j,k){
									temp.push(k.product_id);
									aIdSearchDiscount.push(k.product_id);
									temp2[k.product_id] = k;
									temp1.push(k.variant_id);
									aIdVrDiscount.push(k.variant_id);
								});
								aIdDiscount = temp;
								dataItemsDiscount = temp2;
								aIdVrDiscount = temp1;
								aIdSearchDiscount = GVN.Helper.uniques(aIdSearchDiscount);
								var str = "/search?q=filter=((id:product="+aIdSearchDiscount.join(')||(id:product=')+'))';
								GVN.Rating.checkRatingLoop(aIdSearchDiscount);
								
								$.ajax({
									url: str+'&view=dataproduct',
									type: 'GET',
									async: false,
									success: function(resultNew){
										resultNew = JSON.parse(resultNew);
										$.each(aIdDiscount,function(i,v){
											if (resultNew[v] != undefined){
												htmlDiscountList += render_item(resultNew,i,v);
											}
										});
										if(htmlDiscountList != ''){
											$('.ajax-render').html('').append(htmlDiscountList);
											$('.collection-layout').removeClass('js-loading');
										}	
										else {
											$('.ajax-render').html('').append('<div><a class="button" href="https://gearvn.com/collections/laptop">Xem thÃªm cÃ¡c sáº£n pháº©m khÃ¡c</div>');
											$('.ajax-render').addClass('no-product');
											$('.collection-pagi').addClass('d-none');
											$('.collection-layout').removeClass('js-loading');
											//window.location.href = '/'; 
										}
									}
								});	
							}
							else {

							}
						}
					});
				}
				loadItems(1);
			}
		}
		$(document).on('click','#load_more_discount',function(e){
			e.preventDefault();
			var page = Number($(this).attr('data-current'));
			loadItems(page);
		});
		
	},
	checkGiftPE: function(listPr){
		let urlCheckGiftPE = window.shop_app.apiGiftListSuggestion + '?list_product_id=' + listPr;
		if(listPr.length > 0){						
			$.get(urlCheckGiftPE).done(function(result){
				var datanew = result.data;
				if(datanew.total > 0){						
					console.log(datanew);
					$.each(datanew.items,function(i,v){
						$.each(v.list_item_buy,function(j,k){
							if($('.proloop .proloop-block[data-id="'+k.product_id+'"]').length > 0){
								$('.proloop .proloop-block[data-id="'+k.product_id+'"] .proloop-label--gift').removeClass('d-none');
								$('.proloop .proloop-block[data-id="'+k.product_id+'"] ').addClass('hasGiftPE');
								$.each(v.list_condition_and_gift_items,function(m,n){
									var giftDecs = '';	
									$.each(n.list_gift_items,function(l,m){
										giftDecs += '<li class="gift-'+l+'"><span>'+m.product_title+'</span></li>';
									});

									var html_gift_info = $('.proloop .proloop-block[data-id="'+k.product_id+'"] .proloop-content--gift').html().trim();
									if(html_gift_info == ''){
										$('.proloop .proloop-block[data-id="'+k.product_id+'"] .proloop-content--gift').html('<ul>'+giftDecs+'</ul>');
									}
									else{
										$('.proloop .proloop-block[data-id="'+k.product_id+'"] .proloop-content--gift ul').append(giftDecs);
									}
								});
								GVN.Global.popoverGift();
							}
						});
						//$.each(v.list_condition_and_gift_items,function(j,k){
							//$.each(k.list_gift_items,function(l,m){});
						//});
					});
				}
				$(".proloop.ajaxloop").addClass('loaded');
			});
		}
	},
}
GVN.GA4 = {
	changeSpec: function(spec){
		var str = spec;
		str = str.toLowerCase();
		str = str.replace(/Ã |Ã¡|áº¡|áº£|Ã£|Ã¢|áº§|áº¥|áº­|áº©|áº«|Äƒ|áº±|áº¯|áº·|áº³|áºµ/g,"a"); 
		str = str.replace(/Ã¨|Ã©|áº¹|áº»|áº½|Ãª|á»|áº¿|á»‡|á»ƒ|á»…/g,"e"); 
		str = str.replace(/Ã¬|Ã­|á»‹|á»‰|Ä©/g,"i"); 
		str = str.replace(/Ã²|Ã³|á»|á»|Ãµ|Ã´|á»“|á»‘|á»™|á»•|á»—|Æ¡|á»|á»›|á»£|á»Ÿ|á»¡/g,"o"); 
		str = str.replace(/Ã¹|Ãº|á»¥|á»§|Å©|Æ°|á»«|á»©|á»±|á»­|á»¯/g,"u"); 
		str = str.replace(/á»³|Ã½|á»µ|á»·|á»¹/g,"y"); 
		str = str.replace(/Ä‘/g,"d");
		str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\â€¢|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
		str = str.replace(/ /g,"_");
		str = str.trim(); 
		return str;
	},
	eventAddtocart: function(){
		var item_view_array= {
			item_id: shop.product.data.variants[0].sku,
			item_name: shop.product.title,
			item_brand: shop.product.vendor,
			item_variant: shop.product.data.variants[0].title,
			item_category: shop.product.type,
			item_list_id: shop.product.collection_id.split(',')[0],
			index: 1,
			price: shop.product.data.price/100,
		};
		var a_spec = shop.product.data.tags.filter(x => x.indexOf('spec_') > -1);
		var view_array = [];
		$.each(a_spec, function(i,v){
			var temp = v.split(':');
			item_view_array[GVN.GA4.changeSpec(temp[0])] = temp[1];
		});						
		view_array.push(item_view_array)
		var ecommerce_object = {
			'event': 'add_to_cart',
			'ecommerce': {
				'currency': 'VND',
				'items': view_array
			}
		}
		dataLayer.push({ecommerce: null}); 
		dataLayer.push(ecommerce_object);
		console.log(ecommerce_object);
	},
	beginCheckout: function(){
		var pro_array = [];
		var view_array = [];
		cartJS.items.map((v,i) => {
			var pic = proInCartJS[v.product_id]; // Product in Cart
			var item_pro_array = {
				item_name: v.title,
				price: v.price/100,
				item_brand: v.vendor,
				item_category: pic.type,
				item_list_id: pic.collection_id.length > 0 ? pic.collection_id[0].toString() : '',
				index: 1,
				quantity: cartJS.items[i].quantity,
			};
			var a_spec = proInCartJS[v.product_id].tags.filter(x => x.indexOf('spec_') > -1);
			
			item_pro_array['item_id'] = v.sku;
			item_pro_array['item_variant'] = v.variant_title;
			
			$.each(a_spec, function(m,n){
				var temp = n.split(':');
				item_pro_array[GVN.GA4.changeSpec(temp[0])] = temp[1];
			});						
			view_array.push(item_pro_array);
			pro_array.push(item_pro_array);
		});
		
		var ecommerce_object = {
			'event': 'begin_checkout',
			'ecommerce': {
				'currency': 'VND',
				'value': cartJS.total_price/100,
				'items': pro_array
			}
		}
		console.log(ecommerce_object);
		dataLayer.push({ecommerce: null}); 
		dataLayer.push(ecommerce_object);
	},
	fillCustomerInfo: function(mail,phone){
		var MD5 = function(d){var r = M(V(Y(X(d),8*d.length)));return r.toLowerCase()};function M(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d,_){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d,_,m,f,r,i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d,_,m,f,r,i,n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d,_,m,f,r,i,n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d,_,m,f,r,i,n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d,_,m,f,r,i,n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d,_){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d,_){return d<<_|d>>>32-_}

		if(typeof dataLayer == 'object'){
			dataLayer.push({
				'event': 'customer_info',
				'cus_em': mail != '' ? MD5(mail) : '', 
				'cus_pn': phone != '' ? MD5(phone) : '',
				'cus_em_raw': mail,
				'cus_pn_raw': phone
			});
			console.log({
				'event': 'customer_info',
				'cus_em': mail != '' ? MD5(mail) : '', 
				'cus_pn': phone != '' ? MD5(phone) : '',
				'cus_em_raw': mail,
				'cus_pn_raw': phone
			});
		}
	},
	paymentCheckout: function(){
		if(typeof dataLayer == 'object'){
			dataLayer.push({
				'event': 'payment'
			});
		}
	},
	eventPayment: function(methodPay){
		var pro_array = [];
		var view_array = [];
		cartJS.items.map((v,i) => {
			var pic = proInCartJS[v.product_id]; // Product in Cart
			var item_pro_array = {
				item_name: v.title,
				price: v.price/100,
				item_brand: v.vendor,
				item_category: pic.type,
				item_list_id: pic.collection_id.length > 0 ? pic.collection_id[0].toString() : '',
				index: 1,
				quantity: cartJS.items[i].quantity,
			};
			var a_spec = proInCartJS[v.product_id].tags.filter(x => x.indexOf('spec_') > -1);
			
			item_pro_array['item_id'] = v.sku;
			item_pro_array['item_variant'] = v.variant_title;
			
			$.each(a_spec, function(m,n){
				var temp = n.split(':');
				item_pro_array[GVN.GA4.changeSpec(temp[0])] = temp[1];
			});						
			view_array.push(item_pro_array);
			pro_array.push(item_pro_array);
		});	
		
		var ecommerce_object = {
			'event': 'add_payment_info',
			'ecommerce': {
				'currency': 'VND',
				'value': cartJS.total_price/100,
				'payment_type': methodPay,
				'items': pro_array
			}
		}
		console.log(ecommerce_object);
		dataLayer.push({ecommerce: null}); 
		dataLayer.push(ecommerce_object);
	},
	logged: function(){
		if(typeof dataLayer == 'object'){
			dataLayer.push({
				'event': 'login',
				'login_type': 'GVN',
				'login_id': '2121315612', //MD5 if using email
				'login_pn': '1919bfc4fa95c7f6b231e583da677a17',
				'login_em': '1919bfc4fa95c7f6b231e583da677a17',
				'loyalty_tier': 'Gold',
			});
		}
	},
	selectItem: function(id){
		var items = [];
		var product = window.shop_tracking[id];
		var item = {
			item_id: product.variants[0].sku,
			item_name: product.title,
			item_brand: product.vendor,
			item_category: product.type,
			item_variant: product.variants[0].title,
			item_list_id: product.collection_id.toString(),
			index: 1,
			price: product.variants[0].price/100
		};
		var a_spec = product.tags.filter(x => x.indexOf('spec_') > -1);
		$.each(a_spec, function(i,v){
			var temp = v.split(':');
			item[GVN.GA4.changeSpec(temp[0])] = temp[1];
		});
		items.push(item);
		
		console.log(items);
		dataLayer.push({
			'event': 'select_item',
			'ecommerce': {
				'currency': 'VND',
				'items': items
			}
		});
	}
}
GVN.Init = function(){
	GVN.Global.init();
	if(window.shop.template.indexOf('index') != -1){
		if(!window.shop.account.logged) {
			if(localStorage.loginback != null && localStorage.loginback != undefined){
				GVN.Helper.accountPopup('acc-login-box');
				localStorage.removeItem('loginback');
				localStorage.removeItem('registerback');
			}
			else if(localStorage.registerback != null && localStorage.registerback != undefined) {
				GVN.Helper.accountPopup('acc-register-box');
				localStorage.removeItem('registerback');
				localStorage.removeItem('loginback');
			}
		}
		GVN.Index.init();
	}
	if(window.shop.template.indexOf('collection') > -1){
		GVN.Collection.init();
	}
	if(window.shop.template.indexOf('collection.new') != -1){
		GVN.Collection.init();
	}
	if(window.shop.template == 'collection.list-item-discount'){
		GVN.CollectionPromo.init();
	}
	if(window.shop.template.indexOf('product') != -1){
		GVN.Product.init();
	}
	if(window.shop.template.indexOf('cart') != -1){
		GVN.Cart.init();
	}
	if(window.shop.template.indexOf('customers') > -1){
		this.Customers.init();
	}
	if(window.shop.template.indexOf('order-tracking') > -1){
		this.OrderTracking.init();
	}
	if(window.shop.template.indexOf('blog') > -1){
		this.Blog.init();
	}
	if(window.shop.template.indexOf('contact') > -1){
		this.Contact.init();
	}
	if(window.shop.template == 'search'){
		this.Search.init();
	}
}
GVN.Global = {
	min_qty: 1,
	variant_id: '',
	imgtodrag: '',
	action: '',
	init: function(){
		var that = this;
		that.cartJS();
		that.randomBannerHead();
		if(window.location.href.indexOf('checkout') == -1){
			if(window.shop_settings.inventory.show) {
				that.inventoryLocation();  
			}
		}
		that.toggleFooter();
		that.searchAuto.init();
		that.setHeightDropdown();
		that.scrollHeader();
		that.ajaxMenuCate();
		that.toggleSidebarMenu();
		//that.toggleSidebarCart();
		that.closeAll();
		that.updateMiniCart();
		that.addToCartLoop();
		that.copyCodeCoupon();
		that.popoverSupport();
		that.copylinkProd();
		that.quickView();
		that.addToCartQv();
		
		that.checkInputAccount();
		that.triggerPopupAcc();
		that.triggerTabPopupAcc();
		that.actionAccount();
		//that.customOTPAcc();
		//that.account.init(); Flow Phone
		
		if(window.shop.template.indexOf('index') != -1 || window.shop.template == 'collection'  ||  window.shop.template.indexOf('collection.new') != -1 || window.shop.template.indexOf('search') != -1){ 
			that.supportCheckGiftPE();
		}
		GVN.Helper.changeQtyItemMiniCart();
		GVN.Helper.deleteItemMiniCartCombo();
		
		that.scrollFixedToolbar();
		that.popupPromotion();
		if(window.shop.template.indexOf('search') == -1){ 
			GVN.Rating.checkRatingLoop();
		}
	},
	cartJS: function(callback){
		var self = this;
		$.ajax({
			type:'GET',
			url: '/cart.js',
			dataType: 'json',
			async: false,
			success: function(data){
				window.cartJS = data;
				$('.count-holder .count').html(data.item_count);
				if(data.customer_id != null){
					window.accountJS.id = data.customer_id;
				}
				else {
					window.accountJS.id = window.shop.account.id;
				}
				
				if(window.cartJS.items.length > 0){
					var listItem = '';
					var query = '/search?q=filter=';
					$.each(window.cartJS.items, function(i,item){
						(listItem == '') ? listItem = '(id:product='+item.product_id+')' : listItem = listItem + '||' + '(id:product='+item.product_id+')';
					});
					if(listItem != ''){
						query += encodeURIComponent('('+listItem+')'); 
						$.ajax({
							type:'GET',
							async: false,
							url: query+'&view=item-cart',
							success: function(search){
								if(!$.isEmptyObject(search)){
									window.proInCartJS = JSON.parse(search);
									window.cartJS.items.filter(x => {
										x.inAdmin = window.proInCartJS[x.product_id];
									});
								}
								if(!isAccount){
									isAccount = true;
									self.accountJS();
								}
								if(typeof callback === 'function') return callback(data);
							},
							error: function(x,y){
								if(!isAccount){
									isAccount = true;
									self.accountJS();
								}
							}
						});
					}
				}
				else {
					if(!isAccount){
						isAccount = true;
						self.accountJS();
					}
				}
			}
		});
	},
	accountJS: function(){
		var self = this;
		function renderDropdownAcc(logged,name){
			var htmlDrop = '';
			if (logged){
				htmlDrop += '<div class="header-dropdown-cover logged-account-dropdown">';
				htmlDrop +=  	'<div class="greeting block--1">';		
				htmlDrop += 	 	'<a href="/account" class="thing">';
				htmlDrop += 		 '<div class="thing-img"><svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_102:3778)"><path d="M3.73909 2.42375L3.62936 2.8938C3.09762 5.15004 2.22365 7.41897 1.02676 9.63384C0.151328 11.2668 -0.175951 13.1255 0.0909153 14.9487C0.400975 17.0265 1.47017 18.9262 3.10282 20.3001C4.73546 21.6741 6.82234 22.4303 8.98149 22.4305H8.98777C10.169 22.4329 11.339 22.2072 12.4298 21.7666C13.5207 21.3259 14.5107 20.6791 15.3425 19.8635L17.1919 18.0604L22.9027 12.5275C23.1619 12.2758 23.3531 11.9658 23.4594 11.625C23.5657 11.2842 23.5838 10.9231 23.5121 10.5739C23.4403 10.2246 23.281 9.89804 23.0482 9.62309C22.8154 9.34815 22.5163 9.13338 22.1776 8.99786L21.9079 8.89069L23.1062 7.72779C23.3136 7.52718 23.4782 7.28876 23.5907 7.02619C23.7031 6.76361 23.7612 6.48205 23.7615 6.19762C23.7619 5.91319 23.7045 5.63148 23.5928 5.36864C23.481 5.1058 23.317 4.86699 23.1101 4.66589L23.0845 4.64097C22.772 4.33651 22.3727 4.13019 21.9384 4.04871L21.7527 4.0144L21.7885 3.83014C21.8143 3.69732 21.8274 3.56247 21.8277 3.4273C21.8282 3.14265 21.7706 2.86073 21.6582 2.59791C21.5457 2.33509 21.3807 2.09662 21.1727 1.89635L21.1408 1.86533C20.7932 1.52722 20.3402 1.31066 19.8526 1.24951C19.365 1.18836 18.8703 1.28607 18.4458 1.52736L18.2467 1.64065L18.1689 1.42912C18.0577 1.13684 17.8826 0.871558 17.6555 0.651661L17.6342 0.630038C17.2172 0.224597 16.6517 -0.00317383 16.062 -0.00317383C15.4723 -0.00317383 14.9068 0.224597 14.4898 0.630038L7.54388 7.38653L8.50776 3.51426C8.58622 3.20813 8.60136 2.88988 8.55231 2.57801C8.50325 2.26614 8.39097 1.96685 8.22199 1.69751C8.05301 1.42818 7.8307 1.19417 7.56795 1.00906C7.3052 0.823961 7.00726 0.691452 6.69142 0.619232C6.37558 0.547012 6.04813 0.536518 5.72808 0.58836C5.40804 0.640203 5.10177 0.753348 4.82706 0.921228C4.55235 1.08911 4.31467 1.30838 4.12782 1.56631C3.94097 1.82424 3.80867 2.11569 3.7386 2.42375H3.73909ZM5.48172 1.79999C5.64955 1.70979 5.83543 1.65592 6.02665 1.64204C6.21788 1.62817 6.40992 1.65463 6.58966 1.71961C6.9019 1.82981 7.16136 2.04815 7.31834 2.33281C7.47533 2.61747 7.5188 2.94843 7.44043 3.26232L6.01442 8.98846C5.94626 9.22349 6.09708 9.45851 6.28077 9.57038C6.3818 9.63055 6.64766 9.74195 6.94157 9.48295L15.2666 1.38776C15.3708 1.28587 15.4948 1.20511 15.6314 1.15017C15.768 1.09522 15.9144 1.06717 16.0622 1.06765C16.2098 1.0672 16.356 1.09517 16.4924 1.14995C16.6288 1.20473 16.7527 1.28523 16.8569 1.38682L16.8777 1.4075C17.0885 1.61275 17.2068 1.89093 17.2068 2.18097C17.2068 2.471 17.0885 2.74918 16.8777 2.95443L11.76 7.93085C11.661 8.03182 11.6065 8.16644 11.6082 8.30596C11.6098 8.44548 11.6676 8.57883 11.769 8.67752C11.8704 8.77621 12.0075 8.83242 12.151 8.83413C12.2945 8.83585 12.433 8.78293 12.5368 8.68669L18.7726 2.62305C18.877 2.52142 19.001 2.44079 19.1375 2.38578C19.274 2.33077 19.4203 2.30246 19.568 2.30246C19.7158 2.30246 19.8621 2.33077 19.9986 2.38578C20.1351 2.44079 20.259 2.52142 20.3635 2.62305L20.3992 2.65125C20.5039 2.75292 20.5869 2.87364 20.6435 3.00652C20.7001 3.1394 20.7293 3.28182 20.7293 3.42566C20.7293 3.5695 20.7001 3.71192 20.6435 3.8448C20.5869 3.97768 20.5039 4.0984 20.3992 4.20007L18.7267 5.81986C17.1823 7.31556 15.4802 8.96355 14.1465 10.2562C14.0917 10.3047 14.0476 10.3635 14.0168 10.4291C13.9859 10.4947 13.9691 10.5656 13.9673 10.6377C13.9654 10.7098 13.9786 10.7815 14.006 10.8484C14.0334 10.9154 14.0745 10.9763 14.1267 11.0274C14.179 11.0786 14.2413 11.1189 14.31 11.146C14.3788 11.173 14.4524 11.1863 14.5265 11.1849C14.6006 11.1836 14.6737 11.1676 14.7413 11.1381C14.809 11.1085 14.8697 11.066 14.92 11.013L14.9238 11.0092C16.1662 9.80588 19.5369 6.54091 20.7212 5.3954C20.9324 5.19126 21.2181 5.07668 21.5159 5.07668C21.8137 5.07668 22.0994 5.19126 22.3106 5.3954L22.3362 5.42032C22.4413 5.52196 22.5247 5.64281 22.5816 5.77591C22.6386 5.90902 22.6679 6.05175 22.6679 6.1959C22.6679 6.34005 22.6386 6.48278 22.5816 6.61588C22.5247 6.74898 22.4413 6.86983 22.3362 6.97148L21.5662 7.71745C19.7858 9.43877 17.4278 11.7232 15.8752 13.2274C15.7722 13.3276 15.7144 13.4634 15.7144 13.6051C15.7144 13.7467 15.7722 13.8825 15.8752 13.9827C15.9261 14.0324 15.9867 14.0718 16.0533 14.0987C16.12 14.1256 16.1914 14.1394 16.2636 14.1394C16.3357 14.1394 16.4072 14.1256 16.4738 14.0987C16.5405 14.0718 16.601 14.0324 16.652 13.9827L20.0575 10.6835L20.5409 10.2172C20.7525 10.0144 21.038 9.90098 21.3352 9.90168C21.6323 9.90239 21.9172 10.0171 22.1279 10.2209C22.3388 10.4263 22.4572 10.7046 22.4572 10.9949C22.4572 11.2851 22.3388 11.5635 22.1279 11.7688L16.4151 17.3051L14.5647 19.1091C13.8347 19.8249 12.9658 20.3927 12.0083 20.7794C11.0509 21.1662 10.024 21.3642 8.98729 21.3621H8.98149C7.08659 21.3618 5.25514 20.698 3.82228 19.4923C2.38941 18.2865 1.45093 16.6194 1.17855 14.7959C0.943867 13.1952 1.23127 11.5633 2.00032 10.1297C3.24167 7.83261 4.15045 5.47625 4.70152 3.13023L4.81125 2.66018C4.85293 2.4784 4.93439 2.30747 5.05008 2.15904C5.16578 2.01061 5.313 1.88815 5.48172 1.79999Z" fill="black"></path><path d="M21.9702 17.1911C21.9299 17.0929 21.8606 17.0086 21.7709 16.9487C21.6813 16.8889 21.5754 16.8563 21.4667 16.855C21.358 16.8538 21.2513 16.8839 21.1602 16.9417C21.0692 16.9994 20.9978 17.0821 20.9551 17.1794C20.6669 17.8309 20.2407 18.416 19.7043 18.8965C19.1679 19.377 18.5333 19.7422 17.842 19.9682C17.7735 19.9904 17.7101 20.0255 17.6555 20.0715C17.6009 20.1175 17.5561 20.1735 17.5238 20.2364C17.4914 20.2992 17.4721 20.3676 17.467 20.4377C17.4618 20.5078 17.4709 20.5781 17.4937 20.6448C17.5166 20.7115 17.5527 20.7731 17.6 20.8262C17.6473 20.8793 17.7049 20.9228 17.7695 20.9543C17.8341 20.9857 17.9045 21.0045 17.9766 21.0095C18.0486 21.0145 18.121 21.0057 18.1896 20.9835C19.0285 20.7097 19.7985 20.2667 20.4492 19.6835C21.0999 19.1002 21.6165 18.39 21.9654 17.5991C21.9939 17.5348 22.009 17.4656 22.0098 17.3956C22.0106 17.3256 21.9972 17.2561 21.9702 17.1911Z" fill="black"></path><path d="M23.6674 17.8925C23.599 17.8641 23.5253 17.8494 23.4509 17.8492C23.3434 17.8495 23.2384 17.8802 23.1487 17.9378C23.0591 17.9953 22.9887 18.0771 22.9462 18.1731C22.559 19.0467 21.9916 19.8337 21.2791 20.4856C20.5666 21.1375 19.7243 21.6403 18.804 21.9631C18.7361 21.9868 18.6737 22.0232 18.6203 22.0704C18.5669 22.1175 18.5235 22.1744 18.4928 22.2378C18.462 22.3012 18.4443 22.3699 18.4408 22.44C18.4373 22.51 18.4481 22.5801 18.4724 22.6461C18.4968 22.7121 18.5342 22.7728 18.5827 22.8248C18.6312 22.8767 18.6897 22.9188 18.7549 22.9488C18.8201 22.9787 18.8908 22.9959 18.9628 22.9993C19.0349 23.0027 19.1069 22.9922 19.1748 22.9686C20.2368 22.5961 21.2089 22.0158 22.031 21.2634C22.853 20.511 23.5076 19.6025 23.9541 18.5943C24.0114 18.4642 24.0134 18.3174 23.9597 18.1859C23.906 18.0544 23.8009 17.9489 23.6674 17.8925Z" fill="black"></path></g><defs><clipPath id="clip0_102:3778"><rect width="24" height="23" fill="white"></rect></clipPath></defs></svg></div>';
				htmlDrop += 		 '<div class="d-flex flex-column"><div class="thing-name">Xin chÃ o, '+name+'</div></div>';
				htmlDrop += 	 	'</a>';
				htmlDrop += 	'</div>';
				htmlDrop += 	'<div class="block block--2">';
				htmlDrop += 		'<ul>';
				htmlDrop += 			'<li>';
				htmlDrop += 				'<a href="/account#orders-history" class="thing">';
				htmlDrop += 					'<div class="thing-img"><svg viewBox="0 0 18 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.9637 2.95195H10.7919C10.373 1.79337 9.27584 0.954399 7.97918 0.954399C6.68252 0.954399 5.58535 1.79337 5.16643 2.95195H1.99461C0.897441 2.95195 -0.000244141 3.85085 -0.000244141 4.9495L0.0462926 21.0481C0.0462926 22.1467 0.943978 23.0456 2.04115 23.0456H8.13543C7.54533 22.4721 7.32914 22.1792 6.98295 21.4322H1.67845L1.63191 4.58457H3.98947V5.39127C3.98947 6.48992 4.88715 7.38882 5.98432 7.38882H9.97404C11.0712 7.38882 11.9689 6.48992 11.9689 5.39127V4.58457H14.2811V10.4389C14.9893 10.5388 15.3402 10.7486 15.9586 11.0382V4.9495C15.9586 3.85085 15.0609 2.95195 13.9637 2.95195ZM7.97918 5.39127C7.34445 5.39127 6.52838 4.98792 6.52838 3.95073C6.52838 3.37451 6.93641 2.56781 7.97918 2.56781C8.52777 2.56781 9.38465 2.98544 9.38465 3.95073C9.38465 4.91601 8.65794 5.39127 7.97918 5.39127ZM13.0129 13.0579C10.26 13.0579 8.02572 15.2951 8.02572 18.0517C8.02572 20.8084 10.26 23.0456 13.0129 23.0456C15.7658 23.0456 18 20.8084 18 18.0517C18 15.2951 15.7658 13.0579 13.0129 13.0579ZM14.2995 20.0493L12.6538 18.4013C12.5607 18.3085 12.5071 18.1832 12.5042 18.0517V15.5648C12.5042 15.2851 12.7236 15.0654 13.0029 15.0654C13.2822 15.0654 13.5016 15.2851 13.5016 15.5648V17.852L14.9977 19.3501C15.0443 19.3959 15.0814 19.4504 15.1069 19.5106C15.1323 19.5708 15.1456 19.6354 15.1459 19.7007C15.1462 19.7661 15.1336 19.8308 15.1088 19.8913C15.084 19.9517 15.0474 20.0066 15.0013 20.0528C14.9551 20.099 14.9003 20.1356 14.84 20.1605C14.7796 20.1853 14.7149 20.198 14.6497 20.1976C14.5844 20.1973 14.5199 20.184 14.4598 20.1586C14.3997 20.1331 14.3452 20.096 14.2995 20.0493Z" fill="#111111"></path></svg></div>';
				htmlDrop += 					'<div class="d-flex flex-column"><div class="thing-name">ÄÆ¡n hÃ ng cá»§a tÃ´i</div></div>';
				htmlDrop += 				'</a>';
				htmlDrop += 			'</li>';
				htmlDrop += 			'<li>';
				htmlDrop += 				'<a href="/account#viewed" class="thing">';
				htmlDrop += 					'<div class="thing-img"><svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_102:3796)"><path d="M10.5986 3.39478C9.67363 3.39956 8.78029 3.74768 8.07779 4.37711C7.37529 5.00654 6.90924 5.8764 6.76271 6.8317H5.54053L7.31269 8.68528L9.08485 6.8317H7.98167C8.11946 6.20742 8.45754 5.65134 8.93962 5.25606C9.4217 4.86078 10.0187 4.65014 10.6312 4.65922C11.2437 4.66831 11.8347 4.89656 12.3059 5.30598C12.7771 5.71539 13.0999 6.28127 13.2207 6.90939C13.3416 7.5375 13.253 8.18995 12.9699 8.7581C12.6868 9.32625 12.2261 9.77581 11.6646 10.0319C11.1031 10.2881 10.4747 10.3353 9.88399 10.1657C9.29327 9.99622 8.7759 9.62016 8.41801 9.10018L8.38692 9.05421L7.41132 9.78869L7.44242 9.83466C7.83121 10.4001 8.35237 10.8517 8.95593 11.146C9.55948 11.4403 10.2252 11.5675 10.8893 11.5154C11.5533 11.4633 12.1934 11.2336 12.7483 10.8484C13.3031 10.4632 13.754 9.93542 14.0578 9.3156C14.3616 8.69577 14.508 8.00471 14.4831 7.30868C14.4582 6.61264 14.2628 5.93497 13.9155 5.34063C13.5683 4.7463 13.0809 4.25522 12.5001 3.91449C11.9193 3.57376 11.2646 3.39481 10.5986 3.39478Z" fill="black"></path><path d="M9.99414 5.68567V8.10217L11.7009 9.17305L12.3206 8.09544L11.197 7.39011V5.68567H9.99414Z" fill="black"></path><path d="M20.8664 7.03353C20.6788 6.76553 16.2082 0.460205 10.4994 0.460205C4.79052 0.460205 0.319934 6.76553 0.132319 7.03353C0.0455564 7.1575 -0.0012207 7.30713 -0.0012207 7.46076C-0.0012207 7.61439 0.0455564 7.76403 0.132319 7.888C0.319934 8.156 4.79052 14.4602 10.4994 14.4602C16.2082 14.4602 20.6842 8.156 20.8664 7.888C20.9532 7.76403 21 7.61439 21 7.46076C21 7.30713 20.9532 7.1575 20.8664 7.03353ZM10.4994 13.0137C6.29358 13.0137 2.65171 8.82881 1.57319 7.46076C2.64528 6.09272 6.29037 1.9101 10.4994 1.9101C14.7084 1.9101 18.346 6.09385 19.4256 7.46189C18.3481 8.82993 14.7137 13.0137 10.4994 13.0137Z" fill="black"></path></g><defs><clipPath id="clip0_102:3796"><rect width="21" height="14" fill="white" transform="translate(0 0.460205)"></rect></clipPath></defs></svg></div>';
				htmlDrop += 					'<div class="d-flex flex-column"><div class="thing-name">ÄÃ£ xem gáº§n Ä‘Ã¢y</div></div>';
				htmlDrop += 				'</a>';
				htmlDrop += 			'</li>';
				htmlDrop += 		'</ul>';
				htmlDrop += 	'</div>';
				htmlDrop += 	'<div class="block block--4">';
				htmlDrop += 		'<ul>';
				htmlDrop += 			'<li>';
				htmlDrop += 				'<a href="#" class="thing js-btn-logout">';
				htmlDrop += 					'<div class="thing-img"><svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path d="M20.343 9.84414H12.0307C11.6685 9.84414 11.3745 9.55015 11.3745 9.18791C11.3745 8.82567 11.6685 8.53168 12.0307 8.53168H20.343C20.7053 8.53168 20.9993 8.82567 20.9993 9.18791C20.9993 9.55015 20.7053 9.84414 20.343 9.84414Z" fill="black"></path><path d="M17.0618 13.1252C16.8938 13.1252 16.7259 13.0613 16.598 12.9328C16.3417 12.6763 16.3417 12.2607 16.598 12.0044L19.4155 9.18704L16.598 6.36955C16.3417 6.11321 16.3417 5.69762 16.598 5.44128C16.8545 5.18478 17.2701 5.18478 17.5264 5.44128L20.8076 8.72242C21.0639 8.97876 21.0639 9.39435 20.8076 9.65069L17.5264 12.9318C17.3978 13.0613 17.2299 13.1252 17.0618 13.1252Z" fill="black"></path><path d="M6.99983 21.0006C6.81255 21.0006 6.63487 20.9743 6.45736 20.9192L1.19166 19.1649C0.47519 18.9147 0 18.2471 0 17.5008V1.75128C0 0.786162 0.78488 0.00128174 1.75 0.00128174C1.93713 0.00128174 2.1148 0.0275566 2.29248 0.0826696L7.55801 1.83699C8.27464 2.08725 8.74967 2.75485 8.74967 3.50112V19.2506C8.74967 20.2157 7.96495 21.0006 6.99983 21.0006ZM1.75 1.31374C1.50936 1.31374 1.31246 1.51064 1.31246 1.75128V17.5008C1.31246 17.6871 1.43758 17.8603 1.61606 17.9225L6.85709 19.6689C6.89474 19.6811 6.94376 19.6882 6.99983 19.6882C7.24047 19.6882 7.43721 19.4913 7.43721 19.2506V3.50112C7.43721 3.31479 7.31209 3.1416 7.13361 3.07944L1.89259 1.33297C1.85494 1.32079 1.80591 1.31374 1.75 1.31374Z" fill="black"></path><path d="M13.3433 7.00051C12.981 7.00051 12.687 6.70652 12.687 6.34428V2.4069C12.687 1.80402 12.1963 1.31313 11.5934 1.31313H1.74998C1.38774 1.31313 1.09375 1.01914 1.09375 0.656901C1.09375 0.294661 1.38774 0.000671387 1.74998 0.000671387H11.5934C12.9208 0.000671387 13.9995 1.07954 13.9995 2.4069V6.34428C13.9995 6.70652 13.7055 7.00051 13.3433 7.00051Z" fill="black"></path><path d="M11.5935 18.3751H8.09349C7.73125 18.3751 7.43726 18.0811 7.43726 17.7188C7.43726 17.3566 7.73125 17.0626 8.09349 17.0626H11.5935C12.1964 17.0626 12.6871 16.5717 12.6871 15.9688V12.0315C12.6871 11.6692 12.9811 11.3752 13.3433 11.3752C13.7056 11.3752 13.9996 11.6692 13.9996 12.0315V15.9688C13.9996 17.2962 12.9208 18.3751 11.5935 18.3751Z" fill="black"></path></g></svg></div>';
				htmlDrop += 					'<div class="d-flex flex-column"><div class="thing-name">ÄÄƒng xuáº¥t</div></div>';
				htmlDrop += 				'</a>';
				htmlDrop += 			'</li>';
				htmlDrop += 		'</ul>';
				htmlDrop += 	'</div>';
				htmlDrop += '</div>';
			}
			else {
				htmlDrop += '<div class="header-dropdown-cover not-logged-account-dropdown">';
				htmlDrop +=  	'<div class="greeting block--1">';		
				htmlDrop += 	 	'<div class="thing">';
				htmlDrop += 		 '<div class="thing-img"><svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_102:3778)"><path d="M3.73909 2.42375L3.62936 2.8938C3.09762 5.15004 2.22365 7.41897 1.02676 9.63384C0.151328 11.2668 -0.175951 13.1255 0.0909153 14.9487C0.400975 17.0265 1.47017 18.9262 3.10282 20.3001C4.73546 21.6741 6.82234 22.4303 8.98149 22.4305H8.98777C10.169 22.4329 11.339 22.2072 12.4298 21.7666C13.5207 21.3259 14.5107 20.6791 15.3425 19.8635L17.1919 18.0604L22.9027 12.5275C23.1619 12.2758 23.3531 11.9658 23.4594 11.625C23.5657 11.2842 23.5838 10.9231 23.5121 10.5739C23.4403 10.2246 23.281 9.89804 23.0482 9.62309C22.8154 9.34815 22.5163 9.13338 22.1776 8.99786L21.9079 8.89069L23.1062 7.72779C23.3136 7.52718 23.4782 7.28876 23.5907 7.02619C23.7031 6.76361 23.7612 6.48205 23.7615 6.19762C23.7619 5.91319 23.7045 5.63148 23.5928 5.36864C23.481 5.1058 23.317 4.86699 23.1101 4.66589L23.0845 4.64097C22.772 4.33651 22.3727 4.13019 21.9384 4.04871L21.7527 4.0144L21.7885 3.83014C21.8143 3.69732 21.8274 3.56247 21.8277 3.4273C21.8282 3.14265 21.7706 2.86073 21.6582 2.59791C21.5457 2.33509 21.3807 2.09662 21.1727 1.89635L21.1408 1.86533C20.7932 1.52722 20.3402 1.31066 19.8526 1.24951C19.365 1.18836 18.8703 1.28607 18.4458 1.52736L18.2467 1.64065L18.1689 1.42912C18.0577 1.13684 17.8826 0.871558 17.6555 0.651661L17.6342 0.630038C17.2172 0.224597 16.6517 -0.00317383 16.062 -0.00317383C15.4723 -0.00317383 14.9068 0.224597 14.4898 0.630038L7.54388 7.38653L8.50776 3.51426C8.58622 3.20813 8.60136 2.88988 8.55231 2.57801C8.50325 2.26614 8.39097 1.96685 8.22199 1.69751C8.05301 1.42818 7.8307 1.19417 7.56795 1.00906C7.3052 0.823961 7.00726 0.691452 6.69142 0.619232C6.37558 0.547012 6.04813 0.536518 5.72808 0.58836C5.40804 0.640203 5.10177 0.753348 4.82706 0.921228C4.55235 1.08911 4.31467 1.30838 4.12782 1.56631C3.94097 1.82424 3.80867 2.11569 3.7386 2.42375H3.73909ZM5.48172 1.79999C5.64955 1.70979 5.83543 1.65592 6.02665 1.64204C6.21788 1.62817 6.40992 1.65463 6.58966 1.71961C6.9019 1.82981 7.16136 2.04815 7.31834 2.33281C7.47533 2.61747 7.5188 2.94843 7.44043 3.26232L6.01442 8.98846C5.94626 9.22349 6.09708 9.45851 6.28077 9.57038C6.3818 9.63055 6.64766 9.74195 6.94157 9.48295L15.2666 1.38776C15.3708 1.28587 15.4948 1.20511 15.6314 1.15017C15.768 1.09522 15.9144 1.06717 16.0622 1.06765C16.2098 1.0672 16.356 1.09517 16.4924 1.14995C16.6288 1.20473 16.7527 1.28523 16.8569 1.38682L16.8777 1.4075C17.0885 1.61275 17.2068 1.89093 17.2068 2.18097C17.2068 2.471 17.0885 2.74918 16.8777 2.95443L11.76 7.93085C11.661 8.03182 11.6065 8.16644 11.6082 8.30596C11.6098 8.44548 11.6676 8.57883 11.769 8.67752C11.8704 8.77621 12.0075 8.83242 12.151 8.83413C12.2945 8.83585 12.433 8.78293 12.5368 8.68669L18.7726 2.62305C18.877 2.52142 19.001 2.44079 19.1375 2.38578C19.274 2.33077 19.4203 2.30246 19.568 2.30246C19.7158 2.30246 19.8621 2.33077 19.9986 2.38578C20.1351 2.44079 20.259 2.52142 20.3635 2.62305L20.3992 2.65125C20.5039 2.75292 20.5869 2.87364 20.6435 3.00652C20.7001 3.1394 20.7293 3.28182 20.7293 3.42566C20.7293 3.5695 20.7001 3.71192 20.6435 3.8448C20.5869 3.97768 20.5039 4.0984 20.3992 4.20007L18.7267 5.81986C17.1823 7.31556 15.4802 8.96355 14.1465 10.2562C14.0917 10.3047 14.0476 10.3635 14.0168 10.4291C13.9859 10.4947 13.9691 10.5656 13.9673 10.6377C13.9654 10.7098 13.9786 10.7815 14.006 10.8484C14.0334 10.9154 14.0745 10.9763 14.1267 11.0274C14.179 11.0786 14.2413 11.1189 14.31 11.146C14.3788 11.173 14.4524 11.1863 14.5265 11.1849C14.6006 11.1836 14.6737 11.1676 14.7413 11.1381C14.809 11.1085 14.8697 11.066 14.92 11.013L14.9238 11.0092C16.1662 9.80588 19.5369 6.54091 20.7212 5.3954C20.9324 5.19126 21.2181 5.07668 21.5159 5.07668C21.8137 5.07668 22.0994 5.19126 22.3106 5.3954L22.3362 5.42032C22.4413 5.52196 22.5247 5.64281 22.5816 5.77591C22.6386 5.90902 22.6679 6.05175 22.6679 6.1959C22.6679 6.34005 22.6386 6.48278 22.5816 6.61588C22.5247 6.74898 22.4413 6.86983 22.3362 6.97148L21.5662 7.71745C19.7858 9.43877 17.4278 11.7232 15.8752 13.2274C15.7722 13.3276 15.7144 13.4634 15.7144 13.6051C15.7144 13.7467 15.7722 13.8825 15.8752 13.9827C15.9261 14.0324 15.9867 14.0718 16.0533 14.0987C16.12 14.1256 16.1914 14.1394 16.2636 14.1394C16.3357 14.1394 16.4072 14.1256 16.4738 14.0987C16.5405 14.0718 16.601 14.0324 16.652 13.9827L20.0575 10.6835L20.5409 10.2172C20.7525 10.0144 21.038 9.90098 21.3352 9.90168C21.6323 9.90239 21.9172 10.0171 22.1279 10.2209C22.3388 10.4263 22.4572 10.7046 22.4572 10.9949C22.4572 11.2851 22.3388 11.5635 22.1279 11.7688L16.4151 17.3051L14.5647 19.1091C13.8347 19.8249 12.9658 20.3927 12.0083 20.7794C11.0509 21.1662 10.024 21.3642 8.98729 21.3621H8.98149C7.08659 21.3618 5.25514 20.698 3.82228 19.4923C2.38941 18.2865 1.45093 16.6194 1.17855 14.7959C0.943867 13.1952 1.23127 11.5633 2.00032 10.1297C3.24167 7.83261 4.15045 5.47625 4.70152 3.13023L4.81125 2.66018C4.85293 2.4784 4.93439 2.30747 5.05008 2.15904C5.16578 2.01061 5.313 1.88815 5.48172 1.79999Z" fill="black"></path><path d="M21.9702 17.1911C21.9299 17.0929 21.8606 17.0086 21.7709 16.9487C21.6813 16.8889 21.5754 16.8563 21.4667 16.855C21.358 16.8538 21.2513 16.8839 21.1602 16.9417C21.0692 16.9994 20.9978 17.0821 20.9551 17.1794C20.6669 17.8309 20.2407 18.416 19.7043 18.8965C19.1679 19.377 18.5333 19.7422 17.842 19.9682C17.7735 19.9904 17.7101 20.0255 17.6555 20.0715C17.6009 20.1175 17.5561 20.1735 17.5238 20.2364C17.4914 20.2992 17.4721 20.3676 17.467 20.4377C17.4618 20.5078 17.4709 20.5781 17.4937 20.6448C17.5166 20.7115 17.5527 20.7731 17.6 20.8262C17.6473 20.8793 17.7049 20.9228 17.7695 20.9543C17.8341 20.9857 17.9045 21.0045 17.9766 21.0095C18.0486 21.0145 18.121 21.0057 18.1896 20.9835C19.0285 20.7097 19.7985 20.2667 20.4492 19.6835C21.0999 19.1002 21.6165 18.39 21.9654 17.5991C21.9939 17.5348 22.009 17.4656 22.0098 17.3956C22.0106 17.3256 21.9972 17.2561 21.9702 17.1911Z" fill="black"></path><path d="M23.6674 17.8925C23.599 17.8641 23.5253 17.8494 23.4509 17.8492C23.3434 17.8495 23.2384 17.8802 23.1487 17.9378C23.0591 17.9953 22.9887 18.0771 22.9462 18.1731C22.559 19.0467 21.9916 19.8337 21.2791 20.4856C20.5666 21.1375 19.7243 21.6403 18.804 21.9631C18.7361 21.9868 18.6737 22.0232 18.6203 22.0704C18.5669 22.1175 18.5235 22.1744 18.4928 22.2378C18.462 22.3012 18.4443 22.3699 18.4408 22.44C18.4373 22.51 18.4481 22.5801 18.4724 22.6461C18.4968 22.7121 18.5342 22.7728 18.5827 22.8248C18.6312 22.8767 18.6897 22.9188 18.7549 22.9488C18.8201 22.9787 18.8908 22.9959 18.9628 22.9993C19.0349 23.0027 19.1069 22.9922 19.1748 22.9686C20.2368 22.5961 21.2089 22.0158 22.031 21.2634C22.853 20.511 23.5076 19.6025 23.9541 18.5943C24.0114 18.4642 24.0134 18.3174 23.9597 18.1859C23.906 18.0544 23.8009 17.9489 23.6674 17.8925Z" fill="black"></path></g><defs><clipPath id="clip0_102:3778"><rect width="24" height="23" fill="white"></rect></clipPath></defs></svg></div>';
				htmlDrop += 		 '<div class="d-flex flex-column"><div class="thing-name">Xin chÃ o, vui lÃ²ng Ä‘Äƒng nháº­p</div></div>';
				htmlDrop += 	 	'</div>';
				htmlDrop += 	 	'<div class="actions">';
				htmlDrop += 		 	'<button class="js-account" data-box="acc-login-box">ÄÄ‚NG NHáº¬P</button>';
				htmlDrop += 		 '<button class="js-account" data-box="acc-register-box">ÄÄ‚NG KÃ</button>';
				htmlDrop += 	 	'</div>';
				htmlDrop +=  	'</div>';
				htmlDrop += 	'<div class="block block--3">';
				htmlDrop += 		'<ul>';
				htmlDrop += 			'<li>';
				htmlDrop += 				'<a href="/pages/faq" class="thing">';
				htmlDrop += 					'<div class="thing-img"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 0C4.47305 0 0 4.47266 0 10C0 15.5273 4.47266 20 10 20C15.5273 20 20 15.5273 20 10C20 4.47266 15.5273 0 10 0ZM10 18.6047C5.25547 18.6047 1.39531 14.7445 1.39531 10C1.39531 5.25547 5.25547 1.39531 10 1.39531C14.7445 1.39531 18.6047 5.25547 18.6047 10C18.6047 14.7445 14.7445 18.6047 10 18.6047Z" fill="black"></path><path d="M9.7045 12.6531C9.43777 12.656 9.18298 12.7641 8.99561 12.954C8.80824 13.1438 8.70347 13.4 8.7041 13.6667C8.7041 14.2066 9.13809 14.6804 9.7045 14.6804C9.96247 14.6644 10.2046 14.5506 10.3816 14.3623C10.5586 14.1739 10.6572 13.9252 10.6572 13.6667C10.6572 13.4083 10.5586 13.1595 10.3816 12.9712C10.2046 12.7829 9.96247 12.6691 9.7045 12.6531Z" fill="black"></path><path d="M9.87519 4.97937C8.09824 4.97937 7.28223 6.03406 7.28223 6.74304C7.28223 7.25671 7.7166 7.49343 8.07207 7.49343C8.783 7.49343 8.49316 6.47781 9.83574 6.47781C10.4939 6.47781 11.0205 6.76765 11.0205 7.37312C11.0205 8.08406 10.2834 8.49187 9.84863 8.86062C9.46699 9.18953 8.9666 9.72937 8.9666 10.8614C8.9666 11.5458 9.15097 11.743 9.69081 11.743C10.3357 11.743 10.4674 11.4536 10.4674 11.2036C10.4674 10.5188 10.4803 10.1243 11.2045 9.55828C11.5599 9.28171 12.6787 8.3864 12.6787 7.14929C12.6787 5.91218 11.5603 4.97937 9.87519 4.97937Z" fill="black"></path></svg></div>';
				htmlDrop += 					'<div class="d-flex flex-column"><div class="thing-name">Trá»£ giÃºp</div></div>';
				htmlDrop += 				'</a>';
				htmlDrop += 			'</li>';
				htmlDrop += 		'</ul>';
				htmlDrop += 	'</div>';
				htmlDrop += '</div>';
			}			
			return htmlDrop;
		}
		$.ajax({
			type:'GET',
			url: '/account.js',
			dataType: 'json',
			success: function(account){
				var id = window.accountJS.id;
				var user_info = localStorage.getItem('user_info');
				if(account.email != '' && account.email != undefined){
					window.accountJS = account;
					window.accountJS['id'] = id;
					window.accountJS['logged'] = true;
					GVN.Rating.appRating.customerId = id;
					GVN.Rating.appRating.customerEmail = account.email;
				}
				if(account.first_name != null && account.last_name != '') {
					$("#site-account-handle .txtnw").html('Xin chÃ o');
					$("#site-account-handle .txtbl").html(account.last_name+' '+account.first_name);
					$(".about-smember a span:not(.icon)").html(account.last_name+' '+account.first_name);
					window.accountJS['id'] = id;
					window.accountJS['logged'] = true;
					GVN.Rating.appRating.customerId = id;
					GVN.Rating.appRating.customerEmail = account.email;
				}
				if(window.accountJS['logged'] == true){
					$("#site-account-handle .txtnw").html('Xin chÃ o');
					$("#site-account-handle .txtbl").html(account.last_name+' '+account.first_name);
					$(".about-smember a span:not(.icon)").html(account.last_name+' '+account.first_name);
					$(".main-header--ordertracking .header-action__link").attr('href','/account#orders-history').removeClass('js-account');
					$(".header-action_text").addClass('logged');
					var accAjax =  renderDropdownAcc(true,account.last_name+' '+account.first_name);
					$('.header-action_dropdown.account-dropdown').append(accAjax);
				}
				else {
					$("#site-account-handle .txtnw").html('ÄÄƒng');
					$("#site-account-handle .txtbl").html('nháº­p');
					$(".about-smember a span:not(.icon)").html('TÃ i khoáº£n');
					$(".header-action_text").removeClass('logged');
					$(".main-header--ordertracking .header-action__link").attr('href','#').addClass('js-account');
					var accAjax = renderDropdownAcc(false);
					$('.header-action_dropdown.account-dropdown').append(accAjax);
				}
				/*
				if(user_info != null && user_info != undefined){
					user_info = JSON.parse(user_info);
					$("#site-account-handle .txtnw").html('Xin chÃ o');
					$("#site-account-handle .txtbl").html(user_info.last_name+' '+user_info.first_name);
					if(account.phone != null){
						if((account.email == '' || account.email == null) && user_info.hasOwnProperty('email') && user_info.email != ''){
							$.ajax({
								url: '/apps/gvnes/auth/api/customers/update',
								type: 'POST',
								data: {
									"email": user_info.email,
									"first_name": user_info.first_name,
									"last_name": user_info.last_name
								},
								success: function(response){
									if(!response.error){
										localStorage.removeItem('user_info');
										window.accountJS.email = response.data.email;
										window.accountJS.first_name = response.data.first_name;
										window.accountJS.last_name = response.data.last_name;
										window.accountJS.logged = true;
										$("#site-account-handle .txtnw").html('Xin chÃ o');
										$("#site-account-handle .txtbl").html(response.data.last_name+' '+response.data.first_name);
									}
								}
							});
						}
					}
					else{
						localStorage.removeItem('user_info');
					}
				}
				*/
			}
		});
	},
	randomBannerHead: function(){
		var lis = $('.top-header .list-banners .item-banner').length;
		var random = Math.floor(Math.random() * (lis - 0 )) ;
		$('.top-header .list-banners .item-banner').eq(random).addClass('active');
		$('.top-header .list-banners .item-banner').eq(random).parents('.list-banners').css('background-color',$('.top-header .list-banners .item-banner').eq(random).attr("data-bg"));
		setTimeout(function() {
			$('.top-header .list-banners .item-banner').eq(random).parents('.list-banners').css('height','auto');
		},3000);
		//console.log(random);
	},
	inventoryLocation: function(){	
		if($('.main-header--area').length > 0){
			if(localStorage.my_location != null && localStorage.my_location != undefined){
				$('.location .header-action_dropdown .chooseLocation span').text(localStorage.my_location);
				$('.location .header-action_dropdown .chooseLocation span').attr('data-id',localStorage.location_id);
				$('.location .header-action__link .shiptoHere').html('<span class="txt-overflow">'+ localStorage.my_location +'</span>');
				
				if(window.cartJS != null && window.cartJS.location_id == null){
					$.post('/location.js?locationId='+localStorage.location_id).done(function(data){
						if(data.error == false){
							window.location.reload();
						}			
					});		
				}			
			}
			else{						 
				var txtAddress = $('.location .header-action_dropdown .chooseLocation span').text();
				var idAddress = $('.location .header-action_dropdown .chooseLocation span').data('id');
				var provinceAddress = $('.location .header-action_dropdown .chooseLocation span').data('province');
				
				$('.location .header-action__link .shiptoHere').html('<span class="txt-overflow">'+ txtAddress +'</span>');
				$('.header-market .store-name span').html('<span class="txt-overflow">'+ txtAddress +'</span>');

				if (locationHeader){				
					$('body').addClass('location-noscroll');
					$('.header-action_area .header-action_text').addClass('overlays');
					setTimeout(function() {
						$('#site-locale-handle').trigger('click');				
					}, 600)	
				}
				else{
					localStorage.my_location = txtAddress;
					localStorage.location_id = idAddress;
					localStorage.location_province = provinceAddress;
					$.post('/location.js?locationId='+localStorage.location_id).done(function(data){
						if(data.error == false){
							window.location.reload();
						}	
					});		
				}

			}
		}
		$(document).on('click', '.listprov li', function(){
			var mylocation = $(this).text(),
					mylocation_id = $(this).data('id'),
					mylocation_province = $(this).data('province');
			localStorage.my_location = mylocation;
			localStorage.location_id = mylocation_id;
			localStorage.location_province = mylocation_province;
			$('.header-action_area .header-action_text').removeClass('overlays');
			$('body').removeClass('location-noscroll');
			$('.location .header-action_dropdown .chooseLocation span').text(mylocation);
			$('.location .header-action_dropdown .chooseLocation span').attr('data-id',mylocation_id);
			$('.location .header-action_dropdown .chooseLocation span').attr('data-province',mylocation_province);
			$('.location .header-action__link .shiptoHere').removeClass('d-none').html('<span class="txt-overflow">'+ mylocation +'</span>');
			$('#site-locale-handle').trigger('click');		
			$.post('/location.js?locationId='+localStorage.location_id).done(function(data){
				if(data.error == false){
					window.location.reload();
				}			
			});		
		});	
		if ($(".location .boxfilter").length > 0) {
			var option_province = '<option value="null">- Chá»n Tá»‰nh/ThÃ nh -</option>';
			var option_district = '<option value="null">- Chá»n Quáº­n/Huyá»‡n -</option>';
			$.each(newStore, function(i,v){
				option_province += '<option value="'+i+'">'+i+'</option>';
			});
			$('.filter-province').html(option_province);
			$('.filter-district').html(option_district);
			$('.filter-province').change(function(){
				var province = $(this).val();	
				var option_province_new = '<option value="null">- Chá»n Quáº­n/Huyá»‡n -</option>';
				if(province != "null" && province != '' ){
					$('.listprov li[data-province!="'+province+'"]').hide();
					$('.listprov li[data-province="'+province+'"]').show();
					//localStorage.setItem('location_province',province);		
					if(newStore[province]){
						$.each(newStore[province], function(i,v){						
							option_province_new += '<option value="'+ i +'">'+ i +'</option>';
						});
						$('.filter-district').html(option_province_new);
					}
				}
				else{
					$('.listprov li').show();
				}
			});				
			$('.filter-district').change(function(){
				var district = $(this).val();
				var province = $('.filter-province').val();
				if(district != "null" && district != ''){
					//localStorage.setItem('location_district',province);
					$('.listprov li[data-district!="'+district+'"]').hide();
					$('.listprov li[data-district="'+district+'"]').show();
				}
				else{
					if(province != "null" && province != ''){
						$('.listprov li[data-province!="'+province+'"]').hide();
						$('.listprov li[data-province="'+province+'"]').show();
					}
					else{
						$('.listprov li').show();
					}
				}
			});
			if(localStorage.location_province != null && localStorage.location_province != undefined){
				$('.filter-province').val(localStorage.location_province).change();
			}
		}
	},
	setHeightDropdown: function(){
		if(!(window.shop.template.indexOf('customers') > -1) && !(window.location.href.indexOf('thank_you') > -1)){
			if(window.shop_settings.inventory.show) {
				var locateDropdown = document.querySelector('.locate-dropdown');
				var headerLeft = document.querySelector('.main-header--right');
				headerLeft.style.setProperty('--header-dropdown-mheight', locateDropdown.getBoundingClientRect().top + 'px'); 
			}
			setTimeout(function(){
				var accountDropdown = document.querySelector('.account-dropdown');
				var headerRight = document.querySelector('.main-header--right');
				headerRight.style.setProperty('--header-dropdown-mheight', accountDropdown.getBoundingClientRect().top + 'px'); 
			}, 3000);
		}
	},
	scrollHeader: function(){
		var y = $(".main-header").innerHeight();
		if($(window).width() > 1200){
			$(window).scroll(function(){
				if ($(window).scrollTop() >= 48 && jQuery(window).scrollTop() > 0 ) {
					$('.main-header').addClass('sticky-head');
					$('.sticky-banner').addClass('sticky-fixed');
				}
				else if ($(window).scrollTop() < 48 ) {
					$('.main-header').removeClass('sticky-head');
					$('.sticky-banner').removeClass('sticky-fixed');
				}
			});
		}
	},
	toggleFooter: function(){
		$('.footer-title').click(function(e){
			e.preventDefault();
			if($(window).width() < 768){
				$(this).toggleClass('active').siblings('.footer-content').slideToggle(400);
			}
		})
	}, 
	searchAuto: {
		totalPageItem: 0,
		init: function(){
			var that = this;
			that.historySearch();
			that.action();
		},
		action: function(){
			var aId = [], aIdSearch = [], htmlList = "",  dataItems = [];
			var keySearch = "";
			function render_item(r,m,n){
				var vrid = '';
				$.each(r[n].variants, function(key,val){
					vrid = key; return false
				});
				var htmlItem = '';
				htmlItem += '<div class="item-ult">';
				htmlItem += '<div class="thumbs">';
				htmlItem += '<a href="'+r[n].url+'" title="'+r[n].title+'">';
				if (r[n].img == '') { 
					htmlItem += '<img alt="'+r[n].title+'" src="//theme.hstatic.net/200000636033/1001121167/14/no-image.jpg">';
				}
				else {
					htmlItem += '<img alt="'+r[n].title+'" src="'+r[n].img+'">';
				}
				htmlItem += '</a>';
				htmlItem += '</div>';
				htmlItem += '<div class="title">';
				htmlItem += '<a class="" title="'+r[n].title+'" href="'+r[n].url+'">'+r[n].title+'</a>';				
				htmlItem += '<p class="f-initial">';
				htmlItem += '<span>'+ GVN.Helper.moneyFormat(r[n].price,'â‚«')+'</span>';
				if (r[n].compare_at_price > 0 && r[n].compare_at_price > r[n].price){
					htmlItem += '<del>'+GVN.Helper.moneyFormat(r[n].compare_at_price,'â‚«')+'</del>';
				}
				htmlItem += '</p>';
				htmlItem += '</div>';
				htmlItem += '</div>';

				return htmlItem;
			}
			function loadItems(page,q){
				if( q != '' ) {
					var hSearch = localStorage.getItem('hSearch');
					var data = {
						'search': q, //key
						'pageIndex': page,
						'pageSize': 20
					}
					$.ajax({
						type: 'POST',
						url: 'https://gearvn.com/apps/gvn_search/search_products',
						async: false,
						dataType: 'json',
						data: JSON.stringify(data),
						headers: {
							/*'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.Mb6yacUPuc2_hp4dW-lHq7gnnxXMYsCVcTzfvux89lw',*/
							'Content-Type': 'application/json'
						},
						success: function(result){
							if(result.total > 0){
								var temp = [];
								var temp2 = {};
								var temp1 = [];
								$.each(result.data,function(j,k){
									temp.push(k.haravan_id);
									aIdSearch.push(k.haravan_id);
									temp2[k.haravan_id] = k;
								});
								aId = temp;
								dataItems = temp2;
								aIdSearch = GVN.Helper.uniques(aIdSearch);
								var str = "/search?q=filter=((id:product="+aIdSearch.join(')||(id:product=')+'))';

								$.ajax({
									url: str+'&view=dataproduct',
									type: 'GET',
									async: false,
									success: function(resultNew){
										resultNew = JSON.parse(resultNew);
										$.each(aId,function(i,v){
											if (resultNew[v] != undefined){
												htmlList += render_item(resultNew,i,v);
											}
										});
										GVN.Global.searchAuto.totalPageItem = Math.ceil(result.total / 20);
										if(page < GVN.Global.searchAuto.totalPageItem){
											htmlList += '<div class="resultsMore">';
											htmlList += '<a href="/search?q='+q+'" id="view_more_search" data-current="'+page+1+'">Xem thÃªm sáº£n pháº©m</a>';
											htmlList += '</div>';
										}		
										if(htmlList != ''){
											$('.ajaxSearchResults .resultsContent').html('').append(htmlList);
											if(hSearch == null) localStorage.setItem('hSearch',JSON.stringify([q]));
											else{
												hSearch = JSON.parse(hSearch);
												if(!hSearch.includes(q)){
													hSearch.push(q);
													localStorage.setItem('hSearch',JSON.stringify(hSearch));
												}
											}
										}	
										else {
											window.location.href = '/'; 
										}
									}
								});	
							}
							else {
								$('.ajaxSearchResults .resultsContent').addClass('nodata');
								$('.ajaxSearchResults .resultsContent').html('').append('<p class="dataEmpty">KhÃ´ng cÃ³ sáº£n pháº©m nÃ o...</p>');
							}	
						},
						error: function(error) {
							console.log(error);
						}
					})
				}
				else {
					alert('Vui lÃ²ng nháº­p tá»« khoÃ¡');
				}
			}

			if($(window).width() > 991){
				$('#searchform-product').submit(function(e) {
					e.preventDefault();
					var q = $(this).find('input[name=q]').val();
					var hSearch = localStorage.getItem('hSearch');
					if(q.indexOf('script') > -1 || q.indexOf('>') > -1){
						alert('Tá»« khÃ³a cá»§a báº¡n cÃ³ chá»©a mÃ£ Ä‘á»™c háº¡i ! Vui lÃ²ng nháº­p láº¡i key word khÃ¡c');
						$(this).find('input[name=q]').val('');
					}
					else{
						
						window.location = '/search?q='+q;
					}
				});
				$('#searchform-product input[type="text"]').bind('keyup change paste propertychange', GVN.Helper.delayTime(function(){
					var q = $(this).val(),
							$parent = $(this).parents('.main-header--search'),
							$results = $(this).parents('.main-header--search').find('.ajaxSearchResults');
					var hSearch = localStorage.getItem('hSearch');
					if(q.indexOf('script') > -1 || q.indexOf('>') > -1){
						alert('Tá»« khÃ³a cá»§a báº¡n cÃ³ chá»©a mÃ£ Ä‘á»™c háº¡i ! Vui lÃ²ng nháº­p láº¡i key word khÃ¡c');
						$(this).val('');
					}
					else{
						if(q.length > 0 ){
							$(this).attr('data-history', q);
							aId = [], aIdSearch = [], htmlList = "",  dataItems = [];
							GVN.Global.searchAuto.totalPageItem = 0;
							if ($('.ajaxSearchResults .resultsContent').length > 0){
								$('.ajaxSearchResults .resultsContent').html('');
							}
							loadItems(1,q);
							$results.fadeIn();
						}else{
							$results.fadeOut();
						}
					}
				},500));
				$('body').click(function(evt) {
					var target = evt.target;
					if (target.id !== 'ajaxSearchResults' && target.id !== 'inputSearchAuto') {
						$(".ajaxSearchResults").hide();
					}
				});
				$('body').on('click', '#searchform-product input[type="text"]', function() {
					if ($(this).is(":focus")) {
						if ($(this).val() != '') {
							$(".ajaxSearchResults").show();
						}
					}
				});
			}
			else {
				$('#searchform-product').click(function(e){
					e.preventDefault();
					$('body, html').addClass('open-overlay open-noscroll open-search');
					$(".sidebar-search-mb .input-search").addClass('show').focus();					
				});
				$('body').on('click', '.sidebar-search-mb button.btn-back', function(){
					$('body, html').removeClass('open-noscroll open-overlay open-search');
					$(".sidebar-search-mb .input-search").removeClass('show');
				});
				$('#searchform-product-mb').submit(function(e) {
					e.preventDefault();
					var q = $(this).find('input[name=q]').val();
					var hSearch = localStorage.getItem('hSearch');
					if(q.indexOf('script') > -1 || q.indexOf('>') > -1){
						alert('Tá»« khÃ³a cá»§a báº¡n cÃ³ chá»©a mÃ£ Ä‘á»™c háº¡i ! Vui lÃ²ng nháº­p láº¡i key word khÃ¡c');
						$(this).find('input[name=q]').val('');
					}
					else{
						if(hSearch == null) localStorage.setItem('hSearch',JSON.stringify([q]));
						else{
							hSearch = JSON.parse(hSearch);
							if(!hSearch.includes(q)){
								hSearch.push(q);
								localStorage.setItem('hSearch',JSON.stringify(hSearch));
							}
						}
						
						window.location = '/search?q='+q;
					}
				});
				$('#searchform-product-mb input[type="text"]').bind('keyup change paste propertychange', GVN.Helper.delayTime(function(){
					var q = $(this).val(),
							$parent = $(this).parents('.sidebar-search-mb'),
							$results = $(this).parents('.sidebar-search-mb').find('.ajaxSearchResults');
					var hSearch = localStorage.getItem('hSearch');
					
					if(q.indexOf('script') > -1 || q.indexOf('>') > -1){
						alert('Tá»« khÃ³a cá»§a báº¡n cÃ³ chá»©a mÃ£ Ä‘á»™c háº¡i ! Vui lÃ²ng nháº­p láº¡i key word khÃ¡c');
						$(this).val('');
					}
					else{
						if(q.length > 0 ){
							$(this).attr('data-history', q);
							aId = [], aIdSearch = [], htmlList = "",  dataItems = [];
							GVN.Global.searchAuto.totalPageItem = 0;
							if ($('.ajaxSearchResults .resultsContent').length > 0){
								$('.ajaxSearchResults .resultsContent').html('');
							}
							$('#search-history').addClass('d-none');
							loadItems(1,q);
							$results.fadeIn();
						}
						else{
							if ($('.search-suggest').length > 0){
								$results.fadeIn();
								$results.find('.resultsContent').html('').removeClass('resultsdata');
							}
							else{
								$results.find('.resultsContent').html('');
								$results.fadeOut();
							}
							$('.search-suggest').removeClass('d-none');
						}
					}
				},500));
			}
		},
		historySearch: function(){
			var hSearch = localStorage.getItem('hSearch');
			if(hSearch != null){
				hSearch = JSON.parse(hSearch);
				if(hSearch.length > 0){
					hSearch.reverse().map((keyword,ind) => {
						if(ind < 5){
							$('.search-history-list').append(`<li><a href="/search?q=${keyword}">${keyword}</a></li>`);
						}
					});
					$('#search-history').removeClass('d-none');
				}
			}
		},
	},
	ajaxMenuCate: function(){
		if ($(window).width() > 991){
			$.ajax({
				url: "/pages/lien-he?view=menu.desk",
				success: function(data){
					$('#menu-desktop-ajax').html(data);
					GVN.Global.hoverMenuDesktop();
				}
			});
		} 
		else {
			$.ajax({
				url: "/pages/lien-he?view=menu.mb",
				success: function(data){
					$('#list-menu-ajax').html(data);
					GVN.Global.toggleMenuMobile();
				}
			});
		}
	},
	toggleSidebarMenu: function(){
		$('#site-menu-handle').click(function(e){
			e.preventDefault();
			if($(window).width() < 1024){
				$('body, html').addClass('open-overlay open-noscroll open-menu');
			}
			else {
				$('body, html').toggleClass('open-overlay open-menu');
			}
		});	
	},
	hoverMenuDesktop: function(){
		(function(jQuery) {
			jQuery.fn.menuAim = function(opts) {
				this.each(function() {
					init.call(this, opts);
				});
				return this;
			};
			function init(opts) {
				var jQuerymenu = jQuery(this),
						activeRow = null,
						mouseLocs = [],
						lastDelayLoc = null,
						timeoutId = null,
						options = jQuery.extend({
							rowSelector: "> li",
							submenuSelector: "*",
							submenuDirection: "right",
							tolerance: 75,  // bigger = more forgivey when entering submenu
							enter: jQuery.noop,
							exit: jQuery.noop,
							activate: jQuery.noop,
							deactivate: jQuery.noop,
							exitMenu: jQuery.noop
						}, opts);
				var MOUSE_LOCS_TRACKED = 3,  // number of past mouse locations to track
						DELAY = 300;  // ms delay when user appears to be entering submenu
				var mousemoveDocument = function(e) {
					mouseLocs.push({x: e.pageX, y: e.pageY});
					if (mouseLocs.length > MOUSE_LOCS_TRACKED) {
						mouseLocs.shift();
					}
				};
				var mouseleaveMenu = function() {
					if (timeoutId) {
						clearTimeout(timeoutId);
					}
					if (options.exitMenu(this)) {
						if (activeRow) {
							options.deactivate(activeRow);
						}
						activeRow = null;
					}
				};
				var mouseenterRow = function() {
					if (timeoutId) { // Cancel any previous activation delays
						clearTimeout(timeoutId);
					}
					options.enter(this);
					possiblyActivate(this);
				};
				var mouseleaveRow = function() {
					options.exit(this);
				};
				var clickRow = function() {
					activate(this);
				};
				var activate = function(row) {
					if (row == activeRow) {
						return;
					}
					if (activeRow) {
						options.deactivate(activeRow);
					}
					options.activate(row);
					activeRow = row;
				};
				var possiblyActivate = function(row) {
					var delay = activationDelay();
					if (delay) {
						timeoutId = setTimeout(function() {
							possiblyActivate(row);
						}, delay);
					} else {
						activate(row);
					}
				};
				var activationDelay = function() {
					if (!activeRow || !jQuery(activeRow).is(options.submenuSelector)) {
						// If there is no other submenu row already active, then
						// go ahead and activate immediately.
						return 0;
					}
					var offset = jQuerymenu.offset(),
							upperLeft = {
								x: offset.left,
								y: offset.top - options.tolerance
							},
							upperRight = {
								x: offset.left + jQuerymenu.outerWidth(),
								y: upperLeft.y
							},
							lowerLeft = {
								x: offset.left,
								y: offset.top + jQuerymenu.outerHeight() + options.tolerance
							},
							lowerRight = {
								x: offset.left + jQuerymenu.outerWidth(),
								y: lowerLeft.y
							},
							loc = mouseLocs[mouseLocs.length - 1],
							prevLoc = mouseLocs[0];

					if (!loc) {
						return 0;
					}
					if (!prevLoc) {
						prevLoc = loc;
					}
					if (prevLoc.x < offset.left || prevLoc.x > lowerRight.x || prevLoc.y < offset.top || prevLoc.y > lowerRight.y) {
						// If the previous mouse location was outside of the entire
						// menu's bounds, immediately activate.
						return 0;
					}

					if (lastDelayLoc && loc.x == lastDelayLoc.x && loc.y == lastDelayLoc.y) {
						// If the mouse hasn't moved since the last time we checked
						// for activation status, immediately activate.
						return 0;
					}

					function slope(a, b) {
						return (b.y - a.y) / (b.x - a.x);
					};

					var decreasingCorner = upperRight,
							increasingCorner = lowerRight;
					if (options.submenuDirection == "left") {
						decreasingCorner = lowerLeft;
						increasingCorner = upperLeft;
					} else if (options.submenuDirection == "below") {
						decreasingCorner = lowerRight;
						increasingCorner = lowerLeft;
					} else if (options.submenuDirection == "above") {
						decreasingCorner = upperLeft;
						increasingCorner = upperRight;
					}

					var decreasingSlope = slope(loc, decreasingCorner),
							increasingSlope = slope(loc, increasingCorner),
							prevDecreasingSlope = slope(prevLoc, decreasingCorner),
							prevIncreasingSlope = slope(prevLoc, increasingCorner);

					if (decreasingSlope < prevDecreasingSlope && increasingSlope > prevIncreasingSlope) {
						lastDelayLoc = loc;
						return DELAY;
					}

					lastDelayLoc = null;
					return 0;
				};
				jQuerymenu.mouseleave(mouseleaveMenu).find(options.rowSelector).mouseenter(mouseenterRow).mouseleave(mouseleaveRow).click(clickRow);
				jQuery(document).mousemove(mousemoveDocument);
			};
		})(jQuery);
		var jQuerymenu = jQuery('.megamenu-nav-main');
		jQuerymenu.menuAim({
			activate: activateSubmenu,
			deactivate: deactivateSubmenu,
			exitMenu: function () {
				return jQuery(this).find(".megamenu-content").removeClass("ok");
			}
		});
		function activateSubmenu(row) {
			var jQueryrow = jQuery(row),
					jQuerysubmenu = jQueryrow.children('.megamenu-content');
			jQueryrow.find('a').addClass('hover');
			jQuerysubmenu.css('display', 'flex').addClass('menu-hover');

			//var megamenuDropdown = document.querySelector('.megamenu-content');
			//var headerMegamenu = document.querySelector('.sidebar-menu');
			//headerMegamenu.style.setProperty('--header-megamenu-mheight', megamenuDropdown.getBoundingClientRect().top + 'px'); 

		}
		function deactivateSubmenu(row) {
			var jQueryrow = jQuery(row),
					jQuerysubmenu = jQueryrow.children('.megamenu-content');

			jQueryrow.find('a').removeClass('hover');
			jQuerysubmenu.css('display', 'none').removeClass('menu-hover');

		}
	},
	toggleMenuMobile: function(){
		$('body').on('click', '.sidebar-menu-mb button', function(){
			$('body, html').removeClass('open-noscroll open-overlay open-menu');
		});
		$(function(){
			var $ul   =   $('.sidebar-navigation--body > ul');
			$ul.find('li a em').click(function(e){
				//e.preventDefault();
				var $li = $(this).parent().closest('li')
				if($li.find('ul').length > 0){
					e.preventDefault();
					if($li.hasClass('selected')){
						$li.removeClass('selected').find('li').removeClass('selected');
						$li.find('ul').slideUp(400);
						$li.find('a em').removeClass('mdi-flip-v');
					}
					else{
						if($li.parents('li.selected').length == 0){
							$ul.find('li').removeClass('selected');
							$ul.find('ul').slideUp(400);
							$ul.find('li a em').removeClass('mdi-flip-v');
						}
						else{
							$li.parent().find('li').removeClass('selected');
							$li.parent().find('> li ul').slideUp(400);
							$li.parent().find('> li a em').removeClass('mdi-flip-v');
						}
						$li.addClass('selected');
						$li.find('>ul').slideDown(400);
						$li.find('>a>em').addClass('mdi-flip-v');
					}
				}
			});
			$('.sidebar-navigation--body > ul ul').each(function(i){
				if($(this).find('>li>ul').length > 0){
					var paddingLeft = $(this).parent().parent().find('>li>a').css('padding-left');
					var pIntPLeft   = parseInt(paddingLeft);
					var result      = pIntPLeft + 45;
					$(this).find('>li>a').css('padding-left',result);
				}
				else{
					var paddingLeft = $(this).parent().parent().find('>li>a').css('padding-left');
					var pIntPLeft   = parseInt(paddingLeft);
					var result      = pIntPLeft + 15;
					$(this).find('>li>a').css('padding-left',result).parent().addClass('selected--last');
				}
			});
			var t = ' li > ul ';
			for(var i=1;i<=10;i++){
				$('.sidebar-navigation--body > ul > ' + t.repeat(i)).addClass('subMenuColor' + i);
			}
			var activeLi = $('li.selected');
			if(activeLi.length){
				opener(activeLi);
			}
			function opener(li){
				var ul = li.closest('ul');
				if(ul.length){
					li.addClass('selected');
					ul.addClass('open');
					li.find('>a>em').addClass('mdi-flip-v');
					if(ul.closest('li').length){
						opener(ul.closest('li'));
					}
					else{
						return false;
					}
				}
			}
		});
		$(document).on('click', '.js-click-menu-mb', function(e){
			e.preventDefault();
			$('#site-menu-handle').trigger('click');
		});
	},
	toggleSidebarCart: function(){
		if(window.shop.template != 'cart'){
			$('#site-cart-handle').click(function(e){
				e.preventDefault();
				$('body, html').addClass('open-overlay open-noscroll open-cart');
				GVN.Helper.getCartSidebar();
			});
			$('body').on('click', '.sidebar-cart .sidebar-cart-top button', function(){
				$('body, html').removeClass('open-noscroll open-overlay open-cart');
			});
			$('.box-cart--hoadon #export-hoadon').click(function(){
				$('.box-cart--hoadon .note--hoadon').slideToggle(400);
			});
		}
	},
	closeAll:function(){
		$('body').on('click touchstart', '.site-overlay', function(e){
			e.preventDefault();
			$('body, html').removeClass('open-overlay open-noscroll open-cart open-menu open-search');
		})
	},
	updateMiniCart: function(){
		$(document).on('click','.pro-quantity-view .mnc-plus',function(e){
			e.preventDefault();
			var line = $(this).parents('.item-line').index() + 1;
			var currentQty = parseInt($(this).parents('.item-line').find('input').val());
			var newQty = currentQty + 1;
			$(this).parents('.item-line').find('input').val(newQty);
		});
		$(document).on('click','.pro-quantity-view .mnc-minus',function(e){
			e.preventDefault();
			var line = $(this).parents('.item-line').index() + 1;
			var currentQty = parseInt($(this).parents('.item-line').find('input').val());
			if(currentQty > 1){
				var newQty = currentQty - 1;
				$(this).parents('.item-line').find('input').val(newQty);
			}
		}); 
		$(document).on('click','.pro-quantity-view .mnc-plus', GVN.Helper.delayTime(function(){
			var line = $(this).parents('.item-line').index() + 1;
			var vId = $(this).parents('.item-line').find('input').attr('data-vid');
			var pId = $(this).parents('.item-line').attr('data-pid');
			var currentQty = parseInt($(this).parents('.item-line').find('input').val());
			var updates = [];
			var updateNormal = true;
			if(updateNormal){
				var params = {
					type: 'POST',
					url: '/cart/change.js',	
					data:'quantity=' + currentQty + '&line=' + line,	
					async: false,
					dataType: 'json',
					success: function(data) {					
						cartItem = {};
						window.cartJS = data;
						for (i = 0; i < data.items.length; i++) {
							var id = data.items[i].variant_id;
							cartItem[data.items[i].variant_id] = data.items[i].quantity;
							$('.item-line input[data-vid="'+id+'"]').val(data.items[i].quantity);
						}	
						//GVN.Helper.getCartSidebar(false);
						var total_price = Haravan.formatMoney(data.total_price, window.shop.moneyFormat).replace(/\,/g,'.');
						$('#total-view-cart').html(total_price);
						$('.count-holder .count').html(data.item_count);
					},
					error: function(XMLHttpRequest, textStatus) {
						Haravan.onError(XMLHttpRequest, textStatus);
					}
				};
				jQuery.ajax(params);
			}
		},300));
		
		$(document).on('click','.pro-quantity-view .mnc-minus', GVN.Helper.delayTime(function(){
			var updates = [];
			var line = $(this).parents('.item-line').index() + 1;		
			var vId = $(this).parents('.item-line').find('input').attr('data-vid');
			var pId = $(this).parents('.item-line').attr('data-pid');
			var currentQty = parseInt($(this).parents('.item-line').find('input').val());
			if(currentQty > 0){
				var updateNormal = true;
				if(updateNormal){
					var params = {
						type: 'POST',
						url: '/cart/change.js',	
						data:'quantity=' + currentQty + '&line=' + line,	
						async: false,
						dataType: 'json',
						success: function(data) {					
							cartItem = {};
							window.cartJS = data;
							for (i = 0; i < data.items.length; i++) {
								var id = data.items[i].variant_id;
								cartItem[data.items[i].variant_id] = data.items[i].quantity;
								$('.item-line input[data-vid="'+id+'"]').val(data.items[i].quantity);
							}	
							//GVN.Helper.getCartSidebar(false);

							var total_price = Haravan.formatMoney(data.total_price, window.shop.moneyFormat).replace(/\,/g,'.');
							$('#total-view-cart').html(total_price);
							$('.count-holder .count').html(data.item_count);
						},
						error: function(XMLHttpRequest, textStatus) {
							Haravan.onError(XMLHttpRequest, textStatus);
						}
					};
					jQuery.ajax(params);
				}
			}
		},300));
	},
	addToCartLoop: function(){
		function callBackSuccess(){
			if (window.shop.template.indexOf('cart') > -1) {
				window.location.reload();
			} 
			else {
				GVN.Helper.flyCart(GVN.Global.imgtodrag);
				$('body').removeClass('modal-open').removeClass('nhanqua-open');
				GVN.Helper.getCartSidebar();
				$('body, html').addClass('open-overlay open-noscroll open-cart');
			}
		}
		$(document).on('click','.add-to-cart', function() {
			var id = $(this).attr('data-id');
			GVN.Global.action = 'addtocart';
			GVN.Global.variant_id = $(this).attr('data-variantid');
			GVN.Global.imgtodrag = $(this).parents('.proloop-block').find('.proloop-img picture:nth-of-type(1)');
			var title = $(this).parents('.proloop-block').find('.proloop-name a').html();
			GVN.Helper.addCartSupport(GVN.Global.variant_id,GVN.Global.min_qty,'loop',function(){
				callBackSuccess()
			});
			GVN.AppPE.renderComboNew(id,'modalcombo');
		});
	},
	copyCodeCoupon: function(){
		var clipboard = new ClipboardJS('.cp-btn', {
			text: function(trigger) {
				return trigger.getAttribute('data-coupon');
			}
		});		
		clipboard.on('success', function(e) {	
			var voucherCode = $(e.trigger).parents('.coupon-item').find('.cp-btn').attr('data-coupon');
			
			$('.coupon-item').removeClass('copied');
			$('.cp-btn').text("Sao chÃ©p");
			
			$('.popup-clipboard').addClass('show');
			$('.main-box--title').html('<svg class="ic-svg"></svg>');
			$('.main-box--content .alert-box').addClass('success');
			$('.main-box--content .alert-box span').html('Báº¡n Ä‘Ã£ sao chÃ©p thÃ nh cÃ´ng');
			$(e.trigger).text("ÄÃ£ sao chÃ©p");
			$(e.trigger).parents('.coupon-item').addClass('copied');
			
			setTimeout(function(){
				$('.popup-clipboard').removeClass('show');
			}, 2000);
			e.clearSelection();
	
		});
		clipboard.on('error', function(e) {
			$('.popup-clipboard').addClass('show');
			$('.main-box--title').html('<svg class="ic-svg"></svg>');
			$('.main-box--content .alert-box').addClass('error');
			$('.main-box--content .alert-box span').html('Xin lá»—i ... CÃ³ gÃ¬ Ä‘Ã³ xáº£y ra');
			setTimeout(function(){
				$('.popup-clipboard').removeClass('show');
			}, 2000);
		});
	},
	popoverSupport: function(){
		var popover = '[data-bs-toggle="popover"]';
		$(popover).popover({
			html: true,
			animation: true,
			sanitize: false,
			placement: function ( popover, trigger ){
				var placement = jQuery(trigger).attr('data-bs-placement');
				var dataClass = jQuery(trigger).attr('data-class');
				jQuery(trigger).addClass('is-active');
				jQuery(popover).addClass(dataClass);
				if (jQuery(trigger).offset().top - $(window).scrollTop() > 280) {
					return "top";
				}
				return placement;
			}, 
			content: function() {
				var elementId  = $(this).attr("data-content-id");
				return $('#' + elementId).html();
			},
			delay: {show: 60, hide: 40}
		});	
		function eventPopover(){
			if($(window).width() >= 768){	
				$(popover).on('mouseenter', function () {
					var self = this;
					jQuery(this).popover("show");
					jQuery(".popover.coupon-popover").on('mouseleave', function () {
						jQuery(self).popover('hide');
					});
				}).on('mouseleave', function () {
					var self = this;
					setTimeout(function () {
						if (!jQuery('.popover.coupon-popover:hover').length) {
							jQuery(self).popover('hide');
						}
					},300);
				});
			}
			else{
				$(popover).off('mouseenter mouseleave');
			}				
		};
		eventPopover();	
		$(window).resize(function() {	eventPopover();	});
		$(popover).popover().on("hide.bs.popover", function(){		
			$(".modal-coupon--backdrop").removeClass("js-modal-show");
		});
		$(popover).popover().on("show.bs.popover", function(){				
			$(".modal-coupon--backdrop").addClass("js-modal-show");														
		});
		$(popover).popover().on("shown.bs.popover", function(){
			$('.btn-popover-close,.modal-coupon--backdrop').click(function() {
				$(popover).not(this).popover('hide');
				var $this = $(this);
				$this.popover('hide');
			});
		});
		$(document).on('click', '.cpi-trigger', function(e){ 
			e.preventDefault();	
			if(window.shop.template.indexOf('cart') != -1){
				var datacode= $(this).attr('data-coupon');
				$(".coupon-item .btn-apply-line-coupon[data-code="+datacode+"]").click();	
			}
			else {
				var btnPopover= $(this).attr('data-coupon');
				$(".coupon-item .cp-btn[data-coupon="+btnPopover+"]").click();	
			}
		});
		$(document).on('click', '.popover-content__coupon .btn-popover-code', function(e){ 
			e.preventDefault();	
			var btnPopover= $(this).attr('data-coupon');
			$(".coupon-item .cp-btn[data-coupon="+btnPopover+"]").click();		
			$(this).html('ÄÃ£ sao chÃ©p').addClass('disabled');	
		});

	},
	popoverGift: function(){
		$('.popover-click[data-toggle="popover"]').popover({
			html: true,
			animation: true,
			placement: function ( popover, trigger ){
				var placement = jQuery( trigger ).attr( 'data-placement' );
				var dataClass = jQuery( trigger ).attr( 'data-class' );
				jQuery( trigger ).addClass( 'is-active' );
				jQuery( popover).addClass( dataClass );
				return placement;
			},
			content: function() {
				var elementId  = $(this).attr("data-popover-content");
				return $(elementId).html();
			},
		});
		jQuery("body").on("click", '.popover-click[data-toggle="popover"]', function(e) {
			$('.popover-click[data-toggle="popover"]').each(function () {			
				if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
					$(this).popover('hide');
				}
			});
		});
		$('body').on('click', function (e) {
			$('.popover-click[data-toggle="popover"]').each(function () {			
				if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
					$(this).popover('hide');
				}
			});
		});
	},
	copylinkProd: function(){
		var clipboard = new ClipboardJS('.share-link-js', {
			text: function(trigger) {
				return trigger.getAttribute('data-url');
			}
		});		
		clipboard.on('success', function(e) {	
			$('.popup-clipboard').addClass('show');
			$('.main-box--title').html('<svg class="ic-svg"></svg>');
			$('.main-box--content .alert-box').addClass('success');
			$('.main-box--content .alert-box span').html('Sao chÃ©p link thÃ nh cÃ´ng');
			setTimeout(function(){
				$('.popup-clipboard').removeClass('show');
			}, 2000);
			e.clearSelection();

		});
		clipboard.on('error', function(e) {
			$('.popup-clipboard').addClass('show');
			$('.main-box--title').html('<svg class="ic-svg"></svg>');
			$('.main-box--content .alert-box').addClass('error');
			$('.main-box--content .alert-box span').html('Xin lá»—i ... CÃ³ gÃ¬ Ä‘Ã³ xáº£y ra');
			setTimeout(function(){
				$('.popup-clipboard').removeClass('show');
			}, 2000);
		});
		
	},
	quickView: function(){
		$('body').on('click', '.proloop-button .quick-view', function(e){
			e.stopPropagation();
			e.preventDefault();
			$('#quick-view-modal .modal-body').html('');
			var url = $(this).attr('data-handle');
			var id = $(this).attr('data-id');
			var title = $(this).parents('.proloop, .proloop-fs').find('.proloop-detail .proloop-name a').html();
			var html = '';
			if($(this).parent().hasClass('in-sale')){
				window.location = url;
			}
			else{
				linkQuickview = url+ (url.indexOf('?') > -1?"&view=quickview":"?view=quickview");
				$.ajax({
					type: 'GET',
					url: linkQuickview,
					async: false,
					success: function(data){
						html = data;
						$('#quick-view-modal').modal();
						$('#quick-view-modal .modal-body').html(html);
						GVN.AppPE.renderComboNew(id,'quickview'); 
					}
				});
			}
		});
		
		$('body').on('click', '#quick-view-modal button.close', function(e){
			$('#quick-view-modal').modal('hide');
			$("body").removeClass("modal-open");
			$('#quick-view-modal .modal-body').html('');
		});
	},
	addToCartQv: function(){
		var quantity_qv = 0;
		/*function callSuccessQV(){
			GVN.Helper.getCartSidebar();						
			$("body").removeClass("modal-open quickview-open");
			$('#quick-view-modal').modal('hide');			
		}*/
		$(document).on('click','#buy-now-qv:not(.loading)',function(e){
			e.preventDefault();
			var quantity = Number($('#quantity-qv').val()), variantId = $('#product-select-qv').val();
			$.ajax({
				type: 'POST',
				url: '/cart/add.js',
				data: 'quantity=' + quantity + '&id=' + variantId,
				dataType: 'json',
				success: function(line_item) {
					GVN.Helper.getCartSidebar();
					$("body").removeClass("modal-open quickview-open");
					$('#quick-view-modal').modal('hide');			
					$('body, html').addClass('open-overlay open-noscroll open-cart');
					//GVN.Helper.addCartSupport(variantId,quantity,'normal',function(){});
				},
				error: function(XMLHttpRequest, textStatus) {
					GVN.Helper.SwalWarning('ThÃ´ng bÃ¡o','Sá»‘ lÆ°á»£ng báº¡n mua vÆ°á»£t quÃ¡ tá»“n kho','Warning',false,false,3000);
				}
			});
		});
	},
	addFavorites: function(){
		$('body').on('click', '.js-wishlist', function(e){
			e.preventDefault();
			var id = $(this).attr('data-id');
			var handle = $(this).attr('data-handle');
			if(window.shop.account.logged){
				var self = $(this);
				if(self.hasClass('active')){
					GVN.Helper.unSetFavorites(id, handle, function(){
						self.removeClass('active').find('svg').removeClass('active');
						if(window.shop.template.indexOf('customers') > -1){
							window.location.reload(); 
						}
					});
				}else{
					GVN.Helper.setFavorites(id, handle, function(){
						self.addClass('active').find('svg').addClass('active');
					});
				}
			}else{
				if($(window).width() < 1200){

				}else{
					GVN.Helper.accountPopup('acc-login-box');
				}
			}
		})
	},
	checkInputAccount: function(){
		$('.form__input-wrapper input').blur(function(){
			tmpval = $(this).val();
			if(tmpval == '') {
				$(this).removeClass('is-filled');
			}
			else {
				$(this).addClass('is-filled');
			}
		});
	}, 
	triggerPopupAcc: function(){
		if(location.href.indexOf('/account/login') === -1 && location.href.indexOf('/account/register') === -1 ){
			$('#acc-login-box form').prepend('<input name="return_to" value="'+location.href+'" type="hidden">');
		}
		$('body').on('click', '.js-account', function(e){
			e.preventDefault();
			if($(window).width() > 767){
				GVN.Helper.accountPopup($(this).attr('data-box'));
			}
			else{
				window.location = '/account/login';
			}
		})
	},
	triggerTabPopupAcc: function(){
		$('body').on('click', '.js-acc', function(e){
			e.preventDefault();
			if ($(this).attr('data-box') == 'acc-recovery-box'){ 
				$('.form-btn-social').addClass('d-none');
			}
			else {
				if ($('.form-btn-social').hasClass('d-none')){
					$('.form-btn-social').removeClass('d-none');
				}
			}
			if ($(this).attr('data-box') == 'acc-login-box'){
				$('#modal-account-success').modal('hide');	
			}
			GVN.Helper.accountPopup($(this).attr('data-box'));
		})
	},
	capchaLoaded1: function(input, form) {
		grecaptcha.ready(function () {
			grecaptcha.execute("6LdD18MUAAAAAHqKl3Avv8W-tREL6LangePxQLM-", { action: "submit" }).then(function (token) {
				input.val(token);
				//form.submit();
				$.ajax({
					url: form.attr('action'),
					type: 'POST',
					data: form.serialize(),
					success: function(data){
						var tempData = data;
						$.get('/account.js').done(function(user){
							if(user.email != null){
								window.location.reload();
							}
							else{
								var error = $(tempData).find('#customer_login .errors').clone();
								if(form.siblings('.errors').length == 0){
									error.insertBefore(form);
								}
								else{
									form.siblings('.errors').html(error.html());
								}
							}
						});
					},
					error: function(){}
				});
			});
		});
	},
	capchaLoaded2: function(input, form){
		grecaptcha.ready(function () {
			grecaptcha.execute("6LdD18MUAAAAAHqKl3Avv8W-tREL6LangePxQLM-", { action: "submit" }).then(function (token) {
				input.val(token);
				$.ajax({
					url: form.attr('action'),
					type: 'POST',
					data: form.serialize(),
					success: function(data){
						var tempData = data;
						
						$.get('/account.js').done(function(user){
							if(user.email != null){
								window.location = '/account';
							}
							else{
								var error = $(tempData).find('#create_customer .errors').clone();
								if(form.siblings('.errors').length == 0){
									error.insertBefore(form);
								}
								else{
									form.siblings('.errors').html(error.html());
								}
							}
						});
					},
					error: function(){

					}
				});
			});
		});
	},
	capchaLoaded3: function(input, form) {
		grecaptcha.ready(function () {
			grecaptcha.execute("6LdD18MUAAAAAHqKl3Avv8W-tREL6LangePxQLM-", { action: "submit" }).then(function (token) {
				input.val(token);
				//form.submit();
				$.ajax({
					url: form.attr('action'),
					type: 'POST',
					data: form.serialize(),
					success: function(data){
						$('#modal-account').modal('hide');
						setTimeout(function(){
							Swal.fire({
								title: '',
								text: 'Báº¡n vui lÃ²ng kiá»ƒm tra email!',
								icon: 'info',
								showCancelButton: false,
								showConfirmButton: true,
								confirmButtonText: 'ÄÃ£ hiá»ƒu',
								allowOutsideClick: false,
								preConfirm: () => {
									$('#modal-account .acc-content-box').addClass('d-none');
									$('#modal-account #acc-login-box').removeClass('d-none');
									$('#modal-account').modal('show');
								},
							});
						},300);
					},
					error: function(){}
				});
			});
		});
	},
	actionAccount: function(){
		$(document).on('click', '#form_submit-login', function(e){
			e.preventDefault();
			var input = $(this).parents('form').find('input[name="g-recaptcha-response"]');
			GVN.Global.capchaLoaded1(input, $(this).parents('form'));
		});
		$(document).on('click', '#form_submit-recover', function(e){
			e.preventDefault();
			var input = $(this).parents('form').find('[name="g-recaptcha-response"]');
			GVN.Global.capchaLoaded3(input, $(this).parents('form'));
		});
		$(document).on('submit', '#create_customer', function(e){
			e.preventDefault();
			var input = $(this).find('input[name="g-recaptcha-response"]');
			var fullName = $(this).find('input[name="customer[name]"]').val().split(' ');
			var last_name = fullName[0];
			var first_name = fullName.slice(1,fullName.length).join(' ');
			$(this).find('input[name="customer[last_name]"]').val(last_name); //Há» 
			$(this).find('input[name="customer[first_name]"]').val(first_name); //TÃªn
			
			GVN.Global.capchaLoaded2(input, $(this));
		});
		
		$('body').on('click', '.js-btn-logout', function(e){
			e.preventDefault();
			Swal.fire({
				title: '',
				text: 'Báº¡n muá»‘n thoÃ¡t tÃ i khoáº£n',
				icon: 'question',
				showCancelButton: true,
				showConfirmButton: true,
				confirmButtonText: 'Äá»“ng Ã½',
				cancelButtonText: 'KhÃ´ng',
			}).then((result) => {
				if (result.isConfirmed) {
					window.location = '/account/logout';
				} 
			})
		});
	},
	customOTPAcc: function(){
		$('.form-digit-group').find('input').each(function() {
			$(this).attr('maxlength', 1);
			$(this).on('keyup', function(e) {
				var parent = $($(this).parent());
				if(e.keyCode === 8 || e.keyCode === 37) {
					var prev = parent.find('input#' + $(this).data('previous'));
					if(prev.length) {
						$(prev).select();
					}
				}
				else if((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode === 39) {
					var next = parent.find('input#' + $(this).data('next'));
					if(next.length) {
						$(next).select();
					}
					else {
						//if(parent.data('autosubmit')) {
							//parent.submit();
						//}
						$('#otp_code').val($('#digit-1').val() + $('#digit-2').val() + $('#digit-3').val() + $('#digit-4').val() + $('#digit-5').val() + $('#digit-6').val());
						console.log($('#otp_code').val());
					}
				}
			});
		});
	},
	account: {
		isSendAgain: false,
		isRegister: false,
		objUser: {
			last_name: '',
			first_name: '',
			email: '',
			phone: '',
			gender: null
		},
		init: function(){
			var that = this;
			that.action();
		},
		checkPhone: function(phone){
			var validate = 0;
			var check1 = phone.slice(0,3);
			var check2 = phone.slice(0,2);
			if(check1 == '+84') phone = phone.replace('+84','0');
			if(check2 == '84') phone = phone.replace('84','0');
			if(phone == ''){
				validate = 1;
			}
			else{
				if(phone.length == 10 && $.isNumeric(phone)){
					validate = 0;
				}
				else{
					if(!$.isNumeric(phone)){
						validate = 2;
					}
					else if(phone.length < 10 || phone.length > 10){
						validate = 3;
					}
				}
			}
			return validate;
		},
		countDownOtp: function() {
			let MinutesLimit = 60 * 5;	
			let timer =  setInterval(function () {
				minutes = parseInt(MinutesLimit / 60, 10);
				seconds = parseInt(MinutesLimit % 60, 10);

				minutes = minutes < 10 ? "0" + minutes : minutes;
				seconds = seconds < 10 ? "0" + seconds : seconds;

				$('.count-time').html(minutes + " phÃºt " + seconds + " giÃ¢y");

				if (--MinutesLimit < 0) {
					clearInterval(timer);
					$('#send_again').removeClass('disable');
					GVN.Global.account.isSendAgain = true;
				}
			}, 1000);
		},
		action: function() {
			/*Login*/
			$('#acc-login-box button').on('click',function(e){
				e.preventDefault();
				GVN.Global.account.isRegister = false;
				var allowSubmit = true;
				var phone = $(this).parents('#acc-login-box').find('input[name="customer[email]"]').val();
				//var password = $(this).parents('#acc-login-box').find('input[name="customer[password]"]').val();
				var validPhone = GVN.Global.account.checkPhone(phone);

				if(validPhone != 0){
					if(validPhone == 1) $(this).find('input[name="customer[email]"]').parent().addClass('error1').removeClass('error2').removeClass('error3');
					if(validPhone == 2) $(this).find('input[name="customer[email]"]').parent().addClass('error2').removeClass('error1').removeClass('error3');
					if(validPhone == 3) $(this).find('input[name="customer[email]"]').parent().addClass('error3').removeClass('error2').removeClass('error1');
					allowSubmit = false;
				}
				else{
					$(this).find('input[name="customer[email]"]').parent().removeClass('error1').removeClass('error2').removeClass('error3');
				}
				
				/*if(password == ''){
					$('input[name="customer[password]"]').parent().addClass('error1');
					allowSubmit = false;
				}
				else{
					$('input[name="customer[password]"]').parent().removeClass('error1');
				}*/
				
				if(allowSubmit){
					/*
					grecaptcha.ready(function() {
						grecaptcha.execute('6LdD18MUAAAAAHqKl3Avv8W-tREL6LangePxQLM-', {action: 'submit'}).then(function(token) {
							$('#acc-login-box form input[name="g-recaptcha-response"]').val(token);
							$.ajax({
								url: $('#acc-login-box form').attr('action'),
								type: 'POST',
								data: $('#acc-login-box form').serialize(),
								success: function(data){
									if(data.indexOf('logged: true') > -1){
										window.location.reload();
									}
								},
								error: function(error){
									localStorage.setItem('responseLogin',error);
									console.log(error);
								}
							});
						});
					});
					*/
					$('#acc-recovery-box .form-text .number-phone b').html(phone);
					$('#acc-recovery-box #phone_auth_recaptcha input[name="phone_number"]').val(phone);
					$('#acc-recovery-box #phone_auth_recaptcha #phone-auth-submit').trigger('click');
				}
			});
			
			/*Register*/
			$('#acc-register-box #customer_register').submit(function(e){
				e.preventDefault();
				GVN.Global.account.isRegister = true;
				var last_name = $(this).find('input[name="customer[last_name]"]').val();
				var first_name = $(this).find('input[name="customer[first_name]"]').val();
				var email = $(this).find('input[name="customer[email]"]').val();
				var phone = $(this).find('input[name="customer[phone]"]').val();
				var gender = $(this).find('input[name="customer[gender]"]:checked').val();
				var allowSubmit = true;
				//Kiá»ƒm tra rá»—ng
				if(last_name == ''){
					$(this).find('input[name="customer[last_name]"]').parent().addClass('error1');
					allowSubmit = false;
				}
				else $(this).find('input[name="customer[last_name]"]').parent().removeClass('error1');

				if(first_name == ''){
					$(this).find('input[name="customer[first_name]"]').parent().addClass('error1');
					allowSubmit = false;
				}
				else $(this).find('input[name="customer[first_name]"]').parent().removeClass('error1');

				if(email == ''){
					$(this).find('input[ name="customer[email]"]').parent().addClass('error1');
					allowSubmit = false;
				}
				else $(this).find('input[ name="customer[email]"]').parent().removeClass('error1');

				//Kiá»ƒm tra Ä‘Ãºng Ä‘á»‹nh dáº¡ng
				if(!GVN.Helper.checkemail(email)){
					$(this).find('input[ name="customer[email]"]').parent().addClass('error2').removeClass('error1');
					allowSubmit = false;
				}
				else $(this).find('input[ name="customer[email]"]').parent().removeClass('error2');

				var validPhone = GVN.Global.account.checkPhone(phone);
				if(validPhone == 1) $(this).find('input[name="customer[phone]"]').parent().addClass('error1').removeClass('error2').removeClass('error3');
				if(validPhone == 2) $(this).find('input[name="customer[phone]"]').parent().addClass('error2').removeClass('error1').removeClass('error3');
				if(validPhone == 3) $(this).find('input[name="customer[phone]"]').parent().addClass('error3').removeClass('error1').removeClass('error2');
				if(validPhone != 0) allowSubmit = false;

				if(allowSubmit){
					GVN.Global.account.objUser.last_name = last_name;
					GVN.Global.account.objUser.first_name = first_name;
					GVN.Global.account.objUser.email = email;
					GVN.Global.account.objUser.phone = phone;
					GVN.Global.account.objUser.gender = gender;
					
					
					$('#acc-recovery-box .form-text .number-phone b').html(phone);
					$('#acc-recovery-box #phone_auth_recaptcha input[name="phone_number"]').val(phone);
					$('#acc-recovery-box #phone_auth_recaptcha #phone-auth-submit').trigger('click');
					
					console.log(GVN.Global.account.objUser);
				}
			});
			
			/*Comfirm OTP*/
			$('#acc-recovery-box #form_otp').submit(function(e){
				e.preventDefault();
				var otpCode = $(this).find('#otp_code').val();
				var allowSubmit = true;
				if(otpCode == ''){
					$(this).find('#otp_code').parent().addClass('error1').removeClass('error2').removeClass('error3');
					allowSubmit = false;
				}
				else if(!$.isNumeric(otpCode)){
					$(this).find('#otp_code').parent().addClass('error2').removeClass('error1').removeClass('error3');
					allowSubmit = false;
				}
				else if(otpCode.trim().length != 6){
					$(this).find('#otp_code').parent().addClass('error3').removeClass('error1').removeClass('error2');
					allowSubmit = false;
				}
				else if(getCookie('otpCount') == '5') {
					$('#acc-recovery-box #form_otp').find('#otp_code').parent().addClass('error5').removeClass('error1').removeClass('error2').removeClass('error3').removeClass('error4');
					$('#acc-recovery-box #form_otp button:not(#send_again)').removeClass('btn-loading').removeAttr('disabled');
					allowSubmit = false;
				}
				
				if(allowSubmit){
					$.ajax({
						url: '/phone_auth/validate',
						type: 'POST',
						beforeSend: function(){
							$('#acc-recovery-box #form_otp button:not(#send_again)').addClass('btn-loading').attr('disabled', 'disabled');
						},
						data: $('#acc-recovery-box #form_otp').serialize(),
						success: function(data){
							$.get('/account.js').done(function(respon){
								if(respon.phone != null) {
									window.accountJS = respon;
									if(GVN.Global.account.isRegister){
										localStorage.setItem('user_info',JSON.stringify(GVN.Global.account.objUser));
										$('#modal-account').modal('hide');
										setTimeout(function(){
											$('#modal-account-success').modal();	
											setTimeout(function(){
												window.location.reload();
											},500);
										},1000);
									}
									else{
										if(window.shop.template.indexOf('order-tracking') > -1){
											window.location = '/account?view=orders-history';
										}
										else {
											window.location.reload();
										}
									}
								} 
								else{
									$('#acc-recovery-box #form_otp').find('#otp_code').parent().addClass('error4').removeClass('error1').removeClass('error2').removeClass('error3');
									$('#acc-recovery-box #form_otp button:not(#send_again)').removeClass('btn-loading').removeAttr('disabled');

									var otpCount = getCookie('otpCount');
									otpCount ? setCookie('otpCount', otpCount*1+1) : setCookie('otpCount', 1);
								}
							})
						}
					});
				}
			});
			
			$('#acc-recovery-box #form_otp #send_again').on('click',function(e){
				e.preventDefault();
				if (GVN.Global.account.isSendAgain) {
					$('#acc-recovery-box #phone_auth_recaptcha #phone-auth-submit').trigger('click');
				}
			});
		}
	},
	supportCheckGiftPE: function(onlyAjax){
		var listIdPrNew = [];
		if(onlyAjax == undefined){
			$(".proloop").each(function(){
				var loopIdPr = $(this).find('.proloop-block').attr('data-id');
				listIdPrNew.push(loopIdPr);
			});
		}
		else{
			$(".proloop.ajaxloop:not(.loaded)").each(function(){
				var loopIdPr = $(this).find('.proloop-block').attr('data-id');
				listIdPrNew.push(loopIdPr);
			});
		}
		list_item_gift = GVN.Helper.uniques( listIdPrNew ).join(',');
		GVN.AppPE.checkGiftPE(list_item_gift);
	},
	scrollFixedToolbar: function(){
		if($(window).width() < 992){
			var $toolbartHeight = $('.toolbar-menu-mobile').outerHeight();
			var $toolbar = $('.toolbar-menu-mobile');
			var offset_sticky_toolbar = $toolbar.outerHeight() + 70;
			var offset_sticky_down = 0;
			var resizeTimer = false,
					resizeWindow = $(window).prop("innerWidth");
			$(window).on("resize", function() {
				if (resizeTimer) {clearTimeout(resizeTimer)	}
				resizeTimer = setTimeout(function() {
					var newWidth = $(window).prop("innerWidth");
					if (resizeWindow != newWidth) {
						$toolbar.removeClass('hSticky-up').removeClass('hSticky-nav').removeClass('hSticky');
						resizeTimer = setTimeout(function() {
							$toolbartHeight = ('.toolbar-menu-mobile').outerHeight();
						}, 50);
						resizeWindow = newWidth
					}
				}, 200)
			});
			setTimeout(function() {
				$toolbartHeight = $('.toolbar-menu-mobile').outerHeight();
				jQuery(window).scroll(function() {	
					/* scroll toolbar */
					if(jQuery(window).scrollTop() > offset_sticky_toolbar && jQuery(window).scrollTop() > offset_sticky_down) {		
						if(jQuery(window).width() > 991){	
							if (!$('body').hasClass('location-noscroll') ){
								$('body').removeClass('locked-scroll');
							}
						}		
						$toolbar.addClass('hSticky');	
						if(jQuery(window).scrollTop() > offset_sticky_toolbar + 150){
							$toolbar.removeClass('hSticky-up').addClass('hSticky-nav');	
						};
					} 
					else {
						if(jQuery(window).scrollTop() > offset_sticky_toolbar && (jQuery(window).scrollTop() + 450) + jQuery(window).height()  < $(document).height()) {
							$toolbar.addClass('hSticky-up');	
						}	
					}
					if (jQuery(window).scrollTop() <= offset_sticky_down && jQuery(window).scrollTop() <= offset_sticky_toolbar) {
						$toolbar.removeClass('hSticky-up').removeClass('hSticky-nav');
						if (jQuery(window).scrollTop() <= offset_sticky_toolbar - 100) {
							$toolbar.removeClass('hSticky');
						}
					}
					offset_sticky_down = jQuery(window).scrollTop();
				});	
			}, 300)
		}
	},
	popupPromotion: function(){
		if (window.shop_settings.popup_promotion.show){
			var time = parseInt(200);
			if (document.cookie.indexOf('popupPromotion') !== -1 && Cookies.get('popupPromotion') == 'on') {
			}else{
				setTimeout(function(){
					$('#popup-promotion').modal('show');
					var date = new Date();
					var minutes = parseInt(window.shop_settings.popup_promotion.minutes);
					date.setTime(date.getTime() + (minutes * 60 * 1000));
					Cookies.set('popupPromotion', 'on', { expires: date });	
				},time);
			}
			$('body').on('click', '.close-popup-promotion', function(e){
				e.preventDefault();
				$('#popup-promotion').removeClass('show');
			});
			
			if (window.shop_settings.popup_promotion.type == 'collection'){
				if( $('.modal-collection .listProduct-row').length > 0 ){
					
					setTimeout(function(){
						$('.modal-collection .listProduct-row').slick({
							slidesToShow: 3,
							prevArrow: '<button type="button" class="slick-prev"><svg width="8" height="17" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 50 50" enable-background="new 0 0 50 50" xml:space="preserve"><metadata><?xpacket begin="&#65279;" id="W5M0MpCehiHzreSzNTczkc9d"?><x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 5.3-c011 66.145661, 2012/02/06-14:56:27"/><?xpacket end="w"?></metadata><g display="none"><rect x="1" y="1" display="inline" fill="#000000" width="48" height="48"/></g><g><g><polygon points="34.675,47.178 12.497,25 34.675,2.822 37.503,5.65 18.154,25 37.503,44.35   "/></g></g></svg></button>',
							nextArrow: '<button type="button" class="slick-next"><svg width="8" height="17" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve"><polygon points="6.379,20.908 7.546,22.075 17.621,12 7.546,1.925 6.379,3.092 15.287,12 "/></svg></button>',
							rows: 1,
							slidesToScroll: 1,
							draggable: false,
							infinite: true,
							arrows: true,
							dots: false,
							responsive: [
								{
									breakpoint: 1024,
									settings: {
										slidesToShow: 3
									}
								},
								{
									breakpoint: 991,
									settings: {
										slidesToShow: 2
									}
								}
							]
						});
					},600);
				}
			}
		}
	}
}
GVN.Index = {
	allowScroll: true,
	max_part: 6,
	start_part: 1,
	init: function(){
		var that = this;
		that.sliderHome();
		GVN.Helper.pickItem();
		GVN.Helper.slickSlider('#index-slider', 1, 1, 1, {
			infinite: true,
			autoplay:true,
			autoplaySpeed:5000,
			fade: true,
			arrows: false,
			dots: true,
		});
		that.tabHome();
		that.loadMore2();
	},
	sliderHome: function(){   
		if( $('#home-flashsale-1 .listProduct-row').length > 0 ){
			if($(window).width() > 991){
				$('#home-flashsale-1 .listProduct-row:not(.slick-initialized)').slick({
					slidesToShow: 6,
					prevArrow: '<button type="button" class="slick-prev"><svg width="8" height="17" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 50 50" enable-background="new 0 0 50 50" xml:space="preserve"><metadata><?xpacket begin="&#65279;" id="W5M0MpCehiHzreSzNTczkc9d"?><x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 5.3-c011 66.145661, 2012/02/06-14:56:27"/><?xpacket end="w"?></metadata><g display="none"><rect x="1" y="1" display="inline" fill="#000000" width="48" height="48"/></g><g><g><polygon points="34.675,47.178 12.497,25 34.675,2.822 37.503,5.65 18.154,25 37.503,44.35   "/></g></g></svg></button>',
					nextArrow: '<button type="button" class="slick-next"><svg width="8" height="17" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve"><polygon points="6.379,20.908 7.546,22.075 17.621,12 7.546,1.925 6.379,3.092 15.287,12 "/></svg></button>',
					rows: 1,
					slidesToScroll: 1,
					lazyLoad: 'ondemand',
					draggable: false,
					infinite: true,
					arrows: true,
					dots: true,
					autoplay: true,
					autoplaySpeed: 5000,
					responsive: [
						{
							breakpoint: 1024,
							settings: {
								slidesToShow: 5
							}
						}
					]  
				});
			}
		}
		
		if( $('#home-flashsale-2 .listProduct-row').length > 0 ){
			if($(window).width() > 991){
				$('#home-flashsale-2 .listProduct-row:not(.slick-initialized)').slick({
					slidesToShow: 4,
					prevArrow: '<button type="button" class="slick-prev"><svg width="8" height="17" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 50 50" enable-background="new 0 0 50 50" xml:space="preserve"><metadata><?xpacket begin="&#65279;" id="W5M0MpCehiHzreSzNTczkc9d"?><x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 5.3-c011 66.145661, 2012/02/06-14:56:27"/><?xpacket end="w"?></metadata><g display="none"><rect x="1" y="1" display="inline" fill="#000000" width="48" height="48"/></g><g><g><polygon points="34.675,47.178 12.497,25 34.675,2.822 37.503,5.65 18.154,25 37.503,44.35   "/></g></g></svg></button>',
					nextArrow: '<button type="button" class="slick-next"><svg width="8" height="17" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve"><polygon points="6.379,20.908 7.546,22.075 17.621,12 7.546,1.925 6.379,3.092 15.287,12 "/></svg></button>',
					rows: 1,
					slidesToScroll: 1,
					lazyLoad: 'ondemand',
					draggable: false,
					infinite: true,
					arrows: true,
					dots: true,
					autoplay: true,
					autoplaySpeed: 5000,
					responsive: [
						{
							breakpoint: 1024,
							settings: {
								slidesToShow: 3
							}
						}
					]
				});
			}
		}
		
		if( $('#home-collection-1 .listProduct-row').length > 0 ){
			if($(window).width() > 991){
				$('#home-collection-1 .listProduct-row:not(.slick-initialized)').slick({
					slidesToShow: 5,
					prevArrow: '<button type="button" class="slick-prev"><svg width="8" height="17" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 50 50" enable-background="new 0 0 50 50" xml:space="preserve"><metadata><?xpacket begin="&#65279;" id="W5M0MpCehiHzreSzNTczkc9d"?><x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 5.3-c011 66.145661, 2012/02/06-14:56:27"/><?xpacket end="w"?></metadata><g display="none"><rect x="1" y="1" display="inline" fill="#000000" width="48" height="48"/></g><g><g><polygon points="34.675,47.178 12.497,25 34.675,2.822 37.503,5.65 18.154,25 37.503,44.35   "/></g></g></svg></button>',
					nextArrow: '<button type="button" class="slick-next"><svg width="8" height="17" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve"><polygon points="6.379,20.908 7.546,22.075 17.621,12 7.546,1.925 6.379,3.092 15.287,12 "/></svg></button>',
					rows: 1,
					slidesToScroll: 1,
					lazyLoad: 'ondemand',
					autoplay: true,
					autoplaySpeed: 5000,
					draggable: false,
					infinite: true,
					arrows: true,
					dots: false
				});
			}
		}
		
		/*if( $('#home-collection-2 .listProduct-row').length > 0 ){
			if($(window).width() > 1023){
				$('#home-collection-2 .listProduct-row').slick({
					slidesToShow: 5,
					prevArrow: '<button type="button" class="slick-prev"><svg width="8" height="17" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 50 50" enable-background="new 0 0 50 50" xml:space="preserve"><metadata><?xpacket begin="&#65279;" id="W5M0MpCehiHzreSzNTczkc9d"?><x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 5.3-c011 66.145661, 2012/02/06-14:56:27"/><?xpacket end="w"?></metadata><g display="none"><rect x="1" y="1" display="inline" fill="#000000" width="48" height="48"/></g><g><g><polygon points="34.675,47.178 12.497,25 34.675,2.822 37.503,5.65 18.154,25 37.503,44.35   "/></g></g></svg></button>',
					nextArrow: '<button type="button" class="slick-next"><svg width="8" height="17" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve"><polygon points="6.379,20.908 7.546,22.075 17.621,12 7.546,1.925 6.379,3.092 15.287,12 "/></svg></button>',
					rows: 1,
					slidesToScroll: 1,
					infinite: true,
					arrows: true,
					dots: false
				});
			}
		}
		if( $('#home-collection-4 .listProduct-row').length > 0 ){
			if($(window).width() > 1023){
				$('#home-collection-4 .listProduct-row').slick({
					slidesToShow: 5,
					prevArrow: '<button type="button" class="slick-prev"><svg width="8" height="17" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 50 50" enable-background="new 0 0 50 50" xml:space="preserve"><metadata><?xpacket begin="&#65279;" id="W5M0MpCehiHzreSzNTczkc9d"?><x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 5.3-c011 66.145661, 2012/02/06-14:56:27"/><?xpacket end="w"?></metadata><g display="none"><rect x="1" y="1" display="inline" fill="#000000" width="48" height="48"/></g><g><g><polygon points="34.675,47.178 12.497,25 34.675,2.822 37.503,5.65 18.154,25 37.503,44.35   "/></g></g></svg></button>',
					nextArrow: '<button type="button" class="slick-next"><svg width="8" height="17" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve"><polygon points="6.379,20.908 7.546,22.075 17.621,12 7.546,1.925 6.379,3.092 15.287,12 "/></svg></button>',
					rows: 1,
					slidesToScroll: 1,
					infinite: true,
					arrows: true,
					dots: false
				});
			}
		}*/
		
		if( $('#home-collection-2 .listProduct-row').length > 0 ){
			if($(window).width() > 991){
				$('#home-collection-2 .listProduct-row:not(.slick-initialized)').slick({
					slidesToShow: 5,
					prevArrow: '<button type="button" class="slick-prev"><svg width="8" height="17" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 50 50" enable-background="new 0 0 50 50" xml:space="preserve"><metadata><?xpacket begin="&#65279;" id="W5M0MpCehiHzreSzNTczkc9d"?><x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 5.3-c011 66.145661, 2012/02/06-14:56:27"/><?xpacket end="w"?></metadata><g display="none"><rect x="1" y="1" display="inline" fill="#000000" width="48" height="48"/></g><g><g><polygon points="34.675,47.178 12.497,25 34.675,2.822 37.503,5.65 18.154,25 37.503,44.35   "/></g></g></svg></button>',
					nextArrow: '<button type="button" class="slick-next"><svg width="8" height="17" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve"><polygon points="6.379,20.908 7.546,22.075 17.621,12 7.546,1.925 6.379,3.092 15.287,12 "/></svg></button>',
					rows: 1,
					slidesToScroll: 1,
					lazyLoad: 'ondemand',
					autoplay: true,
					autoplaySpeed: 5000,
					draggable: false,
					infinite: true,
					arrows: true,
					dots: false
				});
			}
		}
		
		if( $('#home-collection-4 .listProduct-row').length > 0 ){
			if($(window).width() > 991){
				$('#home-collection-4 .listProduct-row:not(.slick-initialized)').slick({
					slidesToShow: 5,
					prevArrow: '<button type="button" class="slick-prev"><svg width="8" height="17" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 50 50" enable-background="new 0 0 50 50" xml:space="preserve"><metadata><?xpacket begin="&#65279;" id="W5M0MpCehiHzreSzNTczkc9d"?><x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 5.3-c011 66.145661, 2012/02/06-14:56:27"/><?xpacket end="w"?></metadata><g display="none"><rect x="1" y="1" display="inline" fill="#000000" width="48" height="48"/></g><g><g><polygon points="34.675,47.178 12.497,25 34.675,2.822 37.503,5.65 18.154,25 37.503,44.35   "/></g></g></svg></button>',
					nextArrow: '<button type="button" class="slick-next"><svg width="8" height="17" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve"><polygon points="6.379,20.908 7.546,22.075 17.621,12 7.546,1.925 6.379,3.092 15.287,12 "/></svg></button>',
					rows: 1,
					slidesToScroll: 1,
					lazyLoad: 'ondemand',
					autoplay: false,
					autoplaySpeed: 5000,
					draggable: false,
					infinite: true,
					arrows: true,
					dots: false
				});
			}
		}
		
		if( $('#home-collection-5 .listProduct-row').length > 0 ){
			if($(window).width() > 991){
				$('#home-collection-5 .listProduct-row:not(.slick-initialized)').slick({
					slidesToShow: 5,
					prevArrow: '<button type="button" class="slick-prev"><svg width="8" height="17" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 50 50" enable-background="new 0 0 50 50" xml:space="preserve"><metadata><?xpacket begin="&#65279;" id="W5M0MpCehiHzreSzNTczkc9d"?><x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 5.3-c011 66.145661, 2012/02/06-14:56:27"/><?xpacket end="w"?></metadata><g display="none"><rect x="1" y="1" display="inline" fill="#000000" width="48" height="48"/></g><g><g><polygon points="34.675,47.178 12.497,25 34.675,2.822 37.503,5.65 18.154,25 37.503,44.35   "/></g></g></svg></button>',
					nextArrow: '<button type="button" class="slick-next"><svg width="8" height="17" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve"><polygon points="6.379,20.908 7.546,22.075 17.621,12 7.546,1.925 6.379,3.092 15.287,12 "/></svg></button>',
					rows: 1,
					slidesToScroll: 1,
					lazyLoad: 'ondemand',
					autoplay: false,
					autoplaySpeed: 5000,
					draggable: false,
					infinite: true,
					arrows: true,
					dots: false
				});
			}
		}
		
		if( $('#home-collection-6 .listProduct-row').length > 0 ){
			if($(window).width() > 991){
				$('#home-collection-6 .listProduct-row:not(.slick-initialized)').slick({
					slidesToShow: 5,
					prevArrow: '<button type="button" class="slick-prev"><svg width="8" height="17" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 50 50" enable-background="new 0 0 50 50" xml:space="preserve"><metadata><?xpacket begin="&#65279;" id="W5M0MpCehiHzreSzNTczkc9d"?><x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 5.3-c011 66.145661, 2012/02/06-14:56:27"/><?xpacket end="w"?></metadata><g display="none"><rect x="1" y="1" display="inline" fill="#000000" width="48" height="48"/></g><g><g><polygon points="34.675,47.178 12.497,25 34.675,2.822 37.503,5.65 18.154,25 37.503,44.35   "/></g></g></svg></button>',
					nextArrow: '<button type="button" class="slick-next"><svg width="8" height="17" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve"><polygon points="6.379,20.908 7.546,22.075 17.621,12 7.546,1.925 6.379,3.092 15.287,12 "/></svg></button>',
					rows: 1,
					slidesToScroll: 1,
					lazyLoad: 'ondemand',
					autoplay: false,
					autoplaySpeed: 5000,
					draggable: false,
					infinite: true,
					arrows: true,
					dots: false
				});
			}
		}
		
		if( $('#home-collection-3 .listProduct-row').length > 0 ){
			if($(window).width() > 991){
				$('#home-collection-3 .listProduct-row:not(.slick-initialized)').slick({
					slidesToShow: 1,
					prevArrow: '<button type="button" class="slick-prev"><svg width="8" height="17" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 50 50" enable-background="new 0 0 50 50" xml:space="preserve"><metadata><?xpacket begin="&#65279;" id="W5M0MpCehiHzreSzNTczkc9d"?><x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 5.3-c011 66.145661, 2012/02/06-14:56:27"/><?xpacket end="w"?></metadata><g display="none"><rect x="1" y="1" display="inline" fill="#000000" width="48" height="48"/></g><g><g><polygon points="34.675,47.178 12.497,25 34.675,2.822 37.503,5.65 18.154,25 37.503,44.35   "/></g></g></svg></button>',
					nextArrow: '<button type="button" class="slick-next"><svg width="8" height="17" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve"><polygon points="6.379,20.908 7.546,22.075 17.621,12 7.546,1.925 6.379,3.092 15.287,12 "/></svg></button>',
					rows: 1,
					slidesToScroll: 1,
					lazyLoad: 'ondemand',
					autoplay: false,
					autoplaySpeed: 5000,
					draggable: false,
					infinite: true,
					arrows: true,
					dots: false
				});
			}
		}
	},
	countdown: function(){
		var element = document.getElementById('soon-espa');
		$(document).ready(function(){
			var time_start = $('.collection-countdown .auto-due').attr('data-start');
			var time_end = $('.collection-countdown .auto-due').attr('data-end');
			var beforeRun = new Date(time_start);
			beforeRun = beforeRun.getTime();

			var afterRun = new Date(time_end);
			afterRun = afterRun.getTime();

			var now = new Date();
			now = now.getTime();

			function complete() {
				var today = new Date();
				var cdate = today.getTime();

				if(cdate < afterRun){
					Soon.destroy(element);
					Soon.create(element,{
						due: time_end,
						now: null,
						layout:"group tight label-small",
						face:"slot",
						format:"d,h,m,s",
						labelsYears:null,
						labelsDays:'NgÃ y',
						labelsHours:'Giá»',
						labelsMinutes:'PhÃºt',
						labelsSeconds:'GiÃ¢y',
						separateChars:false,
						scaleMax:"s",
						separator:":",
						singular:true,
						eventComplete: function(){
							//$('.collection-countdown').hide();
						}
					});
				}
			}
			if(now < afterRun){
				Soon.create(element,{
					due: time_start,
					now: null,
					layout:"group tight label-small",
					face:"slot",
					format:"d,h,m,s",
					labelsYears:null,
					labelsDays:'NgÃ y',
					labelsHours:'Giá»',
					labelsMinutes:'PhÃºt',
					labelsSeconds:'GiÃ¢y',
					separateChars:false,
					scaleMax:"s",
					separator:":",
					singular:true,
					eventTick: tick,
					eventComplete: complete
				});
			}
		});
	},
	tabHome: function(){
		function slideAjax(){
			if( $('#home-flashsale-3 .tab-content.active .listProduct-row').length > 0 ){
				if($(window).width() > 991){
					$('#home-flashsale-3 .tab-content.active .listProduct-row:not(.slick-initialized)').slick({
						slidesToShow: 5,
						prevArrow: '<button type="button" class="slick-prev" aria-label="Tiáº¿p theo"><svg width="8" height="17" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 50 50" enable-background="new 0 0 50 50" xml:space="preserve"><metadata><?xpacket begin="&#65279;" id="W5M0MpCehiHzreSzNTczkc9d"?><x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 5.3-c011 66.145661, 2012/02/06-14:56:27"/><?xpacket end="w"?></metadata><g display="none"><rect x="1" y="1" display="inline" fill="#000000" width="48" height="48"/></g><g><g><polygon points="34.675,47.178 12.497,25 34.675,2.822 37.503,5.65 18.154,25 37.503,44.35   "/></g></g></svg></button>',
						nextArrow: '<button type="button" class="slick-next" aria-label="LÃ¹i láº¡i"><svg width="8" height="17" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve"><polygon points="6.379,20.908 7.546,22.075 17.621,12 7.546,1.925 6.379,3.092 15.287,12 "/></svg></button>',
						rows: 1,
						slidesToScroll: 5,
						draggable: false,
						infinite: true,
						arrows: true,
						dots: false,
						autoplay: true,
						autoplaySpeed:5000,
						responsive: [
							{
								breakpoint: 1024,
								settings: {
									slidesToShow: 3,
									slidesToScroll: 3
								}
							}
						]
					});
				}
			}
		};
		slideAjax();

		var limitProd = 15;
		$('#home-flashsale-3 .tab-nav a').on('shown.bs.tab', function(e){
			//$('#home-flashsale-3 .slick-slider').slick('setPosition');
			$('#home-flashsale-3 .slick-slider').slick('refresh');
			
			var handle = $('#home-flashsale-3 .tab-nav li a.active').attr("data-handle");
			var v = $('#tabs-ajax .tab-content.active .listProduct-row .proloop-fs:not(.proloop-loadding)').length;
			var indexTab = $('#home-flashsale-3 .tab-nav li a.active').parent().index();
			var title = $('#home-flashsale-3 .tab-nav li a.active').html();
			var countProd = $('#home-flashsale-3 .tab-nav li a.active').attr("data-count");
			
			if(v == 0){	
				if(handle == ''){
					$.ajax({
						url: '/collections/all?view=home-product-data-no',
						success:function(data){
							setTimeout(function(){
								$('#tabs-ajax .tab-content.active .listProduct-row').html('');
								$('#tabs-ajax .tab-content.active .listProduct-row').append(data);
							},350)
						}
					});
				}
				else{
					$.ajax({
						url: handle+'?view=home-product-data',
						async: true,
						success:function(data){
							
								data = data.replace(/hfs_3_loop/g,'hfs_3_'+(indexTab+1)+'_loop_');
								$('#tabs-ajax .tab-content.active .listProduct-row').html('');
								$('#tabs-ajax .tab-content.active .listProduct-row').append(data);
					
							setTimeout(function(){
								slideAjax();
							},300);
						}
					});
				}
			}
		});
	},
	loadMore: function(){
		var self = this;
		var max_part = 6;
		var start_part = 1;
		$(window).scroll(function() {
			if($('#home-collection-1').length > 0){
				var height = $('#home-collection-1').offset().top - $('#home-collection-1').height();
				if ($(window).scrollTop() > height && self.allowScroll ) {
					self.allowScroll = false;
					$.get('/?view=load-more').done(function(data){
						$('main').append(data);
						self.sliderHome();
						GVN.Global.supportCheckGiftPE(true);
						GVN.Rating.checkRatingLoop();
					});
				}
			}
		});
	},
	loadMore2: function(){
		var self = this;
		$(window).scroll(function() {
			var height = $('main .section:last-child').offset().top - $('.section:last-child').height();
			if ($(window).scrollTop() > height && self.allowScroll && self.start_part <= self.max_part ) {
				self.allowScroll = false;
				$.get('/search?q='+self.start_part+'&view=get-part-home').done(function(data){
					self.start_part++;
					
					if ( self.start_part > self.max_part) {
						$('.loading-ajax').addClass('d-none');
					}
					
					$('main').append(data);
					self.sliderHome();
					GVN.Global.supportCheckGiftPE(true);
					self.allowScroll = true;
					GVN.Rating.checkRatingLoop();
				});
			}
		});
	}
}
GVN.Collection = {
	picked: {},
	tags: {},
	firstPrice: [0,0],
	pagiFilter: {},
	hrvParam: ['sort_by'],
	otherParamVal: [],
	init: function() {	
		var that = this;
		that.action();
		that.getFilter();
		that.renderPrice();
		that.getSort();
		that.viewMoreContent();
		that.loadMore();
		that.scrollFixedHeader();
		GVN.Helper.pickItem();
		
		if($('#slider-banner-collection').length > 0){
			GVN.Helper.slickSlider('#slider-banner-collection', 1, 1, 1, {
				infinite: true,
				autoplay: true,
				fade: true,
				arrows: false,
				dots: true,
			});
		}
	},
	action: function(){
		/* Open bá»™ lá»c tá»•ng */
		$(document).on('click','.filter-total .jsFilter',function(e){
			e.preventDefault();
			var self = $(this);
			
			$('.collection-filter').removeClass('fixed-head').css('top',0);
			$('.collection-filter .filter-wrap').removeClass('visible-title');
			$('.collection-filter .collection-sortby').removeClass('d-none');
			var x = jQuery('.collection-sortby').offset().top;
			GVN.Helper.smoothScroll(x-80, 400);
			
			setTimeout(function() {
				self.addClass('active');
				self.parents('.filter-total').find('.filter-total--content').addClass('active');
				jQuery('body,html').addClass('open-noscroll open-overlay');
				jQuery('.osc-button').css('z-index',10);
			},450);
		});
		
		/* Close bá»™ lá»c tá»•ng */
		$(document).on('click','.filter-total .filter-btn-close',function(e){
			e.preventDefault();
			jQuery(this).parents('.filter-total').find('.filter-total--title').removeClass('active');
			jQuery(this).parents('.filter-total').find('.filter-total--content').removeClass('active');
			jQuery('body,html').removeClass('open-noscroll open-overlay');
		});
		
		/* Open Sáº¯p xáº¿p */
		$('body').on("click", ".js-sort", function (e) {
			jQuery(this).toggleClass("active");
			jQuery(this).parent().find('.sortby-option').toggleClass("show-sort");
			jQuery('.overlay-filter').addClass('active');
		});
		
		/* Click vÃ o overlay Ä‘á»ƒ táº¯t dropdown */
		$('body').on("click", ".site-overlay", function (e) {
			jQuery(this).removeClass("active");
			jQuery('.sortby-control').find('.js-sort').removeClass("active");
			jQuery('.sortby-control').find('.sortby-option').removeClass("show-sort");
			jQuery('.filter-total--title').removeClass('active');
			jQuery('.filter-total--content').removeClass('active');
		});
		
		/* Open bá»™ lá»c riÃªng láº» */
		$('body').on("click", ".filter-single .jsTitle", function (e) {
			e.preventDefault();
			var self = $(this);
			$('.collection-filter').removeClass('fixed-head').css('top',0);
			$('.collection-filter .filter-wrap').removeClass('visible-title');
			$('.collection-filter .collection-sortby').removeClass('d-none');
			var x = jQuery('.collection-sortby').offset().top;
			var h = $(".main-header").innerHeight();
			GVN.Helper.smoothScroll(x-h-80, 400);

			setTimeout(function() {
				$(".filter-single .filter-group--block").removeClass("isShowing");
				if ($("body").hasClass("bg-black")) {
					if (self.hasClass("showing")) {
						$("body").removeClass("bg-black");
						$(".filter-single .filter-group--block").removeClass("isShowing");
						$(".filter-single .filter-group--title").removeClass("showing");
						$(".filter-single .filter-group--content").fadeOut(300);
						GVN.Collection.activeOrUnActiveBlock();
					}
					else {
						$(".filter-single .filter-group--block.isShowing").removeClass("isShowing");
						$(".filter-single .filter-group--title.showing").removeClass("showing");
						$(".filter-single .filter-group--content").fadeOut();
						GVN.Collection.activeOrUnActiveBlock();
						self.parents(".filter-single .filter-group--block").find(".filter-group--content").fadeIn(300);
						self.addClass("active").addClass("showing");
						self.parents(".filter-single .filter-group--block").addClass("isShowing");
					}
				}
				else {
					self.addClass("showing");
					self.parents(".filter-single .filter-group--block").addClass("isShowing");
					self.next(".filter-single .filter-group--content").fadeIn(300);
					self.parent().hasClass("filter-total") ? $("body.bg-black").addClass("overlay-filter") : $("body.bg-black").removeClass("overlay-filter");
					$(".listbox__list-wrapper").fadeOut(0),
					$("body").addClass("bg-black");
				}
			},450);
			
		});
		
		/* Click vÃ o overlay mÃ u tá»‘i Ä‘á»ƒ táº¯t dropdown */
		$(document).on("click", ".bg-black", function(n) {
			n.target == this && GVN.Collection.closePopup()
		});
		
		/* Click input filter */
		$(document).on('click','.filter-group input',function(){
			var id = $(this).attr('id');
			var value = $(this).val();
			var standard = $(this).parents('.filter-group').attr('data-param');
			var hasActive = $(this).parent().hasClass('active');
			if(id.indexOf('sub-') > -1){ /* Single */
				$('.filter-total [data-param="'+standard+'"] input[value="'+value+'"]').click();
			}
			else { /* Total */
				$(this).parent().toggleClass('active');
				$('.filter-single [data-param="'+standard+'"] input[value="'+value+'"]').parent().toggleClass('active');
				
				var count_picked = $('.filter-single [data-param="'+standard+'"] input[value="'+value+'"]').parents('.filter-group').find('li.active').length;
				if(count_picked > 0 || (count_picked == 0 && hasActive)){
					$('.filter-single [data-param="'+standard+'"] input[value="'+value+'"]').parents('.filter-group').find('.btn-filter--apply').addClass('active');
					$('.filter-single [data-param="'+standard+'"] input[value="'+value+'"]').parents('.filter-group').find('.btn-filter--unselect').addClass('active');
					$('.filter-total .btn-filter--apply').addClass('active');
				}
				else{
					$('.filter-single [data-param="'+standard+'"] input[value="'+value+'"]').parents('.filter-group').find('.btn-filter--apply').removeClass('active');
					$('.filter-single [data-param="'+standard+'"] input[value="'+value+'"]').parents('.filter-group').find('.btn-filter--unselect').removeClass('active');
				}
			}
			
			GVN.Collection.tagSelected(standard);
			
			var isSlidePrice = standard == 'price';
			if(isSlidePrice){
				var stepSlider = document.getElementById('range-price-steps');
				var singleSlider = document.getElementById('sub-range-price-steps');

				stepSlider.noUiSlider.set([min_origin, max_origin]);
				singleSlider.noUiSlider.set([min_origin, max_origin]);
				$('#input-with-keypress-0,#sub-input-with-keypress-0').val(GVN.Helper.moneyFormat(min_origin,'â‚«'));
				$('#input-with-keypress-1,#sub-input-with-keypress-1').val(GVN.Helper.moneyFormat(max_origin,'â‚«'));
			}
			
		});
		
		/* Click Apply Values Filter */
		$(document).on('click','.btn-filter--apply',function(e){
			e.preventDefault();
			$('.collection-layout').addClass('js-loading');
			GVN.Collection.stringFilter();
		});
		
		/* Remove Values Selected */
		$(document).on('click','.filter-tags--remove',function(e){
			e.preventDefault();
			var standard = $(this).parents('.filter-tags').attr('data-select');
			var isSlidePrice = standard == 'price' && $(this).siblings('b').find('.d-none').length > 0?true:false;
			$(this).parents('.filter-tags').removeClass('opened');
			$(this).parents('.filter-tags').find('b').html('');
			$('.filter-total .filter-group[data-param="'+standard+'"] li').removeClass('active');
			$('.filter-single .filter-group[data-param="'+standard+'"] li').removeClass('active');
			$('.filter-single .filter-group[data-param="'+standard+'"]').removeClass('hasSelect');
			$(`.${standard}-group .btn-filter--unselect`).removeClass('active');
			var textTitle = $('.filter-single .filter-group[data-param="'+standard+'"] .jsTitle span:eq(0)').attr("data-text");
			$('.filter-single .filter-group[data-param="'+standard+'"] .jsTitle span:eq(0)').html(textTitle);
			
			if(isSlidePrice){
				var stepSlider = document.getElementById('range-price-steps');
				var singleSlider = document.getElementById('sub-range-price-steps');

				stepSlider.noUiSlider.set([min_origin, max_origin]);
				singleSlider.noUiSlider.set([min_origin, max_origin]);
				$('#input-with-keypress-0,#sub-input-with-keypress-0').val(GVN.Helper.moneyFormat(min_origin,'â‚«'));
				$('#input-with-keypress-1,#sub-input-with-keypress-1').val(GVN.Helper.moneyFormat(max_origin,'â‚«'));
				GVN.Collection.picked.price = [];
			}

			if($('.filter-total .filter-tags:not(.filter-tags--remove-all).opened').length == 0){
				$('.filter-tags--remove-all').removeClass('opened');
				$('.filter-total .btn-filter--apply,.filter-total .btn-filter--unselect').removeClass('active');
				$('.filter-total .filter-number').html(0).addClass('d-none');
				$('.filter-single .jsTitle.showing').click();
				
				str = '';
				$('.listProduct-row').html(firstCollection.html);
				if(firstCollection.current_page < firstCollection.total_page) $('.collection-pagi').show();
				$('.filter-total  .filter-btn-close').click();
				
				$.each(GVN.Collection.picked,function(key,value){
					if(typeof value == 'object') GVN.Collection.picked[key] = [];
				});
				GVN.Collection.makeUrl();
			}
			else{
				$('.collection-layout').addClass('js-loading');
				GVN.Collection.stringFilter();
			}
		});
		
		/* Remove All Values Selected */
		$(document).on('click','.filter-tags--remove-all',function(e){
			e.preventDefault();
			$('.filter-total .filter-tags').removeClass('opened');
			$('.filter-total .filter-tags b').html('');
			$('.filter-total .btn-filter--apply,.filter-total li.active,.filter-single li.active').removeClass('active');
			$('.filter-single .filter-group').removeClass('hasSelect');
			
			$('.filter-total .filter-number').html(0).addClass('d-none');
			$('.btn-filter--apply').removeClass('active');
			
			str = '';
			$('.listProduct-row').html(firstCollection.html);
			
			if(firstCollection.current_page < firstCollection.total_page){
				var still = firstCollection.total_product - firstCollection.current_page * firstCollection.perPage;
				$('.collection-pagi button').html('Xem thÃªm <span>'+still+'</span> sáº£n pháº©m <svg xmlns="http://www.w3.org/2000/svg" width="11" height="6" viewBox="0 0 11 6" fill="none"><path d="M5.35858 5.35858L0.841421 0.841421C0.715428 0.715428 0.804661 0.5 0.982842 0.5H10.0172C10.1953 0.5 10.2846 0.715428 10.1586 0.841421L5.64142 5.35858C5.56332 5.43668 5.43668 5.43668 5.35858 5.35858Z" fill="#111111"/></svg>');
				$('.collection-pagi').show(); 
			}
			$('.filter-total  .filter-btn-close').click();
			
			var textTitle = $('.filter-single .filter-group[data-param="vendor"] .jsTitle span:eq(0)').attr("data-text");
			$('.filter-single .filter-group[data-param="vendor"] .jsTitle span:eq(0)').html(textTitle);
			
			$.each(GVN.Collection.picked,function(key,value){
				if(typeof value == 'object') GVN.Collection.picked[key] = [];
			});
			GVN.Collection.makeUrl();
			
			/*
			$('.collection-layout').addClass('js-loading');
			GVN.Collection.stringFilter();
			*/
		});
		
		/* Click Button Bá» Chá»n */
		$(document).on('click','.btn-filter--unselect',function(e){
			e.preventDefault();
			var div_control = $(this).parents('.filter-control');
			if(div_control.hasClass('filter-button--single')){
				var standard = $(this).parents('.filter-group').attr('data-param');
				$('.filter-tags[data-select="'+standard+'"] .filter-tags--remove').click();
			}
			else if(div_control.hasClass('filter-button--total')){
				$('.filter-tags--remove-all').click();
				var stepSlider = document.getElementById('range-price-steps');
				var singleSlider = document.getElementById('sub-range-price-steps');
				
				stepSlider.noUiSlider.set([min_origin, max_origin]);
				singleSlider.noUiSlider.set([min_origin, max_origin]);
				$('#input-with-keypress-0,#sub-input-with-keypress-0').val(GVN.Helper.moneyFormat(min_origin,'â‚«'));
				$('#input-with-keypress-1,#sub-input-with-keypress-1').val(GVN.Helper.moneyFormat(max_origin,'â‚«'));
			}
			$(this).removeClass('active');
		});
		
		/* Click chá»n sort */
		$(document).on('click','.sortBy li',function(e){
			e.preventDefault();
			$('.sortBy li').removeClass('active');
			$(this).addClass('active');
			var current_sort = $(this).find('label').html();
			$('.current-sort').html(current_sort);
			if(str == ''){
				window.location.href = window.location.origin+window.location.pathname+'?sort_by='+$(this).find('input').val();
			}
			else{
				$('.collection-layout').addClass('js-loading');
				$('.overlay-filter').removeClass('active');
				GVN.Collection.stringFilter();
				$('.sortBy').removeClass('show-sort');
			}
		});
		
		/* Click vÃ o overlay mÃ u tá»‘i Ä‘á»ƒ táº¯t dropdown sort */
		$(document).on("click", ".overlay-filter", function(n) {
			$(this).removeClass('active');
			$('.sortBy').removeClass('show-sort');
		});
		
	},
	getFilter: function(){
		var self = this;
		/* Get bá»™ lá»c theo tá»«ng colelction */		
		if(firstCollection.html == '') firstCollection.html = $('.listProduct-row').html();
		
		$.ajax({
			url: window.location.origin+window.location.pathname+"?view=render-filter",
			type: "GET",
			async: false,
			success: function(data){
				if(data.indexOf('####') > -1){
					data = data.split('####');
					if(data[0].trim() != ''){
						$('.filter-single .list-filter--main').html(data[0]);
						$('.filter-total .list-filter--main').html(data[0].replace(/sub-/g,''));
						$('.filter-total .filter-button--single').remove();

						$('.filter-total .list-tags').html(data[1]);

						$('.filter-single .filter-group').each(function(){
							var key = $(this).attr('data-param');
							var origin = $(this).attr('data-origin');
							GVN.Collection.picked[key] = [];
							if($(this).hasClass('tag-filter')){
								GVN.Collection.tags[key] = {
									"origin": origin,
									"picked": ''
								};
							}
						});

						$(".filter-single .filter-group--title").each(function() {
							$(this).next(".filter-group--content").length > 0 && $(this).offset().left >= 900 ? $(this).next(".filter-group--content").addClass("filter-show--right") : $(this).next(".filter-group--content").removeClass("filter-show--right")
						});
												
						$('.collection-layout').removeClass('js-loading');
					}
					else{
						$('.filter-wrap').remove();
						$('.collection-layout').removeClass('js-loading');
					}
				}
				else{
					$('.filter-wrap').remove();
					$('.collection-layout').removeClass('js-loading');
				}
				
				$('.filter-single .filter-group').each(function(){
					var key = $(this).attr('data-param');
					self.hrvParam.push(key);
				});
			}
		});
	},
	getSort: function(){
		var text = $('.sortBy ul li.active input').attr('data-filter');
		var urlValue = $('.sortBy ul li.active input').val();
		if(urlValue != 'manual'){
			window.collecConfig.filterData.pick.sort_by = urlValue;
			return text;
		}
		else{
			delete window.collecConfig.filterData.pick.sort_by;
		}
	},
	renderPrice: function(){
		var stepsSlider = document.getElementById('range-price-steps');
		if(stepsSlider != null){
			var sub_stepsSlider = document.getElementById('sub-range-price-steps');
			var hostShop = window.location.pathname;
			$.when($.get(hostShop+"?view=min-price&sort_by=price-ascending"),$.get(hostShop+"?view=max-price&sort_by=price-descending")).then(function(min,max){
				if($('#input-with-keypress-0,#sub-input-with-keypress-0').length > 0){
					var input0 = Number(min[0])/100;
					var input1 = Number(max[0])/100;
					var inputs = [input0, input1];
					$('#input-with-keypress-0,#sub-input-with-keypress-0').val(GVN.Helper.moneyFormat(input0,'â‚«'));
					$('#input-with-keypress-1,#sub-input-with-keypress-1').val(GVN.Helper.moneyFormat(input1,'â‚«'));

					min_origin = input0;
					max_origin = input1;

					noUiSlider.create(stepsSlider, {
						start: [input0, input1],
						connect: true,
						step: (input1 - input0)/20,
						range: {
							'min': [input0],
							'max': [input1]
						},
						format: wNumb({
							decimals: 0,
							thousand: ',',
							suffix: ' â‚«'
						})
					});	
					noUiSlider.create(sub_stepsSlider, {
						start: [input0, input1],
						connect: true,
						step: (input1 - input0)/20,
						range: {
							'min': [input0],
							'max': [input1]
						},
						format: wNumb({
							decimals: 0,
							thousand: ',',
							suffix: ' â‚«'
						})
					});

					stepsSlider.noUiSlider.on('slide', function (values, handle) {
						$('#input-with-keypress-0,#sub-input-with-keypress-0').val(values[0].replace(/\,/g,'.').replace(' â‚«','â‚«'));
						$('#input-with-keypress-1,#sub-input-with-keypress-1').val(values[1].replace(/\,/g,'.').replace(' â‚«','â‚«'));
						inputs[handle].value = values[handle].replace(/\,/g,'.').replace(' â‚«','â‚«');
					});

					stepsSlider.noUiSlider.on('end', function (values, handle) {
						$('.filter-total #filter-price li,.filter-single #filter-price li').removeClass('active');
						$('.filter-single .price-group').addClass('hasSelect');

						/* Render Tag */
						var indexTitle = $('.filter-group.price-group').index();
						let min = $('#input-with-keypress-0').val().replace(/\,/g,'.').replace(' â‚«','â‚«');
						let max = $('#input-with-keypress-1').val().replace(/\,/g,'.').replace(' â‚«','â‚«');
						$('.filter-tags[data-select="price"] b').html(min+' - '+max+'<span class="d-none">ps</span>').parent().addClass('opened');
						if($('.filter-tags.opened').length > 0){
							/* In Total */
							$('.filter-tags--remove-all').addClass('opened');
							$('.filter-tags-wrap').removeClass('d-none');
							$('.filter-total .btn-filter--unselect').addClass('active');
							$('.filter-total .btn-filter--apply').addClass('active');

							/* In Single */
							$('.filter-single #filter-price .btn-filter--unselect').addClass('active');
							$('.filter-single #filter-price .btn-filter--apply').addClass('active');
						}

						sub_stepsSlider.noUiSlider.set(values);
					});

					sub_stepsSlider.noUiSlider.on('slide', function (values, handle) {
						$('#input-with-keypress-0,#sub-input-with-keypress-0').val(values[0].replace(/\,/g,'.').replace(' â‚«','â‚«'));
						$('#input-with-keypress-1,#sub-input-with-keypress-1').val(values[1].replace(/\,/g,'.').replace(' â‚«','â‚«'));
						inputs[handle].value = values[handle].replace(/\,/g,'.').replace(' â‚«','â‚«');
					});

					sub_stepsSlider.noUiSlider.on('end', function (values, handle) {
						$('.filter-total #filter-price li,.filter-single #filter-price li').removeClass('active');
						$('.filter-single .price-group').addClass('hasSelect');
						/* Render Tag */
						var indexTitle = $('.filter-group.price-group').index();
						let min = $('#sub-input-with-keypress-0').val().replace(/\,/g,'.').replace(' â‚«','â‚«');
						let max = $('#sub-input-with-keypress-1').val().replace(/\,/g,'.').replace(' â‚«','â‚«');
						$('.filter-tags[data-select="price"] b').html(min+' - '+max+'<span class="d-none">ps</span>').parent().addClass('opened');
						if($('.filter-tags.opened').length > 0){
							/* In Total */
							$('.filter-tags--remove-all').addClass('opened');
							$('.filter-tags-wrap').removeClass('d-none');
							$('.filter-total .btn-filter--unselect').addClass('active');
							$('.filter-total .btn-filter--apply').addClass('active');

							/* In Single */
							$('.filter-single #filter-price .btn-filter--unselect').addClass('active');
							$('.filter-single #filter-price .btn-filter--apply').addClass('active');
						}

						stepsSlider.noUiSlider.set(values);
					});

					GVN.Collection.checkUrl();
				}
				else if($('.filter-single').length == 0){
					$('.collection-layout').removeClass('js-loading');
				}
			});
		}
		else{
			GVN.Collection.checkUrl();
		}
	},
	checkUrl: function(){
		var self = this;
		var hasFilter = false;
		var valuesPrice = [];
		
		if (!jQuery.isEmptyObject(paramUrl)){
			var count = 0;
			var count_sort = 0;
			$.each(paramUrl,function(standard,value){
				if(self.hrvParam.indexOf(standard) == -1 && self.otherParamVal.indexOf(standard+'='+value) == -1){
					self.otherParamVal.push(standard+'='+value);
				}
				else{
					if(standard != 'sort_by') count++;
					else count_sort++;
					
					if(standard != 'price' && standard != 'sort_by'){
						value = value.split(',');
						value.map(x => {
							$('.filter-total input[data-check="'+x+'"]').click();
						});
					}
					else{
						if(value.indexOf('ps') > -1){
							value = value.replace('ps','').split('-');

							var stepSlider = document.getElementById('range-price-steps');
							var singleSlider = document.getElementById('sub-range-price-steps');

							var min_picked = GVN.Helper.moneyFormat(Number(value[0]),'â‚«');
							var max_picked = GVN.Helper.moneyFormat(Number(value[1]),'â‚«');
							
							stepSlider.noUiSlider.set([Number(value[0]), Number(value[1])]);
							singleSlider.noUiSlider.set([Number(value[0]), Number(value[1])]);

							$('#input-with-keypress-0,#sub-input-with-keypress-0').val(min_picked);
							$('#input-with-keypress-1,#sub-input-with-keypress-1').val(max_picked);
							
							var min = min_picked.replace(/\,/g,'.').replace(' â‚«','â‚«');
							var max = max_picked.replace(/\,/g,'.').replace(' â‚«','â‚«');
							$('.filter-tags[data-select="price"] b').html(min+' - '+max+'<span class="d-none">ps</span>').parent().addClass('opened');
							$('.filter-single .price-group').addClass('hasSelect');
							$('.filter-single .price-group .btn-filter--unselect').addClass('active');
						}
						else{
							value = value.split(',');
							value.map(x => {
								$('.filter-total input[data-check="'+x+'"]').click();
							});
						}
					}
				}
			});
			
			if(count > 0){
				$('.collection-layout').addClass('js-loading');
				GVN.Collection.stringFilter();
			}
			else{
				if(count_sort > 0){
					hasFilter = true;
					GVN.Collection.stringFilter();
				}
				else{
					$('.collection-layout').removeClass('js-loading');
				}
			}
		}
		else{
			$('.collection-layout').removeClass('js-loading');
		}
		
		/*
			if (!jQuery.isEmptyObject(paramUrl)){
				let hasPriceSlide = false;
				jQuery.each(paramUrl, function(j,k){
					var aFilter = decodeURIComponent(k).split(',');
					switch(j){
						case 'filterType': 
							aFilter.map((x,i) => {
								jQuery('.filter-type input[data-check="'+ x +'"]').parent().addClass('active');
								jQuery('.filter-type input[data-check="'+ x +'"]').prop('checked',true);
							}); 
							hasFilter = true;
							break;
						case 'filterPrice':
							aFilter.map((x,i) => {
								if(x.indexOf('ps') == -1){
									jQuery('.filter-price input[data-check="'+ x +'"]').parent().addClass('active');
									jQuery('.filter-price input[data-check="'+ x +'"]').prop('checked',true);
								}
								else{
									hasPriceSlide = true;
									var stepsSlider = document.getElementById('range-price-steps');
									let max = document.getElementById('input-with-keypress-1');
									let min = document.getElementById('input-with-keypress-0');
									let priceSlide = x.replace('ps','').split('-');
									valuesPrice.push(Haravan.formatMoney(priceSlide[0]*100).replace(/\,/g,'.').replace(' â‚«','â‚«'));
									valuesPrice.push(Haravan.formatMoney(priceSlide[1]*100).replace(/\,/g,'.').replace(' â‚«','â‚«'));
									setTimeout(function(){
										if(stepsSlider.classList.value.indexOf('noUi-target') > -1){
											stepsSlider.noUiSlider.set([priceSlide[0], priceSlide[1]]);
											min.value = Haravan.formatMoney(priceSlide[0]*100).replace(/\,/g,'.').replace(' â‚«','â‚«');
											max.value = Haravan.formatMoney(priceSlide[1]*100).replace(/\,/g,'.').replace(' â‚«','â‚«');
										}
									},1000);
								}
							}); 
							hasFilter = true;
							break;
						case 'filterVendor':
							aFilter.map((x,i) => {
								jQuery('.filter-vendor input[data-check="'+ x +'"]').parent().addClass('active');
								jQuery('.filter-vendor input[data-check="'+ x +'"]').prop('checked',true);
							}); 
							hasFilter = true;
							break;
						case 'filterfilter_Cháº¥t liá»‡u':
							aFilter.map((x,i) => {
								jQuery('.filter-filter_Cháº¥t liá»‡u input[data-check="'+ x +'"]').parent().addClass('active');
								jQuery('.filter-filter_Cháº¥t liá»‡u input[data-check="'+ x +'"]').prop('checked',true);
							}); 
							hasFilter = true;
							break;
						case 'filterfilter_Káº¿t ná»‘i':
							aFilter.map((x,i) => {
								jQuery('.filter-filter_Káº¿t ná»‘i input[data-check="'+ x +'"]').parent().addClass('active');
								jQuery('.filter-filter_Káº¿t ná»‘i input[data-check="'+ x +'"]').prop('checked',true);
							}); 
							hasFilter = true;
							break;
						case 'filterfilter_MÃ u sáº¯c':
							aFilter.map((x,i) => {
								jQuery('.filter-filter_MÃ u sáº¯c input[data-check="'+ x +'"]').parent().addClass('active');
								jQuery('.filter-filter_MÃ u sáº¯c input[data-check="'+ x +'"]').prop('checked',true);
							}); 
							hasFilter = true;
							break;
						case 'filterSortBy': 
							jQuery('.sortBy li').removeClass('active');
							jQuery('.sortBy input').prop('checked',false);
							jQuery('.sortBy input[value="'+ k +'"]').parent().addClass('active');
							jQuery('.sortBy input[value="'+ k +'"]').prop('checked',true);
							var textChange = jQuery('.sortBy input[value="'+ k +'"] + label').text();
							jQuery('.filter-tags--sortby b,.js-sort .current-sort').html(textChange);
							jQuery('.filter-tags--sortby').addClass('opened');

							//jQuery('.js-sortby .current_sort,.filter-tags--sortby b').html(textChange);
							//jQuery('.filter-tags--sortby').addClass('opened');
							hasFilter = true;
							break;
						default:
					}
				});

				if (hasFilter){
					if(!hasPriceSlide){
						GVN.Collection.tagSelected();
						GVN.Collection.Stringfilter();
					}
					else{
						GVN.Collection.tagSelected(valuesPrice);
						setTimeout(function(){
							GVN.Collection.Stringfilter('price_slide');
						},1000);
					}
					GVN.Collection.checkHasFilters();
				}
			}
		*/
	},
	activeOrUnActiveBlock: function(){
		$(".filter-single .jsTitle.showing").hasClass("active") ? $(".jsTitle").removeClass("active") : $(".jsTitle").removeClass("active");
	},
	closePopup: function () {
		$(".filter-total--title").removeClass("active");
		$(".filter-total--content").removeClass("active");
		$(".filter-single .filter-group--block").removeClass("isShowing");
		$(".filter-single .filter-group--content").fadeOut(300);
		$(".filter-single .filter-group--title").removeClass("showing");
		GVN.Collection.activeOrUnActiveBlock();
		$("body").removeClass("bg-black");
		$("body").removeClass("overlay-filter");
	},
	viewMoreContent: function(){
		var height = $(".showmore-content").outerHeight();
		if(height > 95){
			$(".showmore-content").addClass("active");
			$(".view-more").removeClass("hide");
		}
		$(".view-more").click(function(){
			$(this).hide();
			$(".showmore-content").removeClass("active");
		});
	},
	tagSelected: function(standard){
		var optionPicked = [];
		$('.filter-total .filter-group[data-param="'+standard+'"] li.active').each(function(){
			optionPicked.push($(this).find('label').html());
		});
		
		if(optionPicked.length > 0){
			$('.filter-total .filter-tags[data-select="'+standard+'"] b').html(optionPicked.join(', '));
			$('.filter-total .filter-tags[data-select="'+standard+'"]').addClass('opened');
			$('.filter-single .filter-group[data-param="'+standard+'"]').addClass('hasSelect');
			if($('.filter-tags.opened').length > 0){
				/* In Total */
				$('.filter-tags--remove-all').addClass('opened');
				$('.filter-tags-wrap').removeClass('d-none');
			}
		}
		else{
			$('.filter-total .filter-tags[data-select="'+standard+'"] b').html('');
			$('.filter-total .filter-tags[data-select="'+standard+'"]').removeClass('opened');
			$('.filter-single .filter-group[data-param="'+standard+'"]').removeClass('hasSelect');
		}
		
		if($('.filter-total .filter-tags:not(.filter-tags--remove-all).opened').length == 0) $('.filter-tags--remove-all').removeClass('opened');
	},
	makeUrl: function(){
		var self = this;
		var url = [];
		
		if(self.otherParamVal.length > 0) url.push(self.otherParamVal.join('&'));
		
		$.each(GVN.Collection.picked,function(key,value){
			if(typeof value == 'object' && value.length > 0) url.push(`${key}=${value.join(',')}`);
			else if(typeof value == 'string') url.push(`${key}=${value}`);
		});
		url = window.location.origin+window.location.pathname+(url.length > 0?'?'+url.join('&'):'');
		window.history.pushState("", "", url);
	},
	stringFilter: function (){
		var encodeExpressionValue = function (val) {
			if((typeof val) !== 'string' || val == null || val == "")
				return val;
			val = val.replace(/\%/g, '%25');
			val = val.replace(/\(/g, '%26');
			val = val.replace(/\)/g, '%27');
			val = val.replace(/\|/g, '%28');
			val = val.replace(/\-/g, '%29');
			val = val.replace(/\&/g, '%30');
			
			return val;
		}
		var q ="", gia="",vendor="",type="", total_page = 0, cur_page = 1;
		var handle_coll = $('#coll-handle').val();
		var str_url = 'filter=(';
		q = handle_coll;
		var fieldOpened = 0;
		var sortby = GVN.Collection.getSort();
		
		/* Get Value Vendor */
		if($('.filter-total .filter-vendor').length > 0){
			GVN.Collection.picked.vendor = [];
			var summary = [];
			$('.filter-total .filter-vendor li.active').each(function(){
				vendor += '('+encodeExpressionValue($(this).find('input').data('vendor')) + ')||';
				var urlVal = $(this).find('input').attr('data-check');
				GVN.Collection.picked.vendor.push(urlVal);
				summary.push($(this).find('label').html());
			});
			vendor = vendor.substring(0,vendor.length -2);
			if(vendor != ""){
				$('.filter-single .vendor-group .filter-group--title .text').html(summary.join(', '));
				fieldOpened ++;
				vendor = '('+vendor+')';
				q += '&&'+vendor;
			}
			else{
				$('.filter-single .vendor-group .filter-group--title .text').html('HÃ£ng');
			}
		}
		
		/* Get Value Type */
		if($('.filter-total .filter-type').length > 0){
			GVN.Collection.picked.type = [];
			$('.filter-total .filter-type li.active').each(function(){
				type += '('+encodeExpressionValue($(this).find('input').data('type')) + ')||';
				var urlVal = $(this).find('input').attr('data-check');
				GVN.Collection.picked.type.push(urlVal);
			})
			type = type.substring(0,type.length -2);
			if(type != ""){
				fieldOpened ++;
				type = '('+type+')';
				q += '&&'+type;
			}
		}
		
		/* Get Value Price */
		if($('.filter-total .filter-price').length > 0){
			var checkPrice = jQuery('.filter-tags[data-select="price"] b').text();
			if(checkPrice.indexOf('ps') > -1){
				if(GVN.Collection.picked.price.length > 0) GVN.Collection.picked.price = [];
				let min = $('#input-with-keypress-0').val().trim().replace(/\./g,'').replace('â‚«','');
				let max = $('#input-with-keypress-1').val().trim().replace(/\./g,'').replace('â‚«','');
				gia = `((price:product>=${min})&&(price:product<=${max}))||`;
				var urlVal = `${min}-${max}ps`;
				GVN.Collection.picked.price.push(urlVal);
			}
			else{
				if($('.filter-total .filter-price li').length > 0) GVN.Collection.picked.price = [];
				$('.filter-total .filter-price li.active').each(function(){
					gia = gia + $(this).find('input').data('price') + '||';
					var urlVal = $(this).find('input').attr('data-check');
					GVN.Collection.picked.price.push(urlVal);
				})
			}
			gia = gia.substring(0,gia.length -2);
			if(gia != ""){
				fieldOpened ++;
				gia = '('+gia+')';
				q += '&&' + gia;
			}
		}
		
		/* Get Value Tags */
		if(!$.isEmptyObject(GVN.Collection.tags)){
			var special_standard = ['mau-sac','pin','led'];
			$.each(GVN.Collection.tags,function(key_prefix,value_prefix){
				GVN.Collection.tags[key_prefix].picked = '';
				if($(`.filter-total .${key_prefix}`).length > 0) GVN.Collection.picked[key_prefix] = []; 
				$(`.filter-total .${key_prefix} li.active`).each(function(){
					if(special_standard.includes(key_prefix)){
						var data_mau = $(this).find('input').data(key_prefix).replace('~','"');
						data_mau = data_mau.replace('*',GVN.Collection.tags[key_prefix].origin+':');
						GVN.Collection.tags[key_prefix].picked += '('+encodeExpressionValue(data_mau) + ')||';
					}
					else{
						GVN.Collection.tags[key_prefix].picked += '('+encodeExpressionValue($(this).find('input').data(key_prefix).replace('~','"')) + ')||';
					}
					var urlVal = $(this).find('input').attr('data-check');
					GVN.Collection.picked[key_prefix].push(urlVal);
				});
				
				GVN.Collection.tags[key_prefix].picked = GVN.Collection.tags[key_prefix].picked.substring(0,GVN.Collection.tags[key_prefix].picked.length -2);
				if(GVN.Collection.tags[key_prefix].picked != ""){
					fieldOpened ++;
					GVN.Collection.tags[key_prefix].picked = '('+GVN.Collection.tags[key_prefix].picked+')';
					q += '&&('+ GVN.Collection.tags[key_prefix].picked + ')';
				}
			});
		}
		
		/* Get Sort */
		if(sortby != undefined){
			GVN.Collection.picked.sort_by = $('.sortBy li.active input').val();
		}
		else{
			delete GVN.Collection.picked.sort_by;
		}
		
		str_url +=  encodeURIComponent(q) + ')' + (sortby != undefined?"&sortby="+sortby:'');
		str = str_url ;
		
		/* Count number standard filter selected */
		if(fieldOpened > 0){
			jQuery('.filter-total .filter-number').html(fieldOpened).removeClass('d-none');
		}
		else{
			jQuery('.filter-total .filter-number').html(0).addClass('d-none');
		}
		
		/* Láº¥y tá»•ng sá»‘ trang cá»§a káº¿t quáº£ filter */
		jQuery.ajax({
			url: "/search?q="+str_url+"&view=page",	
			dataType: 'json',
			async: false,
			success:function(data){
				total_page = parseInt(data.pageSize);
				GVN.Collection.pagiFilter.total_product = data.total;
				GVN.Collection.pagiFilter.total_page = data.pageSize;
				GVN.Collection.pagiFilter.current_page = cur_page;
			}
		});

		//console.log(total_page);
		if(cur_page <= total_page && total_page > 0){
			if(total_page > 1){
				var still = GVN.Collection.pagiFilter.total_product - GVN.Collection.pagiFilter.current_page * firstCollection.perPage;
				$('.collection-pagi button').html('Xem thÃªm <span>'+still+'</span> sáº£n pháº©m <svg xmlns="http://www.w3.org/2000/svg" width="11" height="6" viewBox="0 0 11 6" fill="none"><path d="M5.35858 5.35858L0.841421 0.841421C0.715428 0.715428 0.804661 0.5 0.982842 0.5H10.0172C10.1953 0.5 10.2846 0.715428 10.1586 0.841421L5.64142 5.35858C5.56332 5.43668 5.43668 5.43668 5.35858 5.35858Z" fill="#111111"/></svg>');
				$('.collection-pagi').show();
			}
			else $('.collection-pagi').hide();
			
			$.ajax({
				url : "/search?q="+str_url+"&view=filter",
				success: function(data){
					$('.filter-total  .filter-btn-close').click();
					$(".ajax-filter").html('');
					$(".ajax-filter").html(data);
					$(".ajax-filter").removeClass('warning');
					$('.filter-single .jsTitle.showing').click();
					setTimeout(function(){
						$('.collection-layout').removeClass('js-loading');
						$('.btn-filter--apply').removeClass('active');
						$('.filter-total .btn-filter--unselect').addClass('active');
						GVN.Collection.makeUrl();
					},2000);
				}
			});
		}
		else{
			$('.collection-pagi').hide();
			$('.filter-total  .filter-btn-close').click();
			$(".ajax-filter").html('<div class="collection-empty"><p>ChÆ°a cÃ³ sáº£n pháº©m nÃ o trong danh má»¥c nÃ y</p></div>');
			$('.collection-layout').removeClass('js-loading');
			$('.btn-filter--apply').removeClass('active');
			$('.filter-total .btn-filter--unselect').addClass('active');
			GVN.Collection.makeUrl();
		}
	},
	loadMore: function(){
		$(document).on('click','#load_more',function(){
			if(str == ''){
				if(firstCollection.current_page < firstCollection.total_page){
					firstCollection.current_page += 1;
					var sort = $('.sortBy li.active input').val();
					$.get(firstCollection.url+'?view=backup&page='+firstCollection.current_page+(sort != 'manual'?'&sort_by='+sort:'')).done(function(data){
						$('.listProduct-row').append(data);
						firstCollection.html = $('.listProduct-row').html();
						GVN.Global.supportCheckGiftPE(true);
						if(firstCollection.current_page == firstCollection.total_page){
							$('.collection-pagi').hide();
						}
						else{
							$('.collection-pagi button').html('Xem thÃªm <span>'+(firstCollection.total_product - firstCollection.current_page * firstCollection.perPage)+'</span> sáº£n pháº©m <svg xmlns="http://www.w3.org/2000/svg" width="11" height="6" viewBox="0 0 11 6" fill="none"><path d="M5.35858 5.35858L0.841421 0.841421C0.715428 0.715428 0.804661 0.5 0.982842 0.5H10.0172C10.1953 0.5 10.2846 0.715428 10.1586 0.841421L5.64142 5.35858C5.56332 5.43668 5.43668 5.43668 5.35858 5.35858Z" fill="#111111"/></svg>');
						}
					});
				}
			}
			else{
				if(GVN.Collection.pagiFilter.current_page < GVN.Collection.pagiFilter.total_page){
					GVN.Collection.pagiFilter.current_page += 1;
					$('.collection-layout').addClass('js-loading');
					$.ajax({
						url : "/search?q="+str+"&view=filter&page="+GVN.Collection.pagiFilter.current_page,
						success: function(data){
							$(".ajax-filter").append(data);
							if(GVN.Collection.pagiFilter.current_page == GVN.Collection.pagiFilter.total_page) $('.collection-pagi').hide();
							else {
								var still = GVN.Collection.pagiFilter.total_product - GVN.Collection.pagiFilter.current_page * firstCollection.perPage;
								$('.collection-pagi button').html('Xem thÃªm <span>'+still+'</span> sáº£n pháº©m <svg xmlns="http://www.w3.org/2000/svg" width="11" height="6" viewBox="0 0 11 6" fill="none"><path d="M5.35858 5.35858L0.841421 0.841421C0.715428 0.715428 0.804661 0.5 0.982842 0.5H10.0172C10.1953 0.5 10.2846 0.715428 10.1586 0.841421L5.64142 5.35858C5.56332 5.43668 5.43668 5.43668 5.35858 5.35858Z" fill="#111111"/></svg>');
							}
							GVN.Global.supportCheckGiftPE(true);
							setTimeout(function(){
								$('.collection-layout').removeClass('js-loading');
							},2000);
						}
					});
				}
			}
		});
	},	
	scrollFixedHeader: function(){
		/* pin filter */
		var u = $(".collection-header").innerHeight() + 250;
		var y = $(".main-header").innerHeight();
		if($(window).width() > 1200){
			$(window).scroll(function(){
				if ($(window).scrollTop() >= u && jQuery(window).scrollTop() > 0 ) {
					$('.collection-filter').addClass('fixed-head').css('top',y);
					$('.collection-filter .filter-wrap').addClass('visible-title');
					$('.collection-filter .collection-sortby').addClass('d-none');
					
					$('.filter-single .filter-group--block').removeClass('isShowing').find('.filter-group--title').removeClass('showing');
					$('.filter-single .filter-group--block').find('.filter-group--content').hide();
					
				}
				else if ($(window).scrollTop() < u ) {
					$('.collection-filter').removeClass('fixed-head').css('top',0);
					$('.collection-filter .filter-wrap').removeClass('visible-title');
					$('.collection-filter .collection-sortby').removeClass('d-none');
				}
			});
		}
	},
}
GVN.CollectionPromo = {
	init: function() {
		GVN.AppPE.renderItemDiscount();
		GVN.Helper.pickItem();
	}
}
GVN.Product = {
	init: function(){
		var that = this
		that.buyProduct();
		that.viewMoreContent();
		that.actionProduct();
		that.setViewedProduct();
		that.countdownProduct();
		GVN.Rating.init();
		GVN.AppPE.renderComboNew(currentId);
		GVN.AppPE.renderGift(currentId);
		GVN.AppPE.renderDiscount(currentId);
		GVN.Helper.viewedProduct();
	},
	renderItemAddCart: function(img,title) {
		var htmlLine = '';
		htmlLine +=	'<div class="img">';
		if (img != null){
			htmlLine +=		'<img src="'+img+'" alt="'+title+'">';
		}
		else {
			htmlLine +=		'<img src="//theme.hstatic.net/200000636033/1001033735/14/no-image.jpg" alt="'+title+'">';
		}
		htmlLine +=	'</div>';
		htmlLine +=	'<div class="title">'+title+'</div>';
		$('.main-header--cart .cart-dropdown .line-item-add').html(htmlLine);
	},
	actionProduct: function(){
		// Scroll section
		$(".js-scroll").on('click', function(event) {
			if (this.hash !== "") {
				event.preventDefault();
				var hash = this.hash;
				var y = $(hash).offset().top;
				GVN.Helper.smoothScroll(y-140, 500);
			}
		});
		// 
		window.productCollect.push(window.product);
		GVN.Rating.ratingProduct(1,0,0);
	},
	buyProduct: function(){
		$(document).on('click','#buy-now:not(.loading)',function(e){	
			e.preventDefault();
			var quantity = Number($('#quantity').val()), variantId = $('#product-select').val();
			
			$.ajax({
				type: 'POST',
				url: '/cart/add.js',
				data: 'quantity=' + quantity + '&id=' + variantId,
				dataType: 'json',
				success: function(line_item) {
					var img = line_item.image;
					var title = line_item.title;
					
					GVN.GA4.eventAddtocart();
					
					if($(window).width() > 991){
						GVN.Helper.getCartSidebar();
						GVN.Product.renderItemAddCart(img,title);
						$('.main-header--cart').addClass('show-addcart');
						setTimeout(function(){
							$('.main-header--cart').removeClass('show-addcart');
						},4200);
					}
					else {
						window.location = '/cart';
					}
					
					//$('body, html').addClass('open-overlay open-noscroll open-cart');
					//GVN.Helper.addCartSupport(variantId,quantity,'normal',function(){});
				},
				error: function(XMLHttpRequest, textStatus) {
					GVN.Helper.SwalWarning('ThÃ´ng bÃ¡o','Sá»‘ lÆ°á»£ng báº¡n mua vÆ°á»£t quÃ¡ tá»“n kho','Warning',false,false,3000);
				}
			});
		});
		$(document).on('click','.btn-installment:not(.loading)',function(e){
			//$('#buy-now:not(.loading)').trigger('click');
			e.preventDefault();
			var quantity = Number($('#quantity').val()), variantId = $('#product-select').val();
			$.ajax({
				type: 'POST',
				url: '/cart/add.js',
				data: 'quantity=' + quantity + '&id=' + variantId,
				dataType: 'json',
				success: function(line_item) {
					window.location = '/cart';
				},
				error: function(XMLHttpRequest, textStatus) {
					GVN.Helper.SwalWarning('ThÃ´ng bÃ¡o','Sá»‘ lÆ°á»£ng báº¡n mua vÆ°á»£t quÃ¡ tá»“n kho','Warning',false,false,3000);
				}
			});
		});
	},
	viewMoreContent: function(){
		$('.expandable-btn').click(function(e){
			e.preventDefault();
			$('.expandable-toggle').toggleClass('expanded');
		})
	},
	setViewedProduct: function(){
		if(window.shop.product.data.price > 0){
			var phand = [];
			var ptype = [];

			/* XoÃ¡ data cÅ© báº¯t Ä‘áº§u láº¡i tá»« Ä‘áº§u vá»›i viá»‡c cháº·n add vÃ o ds Ä‘Ã£ xem ngay tá»« Ä‘áº§u */
			if(localStorage.getItem('viewed_new') == null){
				Cookies.remove('last_viewed_products');
				Cookies.remove('last_viewed_products_type');
				localStorage.setItem('viewed_new',1);
			}

			let unShow = ['QuÃ  Táº·ng KhÃ´ng BÃ¡n','Combo áº¨n','DISCON','Táº M Háº¾T HÃ€NG'];

			if(!unShow.includes(window.shop.product.type)){
				if(document.cookie.indexOf('last_viewed_products') !== -1){
					var las = Cookies.getJSON('last_viewed_products');
					var lasType = Cookies.getJSON('last_viewed_products_type');
					if($.inArray(window.shop.product.handle, las) === -1){
						phand = [window.shop.product.handle];
						ptype = [window.shop.product.type];
						for(var i = 0; i < las.length; i++){
							phand.push(las[i]);
							ptype.push(lasType[i]);
							if(phand.length > 15){
								break;
							}
						}
						Cookies.set('last_viewed_products', phand, { expires: 180 });
						Cookies.set('last_viewed_products_type', ptype, { expires: 180 });
					}
				}
				else{
					phand = [window.shop.product.handle];
					ptype = [window.shop.product.type];
					Cookies.set('last_viewed_products', phand, { expires: 180 });
					Cookies.set('last_viewed_products_type', ptype, { expires: 180 });
				}
			}
		}
	},
	countdownProduct: function(){
		if(window.shop_settings.productPageCountdown.showByColl){
			var element = document.getElementById('soon-product');
			$(document).ready(function(){
				var time_start = $('.product-countdown .product-countdown--time').attr('data-start');
				var time_end = $('.product-countdown .product-countdown--time').attr('data-end');
				var beforeRun = new Date(time_start);
				beforeRun = beforeRun.getTime();

				var afterRun = new Date(time_end);
				afterRun = afterRun.getTime();

				var now = new Date();
				now = now.getTime();

				function tick(milliseconds, beforeRun) {
					$('#label-due').html('Báº®T Äáº¦U').removeClass('d-none');
				}
				function tick2(milliseconds, afterRun) {
					if(milliseconds == 0 ){
						$('.product-countdown').hide();
					}
					else{
						$('#label-due').html('Káº¿t thÃºc trong').removeClass('d-none');
					}
				}
				function complete() {
					var today = new Date();
					var cdate = today.getTime();

					if(cdate < afterRun){
						Soon.destroy(element);
						Soon.create(element,{
							due: time_end,
							now: null,
							layout:"group label-small",
							face:"slot",
							format:"d,h,m,s",
							labelsYears:null,
							labelsDays:'NgÃ y',
							labelsHours:'Giá»',
							labelsMinutes:'PhÃºt',
							labelsSeconds: 'GiÃ¢y',
							separateChars:true,
							paddingDays:"00", 
							scaleMax:"s",
							separator:":",
							singular:true,
							eventTick: tick2,
							eventComplete: function(){
								//$('.product-countdown').hide();
							}
						});
					}
				}
				if(now < afterRun){
					Soon.create(element,{
						due: time_start,
						now: null,
						layout:"group label-small",
						face:"slot",
						format:"d,h,m,s",
						labelsYears:null,
						labelsDays:'NgÃ y',
						labelsHours:'Giá»',
						labelsMinutes:'PhÃºt',
						labelsSeconds:'GiÃ¢y',
						separateChars:true,
						scaleMax:"s",
						separator:":",
						singular:true,
						eventTick: tick,
						eventComplete: complete
					});
				}
			});
		}
	},
}
GVN.Rating = {
	formData: new FormData(),
	formImg: new FormData(),
	arrFile: [],
	init: function(){
		var that = this;
		that.defaultRating();
		that.writeReview();
		that.starRating();
		that.actionReviews();
		that.pagiRating();
	},
	defaultRating: function(){
		var url = window.shop_app.defaultRating;
		$.get(url, function(response){
			if(response.data.total > 0){
				var items = response.data.content_ratings;
				var html = '';
				if(items.length > 0){
					items.filter(x => {
						html += '<span class="">';
						html += 	'<span>'+x.content+'</span>';
						html += 	'<img src="https://file.hstatic.net/200000060274/file/close_a8dadb58798949d9b93ff3542bb924cf.png">';
						html += '</span>';
					});
					if(html != ''){
						$('.cr-content .cr-list-default').html(html).removeClass('d-none');
					}
				}
			}
			else {
				$('.cr-content .cr-list-default').addClass('d-none');
			}
		});
	},
	appRating: {
		isRating: {},
		customerId: accountJS.id,
		customerEmail: accountJS.email,
		dataPagi: {},
		listRating: {},
		limit: 3
	},
	currentProduct: function(){
		var currentUrl = location.pathname;
		if(currentUrl.slice(-1).indexOf('/') != -1){
			currentUrl = currentUrl.slice(0,-1);
		}
		var currentPro = window.productCollect.filter(x => x.url == currentUrl);
		return currentPro;
	},
	ratingProduct: function(page,sort,filter){
		var self = this,
				data = self.currentProduct(),
				product = data[0],
				limit = self.appRating.limit;
		var url = '/apps/customer_rating/product_rating?product_id='+window.shop.product.id+'&org_id='+window.shop.shop_id+'&page='+page+'&limit='+limit+'&sort='+sort+'&filter='+filter;		$.ajax({
			url: url,
			success: function(response){
				if(response.data.total == 0){
					//$('.product-reviews--process').hide();
				}
				self.renderRating(page,response);
			}
		});
	},
	renderRating: function(page,response){
		var self = this,
				data = self.currentProduct(),
				product = data[0],
				rating = response;
		if(rating.data.product_ratings.length > 0){
			var ratingStatus = rating.data.product_ratings[0];
			if(ratingStatus.status == 1){
				var totalRate = rating.data.avg.toFixed(1);
				var percentRate = totalRate / 5 * 100;
				
				$('.product-rating .number').html(totalRate);
				$('.product-reviews--star .star-rate.star-fill').css('width', percentRate + '%');
				$('.product-reviews--number span').html(totalRate+'/5');
				$('.product-reviews--total strong').html('('+rating.data.total+')');
				var sumRate = rating.data.total_rate || null;
				if(sumRate != null) {
					var total = 0;
					for(var i = 1; i < 6 ; i++){
						var key = i + '_star';
						var star = rating.data.total_rate[key] || 0;
						total += star;
					}
					for(var i = 1; i < 6; i++){
						var key = i + '_star';
						var star = rating.data.total_rate[key] || 0;
						var percent = (star / total * 100) + '%';
						$('.items-process[data-star="'+i+'"] .isLoad').css('width',percent);
						$('.items-process[data-star="'+i+'"] .isCount').html(star + ' Ä‘Ã¡nh giÃ¡');
					}
				}
				self.renderItems(rating.data,page);
				$('.product-reviews--body').removeClass('d-none');
			}
			else if(ratingStatus.status == 0) {
				$('.product-reviews--status').html('<p class="status-rating-order">ÄÃ¡nh giÃ¡ Ä‘Æ¡n hÃ ng cá»§a báº¡n Ä‘ang Ä‘Æ°á»£c kiá»ƒm duyá»‡t</p>').removeClass('d-none');;			
			}
		}
		else {
			$('.product-rating .number').html('0');
			$('.product-reviews--body').addClass('d-none');
			$('.product-reviews--number span').html('0/5');
			$('.product-reviews--total strong').html('0');
			$('.isLoad').css('width','0px');
		}
	},
	renderItems: function(data,page){
		var self = this;
		var items = '';
		data.product_ratings.filter(x => {
			var name = x.customer.name;
			if(name == ""){
				name = 'xxx' + x.customer.email.split('@')[1];
			}
			var dItems = new Date(x.doc_created_at);
			var dPost = dItems.getDay() + '-' + (dItems.getMonth()+1) + '-' + dItems.getFullYear();
			items += '<div class="items-comment">';
			items += 		'<div class="items-comment-top">';
			items += 			'<div class="items-comment-name">'+name+'</div>';
			items += 			'<div class="items-comment-date">'+dPost+'</div>';
			items += 		'</div>';
			items += 		'<div class="items-comment-bottom">';
			items += 			'<div class="items-comment-left">';
			items += 				'<div class="items-comment-star">';
			for(var i = 1; i < 6; i++){
				var active = '';
				if(i <= x.rate){
					active = 'active';
				}
				items += '<div class="items-star '+active+'" data-star="'+i+'">';
				items += '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.12034 14.3994L4.03419 10.0858L0.835704 7.13018C0.835704 7.13018 0.378768 6.73077 0.531087 6.1716C0.683406 5.61243 1.29263 5.61243 1.29263 5.61243L5.55728 5.21302L7.23268 1.13905C7.23268 1.13905 7.46113 0.5 7.99422 0.5C8.52731 0.5 8.75576 1.13905 8.75576 1.13905L10.4312 5.21302L14.8481 5.61243C14.8481 5.61243 15.305 5.69231 15.4574 6.1716C15.6097 6.65089 15.305 6.97041 15.305 6.97041L11.9543 10.0858L12.8681 14.5592C12.8681 14.5592 13.0204 15.0385 12.6396 15.358C12.2589 15.6775 11.6496 15.358 11.6496 15.358L7.99422 13.0414L4.41496 15.358C4.41496 15.358 3.88189 15.6775 3.42495 15.358C2.96802 15.0385 3.12034 14.3994 3.12034 14.3994Z" stroke="#CFCFCF" stroke-width="0.9375"/></svg>';
				items += '</div>';
			}
			items += 				'</div>';
			items += 			'</div>';
			items += 			'<div class="items-comment-right">';
			if(x.default_content.length > 0){
				items += 			'<div class="items-comment-title">';
				x.default_content.filter(y => {
					items += 			'<div class="items-title">'+y+'</div>';
				});
				items += 			'</div>';
			}
			if(x.content.length > 0){
				items += 				'<div class="items-comment-content">'+ x.content +'</div>';
			}
			if(x.images.length > 0){
				items += 				'<div class="items-comment-image">';
				x.images.filter(y => {
					items += 			'<div class="items-comment-img">';
					items += 				'<a data-fancybox="gallery-2-'+name+'" href="'+y.image_url+'">';
					items += 					'<img src="'+y.image_url+'" alt="'+y._id+'" />';
					items += 				'</a>';
					items += 			'</div>';
				});
				items += 				'</div>';
			}
			
			if(x.resrating.length > 0){
				items += 			'<div class="items-comment-replay">';
				items += 				'<div class="heading-replay d-none">Tráº£ lá»i: </div>';
				x.resrating.filter(y => {
					var dReplay = new Date(y.rescreatedate);
					var dPostReplay = dReplay.getDay() + '-' + (dReplay.getMonth()+1) + '-' + dReplay.getFullYear();
					
					var fName = y.employee_first_name || '';
					var lName = y.employee_last_name || '';
					var name = 'Admin';
					if(lName != '' || fName != '') name = lName + ' ' + fName;
					
					items += 			'<div class="items-replay">';
						items += 			'<div class="items-replay-title"><h4>'+name+'</h4><span>'+dPostReplay+'</span></div>';
						items += 			'<div class="items-replay-content">'+y.rescontent+'</div>';
					items += 			'</div>';
				});
				items += 			'</div>';
			}
			items += 			'</div>';
			items += 		'</div>';
			items += '</div>';
		});
		if(items != ''){
			/*
			//dÃ¹ng cho phÃ¢n trang sá»‘
			if($(window).width() > 991){
				$('.product-reviews--render').html(items);
			}
			else {*/
				$('.product-reviews--render').append(items);
			//}
			if(data.total > 3 && (self.appRating.limit * page) < data.total){
				self.getPagiRating(data.total,page);
			}
			else {
				$('.btn-reviews--more').addClass('d-none');
			}
			$('.product-reviews--body').removeClass('d-none');
		}
		else {
			$('.product-reviews--body').addClass('d-none');
		}
	},
	writeReview: function(){
		var self = this;
		$('.btn-reviews--edit').click(function(){
			if(accountJS.logged){
				var data = self.currentProduct();
				if(data.length > 0){
					var product = data[0];
					var img = product.featured_image;
					$('.cr-product img').attr('src',img);
					$('.cr-name').html(product.title);
					$('#customers-rating-modal').modal();
				}
			}
			else {
				Swal.fire({
					title: 'ThÃ´ng bÃ¡o',
					text: 'Báº¡n cáº§n Ä‘Äƒng nháº­p Ä‘á»ƒ nháº­n xÃ©t & Ä‘Ã¡nh giÃ¡ sáº£n pháº©m!',
					icon: 'warning',
					showCancelButton: true,
					showConfirmButton: true,
					confirmButtonText: 'ÄÄƒng nháº­p',
					cancelButtonText: 'KhÃ´ng Ä‘Ã¡nh giÃ¡'
				}).then((result) => {
					if (result.isConfirmed) {
						GVN.Helper.accountPopup('acc-login-box');
					}
				})
			}
		});
	},
	starRating: function(){
		var self = this;
		$(document).on('click','.cr-app--right form.cr-form > div',function(){
			$(this).parents('.cr-app--right').find('form.cr-form > div').removeClass('active');
			$(this).addClass('active');
		});
		$(document).on('mouseenter', '.cr-levels > li', function() {
			var dataRating = parseInt($(this).attr('data-rating'));
			self.appRating.isRating = dataRating;
			$('.cr-levels > li').removeClass();
			$(".cr-levels > li").each(function(index) {
				var start = $(this);
				var nameClass =  's' + dataRating;
				var rating = parseInt($(this).attr('data-rating'));
				if(rating <= dataRating) start.addClass(nameClass);
			});
			switch(dataRating) {
				case 1:
					$('#customers-rating-modal .rate-show').html('Ráº¥t khÃ´ng hÃ i lÃ²ng');
					break;
				case 2:
					$('#customers-rating-modal .rate_-how').html('KhÃ´ng hÃ i lÃ²ng');
					break;
				case 3:
					$('#customers-rating-modal .rate-show').html('BÃ¬nh thÆ°á»ng');
					break;
				case 4:
					$('#customers-rating-modal .rate-show').html('Tá»‘t');
					break;
				case 5:
					$('#customers-rating-modal .rate-show').html('Xuáº¥t sáº¯c');
					break;
			}
		});
		$(document).on('mouseleave', '.cr-levels > li', function() {
			if($('input[name="rate-level"]:checked').length == 0) {
				$(".cr-levels > li").removeClass();
				$('#customers-rating-modal .rate-show').html('Click vÃ o Ä‘á»ƒ review!');
				$('.cr-rating .rate-success').addClass('d-none');
				$('.cr-rating .rate-error').removeClass('d-none');
			}
			else {
				$('.cr-rating .rate-success').removeClass('d-none');
				$('.cr-rating .rate-error').addClass('d-none');
				if(self.appRating.isRating != $('input[name="rate-level"]:checked').val()) {
					var dataRating = $('input[name="rate-level"]:checked').val();
					$('.cr-levels > li').removeClass();
					$(".cr-levels > li").each(function(index) {
						var start = $(this);
						var nameClass =  's' + dataRating;
						var rating = parseInt($(this).attr('data-rating'));
						if(rating <= dataRating) start.addClass(nameClass);
					});
					switch(parseInt(dataRating)) {
						case 1:
							$('#customers-rating-modal .rate-show').html('Ráº¥t khÃ´ng hÃ i lÃ²ng');
							break;
						case 2:
							$('#customers-rating-modal .rate-show').html('KhÃ´ng hÃ i lÃ²ng');
							break;
						case 3:
							$('#customers-rating-modal .rate-show').html('BÃ¬nh thÆ°á»ng');
							break;
						case 4:
							$('#customers-rating-modal .rate-show').html('Tá»‘t');
							break;
						case 5:
							$('#customers-rating-modal .rate-show').html('Xuáº¥t sáº¯c');
							break;
					}
				}
			}
		});
	},
	
	actionReviews: function(){
		var self = this;
		$(document).on('click','.cr-list-default > span', function(){
			$(this).toggleClass('active');
		});
		var files = $('#theFiles');
		var typeFile = ['jpg','png','jpeg'];
		var arrDelete =[];
		var err = $('.err-img');
		var form = $('#customers-rating-modal');
		function renderPreview(isDelete){				
			var itemImg = files[0].files;
			var prevImg = $('#preview_img > figure').length;
			
			var arrFileTemp = [];
			for(let i = 0; i < itemImg.length; i++) { arrFileTemp.push(itemImg[i]); }
			
			if(arrFileTemp.length == 5){
				self.arrFile = arrFileTemp;
				self.formImg.delete("uploadFiles");
			}
			
			if(isDelete == true){
				self.arrFile.splice(arrDelete[0],1);
				itemImg = self.arrFile;
			}
			
			var total_image = arrDelete.length > 0 ? arrFile.length : arrFile.length + prevImg ;
			if(total_image <= 5){
				if($('#preview_img > figure').length == 5 || isDelete)  $('.preview-img').html('');
				for(var i = 0; i <itemImg.length; i++){
					if(!arrDelete.includes(i.toString())){
						if(!itemImg[i]) return ;
						if(itemImg.length > 5) {
							err.html("Chá»‰ Ä‘Æ°á»£c gá»­i tá»‘i Ä‘a 5 hÃ¬nh áº£nh").removeClass('d-none');
							return;
						} 
						else {
							err.html('').addClass('d-none');
						}

						if(!itemImg[i].name.endsWith('.jpg') && !itemImg[i].name.endsWith('.png') && !itemImg[i].name.endsWith('.jpeg')) {
							err.html("Äá»‹nh dáº¡ng khÃ´ng Ä‘Æ°á»£c há»— trá»£").removeClass('d-none');
							return;
						} 
						else {
							err.html('').addClass('d-none');
						}

						if(itemImg[i].size/ (1024 * 1024) > 15) {
							err.html('Chá»‰ Ä‘Æ°á»£c upload áº£nh < 15MB').removeClass('d-none');
							return
						} 
						else {
							err.html('').addClass('d-none');
						}

						let reader = new FileReader;
						let figure = document.createElement('figure');
						let figIcon = document.createElement('i')
						figIcon.setAttribute('class','remove-preview')	
						figIcon.setAttribute('data-index',i)
						figure.appendChild(figIcon);
						reader.onload =()=>{
							let img = document.createElement('img')
							img.setAttribute('src',reader.result);
							figure.insertBefore(img,figIcon);
						}
						self.formImg.append("uploadFiles",itemImg[i],itemImg[i].name)
						$('.preview-img')[0].appendChild(figure);
						reader.readAsDataURL(itemImg[i])
					}
				}
				arrDelete = [];
				//files.val('');
			}
			else{
				err.html("Chá»‰ Ä‘Æ°á»£c gá»­i tá»‘i Ä‘a 5 hÃ¬nh áº£nh");
				return;
			}

			console.log(arrDelete);
			console.log(arrFile);
		}

		$(document).on('click','.remove-preview',function(){
			var	index = Number($(this).attr('data-index'));
			arrDelete.push(index);

			var itemImg = files[0].files; //itemImg lÃ  kiá»ƒu dá»¯ liá»‡u FileList ko pháº£i array
			var arrFile = []; //arrFile lÃ  máº£ng chá»©a tá»«ng file Image
			for(let i = 0; i < itemImg.length; i++) {
				arrFile.push(itemImg[i]);
			}
			arrFile.splice(index,1);

			console.log('itemImg New:',arrFile);

			self.formImg.delete("uploadFiles");
			for(var i = 0; i < arrFile.length; i++){
				self.formImg.append("uploadFiles",arrFile[i],arrFile[i].name);
			}

			$(this).parents('figure').remove();
			
			//renderPreview(true);
		})
		$(document).on('change','#theFiles',function(){
			arrDelete=[];
			arrFile = [];
			
			var $this = $(this);
			var time = new Date().getTime();
			var fileName = this.files[0].name;
			var fileImg = this.value;
			var fileNameExt = fileName.substr(fileName.lastIndexOf('.') + 1);
			if (this.files[0].size > 1000000) {
				GVN.Helper.SwalWarning("ThÃ´ng bÃ¡o","Dung lÆ°á»£ng tá»‘i Ä‘a 1MB",'error',false,false,3000);
			}
			else if ($.inArray(fileNameExt, typeFile) == -1){
				GVN.Helper.SwalWarning("ThÃ´ng bÃ¡o!","Chá»‰ há»— trá»£ tá»‡p táº£i lÃªn .jpg, .jpeg, .png",'error',false,false,3000);
			}
			else if (fileName.indexOf(' ') != -1){
				GVN.Helper.SwalWarning("ThÃ´ng bÃ¡o!",'TÃªn hÃ¬nh viáº¿t liá»n, khÃ´ng dáº¥u','error',false,false,3000);
			}
			else {
				renderPreview();
			}	
		})
		$(document).on('click','#customers-rating-modal .cr-submit',function(e){
			e.preventDefault();
			if($(this).closest('.cr-form')[0].checkValidity() == true && form.find('.cr-levels li[class*="s"]').length > 0){
				$('.cr-submit').attr("disabled", true);
				$('.cr-submit').addClass("disabled");
				
				var currentPro = self.currentProduct();
				currentPro = currentPro.length == 0 ? window.product : currentPro[0];
				form.find('.rate-error').addClass('d-none');
				var rate = Number(form.find('.cr-levels li[class*="s"]').attr('class').replace('s',''));
				self.formImg.append("customer_id", self.appRating.customerId);
				var dataPost = {
					"rate": rate,
					"title": form.find('.cr-title input[name="cr-title"]').val().trim() || '',
					"content": form.find('.cr-content textarea[name="cr-content"]').val().trim() || '',
					"customer_id": self.appRating.customerId,
					"default_content": "",
					"customer_email": self.appRating.customerEmail,
					"variant_id": $('#product-select').val(),
					"product_id": currentPro.id,
					"org_id": window.shop.shop_id
				};
				var list_default = form.find('.cr-list-default > span.active');
				if(list_default.length > 0) {
					var data_default = [];
					list_default.each(function( index ) {
						var d = $(this).find('span');
						data_default.push(d.html());
					});
					dataPost['default_content']= data_default;
				}
				grecaptcha.ready(function() {
					grecaptcha.execute('6LdD18MUAAAAAHqKl3Avv8W-tREL6LangePxQLM-', {action: 'submit'}).then(function(token) {
						$.ajax({  
							url: window.shop_app.urlFile + '?recaptcha_token=' + token,
							type: 'POST',
							"timeout": 0,
							data:  self.formImg,
							processData: false,
							mimeType: "multipart/form-data",
							contentType: false, 
							success: function(response){
								response = JSON.parse(response);
								if(response.error == true) {
									GVN.Helper.SwalWarning("ThÃ´ng bÃ¡o",response.message,'error',false,false,3000);
								}
								else {
									var img = [];
									$.each(response.data, function( index, value ) {img.push(value.url)});
									dataPost['image_url'] = img;
									$.ajax({
										url: window.shop_app.postRating,
										type: 'POST',
										headers: {
											'content-type': 'application/json'
										},
										data: JSON.stringify(dataPost),
										dataType: 'JSON',
										success: function(res){
											$('#customers-rating-modal').modal('hide');
											GVN.Helper.SwalWarning("ThÃ´ng bÃ¡o","QuÃ½ khÃ¡ch Ä‘Ã£ Ä‘Ã¡nh giÃ¡ sáº£n pháº©m thÃ nh cÃ´ng",'success',false,false,5000);
											self.formData = new FormData();
											self.appRating.dataPagi = {};
											self.ratingProduct(1);
											self.clearFormRating(form);
										},
										error: function(){
											self.formData = new FormData();
											GVN.Helper.SwalWarning("ThÃ´ng bÃ¡o","ÄÃ£ cÃ³ lá»—i xáº£y ra",'error',false,false,2000);
											$('.cr-submit').attr("disabled", false);
											$('.cr-submit').removeClass("disabled");
										}
									});
								}	
							},
							error: function(){	
								GVN.Helper.SwalWarning("ThÃ´ng bÃ¡o","KhÃ´ng thá»ƒ láº¥y thÃ´ng tin recaptcha, vui lÃ²ng táº£i láº¡i trang",'error',false,false,1000);
							}
						});
					})
				})										
			}
			else{
				$('.cr-submit').attr("disabled", false);
				$('.cr-submit').removeClass("disabled");
				if(!form.find('.cr-rating').hasClass('active')) form.find('.cr-rating .rate-error').removeClass('d-none');
			}
		});
	},
	/*
	actionReviews: function(){
		var self = this;
		$(document).on('click','.cr-list-default > span', function(){
			$(this).toggleClass('active');
		});
		var files = $('#theFiles');
		var arrDelete =[];
		var arrFile = [];
		var err = $('.err-img');
		var formData = new FormData();
		var formImg = new FormData();
		var form = $('#customers-rating-modal');
		function renderPreview(isDelete){				
			var itemImg = files[0].files;
			for(let i = 0; i < itemImg.length; i++) {arrFile.push(itemImg[i]);}
			if(isDelete == true) itemImg = arrFile;
			formImg.delete('uploadFiles');
			$('.preview-img').html('')
			for(var i = 0; i <itemImg.length; i++){
				if(!arrDelete.includes(i.toString())){
					if(!itemImg[i]) return ;
					if(itemImg.length > 5) {
						err.html("Chá»‰ Ä‘Æ°á»£c gá»­i tá»‘i Ä‘a 5 hÃ¬nh áº£nh").removeClass('d-none');
						return;
					} 
					else {
						err.html('').addClass('d-none');
					}
					if(!itemImg[i].name.endsWith('.jpg') && !itemImg[i].name.endsWith('.png') && !itemImg[i].name.endsWith('.jpeg')) {
						err.html("Äá»‹nh dáº¡ng khÃ´ng Ä‘Æ°á»£c há»— trá»£").removeClass('d-none');
						return;
					} 
					else {
						err.html('').addClass('d-none');
					}
					if(itemImg[i].size/ (1024 * 1024) > 15) {
						err.html('Chá»‰ Ä‘Æ°á»£c upload áº£nh < 15MB').removeClass('d-none');
						return
					} 
					else {
						err.html('').addClass('d-none');
					}
					let reader = new FileReader;
					let figure = document.createElement('figure');
					let figIcon = document.createElement('i')
					figIcon.setAttribute('class','remove-preview')	
					figIcon.setAttribute('data-index',i)
					figure.appendChild(figIcon);
					reader.onload =()=>{
						let img = document.createElement('img')
						img.setAttribute('src',reader.result);
						figure.insertBefore(img,figIcon);
					}
					formImg.append("uploadFiles",itemImg[i],itemImg[i].name)
					$('.preview-img')[0].appendChild(figure);
					reader.readAsDataURL(itemImg[i])
				}
			}
			files.val('');
			
			console.log(arrDelete);
			console.log(arrFile);
		}
		
		$(document).on('click','.remove-preview',function(){
			var	index = $(this).attr('data-index');
			arrDelete.push(index)
			renderPreview(true)
		})
		$(document).on('change','#theFiles',function(){
			arrDelete=[];
			arrFile = [];
			renderPreview();
		})
		$(document).on('click','#customers-rating-modal .cr-submit',function(e){
			e.preventDefault();
			if($(this).closest('.cr-form')[0].checkValidity() == true && form.find('.cr-levels li[class*="s"]').length > 0){
				var currentPro = self.currentProduct();
				form.find('.rate-error').addClass('d-none');
				var rate = Number(form.find('.cr-levels li[class*="s"]').attr('class').replace('s',''));
				formImg.append("customer_id", self.appRating.customerId);
				var dataPost = {
					"rate": rate,
					"title": form.find('.cr-title input[name="cr-title"]').val().trim() || '',
					"content": form.find('.cr-content textarea[name="cr-content"]').val().trim() || '',
					"customer_id": self.appRating.customerId,
					"default_content": "",
					"customer_email": self.appRating.customerEmail,
					"variant_id": $('#product-select').val(),
					"product_id": currentPro[0].id,
					"org_id": window.shop.shop_id
				};
				var list_default = form.find('.cr-list-default > span.active');
				if(list_default.length > 0) {
					var data_default = [];
					list_default.each(function( index ) {
						var d = $(this).find('span');
						data_default.push(d.html());
					});
					dataPost['default_content']= data_default;
				}
				grecaptcha.ready(function() {
					grecaptcha.execute('6LdD18MUAAAAAHqKl3Avv8W-tREL6LangePxQLM-', {action: 'submit'}).then(function(token) {
						$.ajax({  
							url: window.shop_app.urlFile + '?recaptcha_token=' + token,
							type: 'POST',
							"timeout": 0,
							data:  formImg,
							processData: false,
							mimeType: "multipart/form-data",
							contentType: false, 
							success: function(response){
								response = JSON.parse(response);
								if(response.error == true) {
									GVN.Helper.SwalWarning("ThÃ´ng bÃ¡o",response.message,'Warning',false,false,3000);
								}
								else {
									var img = [];
									$.each(response.data, function( index, value ) {img.push(value.url)});
									dataPost['image_url'] = img;
									$.ajax({
										url: window.shop_app.postRating,
										type: 'POST',
										headers: {
											'content-type': 'application/json'
										},
										data: JSON.stringify(dataPost),
										dataType: 'JSON',
										success: function(res){
											$('#customers-rating-modal').modal('hide');
											GVN.Helper.SwalWarning("ThÃ´ng bÃ¡o","QuÃ½ khÃ¡ch Ä‘Ã£ Ä‘Ã¡nh giÃ¡ sáº£n pháº©m thÃ nh cÃ´ng",'success',false,false,5000);
											formData = new FormData();
											self.appRating.dataPagi = {};
											self.ratingProduct(1);
											self.clearFormRating(form);
										},
										error: function(){
											formData = new FormData();
											GVN.Helper.SwalWarning("ThÃ´ng bÃ¡o","ÄÃ£ cÃ³ lá»—i xáº£y ra",'error',false,false,2000);
										}
									});
								}	
							},
							error: function(){	
								GVN.Helper.SwalWarning("ThÃ´ng bÃ¡o","KhÃ´ng thá»ƒ láº¥y thÃ´ng tin recaptcha, vui lÃ²ng táº£i láº¡i trang",'error',false,false,1000);
							}
						});
					})
				})										
			}
			else{
				if(!form.find('.cr-rating').hasClass('active')) form.find('.cr-rating .rate-error').removeClass('d-none');
			}
		});
	},
	*/
	clearFormRating: function(form){
		var self = this;
		form.find('input').val('');
		form.find('textarea').val('');
		form.find('.rate-success').addClass('d-none');
		form.find('.rate-error').addClass('d-none');
		form.find('.cr-list-default span').removeClass('active');
		form.find('.cr-list-default span img').addClass('d-none');
		form.find('.preview-img').html('');
		form.find('.cr-levels li').removeClass();
		form.find('input[name="rate-level"]').prop('checked',false);
		self.appRating.isRating = 0;
		form.find('.rate-show').html('Click vÃ o Ä‘á»ƒ review!');
		form.find('.cr-submit').attr("disabled", false);
		form.find('.cr-submit').removeClass("disabled");

	},
	getPagiRating: function(total,page){
		var self = this;
		var totalPage = Math.ceil(total/self.appRating.limit);
		var html = '<div class="paginate-wrapper"><div id="paginate-customers-rating" class="justify-content-end">';
		/*
		//dÃ¹ng cho phÃ¢n trang sá»‘
		page = parseInt(page);
		var renderTruncate = false;
		var range = totalPage - page;
		var truncate = totalPage - 1 > 3 && range > 3 ? true : false;
		if(page != 1) html += '<div data-total="'+total+'" data-page="'+(page-1)+'" class="item-pagi">'+'<'+'</div>';
		if(page > 4 && page > totalPage - 4){
			var delta = parseInt(totalPage - page);
			for (var i = parseInt(page - 4 + delta); i <= totalPage; i++){
				html += '<div data-total="'+total+'" data-page="'+i+'" class="item-pagi '+(i == page?'active':'')+'">'+i+'</div>';
			}
		}
		else if(page > 3){
			if(truncate){
				for(var i = parseInt(page-2);i <= totalPage; i++) {
					if(i < page + 2){
						html += '<div data-total="'+total+'" data-page="'+i+'" class="item-pagi '+(i == page?'active':'')+'">'+i+'</div>';
					}
					else {
						if(!renderTruncate){
							html += '<div class="item-pagi">...</div>';
							renderTruncate = true;
						}
					}
					if(i == totalPage)  html += '<div data-total="'+total+'" data-page="'+i+'" class="item-pagi">'+i+'</div>';
				}
			} else {
				for(var i = parseInt(page-1);i <= totalPage; i++) {
					html += '<div data-total="'+total+'" data-page="'+i+'" class="item-pagi '+(i == page?'active':'')+'">'+i+'</div>';
				}
			}
		}
		else {
			if(truncate){
				for(var i = 1; i<= totalPage; i++){
					if(i <= 4 ){
						html += '<div data-total="'+total+'" data-page="'+i+'" class="item-pagi '+(i == page?'active':'')+'">'+i+'</div>';
					}
					else { 
						if(!renderTruncate){
							html += '<div class="page-node">...</div>';
							renderTruncate = true;
						}
					}
					if(i == totalPage)  html += '<div data-total="'+total+'" data-page="'+i+'" class="item-pagi">'+i+'</div>';
				}
			} 
			else {
				for(var i = 1;i <= totalPage; i++) {
					html += '<div data-total="'+total+'" data-page="'+i+'" class="item-pagi '+(i == page?'active':'')+'">'+i+'</div>';
				}
			}
		}
		if(page != totalPage) html += '<div data-total="'+total+'" data-page="'+(page+1)+'" class="item-pagi">'+'>'+'</div>';
		html += '</div></div>';
		if($(window).width() > 991){
			$('.product-reviews--pagi').html(html);
		}
		else {*/
			$('.product-reviews--btn').find('.btn-reviews--more').attr('data-page', page+1).attr('data-total', total).html('Xem thÃªm <strong class="d-none">'+(total - 3)+'</strong> Ä‘Ã¡nh giÃ¡').removeClass('d-none');
		//}
	},
	pagiRating: function(){
		var self = this;
		$(document).on('click', '.item-pagi', function(){
			var page = $(this).attr('data-page');
			self.ratingProduct(page,0,0);
			var y = $("#customers-rating").offset().top;
			GVN.Helper.smoothScroll(y-140, 200);
			
		});
		$(document).on('click', '.btn-reviews--more', function(){
			var page = $(this).attr('data-page');
			self.ratingProduct(page,0,0);
		});
	},
	checkRatingLoop: function(aIdSearch){
		var ids = [];
		$('.proloop-block:not(.has-rating)').each(function(){
			var id = $(this).attr('data-id');
			ids.push(id);
		});
		ids = Haravan.uniq(ids).sort();

		var url = 'https://customer-rating-apps.haravan.com/api/buyer/product_rating/list?product_ids='+(aIdSearch != undefined? aIdSearch.join(',') : ids.join(',') )+'&org_id='+window.shop.shop_id+'&page=1&limit=20&sort=0&filter=0';		
		$.ajax({
			url: url,
			success: function(response){
				if(response.data.length > 0){
					response.data.map(info => {
						var prd_id = info.pr_id;
						$('.proloop-block[data-id="'+prd_id+'"]').addClass('has-rating');
						$('.proloop-block[data-id="'+prd_id+'"] .number').html(parseFloat(info.statistics.overall.avg).toFixed(1));
						$('.proloop-block[data-id="'+prd_id+'"] .count').html('('+info.statistics.overall.qty+' Ä‘Ã¡nh giÃ¡)');
						//$('.proloop-block[data-id="'+prd_id+'"] .proloop-rating').removeClass('d-none');
					});
				}
			}
		});
	},

}
GVN.Cart = {
	stores: {},
	contentCheckout: '',
	attributes: null,
	checkout: null,
	data_shipping_rate: {},
	isInputCoupon: false,
	dataGiftPE: {},
	dataDiscountPE: {},
	init: function(){
		var that = this;
		that.invoince.init();
		that.cartRender.init();
		that.changeTab();
		that.jumpStep();
		that.getAPI1();
		that.changeProvince();
		that.changeDisitrict();
		that.changeWard();
		that.changePaymentAndShipping();
		that.changeInstallment();
		that.submitCheckout();
		that.couponActions();
		that.pickeAtStore();
		that.processInstallment();
		
		var html_header = $('header').clone();
		html_header.find('.count-holder .count').html('0');
		that.contentCheckout += html_header.wrap("<div />").parent().html();
		that.contentCheckout += $('.sub-header').clone().wrap("<div />").parent().html();
		that.contentCheckout += '<div id="main-checkout"></div>';
		that.contentCheckout += $('footer').clone().wrap("<div />").parent().html();
		that.contentCheckout += $('#toolbar-menu-mobile').clone().wrap("<div />").parent().html();
		that.contentCheckout += $('.sidebar-menu-mb').clone().wrap("<div />").parent().html();
		that.contentCheckout += $('.sidebar-search-mb').clone().wrap("<div />").parent().html();
		that.contentCheckout += $('.site-overlay').clone().wrap("<div />").parent().html();
		localStorage.setItem('contentCheckout',that.contentCheckout);	
	},
	cartRender: {
		init: function(){
			var that = this;
			that.cartOrder();
			that.comboNewFunction();
		},
		renderLineItem: function (resultItem,type,line) {
			//console.log('resultItem:',resultItem);
			var itemOjProperties = {}
			var htmlLine = '';

			htmlLine +=	'<div class="item line-item line-item-container" data-line="'+(line+1)+'" data-variant-id="'+resultItem.variant_id+'" data-pro-id="'+resultItem.product_id+'">';
			htmlLine +=		'<div class="left">';
			htmlLine +=			'<div class="item-img">';
			htmlLine +=				'<a href="'+resultItem.url+'">';
			if ( resultItem.image == null ) {
				htmlLine +=					'<img src="//theme.hstatic.net/200000636033/1001033735/14/no-image.jpg" alt="'+resultItem.title+'" />';
			}
			else {
				htmlLine +=					'<img src="'+resultItem.image+'" alt="'+resultItem.title+'" />';
			}
			htmlLine +=				'</a>';
			htmlLine +=			'</div>';
			if (!(type == 'comboApp')) {
				if (resultItem.price > 0){
					htmlLine +=	'<div class="item-remove">';
					htmlLine +=		'<div class="remove">';
					htmlLine +=			'<a href="/cart/change?line='+(line+1)+'&amp;quantity=0" class="cart">';
					htmlLine +=				'<svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.58036 11.75H10.1696C10.317 11.75 10.4643 11.6328 10.4643 11.4688V6.40625C10.4643 6.26563 10.317 6.125 10.1696 6.125H9.58036C9.40848 6.125 9.28571 6.26563 9.28571 6.40625V11.4688C9.28571 11.6328 9.40848 11.75 9.58036 11.75ZM13.6071 3.875H11.5692L10.7344 2.5625C10.5379 2.23438 10.1451 2 9.72768 2H7.24777C6.83036 2 6.4375 2.23438 6.24107 2.5625L5.40625 3.875H3.39286C3.17188 3.875 3 4.0625 3 4.25V4.625C3 4.83594 3.17188 5 3.39286 5H3.78571V12.875C3.78571 13.5078 4.30134 14 4.96429 14H12.0357C12.6741 14 13.2143 13.5078 13.2143 12.875V5H13.6071C13.8036 5 14 4.83594 14 4.625V4.25C14 4.0625 13.8036 3.875 13.6071 3.875ZM7.19866 3.19531C7.22321 3.17188 7.27232 3.125 7.32143 3.125C7.32143 3.125 7.32143 3.125 7.34598 3.125H9.65402C9.70313 3.125 9.75223 3.17188 9.77679 3.19531L10.1942 3.875H6.78125L7.19866 3.19531ZM12.0357 12.875H4.96429V5H12.0357V12.875ZM6.83036 11.75H7.41964C7.56696 11.75 7.71429 11.6328 7.71429 11.4688V6.40625C7.71429 6.26563 7.56696 6.125 7.41964 6.125H6.83036C6.65848 6.125 6.53571 6.26563 6.53571 6.40625V11.4688C6.53571 11.6328 6.65848 11.75 6.83036 11.75Z" fill="#6D6E72"/></svg>XoÃ¡';
					htmlLine +=			'</a>';
					htmlLine +=		'</div>';
					htmlLine +=	'</div>';	
				}
			}
			htmlLine +=		'</div>';

			htmlLine +=		'<div class="right">';
			htmlLine +=			'<div class="item-info">';
			htmlLine +=				'<a href="'+resultItem.url+'">';
			htmlLine +=					'<h3>'+resultItem.title+'</h3>';
			if(resultItem.variant_options[0] != 'Default Title') {
				htmlLine +=					'<div class="item-desc"><span class="variant_title">'+resultItem.variant_options.join(' / ')+'</span></div>';
			}
			htmlLine +=				'</a>';
			
			if (!$.isEmptyObject(GVN.Cart.dataDiscountPE)) {
				$.each(GVN.Cart.dataDiscountPE, function(keyDiscountPE,htmlDiscountPE){
					if(resultItem.properties.hasOwnProperty('PE-buy-discount-item-buy ' + keyDiscountPE) && resultItem.properties.hasOwnProperty('PE-buy-discount-item ' + keyDiscountPE)) {
						htmlLine += htmlDiscountPE;
					}
				})
			}
			if (!$.isEmptyObject(GVN.Cart.dataGiftPE)) {
				$.each(GVN.Cart.dataGiftPE, function(keyGiftPE,htmlGiftFE){
					if(resultItem.properties.hasOwnProperty('PE-gift-item-buy ' + keyGiftPE)) {
						htmlLine += htmlGiftFE;
					}
				})
			}
			
			htmlLine +=			'</div>';
			
			htmlLine +=			'<div class="item-meta">';
			
			var checkTagPrice = resultItem.inAdmin.tags.filter(tag => tag.indexOf('price:') > -1);
			if(checkTagPrice.length > 0){
				resultItem.price_original = checkTagPrice[0].split(':')[1] * 100;
			}
			
			if (type == 'comboApp' ){
				if (resultItem.price > 0){
					if(resultItem.price_original > resultItem.price) {
						htmlLine +=			'<div class="item-price">';
						htmlLine +=				'<span>'+ GVN.Helper.moneyFormat(resultItem.price/100,'â‚«')+'</span>';
						htmlLine +=				'<del>'+ GVN.Helper.moneyFormat(resultItem.price_original/100,'â‚«')+'</del>';
						htmlLine +=			'</div>';
					}
					else {
						htmlLine +=			'<div class="item-price"><span>'+ GVN.Helper.moneyFormat(resultItem.price/100,'â‚«')+'</span></div>';
					}
				}
				else {
					htmlLine +=			'<div class="item-price"></div>';
				}

				htmlLine +=			'<div class="item-quan">';
				htmlLine +=				'<span class="txt_qty d-none">'+resultItem.quantity+'</span>';
				htmlLine +=				'<span>'+resultItem.quantity+'</span>';
				htmlLine +=				'<input data-vid="'+resultItem.variant_id+'" data-quantity="'+resultItem.quantity+'" data-product="'+resultItem.product_id+'" type="text" size="4" name="updates[]" min="1" id="updates_'+resultItem.variant_id+'" data-price="'+resultItem.price+'" value="'+resultItem.quantity+'" class="tc line-item-qty item-quantity d-none">';
				htmlLine +=			'</div>';

				if (resultItem.price > 0){
					htmlLine +=			'<div class="item-total-price d-none">';
					htmlLine +=				'<div class="price">';
					htmlLine +=					'<span class="text">ThÃ nh tiá»n:</span>';
					htmlLine +=					'<span class="line-item-total">'+GVN.Helper.moneyFormat(resultItem.line_price/100,'â‚«')+'</span>';
					htmlLine +=				'</div>';
					htmlLine +=			'</div>';
				}
				else {
					htmlLine +=			'<div class="item-total-price d-none"><div class="price"><span class="line-item-total">QuÃ  táº·ng</span></div></div>';															
				}

			}
			else {
				if (resultItem.price > 0){
					if(resultItem.price_original > resultItem.price) {
						htmlLine +=			'<div class="item-price">';
						htmlLine +=				'<span>'+ GVN.Helper.moneyFormat(resultItem.price/100,'â‚«')+'</span>';
						htmlLine +=				'<del>'+GVN.Helper.moneyFormat(resultItem.price_original/100,'â‚«')+'</del>';
						htmlLine +=			'</div>';
					}
					else {
						var checkVr = proInCartJS[resultItem.product_id].variants[resultItem.variant_id];
						if (checkVr != undefined){
							htmlLine +=			'<div class="item-price">';
							htmlLine +=				'<span>'+GVN.Helper.moneyFormat(resultItem.price/100,'â‚«')+'</span>';
							if (checkVr.compare_price > resultItem.price) {
								htmlLine +=			'<del>'+GVN.Helper.moneyFormat(checkVr.compare_price/100,'â‚«')+'</del>';
							}
							htmlLine +=			'</div>';
						}
					}

					htmlLine +=			'<div class="item-quan">';
					htmlLine +=				'<span class="txt_qty d-none">'+resultItem.quantity+'</span>';
					htmlLine +=				'<div class="qty quantity-partent qty-click">';

					if(resultItem.quantity > 1){
						htmlLine +=					'<button type="button" class="qtyminus qty-btn">';
						htmlLine += 					'<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.3332 8H7.99984H2.6665" stroke="#111111" stroke-width="2" stroke-linecap="round"/></svg>';
						htmlLine +=					'</button>';
					}
					else {
						htmlLine +=					'<button type="button" class="qtyminus qty-btn disabled" disabled>';
						htmlLine += 					'<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.3332 8H7.99984H2.6665" stroke="#cfcfcf" stroke-width="2" stroke-linecap="round"/></svg>';
						htmlLine +=					'</button>';
					}
					htmlLine +=					'<input readonly data-vid="'+resultItem.variant_id+'" data-quantity="'+resultItem.quantity+'" data-product="'+resultItem.product_id+'" type="text" size="4" name="updates[]" min="1" id="updates_'+resultItem.variant_id+'" data-price="'+resultItem.price+'" value="'+resultItem.quantity+'" class="tc line-item-qty item-quantity">';
					htmlLine +=					'<button type="button" class="qtyplus qty-btn"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.00033 13.3334V8.00008M8.00033 8.00008V2.66675M8.00033 8.00008H13.3337M8.00033 8.00008H2.66699" stroke="#111111" stroke-width="2" stroke-linecap="round"/></svg></button>';
					htmlLine +=				'</div>';
					htmlLine +=			'</div>';

					htmlLine +=			'<div class="item-total-price d-none">';
					htmlLine +=				'<div class="price">';
					htmlLine +=					'<span class="text">ThÃ nh tiá»n:</span>';
					htmlLine +=					'<span class="line-item-total">'+GVN.Helper.moneyFormat(resultItem.line_price/100,'â‚«')+'</span>';
					htmlLine +=				'</div>';
					htmlLine +=			'</div>';

				}
				else {
					htmlLine +=			'<div class="item-price"></div>';
					htmlLine +=			'<div class="item-quan"></div>';
					htmlLine +=			'<div class="item-total-price d-none"><div class="price"><span class="line-item-total">QuÃ  táº·ng</span></div></div>';															
				}
			}

			htmlLine +=		'</div>';
			htmlLine +=	'</div>';
			htmlLine +=	'</div>';

			return htmlLine;
		},
		renderLineItemGiftPE: function (resultItem,line) {
			var itemOjProperties = {}
			var htmlLine = '';
			htmlLine +=	'<div class="line-gift" data-line="'+(line+1)+'" data-variant-id="'+resultItem.variant_id+'" data-pro-id="'+resultItem.product_id+'">';
			htmlLine +=			'<div class="gift-info">Táº·ng: ';
			htmlLine +=				' <a href="'+resultItem.url+'">'+resultItem.title+'</a>';
			htmlLine +=				'<span> Trá»‹ giÃ¡: ';
			
			
    		var checkVr = proInCartJS[resultItem.product_id].variants[resultItem.variant_id];
			if (checkVr != undefined){
				if (checkVr.compare_price > resultItem.price) {
					htmlLine +=			GVN.Helper.moneyFormat(checkVr.compare_price/100,'â‚«');
				}
                else {
                    htmlLine +=			GVN.Helper.moneyFormat(resultItem.price_original/100,'â‚«')
                }
			}
				
			htmlLine += 			'</span>';
			htmlLine +=			'</div>';
			htmlLine +=	'</div>';
			return htmlLine;
		},
		renderLineItemDiscountPE: function (resultItem,line) {
			var itemOjProperties = {}
			var htmlLine = '';
			htmlLine +=	'<div class="line-discount d-none" data-line="'+(line+1)+'" data-variant-id="'+resultItem.variant_id+'" data-pro-id="'+resultItem.product_id+'">';
			htmlLine +=			'<div class="discount-info">';
			htmlLine +=				'<span></span>';
			htmlLine +=			'</div>';
			htmlLine +=	'</div>';
			return htmlLine;
		},
		checkItemCart: function (cart) {
			var itemOjProperties = {}
			var countPromo = 0;
			var typePromo = '';

			var Combos = []; //mÃ£ combo
			var titleCombos = []; //tÃªn combo
			var lineCombo = [];

			var Gift = []; //mÃ£ gift
			var titleGift = []; //tÃªn program gift
			var lineGift = [];
			
			var Discount = []; //mÃ£ discount
			var titleDiscount = []; //tÃªn program Discount
			var lineDiscount = [];

			var checkItemGiftOmni = false;
			var checkItemCombo = false;
			var checkItemGift = false;
			var checkItemDiscount = false;

			for(var i = 0; i < cart.items.length; i++) {
				var item = cart.items[i];
				itemOjProperties = item.properties;
				for (const property in itemOjProperties){
					if (property.indexOf('PE-combo-item') > -1){
						checkItemCombo = true;
						// PE-combo-item: "ma-combo | tÃªn combo"
						var temp1 = itemOjProperties[property].split('|')[0].trim();
						var titleTemp1 = itemOjProperties[property].split('|')[1].trim();
						if(Combos.includes(temp1)) {
							var indexExist = Combos.indexOf(temp1);
							lineCombo[indexExist].push(i);
							continue;
						}
						else {
							Combos.push(temp1);
							titleCombos.push(titleTemp1);
							var temp11 = [];
							temp11.push(i);
							lineCombo.push(temp11);
						}
					}
					else if(property.indexOf('PE-gift-item ') > -1) {
						checkItemGift = true;
						//PE-gift-item-buy magift: "tÃªn sáº£n pháº©m"
						//PE-gift-item magift: "tÃªn sáº£n pháº©m"
						var temp3 = itemOjProperties[property];
						var titleTemp3 = temp3;
						var codeTemp3 = property.split(' ')[1].trim();
						if(Gift.includes(codeTemp3)) {
							var indexExist = Gift.indexOf(codeTemp3);
							lineGift[indexExist].push(i);
							continue;
						}
						else {
							Gift.push(codeTemp3);
							titleGift.push(titleTemp3);
							var temp33 = [];
							temp33.push(i);
							lineGift.push(temp33);
						}
					}
					else if(property.indexOf('PE-buy-discount-item ') > -1) {
						checkItemDiscount = true;
						var temp4 = itemOjProperties[property].split('|')[1].trim();
						var titleTemp4 = itemOjProperties[property].split('|')[0].trim();
						var codeTemp4 = property.split(' ')[1].trim();
						if(Discount.includes(codeTemp4)) {
							var indexExist = Discount.indexOf(codeTemp4);
							lineDiscount[indexExist].push(i);
							continue;
						}
						else {
							Discount.push(codeTemp4);
							titleDiscount.push(titleTemp4);
							var temp44 = [];
							temp44.push(i);
							lineDiscount.push(temp44);
						}
					}
					else if(property.indexOf('Khuyáº¿n mÃ£i') > -1) {
						checkItemGiftOmni = true;
					}		
				}
			}

			/*console.log('titleGift:',titleGift);
			console.log('Combos:',Combos);
			console.log('Gift:',Gift);
			console.log('TitleDiscount:',titleDiscount);
			console.log('Discount:',Discount);*/
			
			// QuÃ  táº·ng Khuyáº¿n mÃ£i
			if(Gift.length > 0) {
				for(var i = 0; i < Gift.length; i++) {
					var gf = Gift[i];
					var itemInGift = cart.items.filter((x,index) => !x.properties.hasOwnProperty('PE-combo-item') && x.properties.hasOwnProperty('PE-gift-item ' + gf) && x.properties['PE-gift-item ' + gf].indexOf(titleGift[i]) > -1);
					if (itemInGift.length > 0) {
						var htmlGiftApp = '<div class="gifts-list"><h4>QuÃ  táº·ng khuyáº¿n mÃ£i</h4>';
						for(var j = 0; j < itemInGift.length; j++) {
							countPromo = countPromo + itemInGift[j].quantity;
							htmlGiftApp += GVN.Cart.cartRender.renderLineItemGiftPE(itemInGift[j],lineGift[i][j]);
						}
						htmlGiftApp += '</div>';
						GVN.Cart.dataGiftPE[gf] = htmlGiftApp;
					}
				}
			}
			/*console.log('countPromo:',countPromo);*/
			
			// Discount
			if(Discount.length > 0) {
				for(var i = 0; i < Discount.length; i++) {
					var dc = Discount[i];
					var itemInDiscount = cart.items.filter((x,index) => !x.properties.hasOwnProperty('PE-combo-item') && x.properties.hasOwnProperty('PE-buy-discount-item ' + dc) && x.properties['PE-buy-discount-item-buy ' + dc].indexOf(titleDiscount[i]) > -1);
					if (itemInDiscount.length > 0) {
						var htmlDiscountApp = '<div class="discounts-list">';
						for(var j = 0; j < itemInDiscount.length; j++) {
							countPromo = countPromo + itemInDiscount[j].quantity;
							//htmlDiscountApp += GVN.Cart.cartRender.renderLineItemDiscountPE(itemInDiscount[j],lineDiscount[i][j]);
							htmlDiscountApp +=	'<div class="line-discount">';
							htmlDiscountApp +=		'<span>'+titleDiscount[i]+'</span>';
							htmlDiscountApp +=	'</div>';
						}
						htmlDiscountApp += '</div>';
						GVN.Cart.dataDiscountPE[dc] = htmlDiscountApp;
					}
				}
			}
			
			//Combo
			if(Combos.length > 0) {
				for(var i = 0; i < Combos.length; i++) {
					var cmb = Combos[i];
					var htmlCombo = '<div class="cart-group combo">';
							htmlCombo +=  '<h4>Æ¯u Ä‘Ã£i:' + titleCombos[i] + '</h4>';
					    htmlCombo += 	'<div class="quantity-combo d-flex align-items-center">';
					    htmlCombo += 		'<div class="label-quantity-combo"> <span>Sá»‘ lÆ°á»£ng: x '+ cart.attributes['PE-combo-detail '+Combos[i]]+'</span></div>'
					    htmlCombo += 		'<div class="update-quantity d-flex align-items-center">';
					    htmlCombo +=				'<button type="button" class="qtyminus-new qty-btn-new">-</button>';
					    htmlCombo +=	    	'<input type="text" value="'+ cart.attributes['PE-combo-detail '+Combos[i]]+'" class="update-combo-item" data-item="" data-combo="'+Combos[i].replace('~','')+'" data-max="" data-quantity="'+ cart.attributes['PE-combo-detail '+Combos[i]]+'" />';
					    htmlCombo +=				'<button type="button" class="qtyplus-new qty-btn-new">+</button>';
					    htmlCombo +=   	'</div>';
					    htmlCombo += 		'<div class="remove-combo" data-combo="'+Combos[i]+'">XÃ³a</div>';
					    htmlCombo +=  '</div>';
					
					var itemInCombo = cart.items.filter((x,index) => x.properties.hasOwnProperty('PE-combo-item') && x.properties['PE-combo-item'].indexOf(cmb) > -1);
					if (itemInCombo.length > 0) {
						for(var j = 0; j < itemInCombo.length; j++) {
							countPromo = countPromo + itemInCombo[j].quantity;
							htmlCombo += GVN.Cart.cartRender.renderLineItem(itemInCombo[j],'comboApp',lineCombo[i][j]);
						}
					}
					htmlCombo += '</div>';
					$('.cart-order .table-cart').append(htmlCombo);
				}
			}
			/*console.log('countPromo:',countPromo);*/
			
			var promoGroup     = lineCombo.join(',').split(',');
			var promoGift      = lineGift.join(',').split(',');
			var promoDiscount  = lineDiscount.join(',').split(',');
			var promoSingle    = lineGift.join(',').split(',');
			
			if(cart.item_count > countPromo) {
				var htmlHead = '';
				var parent = null;
				if (countPromo >= 0) {
					htmlHead += '<div class="cart-group single"></div>';
					$('.cart-order .table-cart').append(htmlHead);
				} 
				else {
					parent = $('.cart-order .table-cart');
				}
				for(var i = 0; i < cart.items.length; i++) {
					if (!promoGroup.includes(i+"") && !promoGift.includes(i+"") ) {
						var item = cart.items[i];
						var htmlNormal =	GVN.Cart.cartRender.renderLineItem(item,'',i,);
						$('.cart-order .table-cart .cart-group.single').append(htmlNormal);
					}
				}
			}
		},
		cartOrder: function() {
			var cart = window.cartJS;
			if(window.cartJS.items.length > 0){
				var html = $('#cloned-item--2').html();
				$('#cart-page .cart-order').html(html);
				$('#cart-page .cart-order').removeClass('cart-order-loading');
				$('#cart-page').removeClass('js-loading');
				$('#cart-page .cart-order .title-number-cart span').text(cart.item_count + ' sáº£n pháº©m');
				
				$('.cart-order .table-cart').append(GVN.Cart.cartRender.checkItemCart(cart));

				// progress freeship
				if (window.shop_settings.freeship_promo.show) {
					var hanmuc_freeship = window.shop_settings.freeship_promo.hanmuc;
					var htmlProgress = '';
					if(cart.total_price == 0) {
						htmlProgress += '<div class="progress-box">';
						htmlProgress += 	'<div class="progress-line">';
						htmlProgress += 		'<div class="progress progress-moved" data-text="'+ window.shop_settings.freeship_promo.texthanmuc +'" data-percent="0%"><div class="progress-bar" style="width: 0%;"></div></div>'; 
						htmlProgress += 		'<div class="progress-icon">';
						htmlProgress += 			'<svg viewBox="0 0 93 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 17C5 17.5304 5.21071 18.0391 5.58579 18.4142C5.96086 18.7893 6.46957 19 7 19C7.53043 19 8.03914 18.7893 8.41421 18.4142C8.78929 18.0391 9 17.5304 9 17C9 16.4696 8.78929 15.9609 8.41421 15.5858C8.03914 15.2107 7.53043 15 7 15C6.46957 15 5.96086 15.2107 5.58579 15.5858C5.21071 15.9609 5 16.4696 5 17ZM15 17C15 17.5304 15.2107 18.0391 15.5858 18.4142C15.9609 18.7893 16.4696 19 17 19C17.5304 19 18.0391 18.7893 18.4142 18.4142C18.7893 18.0391 19 17.5304 19 17C19 16.4696 18.7893 15.9609 18.4142 15.5858C18.0391 15.2107 17.5304 15 17 15C16.4696 15 15.9609 15.2107 15.5858 15.5858C15.2107 15.9609 15 16.4696 15 17Z" stroke="url(#paint0_linear_5586_8136)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5 17H3V13M2 5H13V17M9 17H15M19 17H21V11M21 11H13M21 11L18 6H13M3 9H7" stroke="url(#paint1_linear_5586_8136)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M28.8203 17H30.8848V13.1172H34.8975V11.4834H30.8848V8.83789H35.2803V7.13574H28.8203V17ZM36.5039 17H38.5684V13.4248H40.2227L42.0615 17H44.3994L42.3213 13.1172C43.415 12.6865 44.1055 11.6064 44.1055 10.3076V10.2939C44.1055 8.31152 42.793 7.13574 40.5781 7.13574H36.5039V17ZM38.5684 11.8594V8.74902H40.3252C41.3438 8.74902 41.9932 9.35059 41.9932 10.2939V10.3076C41.9932 11.2783 41.3779 11.8594 40.3525 11.8594H38.5684ZM45.4727 17H52.0078V15.2979H47.5371V12.8164H51.7549V11.2031H47.5371V8.83789H52.0078V7.13574H45.4727V17ZM53.498 17H60.0332V15.2979H55.5625V12.8164H59.7803V11.2031H55.5625V8.83789H60.0332V7.13574H53.498V17ZM65.126 17.1709C67.6143 17.1709 69.1045 15.9678 69.1045 14.0742V14.0674C69.1045 12.5156 68.1748 11.6748 66.1104 11.2646L65.0645 11.0527C63.9297 10.8271 63.4238 10.4648 63.4238 9.84277V9.83594C63.4238 9.13184 64.0596 8.64648 65.1191 8.63965C66.1377 8.63965 66.8486 9.11133 66.9512 9.88379L66.958 9.96582H68.9062L68.8994 9.83594C68.8037 8.10645 67.4023 6.96484 65.1191 6.96484C62.9316 6.96484 61.3594 8.1543 61.3594 9.95898V9.96582C61.3594 11.4492 62.3438 12.3789 64.292 12.7686L65.3311 12.9736C66.5547 13.2266 67.04 13.5615 67.04 14.2314V14.2383C67.04 14.9902 66.3223 15.4893 65.1807 15.4893C64.0527 15.4893 63.2393 15.0107 63.1094 14.2451L63.0957 14.1699H61.1475L61.1543 14.2793C61.2705 16.0977 62.7812 17.1709 65.126 17.1709ZM70.3691 17H72.4336V12.8438H76.877V17H78.9414V7.13574H76.877V11.1416H72.4336V7.13574H70.3691V17ZM80.582 17H82.6465V7.13574H80.582V17ZM84.2871 17H86.3516V13.8896H88.252C90.3301 13.8896 91.7178 12.5498 91.7178 10.5195V10.5059C91.7178 8.47559 90.3301 7.13574 88.252 7.13574H84.2871V17ZM87.7461 8.76953C88.9287 8.76953 89.626 9.3916 89.626 10.5127V10.5264C89.626 11.6475 88.9287 12.2764 87.7461 12.2764H86.3516V8.76953H87.7461Z" fill="url(#paint2_linear_5586_8136)"></path><defs><linearGradient id="paint0_linear_5586_8136" x1="12" y1="15" x2="12" y2="19" gradientUnits="userSpaceOnUse"><stop stop-color="#FF6B00"></stop><stop offset="1" stop-color="#FF2E00"></stop></linearGradient><linearGradient id="paint1_linear_5586_8136" x1="11.5" y1="5" x2="11.5" y2="17" gradientUnits="userSpaceOnUse"><stop stop-color="#FF6B00"></stop><stop offset="1" stop-color="#FF2E00"></stop></linearGradient><linearGradient id="paint2_linear_5586_8136" x1="60.5" y1="3" x2="60.5" y2="21" gradientUnits="userSpaceOnUse"><stop stop-color="#FF6B00"></stop><stop offset="1" stop-color="#FF2E00"></stop></linearGradient></defs></svg>';
						htmlProgress += 		'</div>';
						htmlProgress += 	'</div>';
						htmlProgress += 	'<div class="progress-title">	<span>Äá»ƒ nháº­n Freeship <span class="progress-price">Mua thÃªm ' + GVN.Helper.moneyFormat(hanmuc_freeship, 'â‚«') + '</span></span></div>';
						htmlProgress += '</div>';
						$('#cart-page #cart-buy-order-box .section-progress').append(htmlProgress);
						//$('#cart-page #cart-buy-order-box .section-progress').after('<hr>'); bá» táº¡m
					} 
					else {
						if(cart.total_price/100 > hanmuc_freeship) {
							var price_freeship = cart.total_price/100 - hanmuc_freeship;
							htmlProgress += '<div class="progress-box freeship">';
							htmlProgress += 	'<div class="progress-line">';
							htmlProgress += 		'<div class="progress progress-moved" data-text="4 triá»‡u" data-percent="100%"><div class="progress-bar" style="width: 100%;"></div></div>';
							htmlProgress += 		'<div class="progress-icon">';
							htmlProgress += 			'<svg viewBox="0 0 93 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 17C5 17.5304 5.21071 18.0391 5.58579 18.4142C5.96086 18.7893 6.46957 19 7 19C7.53043 19 8.03914 18.7893 8.41421 18.4142C8.78929 18.0391 9 17.5304 9 17C9 16.4696 8.78929 15.9609 8.41421 15.5858C8.03914 15.2107 7.53043 15 7 15C6.46957 15 5.96086 15.2107 5.58579 15.5858C5.21071 15.9609 5 16.4696 5 17ZM15 17C15 17.5304 15.2107 18.0391 15.5858 18.4142C15.9609 18.7893 16.4696 19 17 19C17.5304 19 18.0391 18.7893 18.4142 18.4142C18.7893 18.0391 19 17.5304 19 17C19 16.4696 18.7893 15.9609 18.4142 15.5858C18.0391 15.2107 17.5304 15 17 15C16.4696 15 15.9609 15.2107 15.5858 15.5858C15.2107 15.9609 15 16.4696 15 17Z" stroke="url(#paint0_linear_5586_8136)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5 17H3V13M2 5H13V17M9 17H15M19 17H21V11M21 11H13M21 11L18 6H13M3 9H7" stroke="url(#paint1_linear_5586_8136)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M28.8203 17H30.8848V13.1172H34.8975V11.4834H30.8848V8.83789H35.2803V7.13574H28.8203V17ZM36.5039 17H38.5684V13.4248H40.2227L42.0615 17H44.3994L42.3213 13.1172C43.415 12.6865 44.1055 11.6064 44.1055 10.3076V10.2939C44.1055 8.31152 42.793 7.13574 40.5781 7.13574H36.5039V17ZM38.5684 11.8594V8.74902H40.3252C41.3438 8.74902 41.9932 9.35059 41.9932 10.2939V10.3076C41.9932 11.2783 41.3779 11.8594 40.3525 11.8594H38.5684ZM45.4727 17H52.0078V15.2979H47.5371V12.8164H51.7549V11.2031H47.5371V8.83789H52.0078V7.13574H45.4727V17ZM53.498 17H60.0332V15.2979H55.5625V12.8164H59.7803V11.2031H55.5625V8.83789H60.0332V7.13574H53.498V17ZM65.126 17.1709C67.6143 17.1709 69.1045 15.9678 69.1045 14.0742V14.0674C69.1045 12.5156 68.1748 11.6748 66.1104 11.2646L65.0645 11.0527C63.9297 10.8271 63.4238 10.4648 63.4238 9.84277V9.83594C63.4238 9.13184 64.0596 8.64648 65.1191 8.63965C66.1377 8.63965 66.8486 9.11133 66.9512 9.88379L66.958 9.96582H68.9062L68.8994 9.83594C68.8037 8.10645 67.4023 6.96484 65.1191 6.96484C62.9316 6.96484 61.3594 8.1543 61.3594 9.95898V9.96582C61.3594 11.4492 62.3438 12.3789 64.292 12.7686L65.3311 12.9736C66.5547 13.2266 67.04 13.5615 67.04 14.2314V14.2383C67.04 14.9902 66.3223 15.4893 65.1807 15.4893C64.0527 15.4893 63.2393 15.0107 63.1094 14.2451L63.0957 14.1699H61.1475L61.1543 14.2793C61.2705 16.0977 62.7812 17.1709 65.126 17.1709ZM70.3691 17H72.4336V12.8438H76.877V17H78.9414V7.13574H76.877V11.1416H72.4336V7.13574H70.3691V17ZM80.582 17H82.6465V7.13574H80.582V17ZM84.2871 17H86.3516V13.8896H88.252C90.3301 13.8896 91.7178 12.5498 91.7178 10.5195V10.5059C91.7178 8.47559 90.3301 7.13574 88.252 7.13574H84.2871V17ZM87.7461 8.76953C88.9287 8.76953 89.626 9.3916 89.626 10.5127V10.5264C89.626 11.6475 88.9287 12.2764 87.7461 12.2764H86.3516V8.76953H87.7461Z" fill="url(#paint2_linear_5586_8136)"></path><defs><linearGradient id="paint0_linear_5586_8136" x1="12" y1="15" x2="12" y2="19" gradientUnits="userSpaceOnUse"><stop stop-color="#FF6B00"></stop><stop offset="1" stop-color="#FF2E00"></stop></linearGradient><linearGradient id="paint1_linear_5586_8136" x1="11.5" y1="5" x2="11.5" y2="17" gradientUnits="userSpaceOnUse"><stop stop-color="#FF6B00"></stop><stop offset="1" stop-color="#FF2E00"></stop></linearGradient><linearGradient id="paint2_linear_5586_8136" x1="60.5" y1="3" x2="60.5" y2="21" gradientUnits="userSpaceOnUse"><stop stop-color="#FF6B00"></stop><stop offset="1" stop-color="#FF2E00"></stop></linearGradient></defs></svg>';
							htmlProgress += 		'</div>';
							htmlProgress += 	'</div>';
							htmlProgress += 	'<div class="progress-title freeship ' + cart.total_price + '">';
							htmlProgress += 		'<span>ÄÆ¡n hÃ ng cá»§a báº¡n Ä‘Ã£ Ä‘Æ°á»£c miá»…n phÃ­ váº­n chuyá»ƒn</span>';
							htmlProgress += 	'</div>';
							htmlProgress += '</div>';
						}
						else {
							var price_freeship = hanmuc_freeship - cart.total_price/100;
							var price_freeship_percent = ((cart.total_price/100) / hanmuc_freeship)*100;
							htmlProgress += '<div class="progress-box">';
							htmlProgress += 	'<div class="progress-line">';
							htmlProgress += 		'<div class="progress progress-moved" data-text="'+ window.shop_settings.freeship_promo.texthanmuc +'" data-percent="' + Math.ceil(price_freeship_percent) + '%"><div class="progress-bar" style="width: ' + Math.ceil(price_freeship_percent) + '%;"></div></div>'; 
							htmlProgress += 		'<div class="progress-icon">';
							htmlProgress += 			'<svg viewBox="0 0 93 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 17C5 17.5304 5.21071 18.0391 5.58579 18.4142C5.96086 18.7893 6.46957 19 7 19C7.53043 19 8.03914 18.7893 8.41421 18.4142C8.78929 18.0391 9 17.5304 9 17C9 16.4696 8.78929 15.9609 8.41421 15.5858C8.03914 15.2107 7.53043 15 7 15C6.46957 15 5.96086 15.2107 5.58579 15.5858C5.21071 15.9609 5 16.4696 5 17ZM15 17C15 17.5304 15.2107 18.0391 15.5858 18.4142C15.9609 18.7893 16.4696 19 17 19C17.5304 19 18.0391 18.7893 18.4142 18.4142C18.7893 18.0391 19 17.5304 19 17C19 16.4696 18.7893 15.9609 18.4142 15.5858C18.0391 15.2107 17.5304 15 17 15C16.4696 15 15.9609 15.2107 15.5858 15.5858C15.2107 15.9609 15 16.4696 15 17Z" stroke="url(#paint0_linear_5586_8136)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5 17H3V13M2 5H13V17M9 17H15M19 17H21V11M21 11H13M21 11L18 6H13M3 9H7" stroke="url(#paint1_linear_5586_8136)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M28.8203 17H30.8848V13.1172H34.8975V11.4834H30.8848V8.83789H35.2803V7.13574H28.8203V17ZM36.5039 17H38.5684V13.4248H40.2227L42.0615 17H44.3994L42.3213 13.1172C43.415 12.6865 44.1055 11.6064 44.1055 10.3076V10.2939C44.1055 8.31152 42.793 7.13574 40.5781 7.13574H36.5039V17ZM38.5684 11.8594V8.74902H40.3252C41.3438 8.74902 41.9932 9.35059 41.9932 10.2939V10.3076C41.9932 11.2783 41.3779 11.8594 40.3525 11.8594H38.5684ZM45.4727 17H52.0078V15.2979H47.5371V12.8164H51.7549V11.2031H47.5371V8.83789H52.0078V7.13574H45.4727V17ZM53.498 17H60.0332V15.2979H55.5625V12.8164H59.7803V11.2031H55.5625V8.83789H60.0332V7.13574H53.498V17ZM65.126 17.1709C67.6143 17.1709 69.1045 15.9678 69.1045 14.0742V14.0674C69.1045 12.5156 68.1748 11.6748 66.1104 11.2646L65.0645 11.0527C63.9297 10.8271 63.4238 10.4648 63.4238 9.84277V9.83594C63.4238 9.13184 64.0596 8.64648 65.1191 8.63965C66.1377 8.63965 66.8486 9.11133 66.9512 9.88379L66.958 9.96582H68.9062L68.8994 9.83594C68.8037 8.10645 67.4023 6.96484 65.1191 6.96484C62.9316 6.96484 61.3594 8.1543 61.3594 9.95898V9.96582C61.3594 11.4492 62.3438 12.3789 64.292 12.7686L65.3311 12.9736C66.5547 13.2266 67.04 13.5615 67.04 14.2314V14.2383C67.04 14.9902 66.3223 15.4893 65.1807 15.4893C64.0527 15.4893 63.2393 15.0107 63.1094 14.2451L63.0957 14.1699H61.1475L61.1543 14.2793C61.2705 16.0977 62.7812 17.1709 65.126 17.1709ZM70.3691 17H72.4336V12.8438H76.877V17H78.9414V7.13574H76.877V11.1416H72.4336V7.13574H70.3691V17ZM80.582 17H82.6465V7.13574H80.582V17ZM84.2871 17H86.3516V13.8896H88.252C90.3301 13.8896 91.7178 12.5498 91.7178 10.5195V10.5059C91.7178 8.47559 90.3301 7.13574 88.252 7.13574H84.2871V17ZM87.7461 8.76953C88.9287 8.76953 89.626 9.3916 89.626 10.5127V10.5264C89.626 11.6475 88.9287 12.2764 87.7461 12.2764H86.3516V8.76953H87.7461Z" fill="url(#paint2_linear_5586_8136)"></path><defs><linearGradient id="paint0_linear_5586_8136" x1="12" y1="15" x2="12" y2="19" gradientUnits="userSpaceOnUse"><stop stop-color="#FF6B00"></stop><stop offset="1" stop-color="#FF2E00"></stop></linearGradient><linearGradient id="paint1_linear_5586_8136" x1="11.5" y1="5" x2="11.5" y2="17" gradientUnits="userSpaceOnUse"><stop stop-color="#FF6B00"></stop><stop offset="1" stop-color="#FF2E00"></stop></linearGradient><linearGradient id="paint2_linear_5586_8136" x1="60.5" y1="3" x2="60.5" y2="21" gradientUnits="userSpaceOnUse"><stop stop-color="#FF6B00"></stop><stop offset="1" stop-color="#FF2E00"></stop></linearGradient></defs></svg>';
							htmlProgress += 		'</div>';
							htmlProgress += 	'</div>';
							htmlProgress += 	'<div class="progress-title ' + cart.total_price + '"><span>Äá»ƒ nháº­n Freeship <span class="progress-price">Mua thÃªm ' + GVN.Helper.moneyFormat(price_freeship, 'â‚«') + '</span></span></div>';
							htmlProgress += '</div>';		
						}
						$('#cart-page #cart-buy-order-box .section-progress').html('');
						$('#cart-page #cart-buy-order-box .section-progress').append(htmlProgress);
						//$('#cart-page #cart-buy-order-box .section-progress').after('<hr>'); bá» táº¡m
					}
					//$('#cart-page #cart-buy-order-box .section-progress').removeClass('d-none');
				}

				$('#cart-page .checkout-notes .form-control').text(cart.note);
				
			}
			else {
				var html = $('#cloned-item--1').html();
				$('#cart-page .cart-order').html(html);
				$('#cart-page .cart-order').removeClass('cart-order-loading');
				$('#cart-page').removeClass('js-loading');
			}
		},
		UpdateChangeQty: function(comboCode,newQty,beforeQty,line) {
			var arrayUpdate = [];
			var comboItem = false;
			var listCart = document.querySelectorAll('[id^="updates_"]');
			var note = $('#note').val();
			if(window.cartJS.items[line].properties.hasOwnProperty('PE-combo-item')){
				comboItem = true;
				$.each(window.cartJS.items,function(i,v){
					if(v.properties.hasOwnProperty('PE-combo-item') && v.properties['PE-combo-item'].indexOf(comboCode) > -1){
						if(line == i){
							arrayUpdate.push(newQty);
						}
						else{
							arrayUpdate.push(v.quantity / beforeQty * newQty);
						}
					}
					else{
						arrayUpdate.push(v.quantity);
					}
				});		
			}
			else{
				$.each(window.cartJS.items,function(i,v){
					if(i == line){
						arrayUpdate.push(newQty);
					}
					else{
						arrayUpdate.push(v.quantity);
					}
				});
			}

			arrayUpdate = 'updates[]='+arrayUpdate.join('&updates[]=')+'&note='+note;
			var params = {
				type: 'POST',
				url: '/cart/update.js',
				data: arrayUpdate,
				dataType: 'json',
				success: function(data) { 
					window.cartJS = data;
					window.location.reload();
				},
				error: function(XMLHttpRequest, textStatus) {
					Haravan.onError(XMLHttpRequest, textStatus);
				}
			};
			jQuery.ajax(params);
		},
		comboNewFunction: function(){
			//SP Láº»
			$(document).on('click','.qty-click .qtyplus',function(e){
				e.preventDefault();
				var input = $(this).parent('.quantity-partent').find('input');
				var currentVal = parseInt(input.val());
				if (!isNaN(currentVal)) {
					input.val(currentVal + 1);
				} else {
					input.val(1);
				}
			});
			$(document).on('click',".qty-click .qtyminus",function(e) {
				e.preventDefault();
				var input = $(this).parent('.quantity-partent').find('input');
				var currentVal = parseInt(input.val());
				if (!isNaN(currentVal) && currentVal > 1) {
					input.val(currentVal - 1);
				} else {
					input.val(1);
				}
			});
			$(document).on('click','.qty-click button[class*="qty"]',GVN.Helper.delayTime(function(e){
				var beforeQty = parseInt($(this).parents('.item-quan').find('.txt_qty').html()),
						qtyChange = parseInt($(this).siblings('input').val());
				var line = parseInt($(this).parents('.line-item').attr('data-line')) - 1;
				$('.cart-page').addClass('js-loading');
				
				GVN.Cart.cartRender.UpdateChangeQty(null,qtyChange,beforeQty,line);
			},500));
			//SP Combo
			$(document).on('click','.qtyplus-new',function(e){
				e.preventDefault();
				$('.cart-page').addClass('js-loading');
				var input = $(this).parent('.update-quantity').find('input');
				var currentVal = parseInt(input.val());
				if (!isNaN(currentVal)) {
					var qtyChange = currentVal + 1;
					input.val(qtyChange)
				} 
				else {
					var qtyChange = 1;
					input.val(qtyChange);
				}
				input.trigger('change');
			});
			$(document).on('click','.qtyminus-new',function(e) {
				e.preventDefault();
				$('.cart-page').addClass('js-loading');
				var input = $(this).parent('.update-quantity').find('input');
				var currentVal = parseInt(input.val());
				if (!isNaN(currentVal) && currentVal > 1) {
					var qtyChange = currentVal - 1;
					input.val(qtyChange);
				} 
				else {
					var qtyChange = 1;
					input.val(1);
				}
				input.trigger('change');
			});
			$(document).on('change','.update-combo-item',function(e) {
				e.preventDefault();
				var current_quantity = parseInt($(this).val());
				var data_combo = $(this).attr('data-combo');
				var id = window.shop_app.productKeyCombo;
				var properties = {};
				var code = {};
				code[data_combo] = current_quantity;
				properties['PE-combo-set'] = JSON.stringify(code);
				var data_add = {id:id, quantity: 1};
				if(!$.isEmptyObject(properties)){
					data_add['properties'] = properties;
				}
				var param = {
					url: '/cart/add.js',
					type: 'POST',
					data: data_add,
					dataType: 'JSON',
					async: false,
					success: function(data){
						var note = $('#note').val();
						$.ajax({
							type: 'POST',
							url: '/cart/update.js',
							async: false,
							data: {note: note},
							success: function(data){
								window.location.reload();
							}
						});
					},
					error: function(x,y){
						if(x.status == 200 && x.responseText == ""){
							location.reload();
						}
						else{
							alert(JSON.parse(x.responseText).description);
							$('body').removeClass('loading');
						}
					}
				}
				$.ajax(param);
			});
			$(document).on('click','.remove-combo',function(e) {
				e.preventDefault();
				$('.cart-page').addClass('js-loading');
				var current_quantity = 0;
				var data_combo = $(this).attr('data-combo');
				var id = window.shop_app.productKeyCombo;
				var properties = {};
				var code = {};
				code[data_combo] = current_quantity;
				properties['PE-combo-set'] = JSON.stringify(code);
				var data_add = {id:id,quantity:1};
				if(!$.isEmptyObject(properties)){
					data_add['properties'] = properties;
				}
				var param = {
					url: '/cart/add.js',
					type: 'POST',
					data: data_add,
					dataType: 'JSON',
					async: false,
					success: function(data){
						var note = $('#note').val();
						$.ajax({
							type: 'POST',
							url: '/cart/update.js',
							async: false,
							data: {note: note},
							success: function(data){
								window.location.reload();
							}
						});
					},
					error: function(x,y){
						if(x.status == 200 && x.responseText == ""){
							location.reload();
						}
					}
				}
				$.ajax(param);
			});	
		},  
	},
	invoince: {
		init: function(){
			var that = this;
			that.action();
			that.renderInvoice();  
			//that.addInvoice();
		}, 
		action: function(){
			$('#checkbox-bill').change(function(){
				$('.bill-field').slideToggle();
				var $this = $(this);
				if(!$this.is(':checked')){
					$('.invoice-box .form__input-wrapper').removeClass('error');
					var form = $('.bill-field'),
							invoice = form.find('input[name="attributes[order_vat_invoice]"]').val(),
							company = form.find('input[name="attributes[bill_order_company]"]').val(),
							email = form.find('input[name="attributes[bill_email]"]').val(),
							tax = form.find('input[name="attributes[bill_order_tax_code]"]').val(),
							address = form.find('input[name="attributes[bill_order_address]"]').val();
					var attributes = cartJS.attributes || {};
					if((attributes['bill_order_company'] != undefined && attributes['bill_email'] != undefined &&
							attributes['bill_order_tax_code'] != undefined && attributes['bill_order_address'] != undefined) ||
						  (company != '' || email != '' || tax != '' || address != '')){
						Swal.fire({
							title: 'ThÃ´ng bÃ¡o',
							text: 'ThÃ´ng tin hÃ³a Ä‘Æ¡n sáº½ bá»‹ xÃ³a Ä‘i!',
							icon: 'warning',
							showCancelButton: true,
							showConfirmButton: true,
							confirmButtonText: 'Äá»“ng Ã½',
							cancelButtonText: 'Váº«n xuáº¥t hoÃ¡ Ä‘Æ¡n'
						}).then((result) => {
							if (result.isConfirmed) {
								$('.bill-field input').val('');
								$('.bill-field input').removeClass('is-filled');
								var attributes = cartJS.attributes || {};
								attributes['order_vat_invoice'] = 'KhÃ´ng';
								attributes['bill_order_company'] = '';
								attributes['bill_email'] = '';
								attributes['bill_order_tax_code'] = '';
								attributes['bill_order_address'] = '';
								$.ajax({
									type: 'post',
									url: '/cart/update.js', 
									async: false,
									data: {attributes: attributes, note: (typeof $('.cart-note').val() !== 'undefined' && $('.cart-note').val().length > 0) ? $('.cart-note').val() : null}, 
									success: function(response){
										GVN.Global.cartJS();  
										GVN.Helper.SwalWarning('ThÃ´ng bÃ¡o','ThÃ´ng tin xuáº¥t hÃ³a Ä‘Æ¡n Ä‘Ã£ xÃ³a','success',false,false,2000);
									}
								});
							}
							else  {
								$('#checkbox-bill').click();
							}
						})
					}
				}
			})
		},
		renderInvoice: function(){
			var attributes = cartJS.attributes || {};
			var isChecked = false;
			if(attributes.order_vat_invoice != 'KhÃ´ng' && attributes.order_vat_invoice != undefined && attributes.hasOwnProperty('order_vat_invoice')){
				$('#form-invoice').find('input[name="attributes[order_vat_invoice]"]').val(attributes.order_vat_invoice);
				isChecked = true;
			}
			if(attributes.bill_order_company != undefined && attributes.hasOwnProperty('bill_order_company')){
				$('#form-invoice').find('input[name="attributes[bill_order_company]"]').val(attributes.bill_order_company).addClass('is-filled');
				isChecked = true;
			}
			if(attributes.bill_email != undefined && attributes.hasOwnProperty('bill_email')){
				$('#form-invoice').find('input[name="attributes[bill_email]"]').val(attributes.bill_email).addClass('is-filled');
				isChecked = true;
			}
			if(attributes.bill_order_tax_code != undefined && attributes.hasOwnProperty('bill_order_tax_code')){
				$('#form-invoice').find('input[name="attributes[bill_order_tax_code]"]').val(attributes.bill_order_tax_code).addClass('is-filled');
				isChecked = true;
			}
			if(attributes.bill_order_address != undefined && attributes.hasOwnProperty('bill_order_address')){
				$('#form-invoice').find('input[name="attributes[bill_order_address]"]').val(attributes.bill_order_address).addClass('is-filled');
				isChecked = true;
			}
			if(isChecked){
				$('#checkbox-bill').click();
				GVN.Helper.checkInput('form-invoice');
			}
			
		},
		addInvoice: function(){
			$('.confirm-invoice').click(function(e){
				e.preventDefault();
				var form = $('.bill-field'),
						invoice = form.find('input[name="attributes[order_vat_invoice]"]').val(),
						company = form.find('input[name="attributes[bill_order_company]"]').val(),
						email = form.find('input[name="attributes[bill_email]"]').val(),
						tax = form.find('input[name="attributes[bill_order_tax_code]"]').val(),
						address = form.find('input[name="attributes[bill_order_address]"]').val();
				var isUpdate = true;
				if(company == ''){
					GVN.Helper.SwalWarning('ThÃ´ng bÃ¡o','QuÃ½ khÃ¡ch vui lÃ²ng nháº­p TÃªn cÃ´ng ty','warning',false,false,2000);
					isUpdate = false;
				} 
				else if(email == ''){
					GVN.Helper.SwalWarning('ThÃ´ng bÃ¡o','QuÃ½ khÃ¡ch vui lÃ²ng nháº­p Email','warning',false,false,2000);
					isUpdate = false;
				} 
				else if(GVN.Helper.checkemail(email) == false){
					GVN.Helper.SwalWarning('ThÃ´ng bÃ¡o','Email nháº­p sai Ä‘á»‹nh dáº¡ng','warning',false,false,2000);
					isUpdate = false;
				}
				else if(tax == ''){
					GVN.Helper.SwalWarning('ThÃ´ng bÃ¡o','QuÃ½ khÃ¡ch vui lÃ²ng nháº­p MÃ£ sá»‘ thuáº¿','warning',false,false,2000);
					isUpdate = false;
				}
				else if(tax.length < 10){
					GVN.Helper.SwalWarning('ThÃ´ng bÃ¡o','MÃ£ sá»‘ thuáº¿ pháº£i tá»‘i thiá»ƒu 10 kÃ½ tá»±','warning',false,false,2000);
					isUpdate = false;
				}
				else if(address == ''){
					GVN.Helper.SwalWarning('ThÃ´ng bÃ¡o','QuÃ½ khÃ¡ch vui lÃ²ng nháº­p Äá»‹a chá»‰ cÃ´ng ty','warning',false,false,2000);
					isUpdate = false;
				}
				if(isUpdate){
					var attributes = cartJS.attributes || {};
					attributes['order_vat_invoice'] = 'CÃ³';
					attributes['bill_order_company'] = company;
					attributes['bill_email'] = email;
					attributes['bill_order_tax_code'] = tax;
					attributes['bill_order_address'] = address;
					$.ajax({
						type: 'post',
						url: '/cart/update.js', 
						async: false,
						data: {attributes: attributes, note: (typeof $('.cart-note').val() !== 'undefined' && $('.cart-note').val().length > 0) ? $('.cart-note').val() : null}, 
						success: function(response){
							GVN.Global.cartJS();
							GVN.Helper.SwalWarning('ThÃ´ng bÃ¡o','ÄÃ£ lÆ°u thÃ´ng tin hÃ³a Ä‘Æ¡n cho Ä‘Æ¡n hÃ ng','success',false,false,2000);
						}
					});
				}
			});
		},
	},
	changeTab: function(){
		$('body').on('click', '.js-btn-installment', function(e){
			e.preventDefault();
			var id = $(this).attr('data-id');
			$('.js-btn-payment[data-box="'+id+'"]').trigger('click');
			
			var type = $(this).attr('data-box');
			$('.section-info-total #checkout').html('Äáº¶T MUA TRáº¢ GÃ“P');
			$('.cart-method-table .js-btn-payment').removeClass('is-active');
			$('.cart-method-table .js-btn-installment').removeClass('is-active');
			$(this).addClass('is-active');
			$('.section-info-installment').removeClass('d-none').addClass('is-showing');
			$('.installment-method .installment-table').addClass('d-none');
			$('.installment-method .installment-table#'+type).removeClass('d-none');
		});
		
		$('body').on('click', '.js-btn-payment', function(e){
			e.preventDefault();
			$('.cart-method-table .js-btn-payment').removeClass('is-active');
			$('.section-info-installment').addClass('d-none').removeClass('is-showing');
			$(this).addClass('is-active');		
			if(!$(this).hasClass('d-none')){
				$('.cart-method-table .js-btn-installment').removeClass('is-active');
				$('.installment-method .installment-table').addClass('d-none');
			}
			if($(this).hasClass('is-active')){
				$('.section-info-total #checkout').html('THANH TOÃN NGAY');
			}
		});	
	},
	tabCheckout: function(type){
		$('.breadcrumb-cart a').removeClass('is-current').addClass('d-none');
		$('.breadcrumb-cart a[data-box="'+type+'"]').addClass('is-current').removeClass('d-none');

		$('.cart-main .checkout-step[data-box="'+type+'"]').addClass('is-active');
		$('.cart-main .cart-infos').addClass('d-none');
		$('.cart-main .cart-infos#'+type).removeClass('d-none');
		
		if (type == 'cart-info-order-box') {
			GVN.GA4.beginCheckout();
		}
	},
	jumpStep: function(){
		let self = this;
		
		$('body').on('click', '.js-btn-checkout', function(e){
			e.preventDefault();
			//if(window.shop.account.logged) {
				let type = $(this).attr('data-box');
				var urlNew = "#" + type;
				if(type == 'cart-payment-order-box'){
					self.submitFormShippingInfo(function(){
						self.tabCheckout('cart-payment-order-box');
						history.pushState(type, null, urlNew);
						GVN.Cart.calculateInstallment();
						GVN.GA4.paymentCheckout();
					});
				}
				else {
					if(type == 'cart-info-order-box'){
						if(accountJS.email == null){
							$('#modal-account').addClass('in_cart');
							$('#modal-account').attr('data-backdrop','static').modal('show');
							$('#modal-account input[name="return_to"]').val('/cart#cart-info-order-box');
							localStorage.setItem('coupon_wait',coupon);
						}
						else{
							self.tabCheckout($(this).attr('data-box'));
							history.pushState(type, null, urlNew);
						}
					}
					else{
						self.tabCheckout($(this).attr('data-box'));
						history.pushState(type, null, urlNew);
					}
				}
			//}
			//else {
				//GVN.Helper.accountPopup('acc-login-box');
			//}
		});
		
		$('body').on('click', '.checkout-step:not(.status-four).is-active',function(e){
			e.preventDefault();
			var targetBox = $(this).attr('data-box');
			var urlNew = "#" + targetBox;
			if (targetBox != 'cart-buy-order-box') {
				$(this).next().removeClass('is-active');
			}
			else {
				$('.checkout-step').removeClass('is-active');
				$(this).addClass('is-active');
			}
			$('.cart-infos').addClass('d-none');
			$('#'+targetBox).removeClass('d-none');
			$('.breadcrumb-cart a').removeClass('is-current').addClass('d-none');
			$('.breadcrumb-cart a[data-box="'+targetBox+'"]').addClass('is-current').removeClass('d-none');
			
			history.pushState(targetBox, null, urlNew);
		});
		
		$('body').on('click', '.breadcrumb-cart a.is-current',function(e){
			e.preventDefault();
			
			var targetBack = $(this).attr('data-back');
			if(targetBack != undefined){
				var targetBox = $(this).attr('data-box');
				var urlNew = "#" + targetBack;
				$(this).removeClass('is-current').addClass('d-none');
				$('.cart-infos').addClass('d-none');
				$('#'+targetBack).removeClass('d-none');
				$('.breadcrumb-cart a[data-box="'+targetBack+'"]').addClass('is-current').removeClass('d-none');
				$('.checkout-step[data-box="'+targetBox+'"]').removeClass('is-active');
				//if (targetBox == 'cart-buy-order-box') {
					//window.location.href = '/collections/all';
				//}
				//else {
					history.pushState(targetBack, null, urlNew);
				//}
			}
			else{
				window.location = $(this).attr('href');
			}
		});
		
		if (window.location.hash) { 
			if(window.cartJS && window.cartJS != null && window.cartJS.item_count > 0){
				//if(window.shop.account.logged) {
					if (window.location.hash.slice(1) != 'cart-payment-order-box') {
						GVN.Cart.tabCheckout(window.location.hash.slice(1));
					}
				//}
				//else {
					//GVN.Helper.accountPopup('acc-login-box');
				//}
			}
			else {
				GVN.Cart.tabCheckout('cart-buy-order-box');
			}
		}
	},
	getAPI1: function(){
		var self = this;
		function detailCoupon(data){
			let detail = '';
			let show_more = false;
			let value_discount = GVN.Helper.moneyFormat(data.savings,'â‚«');
			let after_text_line1 = ' cho sáº£n pháº©m';
			let line_2 = '';
			let line_3 = '';
			let line_4 = '';
			let line_5 = '';

			if(data.take_type == 2) value_discount = data.savings+'%';
			if(data.discount_type == 3) after_text_line1 = ' phÃ­ váº­n chuyá»ƒn';
			else if(data.discount_type == 5) after_text_line1 = ' cho giÃ¡ trá»‹ Ä‘Æ¡n hÃ ng';

			if(data.discount_type == 6){
				if(data.on_every_item) line_2 = '<li>Ãp dá»¥ng 1 láº§n cho toÃ n bá»™ Ä‘Æ¡n hÃ ng</li>';
				else line_2 = '<li>Ãp dá»¥ng cho tá»«ng sáº£n pháº©m trong giá» hÃ ng hÃ ng</li>';
			}

			if(data.order_over > 0) line_3 = '<li>Mua tá»‘i thiá»ƒu '+GVN.Helper.moneyFormat(data.order_over,'â‚«')+'</li>';

			if(data.entitled_products.length > 0){
				line_4 = '<li>Sáº£n pháº©m';
				let items = [];
				data.entitled_products.map(item => {
					items.push('<a target="blank" href="'+item.url+'">'+item.title+'</a>');
				});
				line_4 += 	items.join('<br>');
				line_4 += '</li>';
			}

			if(data.entitled_provinces.length > 0){
				line_5 += '<li>Tá»‰nh thÃ nh Ã¡p dá»¥ng '+ data.entitled_provinces.map(provinces => {return provinces.name}).join(',') +'</li>';
			}

			if(line_3 != '' || line_4 != '' || line_5 != '') show_more = true;

			detail += '<li>Giáº£m '+value_discount+after_text_line1+'</li>';
			detail += line_2;
			detail += line_3;
			detail += line_4;
			detail += line_5;

			return { detail, show_more };
		}
		function renderCoupon(info,index){
			let expire = '';
			let detail_coupon = detailCoupon(info);
			if(info.enddate != null){
				expire = GVN.Helper.formatDate(new Date(info.enddate));
			}
			else {
				expire = 'KhÃ´ng giá»›i háº¡n';
			}

			let html_coupon = `	
				<div class="coupon-item ${info.code == GVN.Cart.checkout.discount_code?'isSelect':''} ${index >= 10?'d-none':''}">
					<div class="coupon-item--inner">
						<div class="coupon-item--left">
							<div class="cp-img fade-box">
								<span class="aspect-ratio">
									<img class=" ls-is-cached lazyloaded" data-src="//theme.hstatic.net/200000636033/1001030143/14/coupon_2_img.png?v=177" src="//theme.hstatic.net/200000636033/1001030143/14/coupon_2_img.png?v=177" alt="">
								</span>
							</div>
						</div>
						<div class="coupon-item--right">
							<button type="button" class="cp-icon" data-bs-toggle="popover" data-bs-container="body" data-bs-placement="bottom" data-content-id="cp-tooltip-${index}" data-class="coupon-popover coupon-popover-cart" data-bs-title="" aria-label="coupon-tooltip-${index}" data-original-title="" title="">
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" x="0" y="0" viewBox="0 0 24 24"><g><g fill="rgb(0,0,0)"><path clip-rule="evenodd" d="m12 3.53846c-4.67318 0-8.46154 3.78836-8.46154 8.46154 0 4.6732 3.78836 8.4615 8.46154 8.4615 4.6732 0 8.4615-3.7883 8.4615-8.4615 0-4.67318-3.7883-8.46154-8.4615-8.46154zm-10 8.46154c0-5.52285 4.47715-10 10-10 5.5228 0 10 4.47715 10 10 0 5.5228-4.4772 10-10 10-5.52285 0-10-4.4772-10-10z"></path><path clip-rule="evenodd" d="m12 7.64103c.4248 0 .7692.34439.7692.76923v4.10254c0 .4249-.3444.7693-.7692.7693s-.7692-.3444-.7692-.7693v-4.10254c0-.42484.3444-.76923.7692-.76923z"></path><path d="m13.0256 15.5897c0 .5665-.4592 1.0257-1.0256 1.0257s-1.0256-.4592-1.0256-1.0257c0-.5664.4592-1.0256 1.0256-1.0256s1.0256.4592 1.0256 1.0256z"></path></g></g></svg>
							</button>	
							<div class="cp-top">
							`;
								var txt_title = `Giáº£m ${info.take_type == 1 ? GVN.Helper.moneyFormat(info.savings,'â‚«'):info.savings+'%'}`;
								if(info.discount_type == 3) txt_title = 'Miá»…n phÃ­ váº­n chuyá»ƒn';
								html_coupon+=	`<h3>${txt_title}</h3>
                 <p>ÄÆ¡n hÃ ng tá»« 200k</p>
							</div>
							<div class="cp-bottom">
								<div class="cp-bottom-detail">
									<p>MÃ£: <strong>${info.code}</strong></p>
									<p>HSD: ${expire}</p>
								</div>
								<div class="cp-bottom-btn">
									<button class="button btn-apply-line-coupon" data-code="${info.code}">${info.code == GVN.Cart.checkout.discount_code?'Bá» chá»n':'Ãp dá»¥ng'}</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			`;
			
			let html_coupon_tooltip = `	
				<div class="cpi-tooltip--info" id="cp-tooltip-${index}">
					<div class="popover-content--coupon">
						<div class="dfex-txt dfex-bkg">
							<div class="dfex-txt--1">MÃ£</div>	
							<div class="dfex-txt--2"><b> ${info.code}</b> <span class="cpi-trigger" data-coupon-index="coupon-item--${index}" data-coupon="${info.code}"></span></div>
						</div>
						<div class="dfex-txt dfex-bkg">
							<div class="dfex-txt--1">Háº¡n sá»­ dá»¥ng</div>
							<div class="dfex-txt--2">${expire}</div>
						</div>
						<div class="dfex-txt dfex-bkg">
							<div class="dfex-txt--3">													
								<ul>${detail_coupon.detail}</ul> 
							</div>
						</div>
						<div class="dfex-txt dfex-bkg dfex-none">
							<div class="dfex-txt--cta">
								<button class="btn-popover btn-popover-code btn-apply-line-coupon" data-code="${info.code}">Ãp dá»¥ng</button>
								<button class="btn-popover btn-popover-close">ÄÃ³ng</button>
							</div>
						</div>
					</div>
				</div>
			`;
			
			if($('.list-coupon--hover').html() == ''){
				$('.list-coupon--hover').html(html_coupon_tooltip);
			}
			else{
				$('.list-coupon--hover').append(html_coupon_tooltip);
			}
			
			return html_coupon;			
		}
		if(window.cartJS && window.cartJS != null && window.cartJS.item_count > 0){
			var getPromotion = 
				$.ajax({
					url: '/promotions.json',
					type: 'POST',
					dataType: 'json',
					contentType: 'application/json',
					data: JSON.stringify({
						showonwebsite: true
					}),
					success: function(discounts){
						console.log(discounts);
					},
					error: function(){}
				});
			
			$.when($.get('/account.js'),$.get('/checkouts.js'),getPromotion)
			 .done(function(rs1,rs2,rs3){
				rs1 = rs1[0];//account
				if(rs1.phone != null) {
					$('input[name="editcustomer[phone]"]').val(rs2.phone);
					var defaultAdress = addressArr.filter( item => item.isDefault) ;
					default_address = defaultAdress[0];
					if(default_address.address != '') rs1.adress = default_address.address;

					if(rs1.phone == null) rs1.phone = default_address.phone;
					else $('input[name="editcustomer[phone]"]').val(rs1.phone);
					$('input[name="editcustomer[phone]"]').addClass('is-filled');
					
					if(rs1.email != "" && rs1.email != null) $('input[name="editcustomer[email]"]').val(rs1.email);
					if(rs1.name != "" && rs1.name != null) $('input[name="editcustomer[name]"]').val(rs1.name);
				}
				
				self.checkout = rs2[0].checkouts;//checkout
				if(window.cartJS && window.cartJS != null && window.cartJS.item_count > 0){
					/* Check cart */
					self.attributes = window.cartJS.attributes;

					/* Render Info User If Login, Not Submit Info */
					var submitedInfo = true;
					var address = [];
					for(key in self.checkout.shipping_address){
						if(key == 'full_name'){
							if(self.checkout.shipping_address[key] != null){
								// Get data Ä‘Ã£ submit trÆ°á»›c Ä‘Ã³ Ä‘á»ƒ khi change tá»‰nh thÃ nh, quáº­n huyá»‡n, phÆ°á»ng xÃ£ khÃ´ng bá»‹ máº¥t data 
								self.data_shipping_rate[key] = self.checkout.shipping_address[key];
								$('input[name="editcustomer[name]"]').addClass('is-filled');
								$('input[name="editcustomer[name]"]').val(self.checkout.shipping_address[key]);
								// $('#info-address p:eq(0) span').html(self.checkout.shipping_address[key]);
							}
							else {
								$('input[name="editcustomer[name]"]').val(rs1.name).addClass('is-filled');
								submitedInfo = false;
							}
						}

						if(key == 'phone'){
							if(self.checkout.shipping_address[key] != null){
								// Get data Ä‘Ã£ submit trÆ°á»›c Ä‘Ã³ Ä‘á»ƒ khi change tá»‰nh thÃ nh, quáº­n huyá»‡n, phÆ°á»ng xÃ£ khÃ´ng bá»‹ máº¥t data
								self.data_shipping_rate[key] = self.checkout.shipping_address[key];
								$('input[name="editcustomer[phone]"]').addClass('is-filled');
								$('input[name="editcustomer[phone]"]').val(self.checkout.shipping_address[key]);
								// $('#info-address p:eq(2) span').html(self.checkout.shipping_address[key]);
							}
							else submitedInfo = false;
						}

						/*
						if(key == 'email'){
							if(self.checkout.shipping_address[key] != null){
								// Get data Ä‘Ã£ submit trÆ°á»›c Ä‘Ã³ Ä‘á»ƒ khi change tá»‰nh thÃ nh, quáº­n huyá»‡n, phÆ°á»ng xÃ£ khÃ´ng bá»‹ máº¥t data
								self.data_shipping_rate[key] = self.checkout.shipping_address[key];
								$('input[name="editcustomer[email]"]').val(self.checkout.shipping_address[key]);
								$('#info-address p:eq(1) span').html(self.checkout.shipping_address[key]);
							}
							else submitedInfo = false;
						}		*/				

						if(key == 'address'){
							if(self.checkout.shipping_address[key] != null){
								/* Get data Ä‘Ã£ submit trÆ°á»›c Ä‘Ã³ Ä‘á»ƒ khi change tá»‰nh thÃ nh, quáº­n huyá»‡n, phÆ°á»ng xÃ£ khÃ´ng bá»‹ máº¥t data */
								self.data_shipping_rate[key] = self.checkout.shipping_address[key];
								$('input[name="editcustomer[address]"]').val(self.checkout.shipping_address[key]);
								address[0] = self.checkout.shipping_address[key];
							}
							else submitedInfo = false;
						}

						if(key == 'province_name'){
							if(self.checkout.shipping_address[key] != null){
								/* Get data Ä‘Ã£ submit trÆ°á»›c Ä‘Ã³ Ä‘á»ƒ khi change tá»‰nh thÃ nh, quáº­n huyá»‡n, phÆ°á»ng xÃ£ khÃ´ng bá»‹ máº¥t data */
								self.data_shipping_rate.province_code = self.checkout.shipping_address.province_code;
								address[3] = self.checkout.shipping_address[key];
								var province_code = self.checkout.shipping_address.province_code;

								if(self.checkout.available_districts != null){
									$('.select-district option:not(:first-child)').remove();
									self.checkout.available_districts.map(district => {
										var selected = '';
										if(self.checkout.shipping_address.district_code  == district.district_code) selected = 'selected';
										var option_district = `<option value="${district.district_code}" data-id="${district.id}" ${selected}>${district.district_name}</option>`;
										$('.select-district').append(option_district);
									});
								}
							}
							else submitedInfo = false;
						}

						if(key == 'district_name'){
							if(self.checkout.shipping_address[key] != null){
								self.data_shipping_rate.district_code = self.checkout.shipping_address.district_code;
								address[2] = self.checkout.shipping_address[key];
							}
							else submitedInfo = false;
						}

						if(key == 'ward_name'){
							if(self.checkout.shipping_address[key] != null || self.checkout.available_wards != null){
								if(self.checkout.shipping_address[key] != null){
									self.data_shipping_rate.ward_code = self.checkout.shipping_address.ward_code;
									address[1] = self.checkout.shipping_address[key];
								}
								else{
									address[1] = '';
								}

								self.checkout.available_wards.map(ward => {
									var selected = '';
									if(ward.ward_code == self.checkout.shipping_address.ward_code ) selected = "selected";
									var option_ward = `<option value="${ward.ward_code}" data-id="${ward.id}" ${selected}>${ward.ward_name}</option>`;
									$('.select-ward').append(option_ward);
								});
							}
							else submitedInfo = false;
						}

						if(address.length > 0){
							$('#editcustomer-address').addClass('is-filled');
							
							if(window.location.hash && address.length == 4) { 
								if (window.location.hash.slice(1) == 'cart-payment-order-box'){
									$('.status-two').addClass('is-active');
									$('.order-table .line:eq(1) .right p').html(GVN.Cart.checkout.shipping_address.full_name);
									$('.order-table .line:eq(2) .right p').html(GVN.Cart.checkout.shipping_address.phone);
									$('.order-table .line:eq(3) .right p').html(GVN.Cart.checkout.shipping_address.email);
									
									$('.order-table .line:eq(4) .right p').html(address.join(','));
									$('.order-table .line:eq(5) .right p').html('<strong>'+GVN.Helper.moneyFormat(GVN.Cart.checkout.subtotal_price_original,'â‚«')+'</strong>');

									if(GVN.Cart.checkout.shipping_price > 0){
										$('.order-table .line:eq(6) .right p').html('<strong>'+GVN.Helper.moneyFormat(GVN.Cart.checkout.shipping_price,'â‚«')+'</strong>');
									}
									else{
										$('.order-table .line:eq(6) .right p').html('<strong>Miá»…n phÃ­</strong>');
									}

									if(GVN.Cart.checkout.discount > 0){
										$('.order-table .line:eq(7) .right p').html('<strong>-'+GVN.Helper.moneyFormat(GVN.Cart.checkout.discount,'â‚«')+'</strong>');
										$('.order-table .line:eq(7)').removeClass('d-none');
									}
									else{
										$('.order-table .line:eq(7)').addClass('d-none').find('.right p').html('');
									}

									$('.order-table .line:eq(8) .right p').html('<strong>'+GVN.Helper.moneyFormat(GVN.Cart.checkout.total_price,'â‚«')+'</strong>');
									$('#installment-bank .line[data-pricepr]').html(GVN.Helper.moneyFormat(GVN.Cart.checkout.total_price,'â‚«'));
									
									if($('#option-prepay option.option_total').length > 0) $('#option-prepay option.option_total').remove();
									$('#option-prepay').append('<option class="option_total" selected value="'+GVN.Cart.checkout.total_price+'">Tráº£ gÃ³p: '+GVN.Helper.moneyFormat(GVN.Cart.checkout.total_price,'â‚«')+'</option>')
									
									self.calculateInstallment();
									self.tabCheckout('cart-payment-order-box');
								}
							}
						}
					}
					
					if(self.checkout.email_checkout_behavior == 3){
						$('input[name="editcustomer[email]"]').val(rs1.email).addClass('is-filled');
					}

					self.renderPayment(self.checkout.available_payment_methods, self.checkout.payment_method_id);
					self.renderProvince();

					if(self.checkout.available_shipping_rates != null && cartJS.requires_shipping){
						self.renderShippingMethod();
						/*
						$('.fee-shipping .sub-total-ship').html(HRT.All.formatMoney(self.checkout.shipping_price,'â‚«'));
						if(self.checkout.discount_code){
							$('.coupon-promotion').removeClass('d-none');
							$('.coupon-promotion .label-code-coupon').html(	'<svg width="16" height="15" xmlns="http://www.w3.org/2000/svg" class="applied-reduction-code-icon" fill="#CE4549"><path d="M14.476 0H8.76c-.404 0-.792.15-1.078.42L.446 7.207c-.595.558-.595 1.463 0 2.022l5.703 5.35c.296.28.687.42 1.076.42.39 0 .78-.14 1.077-.418l7.25-6.79c.286-.268.447-.632.447-1.01V1.43C16 .64 15.318 0 14.476 0zm-2.62 5.77c-.944 0-1.713-.777-1.713-1.732 0-.954.77-1.73 1.714-1.73.945 0 1.714.776 1.714 1.73 0 .955-.768 1.73-1.713 1.73z"></path></svg>' + self.checkout.discount_code);
							$('.coupon-promotion .render-coupon').html('- '+ self.checkout.discount + 'Ä‘');
						}
						$('.fee-shipping').removeClass('d-none');
						$('.main-total-price b').html(HRT.All.formatMoney(self.checkout.total_price,'â‚«'));
						*/
					}
					else if(!cartJS.requires_shipping){
						/*$('.checkbox-shipmethod .checkbox-item:nth-child(1)').remove();
						$('.checkbox-shipmethod .checkbox-item:nth-child(1) input').click();*/
						/* $('.list-method-ship').html('<p class="alert alert-danger alert-cus">Vui lÃ²ng nháº­p Ä‘áº§y Ä‘á»§ thÃ´ng tin giao hÃ ng</p>'); */
					}
					
					if(self.checkout.discount_code != null && self.checkout.discount_code != ''){
						let btn_remove = '<button class="input-remove"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="512" height="512" x="0" y="0" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path fill="#6D6E72" d="M256 0C114.836 0 0 114.836 0 256s114.836 256 256 256 256-114.836 256-256S397.164 0 256 0zm0 0" data-original="#6D6E72" class=""></path><path fill="#fafafa" d="M350.273 320.105c8.34 8.344 8.34 21.825 0 30.168a21.275 21.275 0 0 1-15.086 6.25c-5.46 0-10.921-2.09-15.082-6.25L256 286.164l-64.105 64.11a21.273 21.273 0 0 1-15.083 6.25 21.275 21.275 0 0 1-15.085-6.25c-8.34-8.344-8.34-21.825 0-30.169L225.836 256l-64.11-64.105c-8.34-8.344-8.34-21.825 0-30.168 8.344-8.34 21.825-8.34 30.169 0L256 225.836l64.105-64.11c8.344-8.34 21.825-8.34 30.168 0 8.34 8.344 8.34 21.825 0 30.169L286.164 256zm0 0" data-original="#fafafa"></path></g></svg></button>';
						$('.section-info-total .summary-discount').each(function(){
							$(this).html(`<span class="title">Giáº£m giÃ¡: <span data-code="${self.checkout.discount_code}">${self.checkout.discount_code} ${btn_remove}</span></span><span class="discount_price">-${GVN.Helper.moneyFormat(self.checkout.discount,'â‚«')}</span>`).removeClass('d-none');
						});
					}
					
					if(self.checkout.available_locations != null && self.checkout.available_locations.length > 0){
						self.renderStore(self.checkout.available_locations);
						if(self.checkout.location_id != null && window.location.hash && window.location.hash.slice(1) == 'cart-payment-order-box'){
							$('.status-two').addClass('is-active');  
							if(rs1.name != null) $('.order-table .line:eq(1) .right p').html(rs1.name);
							if(rs1.phone != null) $('.order-table .line:eq(2) .right p').html(rs1.phone);
							if(rs1.email != null) $('.order-table .line:eq(3) .right p').html(rs1.email);

							var store_picked = GVN.Cart.checkout.available_locations.filter(x => x.id == GVN.Cart.checkout.location_id);
							var address = store_picked.address+', '+store_picked.ward_name+', store_'
							$('.order-table .line:eq(4) .right p').html();
							$('.order-table .line:eq(5) .right p').html('<strong>'+GVN.Helper.moneyFormat(GVN.Cart.checkout.subtotal_price_original,'â‚«')+'</strong>');

							if(GVN.Cart.checkout.shipping_price > 0){
								$('.order-table .line:eq(6) .right p').html('<strong>'+GVN.Helper.moneyFormat(GVN.Cart.checkout.shipping_price,'â‚«')+'</strong>');
							}
							else{
								$('.order-table .line:eq(6) .right p').html('<strong>Miá»…n phÃ­</strong>');
							}

							if(GVN.Cart.checkout.discount > 0){
								$('.order-table .line:eq(7) .right p').html('<strong>-'+GVN.Helper.moneyFormat(GVN.Cart.checkout.discount,'â‚«')+'</strong>');
								$('.order-table .line:eq(7)').removeClass('d-none');
							}
							else{
								$('.order-table .line:eq(7)').addClass('d-none').find('.right p').html('');
							}

							$('.order-table .line:eq(8) .right p').html('<strong>'+GVN.Helper.moneyFormat(GVN.Cart.checkout.total_price,'â‚«')+'</strong>');
							$('#installment-bank .line[data-pricepr]').html(GVN.Helper.moneyFormat(GVN.Cart.checkout.total_price,'â‚«'));
							
							if($('#option-prepay option.option_total').length > 0) $('#option-prepay option.option_total').remove();
							$('#option-prepay').append('<option class="option_total" selected value="'+GVN.Cart.checkout.total_price+'">Tráº£ gÃ³p: '+GVN.Helper.moneyFormat(GVN.Cart.checkout.total_price,'â‚«')+'</option>')
							
							self.calculateInstallment();
							self.tabCheckout('cart-payment-order-box');
						}
					}
					else{
						/*$('.checkbox-shipmethod .checkbox-item:nth-child(2)').remove();*/
						$('#pickup-method-form').html('<div class="empty_location">Hiá»‡n táº¡i khÃ´ng cÃ³ showroom phÃ¹ há»£p vá»›i Ä‘Æ¡n hÃ ng nÃ y.</div>');
						$('#pickup-method-form').addClass('empty');
						$('#pickup-method').addClass('empty');
					}
					
					/* Bá»• sung option tráº£ gÃ³p nguyÃªn Ä‘Æ¡n theo giÃ¡ trá»‹ Ä‘Æ¡n hÃ ng */
					if(window.location.hash && window.location.hash.slice(1) == 'cart-payment-order-box'){
						if(GVN.Cart.checkout.total_price < 5000000) {
							$('.cart-method-table.no-mrg:nth-child(2)').remove();
						}
						else{
							if($('#option-prepay option.option_total').length > 0) $('#option-prepay option.option_total').remove();
							$('#option-prepay').append('<option class="option_total" selected value="'+GVN.Cart.checkout.total_price+'">Tráº£ gÃ³p: '+GVN.Helper.moneyFormat(GVN.Cart.checkout.total_price,'â‚«')+'</option>')
						}
					}
					/* End: Bá»• sung option tráº£ gÃ³p nguyÃªn Ä‘Æ¡n theo giÃ¡ trá»‹ Ä‘Æ¡n hÃ ng */
					
					$('.section-info-total').each(function(){
						$(this).prepend(`<div class="summary-shipping"><span class="title">PhÃ­ váº­n chuyá»ƒn: </span><span class="shipprice">${self.checkout.shipping_price > 0 ? GVN.Helper.moneyFormat(self.checkout.shipping_price,'â‚«') : 'Miá»…n phÃ­'}</span></div>`);
					});
					
					$('.summary-total .totalprice').html(GVN.Helper.moneyFormat(self.checkout.total_price,'â‚«'));
								
					/* Render Coupon */
					
					let code_summary = '';
					var discounts = rs3[0];
					var count_coupon = 0;
					discounts.promotions.map((coupon,index) => {
						if(!coupon.ispromotion){
							if(index < 5){
								if(coupon.discount_type == 3){
									code_summary += `<div class="item-coupon" data-code="${coupon.code}"><span>Freeship</span></div>`;
								}
								else{
									code_summary += `<div class="item-coupon" data-code="${coupon.code}"><span>Giáº£m ${coupon.take_type == 1 ? GVN.Helper.moneyFormat(coupon.savings,'â‚«'):coupon.savings+'%'}</span></div>`;
								}
							}
							$('.hrv-discount-code--internal').append(renderCoupon(coupon,count_coupon));
							count_coupon++;
						}
					});

					if(discounts.promotions.length > 10){
						let show_more = `<div class="line-last text-center">
														 <button id="btn-show-all-coupon">
															  <span>Xem thÃªm</span><svg width="10" height="10" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.5 2.5L4 5.5L1.5 2.5" stroke="#1982F9" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>
														 </button>
													 </div>`;
						$('.hrv-discount-code--internal').append(show_more);
					}
					$('.cart-coupon .list-coupons').html(code_summary);
					
					GVN.Global.popoverSupport();
					GVN.Helper.checkInput('form-edit');
				}
			});
		}
	},
	couponActions: function(){
		function applyCoupon(coupon){
			$.ajax({
				url: '/checkouts/discount.js',
				type: 'POST',
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify({
					discount_code: coupon
				}),
				success: function(result){
					if(result.error){
						/*Swal.fire({
							title: '',
							text: result.error_messages['haravan.checkout.field_errors.discount_invalid'],
							icon: 'error',
							timer: 2000,
							showCancelButton: false,
							showConfirmButton: false,
						});*/
						$('.hrv-coupons--notify .notify-3').html(result.error_messages['haravan.checkout.field_errors.discount_invalid']).removeClass('d-none');
					}
					else{
						GVN.Cart.checkout = result.checkouts;
						$('.coupon-item').removeClass('isSelect');
						$('.btn-apply-line-coupon').html("Ãp dá»¥ng");
						$('.btn-apply-line-coupon[data-code="'+coupon+'"]').parents('.coupon-item').addClass('isSelect');
						if(coupon == ''){
							$('.btn-apply-line-coupon').html("Ãp dá»¥ng");
							$('.summary-discount').addClass('d-none').html('');
						}
						else{
							$('.hrv-coupons--notify > div').addClass('d-none');
							$('.btn-apply-line-coupon[data-code="'+coupon+'"]').html("Bá» chá»n");
							let btn_remove = '<button class="input-remove"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="512" height="512" x="0" y="0" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path fill="#6D6E72" d="M256 0C114.836 0 0 114.836 0 256s114.836 256 256 256 256-114.836 256-256S397.164 0 256 0zm0 0" data-original="#6D6E72" class=""></path><path fill="#fafafa" d="M350.273 320.105c8.34 8.344 8.34 21.825 0 30.168a21.275 21.275 0 0 1-15.086 6.25c-5.46 0-10.921-2.09-15.082-6.25L256 286.164l-64.105 64.11a21.273 21.273 0 0 1-15.083 6.25 21.275 21.275 0 0 1-15.085-6.25c-8.34-8.344-8.34-21.825 0-30.169L225.836 256l-64.11-64.105c-8.34-8.344-8.34-21.825 0-30.168 8.344-8.34 21.825-8.34 30.169 0L256 225.836l64.105-64.11c8.344-8.34 21.825-8.34 30.168 0 8.34 8.344 8.34 21.825 0 30.169L286.164 256zm0 0" data-original="#fafafa"></path></g></svg></button>';
							$('.summary-discount').html(`<span class="title">Giáº£m giÃ¡: <span data-code="${result.checkouts.discount_code}">${result.checkouts.discount_code} ${btn_remove}</span></span><span class="discount_price">-${GVN.Helper.moneyFormat(result.checkouts.discount,'â‚«')}</span>`);
							$('.summary-discount').removeClass('d-none');
						}
						
						$('.summary-total .totalprice').html(GVN.Helper.moneyFormat(result.checkouts.total_price,'â‚«'));
						
						if(GVN.Cart.checkout.discount > 0){
							$('.order-table .line:eq(7) .right p').html('<strong>-'+GVN.Helper.moneyFormat(GVN.Cart.checkout.discount,'â‚«')+'</strong>');
							$('.order-table .line:eq(7)').removeClass('d-none');
						}
						else{
							$('.order-table .line:eq(7)').addClass('d-none').find('.right p').html('');
						}

						$('.order-table .line:eq(8) .right p').html('<strong>'+GVN.Helper.moneyFormat(GVN.Cart.checkout.total_price,'â‚«')+'</strong>');
						$('#installment-bank .line[data-pricepr]').html(GVN.Helper.moneyFormat(GVN.Cart.checkout.total_price,'â‚«'));
					}
					
					localStorage.removeItem('coupon_wait');
					$('#modal-coupon').modal('hide');
					console.log(result);
				},
				error: function(result){
					localStorage.removeItem('coupon_wait');
					$('#modal-coupon').modal('hide');
					/*
					Swal.fire({
						title: '',
						text: result.responseJSON.error_messages['haravan.checkout.field_errors.discount_invalid'],
						icon: 'error',
						timer: 2000,
						showCancelButton: false,
						showConfirmButton: false,
					});
					*/
					$('.hrv-coupons--notify .notify-3').html(result.responseJSON.error_messages['haravan.checkout.field_errors.discount_invalid']).removeClass('d-none');
				}
			});
		}
		
		$(document).on('click','.cart-coupon .cart-coupon--title, .item-coupon',function(e){
			e.preventDefault();
			// Náº¿u dÃ¹ng modal coupon
			//$('#modal-coupon').modal();
			$(this).toggleClass('is-showing');
			$(this).siblings('.cart-coupon--list').toggleClass('is-showing');
		});
		
		// Náº¿u dÃ¹ng modal coupon
		$(document).on('click','#btn-show-all-coupon',function(){
			if($(this).hasClass('open')){
				$(this).find('span:first-child').html('Xem thÃªm');
			}
			else{
				$(this).find('span:first-child').html('Thu gá»n');
			}
			$(this).toggleClass('open');
			$('.coupon-item:not(:nth-child(n+1):nth-child(-n+10))').toggleClass('d-none');
		});
		
		$(document).on('click','.coupon-detail',function(){
			$(this).toggleClass('open');
			$(this).parent().siblings('.coupon_desc').toggleClass('open');
		});
		
		$(document).on('click','.btn-apply-line-coupon',function(e){
			e.preventDefault();
			var self = $(this);
			let coupon = $(this).attr('data-code');	
			if($(this).parents('.coupon-item').hasClass('isSelect')){
				coupon = '';
			}
			
			applyCoupon(coupon);
		});
		
		$(document).on('click','.btn-apply-input-coupon',function(e){
			e.preventDefault();
			GVN.Cart.isInputCoupon = true;
			var coupon = $('input[name="editcoupon[code]"]').val();
			if(coupon != ''){
				$('.hrv-coupons--notify > div').addClass('d-none');
				if ($('.btn-apply-line-coupon[data-code="'+coupon+'"]').length > 0){
					$('.btn-apply-line-coupon[data-code="'+coupon+'"]').trigger('click');
				}
				else {
					applyCoupon(coupon);
				}
			}
			else{
				$('.hrv-coupons--notify .notify-4').removeClass('d-none');
			}
		});
		
		$(document).on('click','.input-remove',function(e){
			e.preventDefault();
			var coupon = $(this).parents('.title').find('span').attr('data-code');	
			$.ajax({
				url: '/checkouts/discount.js',
				type: 'POST',
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify({
					discount_code: ''
				}),
				success: function(result){
					GVN.Cart.checkout = result.checkouts;
					$('.btn-apply-line-coupon[data-code="'+coupon+'"]').parents('.coupon-item').removeClass('isSelect');
					$('.btn-apply-line-coupon[data-code="'+coupon+'"]').html("Ãp dá»¥ng");
					$('.summary-discount').addClass('d-none').html('');   
					$('.summary-total .totalprice').html(GVN.Helper.moneyFormat(result.checkouts.total_price,'â‚«'));
					if(GVN.Cart.checkout.discount > 0){
						$('.order-table .line:eq(7) .right p').html('<strong>-'+GVN.Helper.moneyFormat(GVN.Cart.checkout.discount,'â‚«')+'</strong>');
						$('.order-table .line:eq(7)').removeClass('d-none');
					}
					else{
						$('.order-table .line:eq(7)').addClass('d-none').find('.right p').html('');
					}

					$('.order-table .line:eq(8) .right p').html('<strong>'+GVN.Helper.moneyFormat(GVN.Cart.checkout.total_price,'â‚«')+'</strong>');
					$('#installment-bank .line[data-pricepr]').html(GVN.Helper.moneyFormat(GVN.Cart.checkout.total_price,'â‚«'));
				}
			});
		});
		
		GVN.Global.popoverSupport();
		
		if(localStorage.getItem('coupon_wait') != null && localStorage.getItem('coupon_wait') != ''){
			applyCoupon(localStorage.getItem('coupon_wait'));
		}
	},
	renderStore: function(stores){
		 var self = this;
		 var province_store = '';
		 stores.map(st => {
		 	if(self.stores.hasOwnProperty(st.province_id)){
				if(self.stores[st.province_id].district.indexOf(st.district_id) == -1) self.stores[st.province_id].district += '<option value="'+st.district_id+'">'+st.district_name+'</option>';
				self.stores[st.province_id].address += `<li data-district="${st.district_id}" class="">
																									<div class="item">
																										<input type="radio" id="store-${st.id}" name="store" value="${st.id}" ${self.checkout.location_id != null && self.checkout.location_id == st.id?'checked':''}/>
																										<label for="store-${st.id}"> ${st.address} ${st.ward_name}, ${st.district_name}, ${st.province_name} <span class="">(CÃ²n hÃ ng)</span></label>
																									</div>
																								</li>`;
			}
			else{
				province_store += '<option value="'+st.province_id+'">'+st.province_name+'</option>';
				self.stores[st.province_id] = {
					district: '<option value="'+st.district_id+'">'+st.district_name+'</option>',
					address: `<li data-district="${st.district_id}" class="">
											<div class="item">
												<input type="radio" id="store-${st.id}" name="store" value="${st.id}" ${self.checkout.location_id != null && self.checkout.location_id == st.id?'checked':''}/>
												<label for="store-${st.id}"> ${st.address} ${st.ward_name}, ${st.district_name}, ${st.province_name} <span class="">(CÃ²n hÃ ng)</span></label>
											</div>
										</li>`
				}
			}
		 });
		
		$('.select-province-pickup').append(province_store);
		
		$('.select-province-pickup').on('change',function(){
			var province_store = $(this).val();
			$('#list-available-stores').html('');
			$('.select-district-pickup option:not(:first-child)').remove();
			if(province_store != ''){
				$('.select-district-pickup').append(self.stores[province_store].district);
				$('#list-available-stores').html(self.stores[province_store].address).removeClass('d-none');
				//if($('#list-available-stores li').length == 1) 
				$('#list-available-stores li:eq(0) input').prop('checked',true);
			}
		});
		
		$('.select-province-district').on('change',function(){
			var district_store = $(this).val();
			if(district_store != ''){
				$('#list-available-stores li:not([data-district="'+district_store+'"])').hide();
			}
			else{
				$('#list-available-stores li').show();
			}
		});
		
		//debugger;
		if(self.checkout.location_id != null){
			var store_picked = stores.filter(st => st.id == self.checkout.location_id);
			$('.select-province-pickup').val(store_picked[0].province_id).change();
		}
	},
	renderPayment: function(payments , fid){
		var firstPick = fid != undefined && fid != '' && fid != 'null' && fid != 0 ? fid : 0;
		var self = this;
		var img = {
			cod: 'https://file.hstatic.net/200000636033/file/pay_2d752907ae604f08ad89868b2a5554da.png',
			zalo_pay: 'https://file.hstatic.net/200000636033/file/zalopay_554b8b5c40234d9aae986abf73261c04.png',
			momo: 'https://file.hstatic.net/200000636033/file/momo_50d207f0cbd34562b936001ab362bd8e.png',
			atm: 'https://file.hstatic.net/200000636033/file/icon_atm_eb07d9eabaef47e088d7f214e3562b97.svg',
			pick: 'https://file.hstatic.net/200000636033/file/icon_pick_up_c64274ffa4ae41c4965f62b565bbbb34.svg',
			payoo: 'https://file.hstatic.net/200000636033/file/payoo_50f72acc9fcc45ef8123724a0f8e3a8d.png',
			alepay: 'https://file.hstatic.net/200000636033/file/alepay-logo_fdae7a4dbd92422cb292bd4ff07ecda6.png'
		};
		/*
		  cct: 'https://file.hstatic.net/1000126467/file/cct_icon_4527accb0b8f49c08d5b21c98ab563f9.svg',
			shopee_pay: 'https://file.hstatic.net/200000407583/file/ic_shopee_pay_2486d4f0ca7f42d7a2298673a5b01ab4.png',
			grab_pay: 'https://file.hstatic.net/200000407583/file/ic_grabpay_8b675f00a0344a92818e6289ef3d50c8.png',
			vn_pay: 'https://file.hstatic.net/200000407583/file/ic_vnpay_5e30d010ff2d471aaeba5ec01b6976fd.png',
			moca: 'https://hstatic.net/0/0/global/design/seller/image/payment/grabmoca.svg?v=1',
			acs: 'https://hstatic.net/0/0/global/design/seller/image/payment/other.svg?v=1',
		*/
		payments.map((gateway,ind_gate) => {
			var valid_payment = true;
			var alt_icon = 'cod';
			var imgGateway = img.cod;
			var content_expand = '';
			var checked = (firstPick != 0 && gateway.id == firstPick) ? 'checked' : '';
			var checkGateway = gateway.name.toLowerCase();
			var class_img = 'svg';
			/*
			if(checkGateway.indexOf('cct') > -1){
				imgGateway = img.cct;
				alt_icon = 'cct';
			}
			else if(checkGateway.indexOf('tráº£ gÃ³p') > -1){
				imgGateway = img.payoo;
				alt_icon = 'Tráº£ gÃ³p 0% ';
				if(checkGateway.indexOf('acs') > -1){
					imgGateway = img.acs;
					alt_icon = 'Tráº£ gÃ³p qua ACS';
				}
			}
			else if(checkGateway.indexOf('vnpay') > -1){
				imgGateway = img.vn_pay;
				alt_icon = 'VNPay';
				if(shop.payment.vnpay != '') content_expand = shop.payment.vnpay;
			}
			else if(checkGateway.indexOf('shopeepay') > -1){
				imgGateway = img.shopee_pay;
				alt_icon = 'ShopeePay';
			}
			else if(checkGateway.indexOf('moca') > -1){
				imgGateway = img.moca;
				alt_icon = 'Moca';
				if(shop.payment.moca != '') content_expand = shop.payment.moca;
			}
			else if(checkGateway.indexOf('payoo') > -1){
				imgGateway = img.payoo;
				alt_icon = 'Payoo';
			}
			*/
				
			if(checkGateway.indexOf('momo') > -1){
				imgGateway = img.momo;
				alt_icon = 'Momo';
				class_img = 'img';
				/*if(shop.payment.momo != '') content_expand = shop.payment.momo;*/
			}
			else if(checkGateway.indexOf('alpay') > -1){
				imgGateway = img.alepay;
				alt_icon = 'Alepay';
				class_img = 'img';
				if(GVN.Cart.checkout.total_price < 5000000) {
					valid_payment = false;
				}
			}
			else if(checkGateway.indexOf('payoo') > -1){
				imgGateway = img.payoo;
				alt_icon = 'Payoo';
				class_img = 'img';
				if(GVN.Cart.checkout.total_price < 5000000) {
					valid_payment = false;
				}
			}
			else if(checkGateway.indexOf('zalopay') > -1){
				imgGateway = img.zalo_pay;
				alt_icon = 'Zalo Pay';
				class_img = 'img';
				/*if(shop.payment.zalopay != '') content_expand = shop.payment.zalopay;*/
			}
			else if(checkGateway.indexOf('chuyá»ƒn khoáº£n') > -1){
				imgGateway = img.atm;
				alt_icon = gateway.name;
				/*if(shop.payment.zalopay != '') content_expand = shop.payment.zalopay;*/
			}
			
			
			var htmlPayment = `<div class="line line-payment ${alt_icon == 'cct' && self.offCCT == true?'d-none':''}" data-name="${gateway.name}" data-id="${gateway.id}">
												<div class="radio-input">
												<input ${checked} class="input-radio" type="radio" id="radio1${ind_gate + 1}" value="${gateway.id}" name="payment-order" data-payment="${gateway.name}" `+(self.payment_method_id != null && self.payment_method_id == gateway.id?'checked':'')+`>
												</div>
												<label for="radio1${ind_gate + 1}">
												<img src="${imgGateway}" alt="">
												<span>${gateway.name}</span>
												</label>`+(content_expand != ""?`<div class="blank-slate">${content_expand}</div>`:'')+`</div>`;
			
			var hididen_class = '';
			if(gateway.name.toLowerCase().indexOf('alepay') > 0 || gateway.name.toLowerCase().indexOf('payoo') > 0){
				hididen_class = ' d-none';
				$('[data-box="installment-bank"]').attr('data-id', gateway.id);
				if(checked != ''){
					if(GVN.Cart.checkout.total_price >= 5000000) {
						$('[data-box="installment-bank"]').addClass('is-active');
						$('.section-info-installment').removeClass('d-none').addClass('is-showing');
						$('#installment-bank').removeClass('d-none');
						$('.section-info-total #checkout').html('Äáº¶T MUA TRáº¢ GÃ“P');
					}
					else{
						
					}
				}
			}
			
			
			if(gateway.name.toLowerCase().indexOf('hd saigon') > 0){
				valid_payment = false;
				hididen_class = ' d-none';
				$('[data-box="installment-company"]').attr('data-id', gateway.id);
				if(checked != ''){
					if(GVN.Cart.checkout.total_price >= 5000000) {
						$('[data-box="installment-company"]').addClass('is-active');
						//$('#installment-company').removeClass('d-none');
					}
				}
			}
			
			var htmlPayment = `<div class="item-method js-btn-payment ${hididen_class} ${checked != '' || (checked == '' && ind_gate == 0 && firstPick == 0)?'is-active':''}" ${self.payment_method_id != null && self.payment_method_id == gateway.id?'checked':''} data-box="${gateway.id}">
										<div class="left"></div>
										<div class="right">
										<div class="icon"><img class="${class_img}" src="${imgGateway}" alt="${alt_icon}"></div>
										<div class="name"><p>${gateway.name}</p></div>
										</div>
									</div>`;
			
			if(valid_payment){
				$('.section-info-method > div:eq(0) .list-method').append(htmlPayment);
			}
		});
		
		if(GVN.Cart.checkout.total_price < 5000000) {
			$('.cart-method-table.no-mrg:nth-child(2)').remove();
			$('.section-info-method > div:eq(0) .list-method .item-method:first-child').click();
		}
		
		if(firstPick == 0){
			$.ajax({
				url: '/checkouts/payment_method.js',
				type: 'POST',
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify({
					payment_method_id: payments[0].id
				}),
				success: function(result){
					$('.cart-layout').removeClass('js-loading');
					self.checkout = result.checkouts;
					$('input[name="version"]').val(result.checkouts.version);
				}
			});
		}
		
		/*
		if(self.offONLINE == false){
			$('.list-online').show();
		}
		
		if($('.line-payment').length == 1 && self.payment_method_id == null){
			$('.line-payment input[name="payment-order"]').prop('checked','checked');
		}*/
	},
	renderProvince: function(){
		var self = this;
		if(self.checkout.available_provinces == null){
			$.ajax({
				url: '/checkouts/shipping_address.js',
				type: 'post',
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify({ country_code: 'VN' }),
				async: false,
				success: function(res){
					self.checkout = res.checkouts;
				}
			});
		}
		self.checkout.available_provinces.map((province,ind_province) => {
			var checked = '';
			if(self.checkout.shipping_address.province_code != null && self.checkout.shipping_address.province_code == province.province_code) checked = ' selected';
			
			var option = `<option value="${province.province_code}" data-id="${province.id}" ${checked}>${province.province_name}</option>`;
			$('.select-province').append(option);
		});
	},
	changeProvince: function(){
		var self = this;
		$('.select-province').on('change',function(){
			/*if(self.top_shipping_infomation == 0){
				var top_shipping_infomation = $('.summary_shipping_address').offset().top + ($('.summary_shipping_address').height() - 106)/2 ;
				self.top_shipping_infomation = top_shipping_infomation;
			}
			$('.icon-loading, .icon-loading-page').find('img').css('top',self.top_shipping_infomation+'px');
			$('.icon-loading, .icon-loading-page').show();*/
			var province_code = $(this).val();
			
			if(province_code != ''){
				var dataSubmit = { 
					country_code: 'VN',
					province_code: province_code
				};
				if(!$.isEmptyObject(self.data_shipping_rate)){
					self.data_shipping_rate.country_code = 'VN';
					self.data_shipping_rate.province_code = province_code;
					delete self.data_shipping_rate.district_code;
					delete self.data_shipping_rate.ward_code;
					dataSubmit = self.data_shipping_rate;
				}
				$.ajax({
					url: '/checkouts/shipping_address.js',
					type: 'post',
					dataType: 'json',
					contentType: 'application/json',
					data: JSON.stringify(dataSubmit),
					success: function(result){
						self.checkout = result.checkouts;
					
						$('.select-district option:not(:first-child)').remove();
						$('.select-ward option:not(:first-child)').remove();
						self.checkout.available_districts.map(district => {
							var selected = '';
							if(self.checkout.shipping_address.province_code == province_code && self.checkout.shipping_address.district_code  == district.district_code)
								selected = 'selected';
							var option_district = `<option value="${district.district_code}" data-id="${district.id}" ${selected}>${district.district_name}</option>`;
							$('.select-district').append(option_district);
						});
						/*
						$('.icon-loading, .icon-loading-page').hide();
						$('.icon-loading, .icon-loading-page').find('img').css('top','');
						*/
					},
					error: function(){
						
					}
				});
			}
			else{
				$('.select-district option:not(:first-child),.select-ward option:not(:first-child)').remove();
			}
		});
	},
	changeDisitrict: function(){
		var self = this;

		$('.select-district').on('change',function(){
			/*	
			if(self.top_shipping_infomation == 0){
				var top_shipping_infomation = $('.summary_shipping_address').offset().top + ($('.summary_shipping_address').height() - 106)/2 ;
				self.top_shipping_infomation = top_shipping_infomation;
			}
			$('.icon-loading, .icon-loading-page').find('img').css('top',self.top_shipping_infomation+'px');
			$('.icon-loading, .icon-loading-page').show();
			*/
			var district_code = $(this).val(),
					province_code = $('.select-province').val();
			
			if(district_code != ''){
				var dataSubmit = { 
					country_code: 'VN',
					province_code: province_code,
					district_code: district_code,
					ward_code: ''
				};
				if(!$.isEmptyObject(self.data_shipping_rate)){
					self.data_shipping_rate.country_code = 'VN';
					self.data_shipping_rate.province_code = province_code;
					self.data_shipping_rate.district_code = district_code;
					self.data_shipping_rate.ward_code= '';
					dataSubmit = self.data_shipping_rate;
				}
				$('.select-ward').html(`<option value="">Chá»n PhÆ°á»ng, XÃ£</option>`)
				$.ajax({
					url: '/checkouts/shipping_address.js',
					type: 'post',
					dataType: 'json',
					contentType: 'application/json',
					data: JSON.stringify(dataSubmit),
					success: function(result){
						self.checkout = result.checkouts;
						self.checkout.available_wards.map(ward => {
						
							var option_ward = `<option value="${ward.ward_code}" data-id="${ward.id}">${ward.ward_name}</option>`;
							$('.select-ward').append(option_ward);
						});
						/*$('.icon-loading, .icon-loading-page').hide();*/
					},
					error: function(){
						
					}
				});
			}
			else{
				$('.select-ward option:not(:first-child)').remove();
			}
		});
	},
	changeWard: function(){
		var self = this;
		
		$('.select-ward').on('change',function(){
			var district_code = $('.select-district').val(),
					province_code = $('.select-province').val(),
					ward_code = $('.select-ward').val();
			
			var dataSubmit = { 
				country_code: 'VN',
				province_code: province_code,
				district_code: district_code,
				ward_code: ward_code
			};
			
			if(!$.isEmptyObject(self.data_shipping_rate)){
				self.data_shipping_rate.country_code = 'VN';
				self.data_shipping_rate.province_code = province_code;
				self.data_shipping_rate.district_code = district_code;
				self.data_shipping_rate.ward_code= ward_code;
				dataSubmit = self.data_shipping_rate;
			}

			$.ajax({
				url: '/checkouts/shipping_address.js',
				type: 'post',
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify(dataSubmit),
				success: function(result){
					self.checkout = result.checkouts;
				}
			});
		});
	},
	renderShippingMethod: function(callback){
		var self = this;
		if(self.checkout.available_shipping_rates != null){
			$('.section-info-shipping-rate .list-method').html('');
			if( self.checkout.available_shipping_rates.length > 1 ){
				self.checkout.available_shipping_rates.map((shr,iShr) => {
					var checked = '';
					if(self.checkout.shipping_rate_id != null && self.checkout.shipping_rate_id == shr.id) checked = 'checked';

					var option = `<div class="line-method">
													<div class="radio-input">
														<input ${checked} type="radio" value="${shr.id}" data-price="${shr.shipping_price}" id="radio_delivery_${iShr}" name="delivery-order-pr" class="input-radio"/>
													</div>
													<label for="radio_delivery_${iShr}" class="padding-0">
														<div class="name">${shr.name} (${GVN.Helper.moneyFormat(shr.shipping_price,'â‚«')})</div>
													</label>
												</div>`;
					$('.section-info-shipping-rate .list-method').append(option);
				});
				if(typeof callback === 'function') return callback();
				//$('.section-info-shipping-rate').removeClass('d-none');
			}
			else{
				var shippingId = self.checkout.available_shipping_rates[0].id;
				$.ajax({
					url: '/checkouts/shipping_rate.js',
					type: 'POST',
					dataType: 'json',
					contentType: 'application/json',
					data: JSON.stringify({
						shipping_rate_id: shippingId
					}),
					success: function(result){
						self.checkout = result.checkouts;
						if (self.checkout.shipping_price > 0) {
							$('.summary-shipping .shipprice').html(GVN.Helper.moneyFormat(self.checkout.shipping_price,'â‚«'));
						}
						else {
							$('.summary-shipping .shipprice').html('Miá»…n phÃ­');
						}
						$('.summary-total .totalprice').html(GVN.Helper.moneyFormat(self.checkout.total_price,'â‚«'));
						
						$('input[name="version"]').val(result.checkouts.version);
						
						if(typeof callback === 'function') return callback();
					}
				});
			}
		}
	},
	pickeAtStore: function(){
		$('input[name="method"]').on('change',function(){
			var option = $(this).val();
			if(option == 'Nháº­n hÃ ng táº¡i Showroom'){
				if($(this).hasClass('empty')){
					$('.btn-checkout[data-box="cart-payment-order-box"]').addClass('disabled').attr('disabled',true);
				}
				$('#cod-method-form').addClass('d-none').removeClass('d-flex');
				$('#pickup-method-form').removeClass('d-none').addClass('d-flex');
			}
			else{
				$('.btn-checkout[data-box="cart-payment-order-box"]').removeClass('disabled').removeAttr('disabled');
				$('#cod-method-form').removeClass('d-none').addClass('d-flex');
				$('#pickup-method-form').addClass('d-none').removeClass('d-flex');
			}
		});
	},
	submitFormShippingInfo: function(callback1){
		var self = this;
		function validateEmpty(value,target){
			if(value.trim() == ''){
				target.parent().addClass('error');
			}
			else{
				target.parent().removeClass('error');
			}
			return value.trim() == ''?false:true;
		}
		function validateEmail(email,target){
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if(!re.test(email)){
				target.parent().addClass('error');
				target.siblings('label').attr('title','Email khÃ´ng Ä‘Ãºng Ä‘á»‹nh dáº¡ng');
			}
			else{
				target.parent().removeClass('error');
				target.siblings('label').attr('title','Vui lÃ²ng nháº­p Email');
			}
			return re.test(email);
		}
		function validatePhone(phone,target){
			var re = /(^0[2-9]\d{8}$)|(^01\d{9}$)/;
			if(!re.test(phone)){
				target.parent().addClass('error');
				target.siblings('label').attr('title','Sá»‘ Ä‘iá»‡n thoáº¡i khÃ´ng Ä‘Ãºng Ä‘á»‹nh dáº¡ng');
			}
			else{
				target.parent().removeClass('error');
				target.siblings('label').attr('title','Vui lÃ²ng nháº­p Sá»‘ Ä‘iá»‡n thoáº¡i');
			}
			return re.test(phone);   
		}
		var full_name = $('#form-edit').find('input[name="editcustomer[name]"]').val(),
				email = $('#form-edit').find('input[name="editcustomer[email]"]').val(),
				phone = $('#form-edit').find('input[name="editcustomer[phone]"]').val(),
				address = $('#form-edit').find('input[name="editcustomer[address]"]').val(),
				province_code = $('#form-edit').find('select.select-province').val(),
				district_code = $('#form-edit').find('select.select-district').val(),
				ward_code = $('#form-edit').find('select.select-ward').val();
			
		var	province_name = $('#form-edit').find('select.select-province option[value="'+province_code+'"]').html(),
				district_name = $('#form-edit').find('select.select-district option[value="'+district_code+'"]').html(),
				ward_name = $('#form-edit').find('select.select-ward option[value="'+ward_code+'"]').html();
		
		var invoice_form = $('.bill-field'),
				invoice_company = invoice_form.find('input[name="attributes[bill_order_company]"]').val(),
				invoice_email = invoice_form.find('input[name="attributes[bill_email]"]').val(),
				invoice_tax = invoice_form.find('input[name="attributes[bill_order_tax_code]"]').val(),
				invoice_address = invoice_form.find('input[name="attributes[bill_order_address]"]').val();
			
		let empty1 = validateEmpty(full_name,$('input[name="editcustomer[name]"]'));
		let empty2 = validateEmpty(email,$('input[name="editcustomer[email]"]'));
		let empty3 = validateEmpty(phone,$('input[name="editcustomer[phone]"]'));
		let empty4 = validateEmpty(address,$('input[name="editcustomer[address]"]'));
		let empty5 = validateEmpty(province_code,$('select.select-province'));
		let empty6 = validateEmpty(district_code,$('select.select-district'));
		let empty7 = validateEmpty(ward_code,$('select.select-ward'));
		let empty8 = true;

		var invoiceCheck = false;
		if($('#checkbox-bill').is(':checked')){
			invoiceCheck = true;
		}
		
		var attributes = cartJS.attributes || {};
		if (invoiceCheck){
			validateEmpty(invoice_company,$('input[name="attributes[bill_order_company]"]'));
			validateEmpty(invoice_email,$('input[name="attributes[bill_email]"]'));
			validateEmpty(invoice_tax,$('input[name="attributes[bill_order_tax_code]"]'));
			validateEmpty(invoice_address,$('input[name="attributes[bill_order_address]"]'));			
			if ($('.invoice-box .error').length > 0) empty8 = false;
			else{
				attributes['order_vat_invoice'] = 'CÃ³';
				attributes['bill_order_company'] = invoice_company;
				attributes['bill_email'] = invoice_email;
				attributes['bill_order_tax_code'] = invoice_tax;
				attributes['bill_order_address'] = invoice_address;
			}
		}
		else {
			$('.invoice-box .form__input-wrapper').removeClass('error');
			attributes['order_vat_invoice'] = 'KhÃ´ng';
			attributes['bill_order_company'] = '';
			attributes['bill_email'] = '';
			attributes['bill_order_tax_code'] = '';
			attributes['bill_order_address'] = '';
		}
		
		if(empty8){
			$.ajax({
				type: 'post',
				url: '/cart/update.js', 
				data: {attributes: attributes, note: (typeof $('.cart-note').val() !== 'undefined' && $('.cart-note').val().length > 0) ? $('.cart-note').val() : null}, 
				success: function(response){
					GVN.Global.cartJS();
					//GVN.Helper.SwalWarning('ThÃ´ng bÃ¡o','ÄÃ£ lÆ°u thÃ´ng tin hÃ³a Ä‘Æ¡n cho Ä‘Æ¡n hÃ ng','success',false,false,2000);
				}
			});
		}
		
		var method_get = $('input[name="method"]:checked').val();

		if(method_get == 'Giao hÃ ng táº­n nÆ¡i'){
			if(empty1 && empty3 && empty4 && empty5 && empty6 && empty7 && empty8){ //&& empty2: Náº¿u báº¯t buá»™c cÃ³ email thÃ¬ thÃªm vÃ o if 
				/*let checkEmail = validateEmail(email,$('input[name="editcustomer[email]"]'));*/
				let checkPhone = validatePhone(phone,$('input[name="editcustomer[phone]"]'));
				if(checkPhone){//checkEmail && : Náº¿u báº¯t buá»™c cÃ³ email thÃ¬ thÃªm vÃ o if
					$('.icon-loading').show();

					$.when(
						$.ajax({
						url: '/checkouts/shipping_address.js',
						type: 'post',
						dataType: 'json',
						contentType: 'application/json',
						data: JSON.stringify({ 
							full_name: full_name,
							email: email,
							phone: phone,
							address: address,
							country_code: 'VN',
							province_code: province_code,
							district_code: district_code,
							ward_code: ward_code
						}),
						success: function(result){
							GVN.GA4.fillCustomerInfo(email,phone);
						},
						error: function(){

						}	
					}),
						$.ajax({
						url: '/checkouts/pickup_loc.js',
						type: 'post',
						dataType: 'json',
						contentType: 'application/json',
						data: JSON.stringify({ 
							location_id: 0
						}),
						success: function(result){},
						error: function(){}
					})).then(function(rs1,rs2){
						
						self.checkout = rs1[0].checkouts;
						self.checkout.location_id = rs2[0].checkouts.location_id;
						
						if(self.checkout.available_shipping_rates != null){
							self.renderShippingMethod(function(){
								$('.order-table .line:eq(1) .right p').html(GVN.Cart.checkout.shipping_address.full_name);
								$('.order-table .line:eq(2) .right p').html(GVN.Cart.checkout.shipping_address.phone);
								$('.order-table .line:eq(3) .right p').html(GVN.Cart.checkout.shipping_address.email);

								if(GVN.Cart.checkout.total_price < 5000000) {
									$('.cart-method-table.no-mrg:nth-child(2)').remove();
								}
								else{
                  if($('#option-prepay option.option_total').length > 0) $('#option-prepay option.option_total').remove();
									$('#option-prepay').append('<option class="option_total" selected value="'+GVN.Cart.checkout.total_price+'">Tráº£ gÃ³p: '+GVN.Helper.moneyFormat(GVN.Cart.checkout.total_price,'â‚«')+'</option>')
								}
								
								let address = GVN.Cart.checkout.shipping_address.address;
								if(GVN.Cart.checkout.shipping_address.ward_name != null) address += ', ' + GVN.Cart.checkout.shipping_address.ward_name;
								if(GVN.Cart.checkout.shipping_address.district_name != null) address += ', ' + GVN.Cart.checkout.shipping_address.district_name;
								if(GVN.Cart.checkout.shipping_address.province_name != null) address += ', ' + GVN.Cart.checkout.shipping_address.province_name;

								$('.order-table .line:eq(4) .right p').html(address);
								$('.order-table .line:eq(5) .right p').html('<strong>'+GVN.Helper.moneyFormat(GVN.Cart.checkout.subtotal_price_original,'â‚«')+'</strong>');
								if(GVN.Cart.checkout.shipping_price > 0){
									$('.order-table .line:eq(6) .right p').html('<strong>'+GVN.Helper.moneyFormat(GVN.Cart.checkout.shipping_price,'â‚«')+'</strong>');
								}
								else{
									$('.order-table .line:eq(6) .right p').html('<strong>Miá»…n phÃ­</strong>');
								}

								if(GVN.Cart.checkout.discount > 0){
									$('.order-table .line:eq(7) .right p').html('<strong>-'+GVN.Helper.moneyFormat(GVN.Cart.checkout.discount,'â‚«')+'</strong>');
									$('.order-table .line:eq(7)').removeClass('d-none');
								}
								else{
									$('.order-table .line:eq(7)').addClass('d-none').find('.right p').html('');
								}

								$('.order-table .line:eq(8) .right p').html('<strong>'+GVN.Helper.moneyFormat(GVN.Cart.checkout.total_price,'â‚«')+'</strong>');
								$('#installment-bank .line[data-pricepr]').html(GVN.Helper.moneyFormat(GVN.Cart.checkout.total_price,'â‚«'));

								if(typeof callback1 === 'function') return callback1();
							});
						}
						else{
							if(typeof callback1 === 'function') return callback1();
						}
					});
				}
			}
			else {
				if(empty3){
					let checkPhone = validatePhone(phone,$('input[name="editcustomer[phone]"]'));
				}
				else {
					GVN.GA4.fillCustomerInfo('','');
				}
				/*
				if(empty2){
					let checkEmail = validateEmail(email,$('input[name="editcustomer[email]"]'));
				}
				*/
			}
		}
		else{
			if(empty1 && empty3){
				var id_store = $('#list-available-stores input:checked').val();
				let checkPhone = validatePhone(phone,$('input[name="editcustomer[phone]"]'));
				if(checkPhone){
					
					if($('#list-available-stores li').length > 0){
						$('.icon-loading').show();

						$.when($.ajax({
							url: '/checkouts/shipping_address.js',
							type: 'post',
							dataType: 'json',
							contentType: 'application/json',
							data: JSON.stringify({ 
								full_name: full_name,
								phone: phone
							}),
							success: function(result){
								GVN.GA4.fillCustomerInfo(email,phone);
							},
							error: function(){

							}	
						}),$.ajax({
							url: '/checkouts/pickup_loc.js',
							type: 'post',
							dataType: 'json',
							contentType: 'application/json',
							data: JSON.stringify({ 
								location_id: id_store
							}),
							success: function(result){
							},
							error: function(){

							}
						})).then(function(rs1,rs2){
							self.checkout = rs1[0].checkouts;

							$('.order-table .line:eq(1) .right p').html(GVN.Cart.checkout.shipping_address.full_name);
							$('.order-table .line:eq(2) .right p').html(GVN.Cart.checkout.shipping_address.phone);

							self.checkout.location_id = rs2[0].checkouts.location_id;
							
							let address = $('#list-available-stores li input:checked + label').html();
							$('.order-table .line:eq(4) .right p').html(address);
							$('.order-table .line:eq(5) .right p').html('<strong>'+GVN.Helper.moneyFormat(GVN.Cart.checkout.subtotal_price_original,'â‚«')+'</strong>');
							$('.order-table .line:eq(6) .right p').html('<strong>Miá»…n phÃ­</strong>');

							if(GVN.Cart.checkout.discount > 0){
								$('.order-table .line:eq(7) .right p').html('<strong>-'+GVN.Helper.moneyFormat(GVN.Cart.checkout.discount,'â‚«')+'</strong>');
								$('.order-table .line:eq(7)').removeClass('d-none');
							}
							else{
								$('.order-table .line:eq(7)').addClass('d-none').find('.right p').html('');
							}
							
							if(GVN.Cart.checkout.total_price < 5000000) {
								$('.cart-method-table.no-mrg').remove();
							}
							else{
								if($('#option-prepay option.option_total').length > 0) $('#option-prepay option.option_total').remove();
								$('#option-prepay').append('<option class="option_total" value="'+GVN.Cart.checkout.total_price+'">Tráº£ gÃ³p: '+GVN.Helper.moneyFormat(GVN.Cart.checkout.total_price,'â‚«')+'</option>')
							}

							$('.order-table .line:eq(8) .right p').html('<strong>'+GVN.Helper.moneyFormat(GVN.Cart.checkout.total_price,'â‚«')+'</strong>');
							$('#installment-bank .line[data-pricepr]').html(GVN.Helper.moneyFormat(GVN.Cart.checkout.total_price,'â‚«'));

							if(typeof callback1 === 'function') return callback1();
						});
					}
					else{
						if($('.select-province-pickup').val() == '') $('.select-province-pickup').parents('.select-group').addClass('error');
						if($('.select-district-pickup').val() == '') $('.select-district-pickup').parents('.select-group').addClass('error');
					}
				}
			}
			else{
				if(empty3){
					let checkPhone = validatePhone(phone,$('input[name="editcustomer[phone]"]'));
				}
				else {
					GVN.GA4.fillCustomerInfo('','');
				}
			}
		}
		
	},
	changePaymentAndShipping: function(){
		var self = this;
		//update phÆ°Æ¡ng thá»©c thanh toÃ¡n
		$('body').on('click', '.js-btn-payment', function(e){
			e.preventDefault();
			
			$('.cart-method-table .js-btn-payment').removeClass('is-active');
			$(this).addClass('is-active');
			let id_payment = Number($(this).attr('data-box'));
			$('.cart-layout').addClass('js-loading');
			
			if(!$(this).hasClass('d-none')){
				$('.js-btn-installment').removeClass('is-active');
			}
			
			$.ajax({
				url: '/checkouts/payment_method.js',
				type: 'POST',
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify({
					payment_method_id: id_payment
				}),
				success: function(result){
					$('.cart-layout').removeClass('js-loading');
					self.checkout = result.checkouts;
					$('input[name="version"]').val(result.checkouts.version);
					
				}
			});
		});
		
		//update phÆ°Æ¡ng thá»©c váº­n chuyá»ƒn
		$(document).on('change','.section-info-shipping-rate input',function(){
			$('.cart-layout').addClass('js-loading');
			var shippingId = Number($('.section-info-shipping-rate input:checked').val());
			$.ajax({
				url: '/checkouts/shipping_rate.js',
				type: 'POST',
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify({
					shipping_rate_id: shippingId
				}),
				success: function(result){
					self.checkout = result.checkouts;
					/*$('.fee-shipping .sub-total-ship').html(GVN.Helper.moneyFormat(self.checkout.shipping_price,'â‚«'));
					$('.main-total-price b').html(GVN.Helper.moneyFormat(self.checkout.total_price,'â‚«'));*/
					$('input[name="version"]').val(result.checkouts.version);
					$('.cart-layout').removeClass('js-loading');
				}
			});
		})
	},
	processInstallment: function(value){
		var self = this;
		
		$('.item-bank').on('click',function(){
			$('.item-bank').removeClass('is-selected');
			$(this).addClass('is-selected');
			self.calculateInstallment();
			$( ".js-btn-installment-select" ).trigger( "click" );
		});
		
		$('.installment-step.step-3 select').on('change',function(){
			self.calculateInstallment();
			$( ".js-btn-installment-select" ).trigger( "click" );
		});
		
		$('.js-btn-installment-option').on('click',function(e){
			e.preventDefault();

			var month = $(this).attr('data-option');
			var target = $('.installment-table.table-option');
			target.find('.title-table h4').html($('.installment-table.table-full .title-table h4').html());
			target.find('.coll-body [data-month]').html(month+' thÃ¡ng');
			target.find('.coll-body [data-itm-lv]').html($('#'+month+'-month [data-itm-lv]').html());
			target.find('.coll-body [data-itm-month]').html($('#'+month+'-month [data-itm-month]').html());
			target.find('.coll-body [data-itm-total]').html($('#'+month+'-month [data-itm-total]').html());
			target.find('.coll-body [data-itm-gap]').html($('#'+month+'-month [data-itm-gap]').html());
			target.find('.coll-body [data-prepay]').html($('#'+month+'-month [data-prepay]').html());
			
			target.removeClass('d-none');
			$('.installment-table.table-full').addClass('d-none');
		});
		
		$('.js-btn-installment-select').on('click',function(e){
			e.preventDefault();
			$('.installment-table.table-full').removeClass('d-none');
			$('.installment-table.table-option').addClass('d-none');
		});
	},
	changeInstallment: function(){
		$('body').on('click', '.js-btn-month', function(e){
			e.preventDefault();
			$('.choice-month .item-month label').removeClass('sd');
			$(this).find('label').addClass('sd');
		});
		
		$('body').on('click', '.js-btn-installment-select', function(e){
			e.preventDefault();
			$('.installment-table.table-option').addClass('d-none');
			$('.installment-table.table-full').removeClass('d-none');
		});
		
		$('body').on('click', '.js-btn-installment-option', function(e){
			e.preventDefault();
			var option = $(this).attr('data-option');
			$('.installment-table.table-full').addClass('d-none');
			$('.installment-table.table-option').removeClass('d-none');
		});
	},
	addInfoOrder: function(method){
		var dt = new Date();
		var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();

		var currentdate = new Date(); 
		var time = (currentdate.getHours() + 1) + ":"  + currentdate.getMinutes();
		var date = currentdate.getDate() + "/" + (currentdate.getMonth()+1)  + "/"  + currentdate.getFullYear();

		if (cartJS != null) {
			cartJS.attributes.order_type = 'BÃ¡n má»›i';
			cartJS.attributes.order_return_type = ' ';
			cartJS.attributes.order_technical_deploy = 'KhÃ´ng';
			cartJS.attributes.order_installation_requirements = 'KhÃ´ng';
			cartJS.attributes.order_pos_machine = 'KhÃ´ng';
			cartJS.attributes.order_delivery_date = date;
			cartJS.attributes.order_delivery_time = time;
			if (method == 'Giao hÃ ng táº­n nÆ¡i') {
				cartJS.attributes.order_delivery_method = 'BÃ¡n giao hÃ ng';
			}
			else {
				cartJS.attributes.order_delivery_method = 'BÃ¡n táº¡i quáº§y';
			}

			$.ajax({
				url: '/cart/update.js',
				type: 'POST',
				data: {
					attributes: cartJS.attributes,
					note: (typeof $('.cart-note').val() !== 'undefined' && $('.cart-note').val().length > 0) ? $('.cart-note').val() : null
				},
				success: function(data){},
				error: function(){}
			});
		}
	},
	submitCheckout: function(){
		function updateNote(data,callback){
			$.ajax({
				url: '/checkouts/note.js',
				type: 'POST',
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify({
					note: data
				}),
				success: function(result){
					if(typeof callback === 'function'){
						return callback(result);
					}
				}
			});
		}
		$(document).on('click','#checkout',function(){
			$('.cart-layout').addClass('js-loading');
			var note = $('#note').val();
			var methodShip = $('input[name="method"]:checked').val();
			var methodPay = $('.js-btn-payment.is-active .right .name p').html();

			GVN.Cart.addInfoOrder(methodShip);
			GVN.GA4.eventPayment(methodPay)
			updateNote(note, function(response){
				setTimeout(function(){
					$.ajax({
						url: "/checkouts/complete",
						type: 'POST',
						data: $('#step_final form').serialize(),
						async: false,
						success: function(data){
							if(data.error == true){
								$('#cart-page').removeClass('js-loading');
								var error = '';
								$.each(result.responseJSON.error_messages,function(key,textError){
									if(error == ''){
										$('.summary-action--notify').html(textError).removeClass('d-none');
									}
									error = textError;
								});
							}
							else{
								$('.cart-layout').removeClass('js-loading');
								if(data.checkouts.payment_url != null){
									window.location.href = data.checkouts.payment_url
								}
							}
						},
						error: function(result) {
							$('#cart-page').removeClass('js-loading');
							var error = '';
							$.each(result.responseJSON.error_messages,function(key,textError){
								if(error == ''){
									$('.summary-action--notify').html(textError).removeClass('d-none');
								}
								error = textError;
							});
						}
					});
				},500);
			});
		});
	},
	calculateInstallment: function(){
		var bank = $('.installment-step.step-1 .is-selected img').attr('alt');
		var card = $('.installment-step.step-2 .is-selected img').attr('alt');
		var value_3 = $('.installment-step.step-1 .is-selected').attr('data-rate-3');
		var value_6 = $('.installment-step.step-1 .is-selected').attr('data-rate-6');
		var value_9 = $('.installment-step.step-1 .is-selected').attr('data-rate-9');
		var value_12 = $('.installment-step.step-1 .is-selected').attr('data-rate-12');
		
		$('.installment-table.table-full .title-table h4').html('Tráº£ gÃ³p qua tháº» '+card+', ngÃ¢n hÃ ng '+bank);
		
		function value_of_month(month,value_month){
			if(value_month != undefined && value_month != ''){
				var money_tragop = Number($('#option-prepay').val());
				var money_total = GVN.Cart.checkout.total_price;
				var money_pay_receive = money_total - money_tragop <= 0? 0 : money_total - money_tragop;

				var money_total_tragop = parseInt(money_tragop / (1 - (Number(value_month) * 0.01)));
				var money_month_tragop = parseInt(money_total_tragop / month);
				var money_compare = money_total_tragop - money_tragop;
				$('#'+month+'-month div[data-itm-lv]').html(GVN.Helper.moneyFormat(money_tragop,'â‚«'));
				$('#'+month+'-month div[data-itm-month]').html(GVN.Helper.moneyFormat(money_month_tragop,'â‚«'));
				$('#'+month+'-month div[data-itm-total]').html(GVN.Helper.moneyFormat(money_total_tragop,'â‚«'));
				$('#'+month+'-month div[data-itm-gap]').html(GVN.Helper.moneyFormat(money_compare,'â‚«'));
				$('#'+month+'-month div[data-prepay]').html(GVN.Helper.moneyFormat(money_pay_receive,'â‚«'));
				$('#'+month+'-month div.foot .button').removeClass('d-none');
			}
			else{
				$('#'+month+'-month div[data-itm-lv]').html('-');
				$('#'+month+'-month div[data-itm-month]').html('-');
				$('#'+month+'-month div[data-itm-total]').html('-');
				$('#'+month+'-month div[data-itm-gap]').html('-');
				$('#'+month+'-month div[data-prepay]').html('-');
				$('#'+month+'-month div.foot .button').addClass('d-none');
			}
		}
		
		value_of_month(3,value_3);
		value_of_month(6,value_6);
		value_of_month(9,value_9);
		value_of_month(12,value_12);
	}
}
GVN.Customers = {
	dataOrderGiftPE: {},
	dataOrderDiscountPE: {},
	totalPageOrder: 0,
	isSendAgain: false,
	init: function(){
		var that = this;
		if(window.shop.template === 'customers[account].wishlist'){
			that.favorites();
			
		}
		if(window.shop.template.indexOf('login') !== -1){
			that.initLogin();
		}
		if(window.shop.template.indexOf('register') !== -1){
			GVN.Helper.inputTypeDate();
			that.initRegister();
		}
		if(window.shop.template === 'customers[account]'){
			that.initAccount.init();
			that.initViewed();
			that.initAddresses.init();
			that.ordersHistory();
			GVN.Helper.inputTypeDate();
			GVN.Helper.viewedProduct();
			GVN.Helper.pickItem();
		}
		if(window.shop.template === 'customers[order]'){
			that.initOrderDetail();
		}
	},
	initLogin: function(){},
	initRegister: function(){},
	initAccount: {
		init: function(){
			var that = this;
			that.changeTab();
			that.vertifyPhone();
			that.sendCodeVertify();
			that.updateAccount();
			GVN.Global.customOTPAcc();
		},
		changeTab: function(){
			var $tabbedNav = $('.tabbed-nav');
			var $contentContainer = $('.tab-content-container');
			var $url = window.location.href;
			
			$tabbedNav.on('click', '.tab', function(e) { 
				var tabId = $(this).attr('data-tab'); 
				$tabbedNav.children('.tab').removeClass('current'); 
				$contentContainer.children().filter('.current').removeClass('current').css('display', '');
				$(this).addClass('current');
				$('#' + tabId).addClass('is-animating').fadeIn(600, function() {
					$(this).addClass('current').removeClass('is-animating').css('display', '');
				});	

				if(e.target != e.currentTarget){
					e.preventDefault();
					var data = $(this).attr('data-tab');
					var urlNew = "#" + data ;
					history.pushState(data, null, urlNew);
				}
				e.stopPropagation();
			});
			
			if (window.location.hash) { 
				$('[data-tab=' + window.location.hash.slice(1) + ']').trigger('click');
				$('[data-tab=' + window.location.hash.slice(1) + ']').addClass('current');
				$('#' + window.location.hash.slice(1)).addClass('current');
			}
			else {
				$tabbedNav.children('.tab').eq(0).trigger('click').addClass('current');
			}
		},
		countDownOtp: function() {
			let MinutesLimit = 60 * 5;	
			let timer =  setInterval(function () {
				minutes = parseInt(MinutesLimit / 60, 10);
				seconds = parseInt(MinutesLimit % 60, 10);

				minutes = minutes < 10 ? "0" + minutes : minutes;
				seconds = seconds < 10 ? "0" + seconds : seconds;

				$('.count-time').html(minutes + " phÃºt " + seconds + " giÃ¢y");

				if (--MinutesLimit < 0) {
					clearInterval(timer);
					$('#send_again').removeClass('disable');
					GVN.Customers.isSendAgain = true;
				}
			}, 1000);
		},
		RequestOTP: function(phone){
			grecaptcha.ready(function() {
				grecaptcha.execute('6LcNnbMmAAAAAFpQRrHEZoNe95dJ2pcgabN7tHL1', {action: 'submit'}).then(function(token) {
					var data2 = {
						"recaptcha_token": token,
						"owner_type": "CUSTOMER",
						"owner_key": accountJS.id,
						"phone": phone
					};
					$.ajax({
						url: window.shop_app.apiRequestVerify,
						type: 'POST',
						data: data2,
						header:{
							"Content-Type": "application/json"
						},
						dataType: 'JSON',
						success: function(result2){
							console.log(result2);
							$('#modal-otp').modal();
						}
					});
				});
			});
		},
		vertifyPhone: function(){
			$('body').on('click', '#customer_update_form a.js-vertify', function(e){
				e.preventDefault();
				var phone = $('#customer_update_form').find('input[name="phone"]').val();
				if (phone.length > 0) {
					var data = {
						"owner_type": "CUSTOMER",
						"owner_key": accountJS.id,
						"phone": phone
					};
					$.ajax({
						url: window.shop_app.apiCheckPhone,
						type: 'POST',
						data: JSON.stringify(data),
						contentType: 'application/json',
						dataType: 'JSON',
						success: function(result){
							if(result.data.is_verified == false){
								$('.number-phone b').html(phone);
								GVN.Customers.isSendAgain = false;
								GVN.Customers.initAccount.countDownOtp();
								GVN.Customers.initAccount.RequestOTP(phone);
							}
						}
					});
				}
				else {
					$('#customer_update_form').find('input[name="phone"]').parents('.form__input-wrapper').addClass('error');
				}
			});
		},
		sendCodeVertify: function(){
			$('body').on('click', '#form_otp .btn-confirm', function(e){
				e.preventDefault();
				var phone = $('#customer_update_form').find('input[name="phone"]').val();
				var code =  $('#form_otp #otp_code').val();
				var data = {
					"owner_type": "CUSTOMER",
					"owner_key": accountJS.id,
					"phone": phone,
					"otp_code": code
				};
				$.ajax({
					url: window.shop_app.apiVerifyCode,
					type: 'POST',
					data: JSON.stringify(data),
					contentType: 'application/json',
					dataType: 'JSON',
					success: function(result){
						if (result.success == true && result.data.is_valid == false){
							$('#modal-otp').modal('hide');
							$('#form_otp #otp_code').val('');
							$('.form-digit-group input').val('');
							GVN.Helper.SwalWarning('ThÃ´ng bÃ¡o','MÃ£ xÃ¡c thá»±c khÃ´ng há»£p lá»‡','error',false,false,3000);
						}
						else {
							$('#customer_update_form').find('input[name="phone"]').parents('.form__input-wrapper').removeClass('error');
							$('#customer_update_form .js-vertify').addClass('d-none');
							$('#customer_update_form .vertified').removeClass('d-none');
							$('.btn-update').removeClass('disabled').prop('disabled', false);
							$('#modal-otp').modal('hide');
						}
					}
				});
			});
			$('#form_otp #send_again').on('click',function(e){
				e.preventDefault();
				if (GVN.Customers.isSendAgain) {
					$('#customer_update_form a.js-vertify').trigger('click');
				}
			});
		},
		updateAccount: function(){
			$('body').on('click', '#customer_update_form a.js-change', function(e){
				e.preventDefault();
				let type = $(this).attr('data-change');
				$(this).addClass('d-none');
				$(this).parents('.form__input-wrapper').find('.hidden-half-text').addClass('d-none');
				$('#customer_update_form input#'+type).removeClass('d-none');
				if (type == 'phone'){
					$('.js-vertify').removeClass('d-none');
					$('.btn-update').addClass('disabled').attr('disabled','disabled');
				}
			});
			$('#customer_update_form').submit(function(e){
				e.preventDefault();
				var fullName = $(this).find('input[name="fullname"]').val().split(' '),
						last_name = fullName[0],
						first_name = fullName.slice(1,fullName.length).join(' '),
						email = $('#customer_update_form').find('input[name="email"]').val(),
						gender = $('#customer_update_form').find('[name="gender"]:checked').val(),
						day = $('#customer_update_form').find('select[name="day"]').val(), // NgÃ y
						month = $('#customer_update_form').find('select[name="month"]').val(), // ThÃ¡ng
						year = $('#customer_update_form').find('select[name="year"]').val(), // NÄƒm
						birthday = year + '-' + month + '-' + day, // NgÃ y-ThÃ¡ng-NÄƒm
						phone = $('#customer_update_form').find('input[name="phone"]').val();

				var allowSubmit = true;

				//Kiá»ƒm tra Ä‘Ãºng Ä‘á»‹nh dáº¡ng
				if(!GVN.Helper.checkemail(email)){
					$('#customer_update_form').find('input[name="email"]').parents('.form__input-wrapper').addClass('error');
					allowSubmit = false;
				}
				else $('#customer_update_form').find('input[name="email"]').parents('.form__input-wrapper').removeClass('error');

				if(!GVN.Helper.checkPhone(phone)){
					$('#customer_update_form').find('input[name="phone"]').parents('.form__input-wrapper').addClass('error');
					allowSubmit = false;
				}
				else $('#customer_update_form').find('input[name="phone"]').parents('.form__input-wrapper').removeClass('error');

				if(allowSubmit){
					var data = {
						"email": email,
						"phone": phone,
						"first_name": first_name,
						"last_name": last_name,
						"accepts_marketing": false,
						"gender": parseInt(gender),
						"birthday": birthday+"T17:00:00.000Z"
					};
					$.ajax({
						url: '/apps/gvnes/auth/api/customers/update',
						type: 'POST',
						data: JSON.stringify(data),
						contentType: 'application/json',
						dataType: 'JSON',
						success: function(data){
							if(data.error){
								GVN.Helper.SwalWarning(data.message,'Vui lÃ²ng kiá»ƒm tra láº¡i thÃ´ng tin!','warning',false,false,4000);
							}
							else{
								Swal.fire({
									title: '',
									text: 'TÃ i khoáº£n Ä‘Ã£ Ä‘Æ°á»£c cáº­p nháº­t thÃ nh cÃ´ng!',
									icon: 'success',
									showCancelButton: false,
									showConfirmButton: false,
									timer: 3000,
								}).then((result) => {
									window.location.reload(); 
								})
							}
						}
					});
				}
			});
		},
	},
	initViewed: function(){
		var phand = [];
		var ptype = [];
		/* XoÃ¡ data cÅ© báº¯t Ä‘áº§u láº¡i tá»« Ä‘áº§u vá»›i viá»‡c cháº·n add vÃ o ds Ä‘Ã£ xem ngay tá»« Ä‘áº§u */
		if(localStorage.getItem('viewed_new') == null){
			Cookies.remove('last_viewed_products');
			Cookies.remove('last_viewed_products_type');
			localStorage.setItem('viewed_new',1);
		}
		let unShow = ['QuÃ  Táº·ng KhÃ´ng BÃ¡n','Combo áº¨n','DISCON','Táº M Háº¾T HÃ€NG'];
		if(!unShow.includes(window.shop.product.type)){
			if(document.cookie.indexOf('last_viewed_products') !== -1){
				var las = Cookies.getJSON('last_viewed_products');
				var lasType = Cookies.getJSON('last_viewed_products_type');
				if($.inArray(window.shop.product.handle, las) === -1){
					phand = [window.shop.product.handle];
					ptype = [window.shop.product.type];
					for(var i = 0; i < las.length; i++){
						phand.push(las[i]);
						ptype.push(lasType[i]);
						if(phand.length > 15){
							break;
						}
					}
					Cookies.set('last_viewed_products', phand, { expires: 180 });
					Cookies.set('last_viewed_products_type', ptype, { expires: 180 });
				}
			}
			else{
				phand = [window.shop.product.handle];
				ptype = [window.shop.product.type];
				Cookies.set('last_viewed_products', phand, { expires: 180 });
				Cookies.set('last_viewed_products_type', ptype, { expires: 180 });
			}
		}
	},
	favorites: function(){
		GVN.Helper.listFavorites(function(payload){
			var pros = [];
			if(payload.total > 0){
				$.each(payload.data, function(i, v){
					if(typeof v.product_handle === 'string' && v.product_handle.length > 0){
						var promise = new Promise(function(resolve, reject) {
							$.ajax({
								url:'/products/'+v.product_handle+'?view=item',
								success: function(product){
									resolve(product);
								},
								error: function(err){
									resolve('');
								}
							})
						});
						pros.push(promise);
					}
				})
				Promise.all(pros).then(function(values) {
					var wishlist_items = [];
					$.each(values, function(i, v){
						if(v != ''){
							v = v.replace('favorite-loop-','favorite-loop-'+(i+1));
							$('.wishlist-account').append(v);
							wishlist_items.push(favorite_item);
						}
						else{
							wishlist_items.push(null);
						}
					});
					/*
					$.each(wishlist_items,function(i,v){
						if(v != null){
							StickerAndPrice(v,'#favorite-loop-'+(i+1));
						}
					});
					*/
					GVN.Helper.renderFavorites();
				});
			}
			else{
				$('.btn-clearall-wishlist').addClass('d-none');
				$('.wishlist-account').append('<div class="data-account__empty"><div class="icon-empty"><svg width="132" height="170" viewBox="0 0 132 170" fill="none" xmlns="http://www.w3.org/2000/svg"><g fill="white" ><path d="M125.486 120.371H113.585V91.6562H132V113.845C132 117.451 129.086 120.371 125.486 120.371Z" fill="#A1AAAF"></path><path d="M99.3294 167.226C95.6392 170.922 89.6482 170.922 85.949 167.226L50.2828 131.497C46.5926 127.801 46.5926 121.799 50.2828 118.094C53.973 114.397 59.964 114.397 63.6633 118.094L99.3294 153.822C103.029 157.528 103.029 163.529 99.3294 167.226Z" fill="#E1E4E6"></path><path d="M128.553 117.208C126.649 117.208 125.107 115.662 125.107 113.755V91.9459C125.107 91.8465 125.125 91.7561 125.134 91.6567H125.107V6.06465C125.107 2.72051 122.4 0 119.052 0H42.7036C39.3652 0 36.6494 2.71147 36.6494 6.06465V114.315C36.6494 117.66 39.3562 120.38 42.7036 120.38H113.585H125.107H125.486C129.086 120.38 132 117.461 132 113.855V113.764C132 115.662 130.457 117.208 128.553 117.208Z" fill="#E1E4E6"></path><path d="M40.1233 148.932C62.2828 148.932 80.2466 130.937 80.2466 108.739C80.2466 86.5409 62.2828 68.5459 40.1233 68.5459C17.9638 68.5459 0 86.5409 0 108.739C0 130.937 17.9638 148.932 40.1233 148.932Z" fill="#CBD1D6"></path><path d="M40.1235 136.577C55.4712 136.577 67.9129 124.113 67.9129 108.739C67.9129 93.3647 55.4712 80.9014 40.1235 80.9014C24.7758 80.9014 12.334 93.3647 12.334 108.739C12.334 124.113 24.7758 136.577 40.1235 136.577Z" fill="white"></path><path d="M51.6001 97.2418C52.9084 98.5524 52.9084 100.676 51.6001 101.987L33.3836 120.226C32.0753 121.537 29.955 121.537 28.6467 120.226C27.3385 118.916 27.3385 116.792 28.6467 115.481L46.8633 97.2328C48.1715 95.9313 50.2918 95.9313 51.6001 97.2418Z" fill="#F56F65"></path><path d="M51.6001 120.226C50.2918 121.537 48.1715 121.537 46.8633 120.226L28.6467 101.978C27.3385 100.667 27.3385 98.5435 28.6467 97.2329C29.955 95.9224 32.0753 95.9224 33.3836 97.2329L51.6001 115.481C52.9084 116.792 52.9084 118.925 51.6001 120.226Z" fill="#F56F65"></path><path d="M55.9488 25.7136C59.7112 25.7136 63.3112 22.4056 63.1398 18.5101C62.9684 14.6056 59.9819 11.3066 55.9488 11.3066C52.1864 11.3066 48.5864 14.6146 48.7578 18.5101C48.9293 22.4146 51.9157 25.7136 55.9488 25.7136Z" fill="white"></path><path d="M80.1925 25.7136C83.9549 25.7136 87.5549 22.4056 87.3834 18.5101C87.212 14.6056 84.2255 11.3066 80.1925 11.3066C76.4301 11.3066 72.8301 14.6146 73.0015 18.5101C73.1819 22.4146 76.1684 25.7136 80.1925 25.7136Z" fill="white"></path><path d="M104.445 25.7136C108.207 25.7136 111.807 22.4056 111.636 18.5101C111.464 14.6056 108.478 11.3066 104.445 11.3066C100.683 11.3066 97.0825 14.6146 97.2539 18.5101C97.4344 22.4146 100.421 25.7136 104.445 25.7136Z" fill="white"></path><path d="M108.28 44.9557H51.1307C49.678 44.9557 48.4961 43.7717 48.4961 42.3165V40.8071C48.4961 39.352 49.678 38.168 51.1307 38.168H108.28C109.732 38.168 110.914 39.352 110.914 40.8071V42.3165C110.914 43.7717 109.732 44.9557 108.28 44.9557Z" fill="white"></path><path d="M108.343 61.6042H51.0585C49.642 61.6042 48.4961 60.4563 48.4961 59.0373V57.7358C48.4961 56.3168 49.642 55.1689 51.0585 55.1689H108.343C109.759 55.1689 110.905 56.3168 110.905 57.7358V59.0373C110.914 60.4473 109.759 61.6042 108.343 61.6042Z" fill="white"></path></g></svg></div><p class="alert-empty">QuÃ½ khÃ¡ch chÆ°a thÃªm sáº£n pháº©m yÃªu thÃ­ch nÃ o.</p><p><a href="/" class="button">TIáº¾P Tá»¤C MUA HÃ€NG</a></p></div>');
			}
		});
		$(document).on('click','#onAppWishList_removeAll',function(e){
			e.preventDefault();
			$.ajax({
				type: 'POST',
				url: 'https://onapp.haravan.com/wishlist/frontend/api/removealllike',
				data: {
					shop: window.Haravan.shop,
					customer_id: window.shop.account.id
				},
				success: function(data_response) {
					if(data_response && data_response.err){
						console.error(data_response.message);
					}else {
						window.location.reload(); 
					}
				}
			})
		});
	},
	ordersHistory: function(){
		function renderHtmlOrder(data){
			var status = '';
			var status_icon = '';
			var status_text = '';
			if(data.pos_order_status == 'pos_cancel'){
				status = 'cancel';
				status_icon = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 19C14.9706 19 19 14.9706 19 10C19 5.02944 14.9706 1 10 1C5.02944 1 1 5.02944 1 10C1 14.9706 5.02944 19 10 19Z" stroke="#6D6E72" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4 16L16 4" stroke="#6D6E72" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
				status_text = 'ÄÃ£ huá»·';
			}
			else if(data.pos_order_status == 'pos_pending' || data.pos_order_status == 'pos_user_assigned'){
				status = 'new';
				status_icon = '';
				status_text = 'Má»›i';
			} 
			else if(data.pos_order_status == 'pos_confirmed'){
				status = 'processing';
				status_icon = '';
				status_text = 'Äang xá»­ lÃ½';
			}
			else if(data.pos_order_status == 'pos_request_cancel'){
				status = 'processing';
				status_icon = '';
				status_text = 'YÃªu cáº§u huá»·';
			}
			else if(data.pos_order_status == 'pos_store_assigned' || data.pos_order_status == 'pos_output'){
				status = 'processing';
				status_icon = '';
				status_text = 'ÄÃ£ giao cho ÄVVC';
			}
			else if(data.pos_order_status == 'pos_delivering_nvc' || data.pos_order_status == 'pos_delivering_self'){
				status = 'delivering';
				status_icon = '<svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.8418 13.001C3.8418 13.5314 4.04142 14.0401 4.39675 14.4151C4.75208 14.7902 5.23402 15.0009 5.73653 15.0009C6.23905 15.0009 6.72098 14.7902 7.07631 14.4151C7.43165 14.0401 7.63127 13.5314 7.63127 13.001C7.63127 12.4705 7.43165 11.9618 7.07631 11.5868C6.72098 11.2117 6.23905 11.001 5.73653 11.001C5.23402 11.001 4.75208 11.2117 4.39675 11.5868C4.04142 11.9618 3.8418 12.4705 3.8418 13.001ZM13.3155 13.001C13.3155 13.5314 13.5151 14.0401 13.8704 14.4151C14.2258 14.7902 14.7077 15.0009 15.2102 15.0009C15.7127 15.0009 16.1947 14.7902 16.55 14.4151C16.9053 14.0401 17.105 13.5314 17.105 13.001C17.105 12.4705 16.9053 11.9618 16.55 11.5868C16.1947 11.2117 15.7127 11.001 15.2102 11.001C14.7077 11.001 14.2258 11.2117 13.8704 11.5868C13.5151 11.9618 13.3155 12.4705 13.3155 13.001Z" stroke="#6D6E72" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.84211 12.9999H1.94737V8.9999M1 1H11.4211V12.9999M7.63158 12.9999H13.3158M17.1053 12.9999H19V6.99993M19 6.99993H11.4211M19 6.99993L16.1579 1.99999H11.4211M1.94737 4.99995H5.73684" stroke="#6D6E72" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
				status_text = 'Äang váº­n chuyá»ƒn';
			}
			else if(data.pos_order_status == 'pos_complete'){
				status = 'complete';
				status_icon = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 0C4.05 0 0 4.05 0 9C0 13.95 4.05 18 9 18C13.95 18 18 13.95 18 9C18 4.05 13.95 0 9 0ZM9 16.2C5.031 16.2 1.8 12.969 1.8 9C1.8 5.031 5.031 1.8 9 1.8C12.969 1.8 16.2 5.031 16.2 9C16.2 12.969 12.969 16.2 9 16.2ZM13.131 5.022L7.2 10.953L4.869 8.631L3.6 9.9L7.2 13.5L14.4 6.3L13.131 5.022Z" fill="#6D6E72"/></svg>';
				status_text = 'Giao hÃ ng thÃ nh cÃ´ng';
			}
			
			var html = '';
			html += 		'<div class="history-table__item " data-search="'+data.order_number+'" data-stt="'+status+'">';
			html += 			'<div class="history-table__item-head">';
			html += 				'<div class="stt-order">';
			html +=						status_icon+'<span>'+status_text+'</span>';
			html += 				'</div>';
			html += 				'<div class="code-order">'+data.order_number+'</div>';
			html += 			'</div>';
			html += 			'<div class="history-table__item-body" data-count="'+data.line_items.length+'">';
			for(var j = 0; j < data.line_items.length; j++) {
				html += 				'<div class="history-table__item-line '+((j > 1) ? 'd-none' : '' )+'">';
				html += 					'<div class="left">';
				html += 						'<div class="img-line">';
				if ( data.line_items[j].image == null ) {
					html +=							'<img src="//theme.hstatic.net/200000636033/1001033735/14/no-image.jpg" alt="'+data.line_items[j].title+'" />';
				}
				else {
					html +=							'<img src="'+data.line_items[j].image.src+'" alt="'+data.line_items[j].title+'" />';
				}
				html += 							'<div class="qty-line">x'+data.line_items[j].quantity+'</div>';
				html += 						'</div>';
				html += 						'<div class="info-line">';
				html += 							'<div class="name-line">'+data.line_items[j].title+'</div>';
				if ( data.line_items[j].custom_total_discount > 0 ) {
					html += 							'<div class="discount-line">â€¢ Giáº£m giÃ¡ '+GVN.Helper.moneyFormat(data.line_items[j].custom_total_discount,'â‚«')+'</div>';
				}
				html += 						'</div>';
				html += 					'</div>';
				html += 					'<div class="right">';
				html += 						'<div class="text-right">';
				html += 							'<div class="price-line">'+ GVN.Helper.moneyFormat(data.line_items[j].custom_total_price,'â‚«') +'</div>';
				html += 							'<div class="price-original-line">'+ GVN.Helper.moneyFormat(data.line_items[j].custom_total_price_original,'â‚«') +'</div>';
				html += 						'</div>';
				html += 					'</div>';
				html += 				'</div>';
			}
			html += 			'</div>';
			html += 			'<div class="history-table__item-foot">';
			if (data.line_items.length > 2) {
				html += 				'<div class="more-line">Xem thÃªm <span>'+(data.line_items.length - 2)+'</span> sáº£n pháº©m</div>';
			}
			html += 					'<div class="total-order text-right">';
			html += 						'<span>Tá»•ng tiá»n: </span>';
			html += 						'<span>'+ GVN.Helper.moneyFormat(data.total_price,'â‚«') +'</span>';
			html += 					'</div>';
			html += 					'<div class="view-order text-right">';
			html += 						'<a href="/account/orders/'+data.cart_token+'" data-id="'+data._id+'" title="Xem chi tiáº¿t">Xem chi tiáº¿t</a>';
			html += 					'</div>';
			html += 			'</div>';
			html += 		'</div>';
			return html;	 
		};
		function renderHtmlEmpty(){
			var htmlEmpty = '<div class="data-account__empty">';
			htmlEmpty += 			'<div class="icon-empty">';
			htmlEmpty += 				'<svg width="132" height="170" viewBox="0 0 132 170" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_6133_13905)"><path d="M125.486 120.371H113.585V91.6562H132V113.845C132 117.451 129.086 120.371 125.486 120.371Z" fill="#A1AAAF"/><path d="M99.3294 167.226C95.6392 170.922 89.6482 170.922 85.949 167.226L50.2828 131.497C46.5926 127.801 46.5926 121.799 50.2828 118.094C53.973 114.397 59.964 114.397 63.6633 118.094L99.3294 153.822C103.029 157.528 103.029 163.529 99.3294 167.226Z" fill="#E1E4E6"/><path d="M128.553 117.208C126.649 117.208 125.107 115.662 125.107 113.755V91.9459C125.107 91.8465 125.125 91.7561 125.134 91.6567H125.107V6.06465C125.107 2.72051 122.4 0 119.052 0H42.7036C39.3652 0 36.6494 2.71147 36.6494 6.06465V114.315C36.6494 117.66 39.3562 120.38 42.7036 120.38H113.585H125.107H125.486C129.086 120.38 132 117.461 132 113.855V113.764C132 115.662 130.457 117.208 128.553 117.208Z" fill="#E1E4E6"/><path d="M40.1233 148.932C62.2828 148.932 80.2466 130.937 80.2466 108.739C80.2466 86.5409 62.2828 68.5459 40.1233 68.5459C17.9638 68.5459 0 86.5409 0 108.739C0 130.937 17.9638 148.932 40.1233 148.932Z" fill="#CBD1D6"/><path d="M40.1235 136.577C55.4712 136.577 67.9129 124.113 67.9129 108.739C67.9129 93.3647 55.4712 80.9014 40.1235 80.9014C24.7758 80.9014 12.334 93.3647 12.334 108.739C12.334 124.113 24.7758 136.577 40.1235 136.577Z" fill="white"/><path d="M51.6001 97.2418C52.9084 98.5524 52.9084 100.676 51.6001 101.987L33.3836 120.226C32.0753 121.537 29.955 121.537 28.6467 120.226C27.3385 118.916 27.3385 116.792 28.6467 115.481L46.8633 97.2328C48.1715 95.9313 50.2918 95.9313 51.6001 97.2418Z" fill="#F56F65"/><path d="M51.6001 120.226C50.2918 121.537 48.1715 121.537 46.8633 120.226L28.6467 101.978C27.3385 100.667 27.3385 98.5435 28.6467 97.2329C29.955 95.9224 32.0753 95.9224 33.3836 97.2329L51.6001 115.481C52.9084 116.792 52.9084 118.925 51.6001 120.226Z" fill="#F56F65"/><path d="M55.9488 25.7136C59.7112 25.7136 63.3112 22.4056 63.1398 18.5101C62.9684 14.6056 59.9819 11.3066 55.9488 11.3066C52.1864 11.3066 48.5864 14.6146 48.7578 18.5101C48.9293 22.4146 51.9157 25.7136 55.9488 25.7136Z" fill="white"/><path d="M80.1925 25.7136C83.9549 25.7136 87.5549 22.4056 87.3834 18.5101C87.212 14.6056 84.2255 11.3066 80.1925 11.3066C76.4301 11.3066 72.8301 14.6146 73.0015 18.5101C73.1819 22.4146 76.1684 25.7136 80.1925 25.7136Z" fill="white"/><path d="M104.445 25.7136C108.207 25.7136 111.807 22.4056 111.636 18.5101C111.464 14.6056 108.478 11.3066 104.445 11.3066C100.683 11.3066 97.0825 14.6146 97.2539 18.5101C97.4344 22.4146 100.421 25.7136 104.445 25.7136Z" fill="white"/><path d="M108.28 44.9557H51.1307C49.678 44.9557 48.4961 43.7717 48.4961 42.3165V40.8071C48.4961 39.352 49.678 38.168 51.1307 38.168H108.28C109.732 38.168 110.914 39.352 110.914 40.8071V42.3165C110.914 43.7717 109.732 44.9557 108.28 44.9557Z" fill="white"/><path d="M108.343 61.6042H51.0585C49.642 61.6042 48.4961 60.4563 48.4961 59.0373V57.7358C48.4961 56.3168 49.642 55.1689 51.0585 55.1689H108.343C109.759 55.1689 110.905 56.3168 110.905 57.7358V59.0373C110.914 60.4473 109.759 61.6042 108.343 61.6042Z" fill="white"/></g><defs><clipPath id="clip0_6133_13905"><rect width="132" height="170" fill="white"/></clipPath></defs></svg>';
			htmlEmpty += 			'</div>';
			htmlEmpty += 			'<p class="alert-empty">QuÃ½ khÃ¡ch chÆ°a cÃ³ Ä‘Æ¡n hÃ ng nÃ o.</p>';
			htmlEmpty += 			'<div><a href="/" class="button">TIáº¾P Tá»¤C MUA HÃ€NG</a></div>';
			htmlEmpty += 		'</div>';
			return htmlEmpty;	 
		}
		//var paramUrl =  '/apps/gvnes/auth/api/orders/listbycustomer?page=1&limit=50';
		
		function loadOrders(page){
			var paramUrl =  '/apps/gvnes/auth/api/orders/listbycustomer?page='+page+'&limit=5';
			$.get(paramUrl).done(function(result){	
				if (result.total > 0){
					GVN.Customers.totalPageOrder = Math.ceil(result.total / 5);
					if(page < GVN.Customers.totalPageOrder){
						$('.history-loadmore').find('span').html(result.total - page * 5);
						$('.history-loadmore').find('button').attr('data-current',page+1);
						$('.history-loadmore').removeClass('d-none');
					}
					else{
						$('.history-loadmore').addClass('d-none');
					}
					$('.status-list .status-item[data-stt="all"] .count').html('('+result.total+')');
					for (var i=0, l=result.items.length; i<l; i++){
						$('.history-table').append(renderHtmlOrder(result.items[i]));
					}
				}
				else {
					$('.history-table').html('');
					$('.history-table').append(renderHtmlEmpty);
				}
			});
		}
		loadOrders(1);

		$(document).on('click','.status-list a:not(.active)',function(e){
			e.preventDefault();
			$('.status-item').removeClass('active');
			$('.status-item').find('.count').addClass('d-none');
			$(this).addClass('active');
			
			var status = $(this).attr('data-stt');
			$('.history-table').attr('data-table',status);
			$('.history-loadmore').attr('data-table',status);
			if(status == 'all'){
				var count = $('.history-table__item[data-stt="'+status+'"]').length;
				
				if (count == 0){
					console.log('khÃ´ng cÃ³ Ä‘Æ¡n nÃ o');
					$('.history-table').html('');
					$('.history-table').append(renderHtmlEmpty);
				}
				else {
					$('.data-account__empty').remove();
					$('.history-table__item').removeClass('d-none');
					$(this).find('.count').removeClass('d-none');

				}
			}
			else{
				var count = $('.history-table__item[data-stt="'+status+'"]').length;
				$('.history-table__item').addClass('d-none');
				$('.history-table__item[data-stt="'+status+'"]').removeClass('d-none');
				$(this).find('.count').removeClass('d-none').html('('+count+')');
				if (count == 0){
					console.log('khÃ´ng cÃ³ Ä‘Æ¡n nÃ o');
					$('.history-table').html('');
					$('.history-table').append(renderHtmlEmpty);
				}
				else {
					if (count == 1){
						$('.history-table__item[data-stt="'+status+'"]').addClass('no-border');
					}
					else {
						$('.history-table__item[data-stt="'+status+'"]').removeClass('no-border');
					}
					$('.data-account__empty').remove();
				}	
			}
		});
		$(document).on('keyup','#history-search', function() {
			var q = $(this).val().toLowerCase();
			if (q.length > 0) {
				$('.history-table__item').addClass('d-none');
				$('.history-table__item[data-search*="'+q+'"]').removeClass('d-none');
				if ($('.history-table__item:not(.d-none)').length > 5){
					$('.history-loadmore').removeClass('d-none');
				}
				else {
					$('.history-loadmore').addClass('d-none');
				}
			}
			else{
				$('.history-table__item').removeClass('d-none');
				if ($('.history-table__item:not(.d-none)').length > 4){
					$('.history-loadmore').removeClass('d-none');
				}
			}
		} );
		$(document).on('click','#btn-history-search', function(e) {
			e.preventDefault();
			var q = $('#history-search').val().toLowerCase();
			if (q.length > 0) {
				$('.history-table__item').addClass('d-none');
				$('.history-table__item[data-search*="'+q+'"]').removeClass('d-none');
				if ($('.history-table__item:not(.d-none)').length > 5){
					$('.history-loadmore').removeClass('d-none');
				}
				else {
					$('.history-loadmore').addClass('d-none');
				}
			}
			else{
				$('.history-table__item').removeClass('d-none');
			}
		});
		$(document).on('click','.more-line',function(e){
			e.preventDefault();
			var count = $(this).find('span').html();
			if ($(this).parents('.history-table__item').find('.history-table__item-body').hasClass('opened')) {		
				$(this).removeClass('btn-closemore').addClass('btn-viewmore').html('Xem thÃªm <span>'+count+'</span> sáº£n pháº©m');
				$(this).parents('.history-table__item').find('.history-table__item-line:not(:nth-child(1)):not(:nth-child(2))').addClass('d-none');
				$(this).parents('.history-table__item').find('.history-table__item-body').removeClass('opened');
			} 
			else {
				$(this).parents('.history-table__item').find('.history-table__item-body').addClass('opened');
				$(this).removeClass('btn-viewmore').addClass('btn-closemore').html('áº¨n bá»›t <span>'+count+'</span> sáº£n pháº©m');
				$(this).parents('.history-table__item').find('.history-table__item-line').removeClass('d-none');
			}
		}); 
		$(document).on('click','.history-loadmore button',function(e){
			e.preventDefault();
			var page = Number($(this).attr('data-current'));
			loadOrders(page);
		});
	},
	initOrderDetail: function(){
		function renderTime(dt){
			var time = new Date(dt);
			time = time.getHours()+':'+time.getMinutes()/*+':'+time.getSeconds()*/ +' - '+time.getDate()+'.'+(time.getMonth()+1)+'.'+time.getFullYear();
			return time;
		};
		function renderHtmlTracking(data){
			var icon_x = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="path-1-inside-1" fill="white"><path d="M5.47027 6L0.116464 0.646198C-0.236691 0.293042 0.293042 -0.236691 0.646198 0.116464L6 5.47027L11.3538 0.116464C11.707 -0.236691 12.2367 0.293042 11.8835 0.646198L6.52973 6L11.8835 11.3538C12.2367 11.707 11.707 12.2367 11.3538 11.8835L6 6.52973L0.646198 11.8835C0.293042 12.2367 -0.236691 11.707 0.116464 11.3538L5.47027 6Z"></path></mask><path d="M5.47027 6L6.17737 6.70711L6.88448 6L6.17737 5.29289L5.47027 6ZM0.116464 0.646198L-0.590642 1.3533L0.116464 0.646198ZM0.646198 0.116464L1.3533 -0.590642L0.646198 0.116464ZM6 5.47027L5.29289 6.17737L6 6.88448L6.70711 6.17737L6 5.47027ZM11.3538 0.116464L10.6467 -0.590642V-0.590642L11.3538 0.116464ZM11.8835 0.646198L12.5906 1.3533V1.3533L11.8835 0.646198ZM6.52973 6L5.82263 5.29289L5.11552 6L5.82263 6.70711L6.52973 6ZM11.8835 11.3538L12.5906 10.6467L11.8835 11.3538ZM11.3538 11.8835L10.6467 12.5906L11.3538 11.8835ZM6 6.52973L6.70711 5.82263L6 5.11552L5.29289 5.82263L6 6.52973ZM0.646198 11.8835L1.3533 12.5906H1.3533L0.646198 11.8835ZM0.116464 11.3538L-0.590642 10.6467H-0.590642L0.116464 11.3538ZM6.17737 5.29289L0.823571 -0.0609092L-0.590642 1.3533L4.76316 6.70711L6.17737 5.29289ZM0.823571 -0.0609092C0.927161 0.0426804 1.01094 0.218208 0.99886 0.423499C0.98823 0.604207 0.908018 0.739124 0.823571 0.823571C0.739124 0.908018 0.604207 0.98823 0.423499 0.99886C0.218208 1.01094 0.0426804 0.927161 -0.0609092 0.823571L1.3533 -0.590642C1.07314 -0.87081 0.698959 -1.0208 0.306055 -0.997689C-0.0622675 -0.976023 -0.373762 -0.807523 -0.590642 -0.590642C-0.807523 -0.373762 -0.976023 -0.0622675 -0.997689 0.306055C-1.0208 0.698959 -0.87081 1.07314 -0.590642 1.3533L0.823571 -0.0609092ZM-0.0609092 0.823571L5.29289 6.17737L6.70711 4.76316L1.3533 -0.590642L-0.0609092 0.823571ZM6.70711 6.17737L12.0609 0.823571L10.6467 -0.590642L5.29289 4.76316L6.70711 6.17737ZM12.0609 0.823571C11.9573 0.927161 11.7818 1.01094 11.5765 0.99886C11.3958 0.98823 11.2609 0.908019 11.1764 0.823572C11.092 0.739125 11.0118 0.604208 11.0011 0.423499C10.9891 0.218209 11.0728 0.0426806 11.1764 -0.0609092L12.5906 1.3533C12.8708 1.07314 13.0208 0.698959 12.9977 0.306054C12.976 -0.0622683 12.8075 -0.373763 12.5906 -0.590643C12.3738 -0.807523 12.0623 -0.976023 11.6939 -0.997689C11.301 -1.0208 10.9269 -0.87081 10.6467 -0.590642L12.0609 0.823571ZM11.1764 -0.0609093L5.82263 5.29289L7.23684 6.70711L12.5906 1.3533L11.1764 -0.0609093ZM5.82263 6.70711L11.1764 12.0609L12.5906 10.6467L7.23684 5.29289L5.82263 6.70711ZM11.1764 12.0609C11.0728 11.9573 10.9891 11.7818 11.0011 11.5765C11.0118 11.3958 11.092 11.2609 11.1764 11.1764C11.2609 11.092 11.3958 11.0118 11.5765 11.0011C11.7818 10.9891 11.9573 11.0728 12.0609 11.1764L10.6467 12.5906C10.9269 12.8708 11.301 13.0208 11.6939 12.9977C12.0623 12.976 12.3738 12.8075 12.5906 12.5906C12.8075 12.3738 12.976 12.0623 12.9977 11.6939C13.0208 11.301 12.8708 10.9269 12.5906 10.6467L11.1764 12.0609ZM12.0609 11.1764L6.70711 5.82263L5.29289 7.23684L10.6467 12.5906L12.0609 11.1764ZM5.29289 5.82263L-0.0609093 11.1764L1.3533 12.5906L6.70711 7.23684L5.29289 5.82263ZM-0.0609092 11.1764C0.0426806 11.0728 0.218209 10.9891 0.423499 11.0011C0.604208 11.0118 0.739125 11.092 0.823572 11.1764C0.908019 11.2609 0.98823 11.3958 0.99886 11.5765C1.01094 11.7818 0.927161 11.9573 0.823571 12.0609L-0.590642 10.6467C-0.87081 10.9269 -1.0208 11.301 -0.997689 11.6939C-0.976023 12.0623 -0.807523 12.3738 -0.590643 12.5906C-0.373763 12.8075 -0.0622683 12.976 0.306054 12.9977C0.698959 13.0208 1.07314 12.8708 1.3533 12.5906L-0.0609092 11.1764ZM0.823571 12.0609L6.17737 6.70711L4.76316 5.29289L-0.590642 10.6467L0.823571 12.0609Z" mask="url(#path-1-inside-1)"></path></svg>';
			var icon_check = '<svg width="19" height="14" viewBox="0 0 19 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.2744 0.47078L6.69658 10.1165L2.72738 6.11917C2.42795 5.81773 2.02188 5.64842 1.59851 5.6485C1.17513 5.64857 0.769121 5.81802 0.469801 6.11957C0.170482 6.42112 0.00236659 6.83007 0.00244143 7.25645C0.00251627 7.68283 0.170775 8.09171 0.470201 8.39315L5.56799 13.5271C5.86735 13.8285 6.2733 13.9978 6.69658 13.9978C7.11986 13.9978 7.52582 13.8285 7.82517 13.5271L18.534 2.74155C18.8247 2.43835 18.9856 2.03226 18.982 1.61075C18.9784 1.18923 18.8105 0.786018 18.5145 0.487952C18.2186 0.189885 17.8182 0.0208135 17.3996 0.0171506C16.9811 0.0134878 16.5779 0.175527 16.2768 0.468369L16.2744 0.47078Z" fill="white"/></svg>';

			var htmlFinal = '<div class="box" id="order-box-0">';
			var htmlHead = '<div class="tracking-w d-none">';
			htmlHead += 		'<ul class="tracking-head">';
			htmlHead += 			'<li class="tracking_quantity"><span>'+data.line_items.length+'</span> Sáº£n pháº©m</li>';
			htmlHead += 			'<li class="tracking_orderid">ÄÆ¡n hÃ ng - <span>'+data.name+'</span></li>';
			htmlHead += 			'<li class="tracking_date_buy">NgÃ y mua: <span>'+renderTime(data.created_at)+'</span></li>';
			htmlHead += 			'<li class="tracking_phone d-none">Sá»‘ Ä‘iá»‡n thoáº¡i: <span>'+data.customer.phone+'</span></li>';
			htmlHead += 		'</ul>';
			htmlHead += 	 '</div>';

			var htmlBody = '<div class="collapse-box__body clearfix">';
			htmlBody += 		'<div class="order-tracking" id="odt-0">';
			htmlBody += 			'<div class="order-tracking-wrap">';
			if(data.pos_order_status == 'pos_cancel'){
				htmlBody += 			'<div class="ort-block active" id="ort-canceled">';
				htmlBody += 				'<div class="ort-block-circle">';
				htmlBody += 					'<span>'+icon_x+'</span>';
				htmlBody += 				'</div>';
				htmlBody += 				'<div class="ort-block-title">Huá»·</div>';
				htmlBody += 			'</div>';
			}
			else{
				var aStatus = ['','','','',''];
				var stepPrev = ['','','','',''];
				if(data.pos_order_status == 'pos_pending' || data.pos_order_status == 'pos_user_assigned'){
					aStatus[0] = 'active';
				}
				if(data.pos_order_status == 'pos_confirmed'){
					aStatus[0] = 'active';
					aStatus[1] = 'active';
					stepPrev[0] = 'checked';
				}
				if(data.pos_order_status == 'pos_request_cancel'){
					aStatus[0] = 'active';
					aStatus[1] = 'active';
					stepPrev[0] = 'checked';
				}
				
				if(data.pos_order_status == 'pos_store_assigned' || data.pos_order_status == 'pos_output'){
					aStatus[0] = 'active';
					aStatus[1] = 'active';
					aStatus[2] = 'active';
					stepPrev[0] = 'checked';
					stepPrev[1] = 'checked';
				}
				if(data.pos_order_status == 'pos_delivering_nvc' || data.pos_order_status == 'pos_delivering_self'){
					aStatus[0] = 'active';
					aStatus[1] = 'active';
					aStatus[2] = 'active';
					aStatus[3] = 'active';
					stepPrev[0] = 'checked';
					stepPrev[1] = 'checked';
					stepPrev[2] = 'checked';
				}
				if(data.pos_order_status == 'pos_complete'){
					aStatus[0] = 'active';
					aStatus[1] = 'active';
					aStatus[2] = 'active';
					aStatus[3] = 'active';
					aStatus[4] = 'active';	
					stepPrev[0] = 'checked';
					stepPrev[1] = 'checked';
					stepPrev[2] = 'checked';
					stepPrev[3] = 'checked';
				}
				htmlBody += 			'<div class="ort-block '+aStatus[0] + ' ' + stepPrev[0] +'" id="ort-ordered">';
				htmlBody += 				'<div class="ort-block-circle">';
				htmlBody += 					'<svg width="56" height="56" viewBox="0 0 57 56" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="28.5" cy="28" r="26.5" stroke="#CFCFCF" stroke-width="3"/><path d="M19.1667 29.3333V18.6667C19.1667 17.9594 19.4476 17.2811 19.9477 16.781C20.4478 16.281 21.1261 16 21.8333 16H37.8333C38.5406 16 39.2189 16.281 39.719 16.781C40.219 17.2811 40.5 17.9594 40.5 18.6667V36C40.5 37.3333 39.7 40 36.5 40M36.5 40H20.5C19.1667 40 16.5 39.2 16.5 36V33.3333H32.5V36C32.5 39.2 35.1667 40 36.5 40ZM24.5 21.3333H35.1667M24.5 26.6667H29.8333" stroke="#CFCFCF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
				htmlBody += 					'<span>'+icon_check+'</span>';
				htmlBody += 				'</div>';
				htmlBody +=					'<div class="ort-block-title">ÄÆ¡n hÃ ng Ä‘Ã£ Ä‘áº·t</div>';
				htmlBody +=					'<div class="ort-block-time">'+renderTime(data.created_at)+'</div>';
				htmlBody +=				'</div>';
				htmlBody += 			'<div class="ort-block '+aStatus[1] + ' ' + stepPrev[1] +'" id="ort-processing">';
				htmlBody +=					'<div class="ort-block-circle">';
				htmlBody += 					'<svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="28" cy="28" r="26.5" stroke="#CFCFCF" stroke-width="3"/><mask id="mask0_7525_18447" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="15" y="16" width="27" height="24"><path d="M25.9815 31.8895L29.537 33.0007C29.537 33.0007 38.4259 31.334 39.6111 31.334C40.7963 31.334 40.7963 32.4451 39.6111 33.5562C38.4259 34.6673 34.2778 38.0007 30.7222 38.0007C27.1667 38.0007 24.7963 36.334 22.4259 36.334H16.5" stroke="#CFCFCF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M16.5 29.6667C17.6852 28.5556 20.0556 26.8889 22.4259 26.8889C24.7963 26.8889 30.4259 29.1111 31.3148 30.2222C32.2037 31.3333 29.537 33 29.537 33M23.6111 23.5556V19.1111C23.6111 18.8164 23.736 18.5338 23.9582 18.3254C24.1805 18.1171 24.482 18 24.7963 18H39.0185C39.3328 18 39.6343 18.1171 39.8566 18.3254C40.0788 18.5338 40.2037 18.8164 40.2037 19.1111V28" stroke="#CFCFCF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M28.9443 18H34.8703V23H28.9443V18Z" fill="#CFCFCF" stroke="#CFCFCF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></mask><g mask="url(#mask0_7525_18447)"><path d="M14.1299 13.5566H42.5743V40.2233H14.1299V13.5566Z" fill="#CFCFCF"/></g></svg>';
				htmlBody += 					'<span>'+icon_check+'</span>';
				htmlBody += 				'</div>';
				htmlBody +=					'<div class="ort-block-title">Tiáº¿p nháº­n vÃ  chá» xá»­ lÃ½</div>';
				htmlBody +=					'<div class="ort-block-time">'+ ((data.pos_confirmed_at != null) ? renderTime(data.pos_confirmed_at) : '' ) +'</div>';
				htmlBody += 			'</div>';
				htmlBody += 			'<div class="ort-block '+aStatus[2] + ' ' + stepPrev[2] +'" id="ort-delivering">';
				htmlBody +=					'<div class="ort-block-circle">';
				htmlBody += 					'<svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="28" cy="28" r="26.5" fill="#ffffff" stroke="#CFCFCF" stroke-width="3"/><path d="M18.7627 35.1432C18.7627 35.901 19.0621 36.6277 19.5951 37.1635C20.1281 37.6993 20.851 38.0003 21.6048 38.0003C22.3586 38.0003 23.0815 37.6993 23.6145 37.1635C24.1475 36.6277 24.4469 35.901 24.4469 35.1432C24.4469 34.3855 24.1475 33.6588 23.6145 33.123C23.0815 32.5871 22.3586 32.2861 21.6048 32.2861C20.851 32.2861 20.1281 32.5871 19.5951 33.123C19.0621 33.6588 18.7627 34.3855 18.7627 35.1432ZM32.9732 35.1432C32.9732 35.901 33.2727 36.6277 33.8057 37.1635C34.3387 37.6993 35.0616 38.0003 35.8153 38.0003C36.5691 38.0003 37.292 37.6993 37.825 37.1635C38.358 36.6277 38.6574 35.901 38.6574 35.1432C38.6574 34.3855 38.358 33.6588 37.825 33.123C37.292 32.5871 36.5691 32.2861 35.8153 32.2861C35.0616 32.2861 34.3387 32.5871 33.8057 33.123C33.2727 33.6588 32.9732 34.3855 32.9732 35.1432Z" stroke="#CFCFCF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.7632 35.1426H15.9211V29.4284M14.5 18H30.1316V35.1426M24.4474 35.1426H32.9737M38.6579 35.1426H41.5V26.5713M41.5 26.5713H30.1316M41.5 26.5713L37.2368 19.4286H30.1316M15.9211 23.7142H21.6053" stroke="#CFCFCF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
				htmlBody += 					'<span>'+icon_check+'</span>';
				htmlBody += 				'</div>';
				htmlBody +=					'<div class="ort-block-title">ÄÃ£ giao cho ÄVVC</div>';
				htmlBody +=					'<div class="ort-block-time">'+ ((data.pos_delivering_self_at != null) ? renderTime(data.pos_delivering_self_at) : '' ) +'</div>';
				htmlBody +=				'</div>';
				htmlBody += 			'<div class="ort-block '+aStatus[3] + ' ' + stepPrev[3] +'" id="ort-fulfilled">';
				htmlBody +=					'<div class="ort-block-circle">';
				htmlBody += 					'<svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="28" cy="28" r="26.5" fill="#ffffff" stroke="#CFCFCF" stroke-width="3"/><path d="M18.7627 35.1432C18.7627 35.901 19.0621 36.6277 19.5951 37.1635C20.1281 37.6993 20.851 38.0003 21.6048 38.0003C22.3586 38.0003 23.0815 37.6993 23.6145 37.1635C24.1475 36.6277 24.4469 35.901 24.4469 35.1432C24.4469 34.3855 24.1475 33.6588 23.6145 33.123C23.0815 32.5871 22.3586 32.2861 21.6048 32.2861C20.851 32.2861 20.1281 32.5871 19.5951 33.123C19.0621 33.6588 18.7627 34.3855 18.7627 35.1432ZM32.9732 35.1432C32.9732 35.901 33.2727 36.6277 33.8057 37.1635C34.3387 37.6993 35.0616 38.0003 35.8153 38.0003C36.5691 38.0003 37.292 37.6993 37.825 37.1635C38.358 36.6277 38.6574 35.901 38.6574 35.1432C38.6574 34.3855 38.358 33.6588 37.825 33.123C37.292 32.5871 36.5691 32.2861 35.8153 32.2861C35.0616 32.2861 34.3387 32.5871 33.8057 33.123C33.2727 33.6588 32.9732 34.3855 32.9732 35.1432Z" stroke="#CFCFCF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.7632 35.1426H15.9211V29.4284M14.5 18H30.1316V35.1426M24.4474 35.1426H32.9737M38.6579 35.1426H41.5V26.5713M41.5 26.5713H30.1316M41.5 26.5713L37.2368 19.4286H30.1316M15.9211 23.7142H21.6053" stroke="#CFCFCF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
				htmlBody += 					'<span>'+icon_check+'</span>';
				htmlBody += 				'</div>';
				htmlBody +=					'<div class="ort-block-title">Äang giao</div>';
				htmlBody +=				'</div>';
				htmlBody += 			'<div class="ort-block '+aStatus[4] + ' ' + stepPrev[3] +'" id="ort-completed">';
				htmlBody +=					'<div class="ort-block-circle">';
				htmlBody += 					'<svg width="57" height="56" viewBox="0 0 57 56" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="28.5" cy="28" r="26.5" stroke="#CFCFCF" stroke-width="3"/><path d="M28.5 22.7024L29.9315 27.4051H34.2262L30.7692 29.8547L32.1855 34.4061L28.5 31.6238L24.8145 34.4061L26.2308 29.8547L22.7738 27.4051H27.0685L28.5 22.7024ZM24.8145 24.3808H18.0223C16.5451 24.3808 15.9359 26.271 17.139 27.1178L22.6824 31.0492L20.5047 38.02C20.063 39.4263 21.7078 40.5604 22.8804 39.6682L28.5 35.4343L34.1196 39.6833C35.2922 40.5755 36.937 39.4414 36.4953 38.0351L34.3176 31.0643L39.861 27.1329C41.0641 26.271 40.4549 24.396 38.9777 24.396H32.1855L29.9468 17.0774C29.5051 15.6409 27.4644 15.6409 27.038 17.0774L24.8145 24.3808Z" fill="#CFCFCF"/></svg>';
				htmlBody += 					'<span>'+icon_check+'</span>';
				htmlBody += 				'</div>';
				htmlBody +=					'<div class="ort-block-title">ÄÃ¡nh giÃ¡</div>';
				htmlBody +=				'</div>';
			}
			htmlBody += 		'</div>';
			htmlBody += 	'</div>';
			htmlBody += '</div>';

			htmlFinal += htmlHead + htmlBody + '</div>';
			$('.tracking-detail').html(htmlFinal);

		};
		function renderHtmlOrderDetail(data,type,line){
			var html = '';
			html += 		'<div id="'+data.id+'" data-vrid="'+ data.variant_id +'" data-prid="'+data.product_id+'" class="line-item">';
			html += 			'<div class="left">';
			html += 				'<div class="image">';
			if ( data.image == null ) {
				html +=					'<img src="//theme.hstatic.net/200000636033/1001033735/14/no-image.jpg" alt="'+data.title+'" />';
			}
			else {
				html +=					'<img src="'+data.image.src+'" alt="'+data.title+'" />';
			}
			html += 				'</div>';
			html += 				'<div class="info">';
			html += 					'<div class="name">'+data.title+'</div>';
			if (data.custom_total_discount > 0){
				html += 					'<div class="discount">â€¢Giáº£m giÃ¡ '+GVN.Helper.moneyFormat(data.custom_total_discount,'â‚«')+'</div>';
			}
			html += 					'<div class="meta">';
			if (data.variant_title != 'Default Title') {
				html += 						'<span class="variant">'+data.variant_title+'</span>';
			}
			html += 						'<span class="quantity">Sá»‘ lÆ°á»£ng: '+data.quantity+'</span>';
			html += 					'</div>';
			if (!$.isEmptyObject(GVN.Customers.dataOrderGiftPE)) {
				$.each(GVN.Customers.dataOrderGiftPE, function(keyGiftPE,htmlGiftFE){
					if(data.properties.filter(x => x.name == ('PE-gift-item-buy ' + keyGiftPE) ).length > 0) {
						html += htmlGiftFE;
					}
				})
			}
			
			/*
			if (!$.isEmptyObject(GVN.Customers.dataOrderGiftPE)) {
				$.each(GVN.Customers.dataOrderGiftPE, function(keyDiscountPE,htmlDiscountPE){
					if(data.properties.hasOwnProperty('PE-buy-discount-item-buy ' + keyDiscountPE) && data.properties.hasOwnProperty('PE-buy-discount-item ' + keyDiscountPE)) {
						html += htmlDiscountPE;
					}
				})
			}
			*/
			
			html += 				'</div>';
			html += 			'</div>';
			html += 			'<div class="right">';
			html += 				'<div class="total money text-right">';
			html += 					'<div class="total-price">'+ GVN.Helper.moneyFormat(data.custom_total_price,'â‚«') +'</div>';
			if (data.custom_total_price_original > data.custom_total_price){
				html += 					'<div class="total-price-original">'+ GVN.Helper.moneyFormat(data.custom_total_price_original,'â‚«')+'</div>';
			}
			html += 				'</div>';
			html += 			'</div>';  
			html += 		'</div>';	
			return html;	 
		};
		function renderHtmlGiftOrder(data,line){
			var itemOjProperties = {}
			var htmlGift = '';
			htmlGift +=	'<div class="line-gift" data-line="'+(line+1)+'" data-variant-id="'+data.variant_id+'" data-pro-id="'+data.product_id+'">';
			htmlGift +=			'<div class="gift-info">â€¢Táº·ng: '+ data.title;
			htmlGift +=				'<span> Trá»‹ giÃ¡: ' + GVN.Helper.moneyFormat(data.custom_total_price_original,'â‚«') +'</span>';
			htmlGift +=			'</div>';
			htmlGift +=	'</div>';
			return htmlGift;
		};
		function checkItemOrder(order) {
			var itemOjProperties = {}
			var countPromo = 0;
			var typePromo = '';

			var Combos = []; //mÃ£ combo
			var titleCombos = []; //tÃªn combo
			var lineCombo = [];

			var Gift = []; //mÃ£ gift
			var titleGift = []; //tÃªn program gift
			var lineGift = [];
			
			var Discount = []; //mÃ£ Discount
			var titleDiscount = []; //tÃªn Discount
			var lineDiscount = [];

			var checkItemGiftOmni = false;
			var checkItemGift = false;
			var checkItemCombo = false;
			var checkItemDiscount = false;

			for(var i = 0; i < order.line_items.length; i++) {
				var item = order.line_items[i];
				itemOjProperties = item.properties;
				$.each(itemOjProperties,function(j,properties){
					if (properties.name.indexOf('PE-combo-item') > -1){
						checkItemCombo = true;
						// PE-combo-item: "ma-combo | tÃªn combo"
						var temp1 = properties.value.split('|')[0].trim();
						var titleTemp1 = properties.value.split('|')[1].trim();
						if(Combos.includes(temp1)) {
							var indexExist = Combos.indexOf(temp1);
							lineCombo[indexExist].push(i);
						}
						else {
							Combos.push(temp1);
							titleCombos.push(titleTemp1);
							var temp11 = [];
							temp11.push(i);
							lineCombo.push(temp11);
						}
					}
					else if(properties.name.indexOf('PE-gift-item ') > -1) {
						checkItemGift = true;
						//PE-gift-item-buy magift: "tÃªn sáº£n pháº©m"
						//PE-gift-item magift: "tÃªn sáº£n pháº©m"
						var temp3 = properties.value;
						var titleTemp3 = temp3;
						var codeTemp3 = properties.name.split(' ')[1].trim();
						if(Gift.includes(codeTemp3)) {
							var indexExist = Gift.indexOf(codeTemp3);
							lineGift[indexExist].push(i);
						}
						else {
							Gift.push(codeTemp3);
							titleGift.push(titleTemp3);
							var temp33 = [];
							temp33.push(i);
							lineGift.push(temp33);
						}
					}
					/*
					else if(properties.name.indexOf('PE-buy-discount-item ') > -1) {
						checkItemDiscount = true;
						var temp4 = properties.value.split('|')[1].trim();
						var titleTemp4 = properties.value.split('|')[0].trim();
						var codeTemp4 = properties.name.split(' ')[1].trim();
						if(Discount.includes(codeTemp4)) {
							var indexExist = Discount.indexOf(codeTemp4);
							lineDiscount[indexExist].push(i);
						}
						else {
							Discount.push(codeTemp4);
							titleDiscount.push(titleTemp4);
							var temp44 = [];
							temp44.push(i);
							lineDiscount.push(temp44);
						}
					}
					*/
					else if(properties.name.indexOf('Khuyáº¿n mÃ£i') > -1) {
						checkItemGiftOmni = true;
					}		
				})
			}

			//Khuyáº¿n mÃ£i
			if(Gift.length > 0) {
				for(var i = 0; i < Gift.length; i++) {
					var gf = Gift[i];
					var itemInGift = [];
					order.line_items.map((x,index) => {
						var findGift = x.properties.filter(v => v.name == ('PE-gift-item ' + gf) && v.value.indexOf(titleGift[i]) > -1);
						if (findGift.length > 0){
							itemInGift.push(x);
						}
					});
					if (itemInGift.length > 0) {
						var htmlGiftApp = '<div class="gifts-list"><div>QuÃ  táº·ng khuyáº¿n mÃ£i</div>';
						for(var j = 0; j < itemInGift.length; j++) {
							countPromo = countPromo + itemInGift[j].quantity;
							htmlGiftApp += renderHtmlGiftOrder(itemInGift[j],lineGift[i][j]);
						}
						htmlGiftApp += '</div>';	
						GVN.Customers.dataOrderGiftPE[gf] = htmlGiftApp;
					}
				}
			}
			
			// Discount
			/*
			if(Discount.length > 0) {
				for(var i = 0; i < Discount.length; i++) {
					var dc = Discount[i];
					var itemInDiscount = [];
					order.line_items.map((x,index) => {
						var findDiscount = x.properties.filter(v => v.name == ('PE-buy-discount-item ' + dc) && v.value.indexOf(titleDiscount[i]) > -1);
						if (findDiscount.length > 0){
							itemInDiscount.push(x);
						}
					});
					if (itemInDiscount.length > 0) {
						var htmlDiscountApp = '<div class="discounts-list"><div>QuÃ  táº·ng khuyáº¿n mÃ£i</div>';
						for(var j = 0; j < itemInDiscount.length; j++) {
							countPromo = countPromo + itemInDiscount[j].quantity;
							htmlDiscountApp +=	'<div class="line-discount">';
							htmlDiscountApp +=		'<span>'+titleDiscount[i]+'</span>';
							htmlDiscountApp +=	'</div>';
						}
						htmlDiscountApp += '</div>';	
						GVN.Customers.dataOrderDiscountPE[dc] = htmlDiscountApp;
					}
				}
			}
			*/
			
			//Combo
			if(Combos.length > 0) {
				for(var i = 0; i < Combos.length; i++) {
					var cmb = Combos[i];
					var html = 	'<div class="order-group combo">';
					html += 			'<div class="quantity-combo-mini d-none align-items-center">';
					html +=  				'<div>Æ¯u Ä‘Ã£i: ' + titleCombos[i] + '</div>';
					html +=  			'</div>';

					var itemInCombo = [];
					order.line_items.map((x,index) => {
						var findCombo = x.properties.filter(v => v.name == ('PE-combo-item') && v.value.indexOf(cmb) > -1);
						if (findCombo.length > 0){
							itemInCombo.push(x);
						}
					});							 
					if (itemInCombo.length > 0) {
						for(var j = 0; j < itemInCombo.length; j++) {
							countPromo = countPromo + itemInCombo[j].quantity;
							html += renderHtmlOrderDetail(itemInCombo[j],'comboApp',lineCombo[i][j]);
						}
					}
					html += '</div>';

					$('#order_details .table-order').append(html);
				}
			}

			var promoGroup  = lineCombo.join(',').split(',');
			var promoGift   = lineGift.join(',').split(',');
			var promoDiscount  = lineDiscount.join(',').split(',');
			var promoSingle = lineGift.join(',').split(',');

			if(order.line_items.length > countPromo) {
				var htmlHead = '';
				var parent = null;
				if (countPromo >= 0) {
					htmlHead += '<div class="order-group single"></div>';
					$('#order_details .table-order').append(htmlHead);
				} 
				else {
					parent = $('#order_details .table-order');
				}
				for(var i = 0; i < order.line_items.length; i++) {
					if (!promoGroup.includes(i+"") && !promoGift.includes(i+"")) {
						var item = order.line_items[i];
						var htmlNormal =	renderHtmlOrderDetail(item,'',i,);
						$('#order_details .table-order .order-group.single').append(htmlNormal);
					}
				}
			}

		};

		var phone = $('#get_phone_order').val().trim();
		var ordernum = $('#get_id_order').val();
		var paramUrl =  '/apps/gvnes/auth/api/orders/'+ordernum+'/detail';
		$.get(paramUrl).done(function(result){									
			renderHtmlTracking(result.item);

			$('#shipping_method').html(result.item.shipping_lines[0].code);
			if (result.item.fulfillments.length > 0) {
				if (result.item.fulfillments[0].carrier_status_code == 'delivered') {
					$('.order-status').html(result.item.fulfillments[0].carrier_status_name);
				}
				else {
					$('.order-status').html('ChÆ°a nháº­n hÃ ng');
				}
			}
			else {
				$('.order-status').html('ChÆ°a nháº­n hÃ ng');
			}
			
			if (result.item.gateway_code == 'cod'){
				if(result.item.pos_order_status == 'pos_complete'){
					$('#order_payment .info-box--body').html('<div class="paid"><svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="16" height="16" rx="8" fill="#24B400"/><path d="M5 7.86842L7.4 10.5L11 5.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Thanh toÃ¡n thÃ nh cÃ´ng <strong>'+result.item.fulfillments[0].cod_amount+'</strong></span></div>');
				}
				else {
					$('#order_payment .info-box--body').html('<div class="unpaid"><span>ChÆ°a thanh toÃ¡n</span></div>');
				}
			}
			else if (result.item.gateway_code == 'alepay') {
				if(result.item.pos_order_status == 'pos_pending'){
					$('#order_payment .info-box--body').html('<div class="unpaid"><span>ChÆ°a thanh toÃ¡n</span></div>');
				}
				else {
					$('#order_payment .info-box--body').html('<div class="paid"><svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="16" height="16" rx="8" fill="#24B400"/><path d="M5 7.86842L7.4 10.5L11 5.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Thanh toÃ¡n thÃ nh cÃ´ng <strong>'+result.item.fulfillments[0].cod_amount+'</strong></span></div>');
				}
			}

			$('#order_customer .name-receive span:last-child').html(result.item.shipping_address.name+' - '+result.item.shipping_address.phone);
			$('#order_customer .address-receive span:last-child').html(result.item.shipping_address.address1);
			//$('#order_customer .date-receive span:last-child').html(renderTime(result.item.fulfillments[0].ready_to_pick_date));

			$('#order_details .table-order').append(checkItemOrder(result.item));

			$('#order_details_total .subtotal-price .line--r span').html(GVN.Helper.moneyFormat(result.item.total_line_items_price,'â‚«'));
			if (result.item.shipping_lines[0].price > 0){
				$('#order_details_total .shipping-fee .line--r span').html(GVN.Helper.moneyFormat(result.item.shipping_lines[0].price,'â‚«'));
			}
			else {
				$('#order_details_total .shipping-fee .line--r span').html('Miá»…n phÃ­');
			}
			if (result.item.total_discounts > 0){
				$('#order_details_total .discounts-fee .line--r span').html('- ' + GVN.Helper.moneyFormat(result.item.total_discounts,'â‚«'));
				$('#order_details_total .discounts-fee').removeClass('d-none');
			}
			
			//$('#order_details_total .tax-price .line--r span').html(GVN.Helper.moneyFormat(result.item.total_line_items_price,'â‚«'));
			$('#order_details_total .maintotal-price .line--r span').html(GVN.Helper.moneyFormat(result.item.total_price,'â‚«'));
			$('#order_details_total .amount-paid .line--r span b').html('0â‚«');
			
		});
		
	},
	initAddresses: {
		init: function(){
			var that = this;
			that.getProvinceAndDistrict();
			that.updateAddress();
			that.createAddress();
		},
		getProvinceAndDistrict: function(){
			/* Get list countries */
			countries = addressData.countries;
			let countryId = 241;
			let provinces = addressData[countryId];
			
			$.each(provinces.provinces, function(i, data) {
				$('select[name="address[province]"]').append('<option value="' + data.n + '" data-province="'+ data.i + '" data-code="'+ data.c +'">' + data.n + '</option>');
			});

			$(document).on('change','select[name="address[province]"]',function(e){
				let provinceName = $(this).val();
				let	provinceId = $(this).find('option[value="'+provinceName+'"]').attr('data-province');
				let	provinceCode = $(this).find('option[value="'+provinceName+'"]').attr('data-code');
				if($('.modal-account.show select[name="address[district]"] option').length > 1){ 
					$('.modal-account.show select[name="address[district]"] option:not(:first-child)').remove();
				}
				if($('.modal-account.show select[name="address[ward]"] option').length > 1){
					$('.modal-account.show select[name="address[ward]"] option:not(:first-child)').remove();
				}
				if(provinceName != '' && countryId == 241){
					async function getDistrict(){
						districts = await addressData.getProvince(countryId, provinceId);
						if(!jQuery.isEmptyObject(districts)){
							if($('.modal-account.show select[name="address[district]"] option').length > 1){
								$('.modal-account.show select[name="address[district]"] option:not(:first-child)').remove();
							}
							$.each(districts.districts,function(indx,vlue){
								if(provinceId === '50') {
									if (vlue.n === 'Quáº­n 2' || vlue.n === 'Quáº­n 9' || vlue.n === 'Quáº­n Thá»§ Äá»©c') {
										return;
									}
								}
								$('.modal-account.show select[name="address[district]"]').append('<option data-district="'+vlue.i+'" value="'+vlue.n+'" data-code="'+vlue.c+'">'+vlue.n+'</option>');					
							});
						}
					}
					getDistrict();
				}
			});
			$(document).on('change','select[name="address[district]"]',function(e){
				let provinceName = $('.modal-account.show select[name="address[province]"]').val(),
						districtName = $(this).val();

				let provinceId = 		$('.modal-account.show select[name="address[province]"] option[value="'+provinceName+'"]').attr('data-province'),
						provinceCode = 	$('.modal-account.show select[name="address[province]"] option[value="'+provinceName+'"]').attr('data-code'),
						districtId = 		$(this).find('option[value="'+districtName+'"]').attr('data-district'),
						districtCode = 	$(this).find('option[value="'+districtName+'"]').attr('data-code');

				if($('.modal-account.show select[name="address[ward]"] option').length > 1){
					$('.modal-account.show select[name="address[ward]"] option:not(:first-child)').remove();
				}

				if(districtId != '' && districtId != undefined ){
					async function getWard(){
						districts = await addressData.getProvince(countryId, provinceId);
						if(!jQuery.isEmptyObject(districts)){
							let wards = districts[districtId].wards;
							if(wards.length > 0){
								if($('.modal-account.show select[name="address[ward]"] option').length > 1){
									$('.modal-account.show select[name="address[ward]"] option:not(:first-child)').remove();
								}

								$.each(wards,function(indx,vlue){
									$('.modal-account.show select[name="address[ward]"]').append('<option data-ward="'+vlue.i+'" value="'+vlue.n+'" data-code="'+vlue.i+'">'+vlue.n+'</option>');
								});
							}
						}
					}
					getWard();
				}
			});

		},
		updateAddress: function(){	
			$('body').on('click', '.customer_address .action_edit .js-edit-customer', function(e){
				e.preventDefault();
				$('#address_form input[type="text"]').val();
				$('#address_form select option[value=""]').prop('selected',true);
				$('#address_form input[type="checkbox"]').val('0');
				
				var id_address = $(this).attr('data-id'),
						last_name =  $(this).attr('data-last-name'),
						first_name = $(this).attr('data-first-name'),
						phone = $(this).attr('data-phone'),
						province = $(this).attr('data-province'),
						province_id = $(this).attr('data-provinceid'),
						district = $(this).attr('data-district'),
						district_id = $(this).attr('data-districtid'),
						ward = $(this).attr('data-ward'),
						ward_id = $(this).attr('data-wardid'),
						address = $(this).attr('data-address'),
						type = $(this).attr('data-type'),
						df_address =  $(this).attr('data-default');
				
				$('#address_form').attr('data-id',id_address);
				$('#address_form input[name="address[fullname]"]').val(last_name+' '+first_name);
				$('#address_form input[name="address[phone]"]').val(phone);
				if (province != '') {
					$('#address_form select[name="address[province]"]').val(province).change();
					async function getDistrict(){
						districts = await addressData.getProvince(241, province_id);
						if(!jQuery.isEmptyObject(districts)){
							if($('#address_form select[name="address[district]"] option').length > 1){
								 $('#address_form select[name="address[district]"] option:not(:first-child)').remove();
							}
							$.each(districts.districts,function(indx,vlue){
								if(province_id === '50') {
									if (vlue.n === 'Quáº­n 2' || vlue.n === 'Quáº­n 9' || vlue.n === 'Quáº­n Thá»§ Äá»©c') {
										return;
									}
								}
								$('#address_form select[name="address[district]"]').append('<option data-district="'+vlue.i+'" value="'+vlue.n+'" data-code="'+vlue.c+'" '+(vlue.i == district_id?'selected':'')+'>'+vlue.n+'</option>');
							});
						}
						
						let wards = districts[district_id].wards;
						if(wards.length > 0){
							if($('#address_form select[name="address[ward]"] option').length > 1){
								 $('#address_form select[name="address[ward]"] option:not(:first-child)').remove();
							}
							$.each(wards,function(indx,vlue){
								$('#address_form select[name="address[ward]"]').append('<option data-ward="'+vlue.i+'" value="'+vlue.n+'"'+(vlue.i == ward_id?'selected':'')+' data-code="'+vlue.i+'">'+vlue.n+'</option>');
							});
						}	
					}
					getDistrict();		
				}
				
				$('#address_form input[name="address[address1]"]').val(address);
				$('#address_form input[name="address[type]"][value="'+type+'"]').prop('checked',true);
				$('#address_form input[name="address[default]"]').val(df_address);
				if ($('#address_form input[type="text"]').val().length > 0) {
					$('#address_form input').addClass('is-filled');
				}
				
				$('#edit_address').modal();
			});
			$('#address_form').submit(function(e){
				e.preventDefault();
				var id_address = $(this).attr('data-id');
				var fullName = $(this).find('input[name="address[fullname]"]').val().split(' '),
						last_name = fullName[0],
						first_name = fullName.slice(1,fullName.length).join(' '),
						phone = $('#address_form').find('input[name="address[phone]"]').val(),
						province = $('#address_form').find('select[name="address[province]"] option:selected').val(),
						province_code = $('#address_form').find('select[name="address[province]"] option:selected').attr('data-code'),
						district = $('#address_form select[name="address[district]"] option:selected').val(),
						district_code = $('#address_form select[name="address[district]"] option:selected').attr('data-code'),
						ward = $('#address_form select[name="address[ward]"] option:selected').val(),
						ward_code = $('#address_form select[name="address[ward]"] option:selected').attr('data-code'),
						address = $('#address_form input[name="address[address1]"]').val(),
						type = $('#address_form input[name="address[type]"]:checked').val(),
						df_address = $('#address_form input[name="address[default]"]:checked').val();;
						
				var allowSubmit = true;

				//Kiá»ƒm tra Ä‘Ãºng Ä‘á»‹nh dáº¡ng
				if(!GVN.Helper.checkPhone(phone)){
					$('#address_form').find('input[name="address[phone]"]').parents('.form__input-wrapper').addClass('error');
					allowSubmit = false;
				}
				else $('#address_form').find('input[name="address[phone]"]').parents('.form__input-wrapper').removeClass('error');

				if(allowSubmit){
					var data = {
						"ward_code": ward_code,
						"ward": ward,
						"district_code": district_code,
						"district": district,
						"province_code": province_code,
						"province": province,
						"phone": phone,
						"last_name": last_name,
						"first_name": first_name,
						"country_code": "VN",
						"country": "Vietnam",
						"company": type,
						"address1": address,
						"address2": ''
					};
					$.ajax({
						url: '/apps/gvnes/auth/api/customers[addresses]/'+id_address+'/update',
						type: 'POST',
						data: JSON.stringify(data),
						contentType: 'application/json',
						dataType: 'JSON',
						success: function(data){
							if(data.error){
								GVN.Helper.SwalWarning(data.message,'Vui lÃ²ng kiá»ƒm tra láº¡i thÃ´ng tin!','warning',false,false,4000);
							}
							else{
								$('#edit_address').modal('hide');
								Swal.fire({
									title: '',
									text: 'Äá»‹a chá»‰ Ä‘Ã£ Ä‘Æ°á»£c cáº­p nháº­t thÃ nh cÃ´ng!',
									icon: 'success',
									showCancelButton: false,
									showConfirmButton: false,
									timer: 3000,
								}).then((result) => {
									window.location.reload(); 
								})
							}
						}
					});
				}
			});
			$('body').on('click', '.customer_address .action_setup_df .js-setdefault-customer', function(e){
				e.preventDefault();
				var id_address = $(this).attr('data-id');
				var data = {
					"ward_code": $(this).attr('data-wardcode'),
					"ward": $(this).parents('.address_actions').find('.action_edit a').attr('data-ward'),
					"district_code": $(this).attr('data-districtcode'),
					"district": $(this).parents('.address_actions').find('.action_edit a').attr('data-district'),
					"province_code": $(this).attr('data-provincecode'),
					"province": $(this).parents('.address_actions').find('.action_edit a').attr('data-province'),
					"phone": $(this).parents('.address_actions').find('.action_edit a').attr('data-phone'),
					"last_name": $(this).parents('.address_actions').find('.action_edit a').attr('data-last-name'),
					"first_name": $(this).parents('.address_actions').find('.action_edit a').attr('data-first-name'),
					"country_code": "VN",
					"country": "Vietnam",
					"company": $(this).parents('.address_actions').find('.action_edit a').attr('data-type'),
					"address1": $(this).parents('.address_actions').find('.action_edit a').attr('data-address'),
					"address2": '',
					"default": true
				};
				$.ajax({
					url: '/apps/gvnes/auth/api/customers[addresses]/'+id_address+'/default',
					type: 'POST',
					data: JSON.stringify(data),
					contentType: 'application/json',
					dataType: 'JSON',
					success: function(data){
						if(data.error){
							GVN.Helper.SwalWarning(data.message,'Vui lÃ²ng kiá»ƒm tra láº¡i thÃ´ng tin!','warning',false,false,4000);
						}
						else{
							Swal.fire({
								title: '',
								text: 'Thiáº¿t láº­p máº·c Ä‘á»‹nh thÃ nh cÃ´ng!',
								icon: 'success',
								showCancelButton: false,
								showConfirmButton: false,
								timer: 3000,
							}).then((result) => {
								window.location.reload(); 
							})
						}
					}
				});
			});
			$('body').on('click', '.customer_address .action_delete .js-delete-customer', function(e){
				e.preventDefault();
				var id_address = $(this).attr('data-id');
				var data = {};
				
				Swal.fire({
					title: '',
					text: 'Báº¡n muá»‘n xoÃ¡ Ä‘á»‹a chá»‰ nÃ y?',
					icon: 'question',
					showCancelButton: true,
					showConfirmButton: true,
					confirmButtonText: 'CÃ³',
					cancelButtonText: 'KhÃ´ng',
				}).then((result) => {
					if (result.isConfirmed) {
						$.ajax({
							url: '/apps/gvnes/auth/api/customers[addresses]/'+id_address+'/delete',
							type: 'POST',
							data: JSON.stringify(data),
							contentType: 'application/json',
							dataType: 'JSON',
							success: function(data){
								if(data.error){
									GVN.Helper.SwalWarning(data.message,'Vui lÃ²ng kiá»ƒm tra láº¡i thÃ´ng tin!','warning',false,false,4000);
								}
								else{
									Swal.fire({
										title: '',
										text: 'XoÃ¡ Ä‘á»‹a chá»‰ thÃ nh cÃ´ng!',
										icon: 'success',
										showCancelButton: false,
										showConfirmButton: false,
										timer: 3000,
									}).then((result) => {
										window.location.reload(); 
									})
								}
							}
						});
					} 
				})	
			});
		},
		createAddress: function(){
			$('#address_form_new').submit(function(e){
				e.preventDefault();
				var fullName = $(this).find('input[name="address[fullname]"]').val().split(' '),
						last_name = fullName[0],
						first_name = fullName.slice(1,fullName.length).join(' '),
						phone = $('#address_form_new').find('input[name="address[phone]"]').val(),
						province = $('#address_form_new').find('select[name="address[province]"] option:selected').val(),
						province_code = $('#address_form_new').find('select[name="address[province]"] option:selected').attr('data-code'),
						district = $('#address_form_new select[name="address[district]"] option:selected').val(),
						district_code = $('#address_form_new select[name="address[district]"] option:selected').attr('data-code'),
						ward = $('#address_form_new select[name="address[ward]"] option:selected').val(),
						ward_code = $('#address_form_new select[name="address[ward]"] option:selected').attr('data-code'),
						address = $('#address_form_new input[name="address[address1]"]').val(),
						type = $('#address_form_new input[name="address[type]"]:checked').val(),
						df_address = $('#address_form_new input[name="address[default]"]:checked').val();;
						
				var allowSubmit = true;

				//Kiá»ƒm tra Ä‘Ãºng Ä‘á»‹nh dáº¡ng
				if(!GVN.Helper.checkPhone(phone)){
					$('#address_form_new').find('input[name="address[phone]"]').parents('.form__input-wrapper').addClass('error');
					allowSubmit = false;
				}
				else $('#address_form_new').find('input[name="address[phone]"]').parents('.form__input-wrapper').removeClass('error');

				if(allowSubmit){
					var data = {
						"ward_code": ward_code,
						"ward": ward,
						"district_code": district_code,
						"district": district,
						"province_code": province_code,
						"province": province,
						"phone": phone,
						"last_name": last_name,
						"first_name": first_name,
						"country_code": "VN",
						"country": "Vietnam",
						"company": type,
						"address1": address,
					};
					$.ajax({
						url: '/apps/gvnes/auth/api/customers[addresses]/create',
						type: 'POST',
						data: JSON.stringify(data),
						contentType: 'application/json',
						dataType: 'JSON',
						success: function(data){
							if(data.error){
								GVN.Helper.SwalWarning(data.message,'Vui lÃ²ng kiá»ƒm tra láº¡i thÃ´ng tin!','warning',false,false,4000);
							}
							else{
								$('#modal-address-new-add').modal('hide');
								Swal.fire({
									title: '',
									text: 'Äá»‹a chá»‰ má»›i Ä‘Ã£ Ä‘Æ°á»£c táº¡o thÃ nh cÃ´ng!',
									icon: 'success',
									showCancelButton: false,
									showConfirmButton: false,
									timer: 3000,
								}).then((result) => {
									window.location.reload(); 
								})
							}
						}
					});
				}
			});
		}
	},
}
GVN.OrderTracking = {
	init: function(){
		var that = this;
		that.Close();
		that.TrackingDetail();
		//that.TrackingList();
	},
	Close: function(){
		$(document).on('click','.swal_overlay',function(e){
			if(window.shop.template.indexOf('doi-tra') > -1){
				$('#refund-main').addClass('d-none');
				$('#order-tracking-main').removeClass('d-none');
			}
			GVN.OrderTracking.Swal('','','','close');
		});
		$(document).on('click','.close-modal',function(){
			$('[id*="_overlay"],[id*="_modal"]').removeClass('open');
			GVN.OrderTracking.Swal('','','','close');
		});
	},
	Swal: function(type,title,text,action){
		if(action == 'close'){
			$(".swal2-container").removeClass("swal2-shown").addClass("swal2-hide");
		}
		else{
			$(".swal2-container").removeClass("swal2-hide").addClass("swal2-shown");
			$(".swal2-icon").each(function(){
				var getType = $(this).attr("id");
				if(getType == type){
					$(this).addClass('swal2-animate-'+type+'-icon');
					if(type == 'warning'){
						$(".swal2-cancel").show();
						$(".swal2-confirm").hide();
					}else if( type == 'error' ){
						$(".swal2-cancel").hide();
						$(".swal2-confirm").hide();
					}else if( type == 'success' ){
						$(".swal2-cancel").hide();
						$(".swal2-confirm").hide();
					}else if(type == 'info'){
						$(".swal2-cancel").hide();
						$(".swal2-confirm").hide();
					}
				}
				else{
					$(this).removeClass('swal2-animate-'+getType+'-icon');
				}
			});
			(type == 'error')?$(".swal2-title").hide():$(".swal2-title").html(title).show();
			$("#swal2-content").html(text);
		}
	},
	TrackingDetail: function(){
		$('#search_order_tracking').on('click',function(e){
			e.preventDefault();
			if(accountJS.logged){
				window.location = '/account?view=orders-history';
			}
			else {
				Swal.fire({
					title: 'ThÃ´ng bÃ¡o',
					text: 'Báº¡n cáº§n Ä‘Äƒng nháº­p Ä‘á»ƒ tra cá»©u Ä‘Æ¡n hÃ ng',
					icon: 'warning',
					showCancelButton: true,
					showConfirmButton: true,
					confirmButtonText: 'ÄÄƒng nháº­p',
					cancelButtonText: 'KhÃ´ng'
				}).then((result) => {
					if (result.isConfirmed) {
						GVN.Helper.accountPopup('acc-login-box');
					}
				})
			}
		});
	},
	TrackingList: function(){
		var ordernum = '',phone = '',dataOrder = null;
		/* List Ä‘Æ¡n hÃ ng theo 1 sÄ‘t*/	
		function insertTime(datetime,placeInsert,clone){
			var create_date = datetime.split('T');
			var date = create_date[0].split('-');
			date = date.reverse().join('/');

			var time = new Date(datetime);
			time = new Date( time.getTime() );
			$(clone).find(placeInsert).html(date+' '+time.getHours()+':'+time.getMinutes());
		}
		$('#search_order_tracking').on('click',function(e){
			e.preventDefault();
			var btn = $(this);
			btn.attr('disabled','disabled');
			phone = $('input[name="phone"]').val().trim();
			var paramUrl = '/apps/gvnes/api/orders/tracking/?phone='+phone;
			$.get(paramUrl).done(function(result){									
				console.log(result.total);
				if (result.total == 0) {
					$('#order-tracking-alert').removeClass('d-none');
				}
				else {
					if(result.hasOwnProperty('error') && result.error != null){
						swal('error','',data.message,'open');
					}
					else{
						dataOrder = result.orders;
						$.each(result.orders,function(ind,order){
							var clone = $('#frame-clone').clone();
							clone.removeAttr('id');
							var customer = order.customer,
									address = order.customer.addresses,
									default_address = order.shipping_address;
							clone.find('.detail-order').attr('data-line',ind);
							clone.find('.list-info .item-info:eq(0) .desc').html(customer.last_name+' '+customer.first_name);
							clone.find('.list-info .item-info:eq(1) .desc').html(customer.phone)/*.parent().hide()*/;

							var place = default_address.address1+' ';
							place += default_address.district != null?default_address.district:'';
							place += (default_address.ward != null?', '+default_address.ward:'');
							place += (default_address.province != null?', '+default_address.province:'');
							clone.find('.list-info .item-info:eq(2) .desc').html(place);

							clone.find('.order-code span').html(order.order_number);
							clone.find('.order-code').attr('data-ordercode',order.order_number);

							insertTime(order.created_at,'.order-date span',clone);
							insertTime(order.created_at,'.time_order1',clone);
							if(order.pos_confirmed_at != null) insertTime(order.pos_confirmed_at,'.time_order2',clone);
							if(order.pos_delivering_self_at != null) insertTime(order.pos_delivering_self_at,'.time_order3',clone);
							else if(order.pos_delivering_nvc_at != null) insertTime(order.pos_delivering_nvc_at,'.time_order3',clone);
							if(order.pos_complete_at != null) insertTime(order.pos_complete_at,'.time_order4',clone);
							if(order.pos_cancel_refund_at != null) insertTime(order.pos_cancel_refund_at,'.time_order5',clone);
							if(order.pos_cancel_restock_at != null) insertTime(order.pos_cancel_restock_at,'.time_order5',clone);
							if(order.pos_cancel_at != null) insertTime(order.pos_cancel_at,'.time_order6',clone);

							var canceledOrder = false;
							if(order.pos_complete_at != null && (order.pos_cancel_refund_at == null && order.pos_cancel_at == null)){
								if(order.is_transfer){
									//$('.btn-return').show().attr('href','/pages/doi-tra-hang?number='+ordernum+'&phone='+phone);
								}
								else{
									//$('.allow_refund').html('ÄÆ¡n hÃ ng cá»§a báº¡n Ä‘ang Ä‘Æ°á»£c tiáº¿n hÃ nh Ä‘á»•i tráº£.');
									//$('.btn-return').hide();
									canceledOrder = true;
								}
								clone.find('.step-maker').attr('data-tracking','complete');

								var now = new Date().getTime();
								var complete = new Date(order.pos_complete_at).getTime() + 5*86400000;
								if(complete < now){
									clone.find('.btn-return').hide();
								}
							}
							else{
								var now = new Date().getTime();
								if(order.pos_complete_at == null && order.confirmed_status != null){
									clone.find('.btn-return').hide();
								}
								else if(order.pos_complete_at != null){
									var complete = new Date(order.pos_complete_at).getTime() + 5*86400000;
									if(complete < now){
										clone.find('.btn-return').hide();
									}
								}
								//var allow_refund = true;
								if(order.created_at){
									clone.find('.step-maker').attr('data-tracking','pending');
								}
								if(order.pos_confirmed_at != null){
									clone.find('.step-maker').attr('data-tracking','assigned');
								}
								if(order.pos_delivering_nvc_at != null || order.pos_delivering_self_at != null){
									clone.find('.step-maker').attr('data-tracking','delivering');
								}
								if(order.pos_cancel_at != null){
									clone.find('.step-maker').attr('data-tracking','cancel');
									//allow_refund = false;
									canceledOrder = true;
								}
								if(order.pos_cancel_refund_at != null){
									clone.find('.step-maker').attr('data-tracking','refund');
									//allow_refund = false
								}
								if(order.pos_cancel_restock_at != null){
									clone.find('.step-maker').attr('data-tracking','refund');
									//allow_refund = false
								}
								//if(allow_refund == false){
								//$('.allow_refund').html('ÄÆ¡n hÃ ng cá»§a báº¡n khÃ´ng thá»ƒ táº¡o yÃªu cáº§u Ä‘á»•i tráº£.');
								//}
							}
							if(order.is_available_cancel && order.pos_confirmed_at == null  && order.pos_cancel_at == null && order.gateway_method_config == "COD" ){
								clone.find(".order-col .btn-cancel").removeAttr('disabled').removeClass('disabled');
							}
							else{
								clone.find(".order-col .btn-cancel").attr('disabled','disabled').addClass('disabled');
							}

							//clone.find('#control-order-tracking').removeClass('d-none');
							$('#control-order-tracking').append(clone.removeClass('d-none').addClass('line-order'));

							$('#order-tracking-main').addClass('d-none');
							$('#control-order-tracking').removeClass('d-none');
						});   
					}
				}
			});
		});
	}
}  
GVN.Blog = {
	init: function(){
		var that = this;
		that.loadMoreBlog();
	},
	loadMoreBlog: function(){
		var total_page = 0, cur_page = 1 ;
		var curl = window.shop.blog.curl ;
		jQuery.ajax({
			url: curl+'?view=pagesize',
			async: false,//táº¯t báº¥t Ä‘á»“ng bá»™
			success:function(data){
				total_page = parseInt(data);
				if (cur_page >= total_page ) {
					jQuery('.view-more-blog').remove();
				}
			} 
		});
		jQuery(document).on("click",".view-more-blog a", function(){
			jQuery('.view-more-blog').remove();  
			if(cur_page < total_page){
				cur_page++;
				jQuery.ajax({
					url: curl + '?view=data-post&page=' + cur_page,
					success:function(data){
						jQuery('.blog-ajax').append(data);				
						$('.blog-posts').append('<div class="view-more-blog"><a href="javascript:void(0);">Xem thÃªm bÃ i viáº¿t<svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.80717 2.518C1.7651 2.59888 1.74585 2.6897 1.75149 2.78069C1.75713 2.87169 1.78744 2.95943 1.83917 3.0345L6.33917 9.5345C6.38518 9.60092 6.44661 9.6552 6.51819 9.69268C6.58977 9.73017 6.66937 9.74976 6.75017 9.74976C6.83097 9.74976 6.91057 9.73017 6.98215 9.69268C7.05373 9.6552 7.11515 9.60092 7.16117 9.5345L11.6612 3.0345C11.7131 2.95949 11.7435 2.8717 11.7491 2.78066C11.7547 2.68961 11.7352 2.59877 11.6929 2.51796C11.6506 2.43716 11.5869 2.36948 11.5089 2.32225C11.4309 2.27502 11.3414 2.25003 11.2502 2.25L2.25017 2.25C2.1589 2.24998 2.06937 2.27495 1.99128 2.32219C1.91319 2.36944 1.84952 2.43715 1.80717 2.518Z" fill="#1982F9"/></svg></a></div>');
						if (cur_page >= total_page - 1 ) {
							jQuery('.view-more-blog').remove();
						}
					}
				});
			}
		});
	}
}
GVN.Contact = {
	init: function(){
		var that = this;
		that.ticketForm();
	},
	ticketForm: function(){
		$(document).on('click','#ticket-form #btn-submit-ticket',function(e){
			if($(this).closest('form')[0].checkValidity() == true){
				e.preventDefault();
				var ticketTopic 		 = $(this).parents('.ticket-form').find('#ticket-topic').val();
				var ticketTitle  		 = $(this).parents('.ticket-form').find('#ticket-title').val();
				var ticketContent  	 = $(this).parents('.ticket-form').find('#ticket-content').val(); // Time new

				var ticketName 		 = $(this).parents('.ticket-form').find('#ticket-name').val(); 	// TÃªn
				var ticketMail     = $(this).parents('.ticket-form').find('#ticket-email').val(); // Mail
				var ticketPhone    = $(this).parents('.ticket-form').find('#ticket-phone').val(); // Phone

				var objnew = {};
				objnew['entry.670572910'] = ticketTopic;
				objnew['entry.1001657867'] = ticketTitle;
				objnew['entry.1580327330'] = ticketContent;
				objnew['entry.257161591'] = ticketName;
				objnew['entry.2129770788'] = ticketMail;
				objnew['entry.428502199'] = ticketPhone;

				$.ajax({
					type: 'POST',
					url: 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSfKLnxN0w3wm9gQ20S9nX0ZS06l09QAfFkYjg8ONCdNmj6bDg/formResponse', 
					data: objnew,
					dataType: 'xml',
					async: false,
					success: function(cart) {},
					error: function(xhr, textStatus, errorThrown) {}
				});

				$('#modal-ticket-success').modal();
				$('.ticket-form').find('input').val('');
				$('.ticket-form').find('textarea').val('');
				$('.ticket-form select').val('').change();
				setTimeout(function(){
					$('#modal-ticket-success').modal('hide');	
				}, 4000);

			}
		});
	}
}
GVN.Search = {
	totalPageItem: 0,
	init: function(){
		var that = this;
		that.searchAPI();
		that.sliderSearch();
		GVN.Helper.pickItem();
		GVN.Index.tabHome();
	},
	searchAPI: function(){
		var keySearch = "";
		var aId = [], aIdSearch = [], htmlList = "",  dataItems = [], htmlListFilter = "";
		var listATCNew = [], itemFilterObj = {}; 
		
		function render_filter(rs){
			var htmlFilter = '';
			htmlFilter += '<div class="search-filter">';
			htmlFilter += 	'<div class="filter-wrap scrolling">';
    	htmlFilter += 		'<div class="filter-total">';
      htmlFilter += 			'<div class="filter-total--title jsFilter">';
      htmlFilter += 				'<svg class="icon icon-filter" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 1H1.5V3.47059L6.375 8.41176V15L9.625 12.9412V8.41176L14.5 3.47059V1Z" stroke="#111111" stroke-width="1.5" stroke-linejoin="round"></path></svg>';
      htmlFilter += 				'<span class="text">Bá»™ lá»c</span>';
      htmlFilter += 				'<span class="filter-number d-none">0</span>';
      htmlFilter += 				'<div class="icon-arrow"></div>';
      htmlFilter += 			'</div>';
      htmlFilter += 			'<div class="filter-total--content">';
      htmlFilter += 				'<div class="filter-total--content-head">';
      htmlFilter += 					'<div class="filter-tags-wrap d-none">';
      htmlFilter += 						'<div class="list-filter--selected">';
      htmlFilter += 							'<span>TiÃªu chÃ­ Ä‘Ã£ chá»n:</span>';
      htmlFilter +=				        '<div class="list-tags">';
			
			$.each(rs,function(m,n){
      htmlFilter +=			          	'<div class="filter-tags" data-select="'+n.key+'" data-index="'+m+'">';
      htmlFilter +=		            		'<span>'+n.label+': </span><b></b>';
      htmlFilter +=										'<span class="filter-tags--remove"><svg class="icon-close" viewBox="0 0 19 19" role="presentation"><path d="M9.1923882 8.39339828l7.7781745-7.7781746 1.4142136 1.41421357-7.7781746 7.77817459 7.7781746 7.77817456L16.9705627 19l-7.7781745-7.7781746L1.41421356 19 0 17.5857864l7.7781746-7.77817456L0 2.02943725 1.41421356.61522369 9.1923882 8.39339828z" fill="currentColor" fill-rule="evenodd"></path></svg></span>';
      htmlFilter +=									'</div>';
			});
			
      htmlFilter +=									'<div class="filter-tags filter-tags--remove-all opened"><span>XÃ³a bá»™ lá»c</span></div>';
      htmlFilter += 							'</div>';
      htmlFilter +=							'</div>';
    	htmlFilter +=						'</div>';
      htmlFilter +=						'<div class="filter-tags-btn"><a class="filter-btn-close" href="#"><svg class="icon-close" viewBox="0 0 19 19" role="presentation"><path d="M9.1923882 8.39339828l7.7781745-7.7781746 1.4142136 1.41421357-7.7781746 7.77817459 7.7781746 7.77817456L16.9705627 19l-7.7781745-7.7781746L1.41421356 19 0 17.5857864l7.7781746-7.77817456L0 2.02943725 1.41421356.61522369 9.1923882 8.39339828z" fill="currentColor" fill-rule="evenodd"></path></svg><span>ÄÃ³ng</span></a></div>';
			htmlFilter +=      		'</div>';
      htmlFilter +=					'<div class="filter-total--content-body">';
      htmlFilter +=						'<div class="list-filter--main">';
			
			$.each(rs,function(m,n){
      htmlFilter +=							'<div data-param="'+n.key+'" class="filter-group '+n.key+'-group">';
      htmlFilter +=								'<div class="filter-group--block">';
      htmlFilter +=									'<div class="filter-group--title jsTitle">';
      htmlFilter +=										'<span data-text="'+n.label+'">'+n.label+'</span><span class="icon-control"></span><span class="icon-arrow"></span>';
      htmlFilter +=									'</div>';
      htmlFilter +=									'<div id="filter-group--'+n.key+'" class="filter-group--content filter-'+n.key+'">';
      htmlFilter +=										'<ul class="checkbox-list">';
			$.each(n.values, function(k,v){
     	htmlFilter +=											'<li data-count="'+v.count+'">';
      htmlFilter +=												'<input type="checkbox" id="data-'+n.key+'-p'+k+'" value="'+v.value+'" name="'+n.key+'-filter" data-key="'+n.key+'">';
      htmlFilter +=												'<label for="data-'+n.key+'-p'+k+'">'+v.label+'</label>';
      htmlFilter +=											'</li>';
      });       
			if(n.values.length > 10){
     	htmlFilter +=											'<li class="list-more li-active"><label>Xem thÃªm <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" x="0" y="0" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path d="M506.134,241.843c-0.006-0.006-0.011-0.013-0.018-0.019l-104.504-104c-7.829-7.791-20.492-7.762-28.285,0.068c-7.792,7.829-7.762,20.492,0.067,28.284L443.558,236H20c-11.046,0-20,8.954-20,20c0,11.046,8.954,20,20,20h423.557l-70.162,69.824c-7.829,7.792-7.859,20.455-0.067,28.284c7.793,7.831,20.457,7.858,28.285,0.068l104.504-104c0.006-0.006,0.011-0.013,0.018-0.019C513.968,262.339,513.943,249.635,506.134,241.843z" fill="" data-original="" class=""></path></g></svg></label></li>';
			}
			htmlFilter +=										'</ul>';
      htmlFilter +=									'</div>';
      htmlFilter +=								'</div>';
      htmlFilter +=							'</div>';
			});
				
      htmlFilter +=						'</div>';
      htmlFilter +=						'<div class="filter-control filter-button--total">';
      htmlFilter +=							'<div class="filter-button">';
      htmlFilter +=								'<a href="javascript:void(0)" class="btn-filter--unselect d-none" data-check="filter-total">Bá» chá»n</a>';
      htmlFilter +=								'<a href="javascript:void(0)" class="btn-filter--apply" data-check="filter-total"> Xem káº¿t quáº£ <span class="chevron-arrow"><svg viewBox="0 0 7 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 11.5L6 6.5L1 1.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg><svg viewBox="0 0 7 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 11.5L6 6.5L1 1.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg><svg viewBox="0 0 7 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 11.5L6 6.5L1 1.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span></a>';
      htmlFilter +=							'</div>';
      htmlFilter +=						'</div>';
      htmlFilter +=					'</div>';
      htmlFilter +=				'</div>';
    	htmlFilter +=			'</div>';
    	htmlFilter +=			'<div class="filter-single">';
      htmlFilter +=				'<div class="list-filter--main">';
      
			$.each(rs,function(m,n){
      htmlFilter +=					'<div data-param="'+n.key+'" class="filter-group '+n.key+'-group">';
      htmlFilter +=						'<div class="filter-group--block">';
      htmlFilter +=							'<div class="filter-group--title jsTitle">';
      htmlFilter +=								'<span data-text="'+n.label+'">'+n.label+'</span><span class="icon-control"></span><span class="icon-arrow"></span>';
      htmlFilter +=							'</div>';
      htmlFilter +=							'<div id="filter-group--'+n.key+'" class="filter-group--content filter-'+n.key+'">';
      htmlFilter +=								'<ul class="checkbox-list checkbox-list-single">';
			$.each(n.values, function(k,v){
      htmlFilter +=									'<li data-count="'+v.count+'">';
      htmlFilter +=										'<input type="checkbox" id="sub-data-'+n.key+'-p'+k+'" value="'+v.value+'" name="'+n.key+'-filter" data-key="'+n.key+'">';
      htmlFilter +=										'<label for="sub-data-'+n.key+'-p'+k+'">'+v.label+'</label>';
      htmlFilter +=									'</li>';
      });       
			if(n.values.length > 10){ 
      htmlFilter +=									'<li class="list-more li-active"><label>Xem thÃªm <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" x="0" y="0" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path d="M506.134,241.843c-0.006-0.006-0.011-0.013-0.018-0.019l-104.504-104c-7.829-7.791-20.492-7.762-28.285,0.068c-7.792,7.829-7.762,20.492,0.067,28.284L443.558,236H20c-11.046,0-20,8.954-20,20c0,11.046,8.954,20,20,20h423.557l-70.162,69.824c-7.829,7.792-7.859,20.455-0.067,28.284c7.793,7.831,20.457,7.858,28.285,0.068l104.504-104c0.006-0.006,0.011-0.013,0.018-0.019C513.968,262.339,513.943,249.635,506.134,241.843z" fill="" data-original="" class=""></path></g></svg></label></li>';
			}
     	htmlFilter +=								'</ul>';
     	htmlFilter +=								'<div class="filter-control filter-button--single">';
      htmlFilter +=									'<div class="filter-button">';
      htmlFilter +=										'<a href="javascript:void(0)" class="btn-filter--unselect d-none" data-check="filter-single">Bá» chá»n</a>';
      htmlFilter +=										'<a href="javascript:void(0)" class="btn-filter--apply" data-check="filter-single">Xem káº¿t quáº£ </a>';
      htmlFilter +=									'</div>';
      htmlFilter +=								'</div>';
      htmlFilter +=							'</div>';
      htmlFilter +=						'</div>';
      htmlFilter +=					'</div>';
			});
				
      htmlFilter +=				'</div>';
    	htmlFilter +=			'</div>';
  		htmlFilter +=		'</div>';
			htmlFilter +=	'</div>';			
						
			return htmlFilter;
		}
		function render_item(r,m,n){
			var vrid = '';
			$.each(r[n].variants, function(key,val){
				vrid = key; return false
			});
			
			var sticker_lb = '';
			gvn_cover.left_bottom.tag.map((value,index) => {
				if(value != "null" && r[n].tags != null){
					if(r[n].tags.includes(value) && sticker_lb == ''){
						sticker_lb = gvn_cover.left_bottom.icon[index];
					}
				}
			});
			var frame = '';
			gvn_cover.frame.tag.map((value,index) => {
				if(value != "null" && r[n].tags != null){
					if(r[n].tags.includes(value) && frame == ''){
						frame = gvn_cover.frame.icon[index];
					}
				}
			});
			
			var arrCheckTagTech 				= ['hl_ins','hl_cpu','hl_vga','hl_main','hl_ram','hl_ssd','hl_lcd','hl_hz','hl_res','hl_panel','hl_pin','hl_weight','hl_connect','hl_led','hl_size','hl_keycap','hl_material','hl_length','hl_width','hl_height','hl_typehp','hl_connector'];
			var arrCheckTagLabelTop  		= ['hl_ins1:0','hl_ship:4h','hl_prod:pre-order','hl_gift:hot'];
			var arrCheckTagLabelBottom  = ['hl_prod:bestseller','hl_prod:new','hl_ship:freeship'];
			var arrCheckTagprice  			= ['hl_price:'];
			
			var arrIconTagTech = {
				'hl_cpu': '<svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.75 5.01732C8.75 5.86605 8.75 6.71478 8.75 7.57217C8.75 8.28233 8.29099 8.75 7.58083 8.75C5.85739 8.75 4.14261 8.75 2.41917 8.75C1.71767 8.75 1.25 8.29099 1.25 7.58949C1.25 5.86605 1.25 4.15127 1.25 2.42783C1.25 1.71767 1.73499 1.25 2.44515 1.25C4.15127 1.25 5.85739 1.25 7.56351 1.25C8.27367 1.25 8.75 1.71767 8.75 2.42783C8.75 3.28522 8.75 4.15127 8.75 5.01732ZM5.01732 2.48845C4.48037 2.48845 3.95208 2.50577 3.42379 2.47979C2.95612 2.46247 2.47979 2.84353 2.48845 3.42379C2.49711 4.47171 2.48845 5.51963 2.48845 6.56755C2.48845 7.13914 2.83487 7.50288 3.40647 7.51155C4.47171 7.52021 5.52829 7.52021 6.59353 7.51155C7.15646 7.50288 7.51154 7.16512 7.52021 6.60219C7.53753 5.53695 7.52887 4.46305 7.52021 3.3978C7.52021 2.79157 7.02656 2.46247 6.56755 2.47979C6.04792 2.50577 5.52829 2.48845 5.01732 2.48845Z" fill="#6D6E72"/><path d="M9.55476 4.47915H8.125V3.26831H9.55476C9.79933 3.26831 10 3.53927 10 3.8695C10 4.20819 9.79933 4.47915 9.55476 4.47915Z" fill="#6D6E72"/><path d="M9.55476 6.73142H8.125V5.52905H9.55476C9.79933 5.52905 10 5.80001 10 6.13024C10 6.46047 9.79933 6.73142 9.55476 6.73142Z" fill="#6D6E72"/><path d="M0.44375 5.52905H1.875V6.73989H0.44375C0.2 6.73142 0 6.46047 0 6.13024C0 5.80001 0.2 5.52905 0.44375 5.52905Z" fill="#6D6E72"/><path d="M0.44375 3.26831H1.875V4.47915H0.44375C0.2 4.47915 0 4.20819 0 3.8695C0 3.53927 0.2 3.26831 0.44375 3.26831Z" fill="#6D6E72"/><path d="M4.47927 0.44375V1.875H3.26843V0.44375C3.26843 0.2 3.53939 0 3.86962 0C4.20831 0 4.47927 0.2 4.47927 0.44375Z" fill="#6D6E72"/><path d="M6.73167 0.44375V1.875H5.5293V0.44375C5.5293 0.2 5.80025 0 6.13048 0C6.46071 0 6.73167 0.2 6.73167 0.44375Z" fill="#6D6E72"/><path d="M5.5293 9.55477V8.125H6.74013V9.55477C6.74013 9.79934 6.46918 10 6.13895 10C5.80025 10 5.5293 9.79934 5.5293 9.55477Z" fill="#6D6E72"/><path d="M3.26843 9.55477V8.125H4.47927V9.55477C4.47927 9.79934 4.20831 10 3.87809 10C3.53939 10 3.26843 9.79934 3.26843 9.55477Z" fill="#6D6E72"/><path d="M6.875 4.99588C6.875 5.42445 6.875 5.86126 6.875 6.28983C6.875 6.64423 6.65247 6.875 6.28983 6.875C5.42445 6.875 4.55906 6.875 3.70192 6.875C3.35577 6.875 3.125 6.64423 3.125 6.29808C3.125 5.43269 3.125 4.56731 3.125 3.71016C3.125 3.35577 3.35577 3.125 3.71016 3.125C4.57555 3.125 5.44093 3.125 6.29808 3.125C6.64423 3.125 6.875 3.35577 6.875 3.70192C6.875 4.13874 6.875 4.56731 6.875 4.99588Z" fill="#6D6E72"/></svg>',
				'hl_vga': '<svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.6875 8.37201H9.375V9.21545C9.375 9.29159 9.34408 9.35748 9.28223 9.41312C9.22038 9.46877 9.14714 9.49659 9.0625 9.49659C8.97786 9.49659 8.90462 9.46877 8.84277 9.41312C8.78092 9.35748 8.75 9.29159 8.75 9.21545V8.37201H8.125V9.21545C8.125 9.29159 8.09408 9.35748 8.03223 9.41312C7.97038 9.46877 7.89714 9.49659 7.8125 9.49659C7.72786 9.49659 7.65462 9.46877 7.59277 9.41312C7.53092 9.35748 7.5 9.29159 7.5 9.21545V8.37201H6.875V9.21545C6.875 9.29159 6.84408 9.35748 6.78223 9.41312C6.72038 9.46877 6.64714 9.49659 6.5625 9.49659C6.47786 9.49659 6.40462 9.46877 6.34277 9.41312C6.28092 9.35748 6.25 9.29159 6.25 9.21545V8.37201H5.625V9.21545C5.625 9.29159 5.59408 9.35748 5.53223 9.41312C5.47038 9.46877 5.39714 9.49659 5.3125 9.49659C5.22786 9.49659 5.15462 9.46877 5.09277 9.41312C5.03092 9.35748 5 9.29159 5 9.21545V8.37201H4.375V9.21545C4.375 9.29159 4.34408 9.35748 4.28223 9.41312C4.22038 9.46877 4.14714 9.49659 4.0625 9.49659C3.97786 9.49659 3.90462 9.46877 3.84277 9.41312C3.78092 9.35748 3.75 9.29159 3.75 9.21545V8.37201H3.125V9.21545C3.125 9.29159 3.09408 9.35748 3.03223 9.41312C2.97038 9.46877 2.89714 9.49659 2.8125 9.49659C2.72786 9.49659 2.65462 9.46877 2.59277 9.41312C2.53092 9.35748 2.5 9.29159 2.5 9.21545V8.37201H1.25L1.04492 1.70176H9.6875C9.77214 1.70176 9.84538 1.72958 9.90723 1.78523C9.96908 1.84087 10 1.90676 10 1.98291V8.09087C10 8.16701 9.96908 8.23291 9.90723 8.28855C9.84538 8.34419 9.77214 8.37201 9.6875 8.37201ZM9.375 3.31143C9.375 3.15915 9.31478 3.02736 9.19434 2.91608C9.07389 2.80479 8.92578 2.74915 8.75 2.74915H4.375C4.20573 2.74915 4.05924 2.80479 3.93555 2.91608C3.81185 3.02736 3.75 3.15915 3.75 3.31143V6.68515C3.75 6.8433 3.81185 6.97655 3.93555 7.08491C4.05924 7.19326 4.20573 7.24744 4.375 7.24744H8.75C8.92578 7.24744 9.07389 7.19326 9.19434 7.08491C9.31478 6.97655 9.375 6.8433 9.375 6.68515V3.31143ZM8.4375 6.68515H4.6875C4.60286 6.68515 4.52962 6.65733 4.46777 6.60169C4.40592 6.54605 4.375 6.48015 4.375 6.40401V3.59258C4.375 3.51644 4.40592 3.45054 4.46777 3.3949C4.52962 3.33926 4.60286 3.31143 4.6875 3.31143H8.4375C8.52214 3.31143 8.59538 3.33926 8.65723 3.3949C8.71908 3.45054 8.75 3.51644 8.75 3.59258V6.40401C8.75 6.48015 8.71908 6.54605 8.65723 6.60169C8.59538 6.65733 8.52214 6.68515 8.4375 6.68515ZM6.875 3.87372C6.52995 3.87372 6.23535 3.98354 5.99121 4.20319C5.74707 4.42283 5.625 4.68787 5.625 4.99829C5.625 5.30872 5.74707 5.57376 5.99121 5.7934C6.23535 6.01305 6.52995 6.12287 6.875 6.12287C7.22005 6.12287 7.51465 6.01305 7.75879 5.7934C8.00293 5.57376 8.125 5.30872 8.125 4.99829C8.125 4.68787 8.00293 4.42283 7.75879 4.20319C7.51465 3.98354 7.22005 3.87372 6.875 3.87372ZM6.87988 5.56058C6.70736 5.56058 6.55924 5.5064 6.43555 5.39805C6.31185 5.28969 6.25 5.1579 6.25 5.00269C6.25 4.84747 6.31185 4.71422 6.43555 4.60294C6.55924 4.49165 6.70736 4.43601 6.87988 4.43601C7.05241 4.43601 7.19889 4.49019 7.31934 4.59854C7.43978 4.7069 7.5 4.84015 7.5 4.99829C7.5 5.15644 7.43978 5.28969 7.31934 5.39805C7.19889 5.5064 7.05241 5.56058 6.87988 5.56058ZM1.65527 7.52356V9.21545C1.65527 9.29159 1.62435 9.35748 1.5625 9.41312C1.43723 9.52582 1.02214 9.49659 0.9375 9.49659C0.852865 9.49659 0.779622 9.46877 0.717773 9.41312C0.655924 9.35748 0.625 9.29159 0.625 9.21545V1.14261H0.3125C0.227865 1.14261 0.154622 1.11479 0.0927734 1.05915C0.0309245 1.00351 0 0.89745 0 0.821307C0 0.668184 0.0309245 0.639108 0.0927734 0.583465C0.154622 0.527822 0.227865 0.5 0.3125 0.5H0.9375C0.963542 0.5 0.983073 0.502929 0.996094 0.508786C1.25 0.5 1.25 0.5 1.5625 0.5C1.875 0.5 1.875 0.751021 1.875 0.821307L1.65527 7.52356Z" fill="#6D6E72"/></svg>',
				'hl_pin': '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none"><g width="10" height="10" fill="white"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.5 2.49984C2.49993 2.2896 2.57934 2.0871 2.72229 1.93294C2.86524 1.77878 3.06118 1.68436 3.27083 1.66859L3.33333 1.6665L3.75 1.6665C3.74993 1.45626 3.82934 1.25377 3.97229 1.09961C4.11524 0.94545 4.31118 0.851022 4.52083 0.835254L4.58333 0.833171L5.41667 0.833171C5.62691 0.833104 5.8294 0.912507 5.98356 1.05546C6.13772 1.19842 6.23215 1.39436 6.24792 1.604L6.25 1.6665L6.66667 1.6665C6.87691 1.66644 7.0794 1.74584 7.23356 1.88879C7.38772 2.03175 7.48215 2.22769 7.49792 2.43734L7.5 2.49984L7.5 8.33317C7.50007 8.54341 7.42066 8.74591 7.27771 8.90007C7.13476 9.05422 6.93881 9.14865 6.72917 9.16442L6.66667 9.1665L3.33333 9.1665C3.12309 9.16657 2.9206 9.08717 2.76644 8.94421C2.61228 8.80126 2.51785 8.60532 2.50208 8.39567L2.5 8.33317L2.5 2.49984ZM3.75 7.49984C3.75001 7.60189 3.78748 7.70039 3.8553 7.77666C3.92311 7.85292 4.01656 7.90165 4.11792 7.91359L4.16667 7.9165L5.83333 7.9165C5.93953 7.91639 6.04168 7.87572 6.1189 7.80282C6.19613 7.72991 6.2426 7.63027 6.24882 7.52426C6.25505 7.41824 6.22055 7.31385 6.15239 7.23241C6.08423 7.15097 5.98754 7.09863 5.88208 7.08609L5.83333 7.08317L4.16667 7.08317C4.05616 7.08317 3.95018 7.12707 3.87204 7.20521C3.7939 7.28335 3.75 7.38933 3.75 7.49984ZM3.75 6.24984C3.75 6.36034 3.7939 6.46632 3.87204 6.54447C3.95018 6.62261 4.05616 6.6665 4.16667 6.6665L5.83333 6.6665C5.94384 6.6665 6.04982 6.6226 6.12796 6.54446C6.2061 6.46632 6.25 6.36034 6.25 6.24984C6.25 6.13933 6.2061 6.03335 6.12796 5.95521C6.04982 5.87707 5.94384 5.83317 5.83333 5.83317L4.16667 5.83317C4.05616 5.83317 3.95018 5.87707 3.87204 5.95521C3.7939 6.03335 3.75 6.13933 3.75 6.24984Z" fill="#6D6E72"/></g></svg>',
				'hl_weight': '<svg xmlns="http://www.w3.org/2000/svg" width="9" height="8" viewBox="0 0 9 8" fill="none"><path d="M4.16667 0.25C4.60869 0.25 5.03262 0.425595 5.34518 0.738155C5.65774 1.05072 5.83333 1.47464 5.83333 1.91667C5.83333 2.22083 5.75417 2.50417 5.60833 2.75H6.66667C7.0625 2.75 7.39583 3.02917 7.47917 3.4C8.31667 6.7375 8.33333 6.825 8.33333 6.91667C8.33333 7.13768 8.24554 7.34964 8.08926 7.50592C7.93297 7.6622 7.72101 7.75 7.5 7.75H0.833333C0.61232 7.75 0.400358 7.6622 0.244078 7.50592C0.0877973 7.34964 0 7.13768 0 6.91667C0 6.825 0.0166667 6.7375 0.854167 3.4C0.9375 3.02917 1.27083 2.75 1.66667 2.75H2.725C2.57605 2.49767 2.4983 2.20968 2.5 1.91667C2.5 1.47464 2.67559 1.05072 2.98816 0.738155C3.30072 0.425595 3.72464 0.25 4.16667 0.25ZM4.16667 1.08333C3.94565 1.08333 3.73369 1.17113 3.57741 1.32741C3.42113 1.48369 3.33333 1.69565 3.33333 1.91667C3.33333 2.13768 3.42113 2.34964 3.57741 2.50592C3.73369 2.6622 3.94565 2.75 4.16667 2.75C4.38768 2.75 4.59964 2.6622 4.75592 2.50592C4.9122 2.34964 5 2.13768 5 1.91667C5 1.69565 4.9122 1.48369 4.75592 1.32741C4.59964 1.17113 4.38768 1.08333 4.16667 1.08333Z" fill="#6D6E72"/></svg>',
				'hl_main': '<svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.33333 9.06248C5.51743 9.06248 5.66667 8.91324 5.66667 8.72915C5.66667 8.54505 5.51743 8.39581 5.33333 8.39581C5.14924 8.39581 5 8.54505 5 8.72915C5 8.91324 5.14924 9.06248 5.33333 9.06248Z" fill="#6D6E72"/><path d="M4.66675 1.0625H5.00008V1.39583H4.66675V1.0625Z" fill="#6D6E72"/><path d="M3.33325 1.0625H3.66659V1.39583H3.33325V1.0625Z" fill="#6D6E72"/><path d="M4 3.0625H5.66667V4.72917H4V3.0625Z" fill="#6D6E72"/><path d="M6.33325 2.39581H3.33325V5.39581H6.33325V2.39581ZM5.99992 4.89581C5.99992 4.94002 5.98236 4.98241 5.9511 5.01366C5.91985 5.04492 5.87745 5.06248 5.83325 5.06248H3.83325C3.78905 5.06248 3.74666 5.04492 3.7154 5.01366C3.68414 4.98241 3.66659 4.94002 3.66659 4.89581V2.89581C3.66659 2.85161 3.68414 2.80922 3.7154 2.77796C3.74666 2.74671 3.78905 2.72915 3.83325 2.72915H5.83325C5.87745 2.72915 5.91985 2.74671 5.9511 2.77796C5.98236 2.80922 5.99992 2.85161 5.99992 2.89581V4.89581Z" fill="#6D6E72"/><path d="M6 1.0625H6.33333V1.39583H6V1.0625Z" fill="#6D6E72"/><path d="M7.33325 4.22919H7.66659V5.72919H7.33325V4.22919Z" fill="#6D6E72"/><path d="M4.33325 7.0625H8.66659V7.39583H4.33325V7.0625Z" fill="#6D6E72"/><path d="M3.33325 7.0625H3.99992V7.39583H3.33325V7.0625Z" fill="#6D6E72"/><path d="M8.66675 4.22919H9.00008V5.72919H8.66675V4.22919Z" fill="#6D6E72"/><path d="M7.33325 1.39581H7.66659V3.89581H7.33325V1.39581Z" fill="#6D6E72"/><path d="M8.66675 1.39581H9.00008V3.89581H8.66675V1.39581Z" fill="#6D6E72"/><path d="M9.83333 0.0625H0.666667C0.622464 0.0625 0.580072 0.0800595 0.548816 0.111316C0.51756 0.142572 0.5 0.184964 0.5 0.229167V2.0625H0V2.39583H0.5V2.72917H0.166667C0.122464 2.72917 0.0800716 2.74673 0.0488155 2.77798C0.0175595 2.80924 0 2.85163 0 2.89583V4.22917C0 4.27337 0.0175595 4.31576 0.0488155 4.34702C0.0800716 4.37827 0.122464 4.39583 0.166667 4.39583H0.5V4.72917H0V5.0625H0.5V9.89583C0.5 9.94004 0.51756 9.98243 0.548816 10.0137C0.580072 10.0449 0.622464 10.0625 0.666667 10.0625H9.83333C9.87754 10.0625 9.91993 10.0449 9.95118 10.0137C9.98244 9.98243 10 9.94004 10 9.89583V0.229167C10 0.184964 9.98244 0.142572 9.95118 0.111316C9.91993 0.0800595 9.87754 0.0625 9.83333 0.0625ZM7 1.22917C7 1.18496 7.01756 1.14257 7.04882 1.11132C7.08007 1.08006 7.12246 1.0625 7.16667 1.0625H7.33333V0.729167H7.66667V1.0625H7.83333C7.87754 1.0625 7.91993 1.08006 7.95118 1.11132C7.98244 1.14257 8 1.18496 8 1.22917V5.89583C8 5.94004 7.98244 5.98243 7.95118 6.01368C7.91993 6.04494 7.87754 6.0625 7.83333 6.0625H7.66667V6.39583H7.33333V6.0625H7.16667C7.12246 6.0625 7.08007 6.04494 7.04882 6.01368C7.01756 5.98243 7 5.94004 7 5.89583V1.22917ZM5.66667 0.895833C5.66667 0.851631 5.68423 0.809238 5.71548 0.777982C5.74674 0.746726 5.78913 0.729167 5.83333 0.729167H6.5C6.5442 0.729167 6.5866 0.746726 6.61785 0.777982C6.64911 0.809238 6.66667 0.851631 6.66667 0.895833V1.5625C6.66667 1.6067 6.64911 1.6491 6.61785 1.68035C6.5866 1.71161 6.5442 1.72917 6.5 1.72917H5.83333C5.78913 1.72917 5.74674 1.71161 5.71548 1.68035C5.68423 1.6491 5.66667 1.6067 5.66667 1.5625V0.895833ZM4.33333 0.895833C4.33333 0.851631 4.35089 0.809238 4.38215 0.777982C4.4134 0.746726 4.4558 0.729167 4.5 0.729167H5.16667C5.21087 0.729167 5.25326 0.746726 5.28452 0.777982C5.31577 0.809238 5.33333 0.851631 5.33333 0.895833V1.5625C5.33333 1.6067 5.31577 1.6491 5.28452 1.68035C5.25326 1.71161 5.21087 1.72917 5.16667 1.72917H4.5C4.4558 1.72917 4.4134 1.71161 4.38215 1.68035C4.35089 1.6491 4.33333 1.6067 4.33333 1.5625V0.895833ZM3 0.895833C3 0.851631 3.01756 0.809238 3.04882 0.777982C3.08007 0.746726 3.12246 0.729167 3.16667 0.729167H3.83333C3.87754 0.729167 3.91993 0.746726 3.95118 0.777982C3.98244 0.809238 4 0.851631 4 0.895833V1.5625C4 1.6067 3.98244 1.6491 3.95118 1.68035C3.91993 1.71161 3.87754 1.72917 3.83333 1.72917H3.16667C3.12246 1.72917 3.08007 1.71161 3.04882 1.68035C3.01756 1.6491 3 1.6067 3 1.5625V0.895833ZM3 2.22917C3 2.18496 3.01756 2.14257 3.04882 2.11132C3.08007 2.08006 3.12246 2.0625 3.16667 2.0625H6.5C6.5442 2.0625 6.5866 2.08006 6.61785 2.11132C6.64911 2.14257 6.66667 2.18496 6.66667 2.22917V5.5625C6.66667 5.6067 6.64911 5.6491 6.61785 5.68035C6.5866 5.71161 6.5442 5.72917 6.5 5.72917H3.16667C3.12246 5.72917 3.08007 5.71161 3.04882 5.68035C3.01756 5.6491 3 5.6067 3 5.5625V2.22917ZM6.33333 6.0625V6.39583H6V6.0625H6.33333ZM5.66667 6.0625V6.39583H5.33333V6.0625H5.66667ZM5 6.0625V6.39583H4.66667V6.0625H5ZM4.33333 6.0625V6.39583H4V6.0625H4.33333ZM3.66667 6.0625V6.39583H3.33333V6.0625H3.66667ZM0.833333 1.0625H1.5V1.39583H0.833333V1.0625ZM0.833333 2.39583H1.5V4.72917H0.833333V4.39583H1C1.0442 4.39583 1.0866 4.37827 1.11785 4.34702C1.14911 4.31576 1.16667 4.27337 1.16667 4.22917V2.89583C1.16667 2.85163 1.14911 2.80924 1.11785 2.77798C1.0866 2.74673 1.0442 2.72917 1 2.72917H0.833333V2.39583ZM1.5 5.72917V6.0625H0.833333V5.72917H1.5ZM0.333333 4.0625V3.0625H0.833333V4.0625H0.333333ZM1.5 9.22917H1.16667V8.89583H1.5V9.22917ZM1.5 8.5625H1.16667V8.22917H1.5V8.5625ZM2.16667 9.22917H1.83333V8.89583H2.16667V9.22917ZM2.16667 8.5625H1.83333V8.22917H2.16667V8.5625ZM2.16667 7.39583H0.833333V7.0625H2.16667V7.39583ZM2.66667 4.39583H2.16667V4.0625H2.66667V4.39583ZM2.66667 3.72917H2.16667V3.39583H2.66667V3.72917ZM2.66667 3.0625H2.16667V2.72917H2.66667V3.0625ZM2.66667 2.39583H2.16667V2.0625H2.66667V2.39583ZM2.66667 1.72917H2.16667V1.39583H2.66667V1.72917ZM2.66667 1.0625H2.16667V0.729167H2.66667V1.0625ZM4.33333 9.22917H2.83333V8.89583H4.33333V9.22917ZM4.33333 8.5625H2.83333V8.22917H4.33333V8.5625ZM5.33333 9.39583C5.20148 9.39583 5.07259 9.35673 4.96295 9.28348C4.85332 9.21023 4.76787 9.10611 4.71741 8.98429C4.66696 8.86247 4.65375 8.72843 4.67948 8.59911C4.7052 8.46979 4.76869 8.351 4.86193 8.25776C4.95516 8.16453 5.07395 8.10103 5.20327 8.07531C5.33259 8.04959 5.46664 8.06279 5.58846 8.11325C5.71027 8.16371 5.81439 8.24915 5.88765 8.35879C5.9609 8.46842 6 8.59731 6 8.72917C5.9998 8.90592 5.9295 9.07537 5.80452 9.20035C5.67954 9.32533 5.51008 9.39564 5.33333 9.39583ZM6.66667 9.22917H6.33333V8.89583H6.66667V9.22917ZM6.66667 8.5625H6.33333V8.22917H6.66667V8.5625ZM7.33333 9.22917H7V8.89583H7.33333V9.22917ZM7.33333 8.5625H7V8.22917H7.33333V8.5625ZM9.33333 8.5625H9V8.89583H9.33333V9.22917H9C9 9.27337 8.98244 9.31576 8.95118 9.34702C8.91993 9.37827 8.87754 9.39583 8.83333 9.39583H8.16667C8.12246 9.39583 8.08007 9.37827 8.04882 9.34702C8.01756 9.31576 8 9.27337 8 9.22917H7.66667V8.89583H8V8.5625H7.66667V8.22917H8C8 8.18496 8.01756 8.14257 8.04882 8.11132C8.08007 8.08006 8.12246 8.0625 8.16667 8.0625H8.83333C8.87754 8.0625 8.91993 8.08006 8.95118 8.11132C8.98244 8.14257 9 8.18496 9 8.22917H9.33333V8.5625ZM9.33333 7.39583H9V7.5625C9 7.6067 8.98244 7.6491 8.95118 7.68035C8.91993 7.71161 8.87754 7.72917 8.83333 7.72917H3.16667C3.12246 7.72917 3.08007 7.71161 3.04882 7.68035C3.01756 7.6491 3 7.6067 3 7.5625V6.89583C3 6.85163 3.01756 6.80924 3.04882 6.77798C3.08007 6.74673 3.12246 6.72917 3.16667 6.72917H8.83333C8.87754 6.72917 8.91993 6.74673 8.95118 6.77798C8.98244 6.80924 9 6.85163 9 6.89583V7.0625H9.33333V7.39583ZM9.33333 5.89583C9.33333 5.94004 9.31577 5.98243 9.28452 6.01368C9.25326 6.04494 9.21087 6.0625 9.16667 6.0625H9V6.39583H8.66667V6.0625H8.5C8.4558 6.0625 8.41341 6.04494 8.38215 6.01368C8.35089 5.98243 8.33333 5.94004 8.33333 5.89583V1.22917C8.33333 1.18496 8.35089 1.14257 8.38215 1.11132C8.41341 1.08006 8.4558 1.0625 8.5 1.0625H8.66667V0.729167H9V1.0625H9.16667C9.21087 1.0625 9.25326 1.08006 9.28452 1.11132C9.31577 1.14257 9.33333 1.18496 9.33333 1.22917V5.89583Z" fill="#6D6E72"/><path d="M8.33325 8.39581H8.66659V9.06248H8.33325V8.39581Z" fill="#6D6E72"/></svg>',
				'hl_ram': '<svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_5706_2977)"><path d="M0.807138 6.03778C0.483498 5.988 0.211453 5.78889 0.0754307 5.35956C0.0285264 5.204 0.00507422 5.01733 0.00507422 4.84311C0.000383788 3.79778 0.000383788 2.74622 0.00507422 1.69467C0.00507422 0.954222 0.347476 0.5 0.900947 0.5C3.63078 0.5 6.36061 0.5 9.09044 0.5C9.6486 0.5 9.991 0.948 9.991 1.68844C9.99569 2.72756 9.991 3.76667 9.991 4.812C9.991 5.484 9.75648 5.86978 9.2593 6.01911C9.23115 6.02533 9.20301 6.044 9.1608 6.05644C9.1608 6.36133 9.1608 6.66622 9.1608 6.96489C9.1608 7.37556 9.07637 7.49378 8.7668 7.49378C7.41127 7.5 6.06042 7.49378 4.70489 7.49378C3.56511 7.49378 2.42534 7.49378 1.28556 7.49378C0.891566 7.49378 0.8259 7.40044 0.821209 6.87778C0.821209 6.62267 0.821209 6.36756 0.821209 6.11244C0.83059 6.1 0.821209 6.08133 0.807138 6.03778ZM1.12609 4.68756C1.12609 4.79956 1.19175 4.89289 1.28087 4.89289C1.78744 4.90533 3.3259 4.91778 4.18894 4.924C4.34372 4.924 4.44691 4.82444 4.44691 4.66889C4.44691 3.93467 4.4516 2.57822 4.4516 1.956C4.4516 1.77556 4.33903 1.63244 4.20301 1.63244H1.28556C1.20113 1.63244 1.13078 1.72578 1.13078 1.83778L1.12609 4.68756ZM8.86999 4.60044V1.94356C8.86999 1.77556 8.7668 1.63867 8.64016 1.63867H5.80245C5.67581 1.63867 5.57262 1.77556 5.57262 1.94356V4.60044C5.57262 4.76844 5.67581 4.90533 5.80245 4.90533H8.64016C8.7668 4.90533 8.86999 4.76844 8.86999 4.60044ZM1.93284 6.05022C1.74522 6.05022 1.58106 6.05022 1.40751 6.05022C1.40751 6.29289 1.40751 6.51067 1.40751 6.74089C1.58575 6.74089 1.75461 6.74089 1.93284 6.74089C1.93284 6.51067 1.93284 6.28667 1.93284 6.05022ZM3.03978 6.05022C2.85686 6.05022 2.688 6.05022 2.51446 6.05022C2.51446 6.29289 2.51446 6.51067 2.51446 6.74711C2.69269 6.74711 2.85686 6.74711 3.03978 6.74711C3.03978 6.51067 3.03978 6.29289 3.03978 6.05022ZM3.6214 6.74089C3.8137 6.74089 3.97787 6.74089 4.15142 6.74089C4.15142 6.49822 4.15142 6.28044 4.15142 6.05644C3.96849 6.05644 3.79963 6.05644 3.6214 6.05644C3.6214 6.29911 3.6214 6.51067 3.6214 6.74089ZM5.26305 6.05022C5.07543 6.05022 4.91127 6.05022 4.73772 6.05022C4.73772 6.29289 4.73772 6.51067 4.73772 6.74711C4.91596 6.74711 5.08481 6.74711 5.26305 6.74711C5.26305 6.51067 5.26305 6.29289 5.26305 6.05022ZM6.37468 6.05022C6.18706 6.05022 6.01821 6.05022 5.84466 6.05022C5.84466 6.29289 5.84466 6.51067 5.84466 6.74089C6.02759 6.74089 6.20114 6.74089 6.37468 6.74089C6.37468 6.50444 6.37468 6.29289 6.37468 6.05022ZM6.96568 6.044C6.96568 6.29289 6.96568 6.52311 6.96568 6.74089C7.15329 6.74089 7.31746 6.74089 7.48162 6.74089C7.48162 6.49822 7.48162 6.28044 7.48162 6.044C7.30339 6.044 7.14391 6.044 6.96568 6.044ZM8.06324 6.73467C8.24147 6.73467 8.41033 6.73467 8.58856 6.73467C8.58856 6.49822 8.58856 6.27422 8.58856 6.05022C8.40564 6.05022 8.23678 6.05022 8.06324 6.05022C8.06324 6.28667 8.06324 6.49822 8.06324 6.73467Z" fill="#6D6E72"/><path d="M2.27955 4.17114H1.89025C1.77768 4.17114 1.68387 4.0467 1.68387 3.89737V2.64048C1.68387 2.48492 1.77768 2.3667 1.89025 2.3667H2.27955C2.39212 2.3667 2.48593 2.48492 2.48593 2.64048V3.89737C2.48593 4.0467 2.39212 4.17114 2.27955 4.17114Z" fill="#6D6E72"/><path d="M3.66792 4.17114H3.27861C3.16604 4.17114 3.07224 4.0467 3.07224 3.89737V2.63425C3.07224 2.48492 3.16135 2.3667 3.27861 2.3667H3.66792C3.78049 2.3667 3.8743 2.49114 3.8743 2.64048V3.90359C3.8743 4.0467 3.78049 4.17114 3.66792 4.17114Z" fill="#6D6E72"/><path d="M6.3274 2.35425H6.72139C6.83396 2.35425 6.92777 2.47869 6.92777 2.62803V3.89114C6.92777 4.04047 6.83396 4.16491 6.72139 4.16491H6.3274C6.21483 4.16491 6.12102 4.04047 6.12102 3.89114V2.62803C6.12571 2.47869 6.21483 2.35425 6.3274 2.35425Z" fill="#6D6E72"/><path d="M8.11445 4.16491H7.71576C7.60319 4.16491 7.50938 4.04047 7.50938 3.89114V2.62803C7.50938 2.47869 7.60319 2.35425 7.71576 2.35425H8.11445C8.22702 2.35425 8.32083 2.47869 8.32083 2.62803V3.89114C8.32083 4.04669 8.22702 4.16491 8.11445 4.16491Z" fill="#6D6E72"/></g><defs><clipPath id="clip0_5706_2977"><rect width="10" height="7" fill="white" transform="translate(0 0.5)"/></clipPath></defs></svg>',
				'hl_ssd': '<svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.375 0H0.625C0.45924 0 0.300268 0.0702379 0.183058 0.195262C0.065848 0.320286 0 0.489856 0 0.666667V7.33333C0 7.51014 0.065848 7.67971 0.183058 7.80474C0.300268 7.92976 0.45924 8 0.625 8H9.375C9.54076 8 9.69973 7.92976 9.81694 7.80474C9.93415 7.67971 10 7.51014 10 7.33333V0.666667C10 0.489856 9.93415 0.320286 9.81694 0.195262C9.69973 0.0702379 9.54076 0 9.375 0ZM1.00312 0.666667C1.08087 0.664012 1.15758 0.686174 1.22344 0.730314C1.2893 0.774454 1.34131 0.838562 1.3728 0.914426C1.40429 0.99029 1.41384 1.07445 1.40021 1.15614C1.38657 1.23782 1.35039 1.31331 1.29629 1.37292C1.24219 1.43253 1.17264 1.47356 1.09655 1.49075C1.02045 1.50794 0.941279 1.5005 0.869171 1.46939C0.797062 1.43829 0.735302 1.38493 0.691801 1.31615C0.6483 1.24737 0.62504 1.1663 0.625 1.08333C0.624948 0.975098 0.664383 0.871089 0.734957 0.793321C0.805532 0.715553 0.901707 0.67013 1.00312 0.666667ZM1.00312 7.33333C0.925867 7.33333 0.850343 7.3089 0.786105 7.26311C0.721867 7.21733 0.6718 7.15225 0.642235 7.07612C0.612669 6.99998 0.604933 6.9162 0.620006 6.83538C0.635078 6.75455 0.672282 6.68031 0.726911 6.62204C0.781541 6.56377 0.851144 6.52408 0.926918 6.50801C1.00269 6.49193 1.08123 6.50018 1.15261 6.53172C1.22399 6.56325 1.285 6.61666 1.32792 6.68518C1.37084 6.7537 1.39375 6.83426 1.39375 6.91667C1.39375 7.02717 1.35259 7.13315 1.27934 7.2113C1.20608 7.28944 1.10673 7.33333 1.00312 7.33333ZM2.58438 5.40667C2.17714 5.41641 1.78244 5.25614 1.48438 4.96L1.75313 4.60667C1.98142 4.83976 2.28401 4.97196 2.6 4.97667C2.9125 4.97667 3.08437 4.81 3.08437 4.61333C3.08437 4.41667 2.9 4.31 2.4875 4.20667C1.95625 4.07333 1.58438 3.91 1.58438 3.39333C1.58438 2.87667 1.96562 2.56333 2.52187 2.56333C2.88042 2.55631 3.22837 2.69311 3.49687 2.94667L3.24375 3.31333C3.03896 3.11735 2.77507 3.00618 2.5 3C2.39772 2.98678 2.29469 3.01719 2.21333 3.08462C2.13198 3.15204 2.07889 3.25102 2.06562 3.36C2.06562 3.58333 2.25625 3.66333 2.66562 3.76333C3.20312 3.89333 3.5625 4.07667 3.5625 4.57667C3.5625 5.07667 3.2 5.40667 2.58438 5.40667ZM4.93125 5.40667C4.52402 5.41641 4.12932 5.25614 3.83125 4.96L4.1 4.60667C4.32829 4.83976 4.63088 4.97196 4.94688 4.97667C5.25938 4.97667 5.43125 4.81 5.43125 4.61333C5.43125 4.41667 5.24687 4.31 4.83437 4.20667C4.30312 4.07333 3.93125 3.91 3.93125 3.39333C3.93125 2.87667 4.31563 2.56333 4.86875 2.56333C5.2274 2.55565 5.57557 2.69254 5.84375 2.94667L5.59062 3.31333C5.38938 3.11081 5.12643 2.99246 4.85 2.98C4.74772 2.96678 4.64469 2.99719 4.56333 3.06462C4.48198 3.13204 4.42889 3.23102 4.41562 3.34C4.41562 3.56333 4.60625 3.64333 5.01562 3.74333C5.55312 3.87333 5.9125 4.05667 5.9125 4.55667C5.9125 5.05667 5.54688 5.40667 4.93125 5.40667ZM6.3625 5.36V2.61333H7.26875C8.11875 2.61333 8.71875 3.18333 8.71875 3.98667C8.71875 4.79 8.125 5.36 7.26875 5.36H6.3625ZM8.96562 7.33333C8.88837 7.33333 8.81284 7.3089 8.74861 7.26311C8.68437 7.21733 8.6343 7.15225 8.60473 7.07612C8.57517 6.99998 8.56743 6.9162 8.58251 6.83538C8.59758 6.75455 8.63478 6.68031 8.68941 6.62204C8.74404 6.56377 8.81364 6.52408 8.88942 6.50801C8.96519 6.49193 9.04373 6.50018 9.11511 6.53172C9.18649 6.56325 9.2475 6.61666 9.29042 6.68518C9.33334 6.7537 9.35625 6.83426 9.35625 6.91667C9.35625 7.02717 9.31509 7.13315 9.24184 7.2113C9.16858 7.28944 9.06923 7.33333 8.96562 7.33333ZM8.96562 1.5C8.88837 1.5 8.81284 1.47556 8.74861 1.42978C8.68437 1.384 8.6343 1.31892 8.60473 1.24278C8.57517 1.16665 8.56743 1.08287 8.58251 1.00205C8.59758 0.92122 8.63478 0.846977 8.68941 0.788706C8.74404 0.730434 8.81364 0.69075 8.88942 0.674673C8.96519 0.658596 9.04373 0.666847 9.11511 0.698384C9.18649 0.72992 9.2475 0.783325 9.29042 0.851846C9.33334 0.920366 9.35625 1.00092 9.35625 1.08333C9.35625 1.19384 9.31509 1.29982 9.24184 1.37796C9.16858 1.4561 9.06923 1.5 8.96562 1.5Z" fill="#6D6E72"/><path d="M6.875 3.00181H7.30868C7.41352 2.99361 7.51853 3.01336 7.61727 3.05982C7.71601 3.10628 7.80639 3.17848 7.88285 3.27197C7.95931 3.36546 8.02023 3.47828 8.06187 3.60348C8.10352 3.72868 8.125 3.86362 8.125 4C8.125 4.13638 8.10352 4.27132 8.06187 4.39652C8.02023 4.52172 7.95931 4.63454 7.88285 4.72803C7.80639 4.82153 7.71601 4.89372 7.61727 4.94018C7.51853 4.98664 7.41352 5.00639 7.30868 4.99819H6.875V3.00181Z" fill="#6D6E72"/></svg>',
				'hl_lcd': '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3.5H3.875C3.98333 3.5 4.073 3.4645 4.144 3.3935C4.21467 3.32283 4.25 3.23333 4.25 3.125C4.25 3.01667 4.21467 2.92717 4.144 2.8565C4.073 2.7855 3.98333 2.75 3.875 2.75H2.75C2.60833 2.75 2.4895 2.79783 2.3935 2.8935C2.29783 2.9895 2.25 3.10833 2.25 3.25V4.375C2.25 4.48333 2.2855 4.57283 2.3565 4.6435C2.42717 4.7145 2.51667 4.75 2.625 4.75C2.73333 4.75 2.82283 4.7145 2.8935 4.6435C2.9645 4.57283 3 4.48333 3 4.375V3.5ZM6.75 5.25H5.875C5.76667 5.25 5.67717 5.28533 5.6065 5.356C5.5355 5.427 5.5 5.51667 5.5 5.625C5.5 5.73333 5.5355 5.82283 5.6065 5.8935C5.67717 5.9645 5.76667 6 5.875 6H7C7.14167 6 7.26033 5.952 7.356 5.856C7.452 5.76033 7.5 5.64167 7.5 5.5V4.375C7.5 4.26667 7.46467 4.177 7.394 4.106C7.323 4.03533 7.23333 4 7.125 4C7.01667 4 6.927 4.03533 6.856 4.106C6.78533 4.177 6.75 4.26667 6.75 4.375V5.25ZM3.5 9.5C3.35833 9.5 3.23967 9.452 3.144 9.356C3.048 9.26033 3 9.14167 3 9V8.5H1C0.725 8.5 0.489667 8.40217 0.294 8.2065C0.098 8.0105 0 7.775 0 7.5V1.5C0 1.225 0.098 0.9895 0.294 0.7935C0.489667 0.597833 0.725 0.5 1 0.5H9C9.275 0.5 9.5105 0.597833 9.7065 0.7935C9.90217 0.9895 10 1.225 10 1.5V7.5C10 7.775 9.90217 8.0105 9.7065 8.2065C9.5105 8.40217 9.275 8.5 9 8.5H7V9C7 9.14167 6.95217 9.26033 6.8565 9.356C6.7605 9.452 6.64167 9.5 6.5 9.5H3.5ZM1.5 7H8.5V2H1.5V7Z" fill="#6D6E72"/></svg>',
				'hl_hz': '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_8337_18915)"><path d="M5 0.833313V4.37498" stroke="#6D6E72" stroke-width="0.833333" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.99992 0.833313C2.69867 0.833313 0.833252 2.69873 0.833252 4.99998C0.833252 7.30123 2.69867 9.16665 4.99992 9.16665C7.30117 9.16665 9.16659 7.30123 9.16659 4.99998C9.16659 4.03623 8.8395 3.14894 8.29013 2.4431" stroke="#6D6E72" stroke-width="0.833333" stroke-linecap="round"/><path d="M4.99992 2.70831C3.73429 2.70831 2.70825 3.73435 2.70825 4.99998C2.70825 6.2656 3.73429 7.29165 4.99992 7.29165C6.26554 7.29165 7.29159 6.2656 7.29159 4.99998C7.29159 4.46998 7.11159 3.98185 6.8095 3.59373" stroke="#6D6E72" stroke-width="0.833333" stroke-linecap="round"/><path d="M5 5.625C5.34518 5.625 5.625 5.34518 5.625 5C5.625 4.65482 5.34518 4.375 5 4.375C4.65482 4.375 4.375 4.65482 4.375 5C4.375 5.34518 4.65482 5.625 5 5.625Z" stroke="#6D6E72" stroke-width="0.833333"/></g><defs><clipPath id="clip0_8337_18915"><rect width="10" height="10" fill="white"/></clipPath></defs></svg>',
				'hl_res': '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.99159 3.00835C7.05075 3.06669 7.08325 3.14627 7.08325 3.22919V4.27085C7.08325 4.35373 7.05033 4.43322 6.99172 4.49182C6.93312 4.55043 6.85363 4.58335 6.77075 4.58335C6.68787 4.58335 6.60839 4.55043 6.54978 4.49182C6.49118 4.43322 6.45825 4.35373 6.45825 4.27085V3.98335L5.74159 4.70002C5.71274 4.72985 5.67825 4.75364 5.64012 4.77C5.60198 4.78636 5.56097 4.79496 5.51948 4.7953C5.47799 4.79565 5.43684 4.78772 5.39844 4.77199C5.36004 4.75626 5.32516 4.73304 5.29584 4.70368C5.26651 4.67433 5.24332 4.63942 5.22763 4.60101C5.21193 4.5626 5.20404 4.52145 5.20442 4.47995C5.2048 4.43846 5.21344 4.39746 5.22984 4.35934C5.24624 4.32122 5.27006 4.28675 5.29992 4.25794L6.01658 3.54169H5.72909C5.64621 3.54169 5.56672 3.50876 5.50811 3.45016C5.44951 3.39155 5.41659 3.31207 5.41659 3.22919C5.41659 3.14631 5.44951 3.06682 5.50811 3.00822C5.56672 2.94961 5.64621 2.91669 5.72909 2.91669H6.77075C6.8536 2.91676 6.93304 2.94973 6.99159 3.00835ZM2.91659 6.77085C2.91659 6.85373 2.94951 6.93322 3.00811 6.99182C3.06672 7.05043 3.14621 7.08335 3.22909 7.08335H4.27117C4.35405 7.08335 4.43353 7.05043 4.49214 6.99182C4.55074 6.93322 4.58367 6.85373 4.58367 6.77085C4.58367 6.68797 4.55074 6.60849 4.49214 6.54988C4.43353 6.49128 4.35405 6.45835 4.27117 6.45835H3.98367L4.70034 5.74169C4.75723 5.68272 4.78869 5.60377 4.78794 5.52183C4.78719 5.4399 4.75429 5.36153 4.69632 5.30362C4.63836 5.24571 4.55996 5.21288 4.47802 5.2122C4.39609 5.21153 4.31716 5.24307 4.25825 5.30002L3.54159 6.01585V5.72835C3.54159 5.64547 3.50866 5.56599 3.45006 5.50738C3.39145 5.44878 3.31197 5.41585 3.22909 5.41585C3.14621 5.41585 3.06672 5.44878 3.00811 5.50738C2.94951 5.56599 2.91659 5.64547 2.91659 5.72835V6.77002V6.77085ZM0.833252 2.81252C0.833252 2.50863 0.953973 2.21718 1.16886 2.00229C1.38374 1.78741 1.67519 1.66669 1.97909 1.66669H8.02075C8.32465 1.66669 8.61609 1.78741 8.83098 2.00229C9.04586 2.21718 9.16659 2.50863 9.16659 2.81252V7.18752C9.16659 7.33799 9.13695 7.48699 9.07936 7.62601C9.02178 7.76503 8.93738 7.89135 8.83098 7.99775C8.72458 8.10415 8.59826 8.18855 8.45924 8.24613C8.32022 8.30372 8.17122 8.33335 8.02075 8.33335H1.97909C1.82861 8.33335 1.67961 8.30372 1.54059 8.24613C1.40157 8.18855 1.27526 8.10415 1.16886 7.99775C1.06246 7.89135 0.978057 7.76503 0.920473 7.62601C0.86289 7.48699 0.833252 7.33799 0.833252 7.18752V2.81252ZM1.97909 2.29169C1.69159 2.29169 1.45825 2.52502 1.45825 2.81252V7.18752C1.45825 7.47502 1.69159 7.70835 1.97909 7.70835H8.02075C8.30825 7.70835 8.54159 7.47502 8.54159 7.18752V2.81252C8.54159 2.52502 8.30825 2.29169 8.02075 2.29169H1.97909Z" fill="#6D6E72"/></svg>',
				'hl_panel': '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_8337_18911)"><path d="M8.95165 2.96877L5.19249 0.885434C5.13072 0.851404 5.06134 0.833557 4.99082 0.833557C4.9203 0.833557 4.85092 0.851404 4.78915 0.885434L1.04832 2.9521C0.983334 2.98809 0.92915 3.04079 0.891379 3.10475C0.853608 3.16872 0.833624 3.24162 0.833497 3.3159C0.833369 3.39018 0.853103 3.46315 0.890654 3.52724C0.928205 3.59134 0.982208 3.64423 1.04707 3.68043L4.80624 5.78043C4.86812 5.81521 4.9379 5.83351 5.00889 5.83358C5.07988 5.83365 5.14969 5.8155 5.21165 5.78085L8.95249 3.69752C9.01747 3.66138 9.0716 3.60851 9.10926 3.54439C9.14691 3.48028 9.16673 3.40725 9.16664 3.3329C9.16656 3.25854 9.14658 3.18556 9.10877 3.12153C9.07097 3.0575 9.01672 3.00476 8.95165 2.96877Z" fill="#6D6E72"/><path d="M5.00011 6.6067L1.45219 4.63586L1.04761 5.3642L4.79761 7.44753C4.85949 7.4819 4.92911 7.49993 4.9999 7.49993C5.07069 7.49993 5.14031 7.4819 5.20219 7.44753L8.95219 5.3642L8.54761 4.63586L5.00011 6.6067Z" fill="#6D6E72"/><path d="M5.00011 8.27332L1.45219 6.30249L1.04761 7.03082L4.79761 9.11416C4.85949 9.14852 4.92911 9.16656 4.9999 9.16656C5.07069 9.16656 5.14031 9.14852 5.20219 9.11416L8.95219 7.03082L8.54761 6.30249L5.00011 8.27332Z" fill="#6D6E72"/></g><defs><clipPath id="clip0_8337_18911"><rect width="10" height="10" fill="white"/></clipPath></defs></svg>',
				'hl_connect': '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.74416 1.07739C2.90044 0.92111 3.1124 0.833313 3.33341 0.833313H6.66675C6.88776 0.833313 7.09972 0.92111 7.256 1.07739C7.41228 1.23367 7.50008 1.44563 7.50008 1.66665V4.16665C7.7211 4.16665 7.93306 4.25444 8.08934 4.41072C8.24562 4.567 8.33341 4.77897 8.33341 4.99998V6.24998C8.33341 6.80251 8.11392 7.33242 7.72322 7.72312C7.33252 8.11382 6.80262 8.33331 6.25008 8.33331V8.74998C6.25008 8.9801 6.06353 9.16665 5.83341 9.16665C5.6033 9.16665 5.41675 8.9801 5.41675 8.74998V8.33331H4.58341V8.74998C4.58341 8.9801 4.39687 9.16665 4.16675 9.16665C3.93663 9.16665 3.75008 8.9801 3.75008 8.74998V8.33331C3.19755 8.33331 2.66764 8.11382 2.27694 7.72312C1.88624 7.33242 1.66675 6.80251 1.66675 6.24998V4.99998C1.66675 4.77897 1.75455 4.567 1.91083 4.41072C2.06711 4.25444 2.27907 4.16665 2.50008 4.16665V1.66665C2.50008 1.44563 2.58788 1.23367 2.74416 1.07739ZM2.50008 4.99998L2.50008 6.24998C2.50008 6.5815 2.63178 6.89944 2.8662 7.13386C3.10062 7.36828 3.41856 7.49998 3.75008 7.49998H6.25008C6.5816 7.49998 6.89954 7.36828 7.13396 7.13386C7.36839 6.89944 7.50008 6.5815 7.50008 6.24998V4.99998H2.50008ZM6.66675 4.16665V1.66665H3.33341V4.16665H6.66675ZM4.16675 2.08331C4.39687 2.08331 4.58341 2.26986 4.58341 2.49998V2.91665C4.58341 3.14676 4.39687 3.33331 4.16675 3.33331C3.93663 3.33331 3.75008 3.14676 3.75008 2.91665V2.49998C3.75008 2.26986 3.93663 2.08331 4.16675 2.08331ZM5.83341 2.08331C6.06353 2.08331 6.25008 2.26986 6.25008 2.49998V2.91665C6.25008 3.14676 6.06353 3.33331 5.83341 3.33331C5.6033 3.33331 5.41675 3.14676 5.41675 2.91665V2.49998C5.41675 2.26986 5.6033 2.08331 5.83341 2.08331Z" fill="#6D6E72"/><path d="M2.0835 4.99998C2.0835 4.88947 2.12739 4.78349 2.20554 4.70535C2.28368 4.62721 2.38966 4.58331 2.50016 4.58331H7.50016C7.61067 4.58331 7.71665 4.62721 7.79479 4.70535C7.87293 4.78349 7.91683 4.88947 7.91683 4.99998V6.24998C7.91683 6.69201 7.74123 7.11593 7.42867 7.42849C7.11611 7.74105 6.69219 7.91665 6.25016 7.91665H3.75016C3.30814 7.91665 2.88421 7.74105 2.57165 7.42849C2.25909 7.11593 2.0835 6.69201 2.0835 6.24998V4.99998Z" fill="#6D6E72"/></svg>',
				'hl_led': '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_9087_14570)"><path d="M1.66661 4.58331C1.77281 4.58343 1.87496 4.6241 1.95218 4.697C2.02941 4.7699 2.07588 4.86954 2.0821 4.97556C2.08832 5.08158 2.05383 5.18597 1.98567 5.26741C1.91751 5.34885 1.82082 5.40119 1.71536 5.41373L1.66661 5.41665H1.24995C1.14375 5.41653 1.0416 5.37586 0.964375 5.30296C0.887152 5.23006 0.840681 5.13042 0.834457 5.0244C0.828233 4.91838 0.862726 4.81399 0.930889 4.73255C0.999052 4.65111 1.09574 4.59877 1.2012 4.58623L1.24995 4.58331H1.66661ZM4.99995 0.833313C5.102 0.833326 5.2005 0.870795 5.27677 0.938611C5.35303 1.00643 5.40175 1.09987 5.41369 1.20123L5.41661 1.24998V1.66665C5.41649 1.77285 5.37583 1.87499 5.30293 1.95222C5.23002 2.02944 5.13038 2.07591 5.02436 2.08213C4.91835 2.08836 4.81395 2.05387 4.73251 1.9857C4.65108 1.91754 4.59874 1.82085 4.58619 1.7154L4.58328 1.66665V1.24998C4.58328 1.13947 4.62718 1.03349 4.70532 0.955352C4.78346 0.877212 4.88944 0.833313 4.99995 0.833313ZM8.74995 4.58331C8.85614 4.58343 8.95829 4.6241 9.03551 4.697C9.11274 4.7699 9.15921 4.86954 9.16543 4.97556C9.17166 5.08158 9.13716 5.18597 9.069 5.26741C9.00084 5.34885 8.90415 5.40119 8.7987 5.41373L8.74995 5.41665H8.33328C8.22708 5.41653 8.12493 5.37586 8.04771 5.30296C7.97049 5.23006 7.92401 5.13042 7.91779 5.0244C7.91157 4.91838 7.94606 4.81399 8.01422 4.73255C8.08238 4.65111 8.17907 4.59877 8.28453 4.58623L8.33328 4.58331H8.74995ZM2.0387 2.03873C2.11044 1.96699 2.2059 1.92389 2.30716 1.91753C2.40842 1.91116 2.50853 1.94196 2.5887 2.00415L2.62786 2.03873L2.91953 2.3304C2.99426 2.40538 3.03764 2.50599 3.04087 2.61181C3.0441 2.71762 3.00694 2.82069 2.93692 2.9001C2.86691 2.9795 2.7693 3.02927 2.66391 3.03931C2.55853 3.04935 2.45327 3.0189 2.36953 2.95415L2.33036 2.91956L2.0387 2.6279C1.96058 2.54976 1.9167 2.4438 1.9167 2.33331C1.9167 2.22283 1.96058 2.11687 2.0387 2.03873ZM7.37203 2.03873C7.44701 1.964 7.54763 1.92062 7.65344 1.91738C7.75925 1.91415 7.86233 1.95132 7.94173 2.02133C8.02113 2.09135 8.07091 2.18896 8.08095 2.29434C8.09098 2.39973 8.06053 2.50498 7.99578 2.58873L7.96119 2.6279L7.66953 2.91956C7.59455 2.99429 7.49393 3.03768 7.38812 3.04091C7.28231 3.04414 7.17923 3.00697 7.09983 2.93696C7.02043 2.86695 6.97065 2.76933 6.96061 2.66395C6.95057 2.55856 6.98102 2.45331 7.04578 2.36956L7.08036 2.3304L7.37203 2.03873ZM5.83328 7.49998C5.94379 7.49998 6.04977 7.54388 6.12791 7.62202C6.20605 7.70016 6.24995 7.80614 6.24995 7.91665C6.24995 8.24817 6.11825 8.56611 5.88383 8.80053C5.64941 9.03495 5.33147 9.16665 4.99995 9.16665C4.66842 9.16665 4.35048 9.03495 4.11606 8.80053C3.88164 8.56611 3.74995 8.24817 3.74995 7.91665C3.74996 7.81459 3.78743 7.71609 3.85524 7.63982C3.92306 7.56356 4.01651 7.51484 4.11786 7.5029L4.16661 7.49998H5.83328ZM4.99995 2.49998C5.52465 2.49998 6.03606 2.66507 6.46172 2.97187C6.88738 3.27868 7.20573 3.71163 7.37165 4.20941C7.53758 4.70719 7.54268 5.24456 7.38623 5.7454C7.22978 6.24624 6.91971 6.68516 6.49995 6.99998C6.44252 7.04311 6.37491 7.07067 6.30369 7.07998L6.24995 7.08331H3.74995C3.65979 7.08331 3.57207 7.05407 3.49995 6.99998C3.08018 6.68516 2.77011 6.24624 2.61366 5.7454C2.45721 5.24456 2.46231 4.70719 2.62824 4.20941C2.79416 3.71163 3.11251 3.27868 3.53817 2.97187C3.96383 2.66507 4.47524 2.49998 4.99995 2.49998Z" fill="#6D6E72"/></g><defs><clipPath id="clip0_9087_14570"><rect width="10" height="10" fill="white"/></clipPath></defs></svg>',
				'hl_size': '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 3.375C1 3.01033 1.14487 2.66059 1.40273 2.40273C1.66059 2.14487 2.01033 2 2.375 2H7.625C7.98967 2 8.33941 2.14487 8.59727 2.40273C8.85513 2.66059 9 3.01033 9 3.375V6.625C9 6.98967 8.85513 7.33941 8.59727 7.59727C8.33941 7.85513 7.98967 8 7.625 8H2.375C2.01033 8 1.66059 7.85513 1.40273 7.59727C1.14487 7.33941 1 6.98967 1 6.625V3.375ZM5.5 3.25C5.5 3.3163 5.52634 3.37989 5.57322 3.42678C5.62011 3.47366 5.6837 3.5 5.75 3.5H6.1465L5.323 4.323C5.29976 4.34624 5.28132 4.37384 5.26874 4.40421C5.25616 4.43458 5.24968 4.46713 5.24968 4.5C5.24968 4.53287 5.25616 4.56542 5.26874 4.59579C5.28132 4.62616 5.29976 4.65376 5.323 4.677C5.34624 4.70024 5.37384 4.71868 5.40421 4.73126C5.43458 4.74384 5.46713 4.75032 5.5 4.75032C5.53287 4.75032 5.56542 4.74384 5.59579 4.73126C5.62616 4.71868 5.65376 4.70024 5.677 4.677L6.5 3.8535V4.25C6.5 4.3163 6.52634 4.37989 6.57322 4.42678C6.62011 4.47366 6.6837 4.5 6.75 4.5C6.8163 4.5 6.87989 4.47366 6.92678 4.42678C6.97366 4.37989 7 4.3163 7 4.25V3.25C7 3.1837 6.97366 3.12011 6.92678 3.07322C6.87989 3.02634 6.8163 3 6.75 3H5.75C5.6837 3 5.62011 3.02634 5.57322 3.07322C5.52634 3.12011 5.5 3.1837 5.5 3.25ZM4.677 5.323C4.65378 5.29972 4.62619 5.28125 4.59582 5.26864C4.56544 5.25604 4.53288 5.24955 4.5 5.24955C4.46712 5.24955 4.43456 5.25604 4.40418 5.26864C4.37381 5.28125 4.34622 5.29972 4.323 5.323L3.5 6.1465V5.75C3.5 5.6837 3.47366 5.62011 3.42678 5.57322C3.37989 5.52634 3.3163 5.5 3.25 5.5C3.1837 5.5 3.12011 5.52634 3.07322 5.57322C3.02634 5.62011 3 5.6837 3 5.75V6.75C3 6.8163 3.02634 6.87989 3.07322 6.92678C3.12011 6.97366 3.1837 7 3.25 7H4.25C4.3163 7 4.37989 6.97366 4.42678 6.92678C4.47366 6.87989 4.5 6.8163 4.5 6.75C4.5 6.6837 4.47366 6.62011 4.42678 6.57322C4.37989 6.52634 4.3163 6.5 4.25 6.5H3.8535L4.677 5.677C4.70028 5.65378 4.71875 5.62619 4.73136 5.59582C4.74396 5.56544 4.75045 5.53288 4.75045 5.5C4.75045 5.46712 4.74396 5.43456 4.73136 5.40418C4.71875 5.37381 4.70028 5.34622 4.677 5.323Z" fill="#6D6E72"/></svg>',
				'hl_keycap': '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.99993 1.22222C4.11103 1.22222 2.77769 1 2.77769 1L2.33324 5.00003M4.99993 1.22222C5.88882 1.22222 7.22217 1 7.22217 1M4.99993 1.22222C4.11103 1.22222 2.76791 1 2.76791 1L1.73679 2.3689C1.53548 2.6359 1.41421 2.95437 1.38612 3.28757L1.00301 7.86272C0.989674 8.02539 1.02079 8.1885 1.09412 8.33383L1.18168 8.5085C1.25616 8.65641 1.37029 8.78071 1.51132 8.86751C1.65236 8.95432 1.81474 9.00021 1.98035 9.00006H8.01951C8.18511 9.00021 8.3475 8.95432 8.48853 8.86751C8.62957 8.78071 8.7437 8.65641 8.81818 8.5085L8.90573 8.33428C8.97907 8.1885 9.01062 8.02539 8.99685 7.86316L8.61373 3.28757C8.58573 2.95422 8.46401 2.63558 8.26262 2.36845L7.22217 1M7.22217 1L7.66661 5.00003M7.66661 5.00003C7.66661 5.00003 6.33327 5.44448 4.99993 5.44448C3.66658 5.44448 2.33324 5.00003 2.33324 5.00003M7.66661 5.00003L8.77773 8.55561M2.33324 5.00003L1.22212 8.55561" stroke="#6D6E72" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
				'hl_material': '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_9088_14654)"><mask id="mask0_9088_14654" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="10" height="10"><path d="M8.3335 0.833374H1.66683C1.44582 0.833374 1.23385 0.921171 1.07757 1.07745C0.921293 1.23373 0.833496 1.44569 0.833496 1.66671V8.33337C0.833496 8.55439 0.921293 8.76635 1.07757 8.92263C1.23385 9.07891 1.44582 9.16671 1.66683 9.16671H8.3335C8.55451 9.16671 8.76647 9.07891 8.92275 8.92263C9.07903 8.76635 9.16683 8.55439 9.16683 8.33337V1.66671C9.16683 1.44569 9.07903 1.23373 8.92275 1.07745C8.76647 0.921171 8.55451 0.833374 8.3335 0.833374Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M0.782865 0.782804C1.01729 0.548383 1.33523 0.416687 1.66675 0.416687H8.33342C8.66494 0.416687 8.98288 0.548383 9.2173 0.782804C9.45172 1.01722 9.58342 1.33517 9.58342 1.66669V8.33335C9.58342 8.66488 9.45172 8.98282 9.2173 9.21724C8.98288 9.45166 8.66494 9.58335 8.33342 9.58335H1.66675C1.33523 9.58335 1.01728 9.45166 0.782865 9.21724C0.548444 8.98282 0.416748 8.66488 0.416748 8.33335V1.66669C0.416748 1.33517 0.548444 1.01722 0.782865 0.782804ZM1.66675 1.25002C1.55624 1.25002 1.45026 1.29392 1.37212 1.37206C1.29398 1.4502 1.25008 1.55618 1.25008 1.66669V8.33335C1.25008 8.44386 1.29398 8.54984 1.37212 8.62798C1.45026 8.70612 1.55624 8.75002 1.66675 8.75002H8.33342C8.44392 8.75002 8.5499 8.70612 8.62804 8.62798C8.70618 8.54984 8.75008 8.44386 8.75008 8.33335V1.66669C8.75008 1.55618 8.70618 1.4502 8.62804 1.37206C8.5499 1.29392 8.44392 1.25002 8.33342 1.25002H1.66675Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M2.50016 2.08337C2.73028 2.08337 2.91683 2.26992 2.91683 2.50004V4.16671C2.91683 4.39683 2.73028 4.58337 2.50016 4.58337C2.27004 4.58337 2.0835 4.39683 2.0835 4.16671V2.50004C2.0835 2.26992 2.27004 2.08337 2.50016 2.08337ZM4.16683 2.08337C4.39695 2.08337 4.5835 2.26992 4.5835 2.50004V4.16671C4.5835 4.39683 4.39695 4.58337 4.16683 4.58337C3.93671 4.58337 3.75016 4.39683 3.75016 4.16671V2.50004C3.75016 2.26992 3.93671 2.08337 4.16683 2.08337ZM5.41683 2.50004C5.41683 2.26992 5.60338 2.08337 5.8335 2.08337H7.50016C7.73028 2.08337 7.91683 2.26992 7.91683 2.50004C7.91683 2.73016 7.73028 2.91671 7.50016 2.91671H5.8335C5.60338 2.91671 5.41683 2.73016 5.41683 2.50004ZM5.41683 4.16671C5.41683 3.93659 5.60338 3.75004 5.8335 3.75004H7.50016C7.73028 3.75004 7.91683 3.93659 7.91683 4.16671C7.91683 4.39683 7.73028 4.58337 7.50016 4.58337H5.8335C5.60338 4.58337 5.41683 4.39683 5.41683 4.16671ZM2.0835 5.83337C2.0835 5.60326 2.27004 5.41671 2.50016 5.41671H4.16683C4.39695 5.41671 4.5835 5.60326 4.5835 5.83337C4.5835 6.06349 4.39695 6.25004 4.16683 6.25004H2.50016C2.27004 6.25004 2.0835 6.06349 2.0835 5.83337ZM5.8335 5.41671C6.06362 5.41671 6.25016 5.60326 6.25016 5.83337V7.50004C6.25016 7.73016 6.06362 7.91671 5.8335 7.91671C5.60338 7.91671 5.41683 7.73016 5.41683 7.50004V5.83337C5.41683 5.60326 5.60338 5.41671 5.8335 5.41671ZM7.50016 5.41671C7.73028 5.41671 7.91683 5.60326 7.91683 5.83337V7.50004C7.91683 7.73016 7.73028 7.91671 7.50016 7.91671C7.27004 7.91671 7.0835 7.73016 7.0835 7.50004V5.83337C7.0835 5.60326 7.27004 5.41671 7.50016 5.41671ZM2.0835 7.50004C2.0835 7.26992 2.27004 7.08337 2.50016 7.08337H4.16683C4.39695 7.08337 4.5835 7.26992 4.5835 7.50004C4.5835 7.73016 4.39695 7.91671 4.16683 7.91671H2.50016C2.27004 7.91671 2.0835 7.73016 2.0835 7.50004Z" fill="black"/></mask><g mask="url(#mask0_9088_14654)"><path d="M0 0H10V10H0V0Z" fill="#6D6E72"/></g></g><defs><clipPath id="clip0_9088_14654"><rect width="10" height="10" fill="white"/></clipPath></defs></svg>',
				'hl_length': '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.79471 3.03873C2.95743 3.20144 2.95743 3.46526 2.79471 3.62798L1.83934 4.58335H8.16083L7.20545 3.62798C7.04274 3.46526 7.04274 3.20144 7.20545 3.03873C7.36817 2.87601 7.63199 2.87601 7.79471 3.03873L9.46138 4.70539C9.62409 4.86811 9.62409 5.13193 9.46138 5.29465L7.79471 6.96131C7.63199 7.12403 7.36817 7.12403 7.20545 6.96131C7.04274 6.7986 7.04274 6.53478 7.20545 6.37206L8.16083 5.41669H1.83934L2.79471 6.37206C2.95743 6.53478 2.95743 6.7986 2.79471 6.96131C2.63199 7.12403 2.36817 7.12403 2.20545 6.96131L0.538787 5.29465C0.376068 5.13193 0.376068 4.86811 0.538787 4.70539L2.20545 3.03873C2.36817 2.87601 2.63199 2.87601 2.79471 3.03873Z" fill="#6D6E72"/></svg>',
				'hl_width': '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.99992 8.75L3.33325 7.08333L3.91659 6.5L4.58325 7.15625V2.84375L3.91659 3.5L3.33325 2.91667L4.99992 1.25L6.66659 2.91667L6.08325 3.51042L5.41659 2.84375V7.15625L6.08325 6.5L6.66659 7.08333L4.99992 8.75Z" fill="#6D6E72"/></svg>',
				'hl_height': '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.45841 0.833313C1.68853 0.833313 1.87508 1.01986 1.87508 1.24998V8.74998C1.87508 8.9801 1.68853 9.16665 1.45841 9.16665C1.2283 9.16665 1.04175 8.9801 1.04175 8.74998V1.24998C1.04175 1.01986 1.2283 0.833313 1.45841 0.833313Z" fill="#6D6E72"/><path fill-rule="evenodd" clip-rule="evenodd" d="M4.99964 1.25C4.89289 1.24987 4.78609 1.29051 4.70462 1.37192L3.45566 2.61983C3.29287 2.78248 3.29276 3.0463 3.45541 3.20909C3.61806 3.37187 3.88188 3.37198 4.04467 3.20933L4.5835 2.67096V7.32696L4.04467 6.78858C3.88188 6.62593 3.61806 6.62604 3.45541 6.78883C3.29276 6.95161 3.29287 7.21543 3.45566 7.37808L4.68861 8.61001C4.76494 8.69589 4.87623 8.75 5.00016 8.75C5.00036 8.75 5.00056 8.75 5.00077 8.75C5.10749 8.75011 5.21425 8.70947 5.29571 8.62808L6.54467 7.38017C6.70745 7.21752 6.70756 6.9537 6.54491 6.79091C6.38226 6.62813 6.11844 6.62802 5.95566 6.79067L5.41683 7.32904V2.67304L5.95566 3.21142C6.11844 3.37407 6.38226 3.37396 6.54491 3.21117C6.70756 3.04839 6.70745 2.78457 6.54467 2.62192L5.31171 1.38999C5.23539 1.30411 5.1241 1.25 5.00016 1.25C4.99999 1.25 4.99982 1.25 4.99964 1.25Z" fill="#6D6E72"/><path fill-rule="evenodd" clip-rule="evenodd" d="M8.54167 0.833313C8.77179 0.833313 8.95833 1.01986 8.95833 1.24998V8.74998C8.95833 8.9801 8.77179 9.16665 8.54167 9.16665C8.31155 9.16665 8.125 8.9801 8.125 8.74998V1.24998C8.125 1.01986 8.31155 0.833313 8.54167 0.833313Z" fill="#6D6E72"/></svg>',
				'hl_typehp': '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_9088_14670)"><path d="M5.3125 0C4.40082 0 3.52648 0.362164 2.88182 1.00682C2.23716 1.65148 1.875 2.52582 1.875 3.4375V7.84188C1.87473 8.34769 2.05213 8.83752 2.37623 9.22586C2.70033 9.6142 3.15054 9.87635 3.64824 9.96656C4.14595 10.0568 4.65952 9.96929 5.0993 9.71941C5.53907 9.46952 5.87711 9.07311 6.05438 8.59937L6.37313 7.7475C6.47445 7.47856 6.61561 7.22637 6.79187 6.99938L8.04688 5.38625C8.43037 4.89308 8.66775 4.30217 8.732 3.68075C8.79625 3.05933 8.6848 2.43235 8.41031 1.87114C8.13583 1.30994 7.70935 0.83704 7.17938 0.506249C6.64941 0.175458 6.03723 5.67694e-05 5.4125 0L5.3125 0ZM4.375 3.4375V5.12187C4.445 5.08437 4.51438 5.045 4.5825 5.00187C4.78688 4.87188 4.94313 4.72687 5.0325 4.5475C5.06963 4.47332 5.13471 4.41693 5.21341 4.39074C5.29212 4.36454 5.37801 4.37068 5.45219 4.40781C5.52637 4.44494 5.58276 4.51002 5.60895 4.58873C5.63515 4.66743 5.62901 4.75332 5.59188 4.8275C5.43187 5.14813 5.17125 5.36812 4.9175 5.52938C4.74242 5.63682 4.56129 5.73406 4.375 5.82062V7.1875C4.375 7.27038 4.34208 7.34987 4.28347 7.40847C4.22487 7.46708 4.14538 7.5 4.0625 7.5C3.97962 7.5 3.90013 7.46708 3.84153 7.40847C3.78292 7.34987 3.75 7.27038 3.75 7.1875V3.4375C3.75 3.0231 3.91462 2.62567 4.20765 2.33265C4.50067 2.03962 4.8981 1.875 5.3125 1.875C5.7269 1.875 6.12433 2.03962 6.41735 2.33265C6.71038 2.62567 6.875 3.0231 6.875 3.4375V3.75C6.875 3.83288 6.84208 3.91237 6.78347 3.97097C6.72487 4.02958 6.64538 4.0625 6.5625 4.0625C6.47962 4.0625 6.40013 4.02958 6.34153 3.97097C6.28292 3.91237 6.25 3.83288 6.25 3.75V3.4375C6.25 3.18886 6.15123 2.9504 5.97541 2.77459C5.7996 2.59877 5.56114 2.5 5.3125 2.5C5.06386 2.5 4.8254 2.59877 4.64959 2.77459C4.47377 2.9504 4.375 3.18886 4.375 3.4375Z" fill="#6D6E72"/></g><defs><clipPath id="clip0_9088_14670"><rect width="10" height="10" fill="white"/></clipPath></defs></svg>',
				'hl_connector': '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.25 1.5C2.1837 1.5 2.12011 1.52634 2.07322 1.57322C2.02634 1.62011 2 1.6837 2 1.75V3.1465L1.073 4.073C1.0498 4.09626 1.03141 4.12386 1.01888 4.15423C1.00636 4.18461 0.999942 4.21715 1 4.25V6.75C1 6.8163 1.02634 6.87989 1.07322 6.92678C1.12011 6.97366 1.1837 7 1.25 7H2V8.25C2 8.3163 2.02634 8.37989 2.07322 8.42678C2.12011 8.47366 2.1837 8.5 2.25 8.5C2.3163 8.5 2.37989 8.47366 2.42678 8.42678C2.47366 8.37989 2.5 8.3163 2.5 8.25V7H3V8.25C3 8.3163 3.02634 8.37989 3.07322 8.42678C3.12011 8.47366 3.1837 8.5 3.25 8.5C3.3163 8.5 3.37989 8.47366 3.42678 8.42678C3.47366 8.37989 3.5 8.3163 3.5 8.25V7H4.25C4.3163 7 4.37989 6.97366 4.42678 6.92678C4.47366 6.87989 4.5 6.8163 4.5 6.75V4.25C4.50006 4.21715 4.49364 4.18461 4.48112 4.15423C4.46859 4.12386 4.4502 4.09626 4.427 4.073L3.5 3.1465V1.75C3.5 1.6837 3.47366 1.62011 3.42678 1.57322C3.37989 1.52634 3.3163 1.5 3.25 1.5H2.25ZM7.75 8.5C7.8163 8.5 7.87989 8.47366 7.92678 8.42678C7.97366 8.37989 8 8.3163 8 8.25V6.8535L8.927 5.927C8.9502 5.90374 8.96859 5.87614 8.98112 5.84577C8.99364 5.81539 9.00006 5.78285 9 5.75V3.25C9 3.1837 8.97366 3.12011 8.92678 3.07322C8.87989 3.02634 8.8163 3 8.75 3H8.5V1.75C8.5 1.6837 8.47366 1.62011 8.42678 1.57322C8.37989 1.52634 8.3163 1.5 8.25 1.5H6.25C6.1837 1.5 6.12011 1.52634 6.07322 1.57322C6.02634 1.62011 6 1.6837 6 1.75V3H5.75C5.6837 3 5.62011 3.02634 5.57322 3.07322C5.52634 3.12011 5.5 3.1837 5.5 3.25V5.75C5.49994 5.78285 5.50636 5.81539 5.51888 5.84577C5.53141 5.87614 5.5498 5.90374 5.573 5.927L6.5 6.8535V8.25C6.5 8.3163 6.52634 8.37989 6.57322 8.42678C6.62011 8.47366 6.6837 8.5 6.75 8.5H7.75ZM6.5 3V2H8V3H6.5Z" fill="#6D6E72"/></svg>'
			}
			var arrTextTagLabelTop = {
				'hl_ins1:0': 'Tráº£ gÃ³p 0%',
				'hl_ship:4h': 'Giao hÃ ng 4H',
				'hl_prod:pre-order': 'Pre-order',
				'hl_gift:hot': '<svg viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.39943 16.7753C5.49749 16.9703 5.45778 17.2063 5.30133 17.3585C5.14488 17.5106 4.90783 17.5437 4.71569 17.4402C2.9692 16.4998 1.79465 15.5487 1.13674 14.471C0.464139 13.3693 0.367829 12.1968 0.646145 10.9097L5.39943 16.7753ZM5.39943 16.7753C4.89503 15.7725 4.80178 15.0358 4.89423 14.4437C4.9882 13.8418 5.28316 13.3232 5.68383 12.7637C5.95783 12.381 6.17408 12.0003 6.34344 11.6508M5.39943 16.7753L6.34344 11.6508M6.34344 11.6508C6.36183 12.0334 6.34356 12.5009 6.25635 13.0603C6.22258 13.2769 6.33385 13.4902 6.53082 13.5865C6.72778 13.6828 6.96448 13.6395 7.11466 13.4798C7.84055 12.7078 8.26236 11.4993 8.48497 10.4409C8.59303 9.92713 8.65856 9.4274 8.68677 8.99492C10.7405 10.9421 11.4809 14.2642 10.1376 16.7633C10.033 16.9578 10.0685 17.198 10.2249 17.354C10.3813 17.51 10.6215 17.5449 10.8158 17.4398C13.0649 16.224 14.3789 14.8255 15.0184 13.3585C15.6589 11.8891 15.5946 10.4152 15.2091 9.10503C14.8254 7.80075 14.1196 6.64183 13.4459 5.76431C12.7776 4.89379 12.1105 4.2611 11.7684 4.02276C11.5821 3.89299 11.3318 3.90499 11.1588 4.05198C10.9858 4.19897 10.9336 4.44405 11.0315 4.64883C11.0637 4.716 11.091 4.7897 11.1134 4.86902C10.598 3.85925 9.86676 3.00784 9.17368 2.34659C8.58021 1.78037 7.99763 1.33723 7.56357 1.0355C7.34615 0.884368 7.16497 0.768007 7.03694 0.688754C6.97291 0.649112 6.92209 0.618704 6.88661 0.597826L6.84511 0.573674L6.83346 0.567017L6.82999 0.565054L6.82886 0.564415L6.82844 0.564181C6.82828 0.564089 6.82813 0.564005 6.58337 1L6.82813 0.564005C6.67509 0.47809 6.48821 0.478706 6.33574 0.565628C6.18327 0.652549 6.08753 0.813049 6.0835 0.988509C6.02938 3.34264 5.24321 5.60204 4.01193 7.39365C3.87056 6.87285 3.64761 6.38093 3.3177 5.80732C3.20794 5.61647 2.98625 5.51988 2.77174 5.56943C2.55722 5.61898 2.40036 5.80302 2.38543 6.02268C2.33255 6.80012 2.0296 7.52338 1.65494 8.32242C1.6136 8.41059 1.57127 8.49988 1.52841 8.59028C1.19449 9.2946 0.828337 10.0669 0.646149 10.9096L6.34344 11.6508Z" fill="#FDD835" stroke="#FF3C53" stroke-linejoin="round"/></svg><span>QuÃ  táº·ng HOT</span>',
			}
			var arrTextTagLabelBottom = {
				'hl_prod:bestseller': '<svg viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.39943 16.7753C5.49749 16.9703 5.45778 17.2063 5.30133 17.3585C5.14488 17.5106 4.90783 17.5437 4.71569 17.4402C2.9692 16.4998 1.79465 15.5487 1.13674 14.471C0.464139 13.3693 0.367829 12.1968 0.646145 10.9097L5.39943 16.7753ZM5.39943 16.7753C4.89503 15.7725 4.80178 15.0358 4.89423 14.4437C4.9882 13.8418 5.28316 13.3232 5.68383 12.7637C5.95783 12.381 6.17408 12.0003 6.34344 11.6508M5.39943 16.7753L6.34344 11.6508M6.34344 11.6508C6.36183 12.0334 6.34356 12.5009 6.25635 13.0603C6.22258 13.2769 6.33385 13.4902 6.53082 13.5865C6.72778 13.6828 6.96448 13.6395 7.11466 13.4798C7.84055 12.7078 8.26236 11.4993 8.48497 10.4409C8.59303 9.92713 8.65856 9.4274 8.68677 8.99492C10.7405 10.9421 11.4809 14.2642 10.1376 16.7633C10.033 16.9578 10.0685 17.198 10.2249 17.354C10.3813 17.51 10.6215 17.5449 10.8158 17.4398C13.0649 16.224 14.3789 14.8255 15.0184 13.3585C15.6589 11.8891 15.5946 10.4152 15.2091 9.10503C14.8254 7.80075 14.1196 6.64183 13.4459 5.76431C12.7776 4.89379 12.1105 4.2611 11.7684 4.02276C11.5821 3.89299 11.3318 3.90499 11.1588 4.05198C10.9858 4.19897 10.9336 4.44405 11.0315 4.64883C11.0637 4.716 11.091 4.7897 11.1134 4.86902C10.598 3.85925 9.86676 3.00784 9.17368 2.34659C8.58021 1.78037 7.99763 1.33723 7.56357 1.0355C7.34615 0.884368 7.16497 0.768007 7.03694 0.688754C6.97291 0.649112 6.92209 0.618704 6.88661 0.597826L6.84511 0.573674L6.83346 0.567017L6.82999 0.565054L6.82886 0.564415L6.82844 0.564181C6.82828 0.564089 6.82813 0.564005 6.58337 1L6.82813 0.564005C6.67509 0.47809 6.48821 0.478706 6.33574 0.565628C6.18327 0.652549 6.08753 0.813049 6.0835 0.988509C6.02938 3.34264 5.24321 5.60204 4.01193 7.39365C3.87056 6.87285 3.64761 6.38093 3.3177 5.80732C3.20794 5.61647 2.98625 5.51988 2.77174 5.56943C2.55722 5.61898 2.40036 5.80302 2.38543 6.02268C2.33255 6.80012 2.0296 7.52338 1.65494 8.32242C1.6136 8.41059 1.57127 8.49988 1.52841 8.59028C1.19449 9.2946 0.828337 10.0669 0.646149 10.9096L6.34344 11.6508Z" fill="#FDD835" stroke="#FF3C53" stroke-linejoin="round"/></svg><span>BÃ¡n cháº¡y</span>',
				'hl_prod:new': 'Sáº£n pháº©m má»›i',
				'hl_ship:freeship': 'Freeship'
			}
			/*Check tag technical*/
			var getTag0 = r[n].tags.filter((value) => value.indexOf(':') > -1 && arrCheckTagTech.includes(value.split(':')[0]));
			/*Check tag label*/
			var getTagLabelTop    = r[n].tags.filter((value) => value.indexOf(':') > -1 && arrCheckTagLabelTop.includes(value));
			var getTagLabelBottom = r[n].tags.filter((value) => value.indexOf(':') > -1 && arrCheckTagLabelBottom.includes(value));
			
			var htmlItem = '';
				htmlItem += '<div class="col-xl-3 col-lg-3 col-6 proloop" data-id="'+n+'">';
				htmlItem += 	'<div class="proloop-block" id="search_item_loop_'+m+'" data-id="'+n+'" data-variantid="'+vrid+'">';
				htmlItem += 		'<div class="proloop-img">';
				htmlItem += 			'<div class="proloop-label proloop-label--top">';
				htmlItem += 				'<div class="proloop-label--tag">';
				if (getTagLabelTop.length >= 1){
					var classTagTop = '';
					getTagLabelTop.map((value) => {
						if (value == 'hl_gift:hot') {
							classTagTop = 'tag-gifthot';
						} else if (value == 'hl_ins1:0') {
							classTagTop = 'tag-ins1';
						} else if (value == 'hl_prod:pre-order') {
							classTagTop = 'tag-preorder';
						} else if (value == 'hl_ship:4h') {
							classTagTop = 'tag-deliver';
						}
						htmlItem += 				'<span class="'+classTagTop+'">'+arrTextTagLabelTop[value]+'</span>';
					})
				}
				htmlItem += 				'</div>';
				htmlItem += 				'<button type="button" class="popover-click proloop-label--gift d-none" data-toggle="popover" data-container="body" data-placement="bottom" data-popover-content="#giftPE-tooltip--'+m+'" data-class="giftPE-popover" title="QuÃ  táº·ng khuyáº¿n mÃ£i" aria-label="Xem quÃ  táº·ng">';
				htmlItem += 					'<svg viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">';
				htmlItem += 						'<path d="M8.94231 5.2499H11.0577V10.4999H18.9423C19.2228 10.4999 19.4919 10.3913 19.6902 10.1979C19.8886 10.0045 20 9.74218 20 9.46868V6.28116C20 6.00765 19.8886 5.74535 19.6902 5.55195C19.4919 5.35855 19.2228 5.2499 18.9423 5.2499H16.0663C16.4558 4.46784 16.5465 3.57601 16.3222 2.7346C16.0978 1.89319 15.5731 1.15734 14.8423 0.659228C14.1115 0.161113 13.2225 -0.0666262 12.335 0.0169161C11.4475 0.100458 10.6196 0.489808 10 1.11503C9.37937 0.493234 8.55217 0.106895 7.66625 0.0250615C6.78034 -0.056772 5.89345 0.171234 5.16409 0.668329C4.43474 1.16542 3.91046 1.89921 3.68496 2.73853C3.45946 3.57785 3.54744 4.46801 3.93317 5.2499H1.05769C0.777175 5.2499 0.508147 5.35855 0.309791 5.55195C0.111435 5.74535 0 6.00765 0 6.28116V9.46868C0 9.74218 0.111435 10.0045 0.309791 10.1979C0.408007 10.2936 0.524606 10.3696 0.652931 10.4214C0.781256 10.4733 0.918794 10.4999 1.05769 10.4999H8.94231V5.2499ZM11.0577 3.65614C11.0577 3.34092 11.1536 3.03279 11.3332 2.77069C11.5128 2.5086 11.7681 2.30432 12.0668 2.1837C12.3655 2.06307 12.6941 2.03151 13.0112 2.093C13.3283 2.1545 13.6196 2.30629 13.8482 2.52918C14.0768 2.75207 14.2324 3.03605 14.2955 3.34521C14.3586 3.65437 14.3262 3.97482 14.2025 4.26605C14.0788 4.55727 13.8693 4.80618 13.6005 4.9813C13.3316 5.15643 13.0156 5.2499 12.6923 5.2499H11.0577V3.65614ZM5.67308 3.65614C5.67308 3.23345 5.84529 2.82807 6.15184 2.52918C6.4584 2.23029 6.87417 2.06238 7.30769 2.06238C7.74122 2.06238 8.15699 2.23029 8.46354 2.52918C8.77009 2.82807 8.94231 3.23345 8.94231 3.65614V5.2499H7.30769C6.87417 5.2499 6.4584 5.08199 6.15184 4.7831C5.84529 4.48421 5.67308 4.07883 5.67308 3.65614ZM11.0577 21H17.4038C17.6844 21 17.9534 20.8913 18.1517 20.698C18.3501 20.5046 18.4615 20.2423 18.4615 19.9687V11.9999H11.0577V21ZM1.53846 19.9687C1.53846 20.2423 1.6499 20.5046 1.84825 20.698C2.04661 20.8913 2.31564 21 2.59615 21H8.94231V11.9999H1.53846V19.9687Z" fill="#E30019"></path>';
				htmlItem += 					'</svg>';
				htmlItem += 				'</button>';
				htmlItem += 				'<div class="proloop-content--gift d-none" id="giftPE-tooltip--'+m+'"></div>';
				htmlItem += 			'</div>';
				htmlItem += 			'<a class="aspect-ratio fade-box" href="'+r[n].url+'" title="'+r[n].title+'" aria-label="'+r[n].title+'">';
				htmlItem += 				'<picture class="">';
				if (r[n].img == '') { 
					htmlItem += 	    		'<source srcset="//theme.hstatic.net/200000636033/1001033735/14/no-image.jpg" data-srcset="//theme.hstatic.net/200000636033/1001033735/14/no-image.jpg" media="(max-width: 767px)">';   
					htmlItem += 					'<img class="img-default lazyloaded" src="//theme.hstatic.net/200000636033/1001033735/14/no-image.jpg" data-src="//theme.hstatic.net/200000636033/1001033735/14/no-image.jpg" alt="'+r[n].title+'">';
				}
				else {
					htmlItem += 	    		'<source srcset="'+r[n].img+'" data-srcset="'+r[n].img+'" media="(max-width: 767px)">';
					htmlItem += 					'<img class="img-default lazyloaded" src="'+r[n].img+'" data-src="'+r[n].img+'" alt="'+r[n].title+'">';
				}
				htmlItem += 				'</picture>';
				htmlItem += 			'</a>';
				htmlItem += 			'<div class="proloop-button" data-view=""> '; 
				htmlItem += 				'<button aria-label="Xem nhanh" class="proloop-action quick-view  full" data-handle="" data-id="'+n+'">Xem nhanh</button>';
				htmlItem += 				'<button aria-label="ThÃªm vÃ o giá»" class="proloop-action add-to-cart disabled" disabled="" data-id="'+n+'" data-variantid="">ThÃªm vÃ o giá»</button>  ';
				htmlItem += 			'</div>';
				if (frame != ''){
					htmlItem += 			'<div class="sticker_frame"><a href="'+r[n].url+'" tabindex="0"><img src="'+ frame +'"></a></div>';
				}
				if (sticker_lb != ''){
					htmlItem += 		'<span class="sticker_left_bottom"><img class="" src="'+ sticker_lb +'" alt="icon"></span>';
				}
				htmlItem += 		'</div>';
				htmlItem += 		'<div class="proloop-detail">';
				htmlItem += 			'<div class="proloop-label proloop-label--bottom">';
				if (getTagLabelBottom.length >= 1){
					var classTagBottom = '';
					getTagLabelBottom.map((value) => {
						if (value == 'hl_prod:bestseller') {
							classTagBottom = 'proloop-label--bestseller tag1';
						} else if (value == 'hl_prod:new') {
							classTagBottom = 'proloop-label--new tag2';
						} else if (value == 'hl_ship:freeship') {
							classTagBottom = 'proloop-label--freeship tag3';
						}
						htmlItem += 				'<span class="'+classTagBottom+'">'+arrTextTagLabelBottom[value]+'</span>';
					})
				}
				htmlItem += 			'</div>';
				htmlItem += 			'<h3 class="proloop-name"><a href="'+r[n].url+'">'+r[n].title+'</a></h3>';
				if (getTag0.length >= 1){
					htmlItem += 			'<div class="proloop-technical">';
					getTag0.map((value) => {
						var tagSplit = value.split(':');
						htmlItem +=					'<div class="proloop-technical--line" data-tag="'+tagSplit[0].split('_')[0]+'">';
						htmlItem +=						arrIconTagTech[tagSplit[0]];
						htmlItem +=						'<span>'+tagSplit[1]+'</span>';
						htmlItem +=					'</div>';
					})
					htmlItem += 			'</div>';
				}
				htmlItem += 			'<div class="proloop-price">';
				if (r[n].compare_at_price > 0 && r[n].compare_at_price > r[n].price){
					htmlItem += 				'<div class="proloop-price--compare"><del>'+GVN.Helper.moneyFormat(r[n].compare_at_price,'â‚«')+'</del></div>';
				}
				htmlItem += 				'<div class="proloop-price--default">';
				htmlItem += 					'<span class="proloop-price--highlight">'+ GVN.Helper.moneyFormat(r[n].price,'â‚«')+'</span>';
				if (r[n].compare_at_price > 0 && r[n].compare_at_price > r[n].price){
					htmlItem += 				'<span class="proloop-label--on-sale">-'+Math.round(100 - (r[n].price / (r[n].compare_at_price /100)) )+'%</span>';
				}
				htmlItem += 				'</div>';
				htmlItem += 			'</div>';
				htmlItem += 			'<div class="proloop-rating">';
				htmlItem += 				'<span class="number">0.0</span>';
				htmlItem += 				'<span class="icon"><svg viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.09627 11.6195L2.82735 8.16864L0.268563 5.80414C0.268563 5.80414 -0.096986 5.48462 0.0248693 5.03728C0.146725 4.58994 0.634105 4.58994 0.634105 4.58994L4.04582 4.27041L5.38614 1.01124C5.38614 1.01124 5.5689 0.5 5.99538 0.5C6.42185 0.5 6.60461 1.01124 6.60461 1.01124L7.94493 4.27041L11.4785 4.58994C11.4785 4.58994 11.844 4.65385 11.9659 5.03728C12.0877 5.42071 11.844 5.67633 11.844 5.67633L9.1634 8.16864L9.89448 11.7473C9.89448 11.7473 10.0163 12.1308 9.71171 12.3864C9.40709 12.642 8.91971 12.3864 8.91971 12.3864L5.99538 10.5331L3.13197 12.3864C3.13197 12.3864 2.70551 12.642 2.33996 12.3864C1.97442 12.1308 2.09627 11.6195 2.09627 11.6195Z" fill="#FF8A00"/></svg></span>';
				htmlItem += 				'<span class="count">(0 Ä‘Ã¡nh giÃ¡)</span>';
				htmlItem += 			'</div>';
				htmlItem += 		'</div> ';
				htmlItem += 	'</div>	';
				htmlItem += '</div>';

			window.shop_tracking[n] = r[n];
			
			return htmlItem;
		}
		function loadItems(page,q,filters,check){
			if( q != '' ) {
				var data = {
					'search': q, //key
					'filters': filters,
					'pageIndex': page,
					'pageSize': 20
				}
				$.ajax({
					type: 'POST',
					url: 'https://gearvn.com/apps/gvn_search/search_products',
					async: false,
					dataType: 'json',
					data: JSON.stringify(data),
					headers: {
						/*'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.Mb6yacUPuc2_hp4dW-lHq7gnnxXMYsCVcTzfvux89lw',*/
						'Content-Type': 'application/json'
					},
					success: function(result){
						if(result.total > 0){
							GVN.Search.totalPageItem = Math.ceil(result.total / 20);
							if(page < GVN.Search.totalPageItem){
								$('#load_more_search').attr('data-current',page+1);
								$('#load_more_search').parents('.search-pagi').removeClass('d-none');
							}
							else{
								$('#load_more_search').parents('.search-pagi').addClass('d-none');
							}
							
							//Render Search Filter
							if (check != 'no'){
								var dataFilter = result.filterAttributes;
								htmlListFilter += render_filter(dataFilter);
								if(htmlListFilter != ''){
									$('.ajax-render-filter').html('').append(htmlListFilter);
									closePopup();
								}	
							}

							var temp = [], temp2 = {}, temp1 = [];
							$.each(result.data,function(j,k){
								temp.push(k.haravan_id);
								aIdSearch.push(k.haravan_id);
								temp2[k.haravan_id] = k;
							});
							aId = temp;
							dataItems = temp2;
							aIdSearch = GVN.Helper.uniques(aIdSearch);
							var str = "/search?q=filter=((id:product="+aIdSearch.join(')||(id:product=')+'))';
							GVN.Rating.checkRatingLoop(aIdSearch);
							GVN.AppPE.checkGiftPE(aIdSearch);
							$.ajax({
								url: str+'&view=dataproduct',
								type: 'GET',
								async: false,
								success: function(resultNew){
									resultNew = JSON.parse(resultNew);
									$.each(aIdSearch,function(i,v){
										if (resultNew[v] != undefined){
											htmlList += render_item(resultNew,i,v);
										}
									});
									if(htmlList != ''){
										$('.ajax-render').html('').append(htmlList);
										$('.search-page .subtext-result strong').html(keySearch);
										$('.search-page .subtext-result').removeClass('d-none');
										$('.search-page .expanded-message').addClass('d-none');
										$('.search-page').removeClass('js-loading');
										GVN.Global.supportCheckGiftPE(true);
									}	
									else {
										window.location.href = '/'; 
									}
								}
							});			
						}
						else {
							$('#load_more_search').attr('data-current','').parents('.search-pagi').addClass('d-none');
							$('.search-page .subtext-result').addClass('d-none');
							$('.search-page .expanded-message').removeClass('d-none');
							$('.search-page').removeClass('js-loading');
						}		
						
					},
					error: function(error) {
						console.log(error);
					}
				})
			}
			else {
				alert('Vui lÃ²ng nháº­p tá»« khoÃ¡');
			}
		}

		function activeOrUnActiveBlock(){
			$(".filter-single .jsTitle.showing").hasClass("active") ? $(".jsTitle").removeClass("active") : $(".jsTitle").removeClass("active");
		}
		function closePopup () {
			$(".filter-total--title").removeClass("active");
			$(".filter-total--content").removeClass("active");
			$(".filter-single .filter-group--block").removeClass("isShowing");
			$(".filter-single .filter-group--content").fadeOut(300);
			$(".filter-single .filter-group--title").removeClass("showing");
			activeOrUnActiveBlock();
			$("body").removeClass("bg-black");
			$("body").removeClass("overlay-filter");
			$('body,html').removeClass('open-noscroll open-overlay');
		}
		function tagSelected(standard){
			var optionPicked = [];
			$('.filter-total .filter-group[data-param="'+standard+'"] li.active').each(function(){
				optionPicked.push($(this).find('label').html());
			});
			if(optionPicked.length > 0){
				$('.filter-total .filter-tags[data-select="'+standard+'"] b').html(optionPicked.join(', '));
				$('.filter-total .filter-tags[data-select="'+standard+'"]').addClass('opened');
				$('.filter-single .filter-group[data-param="'+standard+'"]').addClass('hasSelect');
				if($('.filter-tags.opened').length > 0){
					/* In Total */
					$('.filter-tags--remove-all').addClass('opened');
					$('.filter-tags-wrap').removeClass('d-none');
				}
			}
			else{
				$('.filter-total .filter-tags[data-select="'+standard+'"] b').html('');
				$('.filter-total .filter-tags[data-select="'+standard+'"]').removeClass('opened');
				$('.filter-single .filter-group[data-param="'+standard+'"]').removeClass('hasSelect');
			}
			if($('.filter-total .filter-tags:not(.filter-tags--remove-all).opened').length == 0) $('.filter-tags--remove-all').removeClass('opened');
		}
		
		/* Search Normal -------- */
		$(document).on('click','#search-page form #go',function(e){
			e.preventDefault();
			$('.search-page').addClass('js-loading');
			var q = $(this).parents('form').find('input[name=q]').val();
			keySearch = q;
			aId = [], aIdSearch = [], htmlList = "",  dataItems = [];
			GVN.Search.totalPageItem = 0;
			if ($('.ajax-render').length > 0){
				$('.ajax-render').html('');
				$('#load_more_search').attr('data-current','').parents('.search-pagi').addClass('d-none');
			}
			loadItems(1,q,listATCNew);
		});
		$('#search-page form').submit(function(e) {
			e.preventDefault();
			$('.search-page').addClass('js-loading');
			var q = $(this).parents('form').find('input[name=q]').val();
			keySearch = q;
			aId = [], aIdSearch = [], htmlList = "",  dataItems = [];
			GVN.Search.totalPageItem = 0;
			if ($('.ajax-render').length > 0){
				$('.ajax-render').html('');
				$('#load_more_search').attr('data-current','').parents('.search-pagi').addClass('d-none');
			}
			loadItems(1,q,listATCNew);
		});
		$(document).on('click','#load_more_search',function(e){
			e.preventDefault();
			var page = Number($(this).attr('data-current'));
			var q = $('#search-page form input[name=q]').val();
			loadItems(page,q,listATCNew,'no');
		});		
		$(document).ready(function() {
			if (!$.isEmptyObject(paramUrl)) { // check paramUrl khÃ¡c rá»—ng
				$('.search-page').addClass('js-loading');
				if (paramUrl.hasOwnProperty('q')) {
					$('#search-page form #go').trigger('click');
					setTimeout(function(){
						$('.search-page').removeClass('js-loading');
					},1000);
				}
				else {
					$('.expanded-message').removeClass('d-none');
					$('.search-page').removeClass('js-loading');
				}
			}
			else {
				$('.expanded-message').removeClass('d-none');
				$('.search-page').removeClass('js-loading');
			}
		});		
		
		/* Search Filter -------- */
		
		// 1. Total Filter
		$(document).on('click','.filter-total .jsFilter',function(e){
			e.preventDefault();
			var self = $(this);
			$('.search-filter').removeClass('fixed-head').css('top',0);
			$('.search-filter .filter-wrap').removeClass('visible-title');
			
			GVN.Helper.smoothScroll(-100, 400);
			setTimeout(function() {
				self.addClass('active');
				self.parents('.filter-total').find('.filter-total--content').addClass('active');
				jQuery('body,html').addClass('open-noscroll open-overlay');
			},450);
		});
		$(document).on('click','.filter-total .filter-btn-close',function(e){
			e.preventDefault();
			$(this).parents('.filter-total').find('.filter-total--title').removeClass('active');
			$(this).parents('.filter-total').find('.filter-total--content').removeClass('active');
			$('body,html').removeClass('open-noscroll open-overlay');
		});
		$('body').on("click",".site-overlay", function (e) {
			$(this).removeClass("active");
			$('.filter-total--title').removeClass('active');
			$('.filter-total--content').removeClass('active');
		});

		// 2. Single Filter
		$(document).on('click', '.filter-single .jsTitle',function(e){
			e.preventDefault();
			var self = $(this);
			$('.search-filter').removeClass('fixed-head').css('top',0);
			$('.search-filter .filter-wrap').removeClass('visible-title');
			var h = $(".main-header").innerHeight();
			GVN.Helper.smoothScroll(h-80, 400);
			setTimeout(function() {
				$(".filter-single .filter-group--block").removeClass("isShowing");
				if ($("body").hasClass("bg-black")) {
					if (self.hasClass("showing")) {
						$("body").removeClass("bg-black");
						$(".filter-single .filter-group--block").removeClass("isShowing");
						$(".filter-single .filter-group--title").removeClass("showing");
						$(".filter-single .filter-group--content").fadeOut(300);
						activeOrUnActiveBlock();
					}
					else {
						$(".filter-single .filter-group--block.isShowing").removeClass("isShowing");
						$(".filter-single .filter-group--title.showing").removeClass("showing");
						$(".filter-single .filter-group--content").fadeOut();
						activeOrUnActiveBlock();
						self.parents(".filter-single .filter-group--block").find(".filter-group--content").fadeIn(300);
						self.addClass("active").addClass("showing");
						self.parents(".filter-single .filter-group--block").addClass("isShowing");
					}
				}
				else {
					self.addClass("showing");
					self.parents(".filter-single .filter-group--block").addClass("isShowing");
					self.next(".filter-single .filter-group--content").fadeIn(300);
					self.parent().hasClass("filter-total") ? $("body.bg-black").addClass("overlay-filter") : $("body.bg-black").removeClass("overlay-filter");
					$(".listbox__list-wrapper").fadeOut(0),$("body").addClass("bg-black");
				}
			},450);
		});
		$(document).on("click", ".bg-black", function(n) {
			n.target == this && closePopup()
		});
		
		// General
		$(document).on('click','.filter-group input',function(){
			var id = $(this).attr('id');
			var value = $(this).val();
			var standard = $(this).parents('.filter-group').attr('data-param');
			var hasActive = $(this).parent().hasClass('active');
			if(id.indexOf('sub-') > -1){ 
				/* Single */
				$('.filter-total input[value="'+value+'"]').click();
			}
			else { 
				/* Total */
				$(this).parent().toggleClass('active');
				$('.filter-single input[value="'+value+'"]').parent().toggleClass('active');
				var count_picked = $('.filter-single input[value="'+value+'"]').parents('.filter-group').find('li.active').length;
				if(count_picked > 0 || (count_picked == 0 && hasActive)){
					$('.filter-single input[value="'+value+'"]').parents('.filter-group').find('.btn-filter--apply').addClass('active');
					$('.filter-single input[value="'+value+'"]').parents('.filter-group').find('.btn-filter--unselect').addClass('active');
					$('.filter-total .btn-filter--apply').addClass('active');
				}
				else{
					$('.filter-single input[value="'+value+'"]').parents('.filter-group').find('.btn-filter--apply').removeClass('active');
					$('.filter-single input[value="'+value+'"]').parents('.filter-group').find('.btn-filter--unselect').removeClass('active');
				}
			}
			tagSelected(standard);
		});
		$(document).on('click','.btn-filter--apply',function(e){
			e.preventDefault();
			$('.search-page').addClass('js-loading');
			GVN.Search.totalPageItem = 0;
			aId = [], aIdSearch = [], htmlList = "",  dataItems = [], htmlListFilter = [], itemFilterObj = {}, listATCNew = [];
			var checkType = $(this).attr('data-check');
			$('.'+checkType+' .checkbox-list').each(function(index) {
				var filter_key = '', arrVal = [];
				if($(this).find('input[type="checkbox"]:checked').length > 0){
					$(this).find('input[type="checkbox"]:checked').each(function(ind){
						var filter_val = $(this).val();
						if (filter_key == '') {
							filter_key = $(this).attr('data-key');
						}
						arrVal.push(filter_val);
					});	
					itemFilterObj = {
						key: filter_key,
						values: arrVal
					};
					listATCNew.push(itemFilterObj);
				}
			});
			if ($('.ajax-render-filter').length > 0){
				$('.ajax-render-filter').html('');  
				$('.filter-control').addClass('d-none');
			}
			if ($('.ajax-render').length > 0){
				$('.ajax-render').html('');
				$('#load_more_search').attr('data-current','').parents('.search-pagi').addClass('d-none');
			}
			loadItems(1,keySearch,listATCNew);
			console.log(listATCNew);
		});
		$(document).on('click','.filter-tags--remove',function(e){
			e.preventDefault();
			var standard = $(this).parents('.filter-tags').attr('data-select');
			$(this).parents('.filter-tags').removeClass('opened');
			$(this).parents('.filter-tags').find('b').html('');
			$('.filter-total .filter-group[data-param="'+standard+'"] li').removeClass('active');
			$('.filter-single .filter-group[data-param="'+standard+'"] li').removeClass('active');
			$('.filter-single .filter-group[data-param="'+standard+'"]').removeClass('hasSelect');
			$(`.${standard}-group .btn-filter--unselect`).removeClass('active');
			var textTitle = $('.filter-single .filter-group[data-param="'+standard+'"] .jsTitle span:eq(0)').attr("data-text");
			$('.filter-single .filter-group[data-param="'+standard+'"] .jsTitle span:eq(0)').html(textTitle);

			if($('.filter-total .filter-tags:not(.filter-tags--remove-all).opened').length == 0){
				$('.filter-tags--remove-all').removeClass('opened');
				$('.filter-total .btn-filter--apply,.filter-total .btn-filter--unselect').removeClass('active');
				$('.filter-total .filter-number').html(0).addClass('d-none');
				$('.filter-single .jsTitle.showing').click();
			}
		});
		$(document).on('click','.filter-tags--remove-all',function(e){
			e.preventDefault();
			$('.filter-total .filter-tags').removeClass('opened');
			$('.filter-total .filter-tags b').html('');
			$('.filter-total .btn-filter--apply,.filter-total li.active,.filter-single li.active').removeClass('active');
			$('.filter-single .filter-group').removeClass('hasSelect');

			$('.filter-total .filter-number').html(0).addClass('d-none');
			$('.btn-filter--apply').removeClass('active');

			var textTitle = $('.filter-single .filter-group[data-param="vendor"] .jsTitle span:eq(0)').attr("data-text");
			$('.filter-single .filter-group[data-param="vendor"] .jsTitle span:eq(0)').html(textTitle);

		});
	},
	sliderSearch: function(){
		if( $('#home-flashsale-1 .listProduct-row').length > 0 ){
			if($(window).width() > 991){
				$('#home-flashsale-1 .listProduct-row').slick({
					slidesToShow: 6,
					prevArrow: '<button type="button" class="slick-prev"><svg width="8" height="17" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 50 50" enable-background="new 0 0 50 50" xml:space="preserve"><metadata><?xpacket begin="&#65279;" id="W5M0MpCehiHzreSzNTczkc9d"?><x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 5.3-c011 66.145661, 2012/02/06-14:56:27"/><?xpacket end="w"?></metadata><g display="none"><rect x="1" y="1" display="inline" fill="#000000" width="48" height="48"/></g><g><g><polygon points="34.675,47.178 12.497,25 34.675,2.822 37.503,5.65 18.154,25 37.503,44.35   "/></g></g></svg></button>',
					nextArrow: '<button type="button" class="slick-next"><svg width="8" height="17" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve"><polygon points="6.379,20.908 7.546,22.075 17.621,12 7.546,1.925 6.379,3.092 15.287,12 "/></svg></button>',
					rows: 1,
					slidesToScroll: 1,
					draggable: false,
					infinite: true,
					arrows: true,
					dots: true,
					responsive: [
						{
							breakpoint: 1024,
							settings: {
								slidesToShow: 5
							}
						}
					]
				});
			}
		}
	}
}
GVN.Init();


		
		
		
		
		