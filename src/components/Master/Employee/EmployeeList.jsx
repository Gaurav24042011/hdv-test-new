import React, { useState, useEffect } from "react";
import GridTable from "../../../element/Grid/GridTable";

import { API_ROUTE, API_SUCCESS_CODE } from "../../../const/common";
import { getApiData, postApiData } from "../../../utils/axios-utility";

import { logInfo } from "../../../utils/log-util";
import { useLoader } from "../../../hooks/useLoader";
import { Loader } from "../../../element/Loader/Loader";

import {
  useGlobalDispatch,
  useGlobalState,
} from "../../../context/GlobalProvider";

import AddEditEmployee from "./AddEditEmployee";

import { SET_ALL_EMPLOYEE_LIST } from "../../../const/actionTypes";

const initailRecordCount = 6;

const EmployeeList = () => {
  const { allEmployeeList } = useGlobalState();
  const dispatch = useGlobalDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState(allEmployeeList);
  const [loading, setLoading] = useState(false);
  const [apiError, setApirError] = useState("");
  const [isCurrentEmployee, setIsCurrentEmployeee] = useState(false);
  const [addEditSuccess, setAddEditSuccess] = useState(false);
  const [addEmployee, setAddEmployee] = useState(false);
  const [showEmployeeDetails, setShowEmployeeDetails] = useState({
    showDetail: false,
    empData: {},
  });
  const [editEmployee, setEditEmployee] = useState({
    edit: false,
    empData: {},
  });

  useLoader(setLoading);

  const handleActiveToggle = async (row) => {
    try {
      const resp = await postApiData({
        url: `${API_ROUTE.DEACTIVATE_EMPLOYEE}?id=${row.id}&isActive=${!row?.isCurrentEmployee}`,
      });
      if (resp.status === API_SUCCESS_CODE) {
        setIsCurrentEmployeee(!row?.isCurrentEmployee);
        fetchAllEmployeeData();
      } else {
        setApirError(resp?.message || "");
        setIsCurrentEmployeee(row?.isCurrentEmployee);
      }
    } catch (error) {
      setApirError(API_NETWORK_ERROR);
      setIsCurrentEmployeee(row?.isCurrentEmployee);
      logError("Error calling API:", error);
    }
  };
  const fetchAllEmployeeData = async () => {
    try {
      const resp = await getApiData({
        url: API_ROUTE.GET_ALL_EMPLOYEE,
      });
      if (resp.status === API_SUCCESS_CODE) {
        setAllData(resp?.data);
        setData(resp?.data?.slice(0, initailRecordCount));
        dispatch({
          type: SET_ALL_EMPLOYEE_LIST,
          payload: { employees: resp?.data },
        });
      }
    } catch (error) {
      logInfo("Error calling API:", error);
    }
  };

  useEffect(() => {
    if (allEmployeeList?.length === 0) fetchAllEmployeeData();
    else {
      setAllData(allEmployeeList);
      setData(allEmployeeList?.slice(0, initailRecordCount));
    }
  }, []);

  useEffect(() => {
    if (addEditSuccess) {
      fetchAllEmployeeData();

      setAddEditSuccess(false);
    }
  }, [addEditSuccess]);

  const handleSearch = (keyword) => {
    const filteredData = allData?.filter((item) =>
      Object.values(item).some((val) =>
        val?.toString()?.toLowerCase()?.includes(keyword?.toLowerCase())
      )
    );
    setData(filteredData.slice(0, pageSize));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const startIndex = (page - 1) * pageSize;
    setData(allData?.slice(startIndex, startIndex + pageSize));
  };

  const handleShowEmployee = (data) => {
    setShowEmployeeDetails({ showDetail: true, empData: data });
  };

  const handleActionComplete = () => {
    setAddEmployee(false);
    setEditEmployee({ edit: false, empData: {} });
    setShowEmployeeDetails({ showDetail: false, empData: {} });

  };

  const handleOperationSuccess = () => {
    setAddEditSuccess(true);
    setAddEmployee(false);
    setEditEmployee({ edit: false, empData: {} });
  };

  const handleEditEmployee = (row) => {
    setEditEmployee({ edit: true, empData: row });
  };

  const actions = [
    {
      label: "Edit",
      onClick: (row) => {
        handleEditEmployee(row);
      },
    },
    {
      label: "Toggle",
      handleActiveToggle,
      isCurrentEmployee,
    },
  ];
  const columns = [
    { key: "empCode", label: "Employee Code",onClick: (row) => {handleShowEmployee(row)}  },
    { key: "empName", label: "Name" },
    { key: "mobileNumber", label: "Mobile Number" },
    { key: "roleName", label: "Designation" },
    { key: "status", label: "Status" },
  ];

  const pagination = {
    currentPage,
    totalPages: Math.ceil(allData?.length / pageSize),
    pageSizes: [6, 10, 15],
    pageSize,
    onPageChange: handlePageChange,
    onPageSizeChange: (size) => {
      setPageSize(size);
      setCurrentPage(1);
      setData(allData?.slice(0, size));
    },
    onPrevious: () => handlePageChange(currentPage - 1),
    onNext: () => handlePageChange(currentPage + 1),
  };

  return (
    <div>
      {addEmployee || editEmployee.edit || showEmployeeDetails.showDetail ? (
        <AddEditEmployee
          handleOperationSuccess={handleOperationSuccess}
          handleActionComplete={handleActionComplete}
          isEditPage={editEmployee.edit}
          isAddEmployeePage={addEmployee}
          employeeData={
            editEmployee.edit
              ? editEmployee.empData
              : showEmployeeDetails.showDetail
                ? showEmployeeDetails.empData
                : {}
          }
          showEmployeeDetails={showEmployeeDetails.showDetail}
        />
      ) : (
        <>
          {loading && <Loader />}
          <GridTable
            columns={columns}
            data={data}
            actions={actions}
            pagination={
              allData?.length > initailRecordCount ? pagination : null
            }
            onSearch={handleSearch}
            buttonTitle={"Add Employee"}
            handleClick={() => setAddEmployee(true)}
            handleEditEmployee={handleEditEmployee}
            handleShowEmployee={handleShowEmployee}
            showTotal={true}
            total={allData?.length}
            totalOf={"Employees"}
          />
        </>
      )}
    </div>
  );
};

export default EmployeeList;
