
const linkStatic = " https://eec9-171-252-189-193.ngrok-free.app/"
class HelperModel {
    convertLinkStatic = (params = [{}], key = "") => {
        params = params.map((item, index) => {
            if (item[key]) {
                item[key] = item[key].replace(/[&\/\\]/g,'/');
                item[key] = linkStatic + item[key]
            }
            return item;
        });
        return params;
    }

    convertLinkStaticObj = (item = {}, key = "") => {
        if (item[key]) {
            item[key] = item[key].replace(/[&\/\\]/g,'/');
            item[key] = linkStatic + item[key]
        }
        return item;
    }
}

module.exports = new HelperModel;
