import { DataGrid } from "@mui/x-data-grid";
import * as React from "react";
import { convertToTimeFormatHHMMSS, sendReq } from "../../../../../service/service.api";
import { API_SERVER, DOMAIN_SERVER } from "../../../../../router/router.server";
import { useMediaQuery } from "@mui/material";

const url_getAllStreamOwner = API_SERVER.GET_ALL_STREAM_OWNER;

const TableIndex = ({ props }) => {
    const [rows, setRows] = React.useState();
    const [columns, setColumn] = React.useState([]);
    const [pagination, setPagination] = React.useState({
        page: 0,
        pageSize: 0
    });

    const isMobile = useMediaQuery("(max-width: 600px)");
    const isTablet = useMediaQuery("(min-width: 601px) and (max-width: 1023px)");
    const isLaptop = useMediaQuery("(min-width: 1024px)");

    React.useEffect(() => {
        const rowsData = props.records.map((items) => ({
            id: items.id,
            image: items.image,
            title: items.title,
            start_time: items.start_time,
            end_time: items.end_time,
            timeLive: items.timeLive,
            totalView: items.totalView
        }));
        setRows(rowsData);
    }, []);

    React.useEffect(() => {
        const colMobile = [
            { field: 'image', headerName: 'Ảnh bìa', display: 'flex', headerAlign: 'center', maxWidth: 150, minWidth: 150, align: 'center', renderCell: (params) => (
                <img
                    src={params.value.startsWith('http')? params.value: `${DOMAIN_SERVER}/${params.value}`}
                    alt="Ảnh bìa"
                    style={{ width: '100px', height: 'auto', objectFit: 'cover', padding: '5px' }}
                />
            )},
            { field: 'title', headerName: 'Tiêu đề', sortable: true, filterable: true, headerAlign: 'center', width: 300}
        ];

        const colTablet = [
            ...colMobile,
            { field: 'timeLive', headerName: 'Thời lượng live', sortable: true, headerAlign: 'center', width: 150, align: 'center', renderCell: (params) => (
                <span>{params.value? convertToTimeFormatHHMMSS(params.value): 'Tạm chưa có'}</span>
            )}
        ]

        const colLaptop = [
            { field: 'id', headerName: 'ID', sortable: true, filterable: true, align: 'center', headerAlign: 'center', width: 20, maxWidth: 20},
            { field: 'image', headerName: 'Ảnh bìa', display: 'flex', headerAlign: 'center', maxWidth: 150, minWidth: 150, align: 'center', renderCell: (params) => (
                <img
                    src={params.value.startsWith('http')? params.value: `${DOMAIN_SERVER}/${params.value}`}
                    alt="Ảnh bìa"
                    style={{ width: '100px', height: 'auto', objectFit: 'cover', padding: '5px' }}
                />
            )},
            { field: 'title', headerName: 'Tiêu đề', sortable: true, filterable: true, headerAlign: 'center', width: 300},
            { field: 'start_time', headerName: 'Bắt đầu live', sortable: true, headerAlign: 'center', width: 180, align: 'center'},
            { field: 'end_time', headerName: 'Kết thúc live', sortable: true, headerAlign: 'center', width: 180, align: 'center', renderCell: (params) => (
                <span>{params.value? params.value: 'Tạm chưa có'}</span>
            )},
            { field: 'timeLive', headerName: 'Thời lượng live', sortable: true, headerAlign: 'center', width: 150, align: 'center', renderCell: (params) => (
                <span>{params.value? convertToTimeFormatHHMMSS(params.value): 'Tạm chưa có'}</span>
            )},
            { field: 'totalView', headerName: 'Lượt xem', sortable: true, headerAlign: 'center', align: 'center'}
        ]

        if(isMobile) setColumn(colMobile);
        if(isTablet) setColumn(colTablet);
        if(isLaptop) setColumn(colLaptop);
    }, [isMobile, isTablet, isLaptop]);

    // const columns = [
    //     { field: 'id', headerName: 'ID', sortable: true, filterable: true, align: 'center', headerAlign: 'center', width: 20, maxWidth: 20},
    //     { field: 'image', headerName: 'Ảnh bìa', display: 'flex', headerAlign: 'center', maxWidth: 150, minWidth: 150, align: 'center', renderCell: (params) => (
    //         <img
    //             src={params.value.startsWith('http')? params.value: `${DOMAIN_SERVER}/${params.value}`}
    //             alt="Ảnh bìa"
    //             style={{ width: '100px', height: 'auto', objectFit: 'cover', padding: '5px' }}
    //         />
    //     )},
    //     { field: 'title', headerName: 'Tiêu đề', sortable: true, filterable: true, headerAlign: 'center', width: 300},
    //     { field: 'start_time', headerName: 'Bắt đầu live', sortable: true, headerAlign: 'center', width: 180, align: 'center'},
    //     { field: 'end_time', headerName: 'Kết thúc live', sortable: true, headerAlign: 'center', width: 180, align: 'center', renderCell: (params) => (
    //         <span>{params.value? params.value: 'Tạm chưa có'}</span>
    //     )},
    //     { field: 'timeLive', headerName: 'Thời lượng live', sortable: true, headerAlign: 'center', width: 150, align: 'center', renderCell: (params) => (
    //         <span>{params.value? convertToTimeFormatHHMMSS(params.value): 'Tạm chưa có'}</span>
    //     )},
    //     { field: 'totalView', headerName: 'Lượt xem', sortable: true, headerAlign: 'center', align: 'center'}
    // ]

    const fetchData = async (page) => {
        try {
            const url = url_getAllStreamOwner.replace(':page', page);
            const response = await sendReq(url, {
                    method: "GET",
                }
            );
    
            if (!response.ok) {
                throw new Error(`Error fetching data: ${response.statusText}`);
            }
    
            const data = await response.json();
    
            return {
                records: data.records,
            };
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        }
    };

    const loadData = async (page) => {
        try {
            const result = await fetchData(page + 1);
            setRows(result.records);
        } catch (error) {
            console.error(error);
        }
    };

    React.useEffect(() => {
        loadData(pagination.page, pagination.pageSize);
    }, [pagination.page, pagination.pageSize]);

    const handlePaginationChange = (paginationModel) => {
        setPagination({
            page: paginationModel.page,
            pageSize: paginationModel.pageSize
        })
    };

    return(
        <DataGrid
            rows={rows}
            columns={columns}
            paginationModel={{
                page: pagination.page===0? props.pageCurrent - 1: pagination.page,
                pageSize: pagination.pageSize===0? props.recordsOfPage: pagination.pageSize
            }}
            paginationMode="server"
            rowCount={props.totalStream}
            onPaginationModelChange={handlePaginationChange}
            pagination={true}
        />
    )
}

export default TableIndex;