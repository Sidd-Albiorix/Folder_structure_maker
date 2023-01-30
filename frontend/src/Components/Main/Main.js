import { getSpaceUntilMaxLength } from '@testing-library/user-event/dist/utils';
import React, { useEffect, useState } from 'react'
import './Main.css'

export default function Main() {
    const [rootFolderStructure, setRootFolderStructure] = useState([
        // { name: 'Abc', isRootFolder: true },
        // { name: 'Zxc', parentFolder: 'Abc' },
        // { name: 'Qwe', isRootFolder: true },
        // { name: 'Mno', parentFolder: 'Qwe' },
        // { name: 'Pqr', parentFolder: 'Qwe', isSubFolder: true },
        // { name: 'Pqr 123', parentFolder: 'Pqr' },
        // { name: 'A123', parentFolder: 'Qwe', isSubFolder: true },
        // { name: 'B123', parentFolder: 'A123', isSubFolder: true },
        // { name: 'AAA', parentFolder: 'B123', isSubFolder: true },
        // { name: 'ABC', parentFolder: 'B123' },
        // { name: 'BBB', parentFolder: 'AAA', isSubFolder: true },
        // { name: 'CCC', parentFolder: 'BBB', isSubFolder: true },
        // { name: 'C123', parentFolder: 'BBB', },
        // { name: 'C123', parentFolder: 'CCC' },
        // { name: '123', isRootFolder: true }
    ])

    const [counter, setCounter] = useState(0);

    //     { 'A123': [] },
    //     { 'B123': [{ name: 'file 1' }] },
    //     { 'Abc': [{ name: 'file 1' }, { name: 'file 2' }] },
    //     {
    //         'Mno': [
    //             { name: 'file 1' }, { name: 'file 2' },
    //             {
    //                 'SubFolder1': [{ name: 'SubFolder1 file 1' }, { name: 'SubFolder1 file 2' },
    //                 { 'InnerFolder': [{ name: 'InnerFolder file 1' }, { name: 'InnerFolder file 2' }] }]
    //             }]
    //     },
    //     {
    //         'Qwe': [{ name: 'file 1' }, { name: 'file 2' }, { name: 'file 3' },
    //         {
    //             'SubFolder1': [{ name: 'SubFolder1 file 1' }, { name: 'SubFolder1 file 2' },
    //             { 'InnerFolder': [{ name: 'InnerFolder file 1' }, { name: 'InnerFolder file 2' }] }]
    //         }]
    //     },
    //     {
    //         'Last': [{ name: 'file 1' }, { name: 'file 2' }, { name: 'file 3' },
    //         {
    //             'A': [{ name: 'A file 1' },
    //             { 'B': [{ name: 'B file 1' }, { 'C': [{ name: 'C file 1' }, { 'D': [{ name: 'D file 1' }] }] }] }]
    //         }]
    //     }
    // ]);

    // let test = [
    //     { name: 'Abc', isRootFolder: true },
    //     { name: 'Qwe', isRootFolder: true },
    //     { name: '123', isRootFolder: true },
    //     { name: 'Zxc', parentFolder: 'Abc' },
    //     { name: 'Mno', parentFolder: 'Qwe' },
    //     { name: 'Pqr', parentFolder: 'Qwe' },
    //     { name: 'A123', parentFolder: 'Qwe', isSubFolder: true },
    //     { name: 'B123', parentFolder: 'A123' },
    //     { name: 'AAA', parentFolder: 'B123', isSubFolder: true },
    //     { name: 'BBB', parentFolder: 'AAA', isSubFolder: true },
    //     { name: 'CCC', parentFolder: 'CCC', isSubFolder: true },
    //     { name: 'C123', parentFolder: 'CCC' }
    // ]

    const [openAddRootFolderInput, setOpenAddRootFolderInput] = useState(false)

    useEffect(() => {
        fetch('http://localhost:5000/getFolderStructure')
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

    const updateBackEnd = (data) => {
        fetch('http://localhost:5000/addUpdateFolderStructure',
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

        const PopulateChildrenItems = ({ parentFolder, parentFolderId }) => {
            let subItems = rootFolderStructure.filter((obj, index) => obj.parentFolderId == String(parentFolderId))
            return (
                // subItems.length > 0 &&
                // <ul>
                //     {
                //         subItems.map((item, index) => (
                //             <li key={index}>
                //                 <span className='subItems'>
                //                     {item.name}
                //                     {
                //                         !item.isSubFolder ?
                //                             <CommonFolderControlBtns objectItemIndex={index} isSubFile={true} />
                //                             :
                //                             <>
                //                                 <CommonFolderControlBtns objectItemIndex={index} />
                //                                 <PopulateChildrenItems parentFolder={item.name} parentFolderId={item.id} />
                //                             </>
                //                     }
                //                 </span>
                //             </li>
                //         ))
                //     }
                // </ul>
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
