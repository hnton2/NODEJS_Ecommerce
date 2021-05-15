$(document).ready(function () {
    // ---BEGIN: ACTIVE MENU HEADER---
    let pathname = window.location.pathname;
    let arrMenu = pathname.split("/");
    let currentMenu = arrMenu[1];
    if(currentMenu.includes('category')) $('li.menu-item[data-active=category]').addClass('current-menu-item');
    $('li.menu-item[data-active="'+currentMenu+'"]').addClass('current-menu-item');
    // ---END: ACTIVE MENU HEADER---

    let linkHref =  $(location).attr("href");
    
    // ---BEGIN: CHOOSE CATEGORY---
    $('ul#category_product li').click(function(e) { 
        $('ul#category_product li').removeClass('current');
        var linkRedirect = '';
        let strEnd = '';
        let nameCategory = $(this).attr('data-name');
        if(linkHref.includes('slug')) {
            let splitHref = linkHref.split('slug=');
            let strQ = splitHref[1].split('&');
            if(strQ[1] !== undefined) strEnd = '&' + strQ[1];
            if(strQ[0] === nameCategory) {
                linkRedirect = splitHref[0].slice(0, splitHref[0].length - 1) + strEnd;
            } else {
                if(linkHref.indexOf('?') != -1) { var linkRedirect = splitHref[0] + 'slug=' + nameCategory + strEnd; } 
                else { var linkRedirect = splitHref[0].slice(0, splitHref[0].length - 1) + '?slug=' + nameCategory + strEnd; }
            }
        } else {
            $(this).addClass('current');
            if(linkHref.indexOf('?') != -1) { var linkRedirect = linkHref + '&slug=' + nameCategory; } 
            else { var linkRedirect = linkHref + '?slug=' + nameCategory; }
        }
        window.location.href = linkRedirect;
    });
    // ---END: CHOOSE CATEGORY---

    // ---BEGIN: SORT PRODUCT IN CATEGORY---
    $('select[name=sort-product]').change(function() {
        var linkRedirect = '';
        let strEnd = '';
        if(linkHref.includes('sort')) {
            let splitHref = linkHref.split('sort=');
            let strQ = splitHref[1].split('&');
            if(strQ[1] !== undefined) strEnd = '&' + strQ[1];
            linkRedirect = splitHref[0] + 'sort=' + $(this).val() + strEnd;
        } else {
            if(linkHref.indexOf('?') != -1) { linkRedirect = linkHref + '&sort=' + $(this).val(); } 
            else { linkRedirect = linkHref + '?sort=' + $(this).val(); }
        }
        window.location.href = linkRedirect;
    });
    // ---END: SORT PRODUCT IN CATEGORY---

    // ---BEGIN: CHOOSE SIZE IN CATEGORY---
    $("#table_size").on("click", "td", function() {
        $('#table_size td').removeClass('active');
        var linkRedirect = '';
        let strEnd = '';
        if(linkHref.includes('size')) {
            let splitHref = linkHref.split('size=');
            let strQ = splitHref[1].split('&');
            if(strQ[1] !== undefined) strEnd = '&' + strQ[1];
            if(strQ[0] === $(this).text()) {
                linkRedirect = splitHref[0].slice(0, splitHref[0].length - 1) + strEnd;
            } else {
                if(linkHref.indexOf('?') != -1) { var linkRedirect = splitHref[0] + 'size=' + $(this).text() + strEnd; } 
                else { var linkRedirect = splitHref[0].slice(0, splitHref[0].length - 1) + '?size=' + $(this).text() + strEnd; }
            }
        } else {
            $(this).addClass('active');
            if(linkHref.indexOf('?') != -1) { var linkRedirect = linkHref + '&size=' + $(this).text(); } 
            else { var linkRedirect = linkHref + '?size=' + $(this).text(); }
        }
        window.location.href = linkRedirect;
    });
    // ---END: CHOOSE SIZE IN CATEGORY---
    
    // ---BEGIN: CHOOSE COLOR IN CATEGORY---
    $('ul#color_product li').click(function(e) { 
        $('ul#color_product li').removeClass('current');
        var linkRedirect = '';
        let strEnd = '';
        if(linkHref.includes('color')) {
            let splitHref = linkHref.split('color=');
            let strQ = splitHref[1].split('&');
            if(strQ[1] !== undefined) strEnd = '&' + strQ[1];
            if(strQ[0] === $(this).text()) {
                linkRedirect = splitHref[0].slice(0, splitHref[0].length - 1) + strEnd;
            } else {
                if(linkHref.indexOf('?') != -1) { var linkRedirect = splitHref[0] + 'color=' + $(this).text() + strEnd; } 
                else { var linkRedirect = splitHref[0].slice(0, splitHref[0].length - 1) + '?color=' + $(this).text() + strEnd; }
            }
        } else {
            $(this).addClass('current');
            if(linkHref.indexOf('?') != -1) { var linkRedirect = linkHref + '&color=' + $(this).text(); } 
            else { var linkRedirect = linkHref + '?color=' + $(this).text(); }
        }
        window.location.href = linkRedirect;
    });
    // ---END: CHOOSE COLOR IN CATEGORY---

    // ---BEGIN: ACTIVE SIDEBAR CATEGORY---
    if(linkHref.includes('?')) {
        let queryString = linkHref.slice(linkHref.indexOf('?') + 1).split('&');
        queryString.forEach( (query) => {
            let item = query.split('=');
            if(item[0] === 'slug') {
                $("ul#category_product li").filter(function() { return $(this).attr('data-name') == item[1]; }).addClass('current');
            } else if(item[0] === 'sort') {
                $('select[name=sort-product]').val(item[1]);
                $('.selectpicker').selectpicker('refresh');
            } else if(item[0] === 'filter-price') {
                rangePrice = item[1].split('-');
                var el = $('.ac-slider');
                var min = el.siblings().find('.ac-slider__min');
                var max = el.siblings().find('.ac-slider__max');
                var defaultMinValue = rangePrice[0];
                var defaultMaxValue = rangePrice[1];
                var maxValue = el.data('max');
                var step = el.data('step');
                if (el.length > 0) {
                    el.slider({
                        min: 0,
                        max: maxValue,
                        step: step,
                        range: true,
                        values: [defaultMinValue, defaultMaxValue],
                        slide: function(event, ui) {
                            var $this = $(this),
                                values = ui.values;

                            min.text('$' + values[0]);
                            max.text('$' + values[1]);
                        }
                    });
                    var values = el.slider("option", "values");
                    min.text('$' + values[0]);
                    max.text('$' + values[1]);
                } else { return false; }
            } else if(item[0] === 'color') {
                $("ul#color_product li").filter(function() { return $(this).text() == item[1]; }).addClass('current');
            } else if(item[0] === 'size') {
                $("#table_size td").filter(function() { return $(this).text() == item[1]; }).addClass('active');
            }
        })
    }
    // ---END: ACTIVE SIDEBAR CATEGORY---
        
    // ---BEGIN: CHOOSE LOCATION WHEN CHECKOUT---
    if(currentMenu === 'checkout') {
        var localpicker = new LocalPicker({
            province: "ls_province",
            district: "ls_district",
            ward: "ls_ward",
            provinceText: 'Choose your province / city',
            districtText: 'Choose your district',
            wardText: 'Choose your ward',
        });
        $('select[name=ls_province]').change(function() {       // change province and calculate shipping fee
            let province = $(this).find('option:selected');
            let fee = 0;
            let totalBox = $('#total-price');
            $('input[name=province]').val(province.text());
            $.ajax({
                url: '/checkout/get-shipping-fee',
                type: 'get',
                success:function(data){
                    data.forEach( (item) => {
                        if(item.code === province.val()) {
                            fee = item.cost;
                            $('#shipping-fee').html('$ ' + fee);
                            totalBox.html('$ ' + (Number(totalBox.text().slice(2)) + Number(fee)));
                            $('input[name=shipping_fee]').val(fee);
                        }
                    });
                }
            });
        });
        $('select[name=ls_district]').change(function() {
            $('input[name=district]').val($(this).find('option:selected').text());
        });
        $('select[name=ls_ward]').change(function() {
            $('input[name=ward]').val($(this).find('option:selected').text());
        });
    }
    // ---END: CHOOSE LOCATION WHEN CHECKOUT---

    // ---BEGIN: ACTIVE MENU CATEGORY IN SIDEBAR---
    if(currentMenu == 'category') {
        if(arrMenu[2]) {
            $('ul.ps-list--checked li[data-name="'+ arrMenu[2] + '"]').addClass('current'); 
        }
    }
    // ---END: ACTIVE MENU CATEGORY IN SIDEBAR---

    // ---BEGIN: RSS NEWS---
    let linkGold = $("#box-gold").data("url");
    let linkCoin = $("#box-coin").data("url");
    let linkWeather = $("#box-weather").data("url");
    $("#box-gold").load(linkGold, null, function(response, status) {
        let data = JSON.parse(response);
        $("#box-gold").html(renderGoldTable(data));
    });
    $("#box-coin").load(linkCoin, null, function(response, status) {
        let data = JSON.parse(response);
        $("#box-coin").html(renderCoinTable(data));
    });
    $("#box-weather").load(linkWeather, null, function(response, status) {
        let data = JSON.parse(response);
        $("#box-weather").html(renderWeather(data));
    });
    // ---END: RSS NEWS---

    // ---BEGIN: NOTIFY LOGIN---
    $('#login-form').validate({ 
        errorElement: 'span',
        errorClass: 'help-inline',
        rules: {
            username: "required",
            password: "required",
        },
        messages: {
            name: "Please enter your name",
            password: "Please enter a valid password",
        },
        submitHandler: function(form) {
            form.submit();
        }
    });
    // ---END: NOTIFY LOGIN---

    // ---BEGIN: NOTIFY CONTACT---
    $('#contact-form').validate({ 
        errorElement: 'span',
        errorClass: 'help-inline',
        rules: {
            name: "required",
            email: {
                required: true,
                email: true
            },
            phone: {
                required: true,
                minlength: 8
            },
        },
        messages: {
            name: "Please enter your name",
            email: "Please enter a valid email address",
            phone: {
                required: "Please provide your phone number",
                minlength: "Your phone number must be at least 8 characters long"
            },
        },
        submitHandler: function(form) {
            form.submit();
        }
    });
    // ---END: NOTIFY CONTACT---

    // ---BEGIN: NOTIFY CHECKOUT---
    $('#checkout-form').validate({ 
        errorElement: 'span',
        errorClass: 'help-inline',
        rules: {
            name: "required",
            email: {
                required: true,
                email: true
            },
            phone: {
                required: true,
                minlength: 8
            },
            ls_province: "required",
            ls_district: "required",
            ls_ward: "required",
            address: "required",
        },
        messages: {
            name: "Please enter your name",
            email: "Please enter a valid email address",
            phone: {
                required: "Please provide your phone number",
                minlength: "Your phone number must be at least 8 characters long"
            },
            ls_province: "Please select your province",
            ls_district: "Please select your district",
            ls_ward: "Please select your ward",
            address: "Please enter your address",
        },
        submitHandler: function(form) {
            form.submit();
        }
    });
    // ---END: NOTIFY CHECKOUT---

    // ---BEGIN: NOTIFY REVIEW---
    $('#review-form').validate({ 
        errorElement: 'span',
        errorClass: 'help-inline',
        rules: {
            name: "required",
            email: {
                required: true,
                email: true
            },
            rating: "required",
            content: "required",
        },
        messages: {
            name: "Please enter your name",
            email: "Please enter a valid email address",
            rating: "Please rating the product",
            content: "Please enter your review",
        },
        submitHandler: function(form) {
            form.submit();
        }
    });
    // ---END: NOTIFY REVIEW---

    // ---BEGIN: SUBSCRIBE---
    $("#example").bsFormAlerts({"id": "example"});
    $(".ps-subscribe__form").submit(function(event ) {
        var inputEmail = $('#email-subscribe').val();
        $(document).trigger("clear-alert-id.example");
        if (inputEmail.length <= 0 ) {
            $(document).trigger("set-alert-id-example", [
                {
                    "message": "Please enter your name!",
                    "priority": "info"
                }
            ]);
            event.preventDefault();
        } else {
            event.preventDefault();
            $.ajax({
                url: '/subscribe',
                type: 'post',
                data:$('#email-subscribe').serialize(),
                success:function(data){
                    $('#email-subscribe').notify(data.message, { position:"top", className: 'success' });
                }
            });
        }
    });
    // ---END: SUBSCRIBE---

    // ---BEGIN: ADD TO CART---
    $("#cart_form").submit(function(event ) {
        var quantity = $('#quantity_input').val();
        var size = $('#size_select option:selected').val();
        $(document).trigger("clear-alert-id.notify_cart");
        if (Number(quantity) < 1 || Number(size) < 1 ) {
            $(document).trigger("set-alert-id-notify_cart", [
                {
                    "message": "Please choose size !!!",
                    "priority": "danger"
                }
            ]);
            event.preventDefault();
        } else {
            event.preventDefault();
            $.ajax({
                url: '/cart/add-to-cart',
                type: 'post',
                data:$('form').serialize(),
                success:function(data){
                    $('.ps-cart__toggle').append(`<span><i>${data.length}</i></span>`);
                    let total = 0;
                    let numberItems = 0;
                    let xhtml = `<div class="ps-cart__listing">
                    <div class="ps-cart__content">`;

                    data.forEach( (item) => {
                        xhtml += `<div class="ps-cart-item"><a class="ps-cart-item__close" href="/cart/delete/${item.id}"></a>
                          <div class="ps-cart-item__thumbnail"><a href="shoes/${item.slug}"></a><img src="uploads/shoes/${item.thumb}" alt=""></div>
                          <div class="ps-cart-item__content"><a class="ps-cart-item__title" href="shoes/${item.slug}">${item.name}</a>
                            <p><span>Quantity:<i>${item.quantity}</i></span><span>Price:<i>$${item.price}</i></span></p>
                          </div>
                        </div>`;
                        total += Number(item.quantity) * Number(item.price);
                        numberItems += Number(item.quantity);
                    });
                    xhtml += `</div>
                    <div class="ps-cart__total">
                        <p>Number of items:<span>${numberItems}</span></p>
                        <p>Item Total:<span>$${total}</span></p>
                    </div>
                    <div class="ps-cart__footer"><a class="ps-btn" href="/checkout">Check out<i class="ps-icon-arrow-left"></i></a></div>
                    </div>`;

                    $('.ps-cart').append(xhtml);
                    Swal.fire({
                        title: 'Add to cart success!',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            });
        }
    });
    // ---END: ADD TO CART---

    // ---BEGIN: SHOW PRODUCT WHEN ADD TO CART IN HEADER---
    if (typeof $.cookie('cart') !== 'undefined'){
        let data = JSON.parse($.cookie('cart').slice(2));
        $('.ps-cart__toggle').append(`<span><i>${data.length}</i></span>`);
        let total = 0;
        let numberItems = 0;
        let xhtml = `<div class="ps-cart__listing">
        <div class="ps-cart__content">`;

        data.forEach( (item) => {
            xhtml += `<div class="ps-cart-item"><a class="ps-cart-item__close" href="/cart/delete/${item.id}"></a>
                <div class="ps-cart-item__thumbnail"><a href="shoes/${item.slug}"></a><img src="uploads/shoes/${item.thumb}" alt=""></div>
                <div class="ps-cart-item__content"><a class="ps-cart-item__title" href="shoes/${item.slug}">${item.name}</a>
                <p><span>Quantity:<i>${item.quantity}</i></span><span>Price:<i>$${item.price}</i></span></p>
                </div>
            </div>`;
            total += Number(item.quantity) * Number(item.price);
            numberItems += Number(item.quantity);
        });
        xhtml += `</div>
        <div class="ps-cart__total">
            <p>Number of items:<span>${numberItems}</span></p>
            <p>Item Total:<span>$${total}</span></p>
        </div>
        <div class="ps-cart__footer"><a class="ps-btn" href="/checkout">Check out<i class="ps-icon-arrow-left"></i></a></div>
        </div>`;

        $('.ps-cart').append(xhtml);
    }
    // ---END: SHOW PRODUCT WHEN ADD TO CART IN HEADER---

    // ---BEGIN: PROMO CODE---
    $("#form-promotion").submit(function(event ) {
        var input = $('input[name=code]').val();
        $(document).trigger("clear-alert-id.example");
        if (input.length <= 0 ) {
            $(document).trigger("set-alert-id-example", [
                {
                    "message": "Please enter code promotion!",
                    "priority": "info"
                }
            ]);
            event.preventDefault();
        } else {
            event.preventDefault();
            $.ajax({
                url: '/checkout/apply-promo-code',
                type: 'post',
                data:$('input[name=code]').serialize(),
                success:function(data){
                    $('input[name=code]').notify(data.message, { position:"top", className: 'success' });
                    let textTotal = $('span#info-total-price').text();
                    let total = Number(textTotal.slice(1, textTotal.length - 2)) - data.saleOff;
                    $('span#info-total-price').html(total + ' $');
                    $('p#notify-promotion').html("You are using a promotional code worth " + data.saleOff + "$");
                }
            });
        }
    });
    // ---END: PROMO CODE---
});

function favoriteProduct(id) {
    link = '/shoes/favorite/' + id;
    $.ajax({
        url: link,
        type: 'post',
        success:function(data){
            Swal.fire({
                title: data.message,
                icon: 'success',
            });
        }
    });
}

function changeQuantity(id, state) {
    let counter = $('#quantity-' + id).val();
    let price = $('#price-' + id).text().slice(1);
    counter = Number(counter) + state ;
    $('#quantity-' + id).val(counter);
    $('#total-' + id).html('$' + price * Number(counter));
}

function renderWeather(items) {
    let xhtml = `<div class="container-fluid">
                    <div class="row justify-content-center">
                        <div class="col-12 col-md-12 col-sm-12 col-xs-12">
                            <div class="card p-4">
                                <div class="d-flex">
                                    <h6 class="flex-grow-1">Ho Chi Minh City</h6>
                                    <h6>16:08</h6>
                                </div>
                                <div class="d-flex flex-column temp mt-5 mb-3">
                                    <h1 class="mb-0 font-weight-bold" id="heading"> ${items.main.temp}° C </h1> <span class="small grey">${items.weather[0].main}</span>
                                </div>
                                <div class="d-flex">
                                    <div class="temp-details flex-grow-1">
                                        <p class="my-1"> <img src="https://i.imgur.com/B9kqOzp.png" height="17px"> <span> ${items.wind.speed} km/h </span> </p>
                                        <p class="my-1"> <i class="fa fa-tint mr-2" aria-hidden="true"></i> <span> ${items.main.humidity}% </span> </p>
                                        <p class="my-1"> <img src="https://i.imgur.com/wGSJ8C5.png" height="17px"> <span> 0.2h </span> </p>
                                    </div>
                                    <div> <img src="https://i.imgur.com/Qw7npIg.png" width="100px"> </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
    return xhtml;
}

function renderGoldTable(items) {
    let xhtml = '';
    items.forEach(
        (item) => {
            let currentItem = Object.values(item);
            xhtml += `<tr>
                <td>${currentItem[0].type}</td>
                <td>${currentItem[0].buy}</td>
                <td>${currentItem[0].sell}</td>
            </tr>`;
    });
    
    return `<table class="table table-bordered">
            <thead class="thead-dark">
                <tr>
                    <th><b>Loại vàng</b></th>
                    <th><b>Mua vào</b></th>
                    <th><b>Bán ra</b></th>
                </tr>
            </thead>
            <tbody>
                ${xhtml}
            </tbody>
        </table>`;
}

function renderCoinTable(items) {
    let xhtml = '';
    items.forEach(
        (item) => {
            let price = Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(item.quote.USD.price);
            let textColor = item.quote.USD.percent_change_24h > 0 ? 'text-success' : 'text-danger';
            let percentChange = Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(item.quote.USD.percent_change_24h) + "%";
            xhtml += `<tr>
                <td>${item.name}</td>
                <td>${price}</td>
                <td><span class="${textColor}">${percentChange}</span></td>
            </tr>`;
    });
    
    return `<table class="table table-bordered">
            <thead class="thead-dark">
                <tr>
                    <th><b>Name</b></th>
                    <th><b>Price (USD)</b></th>
                    <th><b>Change (24h)</b></th>
                </tr>
            </thead>
            <tbody>
                ${xhtml}
            </tbody>
        </table>`;
}

function filterPrice() {
    var el = $('.ac-slider');
    var linkRedirect = '';
    let strEnd = '';
    let linkHref =  $(location).attr("href");
    if (el.length > 0) {
        var values = el.slider("option", "values");
        if(linkHref.includes('filter-price')) {
            let splitHref = linkHref.split('filter-price=');
            let strQ = splitHref[1].split('&');
            if(strQ[1] !== undefined) strEnd = '&' + strQ[1];
            linkRedirect = splitHref[0] + 'filter-price=' + values[0] + '-' + values[1] + strEnd;
        } else {
            if(linkHref.indexOf('?') != -1) { linkRedirect = linkHref + '&filter-price=' + values[0] + '-' + values[1]; } 
            else { linkRedirect = linkHref + '?filter-price=' + values[0] + '-' + values[1]; }
        }
    }
    window.location.href = linkRedirect;
}