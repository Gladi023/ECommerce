const router = require('express').Router();
const { Category, Product } = require('../../models');

const categoryAttributes = ['id', 'category_name'];
const productAttributes = ['id', 'product_name', 'price', 'stock', 'category_id'];
const include = [{ model: Product, attributes: productAttributes }];

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
    try {
        const categories = await Category.findAll({
            attributes: categoryAttributes,
            include
        });
        res.json(categories);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findOne({
            where: { id: req.params.id },
            attributes: categoryAttributes,
            include
        });
        if (!category) {
            res.status(404).json({ message: 'No category found with this id' });
            return;
        }
        res.json(category);
    } catch (error) {
        console.log(error);
        res.status(404).json(error);
    }
});

router.post('/', async (req, res) => {
    try {
        const newCategory = await Category.create({
            category_name: req.body.category_name
        });
        res.json(newCategory);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});
router.put('/:id', async (req, res) => {
    try {
        const [updatedRowsCount, updatedRows] = await Category.update(req.body, {
            where: { id: req.params.id },
            returning: true
        });
        if (!updatedRowsCount) {
            res.status(404).json({ message: 'No category found with this id' });
            return;
        }
        res.json(updatedRows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const deletedCategory = await Category.destroy({
            where: { id: req.params.id }
        });
        if (!deletedCategory) {
            res.status(404).json({ message: 'No category found with this id' });
            return;
        }
        res.json(deletedCategory);
    } catch (error) {
        console.log(error);
        res.status(404).json(error);
    }
});

    