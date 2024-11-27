
const linkStatic = "https://89e3-2405-4802-90f8-4ff0-41f-fecc-6fa8-474f.ngrok-free.app/"
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
