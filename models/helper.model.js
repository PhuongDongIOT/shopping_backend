
const linkStatic = "localhost:4000/"
class HelperModel {
    convertLinkStatic = (params = [{}], key = "") => {
        params = params.map((item, index) => {
            if (item[key]) item[key] = linkStatic + item[key];
            return item;
        });
        return params;
    }
}

module.exports = new HelperModel;
