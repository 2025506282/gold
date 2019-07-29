var fs = require("fs");
var path = require("path"); //解析需要遍历的文件夹
var filePath = path.resolve("./routes");
//调用文件遍历方法
fileDisplay(filePath);
//文件遍历方法
function fileDisplay(filePath) {
  //根据文件路径读取文件，返回文件列表
  fs.readdir(filePath, function(err, files) {
    if (err) {
      console.warn(err);
    } else {
      //遍历读取到的文件列表
      files.forEach(function(filename) {
        //获取当前文件的绝对路径
        var filedir = path.join(filePath, filename);
        //根据文件路径获取文件信息，返回一个fs.Stats对象
        fs.stat(filedir, function(eror, stats) {
          if (eror) {
            console.warn("获取文件stats失败");
          } else {
            var isFile = stats.isFile(); //是文件
            var isDir = stats.isDirectory(); //是文件夹
            if (isFile) {
              if (filename.indexOf("component.ts") !== -1) {
                let content = fs.readFileSync(filedir, "utf-8");
                var newContent = transContent(content);
                // console.log(content);
                fs.writeFile(filedir, newContent, 'utf8', (err) => {
                    if (err) throw err;
                    console.log('success done');
                })
              }
            }
            if (isDir) {
              fileDisplay(filedir); //递归，如果是文件夹，就继续遍历该文件夹下面的文件
            }
          }
        });
      });
    }
  });
}
/**
 * 替换一些需要换的内同
 * @param {*} content 
 */
function transContent(content) {
  var reg = new RegExp(/\n/g);
  var arr = content.split(reg);
  var exception = ["private", "protect", "public", "ngOnInit", "ngOnDestroy", "ngOnChanges"];
  for (var i = 0; i < arr.length; i++) {
    // 判断是否是函数
    if (arr[i].trim().indexOf("):") !== -1 || arr[i].trim().indexOf(") :") !== -1) {
      // console.log(arr[i]);
      if (!isHasExceptionWord(exception,arr[i])) {
        // console.log(arr[i]);
        arr[i] = "  public " + arr[i].trim();
      } else {
      }
    }
  }
  return arr.join('\n');
}
/**
 * 排除一些不需要替换的内容
 * @param {*} exceptions 
 * @param {*} p 
 */
function isHasExceptionWord(exceptions,p) {
    var isHasException = false;
    for(var i=0;i<exceptions.length;i++) {
        if(p.indexOf(exceptions[i])!==-1) {
            isHasException = true;
            break;
        }
    }
    return isHasException;
}
