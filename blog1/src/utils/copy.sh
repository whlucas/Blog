# 这是一个拆分日志的shell脚本，windows下运行不了，要linux或者mac可以

# 第一行要有一个这个,表示当前系统行这个shell脚本的执行文件(当时的原话，也没懂啥意思)
#!/bin/sh

# cd 到日志文件夹下
cd E:/前端/advanced/Blog/blog1/logs

# 拷贝并且重命名,给他前面加一个日期
cp access.log $(date +%Y-%m-%d).access.log

# 清空:把空字符串赋值给access.log
echo "" > access.log


# 定时触发就只需要在命令行 crontab -e
# 在编辑器里面输入
# 这样在每天的0.00分就会触发脚本
# *0*** sh E:/前端/advanced/Blog/blog1/src/utils/copy.sh

