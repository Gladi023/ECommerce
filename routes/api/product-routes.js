const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

router.get('/', async (req, res) => {
try {
const products = await Product.findAll({
attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
include: [
{
model: Category,
attributes: ['id', 'category_name']
},
{
model: Tag,
attributes: ['id', 'tag_name']
}
]
});
res.json(products);
} catch (error) {
console.log(error);
res.status(500).json(error);
}
});

router.get('/:id', async (req, res) => {
    try {
    const product = await Product.findOne({
    where: {
    id: req.params.id
    },
    attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
    include: [
    {
    model: Category,
    attributes: ['id', 'category_name']
    },
    {
    model: Tag,
    attributes: ['id', 'tag_name']
    }
    ]
    });
    if (!product) {
    res.status(404).json({ message: 'No product found with this id' });
    return;
    }
    res.json(product);
    } catch (error) {
    console.log(error);
    res.status(500).json(error);
    }
    });

    // create new product

    router.post('/', async (req, res) => {
        try {
        const product = await Product.create(req.body);
        if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map(tag_id => ({
        product_id: product.id,
        tag_id,
        }));
        const productTagIds = await ProductTag.bulkCreate(productTagIdArr);
        res.status(200).json(productTagIds);
        } else {
        res.status(200).json(product);
        }
        } catch (error) {
        console.log(error);
        res.status(400).json(error);
        }
        });

        // update product
router.put('/:id', async (req, res) => {
    try {
        // update product data
        await Product.update(req.body, {
            where: {
                id: req.params.id,
            },
        });

        // find all associated tags from ProductTag
        const productTags = await ProductTag.findAll({ where: { product_id: req.params.id } });

        // get list of current tag_ids
        const productTagIds = productTags.map(({ tag_id }) => tag_id);

        // create filtered list of new tag_ids
        const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
                return {
                    product_id: req.params.id,
                    tag_id,
                };
            });

        // figure out which ones to remove
        const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);

        // run both actions
        const [destroyedProductTags, createdProductTags] = await Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
        ]);

        res.json([...destroyedProductTags, ...createdProductTags]);
    } catch (err) {
        res.status(400).json(err);
    }
});
router.delete('/:id', async (req, res) => {
    try {
    const deletedProduct = await Product.destroy({
    where: { id: req.params.id }
    });
    if (!deletedProduct) {
    res.status(404).json({ message: 'No product found with this id' });
    return;
    }
    res.json(deletedProduct);
    } catch (error) {
    console.log(error);
    res.status(500).json(error);
    }
    });
        
        module.exports = router;