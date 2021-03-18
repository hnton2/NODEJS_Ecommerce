$(document).ready(function () {
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


    let pathname = window.location.pathname;
    let arrMenu = pathname.split("/");
    let currentMenu = arrMenu[2];
    $('li.nav-item a[data-active="'+currentMenu+'"]').addClass('active');
    if(currentMenu == 'article') {
        $('div.container-fluid.pb-4.pt-4.paddding').attr('id', 'fh5co-single-content');
        $('body').attr('class', 'single');
    }

    // search
    let $inputSearchValue = $('input[name = keyword]');
    let $btnSearch = $('button#btn_search');

    $inputSearchValue.keyup(function (event) {
        if (event.keyCode === 13) {
            $btnSearch.click();
        }
    });
    // Search Event
    $btnSearch.click(function () {
        let searchValue = $inputSearchValue.val().trim();
        let link = 'blog/search/';
        if (searchValue !== '') {
            link += 'keyword=' + searchValue.replace(/\s+/g, '+').toLowerCase();
            window.location.href = link;
        } else {
            Swal.fire('Nhập nội dung cần tìm kiếm!');
            $('form.search').submit(function() {
                return false;
              });
        }
    });

    // Subscribe button in footer
    $('a#basic-addon12').click( function () {
        var input = $('input#input-email');
        localStorage.setItem('name', input.val());
    });
    if(currentMenu == 'contact') {
        $('#fh5co_contact_form :input[name=email]').val(localStorage.getItem('name'));
        localStorage.removeItem('name');
    }

    // Form contact
    $('#fh5co_contact_form').submit( function() {
        link ='blog/contact/save';
        var $inputName = $('#fh5co_contact_form :input[name=name]');
        var $inputEmail = $('#fh5co_contact_form :input[name=email]');
        var $inputPhone = $('#fh5co_contact_form :input[name=phone]');
        var $inputMessage = $('#fh5co_contact_form :input[name=message]');

        if(!$inputName.val() || !$inputEmail.val() || !$inputPhone.val() || !$inputMessage.val()) {
            if(!$inputName.val()) {
                $('#fh5co_contact_form :input[name=name]').notify("Hãy nhập tên của bạn!", { position:"top", className: 'info' });
            }
            if(!$inputEmail.val()) {
                $('#fh5co_contact_form :input[name=email]').notify("Hãy nhập địa chỉ email của bạn!", { position:"top", className: 'info' });
            }
            if(!$inputPhone.val()) {
                $('#fh5co_contact_form :input[name=phone]').notify("Hãy nhập số điện thoại của bạn", { position:"top", className: 'info' });
            }
            if(!$inputMessage.val()) {
                $('#fh5co_contact_form :input[name=message]').notify("Hãy nhập nội dung bạn muốn gửi!", { position:"top", className: 'info' });
            }
            $('#fh5co_contact_form').submit(function() {
                return false;
            });
        } else {
            window.location.href = link;
        }

    });
});

function renderWeather(items) {
    let xhtml = `<div class="weather-card">
            <div class="top">
                <div class="wrapper">
                    <div class="mynav">
                        <a href="javascript:;"><span class="lnr lnr-chevron-left"></span></a>
                        <a href="javascript:;"><span class="lnr lnr-cog"></span></a>
                    </div>
                    <h1 class="heading">${items.weather[0].main}</h1>
                    <h3 class="location">Tp.Hồ Chí Minh <p>Việt Nam</p></h3>
                    <p class="temp">
                        <span class="temp-value">${items.main.temp}</span>
                        <span class="deg">0</span>
                        <a href="javascript:;"><span class="temp-type">C</span></a>
                    </p>
                </div>
            </div>
            <div class="bottom">
                <div class="wrapper">
                    <ul class="forecast">
                        <a href="javascript:;"><span class="lnr lnr-chevron-up go-up"></span></a>
                        <li class="active">
                            <span class="date">Độ ẩm</span>
                            <span class="lnr lnr-sun condition">
                                <span class="temp">${items.main.humidity}<span class="temp-type"> g/m</span><span class="deg">3</span></span>
                            </span>
                        </li>
                        <li class="active">
                            <span class="date">Sức gió</span>
                            <span class="lnr lnr-cloud condition">
                                <span class="temp">${items.wind.speed}<span class="temp-type"> km/h</span></span>
                            </span>
                        </li>
                    </ul>
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
            console.log(item);
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