import React from "react";
import PropTypes from "prop-types";
import { Table, Button, Form, Dropdown, DropdownButton } from "react-bootstrap";
import "./GridTable.scss";

import editAction from "../../assets/editAction.svg";

const GridTable = ({
  columns,
  data,
  actions,
  pagination,
  onSearch,
  handleClick,
  buttonTitle,
  showTotal = false,
  total,
  totalOf = "",
}) => {
  return (
    <>
      <div className="grid-container">
        <div className="d-flex justify-content-between align-items-center search-button-container">
          {onSearch && (
            <div className="input-group hdv-col-6">
              <Form.Control
                type="text"
                placeholder="Search by keyword..."
                className="w-50 grid-search"
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          )}
          {(buttonTitle || showTotal) && (
            <div className="cta-container">
              {showTotal && (
                <span className="total-count">
                  {" "}
                  Total {totalOf}: {total}{" "}
                </span>
              )}
              {buttonTitle && (
                <Button variant="primary" onClick={handleClick}>
                  {buttonTitle}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Table */}
        <Table striped borderless responsive className="grid-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
              {actions && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 &&
              data?.map((row, index) => (
                <tr
                  key={index}
                  // onClick={() => handleEditEmployee(row)}
                  className={`${index % 2 === 0 ? "even" : "odd"}`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      onClick={() => (col?.onClick ? col?.onClick(row) : null)}
                      style={
                        col?.onClick
                          ? { cursor: "pointer", color: "#2b6ed3" }
                          : {}
                      }
                    >
                      {row[col.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="action-wrapper">
                      {actions.map((action, actionIndex) => (
                        <React.Fragment key={actionIndex}>
                          {action.label === "Edit" && (
                            <Button
                              key={actionIndex}
                              size="sm"
                              className="action-edit"
                              onClick={() => action?.onClick(row)}
                            >
                              <img src={editAction} alt="Edit Action" />
                            </Button>
                          )}
                          {action.label === "Toggle" && (
                            <div key={`toggle-${actionIndex}`}>
                              <Form.Check
                                type="switch"
                                id="custom-switch"
                                aria-label="Toggle switch"
                                checked={row?.isCurrentEmployee}
                                onChange={() => action?.handleActiveToggle(row)}
                              />
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
      {/* Pagination */}
      {pagination && (
        <div className="d-flex justify-content-between pagination-class">
          <div>
            <span>Show</span>
            <DropdownButton
              variant="outline-secondary"
              size="sm"
              title={pagination.pageSize}
              className="d-inline-block mx-2 show-page"
              onSelect={(value) => pagination.onPageSizeChange(Number(value))}
            >
              {pagination.pageSizes.map((size) => (
                <Dropdown.Item key={size} eventKey={size}>
                  {size}
                </Dropdown.Item>
              ))}
            </DropdownButton>
            <span>entries</span>
          </div>
          <div className="pagination-right-section">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={pagination.onPrevious}
              disabled={pagination.currentPage === 1}
              className="previous"
            >
              Previous
            </Button>
            {Array.from({ length: pagination.totalPages }, (_, i) => (
              <Button
                key={i + 1}
                variant={
                  pagination.currentPage === i + 1
                    ? "primary"
                    : "outline-primary"
                }
                size="sm"
                className="mx-1"
                onClick={() => pagination.onPageChange(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline-primary"
              size="sm"
              onClick={pagination.onNext}
              disabled={pagination.currentPage === pagination.totalPages}
              className="next"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

GridTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      icon: PropTypes.string,
      style: PropTypes.string,
    })
  ),
  pagination: PropTypes.shape({
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
    pageSizes: PropTypes.arrayOf(PropTypes.number),
    pageSize: PropTypes.number,
    onPageChange: PropTypes.func,
    onPageSizeChange: PropTypes.func,
    onPrevious: PropTypes.func,
    onNext: PropTypes.func,
  }),
  onSearch: PropTypes.func,
  buttonTitle: PropTypes.string,
  handleClick: PropTypes.func,
};

export default GridTable;