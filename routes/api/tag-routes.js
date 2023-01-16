router.get('/', async (req, res) => {
    try {
    const tags = await Tag.findAll({
    attributes: ['id', 'tag_name'],
    include: [{ model: Product, attributes: ['id', 'product_name', 'price', 'stock', 'category_id'] }]
    });
    res.json(tags);
    } catch (error) {
    console.log(error);
    res.status(500).json(error);
    }
    });
    
    router.get('/:id', async (req, res) => {
    try {
    const tag = await Tag.findOne({
    where: { id: req.params.id },
    attributes: ['id', 'tag_name'],
    include: [{ model: Product, attributes: ['id', 'product_name', 'price', 'stock', 'category_id'] }]
    });
    if (!tag) {
    res.status(404).json({ message: 'No tag found with this id' });
    return;
    }
    res.json(tag);
    } catch (error) {
    console.log(error);
    res.status(404).json(error);
    }
    });
    router.post('/', async (req, res) => {
        try {
            const newTag = await Tag.create({
                tag_name: req.body.tag_name
            });
            res.json(newTag);
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    });
    router.put('/:id', async (req, res) => {
        try {
        const dbTagData = await Tag.update(req.body, {
        where: {
        id: req.params.id
        }
        });
        if (!dbTagData[0]) {
        res.status(404).json({ message: 'No tag found with this id' });
        return;
        }
        res.json(dbTagData);
        } catch (err) {
        console.log(err);
        res.status(500).json(err);
        }
        });

        router.delete('/:id', async (req, res) => {
            try {
                // delete on tag by its `id` value
                const dbTagData = await Tag.destroy({
                    where: {
                        id: req.params.id
                    }
                });
        
                if (!dbTagData) {
                    res.status(404).json({ message: 'No tag found with this id' });
                    return;
                }
                res.json(dbTagData);
            } catch (error) {
                console.log(error);
                res.status(500).json(error);
            }
        });
        module.exports = router;