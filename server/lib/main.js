/**
 * Created by cy on 22/11/15.
 *  init something when start app.
 */

// below is simpleschema debug mode, must be removed in production environment.
SimpleSchema.debug = true;

Meteor.startup(function () {
    if (Meteor.users.find().count() === 0 && Project.find().count() === 0 ) {
        Project.insert({
            name: "用可再生能源改变世界的梦想",
            owner: "123456789",   // this should be a user's id
            tags: ["能源", "改变世界", "想要更好"],
            category: "能源",
            introduction: "这肯定是一个能够改变世界的想法，我始终坚信这一点。",
            fullDescription: "可再生能源是很可贵的，非常有用，我们都相信这个东西肯定能够改变世界，还不赶紧加入我们，我们提供高于市场平均水平的薪资待遇，各种福利，你懂得。",
            demoUrl: "http://www.36kr.com",
            ownResource: "坚定不一的执行力，not just money."
        }, function (error, result) {
            if (error) {
                console.log(error);
            }
        });
        Project.insert({
            name: "综合各种线上应用，大招远程合作办公",
            owner: "12345676",
            tags: ["远程办公", "每一个人都应该拥有理想"],
            category: "互联网",
            introduction: "你拥有一个理想，在这里得到证明，寻找更多志同道合的小伙伴",
            fullDescription: "远程办公，必然是未来的趋势，而且能够极大的降低办公费用，当然沟通费用这个" +
            "问题是需要得到解决的。",
            demoUrl: "http://www.taobao.com",
            ownResource: "我相信这个肯定是一个非常好的模式，我要用这个改变世界。"
        }, function (error, result) {
           if (error) {
               console.log(error);
           }
        });
        var users = [
            {
                username: "cy476571",
                services: {
                    common: {md5Password: CryptoJS.MD5("wocy2008ok").toString()}
                },
                createdAt: new Date,
                profile: {
                    name: "chenyuan",
                    emails: [
                        {address: "cy476571@gmail.com", verified: true}
                    ],
                    introduction: "a geeker",
                    gender: "男",
                    location: "shanghai",
                    goodAt: ["table tennis", "web develop", "linux", "vim"]
                }
            },
            {
                username: "hackers92",
                services: {
                    common: {md5Password: CryptoJS.MD5("wocy2008ok").toString()}
                },
                createdAt: new Date,
                profile: {
                    name: "luzhao",
                    emails: [
                        {address: "476571969@qq.com", verified: false}
                    ],
                    introduction: "a dota lover.",
                    gender: "女",
                    location: "xianyang",
                    goodAt: ["dota", "poem", "sleep"]
                }
            },
            {
                username: "xiaotiancai",
                services: {
                    common: {md5Password: CryptoJS.MD5("wocy2008ok").toString()}
                },
                createdAt: new Date,
                profile: {
                    name: "michael jackson",
                    emails: [
                        {address: "2387785879@qq.com", verified: true}
                    ],
                    introduction: "a world famous singer",
                    gender: "male",
                    location: "usa washiton",
                    goodAt: ["sing", "dance", "and others"]
                }
            }
        ];
        _.each(users, function (item) {
            Meteor.users.insert(item, function (error, result) {
                console.log(error);
            });
        });
    }
});
