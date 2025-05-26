'use strict';

const models = require('../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;

const getData = async(req, res, next) => {
    try {
        let categories = await models.Category.findAll({
            include: [{
                model: models.Product
            }]
        });
        res.locals.categories = categories;

        let brands = await models.Brand.findAll({
            include: [{
                model: models.Product
            }]
        });
        res.locals.brands = brands;

        let tags = await models.Tag.findAll();
        res.locals.tags = tags;
        next();
    } catch (error) {
        next(error);
    }
};

const show = async (req, res, next) => {
    try {
        let category = isNaN(req.query.category) ? 0 : parseInt(req.query.category);
        let brand = isNaN(req.query.brand) ? 0 : parseInt(req.query.brand);
        let tag = isNaN(req.query.tag) ? 0 : parseInt(req.query.tag);
        let keyword = req.query.keyword || '';
        let sort = ['price','newest','popular'].includes(req.query.sort) ? req.query.sort : 'price';
        let page = isNaN(req.query.page) ? 1 : Math.max(1, parseInt(req.query.page));

        let options = {
            attributes: ['id', 'name','imagePath','stars','price','oldPrice'],
            where: {}
        };
        if(category > 0) {
            options.where.categoryId = category;   
        }
        if(brand > 0) {
            options.where.brandId = brand;
        }
        if(tag > 0) {
            options.include = [{
                model: models.Tag,
                where: {id: tag}
            }];
        }

        if(keyword.trim() != '') {
            options.where.name = {
                [Op.iLike]: `%${keyword}%`
            }
        }

        switch (sort) {
            case 'newest':
                options.order = [['createdAt','DESC']];
                break;
            case 'popular':
                options.order = [['stars','DESC']];
                break;
            default:
                options.order = [['price','ASC']];
        }
        res.locals.sort = sort;
        res.locals.originalUrl = removeParam('sort', req.originalUrl);
        if(Object.keys(req.query).length == 0) {
            res.locals.originalUrl = res.locals.originalUrl + "?";
        }
        const limit = 6;
        options.limit = limit;
        options.offset = limit * (page - 1);
        let {rows, count} = await models.Product.findAndCountAll(options);
        res.locals.pagination = {
            page: page,
            limit: limit,
            totalRows: count,
            queryParams: req.query
        }

        res.locals.products = rows;
        res.render('product-list');
    } catch (error) {
        next(error);
    }
};

const showDetails = async (req, res, next) => {
    try {
        let id = isNaN(req.params.id) ? 0 : parseInt(req.params.id);

        let product = await models.Product.findOne({
            attributes: ['id','name','stars','oldPrice','price','summary','description','specification'],
            where: {id},
            include: [{
                model: models.Image,
                attributes: ['name','imagePath']
            },{
                model: models.Review,
                attributes: ['id','review','stars','createdAt'],
                include: [{
                    model: models.User,
                    attributes: ['firstName','lastName']
                }]
            },{
                model: models.Tag,
                attributes: ['id']
            }]
        });
        
        if (!product) {
            return res.status(404).render('error', { message: 'Product not found' });
        }

        res.locals.product = product;

        let tagIds = [];
        product.Tags.forEach(tag => tagIds.push(tag.id));
        let relatedProducts = await models.Product.findAll({
            attributes: ['id','name','imagePath','oldPrice','price'],
            include: [{
                model: models.Tag,
                attributes: ['id'],
                where: {
                    id: {[Op.in]: tagIds}
                }  
            }]
        });
        res.locals.relatedProducts = relatedProducts;
        res.render('product-detail');
    } catch (error) {
        next(error);
    }
};

function removeParam(key, sourceURL) {
    var rtn = sourceURL.split("?")[0],
        param,
        params_arr = [],
        queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
    if (queryString !== "") {
        params_arr = queryString.split("&");
        for (var i = params_arr.length - 1; i >= 0; i -= 1) {
            param = params_arr[i].split("=")[0];
            if (param === key) {
                params_arr.splice(i, 1);
            }
        }
        if (params_arr.length) rtn = rtn + "?" + params_arr.join("&");
    }
    return rtn;
}

module.exports = {
    getData,
    show,
    showDetails
};