$(document).ready(function () {
    let linkGold = $("#box-gold").data("url");
    let linkCoin = $("#box-coin").data("url");

    $("#box-gold").load(linkGold, null, function(response, status) {
        let data = JSON.parse(response);
        $("#box-gold").html(renderGoldTable(data));
    });
    
    $("#box-coin").load(linkCoin, null, function(response, status) {
        let data = JSON.parse(response);
        $("#box-coin").html(renderCoinTable(data));
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