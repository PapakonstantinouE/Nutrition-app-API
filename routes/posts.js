const router = require('express').Router();
const verify = require('./verifyToken');

router.get('/', verify, (req,res) => {
    // res.send(req.user);
    res.json({
        posts: {
            title: 'my first post',
            descr: 'random text'
        }
    })
})

module.exports = router;
