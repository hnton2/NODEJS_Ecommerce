$(document).ready(function () {
    // choose location
    var localpicker = new LocalPicker({
		province: "ls_province",
		district: "ls_district",
		ward: "ls_ward",
        provinceText: 'Choose province / city',
        districtText: 'Choose district',
        wardText: 'Choose ward',
    });
    $('select[name=ls_province]').change(function() {
        let province = $(this).find('option:selected').text();
        let fee = 0;
        let totalBox = $('#total-price');
        $('input[name=province]').val(province);
        $.ajax({
            url: '/checkout/get-shipping-fee',
            type: 'get',
            success:function(data){
                data.forEach( (item) => {
                    if(item.name === province) {
                        fee = item.value;
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

    //active menu
    let pathname = window.location.pathname;
    let arrMenu = pathname.split("/");
    let currentMenu = arrMenu[1];
    if(currentMenu.includes('category'))     $('li.menu-item[data-active=category]').addClass('current-menu-item');
    $('li.menu-item[data-active="'+currentMenu+'"]').addClass('current-menu-item');

    // active filter by price
    if(arrMenu[2]){
        if(arrMenu[2].includes('filter-category')){
            var el = $('.ac-slider');
            var min = el.siblings().find('.ac-slider__min');
            var max = el.siblings().find('.ac-slider__max');
            var defaultMinValue = arrMenu[3].split('-')[0];
            var defaultMaxValue = arrMenu[3].split('-')[1];
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
            }
            else {
                return false;
            }
        }
    }

    // active menu sidebar category
    if(currentMenu == 'category') {
        if(arrMenu[2]) {
            $('ul.ps-list--checked li[data-name="'+ arrMenu[2] + '"]').addClass('current'); 
        }
    }

    // rss
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

    // notify for contact
    $("#example").bsFormAlerts({"id": "example"});
    $(".ps-contact__form").submit(function(event ) {
        var inputName = $('#name-input').val();
        var inputEmail = $('#email-input').val();
        var inputPhone = $('#phone-input').val();
        $(document).trigger("clear-alert-id.example");
        if (inputName.length <= 0 ) {
            $(document).trigger("set-alert-id-example", [
                {
                    "message": "Please enter your name! ",
                    "priority": "info"
                }
            ]);
        }
        if (inputEmail.length <= 0 ) {
            $(document).trigger("set-alert-id-example", [
                {
                    "message": "Please enter your email! ",
                    "priority": "info"
                }
            ]);
        }
        if (inputPhone.length <= 0) {
            $(document).trigger("set-alert-id-example", [
                {
                    "message": "Please enter your phone number! ",
                    "priority": "info"
                }
            ]);
        }
        if(inputName.length <= 0 || inputEmail.length <= 0 || inputPhone.length <= 0) {
            event.preventDefault();
        }
    });

    // subscribe
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

    //add product to cart
    $("#cart_form").submit(function(event ) {
        var quantity = $('#quantity_input').val();
        var size = $('#size_select option:selected').val();
        $(document).trigger("clear-alert-id.notify_cart");
        if (Number(quantity) < 1 || Number(size) < 1 ) {
            $(document).trigger("set-alert-id-notify_cart", [
                {
                    "message": "Please choose info product !!!",
                    "priority": "info"
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
                    });
                }
            });
        }
    });
    // show product in cart in header (get from cookie)
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

    // use promo code
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
});

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
    if (el.length > 0) {
        var values = el.slider("option", "values");
        var linkRedirect = 'category/filter-category/' + values[0] + '-' + values[1];
        console.log(values[0],'-', values[1]);

        window.location.pathname = linkRedirect;
    }
    else {
        return false;
    }
}