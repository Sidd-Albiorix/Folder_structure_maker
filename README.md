# Folder_structure_maker
Folder structure maker onboarding assignment

### Folder "frontend" containes front end code(react)
### Folder "backend" containes back end code(node)

# Node api's are hosted on render.com
https://folder-structure-maker-api.onrender.com/getFolderStructure.

## Follow this steps to run project in local.
1. Go in each folder and run "npm i"
2. Go in "backend" folder and run "node index.js" => It'll start express server on "5000" port
3. Now to frontend folder and start react app via "npm start"

### All operations of folder structure is done in a "FileStructureData".txt in "backend" folder.
Sample Data heirarchy  
{ name: 'Abc', isRootFolder: true }  
{ name: 'Zxc', parentFolder: 'Abc' }  
{ name: 'A123', parentFolder: 'Abc', isSubFolder: true }  
{ name: 'B123', parentFolder: 'A123', isSubFolder: true }  
{ name: '123', isRootFolder: true }  


