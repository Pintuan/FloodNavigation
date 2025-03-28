USAGE

1. place "floodNavigation" folder to "xampp/htdocs/" (this will serve as your API and server)
2. install/start xampp
3. open phpmyadmin
4. create database "flood_navigation"
5. import the sql file located at "floodNavigation/flood_navigation.sql"
6. open "floodNavigationApp" in VS Code
7. in terminal, run "npm install" then "npm start"
8. using arduino, open the folder "Flood_level_sensor_code"
9. change the domain variable, use it to specify where is your "floodNavigation" server is.
9. connect the device and upload the "Flood_level_sensor_code.ino" in each devices
10. open phpmyadmin again, navigate to sensor table, double check if the ip address of the devices and the records in the table, this will used by the app as reference on what and where is your device