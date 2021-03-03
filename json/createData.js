function getRandom(n,m) {
    return Math.round(Math.random() * (m - n) +n);
}
var str1 = '赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢邹喻柏水窦章云苏潘葛奚范彭郎鲁韦昌马苗凤花方俞任袁柳酆鲍史唐费廉岑薛雷贺倪汤'// 0-71
var str2 = '一二三四五六七八九十壹贰叁肆伍陆柒捌玖拾佰仟万亿';// 0-23

var ary = [],
    obj =null;
for (var i = 1; i <= 514; i++) {
    var obj = {};
    obj['id'] = i;
    obj['name'] = str1[getRandom(0, 71)] + str2[getRandom(0, 23)] + str2[getRandom(0, 23)];
    obj['sex'] = getRandom(0, 1);
    obj['score'] = getRandom(50, 99);
    ary.push(obj);
}
console.log(JSON.stringify(ary));