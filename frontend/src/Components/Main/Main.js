import React, { useEffect, useState } from 'react'
import './Main.css'

export default function Main() {
    // Folder structure sample
    // { name: 'Abc', isRootFolder: true },
    // { name: 'Zxc', parentFolder: 'Abc' },
    // { name: 'A123', parentFolder: 'Abc', isSubFolder: true },
    // { name: 'B123', parentFolder: 'A123', isSubFolder: true },
    // { name: '123', isRootFolder: true }
    const [rootFolderStructure, setRootFolderStructure] = useState([
    ])

    const [counter, setCounter] = useState(0);
    const [openAddRootFolderInput, setOpenAddRootFolderInput] = useState(false)

    //fetch initial structure from backend
    useEffect(() => {
        fetch(process.env.REACT_APP_API_URL_HOSTED + '/getFolderStructure')
            .then(res => res.json())
            .then(res => {
                if (res.isSuccess) {
                    console.log(res)
                    let cntVal = localStorage.getItem('counter') ? Number(localStorage.getItem('counter')) : 0;
                    console.log(cntVal)
                    setCounter(cntVal)
                    setRootFolderStructure(res.data)
                }
                else
                    console.log(res.msg)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    //To update folder structure data
    const updateBackEnd = (data) => {
        fetch(process.env.REACT_APP_API_URL_HOSTED + '/addUpdateFolderStructure',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(data => {
                if (data.isSuccess) {
                    console.log('Add/update data response - ' + data)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    //To add file/folder to backend
    const onSubmitAddOrFolder = (e, fileType, parentFolder, parentFolderId) => {
        e.preventDefault();
        let getCnt = () => {
            let tmpVal = counter + 1;
            setCounter(tmpVal)
            localStorage.setItem('counter', tmpVal)
            return tmpVal;
        }

        if (fileType == 'rootFolder') {
            let inputValue = e.target.elements.inputfileFolderName.value;

            let dataToSubmit = [...rootFolderStructure, { name: inputValue, isRootFolder: true, id: getCnt() }]
            setRootFolderStructure(dataToSubmit)
            updateBackEnd(dataToSubmit)
        }
        else if (fileType == 'subFile') {
            let inputValue = e.target.elements.inputfileFolderName.value;

            let fileToAdd = { name: inputValue, parentFolder: parentFolder, parentFolderId: parentFolderId, id: getCnt() }
            let dataToSubmit = [...rootFolderStructure, fileToAdd]
            setRootFolderStructure(dataToSubmit)
            updateBackEnd(dataToSubmit)
        }
        else {
            let inputValue = e.target.elements.inputfileFolderName.value;

            let folderToAdd = { name: inputValue, parentFolder: parentFolder, isSubFolder: true, parentFolderId: parentFolderId, id: getCnt() }
            let dataToSubmit = [...rootFolderStructure, folderToAdd]
            setRootFolderStructure(dataToSubmit)
            updateBackEnd(dataToSubmit)
        }
        setOpenAddRootFolderInput(false)
    }

    const CommonFolderControlBtns = ({ objData, isSubFile }) => {
        const [showFileFolderSelection, setShowFileFolderSelection] = useState(false)
        const [addFileOrFolderDivState, setAddFileOrFolderDivState] = useState(false)
        const [selectedFileType, setSelectedFileType] = useState('')

        //delete root folder
        const deleteItem = () => {
            let filteredData = rootFolderStructure.filter((item) => item.id != objData['id'] && item.parentFolderId != objData['id']);
            setRootFolderStructure(filteredData)
            updateBackEnd(filteredData)
        }

        //selects file type(file/folder)
        const fileSelection = (fileType) => {
            setAddFileOrFolderDivState(true)
            setSelectedFileType(fileType)
        }

        return (
            showFileFolderSelection ?
                <ul>
                    <li>
                        {
                            addFileOrFolderDivState ?
                                <div className='addRootFolderDiv'>
                                    <form onSubmit={e => onSubmitAddOrFolder(e, selectedFileType, objData['name'], objData['id'])}>
                                        <input type='text' name='inputfileFolderName' required />
                                        <button type='submit'>+</button>
                                        <button onClick={() => { setShowFileFolderSelection(false); setAddFileOrFolderDivState(false) }}>X</button>
                                    </form>
                                </div>
                                :
                                <>
                                    <button className='addFolderItemsbtn' onClick={() => fileSelection('subFile')}>File</button>
                                    <button className='deleteFolderBtn' onClick={() => fileSelection('subFolder')}>Folder</button>
                                </>
                        }
                    </li>
                </ul>
                :
                <div className='folderBtnGrp'>
                    {isSubFile ?
                        <button className='deleteFolderBtn' onClick={deleteItem}>-</button>
                        :
                        <>
                            <button className='addFolderItemsbtn' onClick={() => setShowFileFolderSelection(true)}>+</button>
                            <button className='deleteFolderBtn' onClick={deleteItem}>-</button>
                        </>
                    }
                </div>
        )
    }

    //Shows div to add file/folder
    const AddFileOrFolderDiv = ({ opsType }) => {
        return (
            <div className='addRootFolderDiv'>
                <form onSubmit={e => onSubmitAddOrFolder(e, opsType)}>
                    <input type='text' name='inputfileFolderName' required />
                    <button type='submit'>+</button>
                    <button onClick={() => setOpenAddRootFolderInput(false)}>X</button>
                </form>
            </div>
        )
    }

    //Render whole folder structure
    const RenderFolderStructure = () => {
        //render childern items
        const PopulateChildrenItems = ({ parentFolder, parentFolderId }) => {
            return (
                rootFolderStructure.map(obj => (
                    obj.parentFolderId == String(parentFolderId) && obj.id != String(parentFolderId) &&
                    <ul>
                        <li key={obj.id}>
                            <span className='subItems'>
                                {obj.name}
                                {
                                    !obj.isSubFolder ?
                                        <CommonFolderControlBtns objData={obj} isSubFile={true} />
                                        :
                                        <>
                                            <CommonFolderControlBtns objData={obj} />
                                            <PopulateChildrenItems parentFolder={obj.name} parentFolderId={obj.id} isSubFolder={true} />
                                        </>
                                }
                            </span>
                        </li>
                    </ul>
                ))
            )
        }

        return (
            rootFolderStructure.length > 0 &&
            <ul>
                {
                    rootFolderStructure.map((rootFolder, index) => (
                        rootFolder.isRootFolder &&
                        <li key={index}>
                            <span className='rootFolders'>
                                {rootFolder.name} <CommonFolderControlBtns objData={rootFolder} />
                            </span>
                            <PopulateChildrenItems parentFolder={rootFolder.name} parentFolderId={rootFolder.id} />
                        </li>
                    ))
                }
            </ul>
        )
    }

    return (
        <div className='mainWrapper'>
            <h1 className='headerh1'> Folder Structure Maker </h1>
            <div className='contentWrapper'>
                <button className='addRootFolderBtn' onClick={() => setOpenAddRootFolderInput(true)}>Add folder to root</button>
                <RenderFolderStructure />
                {openAddRootFolderInput && <AddFileOrFolderDiv opsType='rootFolder' />}
            </div>
        </div >
    )
}
