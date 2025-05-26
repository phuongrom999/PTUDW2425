'use strict';

const helper = {};

helper.createStarList = (stars) => {
    let star = Math.floor(stars);
    let half = stars - star;
    let str = '<div class="ratting">';
    let i;
    
    // Thêm sao vàng đầy
    for (i = 0; i < star; i++) {
        str += '<i class="fa fa-star"></i>';
    }
    
    // Thêm nửa sao nếu có
    if (half > 0) {
        str += '<i class="fa fa-star-half-o"></i>';
        i++;
    }
    
    // Thêm sao trống cho đủ 5 sao
    for (; i < 5; i++) {
        str += '<i class="fa fa-star-o"></i>';
    }
    
    str += '</div>';
    return str;
}

module.exports = helper;