
export default async function handler(req, res) {
    const { url } = req.query;
    const { parser } = require('html-metadata-parser');

    parser(`${url}`).then(result=>{
       return res.status(200).json(JSON.stringify(result, null, 3));
    })

    return res.status(400);
};