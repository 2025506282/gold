module.exports = {
    spiderTypes: [
        {
            id: 1,
            label: 'gold'
        },
        {
            id: 2,
            label: 'news'
        }
    ],
    spiderGoldForm: [
        {
            
        }
    ],
    spiderNewsForm: [
        {
            char: 'origin',
            name: '来源'
        },
        {
            char: 'title',
            name: '标题',
            selector: '.zbt',
        },
        {
            char: 'abstract',
            name: '摘要',
            selector: '.zhaiyao_word',
        },
        {
            char: 'publish_time',
            name: '发布时间',
            selector: '#pushtime',
        },
        {
            char: 'author',
            name: '作者',
            selector: '.zrbj',
        },
        {
            char: 'agenda',
            name: '经销商'
        },
        {
            char: 'content',
            name: '内容',
            selector: '.section_wrap',
        },
        {
            char: 'collected',
            name: '收藏数'
        },
        {
            char: 'like',
            name: '支持数'
        },
        {
            char: 'dislike',
            name: '不支持数'
        }
    ]
}