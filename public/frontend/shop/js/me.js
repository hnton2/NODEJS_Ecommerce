$(document).ready(function () {
    //active menu
    let pathname = window.location.pathname;
    let arrMenu = pathname.split("/");
    let currentMenu = arrMenu[1];
    $('li.menu-item[data-active="'+currentMenu+'"]').addClass('current-menu-item');

    //save filter-category when refresh category
    if(currentMenu == 'category') {
        if (localStorage.getItem("filter-category") !== null) {
            let filterObj = JSON.parse(localStorage.getItem('filter-category'));
            $('#product-area').empty();
            $('#product-area').append('<div class="ps-widget__content"><div><div class="text-center"><img style="width: 150px" src="frontend/shop/images/loading.gif" alt=""></div></div></div>');
            
            $('ul.ps-list--checked li').removeClass('current');
            if(filterObj.id !== '') $('ul.ps-list--checked li#' + filterObj.id).addClass('current'); 
            $("#product-area").load(filterObj.link, null, function(response, status) {
                localStorage.setItem("filter-category", JSON.stringify(filterObj));
                let data = JSON.parse(response);
                $('#product-area').empty();
                $("#product-area").html(renderProduct(data));
            });
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
                    "message": "This is an info alert",
                    "priority": "info"
                }
            ]);
        }
        if (inputEmail.length <= 0 ) {
            $(document).trigger("set-alert-id-example", [
                {
                    "message": "This is an info alert",
                    "priority": "info"
                }
            ]);
        }
        if (inputPhone.length <= 0) {
            $(document).trigger("set-alert-id-example", [
                {
                    "message": "This is an info alert",
                    "priority": "info"
                }
            ]);
        }
        if(inputName.length <= 0 || inputEmail.length <= 0 || inputPhone.length <= 0) {
            event.preventDefault();
        }
    });
    // sort by product
    /* $('select[name=sort-by-product]').change(function() {
        var path = window.location.pathname.split('/');
        var linkRedirect = '/' + path[1] + '/' + path[2] + '/filter-category/' + $(this).val();
        window.location.pathname = linkRedirect;
    }); */
}); 

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

function changeCategory(link, id) {
    let filterObj = {};
    $('#product-area').empty();
    $('#product-area').append('<div class="ps-widget__content"><div><div class="text-center"><img style="width: 150px" src="frontend/shop/images/loading.gif" alt=""></div></div></div>');
    
    if($('ul.ps-list--checked li#' + id).hasClass( 'current' )){
        $('ul.ps-list--checked li#' + id).removeClass('current');
        $("#product-area").load('/category/all/shoes', null, function(response, status) {
            filterObj.id = '';
            filterObj.link = '/category/all/shoes';
            localStorage.setItem("filter-category", JSON.stringify(filterObj));
            let data = JSON.parse(response);
            $('#product-area').empty();
            $("#product-area").html(renderProduct(data));
        });
    } else {
        $('ul.ps-list--checked li').removeClass('current');
        $('ul.ps-list--checked li#' + id).addClass('current'); 
        $("#product-area").load(link, null, function(response, status) {
            filterObj.id = id;
            filterObj.link = link;
            localStorage.setItem("filter-category", JSON.stringify(filterObj));
            let data = JSON.parse(response);
            $('#product-area').empty();
            $("#product-area").html(renderProduct(data));
        });
    }

}

function renderProduct (item) {
    let folder_upload = 'uploads/shoes/';
    let linkShoes ='/shoes/';
    let xhtml = '';
    item.forEach( (item) => {
        xhtml += `<div class="ps-product__column">
        <div class="ps-shoe mb-30">
          <div class="ps-shoe__thumbnail">`;
        if(item.sale_off > 0) {
            xhtml += `<div class="ps-badge ps-badge--sale"><span>-${item.sale_off}%</span></div>`;
        }
        xhtml += `
            <a class="ps-shoe__favorite" href="#"><i class="ps-icon-heart"></i></a>
            <img src="${folder_upload + item.thumb[1]}" alt=""><a class="ps-shoe__overlay" href="${linkShoes + item.slug}"></a>
          </div>
          <div class="ps-shoe__content">
            <div class="ps-shoe__variants">
              <div class="ps-shoe__variant normal">
                <img src="${folder_upload + item.thumb[0]}" alt="">
                <img src="${folder_upload + item.thumb[1]}" alt="">
                <img src="${folder_upload + item.thumb[2]}" alt="">
                <img src="${folder_upload + item.thumb[3]}" alt="">
              </div>
              <select class="ps-rating ps-shoe__rating">
                <option value="1">1</option>
                <option value="1">2</option>
                <option value="1">3</option>
                <option value="1">4</option>
                <option value="2">5</option>
              </select>
            </div>
            <div class="ps-shoe__detail"><a class="ps-shoe__name" href="${linkShoes + item.id}">${item.name}</a>
              <p class="ps-shoe__categories"><a href="#">${item.category.name} shoes</a>,<a href="#"> ${item.brand.name}</a></p>
              <span class="ps-shoe__price">`;
        if(item.sale_off > 0) {
            xhtml+= `<del>$${item.price}</del> $${item.price - (item.price * (item.sale_off/100))}`;
        } else {
            xhtml += `$${item.price}`;
        }
        xhtml += `</span></div></div></div></div>`;
    });
    return xhtml;
}
