$(document).ready(function () {
    // rss
    let linkGold = $("#box-gold").data("url");
    let linkCoin = $("#box-coin").data("url");
    let linkBox1 = $("div#box-category1").data("url");

    $("#box-gold").load(linkGold, null, function(response, status) {
        let data = JSON.parse(response);
        //$("#box-gold").html(renderGoldTable(data));
    });
    
    $("#box-coin").load(linkCoin, null, function(response, status) {
        let data = JSON.parse(response);
        //$("#box-coin").html(renderCoinTable(data));
    });

    // article in category1
    $("div#box-category1").load(linkBox1, null, function(response, status) {
        let data = JSON.parse(response);
        console.log(linkBox1);
        //$("#box-category1").html(renderBoxNews(data));
    });

    // active menu
    let pathname = window.location.pathname;
    let arrMenu = pathname.split("/");
    let currentMenu = arrMenu[2];
    $('a.nav-item a[data-active="'+currentMenu+'"]').addClass('active');

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
        let link = '/search/';
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
});

function renderBoxNews (items) {
    let xhtml = '';
    items.forEach( (item) => {
        xhtml += `<div class="col-lg-6 py-3">
                    <div class="bg-light py-2 px-4 mb-3">
                        <h3 class="m-0">${item[0].category.name}</h3>
                    </div>
                    <div class="owl-carousel owl-carousel-3 carousel-item-2 position-relative">`;
        item.forEach( (article) => {
            xhtml += `<div class="position-relative">
                        <img class="img-fluid w-100" src="img/news-500x280-1.jpg" style="object-fit: cover;">
                        <div class="overlay position-relative bg-light">
                            <div class="mb-2" style="font-size: 13px;">
                                <a href="">Technology</a>
                                <span class="px-1">/</span>
                                <span>January 01, 2045</span>
                            </div>
                            <a class="h4 m-0" href="">Sanctus amet sed ipsum lorem</a>
                        </div>
                    </div>`;
        })       
        xhtml += `</div></div>`;
    })
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