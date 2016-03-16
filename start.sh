#!/bin/bash

if [ "$MYSQL_SERVICE_DNS_NAME" ]; then
  TEMP_MYSQL=`echo $MYSQL_SERVICE_DNS_NAME |sed "s/-/_/g" |tr [a-z] [A-Z]`_SERVICE_HOST
  eval MYSQL_SERVICE_NAME=\${$TEMP_MYSQL}
fi

if [ "$MYSQL_PORT_3306_TCP_ADDR" ]; then
	sed  -i 's/^jdbc.url=.*$/jdbc.url=jdbc:mysql:\/\/'$MYSQL_PORT_3306_TCP_ADDR':'$MYSQL_PORT_3306_TCP_PORT'\/'$MYSQL_ENV_MYSQL_DATABASE' /g' /usr/local/tomcat/webapps/aicloudhis/WEB-INF/classes/config.properties


	sed -i  's/^jdbc.username=.*$/jdbc.username='$MYSQL_ENV_MYSQL_USER'/g' /usr/local/tomcat/webapps/aicloudhis/WEB-INF/classes/config.properties

	sed  -i 's/^jdbc.password=.*$/jdbc.password='$MYSQL_ENV_MYSQL_PASSWORD'/g' /usr/local/tomcat/webapps/aicloudhis/WEB-INF/classes/config.properties

fi

catalina.sh run
