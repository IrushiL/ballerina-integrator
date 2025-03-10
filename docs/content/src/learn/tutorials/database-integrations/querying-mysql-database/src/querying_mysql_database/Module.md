Guide on Querying MySQL Databases using Ballerina.

# Guide Overview

## About
Ballerina is an open-source programming language that empowers developers to integrate their system easily with the support of connectors. In this guide, we are mainly focusing on how to expose MySQL database as a service in Ballerina and do a select query upon it.

`ballerinax/java.jdbc` module allows you to perform CRUD operations using JDBC Client. You can find other integration modules from the [wso2-ballerina](https://github.com/wso2-ballerina) Github repository.

## What you'll build

Here the caller will send the last name of the employee for whom he wants to fetch the first name as a path parameter. Then the select query will be performed on the MySQL database and the results will be returned.

![querying mysql database](resources/querying-mysql.jpg)

## Prerequisites
Link to download Ballerina integrator.

- Download MySQL JDBC driver
- Create a folder called lib as shown in the folder structure and copy the downloaded jdbc_driver.jar into it.
- Add these code segment to ballerina.toml file in the root directory

```ballerina
[platform]
target = "java8"
[[platform.libraries]]
module = "querying_mysql_database"
path = "./lib/mysql-connector-java-8.0.17.jar"
 ```
- Run the employees.sql script inside resources folder to create the table and insert data required for the guide.

## Implementation
The Ballerina project is created for the integration use case explained above. Please follow the steps given below. You can learn about the Ballerina project and module by following the [documentation on creating a project and using modules](../../../../develop/using-modules/).

Create a project.
```bash
$ ballerina new querying-mysql-database
```
Navigate to the querying-mysql-database directory.

Add a module.
```bash
$ ballerina add querying_mysql_database
```

Add project configuration file by creating `ballerina.conf` file under the root path of the project structure. <br/>
This file should have the following MySQL database configurations.
```
MYSQL_URL = <jdbc_url><br/>
MYSQL_USERNAME = <mysql_username> <br/>
MYSQL_PASSWORD = <mysql_password> <br/>
```

Write your integration.
You can open the project with VS Code. The implementation will be written in the `main.bal` file.

## Run the integration
First, let’s build the module. While being in the querying_mysql_db directory, execute the following command.

```bash
$ ballerina build querying_mysql_database
```

The build command would create an executable .jar file. Now run the .jar file created in the above step.

```bash
$ java -jar target/bin/querying_mysql_database.jar
```

Send the following request where the last name is set as a path param.
```
$ curl -X GET http://localhost/staff/employee/collins
```

This will return the following response to the client if the request is successful.
```json
[
    {
        "firstName": "thomas"
    },
    {
        "firstName": "linda"
    }
]
```
