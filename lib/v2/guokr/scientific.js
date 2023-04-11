const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const response = await got('https://m.guokr.com/beta/proxy/science_api/articles?retrieve_type=by_category&page=1');

    const result = response.data;

    ctx.state.data = {
        title: '果壳网 科学人',
        link: 'https://www.guokr.com/scientific',
        description: '果壳网 科学人',
        item: await Promise.all(
            result.map((item) =>
                ctx.cache.tryGet("http://www.guokr.com/article/" + item.id, async () => {
                    const res = await got("http://www.guokr.com/article/" + item.id);
                    const $ = cheerio.load(res.data);
                    item.description = $('.eflYNZ #js_content').css('visibility', 'visible').html() ?? $('.bxHoEL').html();
                    return {
                        title: item.title,
                        description: item.description,
                        pubDate: item.date_published,
                        link: "http://www.guokr.com/article/" + item.id,
                        author: item.author.nickname,
                    };
                })
            )
        ),
    };
};
