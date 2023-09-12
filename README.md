# DBExtensionKitDemo

## Overview
DataBase Extension Kit helps you to extend your Umbraco database

It helps you to:
1. Create custom database structures
2. Automatically generate data management UI for you and site editors.
3. Save hours of development time and completely eliminate the need for extensive manual work.

This is the repository of its demo / tutorial project.
The demo project is a full implementation of a ready-made Careers module for your Umbraco website. 
It is based on an entity model created using the Database Extension Kit.
The demo project will show you all the important features of the Database Extension Kit package and provide best practices for front-end integration of entities created and managed using the package.

## Running the demo
### Pre-requisites

In order to run the demo project locally, you need to have the following software installed on your workstation:
* Microsoft SQL Server 2019 LocalDB
* Microsoft Visual Studio 2022 or Visual Studio Code 2022 with Umbraco Project template installed

The project comes with Umbraco 11 and the Database Extension Kit package already installed and contains a demo database which is powered by MS SQL Server LocalDB.

### Setting up the project

1. Download the project from GitHub and open the solution using Visual Studio 2022 or VS Code 2022.
2. The project uses SQL Server 2019 LocalDB instance, so make sure that the LocalDB is installed and up to date on your workstation.
3. The database files (DatabaseExtensionKitDemo.mdf and DatabaseExtensionKitDemo_log.ldf) are placed in the umbraco/Data folder of the project. If you wish to keep them elsewhere, you can move the database files to a different folder on your workstation and modify the settings file appsettings.json and/or appsettings.Development.json accordingly.
4. The demo project includes a homepage that displays the job list with different filter options, a page to display the detailed information for each job and an integrated application form.

## Related links

* Full demo documentation: [Demo Documentation](https://hexxu-services-ltd.gitbook.io/database-extension-kit-documentation/demo-project)
* DataBase Extension Kit website: [https://www.dbextensionkit.com/](https://www.dbextensionkit.com/)
* DataBase Extension Kit Getting Started Guide: [Getting Started](https://hexxu-services-ltd.gitbook.io/database-extension-kit-documentation/)
* Database Extension Kit Technical Documentation: [Technical Documentation](https://hexxu-services-ltd.gitbook.io/database-extension-kit-documentation/technical-documentation)
