
module.exports = {
    prefixAdmin: 'admin',
    prefixBlog: 'blog',
    prefixShop: '',
    env: 'dev', // production dev
    format_date: 'DD-MM-YYYY',
    format_date_2: 'MMMM Do YYYY, h:mm:ss a',
    status_value: [
        {name: 'Choose Status', id: 'allValue'},
        {name: 'Active', id: 'active'},
        {name: 'InActive', id: 'inactive'},
    ],
    radio_object: [
		{value: 'yes', name: 'Yes'},
		{value: 'no', name: 'No'}
	],
    orders_state_value: [ // chờ xác nhận, chờ lấy hàng, đang giao, đã giao, đã hủy
		{id: 'confirming', name: 'Confirming'},
        {id: 'delivery', name: 'Delivery'},
        {id: 'delivered', name: 'Delivered'},
        {id: 'cancelled', name: 'Cancelled'},
	],
}