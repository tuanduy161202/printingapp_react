﻿import React, { useState, useEffect } from 'react';
import './ConfigPrint.css';
import { useNavigate } from 'react-router-dom';
import configs from '../configs/api_config';
const ConfigPrint = () => {
    const [printers, setPrinters] = useState([]);
    const [selectedPrinter, setSelectedPrinter] = useState("Nothing");
    const [numberCopy, setNumberCopy] = useState(1);
    const [selectedCustomPrint, setSelectedCustomPrint] = useState("Print all Pages");
    const [firstNumberPage, setFirstNumberPage] = useState(0);
    const [secondNumberPage, setSecondNumberPage] = useState(0);
    const [selectedPrintSide, setSelectedPrintSide] = useState("Print One Sided");
    const [selectedCollated, setSelectedCollated] = useState("Nothing");
    const [selectedOrientation, setSelectedOrientation] = useState("Portrait Orientation");
    const [selectedSizePage, setSelectedSizePage] = useState("A4");
    const [selectedMarginPage, setSelectedMarginPage] = useState("Normal Margin");
    const [selectedSheetPage, setSelectedSheetPage] = useState("1 Page Per Sheet");
    const [oneDoc, setOneDoc] = useState(false);
    const [maxPages, setMaxPages] = useState(0);
    const navigate = useNavigate();

    const handlePrinterChange = (event) => {
        setSelectedPrinter(event.target.value);
    };

    const handleCustomPrintChange = (event) => {
        setSelectedCustomPrint(event.target.value);
        if (event.target.value === "Print all Pages") {
            setFirstNumberPage(1);
            setSecondNumberPage(maxPages);
        }

    };

    const handlePrintSideChange = (event) => {
        setSelectedPrintSide(event.target.value);

    };

    const handleFirstNumberPageChange = (event) => {
        setFirstNumberPage(event.target.value);
    };
    const handleSecondNumberPageChange = (event) => {
        setSecondNumberPage(event.target.value);
    };

    const handleCollectedChange = (event) => {
        setSelectedCollated(event.target.value);
    };

    const handleOrientationChange = (event) => {
        setSelectedOrientation(event.target.value);
    };

    const handleSizePageChange = (event) => {
        setSelectedSizePage(event.target.value);
    };

    const handleMarginPageChange = (event) => {
        setSelectedMarginPage(event.target.value);
    };

    const handleSheetPageChange = (event) => {
        setSelectedSheetPage(event.target.value);
    };

    const handlePrintButtonClick = () => {
        const printconfigs = {
            copies: numberCopy,
            printer: selectedPrinter,
            custom_print: selectedCustomPrint,
            pages: [firstNumberPage, secondNumberPage],
            print_side: selectedPrintSide,
            orientation: selectedOrientation,
            page_size: selectedSizePage,
            page_margin: selectedMarginPage,
            pages_sheet: selectedSheetPage,
        }
        navigate('/printconfirm/', { state: printconfigs });
    };

    const handleCopyChange = (event) => {
        setNumberCopy(event.target.value);
    };
    useEffect(() => {
        if (printers.length === 0) {
            fetch(configs.baseAPI + configs.getPrinterAPI)
                .then(response => response.json())
                .then(data => { setPrinters(data.data) })
                .catch(error => console.error('Error fetching printers:', error));
        }
        if (document.getElementById('secondNumberPage')) {
            document.getElementById('secondNumberPage').min = firstNumberPage;
            if (!document.getElementById('secondNumberPage').value || document.getElementById('secondNumberPage').value < document.getElementById('firstNumberPage').value)
                setSecondNumberPage(firstNumberPage);
        }
        if ((selectedPrinter === "Nothing")) {
            fetch(configs.baseAPI + configs.getSelectedDocAPI)
                .then(response => response.json())
                .then(data => {
                    console.log(data.data.length);
                    if (data.data.length === 1) {
                        setOneDoc(true);
                        setMaxPages(data.data[0].pages);
                        setFirstNumberPage(1);
                        setSecondNumberPage(data.data[0].pages);

                    } else {
                        setOneDoc(false);
                        document.getElementById('customprint').value = 'Print all Pages';
                        setSelectedCustomPrint('Print all Pages');
                    }
                })
                .catch(error => console.error('Error fetching documents:', error));
        }

    }, [firstNumberPage, secondNumberPage]);
    return (
        <div className='container d-flex flex-column py-4 py-xl-5'>
            <div className='row '>
                <div className='col-sm-6'>
                    <div className='row'>
                        <div className='col-3' id='print-button'>
                            <button onClick={handlePrintButtonClick} className={((selectedPrinter !== "Nothing") ? "enabled" : "disabled") + "-print-button"} disabled={(selectedPrinter === "Nothing") }>In tài liệu</button>
                        </div>
                        <div className='col-9' style={{ paddingLeft: '2rem' }}>
                            <label htmlFor="numberCopy" style={{ marginRight: '2rem' }}>Copy:</label>
                            <input
                                type="number"
                                id="numberCopy"
                                value={numberCopy}
                                onChange={handleCopyChange}
                                className="custom-input"
                                min="0"
                                step="1"
                                style={{ marginBottom: '1rem', }}
                            />
                        </div>
                        <div className='col-12' id='select-printer'>
                            <label htmlFor="printer" className="daudong">Printer:</label>
                            <div className="config-box">
                                <select id="printer" value={selectedPrinter} onChange={handlePrinterChange} className="custom-select">
                                    <option value="Nohing" hidden>{" "}</option>
                                    {
                                        printers.map((printer, index) => {
                                            const printer_text = "Máy " + printer.code + ", Loại: " + printer.type + ", Cơ sở: " + printer.campus + ", Tòa: " + printer.building + ", Tầng: " + printer.level;
                                            return <option key={index} value={printer._id}>{printer_text}</option>
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className='col-12'>
                            <label htmlFor="customprint" className="daudong" style={{ marginTop: '1rem' }}>Settings:</label>
                            <div className="config-box">
                                <select id="customprint" value={selectedCustomPrint} onChange={handleCustomPrintChange} className="custom-select" disabled={!oneDoc}>
                                    <option value="Nohing" hidden>{" "}</option>
                                    <option value="Print all Pages">Print all Pages</option>
                                    <option value="Custom Print">Custom Print</option>
                                </select>
                            </div>
                        </div>
                        {
                            (selectedCustomPrint === "Custom Print") && (
                            <div className='col-2'>
                                <label htmlFor="numberPage">Pages:</label>
                            </div>)
                        }
                        {
                            (selectedCustomPrint === "Custom Print") && (
                                <div className='col-10'>
                                    <div style={{ display: 'flex' }}>
                                        <input
                                            type="number"
                                            id="firstNumberPage"
                                            value={firstNumberPage}
                                            onChange={handleFirstNumberPageChange}
                                            className="custom-input"
                                            min="1"
                                            max={toString(maxPages)}
                                            step="1"
                                            style={{ width: '4rem', marginRight: '0.2rem', marginBottom: '1rem' }}
                                        />
                                        <span style={{ margin: '0 0.5rem' }}>-</span>
                                        <input
                                            type="number"
                                            id="secondNumberPage"
                                            value={secondNumberPage}
                                            onChange={handleSecondNumberPageChange}
                                            className="custom-input"
                                            min={toString(firstNumberPage)}
                                            max={toString(maxPages)}
                                            step="1"
                                            style={{ width: '4rem', marginLeft: '0.2rem', marginBottom: '1rem' }}
                                        />
                                    </div>
                                </div>
                            )
                        }

                        <div className='col-12'>
                            <div className="config-box">
                                <select id="printside" value={selectedPrintSide} onChange={handlePrintSideChange} className="custom-select">
                                    <option value="Print One Sided">Print One Sided</option>
                                    <option value="Manually Print on Both Sides">Manually Print on Both Sides</option>
                                </select>
                            </div>
                        </div>
                        <div className='col-12'>
                            <div className="config-box">
                                <select id="orientation" value={selectedOrientation} onChange={handleOrientationChange} className="custom-select">
                                    <option value="Portrait Orientation">Portrait Orientation</option>
                                    <option value="Landscape Orientation">Landscape Orientation</option>
                                </select>
                            </div>
                        </div>
                        <div className='col-12'>
                            <div className="config-box">
                                <select id="pagesize" value={selectedSizePage} onChange={handleSizePageChange} className="custom-select">
                                    <option value="A4">A4</option>
                                    <option value="A3">A3</option>
                                </select>
                            </div>
                        </div>
                        <div className='col-12'>
                            <div className="config-box">
                                <select id="pagemargin" value={selectedMarginPage} onChange={handleMarginPageChange} className="custom-select">
                                    <option value="Normal Margin">Norml Margin</option>
                                    <option value="Narrow Margin">Narrow Margin</option>
                                    <option value="Moderate Margin">Moderate Margin</option>
                                    <option value="wide Margin">wide Margin</option>
                                    <option value="Mirrored Margin">Mirrored Margin</option>
                                </select>
                            </div>
                        </div>
                        <div className='col-12'>
                            <div className="config-box">
                                <select id="sheetpage" value={selectedSheetPage} onChange={handleSheetPageChange} className="custom-select">
                                    <option value="1 Pages Per Sheet">1 Pages Per Sheet</option>
                                    <option value="2 Pages Per Sheet">2 Pages Per Sheet</option>
                                    <option value="4 Pages Per Sheet">4 Pages Per Sheet</option>
                                    <option value="6 Pages Per Sheet">6 Pages Per Sheet</option>
                                    <option value="8 Pages Per Sheet">8 Pages Per Sheet</option>
                                    <option value="16 Pages Per Sheet">16 Pages Per Sheet</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-sm-6' style={{ textAlign: 'center' }}>
                    <img id='thumbnail-image' className='d-flex' src='../img/pdf.png' alt='thumbnail' />
                </div>
            </div>
        </div>
    );
};

export default ConfigPrint;
