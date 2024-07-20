#!/usr/bin/expect
spawn sftp raspl
expect "sftp"
send "cd /home/linsy/www/nblog/2ng/\n"
send "put h.zip\n"
send "exit\n"
expect eof
exit

