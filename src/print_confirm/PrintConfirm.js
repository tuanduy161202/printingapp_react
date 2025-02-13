import React, { useState, useEffect } from 'react';
import configs from '../configs/api_config';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGlobalState } from '../GlobalStateContext';
import './PrintConfirm.css';
const moment = require('moment');
export function PrintConfirm() {
    const { globalVariable, setGlobalVariable } = useGlobalState();
    const location = useLocation();
    const [documents, setDocuments] = useState([]);
    const [printer, setPrinter] = useState(null);
    const [printconfigs, setConfigs] = useState(null);
    const [total_pages, setTotalPages] = useState(0)
    const navigate = useNavigate();
    useEffect(() => {
        fetch(configs.baseAPI + configs.getSelectedDocAPI)
            .then(response => response.json())
            .then(data => {
                setDocuments(data.data);
                let total = 0;
                if (data.data.length === 1) {
                    total = location.state.pages[1] - location.state.pages[0] + 1;
                } else {
                    data.data.forEach(element => {
                        total += element.pages;
                    })
                }
                setTotalPages(total * location.state.copies);
            })
            .catch(error => console.error('Error fetching documents:', error));
        setConfigs(location.state);
        fetch(configs.baseAPI + configs.getPrinterAPI + location.state.printer)
            .then(response => response.json())
            .then(data => {
                setPrinter(data.data);
            })
            .catch(error => console.error('Error fetching documents:', error));

    }, []);
    const handleClickPrint = () => {

        if (globalVariable.balance < total_pages) {
            alert('Số dư không đủ, hãy mua thêm giấy để tiếp tục!');
            return
        } else {
            fetch(configs.baseAPI + configs.createPrtConfigAPI, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(printconfigs),
            })
                .then(response => response.json())
                .then(data => {
                    documents.forEach((document) => {
                        let history = {
                            document_id: document._id,
                            config_id: data.data._id,
                            finish_date: new Date('2023-11-30'),
                        }
                        document.status = "inorder"
                        fetch(configs.baseAPI + configs.updateDocByIdAPI + document._id, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(document),
                        })
                            .then(response => response.json())
                            .then(data => {
                                console.log(data);
                            })
                            .catch(error => console.error('Error updating document:', error));

                        fetch(configs.baseAPI + configs.createHistoryAPI, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(history),
                        })
                            .then(response => response.json(history))
                            .then(data => {
                                navigate('/printtrack/');
                                setGlobalVariable({
                                    name: globalVariable.name,
                                    avatar: globalVariable.avatar,
                                    balance: globalVariable.balance - total_pages
                                })
                            })
                            .catch(error => console.error('Error updating document:', error));
                    })

                })
                .catch(error => console.error('Error updating document:', error));
        }
    }
    return (
        <div className="container" style={{maxWidth: '90%', marginBottom: '10vh'}}>
            <div className="row">
                <button onClick={handleClickPrint} className="btn btn-info m-4" type="button">IN NGAY</button>
            </div>
            <strong className="title">Tài liệu đã chọn: </strong>
            <div className='row mt-3'>
                {
                    documents.map((document) => {
                        return (
                            <div key={document._id} className="col-xl-4 col-md-6 col-sm-12">
                                <DocumentCard
                                    name={document.name}
                                    date={moment(document.date).format('DD/MM/YYYY')}
                                    pages={document.pages}
                                    format={document.format}
                                />
                            </div>
                        )
                    })
                }
            </div>

            <div className="row py-4">
                <div className="col-6">
                    <strong className="title">Máy in:</strong>
                    {printer? ("Máy " + printer.code + ", Loại: " + printer.type + ", Cơ sở: " + printer.campus + ", Tòa: " + printer.building + ", Tầng: " + printer.level):""}
                </div>
                <div className="col-6">
                    <strong className="title">Tổng số trang: </strong>
                    {total_pages}
                </div>
            </div>
            <strong className="title">Cài đặt in</strong>
            <div className="row m-4 justify-content-center">
                <div className="scrollbox">
                    {printconfigs && (
                        <div>
                            <p>Số bản sao: {printconfigs.copies}</p>
                            <p>Chọn trang in: {printconfigs.custom_print}</p>
                            {
                                (printconfigs.custom_print === "Custom Print") && <p>In trang: {printconfigs.pages[0]}-{printconfigs.pages[1]}</p>
                            }
                            <p>Số mặt in: {printconfigs.print_side}</p>
                            <p>Hướng giấy: {printconfigs.orientation}</p>
                            <p>Khổ giấy: {printconfigs.page_size}</p>
                            <p>Margin: {printconfigs.page_margin}</p>
                            <p>Số trang mỗi mặt: {printconfigs.pages_sheet}</p>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}

function DocumentCard({ name, date, pages, format }) {
    return (
        <div className="card" style={{marginBottom: '2rem', border: 0}}>
            <div className="card-body" style={{background: '#2d3638', borderRadius: '20px'}}>
                <div className="row align-items-center">
                    <div className="col-4">
                        {/*<img className="card-image" src={(format === 'pdf') ? "..\img\pdf.png" : "..\img\docx.png"} alt="thumbnail" />*/}
                        <img className="card-image" src="..\img\pdf.png" alt="thumbnail" />
                    </div>
                    <div className="col-8 align-items-center">
                        <div className = "d-flex flex-column">
                            <h4 className="card-title text-white mb-4">{name}</h4>
                            <p className="card-text text-white">Thời gian: {date}</p>
                            <p className="card-text text-white">Số trang: {pages}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PrintConfirm;
