import db from '../../models/index';

let getHomepage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        return res.render('homepage.ejs', {
            data: JSON.stringify(data)
        });//do trong viewEngine đã set url rồi
    } catch (e) {
        console.log(e);
    }
}

let getAboutPage = (req, res) => {
    return res.render('./test/about.ejs');
}
module.exports = {
    getHomepage: getHomepage,
    getAboutPage: getAboutPage,
}