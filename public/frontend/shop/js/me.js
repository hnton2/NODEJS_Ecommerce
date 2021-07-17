$(document).ready(function () {
    // ---BEGIN: ACTIVE MENU HEADER---
    let pathname = window.location.pathname;
    let arrMenu = pathname.split("/");
    let currentMenu = arrMenu[1];
    if(currentMenu.includes('category')) $('li.menu-item[data-active=category]').addClass('current-menu-item');
    $('li.menu-item[data-active="'+currentMenu+'"]').addClass('current-menu-item');
    // ---END: ACTIVE MENU HEADER---

    let linkHref =  $(location).attr("href");
    let arrQuery = {};
    // ---BEGIN: CHANGE TYPE OF PRODUCT---
    $('select[name=all-product]').change(function() {
        let link =  $(location).attr("href");
        if(link.includes('shoes')) {
            link = link.replace('shoes', $(this).val())
        } else if(link.includes('clothing')) {
            link = link.replace('clothing', $(this).val())
        } else if(link.includes('accessory')) {
            link = link.replace('accessory', $(this).val())
        } else if(link.includes('trademark')) {
            link = link.replace('trademark', $(this).val())
        }
        window.location.href = link;
    });
    // ---END: CHANGE TYPE OF PRODUCT---

    // ---BEGIN: CHOOSE CATEGORY---
    $('ul#category_product li').click(function(e) {
        if($(this).hasClass('current')) {
            $('ul#category_product li').removeClass('current');
            arrQuery.category = '';
        } else {
            $('ul#category_product li').removeClass('current');
            $(this).addClass('current');
            arrQuery.category = $(this).attr('data-name');
        }
    });
    // ---END: CHOOSE CATEGORY---

    // ---BEGIN: FILTER PRICE---
    $('a#filter-price').click(function(e) { 
        var el = $('.ac-slider');
        if (el.length > 0) {
            var values = el.slider("option", "values");
            arrQuery.filter_price = values[0] + '-' + values[1];
        }
    });
    // ---END: FILTER PRICE---

    // ---BEGIN: CHOOSE BRAND---
    $('ul#brand_product li').click(function(e) { 
        if($(this).hasClass('current')) {
            $('ul#brand_product li').removeClass('current');
            arrQuery.brand = '';
        } else {
            $('ul#brand_product li').removeClass('current');
            $(this).addClass('current');
            arrQuery.brand = $(this).attr('data-name');
        }
    });
    // ---END: CHOOSE BRAND---

    // ---BEGIN: SORT PRODUCT IN CATEGORY---
    $('select[name=sort-product]').change(function() {
        arrQuery.sort = $(this).val();
    });
    // ---END: SORT PRODUCT IN CATEGORY---

    // ---BEGIN: CHOOSE SIZE IN CATEGORY---
    $("#table_size").on("click", "td", function() {
        if($(this).hasClass('current')) {
            $('#table_size td').removeClass('active');
            arrQuery.size = '';
        } else {
            $('#table_size td').removeClass('active');
            $(this).addClass('active')
            arrQuery.size = $(this).text();
        }
    });
    // ---END: CHOOSE SIZE IN CATEGORY---
    
    // ---BEGIN: CHOOSE COLOR IN CATEGORY---
    $('ul#color_product li').click(function(e) { 
        if($(this).hasClass('current')) {
            $('ul#color_product li').removeClass('current');
            arrQuery.color = '';
        } else {
            $('ul#color_product li').removeClass('current');
            $(this).addClass('current')
            arrQuery.color = $(this).text();
        }
    });
    // ---END: CHOOSE COLOR IN CATEGORY---

    // ---BEGIN: ACTIVE SIDEBAR CATEGORY---
    if(linkHref.includes('shoes')) {
        $('select[name=all-product]').val('shoes');
        $('.selectpicker').selectpicker('refresh');
    } else if(linkHref.includes('clothing')) {
        $('select[name=all-product]').val('clothing');
        $('.selectpicker').selectpicker('refresh');
    } else if(linkHref.includes('accessory')) {
        $('select[name=all-product]').val('accessory');
        $('.selectpicker').selectpicker('refresh');
    }
    if(linkHref.includes('?')) {
        let queryString = linkHref.slice(linkHref.indexOf('?') + 1).split('&');
        queryString.forEach( (query) => {
            let item = query.split('=');
            if(item[0] === 'slug') {
                $("ul#category_product li").filter(function() { return $(this).attr('data-name') == item[1]; }).addClass('current');
            } else if(item[0] === 'brand') {
                $("ul#brand_product li").filter(function() { return $(this).attr('data-name') == item[1]; }).addClass('current');
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

    // ---BEGIN: APPLY FILTER CATEGORY---
    $('button#apply-filter').click(function(e) {
        let linkPrefix =  $(location).attr("href").split('?')[0];
        let linkRedirect = linkPrefix;
        if(Object.keys(arrQuery).length !== 0) {
            linkRedirect += '?';
            if('category' in arrQuery && arrQuery.category !== '') linkRedirect += 'slug=' + arrQuery.category + '&';
            if('filter_price' in arrQuery && arrQuery.filter_price !== '') linkRedirect += 'filter_price=' + arrQuery.filter_price + '&';
            if('brand' in arrQuery && arrQuery.brand !== '') linkRedirect += 'brand=' + arrQuery.brand + '&';
            if('sort' in arrQuery && arrQuery.sort !== '') linkRedirect += 'sort=' + arrQuery.sort + '&'; 
            if('size' in arrQuery && arrQuery.size !== '') linkRedirect += 'size=' + arrQuery.size + '&';
            if('color' in arrQuery && arrQuery.color !== '') linkRedirect += 'color=' + arrQuery.color + '&';
        }
        linkRedirect = linkRedirect.slice(0, -1);
        window.location.href = linkRedirect;
    })
    // ---END: APPLY FILTER CATEGORY---
        
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
            $('#shipping-fee').html('<div class="lds-ring"><div></div><div></div><div></div><div></div></div>')
            $.ajax({
                url: '/checkout/get-shipping-fee',
                type: 'get',
                success:function(data){
                    data.forEach( (item) => {
                        if(item.code === province.val()) {
                            fee = item.cost;
                            if($('input[name=shipping_fee]').val() !== 0) {
                                let total = Number(totalBox.text().slice(1)) + Number(fee) - Number($('input[name=shipping_fee]').val());
                                totalBox.html('$' + total);
                            } else {
                                totalBox.html('$' + (Number(totalBox.text().slice(1)) + Number(fee)));
                            }
                            $('#shipping-fee').html('$' + fee);
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

    // ---BEGIN: SIDEBAR ADS BANNER---
    let linkAdsBanner = $("#ads-banners").data("url");
    let indexBanner = $("#ads-banners").data("number");
    let size = $("#ads-banners").data("size");
    let className = $("#ads-banners").data("class");
    $("#ads-banners").load(linkAdsBanner, null, function(response, status) {
        let data = JSON.parse(response);
        $("#ads-banners").html(renderBanner(data[indexBanner], className, size));
    });
    // ---END: SIDEBAR ADS BANNER---

    // ---BEGIN: SIDEBAR RECENT NEWS---
    let linkRecentNews = $("#recent-news").data("url");
    $("#recent-news").load(linkRecentNews, null, function(response, status) {
        let data = JSON.parse(response);
        $("#recent-news").html(renderSidebarRecentNews(data));
    });
    // ---END: SIDEBAR RECENT NEWS---

    // ---BEGIN: HOMEPAGE RECENT NEWS---
    let linkRecentNewsHomePage = $("#recent-news--home-page").data("url");
    $("#recent-news--home-page").load(linkRecentNewsHomePage, null, function(response, status) {
        let data = JSON.parse(response);
        $("#recent-news--home-page").html(renderSidebarRecentNewsHomePage(data));
    });
    // ---END: HOMEPAGE RECENT NEWS---

    // ---BEGIN: SIDEBAR BEST SELLER---
    let linkBestSeller = $("#sb-best-shoes").data("url");
    $("#sb-best-shoes").load(linkBestSeller, null, function(response, status) {
        let data = JSON.parse(response);
        $("#sb-best-shoes").html(renderSidebarBestSeller(data));
    });
    // ---END: SIDEBAR BEST SELLER---

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
            Swal.fire({
                title: 'Add to cart success!',
                icon: 'success',
                showConfirmButton: false,
                timer: 3000
            });
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
                          <div class="ps-cart-item__thumbnail"><a href="${item.product_type}/${item.slug}"></a><img src="uploads/${item.product_type}/${item.thumb}" alt=""></div>
                          <div class="ps-cart-item__content"><a class="ps-cart-item__title" href="${item.product_type}/${item.slug}">${item.name}</a>
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
                <div class="ps-cart-item__thumbnail"><a href="${item.product_type}/${item.slug}"></a><img src="uploads/${item.product_type}/${item.thumb}" alt=""></div>
                <div class="ps-cart-item__content"><a class="ps-cart-item__title" href="${item.product_type}/${item.slug}">${item.name}</a>
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
    $('#form-promotion').validate({ 
        errorElement: 'span',
        errorClass: 'help-inline',
        rules: {
            discount_code: {
                required: true,
                minlength: 5,
            }
        },
        messages: {
            discount_code: {
                required: "Please enter code promotion!",
                minlength: "Code promotion must be more than 5 characters"
            }
        },
        errorPlacement: function (error, element) {
            element.closest('.form-group').append(error);
        },
        submitHandler: function(form) {
            $('#notify_message').remove();
            $('.form-group').append('<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>');
            $.ajax({
                url: '/cart/apply-promo-code',
                type: 'POST',
                data:$('#form-promotion').serialize(),
                success:function(data) {
                    let textTotal = $('span#info-total-price').text().substring(1);
                    let total = Number(textTotal) - data.discount;
                    $('span#info-total-price').html('$' + total);
                    $('div.lds-ellipsis').remove();
                    $('.form-group').append(`<div id="notify_message">${data.message}</div>`);
                }
            });
        }
    });
    // ---END: PROMO CODE---

    // ---BEGIN: SEARCH WITH AUTOCOMPLETE---
    $("input#search-product").load('/all-name-product', null, function(response, status) {
        let data = JSON.parse(response);
        $.ui.autocomplete.prototype._renderItem = function (ul, item) {
            var re = new RegExp($.trim(this.term.toLowerCase()));
            var t = item.label.replace(re, "<span style='font-weight:600;color:#5C5C5C;'>" + $.trim(this.term.toLowerCase()) +
                "</span>");
            return $("<li></li>")
                .data("item.autocomplete", item)
                .append("<a>" + t + "</a>")
                .appendTo(ul);
        };
        $("input#search-product").autocomplete({
            source: data
        });
    });
    // ---END: SEARCH WITH AUTOCOMPLETE---

    // ---BEGIN: SHOW INFO PRODUCT EVENTS---
    $.ajax({
        url: '/event-shoes',
        type: 'get',
        success:function(data){
            let price = data[0].price - (data[0].price * data[0].sale_off);
            $('#product__price').html(`Only: <span>$${price}</span>`);
            $('#product__sold').html(`Already sold: <span>${data[0].sold}</span>`);
            $('#product__available').html(`Avaiable: <span>${data[0].quantity}</span>`);
            let progressValue = Math.floor(data[0].sold/data[0].quantity * 100);
            $('#progress__bar').html(`<div class="progress-bar" role="progressbar" aria-valuenow="${progressValue}" aria-valuemin="0" aria-valuemax="100" style="width: ${progressValue}%;"></div>`);
        }
    });
    // ---END: SHOW INFO PRODUCT EVENTS---


});

function getFormattedDate(date) {
    date = new Date(date);
    var year = date.getFullYear();
  
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
  
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    
    return month + '/' + day + '/' + year;
}

function favoriteProduct(id, name, type, thumb) {
    link = `/${type}/favorite/` + id;
    Swal.fire({
        title: name,
        icon: 'info',
        html: 'Do you like this ' + type + '?',
        imageUrl: 'uploads/' + type + '/' + thumb,
        imageAlt: name,
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        focusConfirm: false,
        confirmButtonText: '<i class="fa fa-thumbs-up"></i> Like!',
        confirmButtonAriaLabel: 'Thumbs up, like!',
        cancelButtonText: 'Cancel',
        cancelButtonAriaLabel: 'Cancel'
    }).then( (result) => {
        if (result.isConfirmed) {
            Swal.fire('Like Success!', '', 'success')
            $.ajax({
                url: link,
                type: 'post',
                success:function(data) { }
            });
        }
    })
}

function changeQuantity(link) {
    let elementLink = link.split('/');
    let state = elementLink[2].split('-');
    let index = $('#quantity-' + elementLink[3]);
    let allTotal = $('#info-total-price');
    let price = $('#price-' + elementLink[3]).text().substring(1);
    let operator = (state[2] === 'increase') ? 1 : -1;
    let quantity = Number(index.val()) + operator;
    if(quantity >= 0) {
        Swal.fire({
            title: 'Please wait !!!',
            html: 'Processing...',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
        });
        Swal.showLoading()
        $.ajax({
            url: link,
            type: 'post',
            success:function(data){
                index.val(quantity);
                $('#total-' + elementLink[3]).text('$' + (Number(price) * Number(quantity)));
                allTotal.text('$' + (Number(price)*operator + Number(allTotal.text().substring(1))));
                Swal.close();
            }
        });
    } else {
        Swal.fire({
            title: 'Quantity must be greater than 0 !!!',
            icon: 'error',
            showConfirmButton: false,
            timer: 3000
        });
    }
}

function renderBanner(item, className, size) {
    return `<a class="${className}" href="/${item.link}"><img src="uploads/banner/${item.thumb}" style="${size}" alt="Ads Banner"></a>`;
}

function renderSidebarRecentNews(items) {
    let xhtml = '';
    items.forEach ( (item)=> {
        xhtml += `<div class="ps-post--sidebar">
            <div class="ps-post__thumbnail">
                <a href="/news/${item.slug}"></a><img src="uploads/news/${item.thumb}" alt="${item.name}">
            </div>
            <div class="ps-post__content">
                <a class="ps-post__title" href="/news/${item.slug}">${item.name}</a>
            </div>
        </div>`
    })
    return xhtml;
}

function renderSidebarRecentNewsHomePage(items) {
    let topHtml = `<div class="trending-top mb-30">
                    <div class="trend-top-img">
                        <img src="uploads/news/${items[0].thumb}" alt="${items[0].name}">
                        <div class="trend-top-cap">
                            <span>${items[0].category.name}</span>
                            <h2><a href="/news/${items[0].slug}">${items[0].name}</a></h2>
                        </div>
                    </div>
                </div>`;
    let bottomHtml = '';
    let rightHtml = '';
    for(let i = 1; i < 4; i++) {
        bottomHtml += `<div class="col-lg-4">
                        <div class="single-bottom mb-35">
                        <div class="trend-bottom-img mb-30">
                            <img src="uploads/news/${items[i].thumb}" alt="${items[i].name}" style="max-width:330px;">
                        </div>
                        <div class="trend-bottom-cap">
                            <span class="color1">${items[i].category.name}</span>
                            <h4><a href="/news/${items[i].slug}">${items[i].name}</a></h4>
                        </div>
                        </div>
                    </div>`;
    }
    for(let i = 4; i < 9; i++) {
        rightHtml += `<div class="trand-right-single d-flex">
                        <div class="trand-right-img" style="width:220px;">
                            <img src="uploads/news/${items[i].thumb}" style="max-width:220px;object-fit:cover;" alt="${items[i].name}">
                        </div>
                        <div class="trand-right-cap">
                            <span class="color1">${items[i].category.name}</span>
                            <h4><a href="/news/${items[i].slug}">${items[i].name}</a></h4>
                        </div>
                    </div>`;
    }
    return `<div class="col-lg-8">
                ${topHtml}
                <div class="trending-bottom">
                    <div class="row">
                        ${bottomHtml}
                    </div>
                </div>
            </div>
            <div class="col-lg-4">
                ${rightHtml}
            </div>`;
}

function renderSidebarBestSeller(items) {
    let xhtml = '';
    items.forEach ( (item)=> {
        let price = item.sale_off > 0 ? `<del>$${item.price}</del> $${item.price - (item.price * (item.sale_off/100))}` : `$${item.price}`
        xhtml += `<div class="ps-shoe--sidebar">
                    <div class="ps-shoe__thumbnail">
                        <a href="/shoes/${item.slug}"></a><img src="uploads/shoes/${item.thumb[0]}" alt="${item.name}">
                    </div>
                    <div class="ps-shoe__content">
                        <a class="ps-shoe__title" href="/shoes/${item.slug}">${item.name}</a>
                        <p>
                            ${price}
                        </p>
                        <a class="ps-btn" href="/shoes/${item.slug}">PURCHASE</a>
                    </div>
                </div>`
    })
    return xhtml;
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
