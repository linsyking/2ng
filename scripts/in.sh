#!/usr/bin/expect
spawn ssh raspl
expect "linsy"
send "cd /home/linsy/www/nblog/2ng/\n"
send "rm -rf build\n"
send "unzip -q h.zip\n"
send "rm -f h.zip\n"
send "exit\n"
expect eof
exit
