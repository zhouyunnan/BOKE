export default {
    navs: [{
            name: "首页",
            link: "home",
            icon: "iconfont iconshouye",
        },
        {
            name: "文章管理",
            icon: "iconfont iconwenzhang1",
            isopen: false,
            height: 0,
            second: [{
                    name: "发表新文章",
                    link: "activeadd",
                },
                // {
                //     name: "草稿",
                //     link: "type_wz",
                // },
                {
                    name: "历史发布",
                    link: "activelist",
                },
            ],
        },
        // {
        //     name: "话题管理",
        //     icon: "iconfont iconhuati",
        //     link: "type",
        // },
        {
            name: "相册管理",
            icon: "iconfont icontupian",
            link: "album",
        },
        // {
        //     name: "代码管理",
        //     icon: "iconfont iconfenlei",
        //     link: "type",
        // },
        {
            name: "栏目分类",
            icon: "iconfont iconweimingmingwenjianjia_lanmu",
            isopen: false,
            height: 0,
            second: [{
                    name: "文章栏目",
                    link: "type_wz",
                },
                {
                    name: "相册栏目",
                    link: "type_img",
                },
            ],
        },
        {
            name: "标签云",
            icon: "iconfont iconbiaoqian",
            link: "label",
        },
        {
            name: "友情链接",
            icon: "iconfont iconV",
            link: "links",
        },
        // {
        //     name: "栏目分类",
        //     icon: "iconfont iconfenlei",
        //     isopen: false,
        //     height: 0,
        //     second: [{
        //         name: "一级分类",
        //         link: "type"
        //     }, ]
        // },
    ],
};