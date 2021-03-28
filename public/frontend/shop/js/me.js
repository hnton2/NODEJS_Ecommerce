$(document).ready(function () {
    //active menu
    let pathname = window.location.pathname;
    let arrMenu = pathname.split("/");
    let currentMenu = arrMenu[2];
    $('li.menu-item[data-active="'+currentMenu+'"]').addClass('current-menu-item');

});